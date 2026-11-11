/**
 * Admin Dashboard Component
 * Dedicated Administrative Control Center for Campus Security Officers & Portal Admins.
 * Moderates reports, verifies ownership claims, manages registered users, and exports data.
 */

class AdminComponent {
  constructor() {
    this.activeTab = 'claims'; // 'claims' | 'reports' | 'users'
    this.reportFilter = 'all';
  }

  setTab(tab) {
    this.activeTab = tab;
    this.renderTabs();
  }

  renderTabs() {
    const content = document.getElementById('admin-tab-content');
    if (!content) return;

    if (this.activeTab === 'claims') {
      const claims = window.store.getClaims();
      
      content.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="shield-check" class="w-5 h-5 text-amber-600"></i>
              <span>Pending & Historical Ownership Claims</span>
            </h3>
            <span class="text-xs font-semibold text-slate-500">${claims.length} Total Claims Submitted</span>
          </div>

          ${claims.length === 0 ? `
            <div class="py-12 text-center bg-white rounded-3xl border border-slate-200 p-6 text-slate-400">
              No claims submitted yet.
            </div>
          ` : `
            <div class="space-y-3">
              ${claims.map(c => `
                <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div class="space-y-2 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : (c.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800 animate-pulse')
                      }">
                        ● ${c.status}
                      </span>
                      <span class="font-mono text-xs font-bold text-slate-500">${c.itemRefCode}</span>
                      <span class="font-bold text-slate-900 text-sm">${c.itemTitle}</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span class="text-slate-400 block text-[10px] uppercase font-bold">Claimant</span>
                        <strong>${c.claimantName}</strong> (${c.claimantPhone || c.claimantEmail})
                      </div>
                      <div>
                        <span class="text-slate-400 block text-[10px] uppercase font-bold">Submitted Date</span>
                        <span>${new Date(c.submittedAt).toLocaleString()}</span>
                      </div>
                      <div class="sm:col-span-2 pt-1 border-t border-slate-200/60">
                        <span class="text-slate-400 block text-[10px] uppercase font-bold">Proof of Ownership / Secret Details</span>
                        <p class="text-slate-800 italic mt-0.5">${c.proofDescription}</p>
                      </div>
                    </div>

                    ${c.adminNotes ? `
                      <div class="text-xs text-slate-500">
                        <strong>Admin Remark:</strong> ${c.adminNotes}
                      </div>
                    ` : ''}
                  </div>

                  <!-- Admin Action Controls -->
                  <div class="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button onclick="window.itemDetailsComponent.show('${c.itemId}')" class="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                      View Item
                    </button>

                    ${c.status === 'pending' ? `
                      <button onclick="window.adminComponent.approveClaim('${c.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1">
                        <i data-lucide="check" class="w-3.5 h-3.5"></i>
                        Approve Claim
                      </button>

                      <button onclick="window.adminComponent.rejectClaimPrompt('${c.id}')" class="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1">
                        <i data-lucide="x" class="w-3.5 h-3.5"></i>
                        Reject
                      </button>
                    ` : `
                      <span class="text-xs text-slate-400 font-semibold px-2 py-1">
                        Decision finalized
                      </span>
                    `}
                  </div>

                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    } else if (this.activeTab === 'reports') {
      let items = window.store.getItems();
      if (this.reportFilter !== 'all') {
        items = items.filter(i => i.type === this.reportFilter);
      }

      content.innerHTML = `
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="list-filter" class="w-5 h-5 text-sky-600"></i>
              <span>All Active & Recovered Item Reports</span>
            </h3>

            <!-- Report Filter -->
            <div class="flex items-center gap-2">
              <select onchange="window.adminComponent.reportFilter = this.value; window.adminComponent.renderTabs();" class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white">
                <option value="all" ${this.reportFilter === 'all' ? 'selected' : ''}>All Types</option>
                <option value="lost" ${this.reportFilter === 'lost' ? 'selected' : ''}>Lost Only</option>
                <option value="found" ${this.reportFilter === 'found' ? 'selected' : ''}>Found Only</option>
              </select>

              <button onclick="window.adminComponent.exportReportsJSON()" class="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <i data-lucide="download" class="w-3.5 h-3.5"></i>
                Export JSON
              </button>
            </div>
          </div>

          <!-- Items Table -->
          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-600">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4">Ref Code</th>
                    <th class="py-3 px-4">Item Title</th>
                    <th class="py-3 px-4">Type</th>
                    <th class="py-3 px-4">Category</th>
                    <th class="py-3 px-4">Location</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${items.map(item => `
                    <tr class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-3 px-4 font-mono font-bold text-slate-800">${item.refCode}</td>
                      <td class="py-3 px-4 font-semibold text-slate-900 max-w-[180px] truncate">${item.title}</td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }">
                          ${item.type}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-slate-700">${item.category}</td>
                      <td class="py-3 px-4 text-slate-500 max-w-[140px] truncate">${item.location}</td>
                      <td class="py-3 px-4">
                        <span class="font-semibold ${
                          item.status === 'recovered' ? 'text-green-600' : (item.status === 'claim_pending' ? 'text-amber-600' : 'text-slate-500')
                        }">
                          ${item.status}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right space-x-1">
                        <button onclick="window.itemDetailsComponent.show('${item.id}')" class="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg" title="View Details">
                          <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                        ${item.status !== 'recovered' ? `
                          <button onclick="window.store.updateItem('${item.id}', { status: 'recovered' }); window.adminComponent.renderTabs();" class="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded-lg" title="Mark Recovered">
                            <i data-lucide="check-circle" class="w-4 h-4"></i>
                          </button>
                        ` : ''}
                        <button onclick="if(confirm('Are you sure you want to remove this report?')){ window.store.deleteItem('${item.id}'); window.adminComponent.renderTabs(); window.app.showToast('Item report deleted by admin.'); }" class="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg" title="Delete Duplicate or Inappropriate Report">
                          <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'users') {
      const users = window.store.getUsers();

      content.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="users" class="w-5 h-5 text-indigo-600"></i>
              <span>Registered Campus Members & Accounts</span>
            </h3>
            <span class="text-xs font-semibold text-slate-500">${users.length} Users Registered</span>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-600">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4">Member Name</th>
                    <th class="py-3 px-4">Email</th>
                    <th class="py-3 px-4">Role</th>
                    <th class="py-3 px-4">Department / ID</th>
                    <th class="py-3 px-4">Joined Date</th>
                    <th class="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${users.map(u => `
                    <tr class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-2">
                          <img src="${u.avatar}" class="w-7 h-7 rounded-full object-cover">
                          <span class="font-bold text-slate-900">${u.name}</span>
                        </div>
                      </td>
                      <td class="py-3 px-4 font-mono text-slate-700">${u.email}</td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                        }">
                          ${u.role}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-slate-600">${u.department || 'N/A'}</td>
                      <td class="py-3 px-4 text-slate-400">${u.joinedDate}</td>
                      <td class="py-3 px-4 text-right">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  approveClaim(claimId) {
    const adminNotes = prompt('Add an optional approval message for the claimant (e.g. "Verified. Ready for pickup at Security Desk #1"):', 'Verified. Ready for pickup at Security Desk #1');
    if (adminNotes !== null) {
      window.store.updateClaimStatus(claimId, 'approved', adminNotes);
      window.app.showToast('Claim APPROVED! Item marked as Recovered and claimant notified.', 'success');
      this.renderTabs();
    }
  }

  rejectClaimPrompt(claimId) {
    const reason = prompt('Please provide reason for rejecting this claim (e.g. "Proof details do not match item"):', 'Proof details do not match item.');
    if (reason !== null) {
      window.store.updateClaimStatus(claimId, 'rejected', reason);
      window.app.showToast('Claim rejected with notes.', 'info');
      this.renderTabs();
    }
  }

  exportReportsJSON() {
    const items = window.store.getItems();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SLFP_LostAndFound_Reports_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    window.app.showToast('Export file downloaded successfully!');
  }

  render() {
    const user = window.store.getCurrentUser();
    
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      return `
        <div class="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-5 animate-fade-in">
          <div class="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <i data-lucide="shield-alert" class="w-8 h-8"></i>
          </div>
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900 heading-font">Security Officer Admin Access</h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
              This area is restricted to Campus Security Officers and Portal Administrators for verifying claims, moderating duplicate posts, and handling item custody handovers.
            </p>
          </div>
          
          <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left">
            💡 <strong>College Project Demonstration Tip:</strong> You can switch to the Officer Sarah Jenkins Admin persona in 1-click using the button below.
          </div>

          <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onclick="window.navbarComponent.selectPersona('admin'); window.location.hash='#admin';" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition-all">
              🛡️ Switch to Officer Sarah (Admin)
            </button>
            <a href="#home" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all">
              Return to Home
            </a>
          </div>
        </div>
      `;
    }

    const stats = window.store.getStats();

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
        
        <!-- Admin Header -->
        <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-500/20">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg">
              <i data-lucide="shield-check" class="w-8 h-8"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight heading-font">
                  Security Admin Oversight
                </h1>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 uppercase">
                  Staff Verified
                </span>
              </div>
              <p class="text-xs text-slate-300 mt-1">
                Officer Sarah Jenkins • Campus Security & Lost Property Custody
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 self-start md:self-auto">
            <button onclick="window.adminComponent.exportReportsJSON()" class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors">
              <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
              <span>Export Audit Data</span>
            </button>
          </div>
        </div>


        <!-- Admin Metrics Banner -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Users</div>
            <div class="text-xl sm:text-2xl font-extrabold text-slate-900 heading-font">${stats.totalUsers}</div>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lost Reports</div>
            <div class="text-xl sm:text-2xl font-extrabold text-rose-600 heading-font">${stats.totalLost}</div>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Found Reports</div>
            <div class="text-xl sm:text-2xl font-extrabold text-emerald-600 heading-font">${stats.totalFound}</div>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claims Filed</div>
            <div class="text-xl sm:text-2xl font-extrabold text-indigo-600 heading-font">${stats.totalClaims}</div>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Safe Returns</div>
            <div class="text-xl sm:text-2xl font-extrabold text-green-600 heading-font">${stats.recovered}</div>
          </div>
          <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Success Rate</div>
            <div class="text-xl sm:text-2xl font-extrabold text-amber-600 heading-font">${stats.recoveryRate}%</div>
          </div>
        </div>


        <!-- Admin Tabs Navigation -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button 
              onclick="window.adminComponent.setTab('claims')" 
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.activeTab === 'claims' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}"
            >
              Verify Claims (${window.store.getClaims().filter(c => c.status === 'pending').length} Pending)
            </button>
            <button 
              onclick="window.adminComponent.setTab('reports')" 
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.activeTab === 'reports' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}"
            >
              Manage All Reports (${stats.totalItems})
            </button>
            <button 
              onclick="window.adminComponent.setTab('users')" 
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.activeTab === 'users' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}"
            >
              Registered Users (${stats.totalUsers})
            </button>
          </div>

          <!-- Active Admin Content -->
          <div id="admin-tab-content">
            <!-- Populated by renderTabs() -->
          </div>
        </div>

      </div>
    `;
  }
}

window.adminComponent = new AdminComponent();
