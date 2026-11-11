/**
 * Initial Mock Data for Smart Lost and Found Portal (S.L.F.P.)
 * Uses 100% self-contained local SVG asset paths for offline & Live Server reliability.
 */

const LOCAL_IMAGES = {
  iphone: './assets/images/iphone.svg',
  laptop: './assets/images/laptop.svg',
  backpack: './assets/images/backpack.svg',
  keys: './assets/images/keys.svg',
  wallet: './assets/images/wallet.svg',
  calculator: './assets/images/calculator.svg',
  headphones: './assets/images/headphones.svg',
  sunglasses: './assets/images/sunglasses.svg',
  waterbottle: './assets/images/waterbottle.svg',
  studentId: './assets/images/student-id.svg',
  avatarJohn: './assets/images/avatar-john.svg',
  avatarEmma: './assets/images/avatar-emma.svg',
  avatarSarah: './assets/images/avatar-sarah.svg'
};

const INITIAL_USERS = [
  {
    id: 'usr-student-01',
    name: 'John Doe',
    email: 'john.doe@campus.edu',
    phone: '+1 (555) 234-5678',
    role: 'student',
    studentId: 'CS-2024-8841',
    department: 'Computer Science & Engineering',
    avatar: './assets/images/avatar-john.svg',
    joinedDate: '2024-08-15',
    status: 'active'
  },
  {
    id: 'usr-student-02',
    name: 'Emma Watson',
    email: 'emma.w@campus.edu',
    phone: '+1 (555) 876-5432',
    role: 'student',
    studentId: 'BIO-2023-4120',
    department: 'Biotechnology',
    avatar: './assets/images/avatar-emma.svg',
    joinedDate: '2024-09-01',
    status: 'active'
  },
  {
    id: 'usr-admin-01',
    name: 'Officer Sarah Jenkins',
    email: 'admin.slfp@campus.edu',
    phone: '+1 (555) 999-0011',
    role: 'admin',
    department: 'Campus Security & Lost Property Office',
    avatar: './assets/images/avatar-sarah.svg',
    joinedDate: '2023-01-10',
    status: 'active'
  }
];

const PRESET_IMAGES = [
  { label: 'iPhone / Smartphone', url: './assets/images/iphone.svg' },
  { label: 'Laptop / MacBook', url: './assets/images/laptop.svg' },
  { label: 'Backpack / Bag', url: './assets/images/backpack.svg' },
  { label: 'Keys with Keychain', url: './assets/images/keys.svg' },
  { label: 'Leather Wallet', url: './assets/images/wallet.svg' },
  { label: 'Wireless Headphones', url: './assets/images/headphones.svg' },
  { label: 'Water Bottle', url: './assets/images/waterbottle.svg' },
  { label: 'Scientific Calculator', url: './assets/images/calculator.svg' },
  { label: 'Sunglasses / Eyeglasses', url: './assets/images/sunglasses.svg' },
  { label: 'Student ID Card', url: './assets/images/student-id.svg' }
];

const INITIAL_ITEMS = [
  {
    id: 'item-001',
    refCode: 'SLFP-2024-0101',
    title: 'Midnight Blue iPhone 13 Pro',
    type: 'lost',
    category: 'Electronics',
    description: 'Dark blue iPhone 13 Pro with a matte black spigen case. Lock screen has a picture of a golden retriever puppy. Battery was around 40% when lost.',
    image: './assets/images/iphone.svg',
    date: '2024-11-08',
    location: 'Central Library, 2nd Floor Study Cubicle B-14',
    status: 'open',
    reportedBy: {
      userId: 'usr-student-01',
      name: 'John Doe',
      email: 'john.doe@campus.edu',
      phone: '+1 (555) 234-5678'
    },
    confidentialNotes: 'IMEI ending in 4921; back sticker has tiny sticker of GitHub octocat under case.',
    views: 42,
    createdAt: '2024-11-08T14:30:00Z'
  },
  {
    id: 'item-002',
    refCode: 'SLFP-2024-0102',
    title: 'Dark Blue iPhone with Black Case',
    type: 'found',
    category: 'Electronics',
    description: 'Found an Apple smartphone in dark blue with a protective black bumper case left on a study desk near the science journals rack.',
    image: './assets/images/iphone.svg',
    date: '2024-11-08',
    location: 'Central Library, 2nd Floor Journal Section',
    safeLocation: 'Security Helpdesk Desk #1, Main Campus Gate',
    status: 'claim_pending',
    reportedBy: {
      userId: 'usr-student-02',
      name: 'Emma Watson',
      email: 'emma.w@campus.edu',
      phone: '+1 (555) 876-5432'
    },
    confidentialNotes: 'Dog wallpaper visible on tap; handed directly to security desk.',
    views: 89,
    createdAt: '2024-11-08T16:15:00Z'
  },
  {
    id: 'item-003',
    refCode: 'SLFP-2024-0103',
    title: 'Navy Samsonite Laptop Backpack',
    type: 'lost',
    category: 'Bags & Backpacks',
    description: 'Navy blue Samsonite laptop backpack with red zipper pull cords. Contains lecture notebooks for Data Structures and an orange pencil case.',
    image: './assets/images/backpack.svg',
    date: '2024-11-07',
    location: 'Campus Cafeteria, Table near Coffee Machine',
    status: 'open',
    reportedBy: {
      userId: 'usr-student-01',
      name: 'John Doe',
      email: 'john.doe@campus.edu',
      phone: '+1 (555) 234-5678'
    },
    confidentialNotes: 'Inner pocket contains a student library card with ID 8841.',
    views: 31,
    createdAt: '2024-11-07T13:10:00Z'
  },
  {
    id: 'item-004',
    refCode: 'SLFP-2024-0104',
    title: 'Honda Car Key with Red Keychain',
    type: 'found',
    category: 'Keys',
    description: 'Set of 3 keys with a Honda electronic key fob and a red Marvel Avengers lanyard. Found resting on the bench near the soccer pitch.',
    image: './assets/images/keys.svg',
    date: '2024-11-09',
    location: 'Sports Complex, Outdoor Soccer Bleachers',
    safeLocation: 'Sports Complex Front Office',
    status: 'open',
    reportedBy: {
      userId: 'usr-admin-01',
      name: 'Officer Sarah Jenkins',
      email: 'admin.slfp@campus.edu',
      phone: '+1 (555) 999-0011'
    },
    confidentialNotes: 'Key ring has a small silver bottle opener attached.',
    views: 54,
    createdAt: '2024-11-09T10:45:00Z'
  },
  {
    id: 'item-005',
    refCode: 'SLFP-2024-0105',
    title: 'Casio fx-991EX Scientific Calculator',
    type: 'found',
    category: 'Stationery & Books',
    description: 'Black and white Casio ClassWiz scientific calculator left on row 4 desk after the Engineering Mathematics midterm examination.',
    image: './assets/images/calculator.svg',
    date: '2024-11-09',
    location: 'Science Block, Room 304 Lecture Hall',
    safeLocation: 'Faculty Dept Secretary Office, Science Block 1st Floor',
    status: 'open',
    reportedBy: {
      userId: 'usr-student-02',
      name: 'Emma Watson',
      email: 'emma.w@campus.edu',
      phone: '+1 (555) 876-5432'
    },
    confidentialNotes: 'Back cover has initials "K.R." scratched in bottom right.',
    views: 22,
    createdAt: '2024-11-09T12:00:00Z'
  },
  {
    id: 'item-006',
    refCode: 'SLFP-2024-0106',
    title: 'Brown Leather Fossil Bi-Fold Wallet',
    type: 'lost',
    category: 'Wallets & Purses',
    description: 'Distressed brown genuine leather Fossil wallet. Contains driver license, transit pass, and debit card. Desperately needed!',
    image: './assets/images/wallet.svg',
    date: '2024-11-06',
    location: 'Campus Shuttle Bus Route 3',
    status: 'recovered',
    reportedBy: {
      userId: 'usr-student-02',
      name: 'Emma Watson',
      email: 'emma.w@campus.edu',
      phone: '+1 (555) 876-5432'
    },
    confidentialNotes: 'Contains a polaroid photo tucked behind credit card sleeve.',
    views: 115,
    createdAt: '2024-11-06T09:20:00Z'
  },
  {
    id: 'item-007',
    refCode: 'SLFP-2024-0107',
    title: 'Sony WH-1000XM4 Noise Canceling Headphones',
    type: 'lost',
    category: 'Electronics',
    description: 'Silver-grey over-ear Sony headphones in their original zipped protective hard travel case with aux cable.',
    image: './assets/images/headphones.svg',
    date: '2024-11-09',
    location: 'Student Innovation Lab, 3rd Floor Desk 12',
    status: 'open',
    reportedBy: {
      userId: 'usr-student-01',
      name: 'John Doe',
      email: 'john.doe@campus.edu',
      phone: '+1 (555) 234-5678'
    },
    confidentialNotes: 'Custom engraved on headband interior with "JD-2023".',
    views: 67,
    createdAt: '2024-11-09T18:00:00Z'
  },
  {
    id: 'item-008',
    refCode: 'SLFP-2024-0108',
    title: 'Ray-Ban Classic Clubmaster Sunglasses',
    type: 'found',
    category: 'Accessories & Jewelry',
    description: 'Black and gold framed Ray-Ban sunglasses in black leather snap case. Found on outdoor wooden table outside Student Union.',
    image: './assets/images/sunglasses.svg',
    date: '2024-11-08',
    location: 'Student Union Patio, East Lawn',
    safeLocation: 'Student Union Information Desk',
    status: 'open',
    reportedBy: {
      userId: 'usr-admin-01',
      name: 'Officer Sarah Jenkins',
      email: 'admin.slfp@campus.edu',
      phone: '+1 (555) 999-0011'
    },
    confidentialNotes: 'Microfiber cloth inside case has a university crest imprint.',
    views: 19,
    createdAt: '2024-11-08T15:20:00Z'
  },
  {
    id: 'item-009',
    refCode: 'SLFP-2024-0109',
    title: 'Stainless Steel Hydro Flask Water Bottle 32oz',
    type: 'found',
    category: 'Accessories & Jewelry',
    description: 'Olive green wide mouth Hydro Flask with flex cap. Covered with multiple computer science and anime stickers.',
    image: './assets/images/waterbottle.svg',
    date: '2024-11-09',
    location: 'Gymnasium & Fitness Center, Treadmill Area',
    safeLocation: 'Gym Front Reception',
    status: 'open',
    reportedBy: {
      userId: 'usr-student-02',
      name: 'Emma Watson',
      email: 'emma.w@campus.edu',
      phone: '+1 (555) 876-5432'
    },
    confidentialNotes: 'Has a small dent on the bottom rim from a drop.',
    views: 14,
    createdAt: '2024-11-09T17:15:00Z'
  }
];

const INITIAL_CLAIMS = [
  {
    id: 'clm-001',
    itemId: 'item-002',
    itemTitle: 'Dark Blue iPhone with Black Case',
    itemRefCode: 'SLFP-2024-0102',
    claimantId: 'usr-student-01',
    claimantName: 'John Doe',
    claimantEmail: 'john.doe@campus.edu',
    claimantPhone: '+1 (555) 234-5678',
    proofDescription: 'This is my phone! The lock screen photo is my golden retriever Max sitting on grass. There is also a tiny GitHub Octocat sticker hidden inside the black spigen case. My passcode is a 6-digit pin.',
    proofDocumentUrl: './assets/images/student-id.svg',
    status: 'pending',
    adminNotes: '',
    submittedAt: '2024-11-08T17:00:00Z'
  },
  {
    id: 'clm-002',
    itemId: 'item-006',
    itemTitle: 'Brown Leather Fossil Bi-Fold Wallet',
    itemRefCode: 'SLFP-2024-0106',
    claimantId: 'usr-student-02',
    claimantName: 'Emma Watson',
    claimantEmail: 'emma.w@campus.edu',
    claimantPhone: '+1 (555) 876-5432',
    proofDescription: 'Verified with state driver license and student ID BIO-2023-4120 matching cards inside.',
    proofDocumentUrl: '',
    status: 'approved',
    adminNotes: 'ID verified in person by Officer Jenkins. Item handed over successfully.',
    submittedAt: '2024-11-07T11:00:00Z',
    resolvedAt: '2024-11-07T14:30:00Z'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    userId: 'usr-student-01',
    title: 'High Probability Match Found! 🎯',
    message: 'An item matching your "Midnight Blue iPhone 13 Pro" was found at Central Library! Click to view details and claim.',
    type: 'match',
    link: '#item/item-002',
    read: false,
    timestamp: '2024-11-08T16:20:00Z'
  },
  {
    id: 'notif-002',
    userId: 'usr-student-01',
    title: 'Claim Request Submitted 📋',
    message: 'Your claim request for item #SLFP-2024-0102 has been sent to Campus Security for verification.',
    type: 'claim',
    link: '#dashboard',
    read: false,
    timestamp: '2024-11-08T17:01:00Z'
  },
  {
    id: 'notif-003',
    userId: 'usr-student-02',
    title: 'Claim Approved! 🎉',
    message: 'Your claim for Brown Leather Fossil Bi-Fold Wallet was approved. You can pick it up at Security Desk #1.',
    type: 'recovery',
    link: '#dashboard',
    read: true,
    timestamp: '2024-11-07T14:35:00Z'
  },
  {
    id: 'notif-004',
    userId: 'usr-admin-01',
    title: 'New Claim Awaiting Review ⚠️',
    message: 'John Doe submitted a claim for "Dark Blue iPhone with Black Case" (#SLFP-2024-0102).',
    type: 'admin',
    link: '#admin',
    read: false,
    timestamp: '2024-11-08T17:02:00Z'
  }
];

const CATEGORIES = [
  { id: 'Electronics', name: 'Electronics & Gadgets', icon: 'smartphone' },
  { id: 'Bags & Backpacks', name: 'Bags & Backpacks', icon: 'briefcase' },
  { id: 'Keys', name: 'Keys & Remotes', icon: 'key' },
  { id: 'Wallets & Purses', name: 'Wallets & Purses', icon: 'credit-card' },
  { id: 'Documents & IDs', name: 'Documents & ID Cards', icon: 'file-text' },
  { id: 'Accessories & Jewelry', name: 'Accessories & Watches', icon: 'watch' },
  { id: 'Stationery & Books', name: 'Stationery & Textbooks', icon: 'book' },
  { id: 'Clothing & Wearables', name: 'Clothing & Shoes', icon: 'shirt' },
  { id: 'Others', name: 'Other Miscellaneous', icon: 'package' }
];

const LOCATIONS = [
  'Central Library',
  'Campus Cafeteria & Food Court',
  'Science Block & Laboratories',
  'Engineering Building',
  'Sports Complex & Gym',
  'Student Union & Patio',
  'Auditorium & Amphitheater',
  'Campus Shuttle Bus Stop / Bus',
  'Administration & Admissions Block',
  'North Campus Parking Lot',
  'Hostel & Residential Dorms',
  'Other Campus Location'
];

// Attach globally for window access
window.LOCAL_IMAGES = LOCAL_IMAGES;
window.INITIAL_USERS = INITIAL_USERS;
window.PRESET_IMAGES = PRESET_IMAGES;
window.INITIAL_ITEMS = INITIAL_ITEMS;
window.INITIAL_CLAIMS = INITIAL_CLAIMS;
window.INITIAL_NOTIFICATIONS = INITIAL_NOTIFICATIONS;
window.CATEGORIES = CATEGORIES;
window.LOCATIONS = LOCATIONS;
