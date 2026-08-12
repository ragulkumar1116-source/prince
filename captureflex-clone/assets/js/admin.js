/**
 * CaptureFlex Admin Management Engine
 * Strict Admin Guards, Payments, Products, Downloads, Licenses, Customers & Media Gallery Management
 */

class CFAdminEngine {
  constructor() {
    this.adminUser = null;
    this.products = {};
    this.files = {};
    this.licenses = {};
    this.users = {};
    this.support = {};
    this.settings = {};
    this.payments = {};
    this.media = {};
    this.maskedKeys = {};
  }

  async initGuard() {
    const user = CF_AUTH.getCurrentUser();
    if (!user || user.role !== 'admin') {
      const isInsideAdminDir = window.location.pathname.includes('/admin/');
      window.location.href = isInsideAdminDir ? 'admin-auth.html' : 'admin/admin-auth.html';
      return false;
    }
    this.adminUser = user;
    await this.refreshData();
    return true;
  }

  async refreshData() {
    const [products, files, licenses, users, support, settings, payments, media] = await Promise.all([
      CF_DB.getProducts(),
      CF_DB.getFiles(),
      CF_DB.getLicenses(),
      CF_DB.getUsers(),
      CF_DB.getSupportTickets(),
      CF_DB.getSettings(),
      CF_DB.getPayments(),
      CF_DB.getMedia()
    ]);

    this.products = products || {};
    this.files = files || {};
    this.licenses = licenses || {};
    this.users = users || {};
    this.support = support || {};
    this.settings = settings || {};
    this.payments = payments || {};
    this.media = media || {};
  }

  // --- DASHBOARD OVERVIEW ---
  async renderDashboard() {
    const guardPassed = await this.initGuard();
    if (!guardPassed) return;

    const prodList = Object.values(this.products);
    const fileList = Object.values(this.files);
    const licList = Object.values(this.licenses);
    const tickList = Object.values(this.support);
    const payList = Object.values(this.payments);

    const elPayCount = document.getElementById('stat-pay-count');
    const elProdCount = document.getElementById('stat-prod-count');
    const elFileCount = document.getElementById('stat-file-count');
    const elLicCount = document.getElementById('stat-lic-count');
    const elTickCount = document.getElementById('stat-tick-count');

    if (elPayCount) elPayCount.innerText = payList.filter(p => p.status === 'pending').length;
    if (elProdCount) elProdCount.innerText = prodList.length;
    if (elFileCount) elFileCount.innerText = fileList.length;
    if (elLicCount) elLicCount.innerText = licList.length;
    if (elTickCount) elTickCount.innerText = tickList.filter(t => t.status === 'open').length;

    const recentActivity = document.getElementById('admin-recent-activity');
    if (recentActivity) {
      const combined = [
        ...payList.map(p => ({ type: 'payment', date: p.submittedAt || Date.now(), text: `Payment UTR ${p.utrNumber} submitted by ${p.userEmail}` })),
        ...licList.map(l => ({ type: 'license', date: l.activatedAt || Date.now(), text: `License issued for ${l.productName || 'Product'} to ${l.userEmail || 'Customer'}` })),
        ...tickList.map(t => ({ type: 'support', date: t.createdAt, text: `Support ticket from ${t.userName || 'User'}: "${t.subject}"` }))
      ].sort((a,b) => b.date - a.date).slice(0, 5);

      if (combined.length === 0) {
        recentActivity.innerHTML = `<div class="p-3 text-center text-muted">No recent activity logged yet.</div>`;
      } else {
        recentActivity.innerHTML = combined.map(act => `
          <div class="d-flex align-items-center justify-content-between p-3 mb-2 rounded border border-secondary border-opacity-25" style="background: #111827;">
            <div class="d-flex align-items-center gap-3">
              <i class="bi ${act.type === 'payment' ? 'bi-wallet2 text-gradient-purple' : (act.type === 'license' ? 'bi-key-fill text-gradient' : 'bi-headset text-gradient-purple')} fs-5"></i>
              <div>
                <div class="text-white small fw-bold">${act.text}</div>
                <div class="text-muted extra-small">${new Date(act.date).toLocaleString()}</div>
              </div>
            </div>
            <span class="badge ${act.type === 'payment' ? 'badge-warning-cf' : (act.type === 'license' ? 'badge-cf' : 'badge-purple')}">${act.type.toUpperCase()}</span>
          </div>
        `).join('');
      }
    }
  }

  // --- MEDIA GALLERY MANAGEMENT ---
  async renderMediaTable() {
    const guardPassed = await this.initGuard();
    if (!guardPassed) return;

    const tbody = document.getElementById('admin-media-tbody');
    if (!tbody) return;

    const list = Object.values(this.media).sort((a,b) => (a.order || 999) - (b.order || 999));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No media showcase items. Click "Add Media Showcase Item" to add one.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map((m, idx) => {
      const isVideo = m.type === 'video';
      return `
        <tr>
          <td>
            <div class="position-relative d-inline-block rounded border border-secondary" style="width: 54px; height: 38px; overflow: hidden;">
              <img src="${m.mediaUrl}" class="w-100 h-100" style="object-fit: cover;" alt="${m.title}">
              ${isVideo ? `<i class="bi bi-play-circle-fill position-absolute top-50 start-50 translate-middle text-gradient extra-small"></i>` : ''}
            </div>
          </td>
          <td>
            <div class="fw-bold text-white small">${m.title}</div>
            <div class="extra-small text-muted font-monospace">${m.id}</div>
          </td>
          <td>
            <span class="badge ${isVideo ? 'badge-purple' : 'badge-cf'}">${(m.type || 'image').toUpperCase()}</span>
          </td>
          <td>
            <span class="badge badge-warning-cf">${m.category || 'General'}</span>
          </td>
          <td>
            <span class="fw-bold text-gradient font-monospace">#${m.order || (idx + 1)}</span>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button onclick="CF_ADMIN.moveMediaOrder('${m.id}', -1)" class="btn btn-sm btn-cf-outline" title="Move Up" ${idx === 0 ? 'disabled' : ''}>
                <i class="bi bi-arrow-up"></i>
              </button>
              <button onclick="CF_ADMIN.moveMediaOrder('${m.id}', 1)" class="btn btn-sm btn-cf-outline" title="Move Down" ${idx === list.length - 1 ? 'disabled' : ''}>
                <i class="bi bi-arrow-down"></i>
              </button>
            </div>
          </td>
          <td>
            <div class="d-flex gap-2">
              <button onclick="CF_ADMIN.openMediaModal('${m.id}')" class="btn btn-sm btn-cf-outline">
                <i class="bi bi-pencil-square"></i> Edit
              </button>
              <button onclick="CF_ADMIN.deleteMedia('${m.id}')" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  async openMediaModal(mediaId = null) {
    await this.refreshData();
    const isEdit = !!mediaId;
    const modalEl = document.getElementById('mediaEditModal');
    if (!modalEl) return;

    let m = null;
    if (isEdit && mediaId) {
      m = this.media[mediaId] || Object.values(this.media).find(item => item.id === mediaId);
    }

    if (!m) {
      const currentCount = Object.keys(this.media).length;
      m = {
        title: '',
        type: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        category: 'UI Screenshots',
        order: currentCount + 1
      };
    }

    document.getElementById('modal-media-id').value = mediaId || '';
    document.getElementById('modal-media-title').value = m.title || '';
    document.getElementById('modal-media-type').value = m.type || 'image';
    document.getElementById('modal-media-url').value = m.mediaUrl || '';
    document.getElementById('modal-media-video-url').value = m.videoUrl || '';
    document.getElementById('modal-media-category').value = m.category || 'UI Screenshots';
    document.getElementById('modal-media-order').value = m.order || 1;

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }

  async saveMediaFromModal(event) {
    event.preventDefault();
    const id = document.getElementById('modal-media-id').value;
    const title = document.getElementById('modal-media-title').value.trim();
    const type = document.getElementById('modal-media-type').value;
    let mediaUrl = document.getElementById('modal-media-url').value.trim();
    let videoUrl = document.getElementById('modal-media-video-url').value.trim();
    const category = document.getElementById('modal-media-category').value;
    const order = parseInt(document.getElementById('modal-media-order').value) || 1;

    if (mediaUrl && !mediaUrl.startsWith('http://') && !mediaUrl.startsWith('https://')) {
      mediaUrl = 'https://' + mediaUrl;
    }
    if (videoUrl && !videoUrl.startsWith('http://') && !videoUrl.startsWith('https://')) {
      videoUrl = 'https://' + videoUrl;
    }

    const item = {
      id: id || undefined,
      title, type, mediaUrl, videoUrl, category, order,
      createdAt: id ? (this.media[id]?.createdAt || Date.now()) : Date.now()
    };

    await CF_DB.saveMedia(item);
    const modalEl = document.getElementById('mediaEditModal');
    const bsModal = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
    if (bsModal) bsModal.hide();

    await this.refreshData();
    this.renderMediaTable();
    alert("Media showcase item saved successfully!");
  }

  async deleteMedia(id) {
    if (confirm("Delete this media showcase item?")) {
      await CF_DB.deleteMedia(id);
      await this.refreshData();
      this.renderMediaTable();
    }
  }

  async moveMediaOrder(id, direction) {
    const list = Object.values(this.media).sort((a,b) => (a.order || 999) - (b.order || 999));
    const idx = list.findIndex(m => m.id === id);
    if (idx === -1) return;

    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const currentItem = list[idx];
    const targetItem = list[targetIdx];

    const tempOrder = currentItem.order || (idx + 1);
    currentItem.order = targetItem.order || (targetIdx + 1);
    targetItem.order = tempOrder;

    await Promise.all([
      CF_DB.saveMedia(currentItem),
      CF_DB.saveMedia(targetItem)
    ]);

    await this.refreshData();
    this.renderMediaTable();
  }

  // --- PAYMENT VERIFICATION APPROVALS ---
  async renderPaymentsTable() {
    const guardPassed = await this.initGuard();
    if (!guardPassed) return;

    const tbody = document.getElementById('admin-payments-tbody');
    if (!tbody) return;

    const curr = this.settings.currencySymbol || '₹';
    const list = Object.values(this.payments).sort((a,b) => (b.submittedAt || 0) - (a.submittedAt || 0));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No payment verification requests submitted yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(p => {
      const status = p.status || 'pending';
      const statusBadge = status === 'pending' 
        ? `<span class="badge badge-warning-cf"><i class="bi bi-clock me-1"></i> PENDING APPROVAL</span>`
        : (status === 'confirmed' 
          ? `<span class="badge badge-success-cf"><i class="bi bi-check-circle me-1"></i> CONFIRMED</span>` 
          : `<span class="badge badge-danger-cf"><i class="bi bi-x-circle me-1"></i> REJECTED</span>`);

      return `
        <tr>
          <td>
            <div class="fw-bold text-white">${p.userName || 'Customer'}</div>
            <div class="text-muted extra-small">${p.userEmail}</div>
          </td>
          <td><span class="badge badge-purple">${p.productName || 'Software'}</span></td>
          <td class="fw-bold text-gradient">${curr}${p.amount || 0}</td>
          <td>
            <div class="font-monospace fw-bold text-white">${p.utrNumber || 'N/A'}</div>
            <div class="extra-small text-muted">${p.paymentMethod || 'UPI'}</div>
          </td>
          <td class="small text-muted">${new Date(p.submittedAt || Date.now()).toLocaleString()}</td>
          <td>${statusBadge}</td>
          <td>
            ${status === 'pending' ? `
              <div class="d-flex gap-2">
                <button onclick="CF_ADMIN.approvePayment('${p.id}')" class="btn btn-sm btn-success text-nowrap">
                  <i class="bi bi-check-lg me-1"></i> Approve & Issue Key
                </button>
                <button onclick="CF_ADMIN.rejectPayment('${p.id}')" class="btn btn-sm btn-outline-danger text-nowrap">
                  <i class="bi bi-x-lg me-1"></i> Reject
                </button>
              </div>
            ` : `
              <span class="text-muted small">${p.issuedLicenseKey ? `Key: ${p.issuedLicenseKey}` : 'Closed'}</span>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  async approvePayment(payId) {
    await this.refreshData();
    const p = this.payments[payId];
    if (!p) return;

    const key = 'CF-IND-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) + '-PRO';

    const newLicense = {
      licenseKey: key,
      userId: p.userId,
      userEmail: p.userEmail,
      productId: p.productId,
      productName: p.productName,
      status: 'active',
      activatedAt: Date.now(),
      expiresAt: 'Lifetime Access',
      utrNumber: p.utrNumber
    };

    await CF_DB.generateLicense(newLicense);

    p.status = 'confirmed';
    p.issuedLicenseKey = key;
    p.approvedAt = Date.now();
    await CF_DB.savePayment(p);

    alert(`🎉 Payment Verified & Confirmed!\n\nIssued Serial Key: ${key}\nAssigned To: ${p.userEmail}`);
    await this.refreshData();
    this.renderPaymentsTable();
  }

  async rejectPayment(payId) {
    if (confirm("Reject this payment verification submission?")) {
      await this.refreshData();
      const p = this.payments[payId];
      if (p) {
        p.status = 'rejected';
        await CF_DB.savePayment(p);
        await this.refreshData();
        this.renderPaymentsTable();
      }
    }
  }

  // --- PRODUCTS MANAGEMENT ---
  async renderProductsTable() {
    const guardPassed = await this.initGuard();
    if (!guardPassed) return;

    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    const curr = this.settings.currencySymbol || '₹';
    const list = Object.values(this.products);
    
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No products created yet. Click "Create Product" to add one.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(p => `
      <tr>
        <td>
          <img src="${p.imageUrl}" class="rounded border border-secondary" style="width: 44px; height: 44px; object-fit: cover;" alt="${p.name}">
        </td>
        <td>
          <div class="fw-bold text-white">${p.name}</div>
          <div class="text-muted extra-small">${p.slug}</div>
        </td>
        <td><span class="badge badge-cf">v${p.version}</span></td>
        <td class="fw-bold text-gradient">${curr}${p.price}</td>
        <td>
          <span class="badge ${p.status === 'active' ? 'badge-success-cf' : 'badge-danger-cf'}">
            ${p.status.toUpperCase()}
          </span>
        </td>
        <td class="text-muted small">${new Date(p.createdAt || Date.now()).toLocaleDateString()}</td>
        <td>
          <div class="d-flex gap-2">
            <button onclick="CF_ADMIN.openProductModal('${p.id}')" class="btn btn-sm btn-cf-outline">
              <i class="bi bi-pencil-square"></i> Edit
            </button>
            <button onclick="CF_ADMIN.deleteProduct('${p.id}')" class="btn btn-sm btn-outline-danger">
              <i class="bi bi-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async openProductModal(productId = null) {
    await this.refreshData();
    const isEdit = !!productId;
    const modalEl = document.getElementById('productModal');
    if (!modalEl) return;

    let p = null;
    if (isEdit && productId) {
      p = this.products[productId] || Object.values(this.products).find(item => item.id === productId || item.slug === productId);
    }

    if (!p) {
      p = {
        name: '', slug: '', description: '', version: '1.0.0', price: 2999.00,
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
        bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200',
        status: 'active'
      };
    }

    document.getElementById('modal-prod-id').value = productId || '';
    document.getElementById('modal-prod-name').value = p.name || '';
    document.getElementById('modal-prod-slug').value = p.slug || '';
    document.getElementById('modal-prod-desc').value = p.description || '';
    document.getElementById('modal-prod-version').value = p.version || '1.0.0';
    document.getElementById('modal-prod-price').value = p.price || 2999;
    document.getElementById('modal-prod-img').value = p.imageUrl || '';
    document.getElementById('modal-prod-banner').value = p.bannerUrl || '';
    document.getElementById('modal-prod-status').value = p.status || 'active';

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }

  async saveProductFromModal(event) {
    event.preventDefault();
    const id = document.getElementById('modal-prod-id').value;
    const name = document.getElementById('modal-prod-name').value.trim();
    const slug = document.getElementById('modal-prod-slug').value.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const description = document.getElementById('modal-prod-desc').value.trim();
    const version = document.getElementById('modal-prod-version').value.trim();
    const price = parseFloat(document.getElementById('modal-prod-price').value) || 0;
    let imageUrl = document.getElementById('modal-prod-img').value.trim();
    let bannerUrl = document.getElementById('modal-prod-banner').value.trim();
    const status = document.getElementById('modal-prod-status').value;

    if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      imageUrl = 'https://' + imageUrl;
    }
    if (bannerUrl && !bannerUrl.startsWith('http://') && !bannerUrl.startsWith('https://')) {
      bannerUrl = 'https://' + bannerUrl;
    }

    const product = {
      id: id || undefined,
      name, slug, description, version, price, imageUrl, bannerUrl, status,
      createdAt: id ? (this.products[id]?.createdAt || Date.now()) : Date.now()
    };

    await CF_DB.saveProduct(product);
    const modalEl = document.getElementById('productModal');
    const bsModal = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
    if (bsModal) bsModal.hide();

    await this.refreshData();
    this.renderProductsTable();
    alert("Product saved successfully!");
  }

  async deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
      await CF_DB.deleteProduct(id);
      await this.refreshData();
      this.renderProductsTable();
    }
  }

  // --- DOWNLOAD FILES MANAGEMENT ---
  async renderFilesTable() {
    const guardPassed = await this.initGuard();
    if (!guardPassed) return;

    const tbody = document.getElementById('admin-files-tbody');
    if (!tbody) return;

    const list = Object.values(this.files);
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No download files uploaded. Click "Register Download Link" to add one.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(f => {
      const prod = this.products[f.productId] || { name: 'General Product' };
      const isUnmaskedUrl = !!this.maskedKeys['file_' + f.id];
      const displayUrl = isUnmaskedUrl ? f.downloadUrl : '••••••••••••••••••••••••••••••••';

      return `
        <tr>
          <td class="fw-bold text-white">${f.name}</td>
          <td><span class="badge badge-purple">${prod.name}</span></td>
          <td><span class="badge badge-cf">v${f.version}</span></td>
          <td><span class="badge badge-warning-cf">${f.platform}</span></td>
          <td class="small text-muted">${f.fileSize || 'N/A'}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <a href="${f.downloadUrl}" target="_blank" class="small font-monospace text-decoration-none ${isUnmaskedUrl ? 'text-white' : 'star-masked'}">${displayUrl}</a>
              <button class="btn btn-sm btn-link text-white p-0" onclick="CF_ADMIN.toggleMask('file_${f.id}', 'files')" title="Toggle Masking">
                <i class="bi ${isUnmaskedUrl ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-gradient"></i>
              </button>
            </div>
          </td>
          <td>
            <div class="d-flex gap-2">
              <button onclick="CF_ADMIN.openFileModal('${f.id}')" class="btn btn-sm btn-cf-outline"><i class="bi bi-pencil-square"></i> Edit</button>
              <button onclick="CF_ADMIN.deleteFile('${f.id}')" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i> Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  async openFileModal(fileId = null) {
    await this.refreshData();
    const isEdit = !!fileId;
    const modalEl = document.getElementById('fileModal');
    if (!modalEl) return;

    const prodSelect = document.getElementById('modal-file-prod');
    const prodList = Object.values(this.products);
    
    if (prodList.length === 0) {
      prodSelect.innerHTML = `<option value="PROD_DEFAULT">Default Product</option>`;
    } else {
      prodSelect.innerHTML = prodList.map(p => `
        <option value="${p.id}">${p.name} (v${p.version})</option>
      `).join('');
    }

    const f = isEdit ? this.files[fileId] : {
      productId: prodList[0]?.id || 'PROD_001',
      name: 'Flex GUI Pro ZXP Package',
      version: '7.0.1',
      fileType: 'ZXP',
      platform: 'Windows',
      downloadUrl: 'https://example.com/downloads/Flex-GUI-Pro.zxp',
      fileSize: '25.4 MB',
      description: 'Official release'
    };

    document.getElementById('modal-file-id').value = fileId || '';
    if (f.productId && prodSelect.querySelector(`option[value="${f.productId}"]`)) {
      prodSelect.value = f.productId;
    }
    document.getElementById('modal-file-name').value = f.name || '';
    document.getElementById('modal-file-version').value = f.version || '1.0.0';
    document.getElementById('modal-file-type').value = f.fileType || 'ZXP';
    document.getElementById('modal-file-platform').value = f.platform || 'Windows';
    document.getElementById('modal-file-url').value = f.downloadUrl || '';
    document.getElementById('modal-file-size').value = f.fileSize || '25 MB';
    document.getElementById('modal-file-desc').value = f.description || '';

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }

  async saveFileFromModal(event) {
    event.preventDefault();
    const id = document.getElementById('modal-file-id').value;
    const productId = document.getElementById('modal-file-prod').value;
    const name = document.getElementById('modal-file-name').value.trim();
    const version = document.getElementById('modal-file-version').value.trim();
    const fileType = document.getElementById('modal-file-type').value;
    const platform = document.getElementById('modal-file-platform').value;
    let downloadUrl = document.getElementById('modal-file-url').value.trim();
    const fileSize = document.getElementById('modal-file-size').value.trim();
    const description = document.getElementById('modal-file-desc').value.trim();

    if (!downloadUrl.startsWith('http://') && !downloadUrl.startsWith('https://')) {
      downloadUrl = 'https://' + downloadUrl;
    }

    const file = {
      id: id || undefined,
      productId, name, version, fileType, platform, downloadUrl, fileSize, description,
      createdAt: id ? (this.files[id]?.createdAt || Date.now()) : Date.now()
    };

    await CF_DB.saveFile(file);
    const modalEl = document.getElementById('fileModal');
    const bsModal = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
    if (bsModal) bsModal.hide();

    await this.refreshData();
    this.renderFilesTable();
    alert("Download link registered successfully!");
  }

  async deleteFile(id) {
    if (confirm("Delete this download link?")) {
      await CF_DB.deleteFile(id);
      await this.refreshData();
      this.renderFilesTable();
    }
  }

  // --- SERIAL LICENSES MANAGEMENT ---
  async renderLicensesTable() {
    const guardPassed = await this.initGuard();
    if (!guardPassed) return;

    const tbody = document.getElementById('admin-licenses-tbody');
    if (!tbody) return;

    const list = Object.values(this.licenses);
    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No active licenses generated yet. Click "Generate License Key" to issue one.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(l => {
      const isUnmasked = !!this.maskedKeys['lic_' + l.id];
      const displayKey = isUnmasked ? l.licenseKey : '••••-••••-••••-••••';

      return `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <span class="font-monospace fw-bold ${isUnmasked ? 'text-gradient' : 'star-masked'}">${displayKey}</span>
              <button class="btn btn-sm btn-link text-white p-0" onclick="CF_ADMIN.toggleMask('lic_${l.id}', 'licenses')" title="Toggle Masking">
                <i class="bi ${isUnmasked ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-gradient"></i>
              </button>
            </div>
          </td>
          <td class="text-white">${l.userEmail || 'Customer'}</td>
          <td class="small text-muted">${l.productName || 'Product'}</td>
          <td><span class="badge badge-success-cf">${l.status.toUpperCase()}</span></td>
          <td class="small text-muted">${l.expiresAt || 'Lifetime'}</td>
          <td>
            <button onclick="CF_ADMIN.deleteLicense('${l.id}')" class="btn btn-sm btn-outline-danger">
              <i class="bi bi-trash"></i> Revoke
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  toggleMask(keyId, tableType) {
    this.maskedKeys[keyId] = !this.maskedKeys[keyId];
    if (tableType === 'licenses') this.renderLicensesTable();
    if (tableType === 'files') this.renderFilesTable();
  }

  async openLicenseModal(preselectedUid = null) {
    await this.refreshData();
    const modalEl = document.getElementById('licenseModal');
    if (!modalEl) return;

    const userSelect = document.getElementById('modal-lic-user');
    const userList = Object.values(this.users);
    
    if (userList.length === 0) {
      userSelect.innerHTML = `<option value="UID_ADMIN_01|admin@captureflex.in">System Admin (admin@captureflex.in)</option>`;
    } else {
      userSelect.innerHTML = userList.map(u => `
        <option value="${u.uid}|${u.email}">${u.name || 'User'} (${u.email})</option>
      `).join('');
    }

    if (preselectedUid) {
      const matchOpt = Array.from(userSelect.options).find(opt => opt.value.startsWith(preselectedUid + '|'));
      if (matchOpt) userSelect.value = matchOpt.value;
    }

    const prodSelect = document.getElementById('modal-lic-prod');
    const prodList = Object.values(this.products);
    
    if (prodList.length === 0) {
      prodSelect.innerHTML = `<option value="PROD_001|Flex GUI Pro">Flex GUI Pro</option>`;
    } else {
      prodSelect.innerHTML = prodList.map(p => `
        <option value="${p.id}|${p.name}">${p.name} (v${p.version})</option>
      `).join('');
    }

    const key = 'CF-IND-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) + '-PRO';
    document.getElementById('modal-lic-key').value = key;

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }

  async saveLicenseFromModal(event) {
    event.preventDefault();
    const userSelectEl = document.getElementById('modal-lic-user');
    const prodSelectEl = document.getElementById('modal-lic-prod');
    
    const userVal = (userSelectEl ? userSelectEl.value : '').split('|');
    const prodVal = (prodSelectEl ? prodSelectEl.value : '').split('|');
    const licenseKey = document.getElementById('modal-lic-key').value.trim();

    const license = {
      licenseKey,
      userId: userVal[0] || 'UID_ADMIN_01',
      userEmail: userVal[1] || 'admin@captureflex.in',
      productId: prodVal[0] || 'PROD_001',
      productName: prodVal[1] || 'Flex GUI Pro',
      status: 'active',
      activatedAt: Date.now(),
      expiresAt: 'Lifetime Access'
    };

    await CF_DB.generateLicense(license);
    const modalEl = document.getElementById('licenseModal');
    const bsModal = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
    if (bsModal) bsModal.hide();

    await this.refreshData();
    this.renderLicensesTable();
    if (document.getElementById('admin-customers-tbody')) {
      this.renderCustomersTable();
    }
    alert("License Key issued successfully!");
  }

  async deleteLicense(id) {
    if (confirm("Revoke this customer license key?")) {
      await CF_DB.deleteLicense(id);
      await this.refreshData();
      this.renderLicensesTable();
      if (document.getElementById('admin-customers-tbody')) {
        this.renderCustomersTable();
      }
    }
  }

  // --- CUSTOMERS DIRECTORY MANAGEMENT ---
  async renderCustomersTable() {
    const guardPassed = await this.initGuard();
    if (!guardPassed) return;

    const tbody = document.getElementById('admin-customers-tbody');
    if (!tbody) return;

    const list = Object.values(this.users || {});
    
    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">No customer accounts registered yet in database.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(u => {
      const name = u.name || (u.email ? u.email.split('@')[0] : 'Registered Customer');
      const email = u.email || 'No Email';
      const role = (u.role || 'customer').toUpperCase();
      const userLics = Object.values(this.licenses).filter(l => l.userId === u.uid || (l.userEmail && l.userEmail.toLowerCase() === email.toLowerCase()));
      const userLicCount = userLics.length;
      const regDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A';

      return `
        <tr>
          <td class="fw-bold text-white">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-person-circle fs-5 text-gradient"></i>
              <div>
                <div>${name}</div>
                <div class="extra-small text-muted">ID: ${u.uid || 'N/A'}</div>
              </div>
            </div>
          </td>
          <td class="text-white">${email}</td>
          <td><span class="badge ${role === 'ADMIN' ? 'badge-purple' : 'badge-cf'}">${role}</span></td>
          <td>
            <button onclick="CF_ADMIN.viewCustomerLicensesModal('${u.uid}')" class="btn btn-sm btn-outline-info text-nowrap">
              <i class="bi bi-key-fill me-1"></i> ${userLicCount} Active Key(s)
            </button>
          </td>
          <td class="small text-muted">${regDate}</td>
          <td>
            <div class="d-flex gap-2">
              <button onclick="CF_ADMIN.openLicenseModal('${u.uid}')" class="btn btn-sm btn-cf-primary text-nowrap" title="Issue License Key">
                <i class="bi bi-plus-circle me-1"></i> Grant Key
              </button>
              <button onclick="CF_ADMIN.toggleUserRole('${u.uid}')" class="btn btn-sm btn-cf-outline text-nowrap">
                <i class="bi bi-person-gear me-1"></i> Toggle Role
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  async viewCustomerLicensesModal(uid) {
    await this.refreshData();
    const user = this.users[uid] || Object.values(this.users).find(u => u.uid === uid);
    if (!user) return;

    const email = user.email || '';
    const userLics = Object.values(this.licenses).filter(l => l.userId === uid || (l.userEmail && l.userEmail.toLowerCase() === email.toLowerCase()));

    const modalEl = document.getElementById('customerLicensesModal');
    if (!modalEl) return;

    document.getElementById('cust-modal-name').innerText = user.name || user.email;
    document.getElementById('cust-modal-email').innerText = user.email;

    const container = document.getElementById('cust-modal-licenses-list');
    if (userLics.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-muted glass-card">No active serial license keys granted to this user yet.</div>`;
    } else {
      container.innerHTML = userLics.map(l => `
        <div class="glass-card p-3 mb-2 d-flex align-items-center justify-content-between">
          <div>
            <div class="fw-bold text-white small">${l.productName || 'Software Product'}</div>
            <div class="font-monospace text-gradient small fw-bold">${l.licenseKey}</div>
            <div class="text-muted extra-small">Activated: ${new Date(l.activatedAt || Date.now()).toLocaleDateString()}</div>
          </div>
          <span class="badge badge-success-cf">${(l.status || 'active').toUpperCase()}</span>
        </div>
      `).join('');
    }

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  }

  async toggleUserRole(uid) {
    const user = this.users[uid];
    if (!user) return;
    user.role = user.role === 'admin' ? 'customer' : 'admin';
    await CF_DB.saveUser(user);
    await this.refreshData();
    this.renderCustomersTable();
  }

  // --- SUPPORT DESK MANAGEMENT ---
  async renderSupportTable() {
    const guardPassed = await this.initGuard();
    if (!guardPassed) return;

    const container = document.getElementById('admin-support-list');
    if (!container) return;

    const list = Object.values(this.support);
    if (list.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-muted">No support tickets found.</div>`;
      return;
    }

    container.innerHTML = list.map(t => `
      <div class="glass-card p-4 mb-3">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center gap-2">
            <span class="badge ${t.status === 'open' ? 'badge-warning-cf' : 'badge-success-cf'}">${(t.status || 'OPEN').toUpperCase()}</span>
            <strong class="text-white">${t.userName || 'Customer'}</strong> (${t.userEmail || ''})
          </div>
          <span class="text-muted small">${new Date(t.createdAt || Date.now()).toLocaleString()}</span>
        </div>
        <h5 class="fw-bold text-white mb-2">${t.subject || 'Support Query'}</h5>
        <p class="text-muted small mb-3">${t.message || ''}</p>

        ${(t.replies || []).length > 0 ? `
          <div class="p-3 mb-3 rounded" style="background: rgba(0,0,0,0.3);">
            <div class="extra-small text-gradient fw-bold mb-2">Reply Thread:</div>
            ${t.replies.map(r => `
              <div class="mb-2 extra-small text-muted">
                <strong class="text-white">${r.senderName || r.sender}:</strong> ${r.message}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="d-flex gap-2">
          <button onclick="CF_ADMIN.replyTicketPrompt('${t.id}')" class="btn btn-cf-primary btn-sm">
            <i class="bi bi-reply me-1"></i> Post Reply
          </button>
          <button onclick="CF_ADMIN.toggleTicketStatus('${t.id}')" class="btn btn-cf-outline btn-sm">
            Toggle Open/Resolved
          </button>
        </div>
      </div>
    `).join('');
  }

  async replyTicketPrompt(ticketId) {
    const reply = prompt("Enter your response for the customer:");
    if (!reply || !reply.trim()) return;

    const ticket = this.support[ticketId];
    if (ticket) {
      ticket.replies = ticket.replies || [];
      ticket.replies.push({
        sender: 'admin',
        senderName: 'Admin Support',
        message: reply.trim(),
        timestamp: Date.now()
      });
      ticket.status = 'in-progress';
      await CF_DB.saveSupportTicket(ticket);
      await this.refreshData();
      this.renderSupportTable();
    }
  }

  async toggleTicketStatus(ticketId) {
    const ticket = this.support[ticketId];
    if (ticket) {
      ticket.status = ticket.status === 'open' || ticket.status === 'in-progress' ? 'resolved' : 'open';
      await CF_DB.saveSupportTicket(ticket);
      await this.refreshData();
      this.renderSupportTable();
    }
  }

  // --- SETTINGS MANAGEMENT ---
  async renderSettingsForm() {
    const guardPassed = await this.initGuard();
    if (!guardPassed) return;

    const s = this.settings;
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('set-site-name', s.siteName);
    setVal('set-company-name', s.companyName);
    setVal('set-company-address', s.companyAddress);
    setVal('set-company-phone', s.companyPhone);
    setVal('set-support-email', s.supportEmail);
    setVal('set-currency-symbol', s.currencySymbol || '₹');
    
    // Deposit settings
    setVal('set-upi-id', s.upiId);
    setVal('set-upi-merchant', s.upiMerchantName);
    setVal('set-bank-holder', s.bankHolderName);
    setVal('set-bank-name', s.bankName);
    setVal('set-bank-acc', s.bankAccNo);
    setVal('set-bank-ifsc', s.bankIfsc);

    // Branding
    setVal('set-hero-title', s.heroTitle);
    setVal('set-hero-subtitle', s.heroSubtitle);
    setVal('set-logo-url', s.logoUrl);
    setVal('set-hero-url', s.heroImageUrl);
  }

  async saveSettingsForm(event) {
    event.preventDefault();

    const getVal = (id) => (document.getElementById(id)?.value || '').trim();

    const siteName = getVal('set-site-name');
    const companyName = getVal('set-company-name');
    const companyAddress = getVal('set-company-address');
    const companyPhone = getVal('set-company-phone');
    const supportEmail = getVal('set-support-email');
    const currencySymbol = getVal('set-currency-symbol') || '₹';

    const upiId = getVal('set-upi-id');
    const upiMerchantName = getVal('set-upi-merchant');
    const bankHolderName = getVal('set-bank-holder');
    const bankName = getVal('set-bank-name');
    const bankAccNo = getVal('set-bank-acc');
    const bankIfsc = getVal('set-bank-ifsc');

    const heroTitle = getVal('set-hero-title');
    const heroSubtitle = getVal('set-hero-subtitle');
    const logoUrl = getVal('set-logo-url');
    const heroImageUrl = getVal('set-hero-url');

    const newSettings = {
      siteName, companyName, companyAddress, companyPhone, supportEmail,
      currencySymbol, upiId, upiMerchantName, bankHolderName, bankName, bankAccNo, bankIfsc,
      heroTitle, heroSubtitle, logoUrl, heroImageUrl
    };

    await CF_DB.saveSettings(newSettings);
    this.settings = newSettings;

    if (window.CF_PRODUCT) {
      CF_PRODUCT.settings = newSettings;
    }

    alert("Settings Updated! Site branding & Payment Deposit settings saved and synchronized.");
  }
}

window.CF_ADMIN = new CFAdminEngine();
