/**
 * Store - Centralized State Management with LocalStorage Persistence
 * Handles Items, Users, Claims, Notifications, and Current Persona
 */

class AppStore {
  constructor() {
    this.STORAGE_KEYS = {
      ITEMS: 'slfp_items_v1',
      USERS: 'slfp_users_v1',
      CLAIMS: 'slfp_claims_v1',
      NOTIFS: 'slfp_notifications_v1',
      AUTH: 'slfp_current_user_v1'
    };
    
    this.listeners = {};
    this.init();
  }

  init() {
    // Check and seed initial items (auto-migrate if old Unsplash URLs found)
    const storedItems = localStorage.getItem(this.STORAGE_KEYS.ITEMS);
    if (!storedItems || storedItems.includes('unsplash.com')) {
      localStorage.setItem(this.STORAGE_KEYS.ITEMS, JSON.stringify(window.INITIAL_ITEMS || INITIAL_ITEMS));
    }
    // Check and seed initial users
    const storedUsers = localStorage.getItem(this.STORAGE_KEYS.USERS);
    if (!storedUsers || storedUsers.includes('unsplash.com')) {
      localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(window.INITIAL_USERS || INITIAL_USERS));
    }
    // Check and seed initial claims
    const storedClaims = localStorage.getItem(this.STORAGE_KEYS.CLAIMS);
    if (!storedClaims || storedClaims.includes('unsplash.com')) {
      localStorage.setItem(this.STORAGE_KEYS.CLAIMS, JSON.stringify(window.INITIAL_CLAIMS || INITIAL_CLAIMS));
    }
    // Check and seed initial notifications
    if (!localStorage.getItem(this.STORAGE_KEYS.NOTIFS)) {
      localStorage.setItem(this.STORAGE_KEYS.NOTIFS, JSON.stringify(window.INITIAL_NOTIFICATIONS || INITIAL_NOTIFICATIONS));
    }
    // Default current user
    const storedAuth = localStorage.getItem(this.STORAGE_KEYS.AUTH);
    if (!storedAuth || storedAuth.includes('unsplash.com')) {
      localStorage.setItem(this.STORAGE_KEYS.AUTH, JSON.stringify((window.INITIAL_USERS || INITIAL_USERS)[0]));
    }
  }

  // Event Subscription
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  // --- Auth & Persona ---
  getCurrentUser() {
    const raw = localStorage.getItem(this.STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.STORAGE_KEYS.AUTH);
    }
    this.emit('auth-changed', user);
  }

  switchPersona(roleName) {
    const users = this.getUsers();
    let target = null;
    if (roleName === 'student') {
      target = users.find(u => u.role === 'student' && u.name.includes('John')) || users[0];
    } else if (roleName === 'student2') {
      target = users.find(u => u.role === 'student' && u.name.includes('Emma')) || users[1];
    } else if (roleName === 'admin') {
      target = users.find(u => u.role === 'admin') || users[2];
    } else if (roleName === 'guest') {
      target = null;
    }
    this.setCurrentUser(target);
    return target;
  }

  // --- Items CRUD ---
  getItems() {
    const raw = localStorage.getItem(this.STORAGE_KEYS.ITEMS);
    return raw ? JSON.parse(raw) : [];
  }

  getItemById(id) {
    return this.getItems().find(item => item.id === id);
  }

  addItem(itemData) {
    const items = this.getItems();
    const currentUser = this.getCurrentUser();
    const newRefCode = `SLFP-${new Date().getFullYear()}-${String(items.length + 101).padStart(4, '0')}`;
    
    const newItem = {
      id: 'item-' + Date.now(),
      refCode: newRefCode,
      title: itemData.title,
      type: itemData.type, // 'lost' | 'found'
      category: itemData.category,
      description: itemData.description,
      image: itemData.image || './assets/images/backpack.svg',
      date: itemData.date,
      location: itemData.location,
      safeLocation: itemData.safeLocation || '',
      status: 'open',
      reportedBy: {
        userId: currentUser ? currentUser.id : 'guest-' + Date.now(),
        name: itemData.contactName || (currentUser ? currentUser.name : 'Campus Member'),
        email: itemData.contactEmail || (currentUser ? currentUser.email : ''),
        phone: itemData.contactPhone || (currentUser ? currentUser.phone : '')
      },
      confidentialNotes: itemData.confidentialNotes || '',
      views: 1,
      createdAt: new Date().toISOString()
    };

    items.unshift(newItem);
    localStorage.setItem(this.STORAGE_KEYS.ITEMS, JSON.stringify(items));
    this.emit('items-updated', items);

    // Auto-create notification for admins
    this.addNotification({
      userId: 'usr-admin-01',
      title: `New ${newItem.type.toUpperCase()} Item Reported`,
      message: `"${newItem.title}" was reported ${newItem.type} at ${newItem.location}.`,
      type: 'admin',
      link: `#item/${newItem.id}`
    });

    return newItem;
  }

  updateItem(id, updates) {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(this.STORAGE_KEYS.ITEMS, JSON.stringify(items));
      this.emit('items-updated', items);
      return items[index];
    }
    return null;
  }

  deleteItem(id) {
    let items = this.getItems();
    items = items.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.ITEMS, JSON.stringify(items));
    this.emit('items-updated', items);
    return true;
  }

  incrementItemViews(id) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.views = (item.views || 0) + 1;
      localStorage.setItem(this.STORAGE_KEYS.ITEMS, JSON.stringify(items));
    }
  }

  // --- Claims CRUD ---
  getClaims() {
    const raw = localStorage.getItem(this.STORAGE_KEYS.CLAIMS);
    return raw ? JSON.parse(raw) : [];
  }

  getClaimsForUser(userId) {
    if (!userId) return [];
    return this.getClaims().filter(c => c.claimantId === userId);
  }

  getClaimsForItem(itemId) {
    return this.getClaims().filter(c => c.itemId === itemId);
  }

  addClaim(claimData) {
    const claims = this.getClaims();
    const currentUser = this.getCurrentUser();
    const targetItem = this.getItemById(claimData.itemId);

    const newClaim = {
      id: 'clm-' + Date.now(),
      itemId: claimData.itemId,
      itemTitle: targetItem ? targetItem.title : claimData.itemTitle,
      itemRefCode: targetItem ? targetItem.refCode : 'SLFP-REF',
      claimantId: currentUser ? currentUser.id : 'guest-' + Date.now(),
      claimantName: claimData.claimantName || (currentUser ? currentUser.name : 'Anonymous'),
      claimantEmail: claimData.claimantEmail || (currentUser ? currentUser.email : ''),
      claimantPhone: claimData.claimantPhone || (currentUser ? currentUser.phone : ''),
      proofDescription: claimData.proofDescription,
      proofDocumentUrl: claimData.proofDocumentUrl || '',
      status: 'pending',
      adminNotes: '',
      submittedAt: new Date().toISOString()
    };

    claims.unshift(newClaim);
    localStorage.setItem(this.STORAGE_KEYS.CLAIMS, JSON.stringify(claims));

    // Mark item status as claim_pending
    if (targetItem) {
      this.updateItem(targetItem.id, { status: 'claim_pending' });
    }

    // Add notification for Admin
    this.addNotification({
      userId: 'usr-admin-01',
      title: 'New Ownership Claim Submitted ⚠️',
      message: `${newClaim.claimantName} claimed "${newClaim.itemTitle}". Awaiting verification.`,
      type: 'admin',
      link: '#admin'
    });

    // Add confirmation notification for User
    if (currentUser) {
      this.addNotification({
        userId: currentUser.id,
        title: 'Claim Submitted Successfully',
        message: `Your claim for "${newClaim.itemTitle}" has been received and is pending verification.`,
        type: 'claim',
        link: '#dashboard'
      });
    }

    this.emit('claims-updated', claims);
    return newClaim;
  }

  updateClaimStatus(claimId, status, adminNotes = '') {
    const claims = this.getClaims();
    const index = claims.findIndex(c => c.id === claimId);
    if (index === -1) return null;

    const claim = claims[index];
    claim.status = status;
    claim.adminNotes = adminNotes;
    claim.resolvedAt = new Date().toISOString();

    localStorage.setItem(this.STORAGE_KEYS.CLAIMS, JSON.stringify(claims));

    // If approved, update item status to recovered
    if (status === 'approved') {
      this.updateItem(claim.itemId, { status: 'recovered' });

      // Notify claimant of approval
      this.addNotification({
        userId: claim.claimantId,
        title: 'Claim Approved! 🎉',
        message: `Your claim for "${claim.itemTitle}" has been APPROVED. You may pick up your item at Campus Security Desk.`,
        type: 'recovery',
        link: '#dashboard'
      });
    } else if (status === 'rejected') {
      // Re-open item if no other claims pending
      const otherPending = claims.some(c => c.itemId === claim.itemId && c.id !== claimId && c.status === 'pending');
      if (!otherPending) {
        this.updateItem(claim.itemId, { status: 'open' });
      }

      // Notify claimant of rejection
      this.addNotification({
        userId: claim.claimantId,
        title: 'Claim Status Update',
        message: `Your claim for "${claim.itemTitle}" was not approved: ${adminNotes || 'Insufficient ownership verification.'}`,
        type: 'claim',
        link: '#dashboard'
      });
    }

    this.emit('claims-updated', claims);
    return claim;
  }

  // --- Users CRUD ---
  getUsers() {
    const raw = localStorage.getItem(this.STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  registerUser(userData) {
    const users = this.getUsers();
    const exists = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      throw new Error('A user with this email address already exists.');
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: 'student',
      studentId: userData.studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: userData.department || 'General Academics',
      avatar: './assets/images/avatar-john.svg',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);
    this.emit('users-updated', users);
    return newUser;
  }

  loginUser(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('No account found with this email address.');
    }
    this.setCurrentUser(user);
    return user;
  }

  // --- Notifications ---
  getNotifications(userId = null) {
    const raw = localStorage.getItem(this.STORAGE_KEYS.NOTIFS);
    const all = raw ? JSON.parse(raw) : [];
    if (!userId) return all;
    return all.filter(n => n.userId === userId || n.userId === 'all');
  }

  addNotification(notifData) {
    const notifs = this.getNotifications();
    const newNotif = {
      id: 'notif-' + Date.now(),
      userId: notifData.userId || 'all',
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'info', // 'match' | 'claim' | 'recovery' | 'admin' | 'info'
      link: notifData.link || '#dashboard',
      read: false,
      timestamp: new Date().toISOString()
    };
    notifs.unshift(newNotif);
    localStorage.setItem(this.STORAGE_KEYS.NOTIFS, JSON.stringify(notifs));
    this.emit('notif-updated', notifs);
    return newNotif;
  }

  markNotificationAsRead(id) {
    const notifs = this.getNotifications();
    const target = notifs.find(n => n.id === id);
    if (target) {
      target.read = true;
      localStorage.setItem(this.STORAGE_KEYS.NOTIFS, JSON.stringify(notifs));
      this.emit('notif-updated', notifs);
    }
  }

  markAllNotificationsAsRead(userId) {
    const notifs = this.getNotifications();
    notifs.forEach(n => {
      if (!userId || n.userId === userId || n.userId === 'all') {
        n.read = true;
      }
    });
    localStorage.setItem(this.STORAGE_KEYS.NOTIFS, JSON.stringify(notifs));
    this.emit('notif-updated', notifs);
  }

  // --- Global Stats ---
  getStats() {
    const items = this.getItems();
    const claims = this.getClaims();
    const users = this.getUsers();

    const totalLost = items.filter(i => i.type === 'lost').length;
    const totalFound = items.filter(i => i.type === 'found').length;
    const recovered = items.filter(i => i.status === 'recovered').length;
    const activeClaims = claims.filter(c => c.status === 'pending').length;
    const totalClaims = claims.length;
    const recoveryRate = items.length > 0 ? Math.round((recovered / items.length) * 100) : 0;

    return {
      totalItems: items.length,
      totalLost,
      totalFound,
      recovered,
      activeClaims,
      totalClaims,
      totalUsers: users.length,
      recoveryRate
    };
  }

  // Reset to initial demo state
  resetToDefaults() {
    const items = window.INITIAL_ITEMS || INITIAL_ITEMS;
    const users = window.INITIAL_USERS || INITIAL_USERS;
    const claims = window.INITIAL_CLAIMS || INITIAL_CLAIMS;
    const notifs = window.INITIAL_NOTIFICATIONS || INITIAL_NOTIFICATIONS;

    localStorage.setItem(this.STORAGE_KEYS.ITEMS, JSON.stringify(items));
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(this.STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
    localStorage.setItem(this.STORAGE_KEYS.NOTIFS, JSON.stringify(notifs));
    localStorage.setItem(this.STORAGE_KEYS.AUTH, JSON.stringify(users[0]));
    
    this.emit('items-updated', items);
    this.emit('claims-updated', claims);
    this.emit('notif-updated', notifs);
    this.emit('auth-changed', users[0]);
  }
}

// Global instance
window.store = new AppStore();
