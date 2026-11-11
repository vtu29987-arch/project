/**
 * Navbar Component
 * Navigation header with logo, links, search shortcut, notifications drawer,
 * role switcher, and mobile responsive drawer.
 */

class NavbarComponent {
  constructor() {
    this.render();
    if (window.store) {
      window.store.subscribe('auth-changed', () => this.render());
      window.store.subscribe('notif-updated', () => this.updateNotifBadge());
    }
  }

  updateNotifBadge() {
    const user = window.store.getCurrentUser();
    const notifs = window.store.getNotifications(user ? user.id : null);
    const unreadCount = notifs.filter(n => !n.read).length;
    const badge = document.getElementById('nav-notif-badge');
    if (badge) {
      if (unreadCount > 0) {
        badge.innerText = unreadCount > 9 ? '9+' : unreadCount;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  }

  render() {
    const container = document.getElementById('navbar-container');
    if (!container) return;

    const user = window.store ? window.store.getCurrentUser() : null;
    const notifs = window.store ? window.store.getNotifications(user ? user.id : null) : [];
    const unreadCount = notifs.filter(n => !n.read).length;

    container.innerHTML = `
      <header class="glass-nav sticky top-0 z-40 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            
            <!-- Brand Logo -->
            <a href="#home" class="flex items-center gap-3 group focus:outline-none">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-900 to-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
                <i data-lucide="shield-search" class="w-7 h-7 text-sky-300"></i>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <span class="text-xl font-extrabold tracking-tight text-slate-900 heading-font">
                    S.L.F.P.
                  </span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                    Smart Portal
                  </span>
                </div>
                <span class="text-xs font-medium text-slate-500 hidden sm:inline">
                  Smart Lost and Found Portal
                </span>
              </div>
            </a>

            <!-- Desktop Navigation Links -->
            <nav class="hidden lg:flex items-center gap-1">
              <a href="#home" class="nav-link px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50/80 transition-colors">
                Home
              </a>
              <a href="#report-lost" class="nav-link px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 transition-colors flex items-center gap-1.5">
                <i data-lucide="minus-circle" class="w-4 h-4"></i>
                Report Lost
              </a>
              <a href="#report-found" class="nav-link px-3.5 py-2 rounded-xl text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/80 transition-colors flex items-center gap-1.5">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                Report Found
              </a>
              <a href="#search" class="nav-link px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50/80 transition-colors flex items-center gap-1.5">
                <i data-lucide="search" class="w-4 h-4"></i>
                Search Items
              </a>
              <a href="#about" class="nav-link px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50/80 transition-colors">
                About Us
              </a>
              ${user ? `
                <a href="#dashboard" class="nav-link px-3.5 py-2 rounded-xl text-sm font-semibold text-sky-700 hover:text-sky-800 hover:bg-sky-50 transition-colors flex items-center gap-1.5">
                  <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                  Dashboard
                </a>
              ` : ''}
              ${user && user.role === 'admin' ? `
                <a href="#admin" class="nav-link px-3.5 py-2 rounded-xl text-sm font-semibold text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-colors flex items-center gap-1.5">
                  <i data-lucide="shield-check" class="w-4 h-4 text-amber-600"></i>
                  Admin Panel
                </a>
              ` : ''}
            </nav>

            <!-- Right Controls: Persona Switcher, Notifications & Auth Profile -->
            <div class="flex items-center gap-3">
              
              <!-- Quick 1-Click Demo Persona Switcher (For College Presentation) -->
              <div class="relative hidden md:block">
                <button id="persona-btn" onclick="window.navbarComponent.togglePersonaDropdown()" class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-all">
                  <span class="w-2 h-2 rounded-full ${user ? (user.role === 'admin' ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-400'}"></span>
                  <span class="max-w-[120px] truncate">${user ? `${user.name.split(' ')[0]} (${user.role})` : 'Guest Mode'}</span>
                  <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>

                <!-- Persona Switcher Dropdown Menu -->
                <div id="persona-dropdown" class="hidden absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                  <div class="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    1-Click Demo Persona
                  </div>
                  <button onclick="window.navbarComponent.selectPersona('student')" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-sky-50 flex items-center gap-3 transition-colors ${user && user.id === 'usr-student-01' ? 'bg-sky-50/80 font-bold text-sky-900' : 'text-slate-700'}">
                    <img src="./assets/images/avatar-john.svg" class="w-7 h-7 rounded-full object-cover">
                    <div class="text-xs">
                      <div class="font-semibold text-slate-900">John Doe</div>
                      <div class="text-slate-500">Student (CSE Department)</div>
                    </div>
                  </button>
                  <button onclick="window.navbarComponent.selectPersona('student2')" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-sky-50 flex items-center gap-3 transition-colors ${user && user.id === 'usr-student-02' ? 'bg-sky-50/80 font-bold text-sky-900' : 'text-slate-700'}">
                    <img src="./assets/images/avatar-emma.svg" class="w-7 h-7 rounded-full object-cover">
                    <div class="text-xs">
                      <div class="font-semibold text-slate-900">Emma Watson</div>
                      <div class="text-slate-500">Student (Biotech)</div>
                    </div>
                  </button>
                  <button onclick="window.navbarComponent.selectPersona('admin')" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-amber-50 flex items-center gap-3 transition-colors ${user && user.role === 'admin' ? 'bg-amber-50 font-bold text-amber-900' : 'text-slate-700'}">
                    <img src="./assets/images/avatar-sarah.svg" class="w-7 h-7 rounded-full object-cover">
                    <div class="text-xs">
                      <div class="font-semibold text-amber-950 flex items-center gap-1.5">
                        Officer Sarah
                        <span class="px-1.5 py-0.2 bg-amber-200 text-amber-800 rounded text-[10px] font-bold">ADMIN</span>
                      </div>
                      <div class="text-slate-500">Campus Security Officer</div>
                    </div>
                  </button>
                  <button onclick="window.navbarComponent.selectPersona('guest')" class="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-3 transition-colors ${!user ? 'bg-slate-100 font-bold' : 'text-slate-600'}">
                    <div class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                      <i data-lucide="user" class="w-4 h-4"></i>
                    </div>
                    <div class="text-xs">
                      <div class="font-semibold text-slate-700">Guest Visitor</div>
                      <div class="text-slate-400">Public / Non-logged in</div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Notifications Button & Drawer -->
              <div class="relative">
                <button id="notif-btn" onclick="window.navbarComponent.toggleNotifDropdown()" class="relative p-2.5 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors focus:outline-none" title="Notifications">
                  <i data-lucide="bell" class="w-5 h-5"></i>
                  <span id="nav-notif-badge" class="${unreadCount === 0 ? 'hidden' : ''} absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    ${unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </button>

                <!-- Notifications Dropdown -->
                <div id="notif-dropdown" class="hidden absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fade-in">
                  <div class="flex items-center justify-between pb-3 border-b border-slate-100 px-1">
                    <div class="flex items-center gap-2">
                      <h4 class="font-bold text-slate-900 text-sm">Notifications</h4>
                      ${unreadCount > 0 ? `<span class="px-2 py-0.5 text-xs bg-rose-100 text-rose-700 font-bold rounded-full">${unreadCount} New</span>` : ''}
                    </div>
                    <button onclick="window.store.markAllNotificationsAsRead(); window.navbarComponent.render();" class="text-xs text-sky-600 hover:text-sky-700 font-semibold hover:underline">
                      Mark all as read
                    </button>
                  </div>
                  <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 my-1">
                    ${notifs.length === 0 ? `
                      <div class="py-8 text-center text-slate-400 text-sm">
                        <i data-lucide="bell-off" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
                        No notifications yet
                      </div>
                    ` : notifs.slice(0, 5).map(n => `
                      <a href="${n.link || '#dashboard'}" onclick="window.store.markNotificationAsRead('${n.id}'); window.navbarComponent.toggleNotifDropdown(false);" class="block p-3 hover:bg-slate-50 transition-colors rounded-xl ${!n.read ? 'bg-sky-50/50' : ''}">
                        <div class="flex items-start gap-2.5">
                          <div class="w-2 h-2 mt-1.5 rounded-full shrink-0 ${!n.read ? 'bg-sky-500' : 'bg-transparent'}"></div>
                          <div class="flex-1">
                            <div class="text-xs font-bold text-slate-800">${n.title}</div>
                            <div class="text-xs text-slate-600 mt-0.5 line-clamp-2">${n.message}</div>
                            <div class="text-[10px] text-slate-400 mt-1">${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>
                      </a>
                    `).join('')}
                  </div>
                  <div class="pt-2 border-t border-slate-100 text-center">
                    <a href="#notifications" onclick="window.navbarComponent.toggleNotifDropdown(false);" class="text-xs font-bold text-sky-600 hover:text-sky-700 block py-1">
                      View All Notifications →
                    </a>
                  </div>
                </div>
              </div>

              <!-- Auth Profile Button or Login/Register -->
              ${user ? `
                <div class="relative">
                  <button id="user-menu-btn" onclick="window.navbarComponent.toggleUserDropdown()" class="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                    <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/20">
                    <span class="text-xs font-semibold text-slate-800 hidden sm:inline">${user.name}</span>
                    <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
                  </button>

                  <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                    <div class="px-3 py-2 border-b border-slate-100">
                      <div class="text-xs font-bold text-slate-900">${user.name}</div>
                      <div class="text-[11px] text-slate-500 truncate">${user.email}</div>
                    </div>
                    <a href="#dashboard" onclick="window.navbarComponent.toggleUserDropdown(false)" class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors">
                      <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                      My Dashboard
                    </a>
                    ${user.role === 'admin' ? `
                      <a href="#admin" onclick="window.navbarComponent.toggleUserDropdown(false)" class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50 rounded-xl transition-colors">
                        <i data-lucide="shield" class="w-4 h-4 text-amber-600"></i>
                        Admin Panel
                      </a>
                    ` : ''}
                    <button onclick="window.store.setCurrentUser(null); window.navbarComponent.toggleUserDropdown(false); window.location.hash='#home';" class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border-t border-slate-100 mt-1">
                      <i data-lucide="log-out" class="w-4 h-4"></i>
                      Sign Out
                    </button>
                  </div>
                </div>
              ` : `
                <div class="flex items-center gap-2">
                  <button onclick="window.authModal.show('login')" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                    Login
                  </button>
                  <button onclick="window.authModal.show('register')" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-slate-900 to-sky-700 hover:from-slate-800 hover:to-sky-600 shadow-sm shadow-sky-600/20 transition-all hover:scale-[1.02]">
                    Register
                  </button>
                </div>
              `}

              <!-- Mobile Hamburger Menu Button -->
              <button onclick="window.navbarComponent.toggleMobileMenu()" class="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none">
                <i data-lucide="menu" class="w-6 h-6"></i>
              </button>

            </div>
          </div>
        </div>

        <!-- Mobile Drawer -->
        <div id="mobile-menu" class="hidden lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-lg">
          <a href="#home" onclick="window.navbarComponent.toggleMobileMenu(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-sky-50">
            <i data-lucide="home" class="w-5 h-5 text-slate-500"></i> Home
          </a>
          <a href="#report-lost" onclick="window.navbarComponent.toggleMobileMenu(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50">
            <i data-lucide="minus-circle" class="w-5 h-5"></i> Report Lost Item
          </a>
          <a href="#report-found" onclick="window.navbarComponent.toggleMobileMenu(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-600 hover:bg-emerald-50">
            <i data-lucide="plus-circle" class="w-5 h-5"></i> Report Found Item
          </a>
          <a href="#search" onclick="window.navbarComponent.toggleMobileMenu(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-sky-50">
            <i data-lucide="search" class="w-5 h-5 text-slate-500"></i> Search All Items
          </a>
          <a href="#about" onclick="window.navbarComponent.toggleMobileMenu(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-sky-50">
            <i data-lucide="info" class="w-5 h-5 text-slate-500"></i> About Us
          </a>
          ${user ? `
            <a href="#dashboard" onclick="window.navbarComponent.toggleMobileMenu(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-sky-700 hover:bg-sky-50">
              <i data-lucide="layout-dashboard" class="w-5 h-5 text-sky-600"></i> My Dashboard
            </a>
            ${user.role === 'admin' ? `
              <a href="#admin" onclick="window.navbarComponent.toggleMobileMenu(false)" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-50">
                <i data-lucide="shield-check" class="w-5 h-5 text-amber-600"></i> Admin Panel
              </a>
            ` : ''}
          ` : ''}

          <!-- Demo Role Switcher in Mobile Drawer -->
          <div class="pt-3 border-t border-slate-200">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Switch Demo Persona</div>
            <div class="grid grid-cols-2 gap-2 px-1">
              <button onclick="window.navbarComponent.selectPersona('student'); window.navbarComponent.toggleMobileMenu(false);" class="text-xs font-semibold py-2 px-2.5 bg-slate-100 rounded-lg text-slate-700 text-left">
                👤 Student (John)
              </button>
              <button onclick="window.navbarComponent.selectPersona('admin'); window.navbarComponent.toggleMobileMenu(false);" class="text-xs font-semibold py-2 px-2.5 bg-amber-100 text-amber-800 rounded-lg text-left">
                🛡️ Admin (Officer)
              </button>
            </div>
          </div>
        </div>
      </header>
    `;

    // Re-initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  togglePersonaDropdown(force) {
    const el = document.getElementById('persona-dropdown');
    if (el) el.classList.toggle('hidden', force !== undefined ? !force : undefined);
    this.closeOtherDropdowns('persona');
  }

  toggleNotifDropdown(force) {
    const el = document.getElementById('notif-dropdown');
    if (el) el.classList.toggle('hidden', force !== undefined ? !force : undefined);
    this.closeOtherDropdowns('notif');
  }

  toggleUserDropdown(force) {
    const el = document.getElementById('user-dropdown');
    if (el) el.classList.toggle('hidden', force !== undefined ? !force : undefined);
    this.closeOtherDropdowns('user');
  }

  toggleMobileMenu(force) {
    const el = document.getElementById('mobile-menu');
    if (el) el.classList.toggle('hidden', force !== undefined ? !force : undefined);
  }

  closeOtherDropdowns(except) {
    if (except !== 'persona') document.getElementById('persona-dropdown')?.classList.add('hidden');
    if (except !== 'notif') document.getElementById('notif-dropdown')?.classList.add('hidden');
    if (except !== 'user') document.getElementById('user-dropdown')?.classList.add('hidden');
  }

  selectPersona(role) {
    window.store.switchPersona(role);
    this.closeOtherDropdowns('');
    this.render();
    if (window.appRouter) {
      window.appRouter.renderCurrentRoute();
    }
  }
}

window.navbarComponent = new NavbarComponent();
