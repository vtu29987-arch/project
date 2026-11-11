/**
 * Home View Component
 * Landing page containing Hero, Stats Banner, Quick CTAs, Recent Items,
 * How It Works, Features & Safety, About Us, and Footer.
 */

class HomeComponent {
  constructor() {
    this.filterTab = 'all'; // 'all' | 'lost' | 'found'
  }

  setFilterTab(tab) {
    this.filterTab = tab;
    this.renderRecentItems();
  }

  renderRecentItems() {
    const listContainer = document.getElementById('recent-items-grid');
    if (!listContainer) return;

    const allItems = window.store ? window.store.getItems() : [];
    let filtered = allItems;
    if (this.filterTab === 'lost') {
      filtered = allItems.filter(i => i.type === 'lost');
    } else if (this.filterTab === 'found') {
      filtered = allItems.filter(i => i.type === 'found');
    }

    const recent = filtered.slice(0, 6);

    if (recent.length === 0) {
      listContainer.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200">
          <i data-lucide="package-open" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
          <p class="text-slate-600 font-medium">No recent items in this category.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    listContainer.innerHTML = recent.map(item => `
      <div class="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover-lift overflow-hidden flex flex-col transition-all">
        
        <!-- Image & Badges -->
        <div class="relative h-48 overflow-hidden bg-slate-100">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
          
          <div class="absolute top-3 left-3 flex items-center gap-1.5">
            <span class="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
              item.type === 'lost' 
                ? 'bg-rose-500 text-white' 
                : 'bg-emerald-600 text-white'
            }">
              ${item.type === 'lost' ? '● Lost Item' : '● Found Item'}
            </span>
            ${item.status === 'recovered' ? `
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm flex items-center gap-1">
                <i data-lucide="check" class="w-3 h-3"></i> Recovered
              </span>
            ` : ''}
          </div>

          <div class="absolute bottom-2.5 left-3 text-white text-xs font-semibold drop-shadow flex items-center gap-1">
            <i data-lucide="tag" class="w-3.5 h-3.5 text-sky-300"></i>
            ${item.category}
          </div>
        </div>

        <!-- Content -->
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
    const stats = window.store ? window.store.getStats() : { totalLost: 0, totalFound: 0, recovered: 0, recoveryRate: 0 };

    return `
      <div class="animate-fade-in space-y-20 pb-16">
        
        <!-- Hero Section -->
        <section class="relative pt-12 pb-20 hero-gradient rounded-b-[40px] overflow-hidden border-b border-sky-100">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <!-- Left Hero Content -->
              <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-bold shadow-sm">
                  <span class="w-2 h-2 rounded-full bg-sky-600 animate-ping"></span>
                  Official Campus Lost & Found Network
                </div>

                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] heading-font">
                  Lost Something? <br>
                  <span class="bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
                    Let's Help You Find It!
                  </span>
                </h1>

                <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  The centralized, secure smart portal connecting campus students, faculty, and staff. Report lost belongings, log found items, and recover your valuables safely through automated matching and verified claims.
                </p>

                <!-- Dual Action Hero Buttons -->
                <div class="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <a href="#report-lost" class="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-rose-600/30 hover:scale-[1.02] transition-all">
                    <i data-lucide="minus-circle" class="w-5 h-5"></i>
                    <span>Report Lost Item</span>
                  </a>

                  <a href="#report-found" class="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition-all">
                    <i data-lucide="plus-circle" class="w-5 h-5"></i>
                    <span>Report Found Item</span>
                  </a>

                  <a href="#search" class="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-sm transition-all">
                    <i data-lucide="search" class="w-4 h-4 text-sky-600"></i>
                    <span>Browse All</span>
                  </a>
                </div>

                <!-- Quick Hero Search Input -->
                <div class="pt-4 max-w-xl mx-auto lg:mx-0">
                  <div class="relative flex items-center">
                    <i data-lucide="search" class="absolute left-4 w-5 h-5 text-slate-400"></i>
                    <input 
                      type="text" 
                      id="hero-quick-search"
                      placeholder="Quick search: 'iPhone', 'Keys', 'Backpack', 'Calculator'..." 
                      onkeydown="if(event.key==='Enter'){ window.location.hash='#search'; setTimeout(() => window.searchComponent.setKeyword(this.value), 100); }"
                      class="w-full pl-12 pr-28 py-3.5 bg-white/95 rounded-2xl border border-slate-200 shadow-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                    <button 
                      onclick="const val = document.getElementById('hero-quick-search').value; window.location.hash='#search'; setTimeout(() => window.searchComponent.setKeyword(val), 100);"
                      class="absolute right-2 px-4 py-2 bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>

                <!-- Trust indicators -->
                <div class="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                  <div class="flex items-center gap-1.5">
                    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i>
                    <span>Campus Security Verified</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <i data-lucide="zap" class="w-4 h-4 text-amber-500"></i>
                    <span>AI Smart Match Engine</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <i data-lucide="lock" class="w-4 h-4 text-sky-500"></i>
                    <span>Zero Data Misuse</span>
                  </div>
                </div>

              </div>

              <!-- Right Hero Interactive Card / Visual -->
              <div class="lg:col-span-5">
                <div class="relative max-w-md mx-auto">
                  <div class="absolute -top-6 -left-6 w-32 h-32 bg-sky-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
                  <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
                  
                  <div class="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/80 space-y-5">
                    <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                          <i data-lucide="sparkles" class="w-5 h-5"></i>
                        </div>
                        <div>
                          <h3 class="font-bold text-slate-900 text-sm">Smart AI Match Engine</h3>
                          <p class="text-xs text-slate-500">Live campus activity detection</p>
                        </div>
                      </div>
                      <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 animate-pulse">
                        Active Live
                      </span>
                    </div>

                    <!-- Highlighted Sample Match Notification -->
                    <div class="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50/50 border border-sky-100 space-y-3">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-sky-800 flex items-center gap-1">
                          <i data-lucide="target" class="w-4 h-4 text-sky-600"></i>
                          94% Match Probability
                        </span>
                        <span class="text-[10px] text-slate-400">Just now</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <img src="./assets/images/iphone.svg" class="w-12 h-12 rounded-xl object-cover">
                        <div class="text-xs">
                          <div class="font-bold text-slate-800">Midnight Blue iPhone 13 Pro</div>
                          <div class="text-slate-500">Lost: Library Study Cubicle</div>
                          <div class="text-emerald-600 font-semibold mt-0.5">Found at: Library Journal Desk</div>
                        </div>
                      </div>
                      <a href="#item/item-002" class="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors">
                        Review Match & Verify Claim
                      </a>
                    </div>

                    <!-- Campus Recovery Progress -->
                    <div class="space-y-2 pt-2">
                      <div class="flex justify-between text-xs font-semibold">
                        <span class="text-slate-600">Campus Recovery Rate</span>
                        <span class="text-sky-600 font-bold">${stats.recoveryRate}% Resolved</span>
                      </div>
                      <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full" style="width: ${stats.recoveryRate}%"></div>
                      </div>
                      <div class="flex justify-between text-[11px] text-slate-400 pt-1">
                        <span>${stats.recovered} Recovered Items</span>
                        <span>${stats.totalItems} Total Logged</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        <!-- Statistics Counter Banner -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div class="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <i data-lucide="help-circle" class="w-7 h-7"></i>
              </div>
              <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font">${stats.totalLost}</div>
                <div class="text-xs sm:text-sm font-semibold text-slate-500">Lost Items Reported</div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <i data-lucide="check-circle-2" class="w-7 h-7"></i>
              </div>
              <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font">${stats.totalFound}</div>
                <div class="text-xs sm:text-sm font-semibold text-slate-500">Found Items Logged</div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <i data-lucide="shield-check" class="w-7 h-7"></i>
              </div>
              <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font">${stats.recovered}</div>
                <div class="text-xs sm:text-sm font-semibold text-slate-500">Items Returned Safely</div>
              </div>
            </div>

            <div class="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <i data-lucide="activity" class="w-7 h-7"></i>
              </div>
              <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font">${stats.recoveryRate}%</div>
                <div class="text-xs sm:text-sm font-semibold text-slate-500">Resolution Rate</div>
              </div>
            </div>

          </div>
        </section>


        <!-- Recently Reported Items Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
                <i data-lucide="clock" class="w-4 h-4"></i>
                Real-Time Updates
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font tracking-tight">
                Recently Reported Belongings
              </h2>
            </div>

            <!-- Filter Tabs -->
            <div class="flex items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl">
              <button 
                onclick="window.homeComponent.setFilterTab('all')" 
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.filterTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
              >
                All Reports
              </button>
              <button 
                onclick="window.homeComponent.setFilterTab('lost')" 
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.filterTab === 'lost' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
              >
                Lost Items
              </button>
              <button 
                onclick="window.homeComponent.setFilterTab('found')" 
                class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.filterTab === 'found' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
              >
                Found Items
              </button>
            </div>
          </div>

          <!-- Items Grid -->
          <div id="recent-items-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Rendered dynamically -->
          </div>

          <div class="text-center pt-4">
            <a href="#search" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50 hover:border-sky-500 hover:text-sky-600 shadow-sm transition-all">
              <span>View All Items in Database</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>
        </section>


        <!-- How It Works Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="navy-gradient rounded-[36px] p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
            <div class="absolute -top-12 -right-12 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div class="max-w-3xl mb-12">
              <span class="inline-block px-3.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold uppercase tracking-wider mb-3">
                Simple 3-Step Process
              </span>
              <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight heading-font">
                How Smart Lost and Found Works
              </h2>
              <p class="text-slate-300 text-sm sm:text-base mt-2">
                Designed for seamless recovery with complete security, verifiable ownership, and minimal turnaround time.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <!-- Step 1 -->
              <div class="bg-white/10 backdrop-blur-md rounded-3xl p-7 border border-white/10 relative group hover:bg-white/15 transition-all">
                <div class="w-12 h-12 rounded-2xl bg-sky-400/20 border border-sky-400/40 text-sky-300 flex items-center justify-center font-extrabold text-xl mb-6">
                  01
                </div>
                <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                  <i data-lucide="file-plus" class="w-5 h-5 text-sky-300"></i>
                  Report Belonging
                </h3>
                <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Post detailed specifications of what you lost or found—including photo, date, campus location, and unique identifying markings.
                </p>
              </div>

              <!-- Step 2 -->
              <div class="bg-white/10 backdrop-blur-md rounded-3xl p-7 border border-white/10 relative group hover:bg-white/15 transition-all">
                <div class="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-extrabold text-xl mb-6">
                  02
                </div>
                <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                  <i data-lucide="cpu" class="w-5 h-5 text-emerald-300"></i>
                  Smart AI Matching
                </h3>
                <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Our algorithm automatically cross-checks keywords, category, timestamp, and location proximity to trigger instant match alerts.
                </p>
              </div>

              <!-- Step 3 -->
              <div class="bg-white/10 backdrop-blur-md rounded-3xl p-7 border border-white/10 relative group hover:bg-white/15 transition-all">
                <div class="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-extrabold text-xl mb-6">
                  03
                </div>
                <h3 class="text-xl font-bold mb-3 flex items-center gap-2">
                  <i data-lucide="shield-check" class="w-5 h-5 text-amber-300"></i>
                  Claim & Recover
                </h3>
                <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Provide confidential proof of ownership (serial number, lockscreen, invoice). Once verified by security, safely collect your belonging.
                </p>
              </div>

            </div>
          </div>
        </section>


        <!-- About Us Section -->
        <section id="about" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span class="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-2">
                  About Smart Lost and Found Portal
                </span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font mb-4">
                  Built to Protect Our Campus Community
                </h2>
                <div class="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    Every day across campus classrooms, cafeterias, sports complexes, and shuttle buses, students and faculty accidentally misplace essential items—from smartphones and student IDs to keys and textbooks.
                  </p>
                  <p>
                    Traditional notice boards and informal chat groups are cluttered and fragmented. The <strong>Smart Lost and Found Portal (S.L.F.P.)</strong> solves this challenge with a unified digital repository, real-time smart matching, confidential ownership verification, and direct partnership with campus security desks.
                  </p>
                  <p class="font-medium text-slate-800">
                    Developed as a College Minor Project to demonstrate modern web engineering, real-time data persistence, and community-driven technology.
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-6">
                  <div class="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
                    <div class="font-bold text-slate-900 text-sm mb-1">Campus Helpdesk</div>
                    <div class="text-xs text-slate-600">Available Mon - Sat: 8 AM - 6 PM</div>
                  </div>
                  <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                    <div class="font-bold text-slate-900 text-sm mb-1">Central Security Desk</div>
                    <div class="text-xs text-slate-600">Gate #1 Main Administrative Building</div>
                  </div>
                </div>
              </div>

              <!-- Key Benefits Checklist -->
              <div class="space-y-4 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
                <h3 class="font-bold text-slate-900 text-lg mb-2">Why Our Portal is Better:</h3>

                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <i data-lucide="check" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">Automated Semantic Match Detection</h4>
                    <p class="text-xs text-slate-500">Alerts both parties instantly when an item with matching specifications is found.</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <i data-lucide="check" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">Anti-Fraud Proof Verification</h4>
                    <p class="text-xs text-slate-500">Confidential details are hidden from public view and vetted by staff before release.</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <i data-lucide="check" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">Printable Bulletin Posters with QR</h4>
                    <p class="text-xs text-slate-500">Generate printable lost notices ready for physical campus bulletin boards in 1-click.</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <i data-lucide="check" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-sm">Unified Admin Oversight</h4>
                    <p class="text-xs text-slate-500">Audited moderation logs, user management, and safe return certifications.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        <!-- Footer -->
        <footer class="bg-slate-900 text-slate-300 pt-16 pb-12 rounded-t-[40px] border-t border-slate-800">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              
              <!-- Col 1: Brand -->
              <div class="lg:col-span-2 space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                    <i data-lucide="shield-search" class="w-6 h-6"></i>
                  </div>
                  <span class="text-xl font-bold text-white tracking-tight heading-font">
                    Smart Lost & Found Portal
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                  A centralized, transparent, and intelligent platform dedicated to recovering lost belongings across university and college campuses.
                </p>
                <div class="flex items-center gap-3 pt-2">
                  <a href="#" class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-sky-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                    <i data-lucide="twitter" class="w-4 h-4"></i>
                  </a>
                  <a href="#" class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-sky-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                    <i data-lucide="facebook" class="w-4 h-4"></i>
                  </a>
                  <a href="#" class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-sky-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                    <i data-lucide="instagram" class="w-4 h-4"></i>
                  </a>
                  <a href="#" class="w-9 h-9 rounded-xl bg-slate-800 hover:bg-sky-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                    <i data-lucide="github" class="w-4 h-4"></i>
                  </a>
                </div>
              </div>

              <!-- Col 2: Quick Links -->
              <div>
                <h4 class="text-white font-bold text-sm mb-4">Quick Links</h4>
                <ul class="space-y-2.5 text-xs text-slate-400">
                  <li><a href="#home" class="hover:text-sky-400 transition-colors">Home Page</a></li>
                  <li><a href="#report-lost" class="hover:text-rose-400 transition-colors">Report Lost Item</a></li>
                  <li><a href="#report-found" class="hover:text-emerald-400 transition-colors">Report Found Item</a></li>
                  <li><a href="#search" class="hover:text-sky-400 transition-colors">Search All Belongings</a></li>
                  <li><a href="#about" class="hover:text-sky-400 transition-colors">About the Project</a></li>
                </ul>
              </div>

              <!-- Col 3: Portal Features -->
              <div>
                <h4 class="text-white font-bold text-sm mb-4">Portal Modules</h4>
                <ul class="space-y-2.5 text-xs text-slate-400">
                  <li><a href="#dashboard" class="hover:text-sky-400 transition-colors">User Dashboard</a></li>
                  <li><a href="#admin" class="hover:text-amber-400 transition-colors">Admin Moderation</a></li>
                  <li><a href="#notifications" class="hover:text-sky-400 transition-colors">Notifications Feed</a></li>
                  <li><button onclick="window.store.resetToDefaults(); window.location.reload();" class="text-sky-400 hover:underline">Reset Demo Data</button></li>
                </ul>
              </div>

              <!-- Col 4: Campus Contact -->
              <div>
                <h4 class="text-white font-bold text-sm mb-4">Security Office</h4>
                <ul class="space-y-2.5 text-xs text-slate-400">
                  <li class="flex items-start gap-2">
                    <i data-lucide="map-pin" class="w-4 h-4 text-sky-400 shrink-0 mt-0.5"></i>
                    <span>Campus Security Station 1, Main Administrative Gate</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <i data-lucide="phone" class="w-4 h-4 text-sky-400 shrink-0"></i>
                    <span>+1 (555) 999-0011</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <i data-lucide="mail" class="w-4 h-4 text-sky-400 shrink-0"></i>
                    <span>lostandfound@campus.edu</span>
                  </li>
                </ul>
              </div>

            </div>

            <!-- Bottom Copyright & Academic Attribution -->
            <div class="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <div>
                &copy; 2024 Smart Lost and Found Portal (S.L.F.P.). Designed for Academic & College Demonstration.
              </div>
              <div class="flex items-center gap-4">
                <span class="hover:text-slate-400 cursor-pointer">Privacy Guidelines</span>
                <span>•</span>
                <span class="hover:text-slate-400 cursor-pointer">Security Protocol</span>
                <span>•</span>
                <span class="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              </div>
            </div>

          </div>
        </footer>

      </div>
    `;
  }
}

window.homeComponent = new HomeComponent();
