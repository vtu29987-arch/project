/**
 * Main Application Orchestrator & Router
 * Connects store, navbar, router, modal dialogs, and toast alerts.
 */

class AppRouter {
  constructor() {
    this.routes = {
      '': () => this.renderHome(),
      '#home': () => this.renderHome(),
      '#about': () => this.renderHomeAndScrollAbout(),
      '#report-lost': () => this.renderReportForm('lost'),
      '#report-found': () => this.renderReportForm('found'),
      '#search': () => this.renderSearch(),
      '#dashboard': () => this.renderDashboard(),
      '#admin': () => this.renderAdmin(),
      '#notifications': () => this.renderNotifications()
    };

    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('click', (e) => this.handleGlobalClick(e));
  }

  init() {
    if (window.navbarComponent) {
      window.navbarComponent.render();
    }
    this.handleRouteChange();
    
    // Subscribe store updates to update UI dynamically
    window.store.subscribe('items-updated', () => {
      const hash = window.location.hash;
      if (hash === '' || hash === '#home') {
        window.homeComponent.renderRecentItems();
      } else if (hash === '#search') {
        window.searchComponent.filterAndRender();
      } else if (hash === '#dashboard') {
        window.dashboardComponent.renderTabs();
      } else if (hash === '#admin') {
        window.adminComponent.renderTabs();
      }
    });

    window.store.subscribe('claims-updated', () => {
      const hash = window.location.hash;
      if (hash === '#dashboard') {
        window.dashboardComponent.renderTabs();
      } else if (hash === '#admin') {
        window.adminComponent.renderTabs();
      }
    });
  }

  handleGlobalClick(e) {
    // Close persona dropdown if clicked outside
    if (!e.target.closest('#persona-btn') && !e.target.closest('#persona-dropdown')) {
      document.getElementById('persona-dropdown')?.classList.add('hidden');
    }
    // Close notif dropdown if clicked outside
    if (!e.target.closest('#notif-btn') && !e.target.closest('#notif-dropdown')) {
      document.getElementById('notif-dropdown')?.classList.add('hidden');
    }
    // Close user dropdown if clicked outside
    if (!e.target.closest('#user-menu-btn') && !e.target.closest('#user-dropdown')) {
      document.getElementById('user-dropdown')?.classList.add('hidden');
    }
  }

  handleRouteChange() {
    let rawHash = window.location.hash;
    if (!rawHash || rawHash === '#' || rawHash === '#/' || rawHash === '') {
      rawHash = '#home';
    }
    const main = document.getElementById('main-content');
    if (!main) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle parameterized routes like #item/:id
    if (rawHash.startsWith('#item/')) {
      const itemId = rawHash.replace('#item/', '');
      this.renderHome(); // background view
      setTimeout(() => {
        if (window.itemDetailsComponent) {
          window.itemDetailsComponent.show(itemId);
        }
      }, 50);
      return;
    }

    const handler = this.routes[rawHash] || this.routes['#home'];
    if (handler) {
      handler();
    }

    // Update active state in nav links
    this.updateActiveNav(rawHash);

    // Re-initialize Lucide icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    } else {
      setTimeout(() => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      }, 150);
    }
  }

  renderCurrentRoute() {
    this.handleRouteChange();
  }

  updateActiveNav(hash) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === hash) {
        link.classList.add('text-sky-600', 'font-bold');
      } else {
        link.classList.remove('text-sky-600', 'font-bold');
      }
    });
  }

  renderHome() {
    const main = document.getElementById('main-content');
    main.innerHTML = window.homeComponent.render();
    window.homeComponent.renderRecentItems();
  }

  renderHomeAndScrollAbout() {
    this.renderHome();
    setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  renderReportForm(type) {
    const main = document.getElementById('main-content');
    main.innerHTML = window.reportFormsComponent.render(type);
  }

  renderSearch() {
    const main = document.getElementById('main-content');
    main.innerHTML = window.searchComponent.render();
    window.searchComponent.filterAndRender();
  }

  renderDashboard() {
    const main = document.getElementById('main-content');
    main.innerHTML = window.dashboardComponent.render();
    window.dashboardComponent.renderTabs();
  }

  renderAdmin() {
    const main = document.getElementById('main-content');
    main.innerHTML = window.adminComponent.render();
    window.adminComponent.renderTabs();
  }

  renderNotifications() {
    const main = document.getElementById('main-content');
    main.innerHTML = window.notificationsComponent.render();
    window.notificationsComponent.renderList();
  }

  showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `p-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in pointer-events-auto ${
      type === 'success' ? 'border-l-4 border-l-emerald-500' : (type === 'error' ? 'border-l-4 border-l-rose-500' : 'border-l-4 border-l-sky-500')
    }`;

    toast.innerHTML = `
      <div class="flex-1">${message}</div>
      <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white">✕</button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Instantiate and initialize when DOM is ready
window.app = new AppRouter();
window.appRouter = window.app;
function launchApp() {
  if (window.app) {
    window.app.init();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', launchApp);
} else {
  // DOM is already ready (e.g. scripts loaded at bottom of body or in Live Server)
  launchApp();
}
