/**
 * Item Details Component
 * Complete detail modal/view with item specifications, reporter info,
 * claim trigger, poster generation trigger, and Smart Match recommendations.
 */

class ItemDetailsComponent {
  constructor() {}

  show(itemId) {
    const item = window.store ? window.store.getItemById(itemId) : null;
    if (!item) {
      alert('Item not found.');
      return;
    }

    // Increment view count
    window.store.incrementItemViews(itemId);

    let modal = document.getElementById('item-details-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'item-details-modal';
      document.body.appendChild(modal);
    }

    const isLost = item.type === 'lost';
    const matches = window.matchingEngine ? window.matchingEngine.findMatchesForItem(item, 40) : [];
    const claims = window.store.getClaimsForItem(item.id);

    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
        
        <div class="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
          
          <!-- Modal Top Bar -->
          <div class="p-4 sm:p-6 pb-0 flex items-center justify-between border-b border-slate-100/80">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isLost ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
              }">
                ● ${isLost ? 'Lost Item Report' : 'Found Item Report'}
              </span>
              <span class="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                ${item.refCode}
              </span>
              ${item.status === 'recovered' ? `
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1">
                  <i data-lucide="check" class="w-3.5 h-3.5"></i> Recovered
                </span>
              ` : (item.status === 'claim_pending' ? `
                <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1">
                  <i data-lucide="clock" class="w-3.5 h-3.5"></i> Claim Pending
                </span>
              ` : '')}
            </div>

            <button onclick="window.itemDetailsComponent.close()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Modal Scrollable Content -->
          <div class="p-6 sm:p-8 overflow-y-auto space-y-6">
            
            <!-- Hero Image & Title Block -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              <div class="md:col-span-5 relative rounded-2xl overflow-hidden bg-slate-100 shadow-md aspect-square">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
              </div>

              <div class="md:col-span-7 space-y-4">
                <div class="flex items-center gap-2 text-xs font-semibold text-sky-600">
                  <i data-lucide="tag" class="w-4 h-4"></i>
                  <span>${item.category}</span>
                </div>

                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font leading-tight">
                  ${item.title}
                </h2>

                <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  ${item.description}
                </p>

                <!-- Metadata Grid -->
                <div class="grid grid-cols-2 gap-3 pt-2">
                  <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      ${isLost ? 'Date Lost' : 'Date Found'}
                    </div>
                    <div class="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <i data-lucide="calendar" class="w-3.5 h-3.5 text-sky-600"></i>
                      ${item.date}
                    </div>
                  </div>

                  <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Campus Location
                    </div>
                    <div class="text-xs font-bold text-slate-800 flex items-center gap-1 truncate" title="${item.location}">
                      <i data-lucide="map-pin" class="w-3.5 h-3.5 text-sky-600 shrink-0"></i>
                      <span class="truncate">${item.location}</span>
                    </div>
                  </div>
                </div>

                ${item.safeLocation ? `
                  <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-2.5">
                    <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i>
                    <div>
                      <div class="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Safe-Keeping Custody</div>
                      <div class="text-xs text-emerald-800 font-semibold">${item.safeLocation}</div>
                    </div>
                  </div>
                ` : ''}

              </div>
            </div>


            <!-- Reporter Profile & Verification Security -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                  <i data-lucide="user" class="w-5 h-5"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Reported by: ${item.reportedBy.name}</span>
                    <span class="px-1.5 py-0.2 bg-sky-100 text-sky-800 rounded text-[10px] font-semibold">Verified Member</span>
                  </div>
                  <div class="text-[11px] text-slate-500">Contact: ${item.reportedBy.phone || item.reportedBy.email}</div>
                </div>
              </div>

              <div class="text-right text-[11px] text-slate-400">
                Logged on ${new Date(item.createdAt).toLocaleDateString()} • ${item.views} Views
              </div>
            </div>


            <!-- Smart AI Match Engine Recommendations -->
            ${matches.length > 0 ? `
              <div class="p-5 rounded-3xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-sm">
                      <i data-lucide="sparkles" class="w-4 h-4"></i>
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900">Smart AI Match Recommendations</h4>
                      <p class="text-[10px] text-slate-500">Our algorithm found potential matches in the portal:</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-200 text-sky-900">
                    ${matches.length} Match Available
                  </span>
                </div>

                <div class="space-y-2">
                  ${matches.slice(0, 2).map(m => `
                    <div class="p-3 bg-white rounded-2xl border border-sky-100 shadow-sm flex items-center justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <img src="${m.matchedItem.image}" class="w-12 h-12 rounded-xl object-cover shrink-0">
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-slate-900">${m.matchedItem.title}</span>
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.score >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                            }">
                              ${m.score}% Match
                            </span>
                          </div>
                          <div class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <i data-lucide="map-pin" class="w-3 h-3 text-sky-500"></i>
                            ${m.matchedItem.location}
                          </div>
                        </div>
                      </div>

                      <button onclick="window.itemDetailsComponent.show('${m.matchedItem.id}')" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold shrink-0 transition-colors">
                        Inspect
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

          </div>


          <!-- Modal Bottom Action Bar -->
          <div class="p-4 sm:p-6 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <!-- Printable Poster Button -->
              <button onclick="window.posterModal.show('${item.id}')" class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors" title="Generate printable campus notice">
                <i data-lucide="printer" class="w-4 h-4 text-slate-500"></i>
                <span>Print Poster</span>
              </button>

              <!-- Share Button -->
              <button onclick="navigator.clipboard?.writeText(window.location.origin + '#item/' + '${item.id}'); window.app.showToast('Item link copied to clipboard!');" class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                <i data-lucide="share-2" class="w-4 h-4 text-slate-500"></i>
                <span>Share</span>
              </button>
            </div>

            <!-- Primary Action: Claim or Found Notice -->
            <div class="w-full sm:w-auto flex items-center gap-2">
              ${!isLost && item.status !== 'recovered' ? `
                <button onclick="window.itemDetailsComponent.close(); window.claimModal.show('${item.id}')" class="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]">
                  <i data-lucide="shield-check" class="w-4 h-4"></i>
                  <span>Claim This Item (Prove Ownership)</span>
                </button>
              ` : (isLost && item.status !== 'recovered' ? `
                <button onclick="window.itemDetailsComponent.close(); window.claimModal.showFoundReport('${item.id}')" class="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.02]">
                  <i data-lucide="check-circle" class="w-4 h-4"></i>
                  <span>I Found This Belonging!</span>
                </button>
              ` : `
                <div class="px-4 py-2 rounded-xl bg-green-100 text-green-800 text-xs font-bold flex items-center gap-1.5">
                  <i data-lucide="check" class="w-4 h-4"></i>
                  This item has already been recovered and safely returned.
                </div>
              `)}
            </div>

          </div>

        </div>

      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  close() {
    const modal = document.getElementById('item-details-modal');
    if (modal) modal.remove();
  }
}

window.itemDetailsComponent = new ItemDetailsComponent();
