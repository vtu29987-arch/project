/**
 * Search Component
 * Advanced multi-criteria search and filter interface for Lost and Found items.
 */

class SearchComponent {
  constructor() {
    this.keyword = '';
    this.selectedCategory = 'all';
    this.selectedLocation = 'all';
    this.selectedStatus = 'all'; // 'all' | 'lost' | 'found'
    this.selectedDateRange = 'all'; // 'all' | 'today' | '7days' | '30days'
    this.sortBy = 'newest'; // 'newest' | 'oldest'
  }

  setKeyword(kw) {
    this.keyword = kw;
    const input = document.getElementById('search-keyword-input');
    if (input) input.value = kw;
    this.filterAndRender();
  }

  resetFilters() {
    this.keyword = '';
    this.selectedCategory = 'all';
    this.selectedLocation = 'all';
    this.selectedStatus = 'all';
    this.selectedDateRange = 'all';
    this.sortBy = 'newest';

    const kwInput = document.getElementById('search-keyword-input');
    if (kwInput) kwInput.value = '';
    const catSelect = document.getElementById('filter-category');
    if (catSelect) catSelect.value = 'all';
    const locSelect = document.getElementById('filter-location');
    if (locSelect) locSelect.value = 'all';
    const dateSelect = document.getElementById('filter-date');
    if (dateSelect) dateSelect.value = 'all';

    this.setStatusFilter('all');
  }

  setStatusFilter(status) {
    this.selectedStatus = status;
    document.querySelectorAll('.status-pill-btn').forEach(btn => {
      const active = btn.getAttribute('data-status') === status;
      btn.className = `status-pill-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${
        active 
          ? (status === 'lost' ? 'bg-rose-500 text-white shadow-sm' : (status === 'found' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-900 text-white shadow-sm'))
          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
      }`;
    });
    this.filterAndRender();
  }

  filterAndRender() {
    const grid = document.getElementById('search-results-grid');
    const countBadge = document.getElementById('search-results-count');
    if (!grid) return;

    let items = window.store ? window.store.getItems() : [];

    // Filter by Keyword
    if (this.keyword.trim()) {
      const kw = this.keyword.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(kw) ||
        item.description.toLowerCase().includes(kw) ||
        item.location.toLowerCase().includes(kw) ||
        item.refCode.toLowerCase().includes(kw) ||
        item.category.toLowerCase().includes(kw)
      );
    }

    // Filter by Type (Lost / Found)
    if (this.selectedStatus !== 'all') {
      items = items.filter(item => item.type === this.selectedStatus);
    }

    // Filter by Category
    if (this.selectedCategory !== 'all') {
      items = items.filter(item => item.category === this.selectedCategory);
    }

    // Filter by Location
    if (this.selectedLocation !== 'all') {
      items = items.filter(item => item.location.toLowerCase().includes(this.selectedLocation.toLowerCase()));
    }

    // Filter by Date Range
    if (this.selectedDateRange !== 'all') {
      const now = new Date();
      items = items.filter(item => {
        const itemDate = new Date(item.date);
        const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
        if (this.selectedDateRange === 'today') return diffDays <= 1;
        if (this.selectedDateRange === '7days') return diffDays <= 7;
        if (this.selectedDateRange === '30days') return diffDays <= 30;
        return true;
      });
    }

    // Sort items
    if (this.sortBy === 'newest') {
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (this.sortBy === 'oldest') {
      items.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (countBadge) {
      countBadge.innerText = `${items.length} ${items.length === 1 ? 'item' : 'items'} found`;
    }

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8">
          <div class="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
            <i data-lucide="search-x" class="w-8 h-8"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900 heading-font mb-2">No Matching Belongings Found</h3>
          <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            We couldn't find any items matching your active search filters. Try adjusting keywords, removing category restrictions, or post a new report.
          </p>
          <div class="flex items-center justify-center gap-3">
            <button onclick="window.searchComponent.resetFilters()" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">
              Reset All Filters
            </button>
            <a href="#report-lost" class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors">
              Report Missing Item
            </a>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    grid.innerHTML = items.map(item => `
      <div class="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover-lift overflow-hidden flex flex-col transition-all">
        
        <!-- Image & Top Overlay Badges -->
        <div class="relative h-48 overflow-hidden bg-slate-100">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>

          <div class="absolute top-3 left-3 flex items-center gap-1.5">
            <span class="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
              item.type === 'lost' 
                ? 'bg-rose-500 text-white' 
                : 'bg-emerald-600 text-white'
            }">
              ${item.type === 'lost' ? '● Lost' : '● Found'}
            </span>

            ${item.status === 'recovered' ? `
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm flex items-center gap-1">
                <i data-lucide="check" class="w-3 h-3"></i> Recovered
              </span>
            ` : (item.status === 'claim_pending' ? `
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                <i data-lucide="clock" class="w-3 h-3"></i> Claim Pending
              </span>
            ` : '')}
          </div>

          <div class="absolute bottom-2.5 left-3 text-white text-xs font-semibold drop-shadow flex items-center gap-1">
            <i data-lucide="tag" class="w-3.5 h-3.5 text-sky-300"></i>
            ${item.category}
          </div>
        </div>

        <!-- Content Details -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span class="font-mono text-slate-500 font-medium">${item.refCode}</span>
              <span class="flex items-center gap-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                ${item.date}
              </span>
            </div>

            <h4 class="font-bold text-slate-900 text-base group-hover:text-sky-600 transition-colors line-clamp-1 mb-2">
              ${item.title}
            </h4>

            <p class="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
              ${item.description}
            </p>
          </div>

          <div>
            <div class="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl mb-4">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-sky-600 shrink-0"></i>
              <span class="truncate">${item.location}</span>
            </div>

            <button onclick="window.itemDetailsComponent.show('${item.id}')" class="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-sky-500/20">
              <span>View Details & Claim</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>

      </div>
    `).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  render() {
    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
        
        <!-- Header & Search Banner -->
        <div class="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div class="max-w-3xl space-y-3 mb-6">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              <i data-lucide="database" class="w-3.5 h-3.5"></i>
              Campus Directory & Database
            </span>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight heading-font">
              Search Lost & Found Belongings
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Use smart filters, location criteria, and category tags to find or match any misplaced belonging.
            </p>
          </div>

          <!-- Main Search Input Field -->
          <div class="relative">
            <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
            <input 
              type="text" 
              id="search-keyword-input"
              value="${this.keyword}"
              placeholder="Search by keywords, item title, reference code (#SLFP-...), or description..." 
              oninput="window.searchComponent.keyword = this.value; window.searchComponent.filterAndRender();"
              class="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/30 shadow-lg"
            >
          </div>
        </div>


        <!-- Filter Controls Bar -->
        <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-4">
            
            <!-- Status Pills (All / Lost / Found) -->
            <div class="flex items-center gap-2">
              <button 
                data-status="all" 
                onclick="window.searchComponent.setStatusFilter('all')" 
                class="status-pill-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.selectedStatus === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
              >
                All Status
              </button>
              <button 
                data-status="lost" 
                onclick="window.searchComponent.setStatusFilter('lost')" 
                class="status-pill-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.selectedStatus === 'lost' ? 'bg-rose-500 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
              >
                Lost Items
              </button>
              <button 
                data-status="found" 
                onclick="window.searchComponent.setStatusFilter('found')" 
                class="status-pill-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.selectedStatus === 'found' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
              >
                Found Items
              </button>
            </div>

            <!-- Results Counter & Reset Button -->
            <div class="flex items-center gap-3">
              <span id="search-results-count" class="text-xs font-bold text-slate-500">
                Loading results...
              </span>
              <button onclick="window.searchComponent.resetFilters()" class="text-xs text-sky-600 hover:text-sky-700 font-bold hover:underline flex items-center gap-1">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                Reset
              </button>
            </div>
          </div>

          <!-- Secondary Filters Row (Category, Location, Date, Sort) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            
            <!-- Category Filter -->
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
              <select 
                id="filter-category" 
                onchange="window.searchComponent.selectedCategory = this.value; window.searchComponent.filterAndRender();" 
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Categories</option>
                ${CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>

            <!-- Location Filter -->
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Campus Zone</label>
              <select 
                id="filter-location" 
                onchange="window.searchComponent.selectedLocation = this.value; window.searchComponent.filterAndRender();" 
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All Locations</option>
                ${LOCATIONS.map(l => `<option value="${l}">${l}</option>`).join('')}
              </select>
            </div>

            <!-- Date Filter -->
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Time Range</label>
              <select 
                id="filter-date" 
                onchange="window.searchComponent.selectedDateRange = this.value; window.searchComponent.filterAndRender();" 
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">Any Date</option>
                <option value="today">Today / Last 24 Hours</option>
                <option value="7days">Past 7 Days</option>
                <option value="30days">Past 30 Days</option>
              </select>
            </div>

            <!-- Sort By -->
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sort Order</label>
              <select 
                id="filter-sort" 
                onchange="window.searchComponent.sortBy = this.value; window.searchComponent.filterAndRender();" 
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="newest">Newest Reported First</option>
                <option value="oldest">Oldest Reported First</option>
              </select>
            </div>

          </div>
        </div>


        <!-- Search Results Grid -->
        <div id="search-results-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Populated by filterAndRender() -->
        </div>

      </div>
    `;
  }
}

window.searchComponent = new SearchComponent();
