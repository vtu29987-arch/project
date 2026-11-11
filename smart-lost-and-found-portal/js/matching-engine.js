/**
 * Smart Lost and Found Matching Engine (S.L.F.P.)
 * Evaluates semantic keywords, category concordance, campus location proximity,
 * and date delta to calculate similarity percentages between Lost and Found reports.
 */

class SmartMatchingEngine {
  constructor() {
    this.STOP_WORDS = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at',
      'to', 'for', 'of', 'with', 'by', 'from', 'near', 'left', 'found', 'lost', 'item',
      'items', 'has', 'have', 'had', 'some', 'any', 'my', 'your', 'their', 'very', 'this',
      'that', 'these', 'those', 'please', 'help', 'contact', 'room', 'floor', 'desk'
    ]);
  }

  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.STOP_WORDS.has(word));
  }

  calculateTextSimilarity(tokensA, tokensB) {
    if (tokensA.length === 0 || tokensB.length === 0) return 0;
    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    
    let intersection = 0;
    setA.forEach(t => {
      if (setB.has(t)) intersection++;
    });

    const union = new Set([...setA, ...setB]).size;
    return union > 0 ? (intersection / union) : 0;
  }

  calculateLocationProximity(locA, locB) {
    if (!locA || !locB) return 0.2;
    const normA = locA.toLowerCase();
    const normB = locB.toLowerCase();
    
    if (normA === normB) return 1.0;

    const tokensA = this.tokenize(normA);
    const tokensB = this.tokenize(normB);
    const intersection = tokensA.filter(t => tokensB.includes(t)).length;

    if (intersection >= 2) return 0.9;
    if (intersection === 1) return 0.6;
    return 0.1;
  }

  calculateDatePlausibility(dateLost, dateFound) {
    if (!dateLost || !dateFound) return 0.5;
    const dLost = new Date(dateLost);
    const dFound = new Date(dateFound);
    
    const diffTime = dFound - dLost;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // A found item found on or within 7 days after the lost date is very plausible
    if (diffDays >= 0 && diffDays <= 2) return 1.0;
    if (diffDays >= 0 && diffDays <= 7) return 0.8;
    if (diffDays >= 0 && diffDays <= 14) return 0.6;
    if (diffDays < 0 && diffDays >= -2) return 0.5; // reported lost a day or two after it was actually found
    return 0.2;
  }

  computeMatchScore(itemA, itemB) {
    // Only compare opposite types: lost vs found
    if (itemA.type === itemB.type) return { score: 0, reasons: [] };

    let totalScore = 0;
    const reasons = [];

    // 1. Category Concordance (35% weight)
    if (itemA.category === itemB.category) {
      totalScore += 35;
      reasons.push(`Matching Category: ${itemA.category}`);
    } else {
      // partial category match (e.g. accessories vs electronics)
      return { score: 0, reasons: [] }; // mismatched categories rarely match
    }

    // 2. Title & Description Keyword Overlap (40% weight)
    const titleTokensA = this.tokenize(itemA.title);
    const titleTokensB = this.tokenize(itemB.title);
    const titleSim = this.calculateTextSimilarity(titleTokensA, titleTokensB);

    const descTokensA = this.tokenize(itemA.description);
    const descTokensB = this.tokenize(itemB.description);
    const descSim = this.calculateTextSimilarity(descTokensA, descTokensB);

    const textSimScore = (titleSim * 0.65 + descSim * 0.35) * 40;
    totalScore += textSimScore;

    const matchedKeywords = titleTokensA.filter(t => titleTokensB.includes(t) || descTokensB.includes(t));
    if (matchedKeywords.length > 0) {
      reasons.push(`Key terms in common: "${matchedKeywords.slice(0, 3).join(', ')}"`);
    }

    // 3. Location Proximity (15% weight)
    const locProx = this.calculateLocationProximity(itemA.location, itemB.location);
    totalScore += locProx * 15;
    if (locProx >= 0.6) {
      reasons.push('Reported in the same campus zone / building');
    }

    // 4. Date Plausibility (10% weight)
    const lostDate = itemA.type === 'lost' ? itemA.date : itemB.date;
    const foundDate = itemA.type === 'found' ? itemA.date : itemB.date;
    const dateScore = this.calculateDatePlausibility(lostDate, foundDate) * 10;
    totalScore += dateScore;

    const finalScore = Math.min(Math.round(totalScore), 100);

    return {
      score: finalScore,
      confidence: finalScore >= 75 ? 'high' : (finalScore >= 50 ? 'medium' : 'low'),
      reasons
    };
  }

  findMatchesForItem(targetItem, minScore = 40) {
    if (!targetItem) return [];
    const allItems = window.store ? window.store.getItems() : [];
    
    // Opposites: if target is lost, look for found; if found, look for lost
    const candidateType = targetItem.type === 'lost' ? 'found' : 'lost';
    const candidates = allItems.filter(i => i.type === candidateType && i.id !== targetItem.id);

    const results = [];

    candidates.forEach(candidate => {
      const { score, confidence, reasons } = this.computeMatchScore(targetItem, candidate);
      if (score >= minScore) {
        results.push({
          targetItem,
          matchedItem: candidate,
          score,
          confidence,
          reasons
        });
      }
    });

    // Sort by highest score first
    results.sort((a, b) => b.score - a.score);
    return results;
  }

  getAllPotentialMatches(minScore = 50) {
    const allItems = window.store ? window.store.getItems() : [];
    const lostItems = allItems.filter(i => i.type === 'lost' && i.status !== 'recovered');
    const matches = [];
    const seenPairs = new Set();

    lostItems.forEach(lost => {
      const candidates = this.findMatchesForItem(lost, minScore);
      candidates.forEach(cand => {
        const pairKey = [lost.id, cand.matchedItem.id].sort().join('::');
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          matches.push(cand);
        }
      });
    });

    return matches.sort((a, b) => b.score - a.score);
  }
}

// Global instance
window.matchingEngine = new SmartMatchingEngine();
