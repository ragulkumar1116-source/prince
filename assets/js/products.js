/**
 * CaptureFlex Products & Media Showcase Engine
 * Widescreen 16:9 Aspect Ratio Media Gallery & Multiformat Video Player (YouTube & MP4 Streams)
 */

class CFProductEngine {
  constructor() {
    this.products = [];
    this.files = [];
    this.settings = {};
  }

  async loadData() {
    const [prods, files, settings] = await Promise.all([
      CF_DB.getProducts(),
      CF_DB.getFiles(),
      CF_DB.getSettings()
    ]);
    this.products = Object.values(prods || {});
    this.files = Object.values(files || {});
    this.settings = settings || {};
  }

  // --- BUY NOW AUTHENTICATION GUARD ---
  handleBuyClick(productId) {
    const user = CF_AUTH.getCurrentUser();
    if (!user) {
      alert("Please log in or register an account before proceeding to payment.");
      window.location.href = `login.html?redirect=checkout&productId=${productId}`;
      return;
    }
    window.location.href = `checkout.html?productId=${productId}`;
  }

  renderFeaturedProducts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.loadData().then(() => {
      const curr = this.settings.currencySymbol || '₹';
      const activeProducts = this.products.filter(p => p.status === 'active').slice(0, 3);
      
      if (activeProducts.length === 0) {
        container.innerHTML = `
          <div class="col-12 text-center text-muted py-5">
            <i class="bi bi-box-seam display-4 d-block mb-3 opacity-50"></i>
            <h5 class="text-white">No products currently active in the database.</h5>
          </div>
        `;
        return;
      }

      container.innerHTML = activeProducts.map(p => `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="glass-card glass-card-hover h-100 p-3 d-flex flex-column">
            <div class="position-relative mb-3 overflow-hidden rounded border border-secondary border-opacity-25" style="aspect-ratio: 16 / 9;">
              <img src="${p.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'}" 
                   class="w-100 h-100" style="object-fit: cover;" alt="${p.name}">
              <span class="badge badge-cf position-absolute top-0 end-0 m-3">v${p.version || '1.0'}</span>
            </div>
            <div class="flex-grow-1">
              <h4 class="fw-bold text-white mb-2">${p.name}</h4>
              <p class="text-muted small line-clamp-2">${p.description}</p>
            </div>
            <div class="pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between gap-2">
              <div>
                <span class="fs-4 fw-bold text-gradient">${curr}${p.price}</span>
              </div>
              <div class="d-flex gap-2">
                <button onclick="CF_PRODUCT.handleBuyClick('${p.id}')" class="btn btn-cf-primary btn-sm">
                  <i class="bi bi-cart-check-fill me-1"></i> Buy Now
                </button>
                <a href="product-details.html?id=${p.id}" class="btn btn-cf-outline btn-sm">
                  Details
                </a>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    });
  }

  // --- INTERACTIVE MEDIA SHOWCASE GALLERY (16:9 ASPECT RATIO) ---
  async renderMediaShowcase(selectedCategory = 'all') {
    const container = document.getElementById('media-showcase-container');
    const filterContainer = document.getElementById('media-category-filters');
    if (!container) return;

    const allMedia = await CF_DB.getMedia();
    const mediaList = Object.values(allMedia || {}).sort((a,b) => (a.order || 999) - (b.order || 999));

    // Render Filter Buttons
    if (filterContainer) {
      const categories = ['all', ...new Set(mediaList.map(m => m.category || 'UI Screenshots'))];
      filterContainer.innerHTML = categories.map(cat => `
        <button onclick="CF_PRODUCT.renderMediaShowcase('${cat}')" 
                class="btn btn-sm ${cat === selectedCategory ? 'btn-cf-primary' : 'btn-cf-outline'} text-capitalize">
          ${cat === 'all' ? `All Previews (${mediaList.length})` : cat}
        </button>
      `).join('');
    }

    let filtered = mediaList;
    if (selectedCategory !== 'all') {
      filtered = mediaList.filter(m => m.category === selectedCategory);
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div class="col-12 text-center text-muted py-5">No media preview items found in this category.</div>`;
      return;
    }

    container.innerHTML = filtered.map(m => {
      const isVideo = m.type === 'video';
      return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div class="glass-card glass-card-hover h-100 p-3 d-flex flex-column" onclick="CF_PRODUCT.openMediaPreview('${m.id}')" style="cursor: pointer;">
            <div class="position-relative mb-3 overflow-hidden rounded border border-secondary border-opacity-25" style="aspect-ratio: 16 / 9; width: 100%;">
              <img src="${m.mediaUrl}" class="w-100 h-100" style="object-fit: cover;" alt="${m.title}">
              <span class="badge ${isVideo ? 'badge-purple' : 'badge-cf'} position-absolute top-0 start-0 m-2">
                <i class="bi ${isVideo ? 'bi-play-circle-fill' : 'bi-image'} me-1"></i> ${(m.category || (isVideo ? 'VIDEO' : 'IMAGE')).toUpperCase()}
              </span>
              ${isVideo ? `
                <div class="position-absolute top-50 start-50 translate-middle">
                  <div class="rounded-circle p-3 d-flex align-items-center justify-content-center shadow-lg" style="background: rgba(99,102,241,0.9); width: 54px; height: 54px;">
                    <i class="bi bi-play-fill fs-2 text-white ms-1"></i>
                  </div>
                </div>
              ` : ''}
            </div>
            <div class="flex-grow-1">
              <h6 class="fw-bold text-white mb-1 line-clamp-2">${m.title}</h6>
              <div class="extra-small text-muted">Item #${m.order || 1} • Click to ${isVideo ? 'play demo video' : 'preview high-res image'}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  async openMediaPreview(mediaId) {
    const allMedia = await CF_DB.getMedia();
    const item = allMedia[mediaId];
    if (!item) return;

    const modalEl = document.getElementById('mediaLightboxModal');
    if (!modalEl) return;

    document.getElementById('media-modal-title').innerText = item.title;
    const body = document.getElementById('media-modal-body');

    // Clean up any playing video when modal closes
    modalEl.addEventListener('hidden.bs.modal', () => {
      body.innerHTML = '';
    }, { once: true });

    if (item.type === 'video' && item.videoUrl) {
      const vUrl = item.videoUrl.trim();
      const isYouTube = vUrl.includes('youtube.com') || vUrl.includes('youtu.be');
      let videoMarkup = '';

      if (isYouTube) {
        let ytId = '';
        if (vUrl.includes('youtu.be/')) {
          ytId = vUrl.split('youtu.be/')[1].split('?')[0];
        } else if (vUrl.includes('v=')) {
          ytId = vUrl.split('v=')[1].split('&')[0];
        } else if (vUrl.includes('embed/')) {
          ytId = vUrl.split('embed/')[1].split('?')[0];
        }
        const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
        videoMarkup = `
          <div class="ratio ratio-16x9 rounded overflow-hidden border border-secondary">
            <iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        `;
      } else {
        videoMarkup = `
          <div class="position-relative rounded overflow-hidden border border-secondary" style="aspect-ratio: 16 / 9; background: #000;">
            <video controls autoplay playsinline class="w-100 h-100" style="object-fit: contain;">
              <source src="${vUrl}" type="video/mp4">
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
              Your browser does not support HTML5 video playback.
            </video>
          </div>
        `;
      }

      body.innerHTML = `
        <div class="p-3">
          ${videoMarkup}
          <div class="mt-3 text-start px-2">
            <span class="badge badge-purple mb-2">${item.category}</span>
            <h5 class="fw-bold text-white mb-1">${item.title}</h5>
            <div class="extra-small text-muted"><i class="bi bi-play-circle-fill text-gradient me-1"></i> Interactive High-Speed Demo Stream</div>
          </div>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="p-3">
          <div class="position-relative rounded overflow-hidden border border-secondary" style="aspect-ratio: 16 / 9; background: #0b0f19;">
            <img src="${item.mediaUrl}" class="w-100 h-100" style="object-fit: contain;" alt="${item.title}">
          </div>
          <div class="mt-3 text-start px-2">
            <span class="badge badge-cf mb-2">${item.category}</span>
            <h5 class="fw-bold text-white mb-1">${item.title}</h5>
            <div class="extra-small text-muted"><i class="bi bi-image text-gradient me-1"></i> High-Resolution UI Screenshot Preview</div>
          </div>
        </div>
      `;
    }

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }

  renderCatalog(containerId, searchInputId, platformSelectId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.loadData().then(() => {
      const curr = this.settings.currencySymbol || '₹';

      const filterAndRender = () => {
        const query = (document.getElementById(searchInputId)?.value || '').toLowerCase();
        const platform = document.getElementById(platformSelectId)?.value || 'all';

        let list = this.products.filter(p => p.status === 'active');

        if (query) {
          list = list.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
          );
        }

        if (platform !== 'all') {
          const matchingProductIds = this.files
            .filter(f => f.platform === platform || f.platform === 'All Platforms')
            .map(f => f.productId);
          list = list.filter(p => matchingProductIds.includes(p.id));
        }

        if (list.length === 0) {
          container.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
              <i class="bi bi-search display-4 d-block mb-3 opacity-50"></i>
              <h5 class="text-white">No products match your search filters.</h5>
            </div>
          `;
          return;
        }

        container.innerHTML = list.map(p => {
          const productFiles = this.files.filter(f => f.productId === p.id);
          const platforms = [...new Set(productFiles.map(f => f.platform))].join(', ') || 'Windows / Mac';

          return `
            <div class="col-lg-4 col-md-6 mb-4">
              <div class="glass-card glass-card-hover h-100 p-3 d-flex flex-column">
                <div class="position-relative mb-3 overflow-hidden rounded border border-secondary border-opacity-25" style="aspect-ratio: 16 / 9;">
                  <img src="${p.imageUrl}" class="w-100 h-100" style="object-fit: cover;" alt="${p.name}">
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge badge-purple">${platforms}</span>
                  <span class="badge badge-cf">v${p.version}</span>
                </div>
                <h4 class="fw-bold text-white mb-2">${p.name}</h4>
                <p class="text-muted small line-clamp-3 mb-4 flex-grow-1">${p.description}</p>
                <div class="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25 gap-2">
                  <span class="fs-4 fw-bold text-gradient">${curr}${p.price}</span>
                  <div class="d-flex gap-2">
                    <button onclick="CF_PRODUCT.handleBuyClick('${p.id}')" class="btn btn-cf-primary btn-sm">
                      <i class="bi bi-cart-check-fill me-1"></i> Buy Now
                    </button>
                    <a href="product-details.html?id=${p.id}" class="btn btn-cf-outline btn-sm">
                      Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      };

      filterAndRender();

      document.getElementById(searchInputId)?.addEventListener('input', filterAndRender);
      document.getElementById(platformSelectId)?.addEventListener('change', filterAndRender);
    });
  }

  renderDetailsPage() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (!productId) {
      window.location.href = 'products.html';
      return;
    }

    this.loadData().then(() => {
      const curr = this.settings.currencySymbol || '₹';
      const product = this.products.find(p => p.id === productId);

      if (!product) {
        document.getElementById('product-details-container').innerHTML = `
          <div class="text-center text-muted py-5">
            <h3 class="text-white">Product not found.</h3>
            <a href="products.html" class="btn btn-cf-outline mt-3">Back to Products</a>
          </div>
        `;
        return;
      }

      const productFiles = this.files.filter(f => f.productId === productId);

      document.title = `${product.name} | ${this.settings.siteName || 'CaptureFlex'}`;
      document.getElementById('pd-name').innerText = product.name;
      document.getElementById('pd-version').innerText = `v${product.version}`;
      document.getElementById('pd-price').innerText = `${curr}${product.price}`;
      document.getElementById('pd-description').innerText = product.description;
      document.getElementById('pd-banner').src = product.bannerUrl || product.imageUrl;

      const btnBuy = document.getElementById('pd-buy-btn');
      if (btnBuy) {
        btnBuy.setAttribute('onclick', `CF_PRODUCT.handleBuyClick('${product.id}')`);
      }

      const featuresContainer = document.getElementById('pd-features');
      if (featuresContainer && product.features && product.features.length > 0) {
        featuresContainer.innerHTML = product.features.map(f => `
          <div class="col-md-4 mb-3">
            <div class="p-3 glass-card h-100">
              <i class="bi bi-patch-check-fill text-gradient fs-4 d-block mb-2"></i>
              <h6 class="fw-bold text-white mb-1">${f.title}</h6>
              <p class="text-muted small mb-0">${f.description}</p>
            </div>
          </div>
        `).join('');
      } else if (featuresContainer) {
        featuresContainer.innerHTML = `<div class="col-12 text-muted small">Standard full feature set included.</div>`;
      }

      const filesContainer = document.getElementById('pd-files');
      if (filesContainer) {
        if (productFiles.length === 0) {
          filesContainer.innerHTML = `<div class="p-4 text-center text-muted glass-card">No downloads released for this version yet.</div>`;
        } else {
          filesContainer.innerHTML = productFiles.map(f => `
            <div class="glass-card p-3 mb-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <span class="badge badge-purple">${f.platform}</span>
                  <span class="badge badge-cf">${f.fileType || 'PACKAGE'}</span>
                  <span class="text-muted small"><i class="bi bi-hdd me-1"></i>${f.fileSize || 'Direct Link'}</span>
                </div>
                <h6 class="fw-bold text-white mb-1">${f.name} (v${f.version})</h6>
                <p class="text-muted small mb-0">${f.description || 'Production Release'}</p>
              </div>
              <div>
                <a href="${f.downloadUrl}" target="_blank" class="btn btn-cf-primary btn-sm text-nowrap">
                  <i class="bi bi-download me-1"></i> Download File
                </a>
              </div>
            </div>
          `).join('');
        }
      }
    });
  }

  // --- DEDICATED CHECKOUT PAGE RENDERER ---
  renderCheckoutPage() {
    const user = CF_AUTH.getCurrentUser();
    if (!user) {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get('productId') || '';
      window.location.href = `login.html?redirect=checkout&productId=${productId}`;
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');

    this.loadData().then(() => {
      let product = this.products.find(p => p.id === productId);
      if (!product && this.products.length > 0) {
        product = this.products[0];
      }

      const curr = this.settings.currencySymbol || '₹';
      const s = this.settings;

      // Populate User & Product Summary
      document.getElementById('chk-user-name').innerText = user.name || user.email;
      document.getElementById('chk-user-email').innerText = user.email;
      document.getElementById('chk-prod-name').innerText = product ? product.name : 'Software Product';
      document.getElementById('chk-prod-version').innerText = `v${product ? product.version : '1.0.0'}`;
      document.getElementById('chk-total-price').innerText = `${curr}${product ? product.price : 2999}`;

      // Live Timestamp
      const now = new Date();
      document.getElementById('chk-timestamp').innerText = now.toLocaleString('en-IN', {
        dateStyle: 'full', timeStyle: 'medium'
      });

      // Admin Deposit Payment Info
      const upiId = s.upiId || 'captureflex@upi';
      document.getElementById('chk-upi-id').innerText = upiId;
      document.getElementById('chk-upi-merchant').innerText = s.upiMerchantName || s.companyName || 'CaptureFlex Software';

      document.getElementById('chk-bank-holder').innerText = s.bankHolderName || s.companyName || 'CaptureFlex Software';
      document.getElementById('chk-bank-name').innerText = s.bankName || 'HDFC Bank';
      document.getElementById('chk-bank-acc').innerText = s.bankAccNo || '50200012345678';
      document.getElementById('chk-bank-ifsc').innerText = s.bankIfsc || 'HDFC0001234';

      // Dynamic QR Code generation using public QR API with UPI intent link
      const price = product ? product.price : 2999;
      const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(s.upiMerchantName || 'CaptureFlex')}&am=${price}&cu=INR`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiString)}`;
      document.getElementById('chk-qr-img').src = qrUrl;
    });
  }

  // --- SUBMIT PAYMENT TRANSACTION UTR FOR ADMIN APPROVAL ---
  async submitPaymentTxn(event) {
    event.preventDefault();
    await this.loadData();

    const user = CF_AUTH.getCurrentUser();
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');

    if (!user) {
      alert("Please log in before submitting payment verification.");
      window.location.href = 'login.html';
      return;
    }

    let product = this.products.find(p => p.id === productId);
    if (!product && this.products.length > 0) {
      product = this.products[0];
    }

    const payMethod = document.getElementById('chk-pay-method')?.value || 'UPI Instant';
    const txnId = document.getElementById('chk-txn-id')?.value.trim();
    const notes = document.getElementById('chk-notes')?.value.trim() || '';

    if (!txnId) {
      alert("Please enter a valid 12-digit UTR / Payment Transaction Reference ID.");
      return;
    }

    const paymentVerification = {
      id: 'PAY_' + Date.now(),
      txnId: 'TXN_' + Date.now(),
      utrNumber: txnId,
      userId: user.uid,
      userName: user.name || user.email,
      userEmail: user.email,
      productId: product ? product.id : (productId || 'PROD_001'),
      productName: product ? product.name : 'Software Product',
      amount: product ? product.price : 2999,
      paymentMethod: payMethod,
      customerNotes: notes,
      status: 'pending',
      submittedAt: Date.now()
    };

    await CF_DB.savePayment(paymentVerification);

    alert(`✅ Payment Verification Submitted Successfully!\n\nTransaction UTR: ${txnId}\nStatus: PENDING ADMIN APPROVAL\n\nOnce our billing team verifies your transaction, your Serial License Key will be issued live to your My Downloads Portal.`);
    window.location.href = 'downloads.html';
  }
}

window.CF_PRODUCT = new CFProductEngine();

document.addEventListener('DOMContentLoaded', () => {
  if (window.CF_PRODUCT) {
    CF_PRODUCT.loadData();
    if (document.getElementById('featured-products-container')) {
      CF_PRODUCT.renderFeaturedProducts('featured-products-container');
    }
    if (document.getElementById('media-showcase-container')) {
      CF_PRODUCT.renderMediaShowcase();
    }
  }
});
