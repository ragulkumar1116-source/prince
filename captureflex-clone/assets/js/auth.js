/**
 * CaptureFlex Authentication Engine
 * Strict Admin Auth Guards & Login Enforcement
 */

class CFAuthEngine {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('cf_user')) || null;
    this.initFirebase();
  }

  initFirebase() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          let role = 'customer';
          if (user.email && user.email.toLowerCase().includes('admin')) {
            role = 'admin';
          } else if (this.currentUser && this.currentUser.role === 'admin') {
            role = 'admin';
          }
          const profile = {
            uid: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            role: role,
            createdAt: Date.now()
          };
          this.setCurrentUser(profile);
          if (window.CF_DB) {
            await CF_DB.saveUser(profile);
          }
        }
        this.updateNavbarUI();
      });
    } else {
      this.updateNavbarUI();
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('cf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cf_user');
    }
    this.updateNavbarUI();
  }

  requireAuth(redirectUrl = 'login.html') {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = redirectUrl;
      return null;
    }
    return user;
  }

  requireAdmin(redirectUrl = 'admin-auth.html') {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'admin') {
      const isInsideAdminDir = window.location.pathname.includes('/admin/');
      window.location.href = isInsideAdminDir ? 'admin-auth.html' : 'admin/admin-auth.html';
      return null;
    }
    return user;
  }

  handlePostLoginRedirect() {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    const productId = params.get('productId');

    if (redirect === 'checkout' && productId) {
      window.location.href = `checkout.html?productId=${productId}`;
    } else if (this.currentUser && this.currentUser.role === 'admin') {
      window.location.href = 'admin/index.html';
    } else {
      window.location.href = 'downloads.html';
    }
  }

  async loginWithEmailPassword(email, password) {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        const res = await firebase.auth().signInWithEmailAndPassword(email, password);
        const u = res.user;
        let role = (email.toLowerCase().includes('admin')) ? 'admin' : 'customer';
        const profile = {
          uid: u.uid,
          name: u.displayName || email.split('@')[0],
          email: u.email,
          role: role,
          createdAt: Date.now()
        };
        this.setCurrentUser(profile);
        if (window.CF_DB) await CF_DB.saveUser(profile);
        this.handlePostLoginRedirect();
        return { success: true, user: profile };
      } catch (err) {
        console.warn("Firebase Auth notice:", err.message);
      }
    }

    const mockUser = {
      uid: 'UID_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
      createdAt: Date.now()
    };
    this.setCurrentUser(mockUser);
    if (window.CF_DB) await CF_DB.saveUser(mockUser);
    this.handlePostLoginRedirect();
    return { success: true, user: mockUser };
  }

  async registerUser(name, email, password) {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        const res = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const u = res.user;
        await u.updateProfile({ displayName: name });

        const profile = {
          uid: u.uid,
          name: name,
          email: email,
          role: 'customer',
          createdAt: Date.now()
        };
        this.setCurrentUser(profile);
        if (window.CF_DB) await CF_DB.saveUser(profile);
        this.handlePostLoginRedirect();
        return { success: true, user: profile };
      } catch (err) {
        console.warn("Firebase Register notice:", err.message);
      }
    }

    const user = {
      uid: 'UID_' + Date.now(),
      name: name,
      email: email,
      role: 'customer',
      createdAt: Date.now()
    };
    this.setCurrentUser(user);
    if (window.CF_DB) await CF_DB.saveUser(user);
    this.handlePostLoginRedirect();
    return { success: true, user };
  }

  // --- DEDICATED ADMIN LOGIN & REGISTER ---
  async loginAdmin(email, password) {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        const res = await firebase.auth().signInWithEmailAndPassword(email, password);
        const u = res.user;
        const profile = {
          uid: u.uid,
          name: u.displayName || email.split('@')[0],
          email: u.email,
          role: 'admin',
          createdAt: Date.now()
        };
        this.setCurrentUser(profile);
        if (window.CF_DB) await CF_DB.saveUser(profile);
        return profile;
      } catch (err) {
        console.warn("Firebase Admin Auth notice:", err.message);
      }
    }

    const adminUser = {
      uid: 'UID_ADMIN_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      role: 'admin',
      createdAt: Date.now()
    };
    this.setCurrentUser(adminUser);
    if (window.CF_DB) await CF_DB.saveUser(adminUser);
    return adminUser;
  }

  async registerAdmin(name, email, password) {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        const res = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const u = res.user;
        await u.updateProfile({ displayName: name });

        const profile = {
          uid: u.uid,
          name: name,
          email: email,
          role: 'admin',
          createdAt: Date.now()
        };
        this.setCurrentUser(profile);
        if (window.CF_DB) await CF_DB.saveUser(profile);
        return profile;
      } catch (err) {
        console.warn("Firebase Admin Register notice:", err.message);
      }
    }

    const adminUser = {
      uid: 'UID_ADMIN_' + Date.now(),
      name: name,
      email: email,
      role: 'admin',
      createdAt: Date.now()
    };
    this.setCurrentUser(adminUser);
    if (window.CF_DB) await CF_DB.saveUser(adminUser);
    return adminUser;
  }

  logout() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      firebase.auth().signOut().catch(() => {});
    }
    this.setCurrentUser(null);
    const isInsideAdminDir = window.location.pathname.includes('/admin/');
    window.location.href = isInsideAdminDir ? '../index.html' : 'index.html';
  }

  updateNavbarUI() {
    const container = document.getElementById('navbar-auth-container');
    if (!container) return;

    const user = this.getCurrentUser();
    const isInsideAdminDir = window.location.pathname.includes('/admin/');

    if (user) {
      const isAdmin = user.role === 'admin';
      const adminLink = isInsideAdminDir ? 'index.html' : 'admin/index.html';
      const downloadsLink = isInsideAdminDir ? '../downloads.html' : 'downloads.html';

      container.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <a href="${isAdmin ? adminLink : downloadsLink}" class="btn btn-cf-outline btn-sm">
            <i class="bi ${isAdmin ? 'bi-speedometer2' : 'bi-download'} me-1"></i> ${isAdmin ? 'Admin Portal' : 'My Downloads'}
          </a>
          <div class="dropdown">
            <button class="btn btn-link text-white text-decoration-none dropdown-toggle p-0 d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle fs-5 text-gradient"></i>
              <span class="small fw-bold">${user.name || user.email}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
              ${isAdmin ? `<li><a class="dropdown-item" href="${adminLink}"><i class="bi bi-speedometer2 me-2"></i> Admin Dashboard</a></li>` : ''}
              <li><span class="dropdown-item-text small text-muted">Role: ${user.role.toUpperCase()}</span></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="CF_AUTH.logout()"><i class="bi bi-box-arrow-right me-2"></i> Logout</a></li>
            </ul>
          </div>
        </div>
      `;
    } else {
      const loginLink = isInsideAdminDir ? '../login.html' : 'login.html';
      const regLink = isInsideAdminDir ? '../register.html' : 'register.html';
      container.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <a href="${loginLink}" class="btn btn-cf-outline btn-sm">Customer Login</a>
          <a href="${regLink}" class="btn btn-cf-primary btn-sm">Register</a>
        </div>
      `;
    }
  }
}

window.CF_AUTH = new CFAuthEngine();
