

let allBloodBags = [];
let bloodSummary = [];
let currentBloodFilter = 'All';
let bloodStatusFilter = 'available';
let bloodSearchQuery = '';

async function renderBlood() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="view-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md);">
            <div><p style="color:var(--text-secondary);font-size:14px;margin:0;">Manage blood stock and track expiry</p></div>
            <div style="display:flex;gap:var(--space-sm);">
                <button class="btn btn-secondary" onclick="runExpireCheck()"><i data-feather="clock"></i> Run Expiry Check</button>
                <button class="btn btn-primary" onclick="toggleBloodDrawer()"><i data-feather="plus"></i> Add Blood Bag</button>
            </div>
        </div>

        <!-- Summary Grid (4x2) -->
        <div id="blood-summary-section" style="display:grid; grid-template-columns:repeat(4,1fr); gap:var(--space-md); margin-bottom:var(--space-lg);">
            <!-- Rendered dynamically -->
        </div>

        <!-- Controls Bar -->
        <div class="panel" style="padding:var(--space-md); margin-bottom:var(--space-lg); display:flex; gap:var(--space-md); align-items:flex-end;">
            <div class="form-group" style="margin:0; flex:1; min-width:200px; position:relative;">
                <label class="form-label">Search</label>
                <i data-feather="search" style="position:absolute; left:12px; top:34px; width:14px; height:14px; color:var(--text-muted);"></i>
                <input class="form-input" id="search-input" placeholder="Search Bag UID or Donor ID..." style="padding-left:34px;" oninput="handleSearch(this.value)">
            </div>
            <div class="form-group" style="margin:0; flex:1; max-width:200px;">
                <label class="form-label">Status Filter</label>
                <select class="form-select" id="status-select" onchange="handleStatusFilter(this.value)">
                    <option value="available" selected>Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="transfused">Transfused</option>
                    <option value="expired">Expired</option>
                    <option value="All">All Statuses</option>
                </select>
            </div>
        </div>

        <!-- Table -->
        <div class="panel" style="padding: 0; overflow: hidden;">
            <div id="blood-table"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
        </div>

        <!-- Slide-in Add Form -->
        <div class="modal-overlay" id="blood-drawer-overlay" onclick="closeBloodDrawer()"></div>
        <div class="slide-panel" id="blood-drawer" style="width: 420px;">
            <div class="slide-panel-inner" style="padding: 0;">
                <div style="padding:var(--space-xl);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);">
                        <div style="font-family:var(--font-heading);font-weight:600;font-size:18px;">Add Blood Bag</div>
                        <button class="modal-close" onclick="closeBloodDrawer()"><i data-feather="x"></i></button>
                    </div>
                    <form onsubmit="submitBlood(event)">
                        <div class="form-row">
                            <div class="form-group"><label class="form-label">Donor ID</label><input class="form-input" type="number" name="donor_id" placeholder="Optional"></div>
                            <div class="form-group"><label class="form-label">Blood Type *</label>
                                <select class="form-select" name="blood_type" required><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label class="form-label">Quantity (ml) *</label><input class="form-input" type="number" name="quantity_ml" value="450" required></div>
                            <div class="form-group"><label class="form-label">Collected Date *</label><input class="form-input" type="date" name="collected_date" id="collected_date_input" required onchange="calculateExpiry()"></div>
                        </div>
                        <div style="font-size:12px; color:var(--text-muted); margin-top:-8px; margin-bottom:var(--space-md);" id="expiry_helper">Expires: —</div>
                        
                        <div class="form-group"><label class="form-label">Storage Location</label><input class="form-input" name="storage_location" placeholder="e.g. Fridge A, Shelf 3"></div>
                        
                        <div style="margin-top:var(--space-xl); display:flex; gap:12px; justify-content:flex-end;">
                            <button type="button" class="btn btn-secondary" onclick="closeBloodDrawer()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Add Bag</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    if(window.feather) feather.replace();
    
    
    document.getElementById('collected_date_input').valueAsDate = new Date();
    calculateExpiry();

    await loadBloodData();
}

async function loadBloodData() {
    document.getElementById('blood-table').innerHTML = `<table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table>`;
    
    
    allBloodBags = await API.get('blood') || [];
    
    
    const types = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
    bloodSummary = types.map(t => {
        return {
            blood_type: t,
            count: allBloodBags.filter(b => b.blood_type === t && b.status === 'available').length
        }
    });

    renderSummaryGrid();
    renderBloodTable();
}

function renderSummaryGrid() {
    const grid = document.getElementById('blood-summary-section');
    grid.innerHTML = bloodSummary.map(s => {
        let borderCol = '#0E9F6E';
        let badge = '';
        if (s.count < 3) {
            borderCol = '#E02424';
            badge = '<span style="color:#E02424; font-size:11px; font-weight:600;">⚠ Critical</span>';
        } else if (s.count <= 9) {
            borderCol = '#D97706';
        }
        
        const isSelected = currentBloodFilter === s.blood_type;
        const bg = isSelected ? 'var(--bg-subtle)' : 'white';
        const shadow = isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)';

        return `
            <div style="background:${bg}; border:1px solid var(--border); border-radius:var(--radius-sm); padding:16px; cursor:pointer; box-shadow:${shadow}; transition:all 0.2s;" onclick="toggleBloodFilter('${s.blood_type}')">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div style="font-family:var(--font-heading); font-size:28px; font-weight:700; color:var(--text-primary); line-height:1;">${s.blood_type}</div>
                    ${badge}
                </div>
                <div style="font-size:13px; color:var(--text-secondary); margin-top:8px;">${s.count} units available</div>
            </div>
        `;
    }).join('');
}

function toggleBloodFilter(type) {
    if (currentBloodFilter === type) {
        currentBloodFilter = 'All';
    } else {
        currentBloodFilter = type;
    }
    renderSummaryGrid();
    renderBloodTable();
}

function handleStatusFilter(val) {
    bloodStatusFilter = val;
    renderBloodTable();
}

function handleSearch(val) {
    bloodSearchQuery = val.toLowerCase();
    renderBloodTable();
}



function renderBloodTable() {
    const target = document.getElementById('blood-table');
    
    let filtered = allBloodBags.filter(b => {
        if (currentBloodFilter !== 'All' && b.blood_type !== currentBloodFilter) return false;
        if (bloodStatusFilter !== 'All' && b.status !== bloodStatusFilter) return false;
        if (bloodSearchQuery) {
            const matchesUid = b.bag_uid.toLowerCase().includes(bloodSearchQuery);
            const matchesDonor = b.donor_id && String(b.donor_id).includes(bloodSearchQuery);
            if (!matchesUid && !matchesDonor) return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        renderEmptyState(target, { icon: 'droplet', title: 'No blood bags in inventory', subtitle: 'Nothing to show' });
        if(window.feather) feather.replace();
        return;
    }

    target.innerHTML = `
        <div class="table-wrapper" style="border:none;">
            <table style="width:100%;">
                <thead><tr>
                    <th style="padding-left:var(--space-lg);">Bag UID</th><th>Blood Type</th><th>Qty (ml)</th><th>Donor</th><th>Collected</th><th>Expires</th><th>Status</th><th>Location</th>
                </tr></thead>
                <tbody>${filtered.map(b => {
                    const bCol = BLOOD_COLORS[b.blood_type] || '#E5E7EB';
                    const isExpiringSoon = b.status === 'available' && new Date(b.expiry_date) - new Date() < 7 * 86400000;
                    return `<tr>
                        <td style="padding-left:var(--space-lg);">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-family:var(--font-mono); font-size:13px; font-weight:600; color:var(--text-primary);">${b.bag_uid}</span>
                                <button onclick="copyToClipboard('${b.bag_uid}')" style="background:none; border:none; color:var(--text-muted); cursor:pointer; padding:2px;" title="Copy to clipboard">
                                    <i data-feather="copy" style="width:12px; height:12px;"></i>
                                </button>
                            </div>
                        </td>
                        <td><span style="background:${bCol}; color:#111827; padding:4px 8px; border-radius:12px; font-weight:600; font-size:11px;">${b.blood_type}</span></td>
                        <td style="font-weight:500;">${b.quantity_ml}ml</td>
                        <td>${b.donor_id ? '#' + b.donor_id : '—'}</td>
                        <td>${formatDate(b.collected_date)}</td>
                        <td style="${isExpiringSoon ? 'color:var(--status-red);font-weight:600;' : ''}">${formatDate(b.expiry_date)}</td>
                        <td>${statusBadge(b.status)}</td>
                        <td>${b.storage_location || '—'}</td>
                    </tr>`;
                }).join('')}</tbody>
            </table>
        </div>
    `;
    if(window.feather) feather.replace();
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!', 'info'));
}

function calculateExpiry() {
    const collectedStr = document.getElementById('collected_date_input').value;
    if (!collectedStr) return;
    const d = new Date(collectedStr);
    d.setDate(d.getDate() + 42); 
    document.getElementById('expiry_helper').textContent = `Expires: ${formatDate(d.toISOString())}`;
}

function toggleBloodDrawer() {
    const drawer = document.getElementById('blood-drawer');
    const overlay = document.getElementById('blood-drawer-overlay');
    
    if(!drawer.classList.contains('open')) {
        drawer.classList.add('open');
        overlay.classList.add('show');
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('show');
    }
}
function closeBloodDrawer() {
    document.getElementById('blood-drawer').classList.remove('open');
    document.getElementById('blood-drawer-overlay').classList.remove('show');
}

async function submitBlood(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const res = await API.post('blood', data);
    if (res && res.bag_id) {
        showToast('Bag added successfully', 'success');
        closeBloodDrawer();
        e.target.reset();
        await loadBloodData();
    } else {
        showToast('Failed to add blood bag', 'error');
    }
}

async function runExpireCheck() {
    const res = await API.post('blood/expire-check', {});
    if (res) {
        showToast('Expiry check completed', 'info');
        await loadBloodData();
    }
}
