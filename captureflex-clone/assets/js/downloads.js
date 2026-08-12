/**
 * CaptureFlex Customer Downloads & Profile Portal Manager
 * Displays Customer Profile Header, Payment Status Timeline, Active Serial Keys & Direct Download Links
 */

class CFDownloadsEngine {
  constructor() {
    this.user = null;
    this.licenses = [];
    this.files = [];
    this.products = [];
    this.payments = [];
    this.maskedKeys = {};
  }

  async loadUserData() {
    this.user = CF_AUTH.getCurrentUser();
    if (!this.user) {
      window.location.href = 'login.html';
      return false;
    }

    const [licenses, files, products, payments] = await Promise.all([
      CF_DB.getLicenses(),
      CF_DB.getFiles(),
      CF_DB.getProducts(),
      CF_DB.getPayments()
    ]);

    const email = (this.user.email || '').toLowerCase();
    const uid = this.user.uid;

    this.files = Object.values(files || {});
    this.products = Object.values(products || {});

    // Filter payments for this customer
    this.payments = Object.values(payments || {}).filter(p => 
      (p.userId && p.userId === uid) || 
      (p.userEmail && p.userEmail.toLowerCase() === email)
    );

    // Filter explicit licenses for this customer
    let userLics = Object.values(licenses || {}).filter(l => 
      (l.userId && l.userId === uid) || 
      (l.userEmail && l.userEmail.toLowerCase() === email)
    );

    // Synthesize licenses from confirmed payments to guarantee 100% display after approval
    this.payments.forEach(p => {
      if (p.status === 'confirmed' && p.issuedLicenseKey) {
        const exists = userLics.some(l => l.licenseKey === p.issuedLicenseKey);
        if (!exists) {
          userLics.push({
            id: p.id || ('LIC_' + Date.now()),
            licenseKey: p.issuedLicenseKey,
            userId: p.userId || uid,
            userEmail: p.userEmail || email,
            productId: p.productId || 'PROD_001',
            productName: p.productName || 'Software Product',
            status: 'active',
            activatedAt: p.approvedAt || p.submittedAt || Date.now(),
            expiresAt: 'Lifetime Access'
          });
        }
      }
    });

    this.licenses = userLics;

    this.renderCustomerProfile();
    this.renderCustomerPortal();
    return true;
  }

  toggleKeyMask(licId) {
    this.maskedKeys[licId] = !this.maskedKeys[licId];
    this.renderCustomerPortal();
  }

  renderCustomerProfile() {
    const profileCard = document.getElementById('customer-profile-card');
    if (!profileCard || !this.user) return;

    const activeLicCount = this.licenses.length;
    const pendingPayCount = this.payments.filter(p => p.status === 'pending').length;
    const confirmedPayCount = this.payments.filter(p => p.status === 'confirmed').length;

    profileCard.innerHTML = `
      <div class="row align-items-center g-4">
        <div class="col-md-7">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="rounded-circle p-3 d-flex align-items-center justify-content-center" style="background: rgba(99,102,241,0.2); width: 64px; height: 64px;">
              <i class="bi bi-person-circle fs-1 text-gradient"></i>
            </div>
            <div>
              <h2 class="fw-bold text-white mb-0">${this.user.name || this.user.email}</h2>
              <div class="text-muted small">${this.user.email}</div>
              <div class="d-flex align-items-center gap-2 mt-1">
                <span class="badge ${this.user.role === 'admin' ? 'badge-purple' : 'badge-cf'}">${(this.user.role || 'customer').toUpperCase()} ACCOUNT</span>
                <span class="text-muted extra-small">ID: ${this.user.uid}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-5">
          <div class="row g-2 text-center">
            <div class="col-4">
              <div class="p-3 glass-card rounded">
                <div class="extra-small text-muted text-uppercase fw-bold">Licenses</div>
                <div class="fs-4 fw-bold text-gradient">${activeLicCount}</div>
              </div>
            </div>
            <div class="col-4">
              <div class="p-3 glass-card rounded border border-warning border-opacity-25">
                <div class="extra-small text-muted text-uppercase fw-bold">Pending</div>
                <div class="fs-4 fw-bold text-warning">${pendingPayCount}</div>
              </div>
            </div>
            <div class="col-4">
              <div class="p-3 glass-card rounded border border-success border-opacity-25">
                <div class="extra-small text-muted text-uppercase fw-bold">Approved</div>
                <div class="fs-4 fw-bold text-success">${confirmedPayCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderCustomerPortal() {
    const container = document.getElementById('customer-licenses-container');
    if (!container) return;

    // 1. Payment Verification Submissions Timeline & Statuses
    let paymentsHtml = '';
    if (this.payments.length > 0) {
      paymentsHtml = `
        <div class="mb-5">
          <h5 class="fw-bold text-white mb-3"><i class="bi bi-wallet2 text-gradient-purple me-2"></i> Payment Verification Transactions</h5>
          <div class="row g-3">
            ${this.payments.sort((a,b) => (b.submittedAt || 0) - (a.submittedAt || 0)).map(p => {
              const status = p.status || 'pending';
              const statusBadge = status === 'pending'
                ? `<span class="badge badge-warning-cf"><i class="bi bi-clock me-1"></i> PENDING ADMIN APPROVAL</span>`
                : (status === 'confirmed'
                  ? `<span class="badge badge-success-cf"><i class="bi bi-check-circle-fill me-1"></i> APPROVED & ACTIVATED</span>`
                  : `<span class="badge badge-danger-cf"><i class="bi bi-x-circle me-1"></i> REJECTED</span>`);

              return `
                <div class="col-md-6">
                  <div class="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        ${statusBadge}
                        <span class="fs-5 fw-bold text-gradient">₹${p.amount || 0}</span>
                      </div>
                      <h5 class="fw-bold text-white mb-1">${p.productName || 'Software Product'}</h5>
                      <div class="text-muted small mb-2">Transaction UTR: <span class="font-monospace fw-bold text-white">${p.utrNumber || 'N/A'}</span></div>
                      ${p.issuedLicenseKey ? `
                        <div class="p-2 rounded mb-2 font-monospace extra-small text-gradient fw-bold" style="background: rgba(0,0,0,0.3);">
                          Key Issued: ${p.issuedLicenseKey}
                        </div>
                      ` : ''}
                    </div>
                    <div class="text-muted extra-small pt-2 border-top border-secondary border-opacity-25">
                      Submitted: ${new Date(p.submittedAt || Date.now()).toLocaleString()}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // 2. Active Licenses & Downloads List
    if (this.licenses.length === 0) {
      container.innerHTML = `
        ${paymentsHtml}
        <div class="text-center py-5 glass-card p-5">
          <i class="bi bi-box-seam display-3 d-block text-gradient mb-3"></i>
          <h3 class="fw-bold text-white mb-2">No Active Serial Licenses Found</h3>
          <p class="text-muted small mb-4">Once your submitted payment UTR is verified by the admin, your software serial key and package download links will automatically display here!</p>
          <a href="products.html" class="btn btn-cf-primary">Browse Software Catalog</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      ${paymentsHtml}
      <h5 class="fw-bold text-white mb-3"><i class="bi bi-key-fill text-gradient me-2"></i> My Active License Keys & Software Installers</h5>
      ${this.licenses.map(lic => {
        const prod = this.products.find(p => p.id === lic.productId || p.name === lic.productName) || {
          id: lic.productId || 'PROD_001',
          name: lic.productName || 'Software Package',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
          version: '1.0.0'
        };

        const matchingFiles = this.files.filter(f => f.productId === prod.id || f.productId === lic.productId);
        const isUnmasked = !!this.maskedKeys[lic.id];
        const displayKey = isUnmasked ? lic.licenseKey : '••••-••••-••••-••••';

        return `
          <div class="glass-card p-4 mb-4">
            <div class="row align-items-center g-3 mb-3 pb-3 border-bottom border-secondary border-opacity-25">
              <div class="col-md-2 text-center text-md-start">
                <img src="${prod.imageUrl}" class="rounded border border-secondary" style="width: 72px; height: 72px; object-fit: cover;" alt="${prod.name}">
              </div>
              <div class="col-md-5">
                <h4 class="fw-bold text-white mb-1">${prod.name}</h4>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge badge-cf">v${prod.version || '1.0'}</span>
                  <span class="badge badge-success-cf"><i class="bi bi-shield-check me-1"></i> APPROVED & ACTIVATED</span>
                </div>
              </div>
              <div class="col-md-5 text-md-end">
                <div class="extra-small text-muted mb-1">Generated Serial Key:</div>
                <div class="d-flex align-items-center justify-content-md-end gap-2">
                  <span class="font-monospace fs-5 fw-bold ${isUnmasked ? 'text-gradient' : 'star-masked'}">${displayKey}</span>
                  <button class="btn btn-sm btn-link text-white p-0" onclick="CF_DOWNLOADS.toggleKeyMask('${lic.id}')" title="Toggle Key Mask">
                    <i class="bi ${isUnmasked ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-gradient fs-5"></i>
                  </button>
                  <button class="btn btn-sm btn-cf-outline" onclick="navigator.clipboard.writeText('${lic.licenseKey}'); alert('License Key copied to clipboard!');">
                    <i class="bi bi-copy"></i> Copy
                  </button>
                </div>
              </div>
            </div>

            <!-- Direct Installer Download Links -->
            <div class="pt-2">
              <div class="extra-small text-uppercase fw-bold tracking-wider text-muted mb-3">Available Direct Link Downloads:</div>
              ${matchingFiles.length === 0 ? `
                <div class="small text-muted fst-italic">No installer packages linked yet. Contact support for offline installer links.</div>
              ` : `
                <div class="row g-2">
                  ${matchingFiles.map(f => `
                    <div class="col-md-6">
                      <div class="p-3 rounded d-flex align-items-center justify-content-between" style="background: rgba(0,0,0,0.3);">
                        <div>
                          <div class="fw-bold text-white small">${f.name}</div>
                          <div class="extra-small text-muted"><span class="badge badge-purple me-1">${f.platform}</span> ${f.fileSize || 'Direct Link'}</div>
                        </div>
                        <a href="${f.downloadUrl}" target="_blank" class="btn btn-cf-primary btn-sm">
                          <i class="bi bi-download me-1"></i> Download ${f.fileType || 'Installer'}
                        </a>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          </div>
        `;
      }).join('')}
    `;
  }
}

window.CF_DOWNLOADS = new CFDownloadsEngine();

document.addEventListener('DOMContentLoaded', () => {
  if (window.CF_DOWNLOADS) {
    CF_DOWNLOADS.loadUserData();
  }
});
