/**
 * CaptureFlex Realtime Firebase Integration & Universal Brand Synchronizer
 * High-Speed Google Cloud CDN Sample Video Streams & 16:9 Aspect Ratio Media Engine
 */

window.firebaseConfig = window.firebaseConfig || {
apiKey: "AIzaSyAG6SUjgU8Fw444Hp4cm99-Tgv_snPzjeg",
  authDomain: "hotel-city-park.firebaseapp.com",
  databaseURL: "https://hotel-city-park-default-rtdb.firebaseio.com",
  projectId: "hotel-city-park",
  storageBucket: "hotel-city-park.firebasestorage.app",
  messagingSenderId: "229533997685",
  appId: "1:229533997685:web:be1d34c42f72e40616b63c",
  measurementId: "G-8KQMDT535G"
};

const DEFAULT_SETTINGS = {
  siteName: "CaptureFlex Digital",
  companyName: "CaptureFlex Software Solutions Pvt. Ltd.",
  companyAddress: "Plot 42, Innovation Tech Park, MG Road, Bengaluru, Karnataka - 560001, India",
  companyPhone: "+91 98765 43210",
  supportEmail: "support@captureflex.in",
  currencySymbol: "₹",
  upiId: "captureflex@upi",
  upiMerchantName: "CaptureFlex Software Solutions",
  bankHolderName: "CaptureFlex Software Solutions Pvt Ltd",
  bankName: "HDFC Bank",
  bankAccNo: "50200012345678",
  bankIfsc: "HDFC0001234",
  logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100",
  heroTitle: "Build, Deploy & Manage Link-Based Software Packages",
  heroSubtitle: "Instant direct download access to Adobe CC ZXP plugins, Windows utilities, Mac bundles, and Indian currency serial key licensing.",
  heroImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200"
};

const DEFAULT_PRODUCTS = {
  "PROD_001": {
    id: "PROD_001",
    name: "Flex GUI Pro",
    slug: "flex-gui-pro",
    version: "7.0.1",
    price: 3999.00,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
    bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200",
    description: "Next-generation Adobe Creative Cloud extension GUI framework for After Effects, Premiere Pro, and Photoshop.",
    status: "active",
    createdAt: Date.now()
  },
  "PROD_002": {
    id: "PROD_002",
    name: "CaptureFlex Render Engine",
    slug: "captureflex-render-engine",
    version: "3.4.0",
    price: 2499.00,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600",
    bannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    description: "High-speed multi-threaded background render manager for Windows and macOS creative pipelines.",
    status: "active",
    createdAt: Date.now()
  }
};

const DEFAULT_FILES = {
  "FILE_001": {
    id: "FILE_001",
    productId: "PROD_001",
    name: "Flex GUI Pro v7.0.1 ZXP Package",
    version: "7.0.1",
    fileType: "ZXP",
    platform: "All Platforms",
    downloadUrl: "https://example.com/downloads/Flex-GUI-Pro-v7.0.1.zxp",
    fileSize: "28.5 MB",
    description: "Universal ZXP package for Adobe CC 2024+",
    createdAt: Date.now()
  },
  "FILE_002": {
    id: "FILE_002",
    productId: "PROD_002",
    name: "CaptureFlex Render Engine Windows Installer",
    version: "3.4.0",
    fileType: "EXE",
    platform: "Windows",
    downloadUrl: "https://example.com/downloads/CaptureFlex-RenderEngine-v3.4.0.exe",
    fileSize: "45.2 MB",
    description: "Direct Windows 64-bit EXE setup package",
    createdAt: Date.now()
  }
};

const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2013.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
];

const DEFAULT_MEDIA = {
  "MEDIA_001": { id: "MEDIA_001", title: "Flex GUI Pro Dark Glass Panel Interface", type: "image", mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200", category: "UI Screenshots", order: 1, createdAt: Date.now() },
  "MEDIA_002": { id: "MEDIA_002", title: "Multi-Threaded Render Manager Demo", type: "video", mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200", videoUrl: SAMPLE_VIDEOS[0], category: "Video Demos", order: 2, createdAt: Date.now() },
  "MEDIA_003": { id: "MEDIA_003", title: "Adobe CC After Effects Extension Suite", type: "image", mediaUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200", category: "Adobe CC Panels", order: 3, createdAt: Date.now() },
  "MEDIA_004": { id: "MEDIA_004", title: "Premiere Pro Real-Time Color Grading Walkthrough", type: "video", mediaUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200", videoUrl: SAMPLE_VIDEOS[1], category: "Video Demos", order: 4, createdAt: Date.now() },
  "MEDIA_005": { id: "MEDIA_005", title: "Photoshop Custom Tool Palette Interface", type: "image", mediaUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200", category: "UI Screenshots", order: 5, createdAt: Date.now() },
  "MEDIA_006": { id: "MEDIA_006", title: "Background Pipeline Render Benchmark Test", type: "video", mediaUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200", videoUrl: SAMPLE_VIDEOS[2], category: "Render Benchmarks", order: 6, createdAt: Date.now() },
  "MEDIA_007": { id: "MEDIA_007", title: "ZXP Package Installation & Licensing Tutorial", type: "video", mediaUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200", videoUrl: SAMPLE_VIDEOS[3], category: "Video Demos", order: 7, createdAt: Date.now() },
  "MEDIA_008": { id: "MEDIA_008", title: "Serial Key Licensing & Activation GUI", type: "image", mediaUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200", category: "UI Screenshots", order: 8, createdAt: Date.now() },
  "MEDIA_009": { id: "MEDIA_009", title: "Motion Graphics Preset Engine Preview", type: "image", mediaUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200", category: "Adobe CC Panels", order: 9, createdAt: Date.now() },
  "MEDIA_010": { id: "MEDIA_010", title: "GPU Hardware Acceleration Node Setup", type: "image", mediaUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200", category: "UI Screenshots", order: 10, createdAt: Date.now() },
  "MEDIA_011": { id: "MEDIA_011", title: "Multi-Monitor Studio Workflow Dashboard", type: "image", mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200", category: "UI Screenshots", order: 11, createdAt: Date.now() },
  "MEDIA_012": { id: "MEDIA_012", title: "Live Color Grading Controls & Waveforms", type: "video", mediaUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200", videoUrl: SAMPLE_VIDEOS[4], category: "Video Demos", order: 12, createdAt: Date.now() },
  "MEDIA_013": { id: "MEDIA_013", title: "Batch Render Queue Automation Panel", type: "image", mediaUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200", category: "Render Benchmarks", order: 13, createdAt: Date.now() },
  "MEDIA_014": { id: "MEDIA_014", title: "Vector Graphic Asset Extension Manager", type: "image", mediaUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1200", category: "Adobe CC Panels", order: 14, createdAt: Date.now() },
  "MEDIA_015": { id: "MEDIA_015", title: "Audio Waveform Spectrum Analysis Engine", type: "video", mediaUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200", videoUrl: SAMPLE_VIDEOS[5], category: "Video Demos", order: 15, createdAt: Date.now() },
  "MEDIA_016": { id: "MEDIA_016", title: "3D Motion Camera Tracking Overlay UI", type: "image", mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200", category: "UI Screenshots", order: 16, createdAt: Date.now() },
  "MEDIA_017": { id: "MEDIA_017", title: "Typography Preset Browser Extension", type: "image", mediaUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200", category: "Adobe CC Panels", order: 17, createdAt: Date.now() },
  "MEDIA_018": { id: "MEDIA_018", title: "Multi-Pass EXR Render Converter Test", type: "video", mediaUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200", videoUrl: SAMPLE_VIDEOS[6], category: "Render Benchmarks", order: 18, createdAt: Date.now() },
  "MEDIA_019": { id: "MEDIA_019", title: "Keyframe Speed Curve Editor Panel", type: "image", mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200", category: "UI Screenshots", order: 19, createdAt: Date.now() },
  "MEDIA_020": { id: "MEDIA_020", title: "CaptureFlex Realtime Cloud Sync Showcase", type: "video", mediaUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200", videoUrl: SAMPLE_VIDEOS[7], category: "Video Demos", order: 20, createdAt: Date.now() }
};

class CFDataEngine {
  constructor() {
    this.isLiveFirebase = false;
    this.cache = {
      products: null,
      files: null,
      licenses: null,
      users: null,
      support: null,
      settings: null,
      payments: null,
      media: null
    };
    this.init();
  }

  init() {
    if (typeof firebase !== 'undefined' && firebase.apps) {
      try {
        if (!firebase.apps.length && window.firebaseConfig && window.firebaseConfig.apiKey) {
          firebase.initializeApp(window.firebaseConfig);
        }
        if (firebase.apps.length) {
          this.db = firebase.database();
          this.auth = firebase.auth();
          this.isLiveFirebase = true;
          console.log("⚡ Live Firebase Realtime Database Connected!");
          this.setupRealtimeListeners();
          return;
        }
      } catch (err) {
        console.warn("Firebase Connection notice: Running local cache.", err);
      }
    }
  }

  setupRealtimeListeners() {
    if (!this.db) return;

    // Real-time Media Gallery Sync for Index Page
    this.db.ref('media').on('value', (snap) => {
      const cloudMedia = snap.val() ? this.normalizeDict(snap.val()) : {};
      const localMedia = JSON.parse(localStorage.getItem('cf_media') || '{}');
      this.cache.media = { ...DEFAULT_MEDIA, ...localMedia, ...cloudMedia };
      if (window.CF_ADMIN && typeof CF_ADMIN.renderMediaTable === 'function') {
        CF_ADMIN.renderMediaTable();
      }
      if (window.CF_PRODUCT && typeof CF_PRODUCT.renderMediaShowcase === 'function') {
        CF_PRODUCT.renderMediaShowcase();
      }
    }, (err) => console.warn("Firebase media sync notice:", err.message));

    // Real-time Payments Verification Sync
    this.db.ref('payments').on('value', (snap) => {
      this.cache.payments = this.normalizeDict(snap.val());
      if (window.CF_ADMIN && typeof CF_ADMIN.renderPaymentsTable === 'function') {
        CF_ADMIN.renderPaymentsTable();
      }
      if (window.CF_DOWNLOADS && typeof CF_DOWNLOADS.loadUserData === 'function') {
        CF_DOWNLOADS.loadUserData();
      }
    }, (err) => console.warn("Firebase payments sync notice:", err.message));

    // Real-time Licenses Sync
    this.db.ref('licenses').on('value', (snap) => {
      this.cache.licenses = this.normalizeDict(snap.val());
      if (window.CF_ADMIN && typeof CF_ADMIN.renderLicensesTable === 'function') {
        CF_ADMIN.renderLicensesTable();
      }
      if (window.CF_DOWNLOADS && typeof CF_DOWNLOADS.loadUserData === 'function') {
        CF_DOWNLOADS.loadUserData();
      }
    }, (err) => console.warn("Firebase licenses sync notice:", err.message));

    // Real-time Settings Sync for Universal Branding across all pages
    this.db.ref('settings').on('value', (snap) => {
      this.cache.settings = snap.val() ? { ...DEFAULT_SETTINGS, ...snap.val() } : DEFAULT_SETTINGS;
      this.applyGlobalBrandSettings();
    }, (err) => console.warn("Firebase settings sync notice:", err.message));

    // Real-time Users Sync
    this.db.ref('users').on('value', (snap) => {
      this.cache.users = this.normalizeDict(snap.val());
      if (window.CF_ADMIN && typeof CF_ADMIN.renderCustomersTable === 'function') {
        CF_ADMIN.renderCustomersTable();
      }
    }, (err) => console.warn("Firebase users sync notice:", err.message));

    // Real-time Support Sync
    this.db.ref('support').on('value', (snap) => {
      this.cache.support = this.normalizeDict(snap.val());
      if (window.CF_ADMIN && typeof CF_ADMIN.renderSupportTable === 'function') {
        CF_ADMIN.renderSupportTable();
      }
    }, (err) => console.warn("Firebase support sync notice:", err.message));

    // Real-time Products Sync
    this.db.ref('products').on('value', (snap) => {
      this.cache.products = this.normalizeDict(snap.val());
      if (window.CF_PRODUCT && typeof CF_PRODUCT.loadData === 'function') {
        CF_PRODUCT.loadData();
      }
    }, (err) => console.warn("Firebase products sync notice:", err.message));

    // Real-time Files Sync
    this.db.ref('files').on('value', (snap) => {
      this.cache.files = this.normalizeDict(snap.val());
      if (window.CF_DOWNLOADS && typeof CF_DOWNLOADS.loadUserData === 'function') {
        CF_DOWNLOADS.loadUserData();
      }
    }, (err) => console.warn("Firebase files sync notice:", err.message));
  }

  async applyGlobalBrandSettings() {
    const s = await this.getSettings();
    if (!s) return;

    const siteName = s.siteName || s.companyName || 'CaptureFlex';
    const companyName = s.companyName || siteName;
    const logoUrl = s.logoUrl || DEFAULT_SETTINGS.logoUrl;
    const address = s.companyAddress || '';
    const phone = s.companyPhone || '';
    const email = s.supportEmail || '';

    // 1. Update Navbar Brand Text for both Customer and Admin Headers
    document.querySelectorAll('.navbar-brand-text').forEach(el => {
      if (el.classList.contains('admin-brand-text')) {
        el.innerText = `${siteName} Admin`;
      } else {
        el.innerText = siteName;
      }
    });

    // 2. Update Logo Images everywhere across all customer and admin pages
    document.querySelectorAll('.site-logo-img').forEach(img => {
      if (logoUrl) {
        img.src = logoUrl;
        img.style.display = 'inline-block';
      }
    });

    // 3. Update Footer Company Name, Address, Phone, Support Email everywhere
    document.querySelectorAll('.company-name-text').forEach(el => el.innerText = companyName);
    document.querySelectorAll('.company-address-text').forEach(el => el.innerText = address);
    document.querySelectorAll('.company-phone-text').forEach(el => el.innerText = phone ? `Tel: ${phone}` : '');
    document.querySelectorAll('.support-email-text').forEach(el => el.innerText = email);

    const elCompany = document.getElementById('footer-company-name');
    if (elCompany) elCompany.innerText = companyName;

    const elAddr = document.getElementById('footer-company-address');
    if (elAddr) elAddr.innerText = address;

    const elPhone = document.getElementById('footer-company-phone');
    if (elPhone) elPhone.innerText = phone ? `Tel: ${phone}` : '';

    const elEmail = document.getElementById('footer-support-email');
    if (elEmail) elEmail.innerText = email;

    // 4. Update Hero Titles on landing page
    const heroTitle = document.getElementById('hero-dynamic-title');
    if (heroTitle && s.heroTitle) heroTitle.innerHTML = s.heroTitle;

    const heroSub = document.getElementById('hero-dynamic-subtitle');
    if (heroSub && s.heroSubtitle) heroSub.innerText = s.heroSubtitle;

    const heroImg = document.getElementById('hero-dynamic-img');
    if (heroImg && s.heroImageUrl) heroImg.src = s.heroImageUrl;
  }

  normalizeDict(val) {
    if (!val) return {};
    if (Array.isArray(val)) {
      const res = {};
      val.forEach((item, idx) => {
        if (item) {
          const id = item.id || item.uid || 'ITEM_' + idx;
          res[id] = { ...item, id };
        }
      });
      return res;
    }
    if (typeof val === 'object') {
      const res = {};
      Object.keys(val).forEach(key => {
        if (val[key]) {
          const uidOrId = val[key].uid || val[key].id || key;
          res[key] = { ...val[key], id: uidOrId, uid: uidOrId };
        }
      });
      return res;
    }
    return {};
  }

  // --- MEDIA GALLERY SHOWCASE ENGINE ---
  async getMedia() {
    let cloudMedia = {};
    if (this.isLiveFirebase && this.db) {
      try {
        const snap = await this.db.ref('media').once('value');
        if (snap.exists() && snap.val()) {
          cloudMedia = this.normalizeDict(snap.val());
        }
      } catch (err) {
        console.warn("Firebase getMedia notice (using local fallback):", err.message);
      }
    }
    const local = JSON.parse(localStorage.getItem('cf_media') || '{}');
    const merged = { ...DEFAULT_MEDIA, ...local, ...cloudMedia };

    // Remove deleted items
    const deletedList = JSON.parse(localStorage.getItem('cf_media_deleted') || '[]');
    deletedList.forEach(id => {
      delete merged[id];
    });

    this.cache.media = merged;
    return merged;
  }

  async saveMedia(mediaItem) {
    const id = mediaItem.id || 'MEDIA_' + Date.now();
    mediaItem.id = id;
    mediaItem.createdAt = mediaItem.createdAt || Date.now();

    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('media/' + id).set(mediaItem);
      } catch (err) {
        console.warn("Firebase saveMedia notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_media') || '{}');
    data[id] = mediaItem;
    localStorage.setItem('cf_media', JSON.stringify(data));
    if (!this.cache.media) this.cache.media = {};
    this.cache.media[id] = mediaItem;
    return mediaItem;
  }

  async deleteMedia(id) {
    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('media/' + id).remove();
      } catch (err) {
        console.warn("Firebase deleteMedia notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_media') || '{}');
    delete data[id];
    localStorage.setItem('cf_media', JSON.stringify(data));

    const deletedList = JSON.parse(localStorage.getItem('cf_media_deleted') || '[]');
    if (!deletedList.includes(id)) {
      deletedList.push(id);
      localStorage.setItem('cf_media_deleted', JSON.stringify(deletedList));
    }

    if (this.cache.media) delete this.cache.media[id];
    return true;
  }

  // --- PAYMENTS VERIFICATION ENGINE ---
  async getPayments() {
    if (this.isLiveFirebase && this.db) {
      try {
        const snap = await this.db.ref('payments').once('value');
        if (snap.exists() && snap.val()) {
          this.cache.payments = this.normalizeDict(snap.val());
          return this.cache.payments;
        }
      } catch (err) {
        console.warn("Firebase getPayments notice (using local fallback):", err.message);
      }
    }
    if (this.cache.payments) return this.cache.payments;
    const local = JSON.parse(localStorage.getItem('cf_payments') || '{}');
    return this.normalizeDict(local);
  }

  async savePayment(payment) {
    const id = payment.id || 'PAY_' + Date.now();
    payment.id = id;
    payment.submittedAt = payment.submittedAt || Date.now();

    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('payments/' + id).set(payment);
      } catch (err) {
        console.warn("Firebase savePayment notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_payments') || '{}');
    data[id] = payment;
    localStorage.setItem('cf_payments', JSON.stringify(data));
    if (this.cache.payments) this.cache.payments[id] = payment;
    return payment;
  }

  // --- USERS ---
  async getUsers() {
    if (this.isLiveFirebase && this.db) {
      try {
        const snap = await this.db.ref('users').once('value');
        if (snap.exists() && snap.val()) {
          const cloudUsers = this.normalizeDict(snap.val());
          this.cache.users = cloudUsers;
          return cloudUsers;
        }
      } catch (err) {
        console.warn("Firebase getUsers notice (using local fallback):", err.message);
      }
    }
    if (this.cache.users) return this.cache.users;
    const local = JSON.parse(localStorage.getItem('cf_users') || '{}');
    return this.normalizeDict(local);
  }

  async getUser(uid) {
    if (this.isLiveFirebase && this.db) {
      try {
        const snap = await this.db.ref('users/' + uid).once('value');
        return snap.val();
      } catch (err) {
        console.warn("Firebase getUser notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_users') || '{}');
    return data[uid];
  }

  async saveUser(user) {
    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('users/' + user.uid).set(user);
      } catch (err) {
        console.warn("Firebase saveUser notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_users') || '{}');
    data[user.uid] = user;
    localStorage.setItem('cf_users', JSON.stringify(data));
    if (this.cache.users) this.cache.users[user.uid] = user;
    return user;
  }

  // --- PRODUCTS ---
  async getProducts() {
    let cloud = {};
    if (this.isLiveFirebase && this.db) {
      try {
        const snap = await this.db.ref('products').once('value');
        if (snap.exists() && snap.val()) {
          cloud = this.normalizeDict(snap.val());
        }
      } catch (err) {
        console.warn("Firebase getProducts notice (using local fallback):", err.message);
      }
    }
    const local = JSON.parse(localStorage.getItem('cf_products') || '{}');
    const merged = { ...DEFAULT_PRODUCTS, ...local, ...cloud };
    this.cache.products = merged;
    return merged;
  }

  async saveProduct(product) {
    const id = product.id || 'PROD_' + Date.now();
    product.id = id;
    product.createdAt = product.createdAt || Date.now();

    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('products/' + id).set(product);
      } catch (err) {
        console.warn("Firebase saveProduct notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_products') || '{}');
    data[id] = product;
    localStorage.setItem('cf_products', JSON.stringify(data));
    if (!this.cache.products) this.cache.products = {};
    this.cache.products[id] = product;
    return product;
  }

  async deleteProduct(id) {
    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('products/' + id).remove();
      } catch (err) {
        console.warn("Firebase deleteProduct notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_products') || '{}');
    delete data[id];
    localStorage.setItem('cf_products', JSON.stringify(data));
    if (this.cache.products) delete this.cache.products[id];
    return true;
  }

  // --- FILES ---
  async getFiles() {
    let cloud = {};
    if (this.isLiveFirebase && this.db) {
      try {
        const snap = await this.db.ref('files').once('value');
        if (snap.exists() && snap.val()) {
          cloud = this.normalizeDict(snap.val());
        }
      } catch (err) {
        console.warn("Firebase getFiles notice (using local fallback):", err.message);
      }
    }
    const local = JSON.parse(localStorage.getItem('cf_files') || '{}');
    const merged = { ...DEFAULT_FILES, ...local, ...cloud };
    this.cache.files = merged;
    return merged;
  }

  async saveFile(file) {
    const id = file.id || 'FILE_' + Date.now();
    file.id = id;
    file.createdAt = file.createdAt || Date.now();

    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('files/' + id).set(file);
      } catch (err) {
        console.warn("Firebase saveFile notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_files') || '{}');
    data[id] = file;
    localStorage.setItem('cf_files', JSON.stringify(data));
    if (!this.cache.files) this.cache.files = {};
    this.cache.files[id] = file;
    return file;
  }

  async deleteFile(id) {
    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('files/' + id).remove();
      } catch (err) {
        console.warn("Firebase deleteFile notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_files') || '{}');
    delete data[id];
    localStorage.setItem('cf_files', JSON.stringify(data));
    if (this.cache.files) delete this.cache.files[id];
    return true;
  }

  // --- LICENSES ---
  async getLicenses() {
    if (this.isLiveFirebase && this.db) {
      try {
        const snap = await this.db.ref('licenses').once('value');
        if (snap.exists() && snap.val()) {
          this.cache.licenses = this.normalizeDict(snap.val());
          return this.cache.licenses;
        }
      } catch (err) {
        console.warn("Firebase getLicenses notice (using local fallback):", err.message);
      }
    }
    return this.normalizeDict(JSON.parse(localStorage.getItem('cf_licenses') || '{}'));
  }

  async generateLicense(license) {
    const id = license.id || 'LIC_' + Date.now();
    license.id = id;
    license.activatedAt = license.activatedAt || Date.now();

    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('licenses/' + id).set(license);
      } catch (err) {
        console.warn("Firebase generateLicense notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_licenses') || '{}');
    data[id] = license;
    localStorage.setItem('cf_licenses', JSON.stringify(data));
    if (!this.cache.licenses) this.cache.licenses = {};
    this.cache.licenses[id] = license;
    return license;
  }

  async deleteLicense(id) {
    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('licenses/' + id).remove();
      } catch (err) {
        console.warn("Firebase deleteLicense notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_licenses') || '{}');
    delete data[id];
    localStorage.setItem('cf_licenses', JSON.stringify(data));
    if (this.cache.licenses) delete this.cache.licenses[id];
    return true;
  }

  // --- SUPPORT ---
  async getSupportTickets() {
    if (this.isLiveFirebase && this.db) {
      try {
        const snap = await this.db.ref('support').once('value');
        if (snap.exists() && snap.val()) {
          this.cache.support = this.normalizeDict(snap.val());
          return this.cache.support;
        }
      } catch (err) {
        console.warn("Firebase getSupportTickets notice (using local fallback):", err.message);
      }
    }
    return this.normalizeDict(JSON.parse(localStorage.getItem('cf_support') || '{}'));
  }

  async saveSupportTicket(ticket) {
    const id = ticket.id || 'TICK_' + Date.now();
    ticket.id = id;
    ticket.createdAt = ticket.createdAt || Date.now();
    ticket.replies = ticket.replies || [];

    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('support/' + id).set(ticket);
      } catch (err) {
        console.warn("Firebase saveSupportTicket notice:", err.message);
      }
    }
    const data = JSON.parse(localStorage.getItem('cf_support') || '{}');
    data[id] = ticket;
    localStorage.setItem('cf_support', JSON.stringify(data));
    if (!this.cache.support) this.cache.support = {};
    this.cache.support[id] = ticket;
    return ticket;
  }

  // --- SETTINGS ---
  async getSettings() {
    if (this.isLiveFirebase && this.db) {
      try {
        const snap = await this.db.ref('settings').once('value');
        const val = snap.val();
        this.cache.settings = val ? { ...DEFAULT_SETTINGS, ...val } : DEFAULT_SETTINGS;
        return this.cache.settings;
      } catch (err) {
        console.warn("Firebase getSettings notice (using local fallback):", err.message);
      }
    }
    if (this.cache.settings) return this.cache.settings;
    const stored = JSON.parse(localStorage.getItem('cf_settings') || '{}');
    this.cache.settings = { ...DEFAULT_SETTINGS, ...stored };
    return this.cache.settings;
  }

  async saveSettings(settings) {
    const merged = { ...DEFAULT_SETTINGS, ...settings };
    if (this.isLiveFirebase && this.db) {
      try {
        await this.db.ref('settings').set(merged);
      } catch (err) {
        console.warn("Firebase saveSettings notice:", err.message);
      }
    }
    localStorage.setItem('cf_settings', JSON.stringify(merged));
    this.cache.settings = merged;
    await this.applyGlobalBrandSettings();
    return merged;
  }
}

window.CF_DB = new CFDataEngine();

document.addEventListener('DOMContentLoaded', () => {
  if (window.CF_DB) {
    CF_DB.applyGlobalBrandSettings();
  }
});
