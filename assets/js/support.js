/**
 * CaptureFlex Customer Support Engine
 * Support Ticket Submission, Live Reply Threads & Real-Time Sync
 */

class CFSupportEngine {
  constructor() {
    this.user = null;
    this.tickets = [];
  }

  async init() {
    this.user = CF_AUTH.getCurrentUser();
    if (!this.user) {
      window.location.href = 'login.html';
      return;
    }

    const allTickets = await CF_DB.getSupportTickets();
    const email = (this.user.email || '').toLowerCase();
    const uid = this.user.uid;

    this.tickets = Object.values(allTickets || {}).filter(
      t => t.userId === uid || (t.userEmail && t.userEmail.toLowerCase() === email)
    ).sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));

    this.renderTicketsList();
  }

  renderTicketsList() {
    const container = document.getElementById('support-tickets-list');
    if (!container) return;

    if (this.tickets.length === 0) {
      container.innerHTML = `
        <div class="glass-card p-4 text-center text-muted">
          <i class="bi bi-chat-left-dots display-4 d-block mb-3 opacity-50"></i>
          <h6 class="text-white">No active support tickets found.</h6>
          <p class="small mb-0">Need help with installation or licensing? Submit a ticket using the form on the right.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.tickets.map(t => {
      const statusBadge = t.status === 'open' 
        ? '<span class="badge badge-warning-cf">OPEN</span>' 
        : t.status === 'in-progress'
        ? '<span class="badge badge-purple">IN PROGRESS</span>'
        : '<span class="badge badge-success-cf">RESOLVED</span>';

      const replyCount = (t.replies || []).length;

      return `
        <div class="glass-card p-4 mb-3">
          <div class="d-flex align-items-center justify-content-between mb-2">
            ${statusBadge}
            <span class="text-muted extra-small">${new Date(t.createdAt || Date.now()).toLocaleString()}</span>
          </div>
          <h5 class="fw-bold text-white mb-2">${t.subject}</h5>
          <p class="text-muted small mb-3">${t.message}</p>
          
          ${replyCount > 0 ? `
            <div class="border-top border-secondary border-opacity-25 pt-3 mt-3">
              <h6 class="extra-small text-uppercase tracking-wider text-gradient fw-bold mb-2">
                <i class="bi bi-chat-right-text me-1"></i> Responses (${replyCount})
              </h6>
              ${t.replies.map(r => `
                <div class="p-3 mb-2 rounded ${r.sender === 'admin' ? 'border border-cyan border-opacity-25' : ''}" style="background: rgba(0,0,0,0.3);">
                  <div class="d-flex justify-content-between align-items-center extra-small text-muted mb-1">
                    <strong class="${r.sender === 'admin' ? 'text-gradient fw-bold' : 'text-white'}">${r.senderName || r.sender}</strong>
                    <span>${new Date(r.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div class="small text-light">${r.message}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="border-top border-secondary border-opacity-25 pt-3 mt-3 text-end">
            <button onclick="CF_SUPPORT.promptReply('${t.id}')" class="btn btn-cf-outline btn-sm">
              <i class="bi bi-reply-fill me-1"></i> Add Reply
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  async submitTicket(event) {
    event.preventDefault();
    if (!this.user) {
      alert("Please log in before submitting a support ticket.");
      window.location.href = 'login.html';
      return;
    }

    const subject = document.getElementById('ticket-subject').value.trim();
    const message = document.getElementById('ticket-message').value.trim();

    if (!subject || !message) {
      alert("Please enter both a subject and message.");
      return;
    }

    const newTicket = {
      id: 'TICK_' + Date.now(),
      userId: this.user.uid,
      userName: this.user.name || this.user.email,
      userEmail: this.user.email,
      subject: subject,
      message: message,
      status: 'open',
      createdAt: Date.now(),
      replies: []
    };

    await CF_DB.saveSupportTicket(newTicket);
    alert("🎉 Support ticket submitted successfully! Our team will review and reply shortly.");
    document.getElementById('support-ticket-form').reset();
    await this.init();
  }

  async promptReply(ticketId) {
    const replyText = prompt("Enter your response message:");
    if (!replyText || !replyText.trim()) return;

    const allTickets = await CF_DB.getSupportTickets();
    const ticket = allTickets[ticketId];

    if (ticket) {
      ticket.replies = ticket.replies || [];
      ticket.replies.push({
        sender: 'customer',
        senderName: this.user.name || this.user.email,
        message: replyText.trim(),
        timestamp: Date.now()
      });
      ticket.status = 'open';

      await CF_DB.saveSupportTicket(ticket);
      await this.init();
    }
  }
}

window.CF_SUPPORT = new CFSupportEngine();

document.addEventListener('DOMContentLoaded', () => {
  if (window.CF_SUPPORT) {
    CF_SUPPORT.init();
  }
});
