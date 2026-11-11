/**
 * Poster Modal Component
 * Generates an instant printable Bulletin Notice Poster with QR code simulation
 * for physical campus notice boards.
 */

class PosterModalComponent {
  constructor() {}

  show(itemId) {
    const item = window.store.getItemById(itemId);
    if (!item) return;

    const isLost = item.type === 'lost';

    let modal = document.getElementById('poster-modal-root');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'poster-modal-root';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in no-print">
        
        <div class="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 p-6 space-y-6">
          
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <i data-lucide="printer" class="w-5 h-5 text-sky-600"></i>
              <h3 class="text-lg font-bold text-slate-900">Printable Notice Board Poster</h3>
            </div>
            <button onclick="window.posterModal.close()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>

          <!-- Printable Area Preview -->
          <div id="printable-poster-area" class="border-4 ${isLost ? 'border-rose-600 bg-rose-50/20' : 'border-emerald-600 bg-emerald-50/20'} rounded-2xl p-6 text-center space-y-4 shadow-sm bg-white">
            
            <div class="space-y-1">
              <div class="text-xs font-mono font-bold tracking-widest text-slate-400">SMART LOST & FOUND PORTAL • CAMPUS NOTICE</div>
              <h1 class="text-3xl sm:text-4xl font-extrabold uppercase tracking-wider ${isLost ? 'text-rose-600' : 'text-emerald-700'}">
                ${isLost ? '⚠️ MISSING ITEM ⚠️' : '📢 FOUND BELONGING 📢'}
              </h1>
            </div>

            <div class="relative w-48 h-48 mx-auto rounded-xl overflow-hidden border-2 border-slate-200 shadow-md">
              <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
            </div>

            <div class="space-y-2">
              <h2 class="text-2xl font-bold text-slate-900">${item.title}</h2>
              <div class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                ${item.category} • Ref: ${item.refCode}
              </div>
              <p class="text-xs text-slate-600 max-w-md mx-auto text-left bg-slate-50 p-3 rounded-xl border border-slate-200">
                ${item.description}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 max-w-md mx-auto text-left pt-2">
              <div class="bg-white p-2 rounded-lg border border-slate-200">
                <span class="text-[10px] text-slate-400 block uppercase font-bold">Date</span>
                ${item.date}
              </div>
              <div class="bg-white p-2 rounded-lg border border-slate-200">
                <span class="text-[10px] text-slate-400 block uppercase font-bold">Location</span>
                <span class="truncate block">${item.location}</span>
              </div>
            </div>

            <!-- Simulated QR code for scanning -->
            <div class="pt-2 flex items-center justify-between border-t-2 border-dashed border-slate-300 max-w-md mx-auto">
              <div class="text-left text-xs text-slate-500">
                <div class="font-bold text-slate-900">Scan to Claim or Report:</div>
                <div class="text-[10px]">Smart Lost and Found Portal (S.L.F.P.)</div>
                <div class="text-[10px] font-mono text-sky-600 mt-0.5">https://slfp.campus.edu/#item/${item.id}</div>
              </div>
              <div class="w-16 h-16 bg-slate-900 p-1 rounded-lg shrink-0 flex items-center justify-center text-white text-[8px] text-center font-mono">
                [ QR CODE ]
              </div>
            </div>

          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button onclick="window.posterModal.close()" class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button onclick="window.print()" class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>Print Bulletin Poster (PDF)</span>
            </button>
          </div>

        </div>

      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  close() {
    const modal = document.getElementById('poster-modal-root');
    if (modal) modal.remove();
  }
}

window.posterModal = new PosterModalComponent();
