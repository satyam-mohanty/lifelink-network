
const API = {
    get: async (endpoint) => {
        try {
            const res = await fetch(`/api/${endpoint}`);
            if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
            return await res.json();
        } catch (err) {
            console.error('API GET error:', err);
            showToast('Failed to fetch data', 'error');
            return null;
        }
    },

    post: async (endpoint, data) => {
        try {
            const res = await fetch(`/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) { showToast(json.error || 'Request failed', 'error'); return null; }
            return json;
        } catch (err) {
            console.error('API POST error:', err);
            showToast('Request failed', 'error');
            return null;
        }
    },

    put: async (endpoint, data) => {
        try {
            const res = await fetch(`/api/${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok) { showToast(json.error || 'Update failed', 'error'); return null; }
            return json;
        } catch (err) {
            console.error('API PUT error:', err);
            showToast('Update failed', 'error');
            return null;
        }
    },

    delete: async (endpoint) => {
        try {
            const res = await fetch(`/api/${endpoint}`, { method: 'DELETE' });
            return await res.json();
        } catch (err) {
            console.error('API DELETE error:', err);
            return null;
        }
    },
};


const TOAST_ICONS = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
};

function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
        <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}


function statusBadge(status) {
    if (!status) return '—';
    return `<span class="badge badge-${status}">${status}</span>`;
}

function urgencyBadge(level) {
    if (!level) return '—';
    return `<span class="badge badge-${level}">${level}</span>`;
}


function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}


function timeAgo(dateStr) {
    if (!dateStr) return '';
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}


const BLOOD_COLORS = {
    'A+': '#FDE8E8', 'A-': '#FCD5CE', 'B+': '#D1FAE5', 'B-': '#A7F3D0',
    'AB+': '#DBEAFE', 'AB-': '#BFDBFE', 'O+': '#FEF3C7', 'O-': '#FDE68A'
};

const ORGAN_EMOJI = {
    kidney: '🫘', liver: '🫁', heart: '🫀', lungs: '🫁',
    cornea: '👁️', pancreas: '🟤', intestine: '🔴'
};

const URGENCY_LEVELS = {
    critical: { val: 4, col: '#E02424' },
    high:     { val: 3, col: '#D97706' },
    medium:   { val: 2, col: '#1A56DB' },
    low:      { val: 1, col: '#0E9F6E' }
};


function countdown(expiresAt) {
    if (!expiresAt) return { text: '—', urgent: false };
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    if (diff <= 0) return { text: 'EXPIRED', urgent: true };
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    if (hours < 1) return { text: `${mins}m ${secs}s`, urgent: true };
    return { text: `${hours}h ${mins}m`, urgent: hours < 3 };
}
