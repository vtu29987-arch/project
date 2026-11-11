# Smart Lost and Found Portal (S.L.F.P.)

> A modern, responsive, and secure web application designed to help university and college communities report lost belongings, log found items, search missing items with advanced multi-parameter filters, and safely recover valuables through verified ownership claims.

---

## 🛠️ Making the Project Live: Solutions to Common Issues

If you experienced any issues when making the project live or opening it in VS Code Live Server, here is what caused it and how it has been fixed:

### 1. The VS Code Live Server Root Folder Issue
- **The Problem:** In VS Code, if you opened a parent directory (like `C:\Users\VYSHH\` or the `scratch\` folder) and clicked "Go Live", Live Server served the parent directory as the web root (`http://127.0.0.1:5500/`), breaking relative links like `./js/` and `./assets/`.
- **The Fix:** Always open the **specific project folder**:
  1. In VS Code: **File** $\rightarrow$ **Open Folder...**
  2. Select: `C:\Users\VYSHH\.gemini\antigravity\scratch\smart-lost-and-found-portal`
  3. Right-click `index.html` $\rightarrow$ **Open with Live Server**.

### 2. DOM Ready State Initialization Fix
- **The Problem:** In some live servers and fast browsers, `DOMContentLoaded` fired before the bottom scripts were bound, leaving the main content container blank.
- **The Fix:** `app.js` now checks `document.readyState`. If the DOM is already parsed (`interactive` or `complete`), the application initializes immediately.

### 3. Self-Contained Local Image Assets
- **The Problem:** Previously, items used remote Unsplash URLs that could fail when offline, behind university firewalls, or due to ad-blockers.
- **The Fix:** All 13 items and user avatars are now stored locally in `./assets/images/` as high-definition, responsive SVGs.

---

## 🖼️ Local Image Assets Directory & Paths

All images are stored inside the project folder at:
```text
smart-lost-and-found-portal/assets/images/
```

| Asset Name | Relative File Path | Used For |
| :--- | :--- | :--- |
| **iPhone 13 Pro** | `./assets/images/iphone.svg` | Lost & Found Apple Smartphones |
| **MacBook / Laptop** | `./assets/images/laptop.svg` | Laptops, MacBooks & Computers |
| **Samsonite Backpack** | `./assets/images/backpack.svg` | Backpacks, College Bags & Totes |
| **Car & Key Set** | `./assets/images/keys.svg` | Keys, Lanyards & Vehicle Fobs |
| **Leather Wallet** | `./assets/images/wallet.svg` | Wallets, Purses & Cardholders |
| **Casio Calculator** | `./assets/images/calculator.svg` | Scientific Calculators & Tech Tools |
| **Sony Headphones** | `./assets/images/headphones.svg` | Over-ear & Wireless Headphones |
| **Ray-Ban Sunglasses**| `./assets/images/sunglasses.svg` | Eyeglasses & Sunglasses |
| **Hydro Flask Bottle** | `./assets/images/waterbottle.svg`| Water Bottles & Tumblers |
| **Student ID Card** | `./assets/images/student-id.svg` | Campus Cards & Driver Licenses |
| **John Doe Avatar** | `./assets/images/avatar-john.svg` | Student Persona Profile Picture |
| **Emma Watson Avatar**| `./assets/images/avatar-emma.svg`| Student Persona Profile Picture |
| **Officer Sarah Avatar**| `./assets/images/avatar-sarah.svg`| Admin Security Officer Profile Picture |

---

## 🚀 How to Run the Application

### Method 1: Double-Click (No Server Needed)
1. Navigate to:
   ```text
   C:\Users\VYSHH\.gemini\antigravity\scratch\smart-lost-and-found-portal
   ```
2. Double-click **`index.html`** to open directly in Google Chrome, Microsoft Edge, or Firefox.

### Method 2: VS Code Live Server
1. Open VS Code.
2. Go to **File** $\rightarrow$ **Open Folder...**
3. Select `C:\Users\VYSHH\.gemini\antigravity\scratch\smart-lost-and-found-portal`.
4. Right-click **`index.html`** in the left sidebar and choose **"Open with Live Server"**.
5. It will automatically open `http://127.0.0.1:5500/index.html`.

### Method 3: Deploy Free Online (GitHub Pages / Vercel / Netlify)
Because this project is a pure, static SPA with relative paths:
1. **GitHub Pages:** Push this repository to GitHub, go to *Settings* $\rightarrow$ *Pages* $\rightarrow$ select `main` branch $\rightarrow$ *Save*.
2. **Netlify / Vercel:** Drag and drop the `smart-lost-and-found-portal` folder onto [Netlify Drop](https://app.netlify.com/drop) or [Vercel](https://vercel.com) for a free live `.app` URL!

---

## 🌟 Key Application Features

1. **Design System & Theme**:
   - Modern, professional UI adhering to the **Navy Blue, White, and Light Blue** palette.
   - Rounded cards (`rounded-3xl`), soft ambient shadows, smooth hover transitions, and clean typography (*Plus Jakarta Sans* & *Space Grotesk*).
   - Fully responsive across desktop, tablet, and mobile devices with a slide-out mobile drawer.

2. **Interactive Landing Page (Home)**:
   - Branded top navigation bar with live notification badge.
   - Hero section with headline: *"Lost Something? Let's Help You Find It!"*
   - Dual Call-To-Action buttons: **Report Lost Item** (Rose) & **Report Found Item** (Emerald).
   - Real-time campus recovery metrics banner (Total Lost, Total Found, Safe Returns, Resolution Rate).
   - Recently reported items grid with live filter tabs (*All*, *Lost*, *Found*).
   - "How It Works" 3-step breakdown: **1. Report** $\rightarrow$ **2. Smart AI Match** $\rightarrow$ **3. Claim & Recover**.
   - About Us section highlighting campus safety, security partnership, and helpdesk contact details.
   - Rich footer with campus contacts, office hours, links, and social icons.

3. **User Authentication & 1-Click Demo Personas**:
   - Registration with Full Name, Email, Mobile Number, Student ID, Department, and Password confirmation.
   - Login with "Remember Me" and Forgot Password recovery flow.
   - **1-Click Persona Switcher** in the top navigation bar to seamlessly test:
     - 👤 **Student: John Doe** (CSE Dept)
     - 👤 **Student: Emma Watson** (Biotech Dept)
     - 🛡️ **Admin: Officer Sarah Jenkins** (Campus Security & Lost Property Custody)
     - 🌐 **Guest Visitor** (Public view)

4. **Personalized User Dashboard**:
   - Real-time campus counters and personalized report metrics.
   - Filterable view of user's reported belongings with status badges (*Open*, *Claim Pending*, *Recovered*).
   - "My Claims" tracking table with live verification status (*Pending Review*, *Approved*, *Rejected*).
   - Direct shortcuts to report items or browse the directory.

5. **Report Lost & Found Items**:
   - Comprehensive forms capturing Item Name, Category, Date, Location (with campus datalist suggestions), Description, and Contact info.
   - Image upload with instant live preview.
   - **1-Click Preset Test Photos** (iPhone, MacBook, Wallet, Keys, Calculator, Headphones, etc.) so evaluators don't need to hunt for sample files.
   - **Confidential Verification Note** (e.g. IMEI, lockscreen wallpaper, secret markings) kept hidden from public view for fraud prevention.
   - Immediate semantic match check upon submission!

6. **Advanced Multi-Filter Search**:
   - Live real-time search bar (by item title, description, reference code `#SLFP-...`).
   - Category filter (Electronics, Bags, Keys, Wallets, Documents, Stationery, etc.).
   - Campus Location filter.
   - Time range filter (Today, Past 7 Days, Past 30 Days, Any Date).
   - Status toggle (*All*, *Lost Only*, *Found Only*).
   - Sorting by newest or oldest reported.
   - Empty state with 1-click filter reset.

7. **Item Details & Smart Match Engine**:
   - Detailed modal showing high-res photo, reference code, status, reporter profile, and custody details.
   - **Smart Matching Engine**: Semantic algorithm calculating similarity percentage based on category match, keyword tokens, location proximity, and chronological plausibility. Displays high-confidence recommendations with direct links to inspect matches!
   - Action triggers:
     - **Claim Item (Prove Ownership)** for found items.
     - **I Found This Belonging!** for lost items (notifies the owner).
     - **Print Notice Poster** (generates printable campus bulletin).
     - **Share Link** (copies URL to clipboard).

8. **Claim Ownership Workflow**:
   - Claim submission modal capturing claimant name, phone, email, and identifying secret proof.
   - Updates claim status to *Pending* and marks the item as *Claim Under Review*.
   - Automatically dispatches notification to Campus Security Admin.

9. **Campus Security Admin Dashboard**:
   - Elevated control panel for Security Officers.
   - Key metrics: Total Registered Users, Lost Reports, Found Reports, Claims Filed, Safe Returns, Success Rate.
   - **Verify Claims Tab**: Inspect claimant's submitted proof against the item's details. One-click **Approve Claim** (which auto-notifies the claimant and marks the item recovered) or **Reject Claim** (with reason prompt).
   - **Manage Reports Tab**: View all items, filter by type, mark recovered, or delete duplicate/inappropriate posts.
   - **Registered Users Tab**: Member directory with roles and departments.
   - **Export Audit Data**: Instant download of reports into a clean JSON file.

10. **Printable Notice Board Poster**:
    - Generates a high-visibility physical notice bulletin ready for printing or saving as PDF with QR code simulation.

11. **Persistent Local State**:
    - Uses HTML5 `localStorage` to persist all reports, claims, users, notifications, and status changes across browser reloads.
    - Includes a **Reset Demo Data** option in the footer to restore the initial test state anytime.
