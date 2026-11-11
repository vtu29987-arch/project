/**
 * User Dashboard Component
 * Personalized student/user portal displaying metrics, submitted reports,
 * filed claims, smart match alerts, and direct item controls.
 */

class DashboardComponent {
  constructor() {
    this.activeTab = 'reports'; // 'reports' | 'claims' | 'matches'
  }

  setTab(tab) {
    this.activeTab = tab;
    this.renderTabs();
  }

  renderTabs() {
    const content = document.getElementById('dashboard-tab-content');
    if (!content) return;

    const user = window.store.getCurrentUser();
    if (!user) {
      content.innerHTML = `
        <div class="py-12 text-center text-slate-500">
          Please log in to view your dashboard activity.
        </div>
      `;
      return;
    }

    const allItems = window.store.getItems();
    const myReports = allItems.filter(i => i.reportedBy.userId === user.id || i.reportedBy.email === user.email);
    const myClaims = window.store.getClaimsForUser(user.id);
    
    // Calculate smart matches for user's active lost reports
    const userLostItems = myReports.filter(i => i.type === 'lost' && i.status !== 'recovered');
    let userMatches = [];
    userLostItems.forEach(item => {
      const matches = window.matchingEngine.findMatchesForItem(item, 40);
      userMatches = userMatches.concat(matches);
    });

    if (this.activeTab === 'reports') {
      if (myReports.length === 0) {
        content.innerHTML = `
          <div class="py-16 text-center bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
            <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <i data-lucide="inbox" class="w-7 h-7"></i>
            </div>
            <h4 class="text-base font-bold text-slate-800 mb-1">No Belongings Reported Yet</h4>
            <p class="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
              You haven't logged any lost or found belongings under this account.
            </p>
            <div class="flex items-center justify-center gap-3">
              <a href="#report-lost" class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors">
                Report Lost Item
              </a>
              <a href="#report-found" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors">
                Report Found Item
              </a>
            </div>
          </div>
        `;
      } else {
        content.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${myReports.map(item => `
              <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start gap-4">
                <img src="${item.image}" alt="${item.title}" class="w-20 h-20 rounded-xl object-cover shrink-0">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }">
                      ${item.type}
                    </span>
                    <span class="text-[11px] font-mono text-slate-400 font-bold">${item.refCode}</span>
                  </div>

                  <h5 class="font-bold text-slate-900 text-sm truncate">${item.title}</h5>
                  <div class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                    <i data-lucide="map-pin" class="w-3 h-3 text-sky-500 shrink-0"></i>
                    <span class="truncate">${item.location}</span>
                  </div>

                  <div class="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <span class="text-[11px] font-semibold ${
                      item.status === 'recovered' ? 'text-green-600' : (item.status === 'claim_pending' ? 'text-amber-600' : 'text-slate-500')
                    }">
                      Status: ${item.status === 'recovered' ? 'Recovered' : (item.status === 'claim_pending' ? 'Claim Pending' : 'Active / Open')}
                    </span>

                    <div class="flex items-center gap-2">
                      <button onclick="window.itemDetailsComponent.show('${item.id}')" class="px-2.5 py-1 text-xs font-bold text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                        View
                      </button>
                      ${item.status !== 'recovered' ? `
                        <button onclick="window.store.updateItem('${item.id}', { status: 'recovered' }); window.app.showToast('Item marked as Recovered!'); window.dashboardComponent.renderTabs();" class="px-2.5 py-1 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark as resolved">
                          Mark Recovered
                        </button>
                      ` : ''}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    } else if (this.activeTab === 'claims') {
      if (myClaims.length === 0) {
        content.innerHTML = `
          <div class="py-16 text-center bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
            <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <i data-lucide="clipboard-list" class="w-7 h-7"></i>
            </div>
            <h4 class="text-base font-bold text-slate-800 mb-1">No Claims Filed Yet</h4>
            <p class="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
              When you locate a found item that belongs to you, submit a claim with identifying proof to track verification here.
            </p>
            <a href="#search" class="inline-flex px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-sky-600 transition-colors">
              Browse Found Belongings
            </a>
          </div>
        `;
      } else {
        content.innerHTML = `
          <div class="space-y-3">
            ${myClaims.map(c => `
              <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-900 text-sm">${c.itemTitle}</span>
                    <span class="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">${c.itemRefCode}</span>
                  </div>
                  <p class="text-xs text-slate-600 italic">"Proof: ${c.proofDescription}"</p>
                  <div class="text-[10px] text-slate-400">Submitted: ${new Date(c.submittedAt).toLocaleString()}</div>
                  ${c.adminNotes ? `
                    <div class="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg mt-1 font-medium">
                      🛡️ <strong>Admin Note:</strong> ${c.adminNotes}
                    </div>
                  ` : ''}
                </div>

                <div class="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    c.status === 'approved' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : (c.status === 'rejected' 
                        ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                        : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse')
                  }">
                    ● ${c.status === 'approved' ? 'Approved & Ready' : (c.status === 'rejected' ? 'Claim Rejected' : 'Under Review')}
                  </span>

                  <button onclick="window.itemDetailsComponent.show('${c.itemId}')" class="text-xs text-sky-600 hover:text-sky-700 font-bold hover:underline">
                    View Item Details →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    } else if (this.activeTab === 'matches') {
      if (userMatches.length === 0) {
        content.innerHTML = `
          <div class="py-16 text-center bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
            <div class="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
              <i data-lucide="sparkles" class="w-7 h-7"></i>
            </div>
            <h4 class="text-base font-bold text-slate-800 mb-1">No High Confidence Matches Right Now</h4>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Our automated engine runs in the background. As soon as a found item matching your lost reports is logged, it will appear here.
            </p>
          </div>
        `;
      } else {
        content.innerHTML = `
          <div class="space-y-4">
            ${userMatches.map(m => `
              <div class="bg-gradient-to-r from-sky-50 via-blue-50 to-white rounded-2xl p-5 border border-sky-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <img src="${m.matchedItem.image}" class="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-600 text-white shadow-sm">
                        ${m.score}% AI Match
                      </span>
                      <span class="text-xs font-bold text-slate-500">${m.matchedItem.category}</span>
                    </div>
                    <h5 class="font-bold text-slate-900 text-sm">${m.matchedItem.title}</h5>
                    <div class="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <i data-lucide="map-pin" class="w-3.5 h-3.5 text-sky-600"></i>
                      Found at: ${m.matchedItem.location}
                    </div>
                    <div class="text-[11px] text-sky-800 mt-1">
                      Matches your lost report: <strong>"${m.targetItem.title}"</strong>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button onclick="window.itemDetailsComponent.show('${m.matchedItem.id}')" class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold shadow-md transition-colors">
                    Inspect Match
                  </button>
                  <button onclick="window.claimModal.show('${m.matchedItem.id}')" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors">
                    Claim Item
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  render() {
    const user = window.store.getCurrentUser();
    if (!user) {
      return `
        <div class="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <i data-lucide="lock" class="w-8 h-8"></i>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900 heading-font">Authentication Required</h2>
          <p class="text-xs text-slate-500">Please login to access your personal dashboard and submitted claims.</p>
          <div class="pt-2 flex items-center justify-center gap-3">
            <button onclick="window.authModal.show('login')" class="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors">
              Sign In Now
            </button>
            <button onclick="window.navbarComponent.selectPersona('student')" class="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">
              Quick 1-Click Demo Login
            </button>
          </div>
        </div>
      `;
    }

    const allItems = window.store.getItems();
    const myReports = allItems.filter(i => i.reportedBy.userId === user.id || i.reportedBy.email === user.email);
    const myClaims = window.store.getClaimsForUser(user.id);
    const globalStats = window.store.getStats();

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
        
        <!-- Personalized User Welcome Banner -->
        <div class="bg-gradient-to-r from-slate-900 via-blue-900 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <img src="${user.avatar}" alt="${user.name}" class="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg">
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight heading-font">
                  Welcome back, ${user.name}! 👋
                </h1>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  user.role === 'admin' ? 'bg-amber-400 text-amber-950' : 'bg-sky-400 text-sky-950'
                }">
                  ${user.role}
                </span>
              </div>
              <p class="text-xs text-slate-300 mt-1">
                ${user.department || 'Student Portal'} • ID: <span class="font-mono text-sky-300">${user.studentId || 'N/A'}</span>
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-3 self-start md:self-auto">
            <a href="#report-lost" class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all hover:scale-[1.02]">
              <i data-lucide="minus-circle" class="w-4 h-4"></i>
              <span>+ Report Lost</span>
            </a>
            <a href="#report-found" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>+ Report Found</span>
            </a>
          </div>
        </div>


        <!-- Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Campus Lost Items</div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 heading-font">${globalStats.totalLost}</div>
            <div class="text-[11px] text-slate-500 mt-1">Reported active across campus</div>
          </div>

          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Campus Found Items</div>
            <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600 heading-font">${globalStats.totalFound}</div>
            <div class="text-[11px] text-slate-500 mt-1">Logged by students & security</div>
          </div>

          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">My Active Reports</div>
            <div class="text-2xl sm:text-3xl font-extrabold text-sky-600 heading-font">${myReports.length}</div>
            <div class="text-[11px] text-slate-500 mt-1">Items posted by your account</div>
          </div>

          <div class="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">My Submitted Claims</div>
            <div class="text-2xl sm:text-3xl font-extrabold text-indigo-600 heading-font">${myClaims.length}</div>
            <div class="text-[11px] text-slate-500 mt-1">Ownership verification requests</div>
          </div>
        </div>


        <!-- Tabs Navigation -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button 
              onclick="window.dashboardComponent.setTab('reports')" 
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.activeTab === 'reports' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}"
            >
              My Reported Belongings (${myReports.length})
            </button>
            <button 
              onclick="window.dashboardComponent.setTab('claims')" 
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.activeTab === 'claims' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}"
            >
              My Claims & Status (${myClaims.length})
            </button>
            <button 
              onclick="window.dashboardComponent.setTab('matches')" 
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.activeTab === 'matches' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}"
            >
              <i data-lucide="sparkles" class="w-3.5 h-3.5 inline mr-1"></i>
              Smart Match Alerts
            </button>
          </div>

          <!-- Tab Content Area -->
          <div id="dashboard-tab-content">
            <!-- Rendered by renderTabs() -->
          </div>
        </div>

      </div>
    `;
  }
}

window.dashboardComponent = new DashboardComponent();
