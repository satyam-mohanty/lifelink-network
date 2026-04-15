

let allAlerts = [];
let alertFilters = { showAll: false, chipType: 'All' };

async function renderAlerts() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="view-header" style="margin-bottom:var(--space-md);">
            <h1>ALERT CENTER</h1>
            <p>System monitoring for inventory health, organ viability, and critical events</p>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-lg);">
            <div id="alert-summary-chips" style="display:flex; gap:12px;"></div>
            
            <div style="display:flex; background:var(--bg-subtle); padding:4px; border-radius:24px; gap:4px;">
                <button class="tab-btn-pill ${!alertFilters.showAll ? 'active' : ''}" id="tab-active" onclick="toggleShowAll(false)">Active Only</button>
                <button class="tab-btn-pill ${alertFilters.showAll ? 'active' : ''}" id="tab-all" onclick="toggleShowAll(true)">Show All</button>
            </div>
        </div>

        <div class="panel" style="padding:0; overflow:hidden;">
            <div id="alerts-table">
                <table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table>
            </div>
        </div>

        <style>
            .tab-btn-pill { padding:6px 16px; border-radius:20px; background:transparent; border:none; color:var(--text-secondary); font-weight:600; font-size:12px; cursor:pointer; transition:all 0.2s; }
            .tab-btn-pill.active { background:white; color:var(--text-primary); box-shadow:var(--shadow-sm); }
            
            .summary-chip { display:flex; align-items:center; gap:8px; padding:8px 16px; background:white; border:1px solid var(--border); border-radius:30px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; color:var(--text-secondary); }
            .summary-chip:hover { border-color:var(--text-muted); }
            .summary-chip.active { border-color:var(--accent-primary); box-shadow:0 0 0 1px var(--accent-primary); color:var(--text-primary); background:#FDF2F2; }
            
            .sev-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
            .sev-dot.expiry { background:#D97706; }
            .sev-dot.low_stock { background:#E02424; }
            .sev-dot.organ_expiring { background:#1A56DB; } /* Note: user mapping says 'yellow' for organ but provides 🟡. In design system, warnings typically amber, info blue. Will map correctly below. */
            
            .btn-resolve-outline { padding:4px 12px; border:1px solid var(--accent-danger); color:var(--accent-danger); border-radius:var(--radius-sm); font-size:11px; font-weight:600; background:transparent; cursor:pointer; }
            .btn-resolve-outline:hover { background:var(--accent-danger); color:white; }
            
            .alert-row.resolved { background:var(--bg-base); color:var(--text-muted); }
            .alert-row.resolved .alert-msg { text-decoration:line-through; color:var(--text-muted); }
            .alert-row.resolved td { border-bottom-color:transparent; }
        </style>
    `;
    if(window.feather) feather.replace();
    await loadAlertData();
}

function toggleShowAll(val) {
    alertFilters.showAll = val;
    document.getElementById('tab-active').classList.toggle('active', !val);
    document.getElementById('tab-all').classList.toggle('active', val);
    renderInterface();
}

function selectChipType(type) {
    if(alertFilters.chipType === type) alertFilters.chipType = 'All';
    else alertFilters.chipType = type;
    renderInterface();
}

async function loadAlertData() {
    allAlerts = await API.get('alerts?show_all=true') || []; 
    renderInterface();
}

const TYPE_CONFIG = {
    expiry: { icon: '🟠', col: '#D97706', label: 'Expiry' },
    low_stock: { icon: '🔴', col: '#E02424', label: 'Low Stock' },
    organ_expiring: { icon: '🟡', col: '#E3A008', label: 'Organ Expiring' },
    emergency: { icon: '🚨', col: '#9B1C1C', label: 'Emergency' }
};

function renderInterface() {
    const activeAlerts = allAlerts.filter(a => !a.is_resolved);
    
    
    const alertBadge = document.getElementById('topbar-alert-badge');
    if (alertBadge) {
        alertBadge.textContent = activeAlerts.length;
        alertBadge.style.display = activeAlerts.length > 0 ? 'inline' : 'none';
    }

    
    const stats = { expiry: 0, low_stock: 0, organ_expiring: 0, emergency: 0 };
    activeAlerts.forEach(a => { if(stats[a.alert_type] !== undefined) stats[a.alert_type]++; });

    document.getElementById('alert-summary-chips').innerHTML = Object.keys(TYPE_CONFIG).map(typeKey => {
        const c = TYPE_CONFIG[typeKey];
        return `
            <div class="summary-chip ${alertFilters.chipType===typeKey?'active':''}" onclick="selectChipType('${typeKey}')">
                <span>${c.icon}</span>
                <span>${c.label}: ${stats[typeKey]}</span>
            </div>
        `;
    }).join('');

    // Filter alarms for table
    let filtered = allAlerts.filter(a => {
        if(!alertFilters.showAll && a.is_resolved) return false;
        if(alertFilters.chipType !== 'All' && a.alert_type !== alertFilters.chipType) return false;
        return true;
    });

    filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    const target = document.getElementById('alerts-table');

    if (filtered.length === 0) {
        if (!alertFilters.showAll && alertFilters.chipType === 'All') {
            target.innerHTML = `
                <div style="padding:80px 20px; text-align:center;">
                    <div style="width:72px; height:72px; background:#DEF7EC; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 24px;">
                        <i data-feather="check" style="color:#0E9F6E; width:36px; height:36px;"></i>
                    </div>
                    <div style="font-family:var(--font-heading); font-size:20px; font-weight:600; color:var(--text-primary); margin-bottom:8px;">All clear — no active alerts</div>
                    <div style="color:var(--text-secondary); font-size:13px;">The system will notify you when new alerts are generated.</div>
                </div>
            `;
        } else {
             target.innerHTML = `<div class="empty-state" style="padding:60px;"><i data-feather="check-circle"></i><p>No alerts match your criteria.</p></div>`;
        }
        if(window.feather) feather.replace(); return;
    }

    target.innerHTML = `
        <table style="width:100%; border-collapse:collapse; text-align:left;">
            <thead>
                <tr>
                    <th style="padding:12px 16px; border-bottom:1px solid var(--border); width:40px;"></th>
                    <th style="padding:12px 16px; border-bottom:1px solid var(--border); font-size:11px; color:var(--text-muted); text-transform:uppercase;">Type</th>
                    <th style="padding:12px 16px; border-bottom:1px solid var(--border); font-size:11px; color:var(--text-muted); text-transform:uppercase;">Message</th>
                    <th style="padding:12px 16px; border-bottom:1px solid var(--border); font-size:11px; color:var(--text-muted); text-transform:uppercase;">Related ID</th>
                    <th style="padding:12px 16px; border-bottom:1px solid var(--border); font-size:11px; color:var(--text-muted); text-transform:uppercase;">Created</th>
                    <th style="padding:12px 16px; border-bottom:1px solid var(--border); font-size:11px; color:var(--text-muted); text-transform:uppercase;">Status</th>
                    <th style="padding:12px 16px; border-bottom:1px solid var(--border); width:80px;"></th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map(a => {
                    const c = TYPE_CONFIG[a.alert_type] || {col:'#ccc', label:a.alert_type};
                    const truncMsg = a.message.length > 60 ? a.message.substring(0, 57) + '...' : a.message;
                    
                    return `
                        <tr class="alert-row ${a.is_resolved?'resolved':''}">
                            <td style="padding:14px 16px; border-bottom:1px solid var(--border);">
                                <div class="sev-dot" style="background:${a.is_resolved ? 'var(--text-muted)' : c.col}"></div>
                            </td>
                            <td style="padding:14px 16px; border-bottom:1px solid var(--border); font-weight:600; font-size:12px;">${c.label}</td>
                            <td style="padding:14px 16px; border-bottom:1px solid var(--border); font-size:13px;" title="${a.message.replace(/"/g,'&quot;')}">
                                <span class="alert-msg" style="color:${a.is_resolved ? 'var(--text-muted)' : 'var(--text-primary)'}">${truncMsg}</span>
                            </td>
                            <td style="padding:14px 16px; border-bottom:1px solid var(--border); font-family:var(--font-mono); font-size:13px; color:var(--text-secondary);">
                                ${a.related_id ? '#'+a.related_id : '—'}
                            </td>
                            <td style="padding:14px 16px; border-bottom:1px solid var(--border); font-size:13px; color:var(--text-secondary);">
                                ${formatDateTime(a.created_at)}
                            </td>
                            <td style="padding:14px 16px; border-bottom:1px solid var(--border);">
                                ${a.is_resolved 
                                    ? '<span style="background:var(--border); color:var(--text-secondary); padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600;">Resolved</span>'
                                    : '<span style="background:#FDF2F2; color:var(--accent-danger); padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600;">Active</span>'
                                }
                            </td>
                            <td style="padding:14px 16px; border-bottom:1px solid var(--border); text-align:right;">
                                ${!a.is_resolved ? `<button class="btn-resolve-outline" onclick="resolveAlert(${a.alert_id})">Resolve</button>` : ''}
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    if(window.feather) feather.replace();
}

async function resolveAlert(id) {
    const res = await API.put(`alerts/${id}/resolve`, {});
    if(res) {
        showToast('Alert resolved', 'success');
        await loadAlertData(); 
    } else {
        showToast('Failed to resolve', 'error');
    }
}
