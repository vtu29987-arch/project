/**
 * Notifications Component
 * Dedicated notifications center displaying match alerts, claim updates,
 * admin approvals, and safe recovery notices.
 */

class NotificationsComponent {
  constructor() {
    this.filter = 'all'; // 'all' | 'unread' | 'match' | 'claim'
  }

  setFilter(f) {
    this.filter = f;
    this.renderList();
  }

  renderList() {
    const list = document.getElementById('notif-full-list');
    if (!list) return;

    const user = window.store.getCurrentUser();
    let notifs = window.store.getNotifications(user ? user.id : null);

    if (this.filter === 'unread') {
      notifs = notifs.filter(n => !n.read);
    } else if (this.filter === 'match') {
      notifs = notifs.filter(n => n.type === 'match');
    } else if (this.filter === 'claim') {
      notifs = notifs.filter(n => n.type === 'claim' || n.type === 'recovery');
    }

    if (notifs.length === 0) {
      list.innerHTML = `
        <div class="py-16 text-center bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
          <div class="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-3">
            <i data-lucide="bell-off" class="w-7 h-7"></i>
          </div>
          <h4 class="text-base font-bold text-slate-800 mb-1">No Notifications in this filter</h4>
          <p class="text-xs text-slate-500">You're all caught up!</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    list.innerHTML = notifs.map(n => `
      <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:border-sky-300 transition-all flex items-start gap-4 ${!n.read ? 'bg-sky-50/40 border-l-4 border-l-sky-500' : ''}">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
          n.type === 'match' ? 'bg-indigo-100 text-indigo-600' : (n.type === 'recovery' ? 'bg-emerald-100 text-emerald-600' : (n.type === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'))
        }">
          <i data-lucide="${
            n.type === 'match' ? 'sparkles' : (n.type === 'recovery' ? 'check-circle' : (n.type === 'admin' ? 'shield-alert' : 'bell'))
          }" class="w-5 h-5"></i>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2 mb-1">
            <h5 class="font-bold text-slate-900 text-sm">${n.title}</h5>
            <span class="text-[11px] text-slate-400 shrink-0">${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <p class="text-xs text-slate-600 leading-relaxed">${n.message}</p>

          <div class="flex items-center gap-4 mt-3 pt-2 border-t border-slate-100">
            ${n.link ? `
              <a href="${n.link}" onclick="window.store.markNotificationAsRead('${n.id}');" class="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:underline">
                <span>View Details</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </a>
            ` : ''}

            ${!n.read ? `
              <button onclick="window.store.markNotificationAsRead('${n.id}'); window.notificationsComponent.renderList();" class="text-xs font-semibold text-slate-500 hover:text-slate-800">
                Mark as read
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  render() {
    const user = window.store.getCurrentUser();

    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <a href="#home" class="hover:text-sky-600">Home</a>
              <span>/</span>
              <span class="text-sky-600 font-bold">Notifications</span>
            </div>
            <h1 class="text-3xl font-extrabold text-slate-900 heading-font flex items-center gap-2.5">
              <i data-lucide="bell" class="w-7 h-7 text-sky-600"></i>
              <span>Notifications Center</span>
            </h1>
          </div>

          <button onclick="window.store.markAllNotificationsAsRead(); window.notificationsComponent.renderList();" class="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 self-start sm:self-auto flex items-center gap-1.5 shadow-sm">
            <i data-lucide="check-check" class="w-4 h-4 text-emerald-600"></i>
            <span>Mark All as Read</span>
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 p-1 bg-slate-200/80 rounded-2xl w-fit">
          <button onclick="window.notificationsComponent.setFilter('all')" class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${this.filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            All
          </button>
          <button onclick="window.notificationsComponent.setFilter('unread')" class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${this.filter === 'unread' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Unread Only
          </button>
          <button onclick="window.notificationsComponent.setFilter('match')" class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${this.filter === 'match' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            AI Matches
          </button>
          <button onclick="window.notificationsComponent.setFilter('claim')" class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${this.filter === 'claim' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Claims & Recoveries
          </button>
        </div>

        <!-- Notifications List -->
        <div id="notif-full-list" class="space-y-3">
          <!-- Populated by renderList() -->
        </div>

      </div>
    `;
  }
}

window.notificationsComponent = new NotificationsComponent();
