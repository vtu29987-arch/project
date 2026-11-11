/**
 * Auth Modal Component
 * Handles User Login, Registration, Forgot Password, and 1-Click Demo Logins.
 */

class AuthModalComponent {
  constructor() {
    this.currentMode = 'login'; // 'login' | 'register' | 'forgot'
  }

  show(mode = 'login') {
    this.currentMode = mode;
    let modal = document.getElementById('auth-modal-root');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'auth-modal-root';
      document.body.appendChild(modal);
    }

    this.render();
  }

  setMode(mode) {
    this.currentMode = mode;
    this.render();
  }

  render() {
    const modal = document.getElementById('auth-modal-root');
    if (!modal) return;

    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
        
        <div class="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-8 p-6 sm:p-8 space-y-6">
          
          <!-- Top Close & Brand -->
          <div class="flex items-center justify-between pb-2">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-sky-700 flex items-center justify-center text-white shadow-md">
                <i data-lucide="shield-search" class="w-5 h-5 text-sky-300"></i>
              </div>
              <span class="font-extrabold text-slate-900 text-lg heading-font">S.L.F.P. Access</span>
            </div>

            <button onclick="window.authModal.close()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Tabs (Login vs Register) -->
          ${this.currentMode !== 'forgot' ? `
            <div class="flex items-center p-1 bg-slate-100 rounded-2xl">
              <button onclick="window.authModal.setMode('login')" class="flex-1 py-2 text-xs font-bold rounded-xl transition-all ${this.currentMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}">
                Sign In
              </button>
              <button onclick="window.authModal.setMode('register')" class="flex-1 py-2 text-xs font-bold rounded-xl transition-all ${this.currentMode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}">
                Register Account
              </button>
            </div>
          ` : ''}

          <!-- Form Content -->
          ${this.currentMode === 'login' ? `
            <form onsubmit="window.authModal.handleLogin(event)" class="space-y-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="login-email" 
                  required 
                  value="john.doe@campus.edu" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <button type="button" onclick="window.authModal.setMode('forgot')" class="text-[11px] text-sky-600 hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <input 
                  type="password" 
                  id="login-password" 
                  required 
                  value="password123" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
              </div>

              <div class="flex items-center gap-2">
                <input type="checkbox" id="remember-me" checked class="rounded border-slate-300 text-sky-600 focus:ring-sky-500">
                <label for="remember-me" class="text-xs text-slate-600">Remember this device</label>
              </div>

              <button type="submit" class="w-full py-3 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-all">
                Sign In to Portal
              </button>
            </form>
          ` : (this.currentMode === 'register' ? `
            <form onsubmit="window.authModal.handleRegister(event)" class="space-y-3">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="reg-name" 
                  required 
                  placeholder="e.g. Alex Morgan" 
                  class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    id="reg-email" 
                    required 
                    placeholder="alex@campus.edu" 
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Number <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    id="reg-phone" 
                    required 
                    placeholder="+1 555-0192" 
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student ID
                  </label>
                  <input 
                    type="text" 
                    id="reg-studentid" 
                    placeholder="CS-2024-9102" 
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input 
                    type="text" 
                    id="reg-dept" 
                    placeholder="Engineering" 
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="password" 
                    id="reg-password" 
                    required 
                    placeholder="••••••••" 
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="password" 
                    id="reg-confirm-password" 
                    required 
                    placeholder="••••••••" 
                    class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                </div>
              </div>

              <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-slate-900 to-sky-700 hover:from-slate-800 hover:to-sky-600 text-white font-bold text-xs shadow-md transition-all">
                Create My Account
              </button>
            </form>
          ` : `
            <!-- Forgot Password View -->
            <div class="space-y-4">
              <div class="text-center">
                <h4 class="font-bold text-slate-900 text-base">Reset Your Password</h4>
                <p class="text-xs text-slate-500 mt-1">
                  Enter your registered campus email to receive a password reset verification token.
                </p>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Email Address
                </label>
                <input 
                  type="email" 
                  id="forgot-email" 
                  placeholder="your.email@campus.edu" 
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
              </div>

              <button onclick="window.authModal.handleForgotSubmit()" class="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all">
                Send Recovery Instructions
              </button>

              <button onclick="window.authModal.setMode('login')" class="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold">
                Back to Sign In
              </button>
            </div>
          `)}

          <!-- Quick 1-Click Demo Login Shortcuts (For Project Presentation) -->
          <div class="pt-4 border-t border-slate-100">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
              ⚡ 1-Click Demo Quick Login
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" onclick="window.navbarComponent.selectPersona('student'); window.authModal.close(); window.app.showToast('Logged in as Student John Doe!');" class="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs text-sky-900 font-semibold text-center transition-colors">
                👤 Student John
              </button>
              <button type="button" onclick="window.navbarComponent.selectPersona('admin'); window.authModal.close(); window.app.showToast('Logged in as Officer Sarah (Admin)!');" class="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs text-amber-900 font-semibold text-center transition-colors">
                🛡️ Admin Officer
              </button>
            </div>
          </div>

        </div>

      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const user = window.store.loginUser(email, password);
      this.close();
      window.app.showToast(`Welcome back, ${user.name}!`, 'success');
      window.location.hash = '#dashboard';
    } catch (err) {
      alert(err.message);
    }
  }

  handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const studentId = document.getElementById('reg-studentid').value.trim();
    const department = document.getElementById('reg-dept').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      const newUser = window.store.registerUser({
        name,
        email,
        phone,
        studentId,
        department
      });
      this.close();
      window.app.showToast(`Account created successfully! Welcome, ${newUser.name}.`, 'success');
      window.location.hash = '#dashboard';
    } catch (err) {
      alert(err.message);
    }
  }

  handleForgotSubmit() {
    const email = document.getElementById('forgot-email')?.value.trim();
    if (!email) {
      alert('Please enter your email.');
      return;
    }
    alert(`A password reset link and 6-digit recovery code has been dispatched to ${email}. (Demo Simulation)`);
    this.setMode('login');
  }

  close() {
    const modal = document.getElementById('auth-modal-root');
    if (modal) modal.remove();
  }
}

window.authModal = new AuthModalComponent();
