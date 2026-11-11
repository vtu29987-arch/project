/**
 * Report Forms Component
 * Handles Report Lost Item and Report Found Item views with image upload,
 * preset pickers, field validation, and instant match checking.
 */

class ReportFormsComponent {
  constructor() {
    this.selectedImageUrl = '';
  }

  setImagePreview(url) {
    this.selectedImageUrl = url;
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('image-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    
    if (previewContainer && previewImg && uploadPlaceholder) {
      if (url) {
        previewImg.src = url;
        previewContainer.classList.remove('hidden');
        uploadPlaceholder.classList.add('hidden');
      } else {
        previewContainer.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
      }
    }
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  render(type = 'lost') {
    const isLost = type === 'lost';
    const currentUser = window.store ? window.store.getCurrentUser() : null;
    this.selectedImageUrl = PRESET_IMAGES[isLost ? 0 : 3].url; // sensible default

    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        
        <!-- Breadcrumb / Header -->
        <div class="mb-8">
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
            <a href="#home" class="hover:text-sky-600">Home</a>
            <span>/</span>
            <span class="${isLost ? 'text-rose-600' : 'text-emerald-600'} font-bold">
              ${isLost ? 'Report Lost Belonging' : 'Report Found Belonging'}
            </span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-3xl font-extrabold text-slate-900 heading-font flex items-center gap-3">
                <span class="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${
                  isLost ? 'bg-gradient-to-r from-rose-500 to-rose-700 shadow-rose-500/20' : 'bg-gradient-to-r from-emerald-500 to-teal-700 shadow-emerald-500/20'
                }">
                  <i data-lucide="${isLost ? 'minus-circle' : 'plus-circle'}" class="w-6 h-6"></i>
                </span>
                <span>${isLost ? 'Report a Lost Item' : 'Report a Found Item'}</span>
              </h1>
              <p class="text-slate-500 text-sm mt-1">
                ${isLost 
                  ? 'Fill out the details below. Our Smart AI will immediately search our database for matches!' 
                  : 'Thank you for your honesty! Log the item details so the rightful owner can safely claim it.'}
              </p>
            </div>

            <!-- Quick Switch to Opposite Form -->
            <a href="${isLost ? '#report-found' : '#report-lost'}" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 self-start">
              <span>Switch to ${isLost ? 'Found' : 'Lost'} Report</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>


        <!-- The Form Card -->
        <div class="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10">
          <form id="report-form" onsubmit="window.reportFormsComponent.handleSubmit(event, '${type}')" class="space-y-8">
            
            <!-- Section 1: Item Core Details -->
            <div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs">1</span>
                <span>Item Identification</span>
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Item Name -->
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Item Name / Title <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="item-title" 
                    required 
                    placeholder="e.g. Midnight Blue iPhone 13 Pro, Brown Fossil Wallet, Casio Scientific Calculator" 
                    class="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-slate-900 placeholder-slate-400"
                  >
                </div>

                <!-- Category -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Category <span class="text-rose-500">*</span>
                  </label>
                  <select 
                    id="item-category" 
                    required 
                    class="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-slate-900 bg-white"
                  >
                    <option value="" disabled selected>Select a category...</option>
                    ${CATEGORIES.map(cat => `
                      <option value="${cat.id}">${cat.name}</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Date -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    ${isLost ? 'Date Lost' : 'Date Found'} <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    id="item-date" 
                    required 
                    value="${new Date().toISOString().split('T')[0]}"
                    class="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-slate-900"
                  >
                </div>

                <!-- Location -->
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    ${isLost ? 'Lost Location / Last Seen Area' : 'Location Found'} <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <input 
                      type="text" 
                      id="item-location" 
                      required 
                      placeholder="e.g. Central Library 2nd Floor Cubicle B-14, Cafeteria Table #4, Science Block Room 304" 
                      list="campus-locations-list"
                      class="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-slate-900 placeholder-slate-400"
                    >
                    <datalist id="campus-locations-list">
                      ${LOCATIONS.map(loc => `<option value="${loc}"></option>`).join('')}
                    </datalist>
                  </div>
                </div>

                ${!isLost ? `
                  <!-- Safe keeping location for found items -->
                  <div class="md:col-span-2">
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Current Safe-Keeping Location / Deposited At <span class="text-emerald-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="item-safe-location" 
                      required 
                      placeholder="e.g. Deposited at Security Desk #1 Main Gate, Left with Department Secretary, Or with Finder" 
                      class="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm text-slate-900 placeholder-slate-400"
                    >
                  </div>
                ` : ''}

                <!-- Description -->
                <div class="md:col-span-2">
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Detailed Physical Description <span class="text-rose-500">*</span>
                  </label>
                  <textarea 
                    id="item-description" 
                    rows="4" 
                    required 
                    placeholder="Describe brand, color, size, case, condition, distinguishing stickers, scratches, contents..." 
                    class="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-slate-900 placeholder-slate-400"
                  ></textarea>
                </div>

              </div>
            </div>


            <!-- Section 2: Photo Upload & Preset Selection -->
            <div class="pt-4 border-t border-slate-100">
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs">2</span>
                <span>Upload Item Image</span>
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                <!-- Upload Dropzone -->
                <div class="md:col-span-6">
                  <div class="relative border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-3xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
                    <input 
                      type="file" 
                      id="item-file-input" 
                      accept="image/*" 
                      onchange="window.reportFormsComponent.handleFileUpload(event)" 
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                    
                    <div id="upload-placeholder" class="${this.selectedImageUrl ? 'hidden' : ''}">
                      <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
                        <i data-lucide="upload-cloud" class="w-6 h-6"></i>
                      </div>
                      <div class="text-xs font-bold text-slate-800 mb-1">Click to upload photo or drag & drop</div>
                      <div class="text-[11px] text-slate-400">PNG, JPG, WEBP up to 5MB</div>
                    </div>

                    <!-- Image Preview -->
                    <div id="image-preview-container" class="${!this.selectedImageUrl ? 'hidden' : ''} space-y-3">
                      <img id="image-preview" src="${this.selectedImageUrl}" alt="Preview" class="max-h-48 mx-auto rounded-2xl object-cover shadow-sm">
                      <div class="text-xs text-sky-600 font-semibold flex items-center justify-center gap-1">
                        <i data-lucide="check" class="w-4 h-4 text-emerald-500"></i> Photo Attached (Click to change)
                      </div>
                    </div>
                  </div>
                </div>

                <!-- One-Click Preset Image Pickers (For Demo Convenience) -->
                <div class="md:col-span-6 bg-slate-50 p-4 rounded-3xl border border-slate-200/80">
                  <div class="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                    <span>Or Select a Quick Sample Photo:</span>
                    <span class="text-[10px] text-sky-600 font-normal">1-Click Test Presets</span>
                  </div>
                  <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                    ${PRESET_IMAGES.map((img, idx) => `
                      <button 
                        type="button" 
                        onclick="window.reportFormsComponent.setImagePreview('${img.url}')" 
                        class="p-1 rounded-xl border border-slate-200 hover:border-sky-500 bg-white hover:shadow-sm transition-all text-center group"
                        title="${img.label}"
                      >
                        <img src="${img.url}" class="w-full h-12 object-cover rounded-lg group-hover:scale-105 transition-transform">
                        <span class="text-[9px] text-slate-600 font-medium block truncate mt-1">${img.label}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>

              </div>
            </div>


            <!-- Section 3: Reporter Contact & Confidential Verification -->
            <div class="pt-4 border-t border-slate-100">
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs">3</span>
                <span>Contact & Ownership Security</span>
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Full Name <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    required 
                    value="${currentUser ? currentUser.name : ''}"
                    placeholder="e.g. John Doe" 
                    class="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm text-slate-900"
                  >
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    required 
                    value="${currentUser ? currentUser.email : ''}"
                    placeholder="student@campus.edu" 
                    class="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm text-slate-900"
                  >
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone / Mobile Number <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    id="contact-phone" 
                    required 
                    value="${currentUser ? currentUser.phone : ''}"
                    placeholder="+1 (555) 000-0000" 
                    class="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-sm text-slate-900"
                  >
                </div>

                <!-- Confidential Verification Note -->
                <div class="md:col-span-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                  <div class="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                    <i data-lucide="shield-alert" class="w-4 h-4 text-amber-600"></i>
                    Confidential Verification Note (Hidden from Public View)
                  </div>
                  <p class="text-[11px] text-amber-700 mb-2">
                    Provide private details that only the true owner would know (e.g. IMEI / serial number, lockscreen wallpaper, exact cash amount, or contents of hidden zipper pocket).
                  </p>
                  <input 
                    type="text" 
                    id="confidential-notes" 
                    placeholder="e.g. Serial ending in #4091; lockscreen shows golden retriever; contains student ID card" 
                    class="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-white text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-amber-500"
                  >
                </div>

              </div>
            </div>


            <!-- Submit Button & Confirmation -->
            <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-500"></i>
                <span>Your report will be immediately cross-checked by our AI matching engine.</span>
              </div>

              <button 
                type="submit" 
                id="submit-report-btn"
                class="w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-sm text-white shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                  isLost 
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-rose-600/30' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-600/30'
                }"
              >
                <i data-lucide="send" class="w-4 h-4"></i>
                <span>Submit ${isLost ? 'Lost Item Report' : 'Found Item Report'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    `;
  }

  handleSubmit(e, type) {
    e.preventDefault();

    const title = document.getElementById('item-title').value.trim();
    const category = document.getElementById('item-category').value;
    const date = document.getElementById('item-date').value;
    const location = document.getElementById('item-location').value.trim();
    const description = document.getElementById('item-description').value.trim();
    const contactName = document.getElementById('contact-name').value.trim();
    const contactEmail = document.getElementById('contact-email').value.trim();
    const contactPhone = document.getElementById('contact-phone').value.trim();
    const confidentialNotes = document.getElementById('confidential-notes').value.trim();
    const safeLocation = document.getElementById('item-safe-location')?.value.trim() || '';

    const newItem = window.store.addItem({
      title,
      type,
      category,
      date,
      location,
      safeLocation,
      description,
      image: this.selectedImageUrl || PRESET_IMAGES[0].url,
      contactName,
      contactEmail,
      contactPhone,
      confidentialNotes
    });

    // Check for immediate matches using SmartMatchingEngine
    const matches = window.matchingEngine.findMatchesForItem(newItem, 45);

    // Show celebratory confirmation modal with match preview!
    this.showConfirmationModal(newItem, matches);
  }

  showConfirmationModal(item, matches) {
    let modal = document.getElementById('report-confirmation-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'report-confirmation-modal';
      document.body.appendChild(modal);
    }

    const hasMatches = matches.length > 0;
    const topMatch = hasMatches ? matches[0] : null;

    modal.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6">
          
          <div class="w-16 h-16 rounded-3xl ${item.type === 'lost' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'} mx-auto flex items-center justify-center shadow-inner">
            <i data-lucide="check-check" class="w-8 h-8"></i>
          </div>

          <div>
            <span class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">${item.refCode}</span>
            <h3 class="text-2xl font-extrabold text-slate-900 heading-font mt-1">Report Published Successfully!</h3>
            <p class="text-xs text-slate-500 mt-2">
              Your ${item.type} report for "<strong>${item.title}</strong>" is now live on the portal.
            </p>
          </div>

          ${hasMatches ? `
            <!-- Immediate Match Alert -->
            <div class="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-left space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                  <i data-lucide="sparkles" class="w-4 h-4 text-sky-600"></i>
                  Potential Match Detected (${topMatch.score}%)
                </span>
                <span class="text-[10px] bg-sky-200 text-sky-900 font-bold px-2 py-0.5 rounded-full">AI Alert</span>
              </div>

              <div class="flex items-center gap-3">
                <img src="${topMatch.matchedItem.image}" class="w-12 h-12 rounded-xl object-cover">
                <div class="text-xs">
                  <div class="font-bold text-slate-900">${topMatch.matchedItem.title}</div>
                  <div class="text-slate-500">${topMatch.matchedItem.location}</div>
                </div>
              </div>

              <a href="#item/${topMatch.matchedItem.id}" onclick="document.getElementById('report-confirmation-modal').remove()" class="block w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs text-center transition-colors">
                Inspect Match & Claim
              </a>
            </div>
          ` : `
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-left flex items-start gap-3">
              <i data-lucide="bell" class="w-5 h-5 text-sky-600 shrink-0 mt-0.5"></i>
              <div>
                <strong>Automated Monitoring Active:</strong> You will receive an instant notification if someone reports a matching item.
              </div>
            </div>
          `}

          <div class="flex items-center gap-3 pt-2">
            <button onclick="document.getElementById('report-confirmation-modal').remove(); window.itemDetailsComponent.show('${item.id}');" class="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors">
              View My Report
            </button>
            <button onclick="document.getElementById('report-confirmation-modal').remove(); window.location.hash='#search';" class="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
              Browse Portal
            </button>
          </div>

        </div>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

window.reportFormsComponent = new ReportFormsComponent();
