/**
 * Claim Modal Component
 * Handles filing ownership claims on found items and notifying owners of lost items.
 */

class ClaimModalComponent {
  constructor() {}

  show(itemId) {
    const item = window.store.getItemById(itemId);
    if (!item) return;

    const currentUser = window.store.getCurrentUser();

    let modal = document.getElementById('claim-action-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'claim-action-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
        
        <div class="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 p-6 sm:p-8 space-y-6">
          
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <i data-lucide="shield-check" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-xl font-extrabold text-slate-900 heading-font">Claim Ownership</h3>
                <p class="text-xs text-slate-500">Submit proof to campus security to recover this item</p>
              </div>
            </div>
            
            <button onclick="window.claimModal.close()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Item Recap -->
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <img src="${item.image}" alt="${item.title}" class="w-14 h-14 rounded-xl object-cover shrink-0">
            <div class="flex-1 min-w-0">
              <div class="text-[10px] font-mono text-slate-400 font-bold">${item.refCode}</div>
              <div class="text-xs font-bold text-slate-900 truncate">${item.title}</div>
              <div class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                <i data-lucide="map-pin" class="w-3 h-3 text-sky-500 shrink-0"></i>
                <span class="truncate">Found at: ${item.location}</span>
              </div>
            </div>
          </div>

          <!-- The Claim Form -->
          <form id="claim-submit-form" onsubmit="window.claimModal.handleSubmit(event, '${item.id}')" class="space-y-4">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Full Name <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="claim-name" 
                  required 
                  value="${currentUser ? currentUser.name : ''}" 
                  placeholder="e.g. John Doe" 
                  class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="claim-email" 
                  required 
                  value="${currentUser ? currentUser.email : ''}" 
                  placeholder="john.doe@campus.edu" 
                  class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number <span class="text-rose-500">*</span>
              </label>
              <input 
                type="tel" 
                id="claim-phone" 
                required 
                value="${currentUser ? currentUser.phone : ''}" 
                placeholder="+1 (555) 234-5678" 
                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Proof of Ownership / Identifying Secret Details <span class="text-rose-500">*</span>
              </label>
              <p class="text-[10px] text-slate-500 mb-2">
                Describe distinguishing features only the owner knows (e.g. passcode/lockscreen wallpaper, internal serial number, unique scratches, exact contents of bag/wallet).
              </p>
              <textarea 
                id="claim-proof" 
                rows="3" 
                required 
                placeholder="e.g. The phone has my dog Max as the lockscreen wallpaper; inside the case is a GitHub sticker and my student ID 8841." 
                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <!-- Optional Document Upload Simulation -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Attach Supporting Photo / Receipt (Optional)
              </label>
              <div class="flex items-center gap-2">
                <input 
                  type="file" 
                  id="claim-doc-file" 
                  accept="image/*" 
                  class="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                >
              </div>
            </div>

            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <i data-lucide="info" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
              <span>False claims are strictly prohibited under university conduct policies. Campus Security verifies all submissions before handover.</span>
            </div>

            <div class="pt-2 flex items-center justify-end gap-3">
              <button type="button" onclick="window.claimModal.close()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5">
                <i data-lucide="send" class="w-3.5 h-3.5"></i>
                Submit Claim Request
              </button>
            </div>

          </form>

        </div>

      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  showFoundReport(lostItemId) {
    const item = window.store.getItemById(lostItemId);
    if (!item) return;

    let modal = document.getElementById('claim-action-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'claim-action-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
        <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-5">
          <div class="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
            <i data-lucide="heart-handshake" class="w-7 h-7"></i>
          </div>

          <div class="text-center">
            <h3 class="text-xl font-extrabold text-slate-900 heading-font">You Found This Belonging?</h3>
            <p class="text-xs text-slate-500 mt-1">
              Thank you for helping our campus community! Please choose how you want to proceed:
            </p>
          </div>

          <div class="space-y-3 pt-2">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <i data-lucide="phone-call" class="w-5 h-5 text-sky-600 shrink-0 mt-0.5"></i>
              <div class="text-xs">
                <div class="font-bold text-slate-900">Direct Contact with Reporter:</div>
                <div class="text-slate-600 mt-0.5">Name: ${item.reportedBy.name}</div>
                <div class="text-slate-600 font-mono mt-0.5">Phone: ${item.reportedBy.phone || 'Available via Security'}</div>
                <div class="text-slate-600 font-mono mt-0.5">Email: ${item.reportedBy.email}</div>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <i data-lucide="shield-check" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"></i>
              <div class="text-xs">
                <div class="font-bold text-emerald-950">Recommended Safe Handover:</div>
                <div class="text-emerald-800 mt-0.5">
                  Deposit the item at <strong>Campus Security Desk #1 (Main Gate)</strong> referencing code <strong>${item.refCode}</strong>.
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-3">
            <button onclick="window.claimModal.close(); window.app.showToast('Reporter notified that their item has been located!');" class="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all">
              Notify Owner & Campus Security
            </button>
            <button onclick="window.claimModal.close()" class="w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  handleSubmit(e, itemId) {
    e.preventDefault();

    const claimantName = document.getElementById('claim-name').value.trim();
    const claimantEmail = document.getElementById('claim-email').value.trim();
    const claimantPhone = document.getElementById('claim-phone').value.trim();
    const proofDescription = document.getElementById('claim-proof').value.trim();

    window.store.addClaim({
      itemId,
      claimantName,
      claimantEmail,
      claimantPhone,
      proofDescription
    });

    this.close();
    window.app.showToast('Claim request submitted successfully! Awaiting Admin verification.', 'success');
    window.location.hash = '#dashboard';
  }

  close() {
    const modal = document.getElementById('claim-action-modal');
    if (modal) modal.remove();
  }
}

window.claimModal = new ClaimModalComponent();
