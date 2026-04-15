

let allOrgans = [];
let selectedOrgan = null;
let organInterval = null;

const ORGAN_VIABILITY_HOURS = { heart: 6, lungs: 8, kidney: 36, liver: 24, cornea: 72, pancreas: 24, intestine: 12 };

async function renderOrgans() {
    if (organInterval) { clearInterval(organInterval); organInterval = null; }

    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="view-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md);">
            <div><p style="color:var(--text-secondary);font-size:14px;margin:0;">Manage organ inventory and viability trackers</p></div>
            <button class="btn btn-primary" onclick="toggleOrganDrawer()"><i data-feather="plus"></i> Register Organ</button>
        </div>

        <div style="display:flex; gap:var(--space-lg); align-items:flex-start; min-height:600px;">
            <!-- Left: List -->
            <div style="flex:1; min-width:0;">
                <div class="panel" style="padding:var(--space-md); margin-bottom:var(--space-md); display:flex; gap:var(--space-md); align-items:flex-end;">
                    <div class="form-group" style="margin:0; flex:1;">
                        <label class="form-label">Organ Type</label>
                        <select class="form-select" id="of-type" onchange="filterOrgans()"><option value="All">All Types</option><option>kidney</option><option>liver</option><option>heart</option><option>lungs</option><option>cornea</option><option>pancreas</option><option>intestine</option></select>
                    </div>
                    <div class="form-group" style="margin:0; flex:1;">
                        <label class="form-label">Status</label>
                        <select class="form-select" id="of-status" onchange="filterOrgans()"><option value="All">All Status</option><option value="available" selected>Available</option><option>matched</option><option>transplanted</option><option>expired</option></select>
                    </div>
                </div>
                <div class="panel" style="padding:0; overflow:hidden;" id="organs-list">
                    <table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table>
                </div>
            </div>

            <!-- Right: Sticky Detail Panel -->
            <div id="organ-detail-panel" style="width:340px; position:sticky; top:var(--space-lg); display:none;">
                <!-- Content injected dynamically -->
            </div>
            
            <!-- Empty state for detail panel -->
            <div id="organ-detail-empty" style="width:340px; position:sticky; top:var(--space-lg); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:var(--space-xl); background:var(--bg-subtle); border:1px dashed var(--border); border-radius:var(--radius); color:var(--text-muted); text-align:center;">
                <i data-feather="mouse-pointer" style="width:32px; height:32px; margin-bottom:12px; color:var(--border-focus);"></i>
                <div style="font-size:14px; font-weight:500;">Select an organ</div>
                <div style="font-size:12px; margin-top:4px;">Click a row to view full details and matching options.</div>
            </div>
        </div>

        <!-- Slide-in Registration Form -->
        <div class="modal-overlay" id="organ-drawer-overlay" onclick="closeOrganDrawer()"></div>
        <div class="slide-panel" id="organ-drawer" style="width:420px;">
            <div class="slide-panel-inner" style="padding:0;">
                <div style="padding:var(--space-xl);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg);">
                        <div style="font-family:var(--font-heading);font-weight:600;font-size:18px;">Register Organ</div>
                        <button class="modal-close" onclick="closeOrganDrawer()"><i data-feather="x"></i></button>
                    </div>
                    <form onsubmit="submitOrgan(event)">
                        
                        <div style="font-size:12px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;margin-bottom:8px;">Organ Type *</div>
                        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:16px;" id="organ-type-grid">
                            ${Object.keys(ORGAN_VIABILITY_HOURS).map(o => `
                                <button type="button" class="organ-type-btn" data-type="${o}" onclick="selectOrganType('${o}')" style="padding:12px 4px; display:flex; flex-direction:column; align-items:center; gap:4px; border:1px solid var(--border); border-radius:12px; background:white; cursor:pointer; font-weight:500; font-size:11px; text-transform:capitalize; transition:all 0.2s;">
                                    <span style="font-size:20px;">${ORGAN_EMOJI[o]||'🔴'}</span>
                                    <span>${o}</span>
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" name="organ_type" id="selected-organ-type" required>
                        <div style="font-size:12px; color:var(--text-muted); margin-bottom:var(--space-md); margin-top:-8px;" id="organ-viability-helper">Select type to show viability window.</div>

                        <div class="form-row">
                            <div class="form-group"><label class="form-label">Donor ID *</label><input class="form-input" type="number" name="donor_id" required></div>
                            <div class="form-group"><label class="form-label">Donor Type *</label>
                                <select class="form-select" name="donor_type" required><option value="living">Living</option><option value="cadaveric">Cadaveric</option></select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label class="form-label">Harvested At *</label><input class="form-input" type="datetime-local" name="harvested_at" required id="harvested_at_input" onchange="calculateExpiryPreview()"></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label class="form-label">Tissue Type</label><input class="form-input" name="tissue_type" placeholder="e.g. HLA-A2"></div>
                            <div class="form-group"><label class="form-label">Storage Hospital ID</label><input class="form-input" type="number" name="storage_hospital_id"></div>
                        </div>

                        <div style="margin-top:var(--space-xl); display:flex; justify-content:flex-end; gap:12px;">
                            <button type="button" class="btn btn-secondary" onclick="closeOrganDrawer()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <style>
            .organ-type-btn.selected { border-color:var(--accent-primary) !important; background:var(--bg-subtle) !important; box-shadow:0 0 0 1px var(--accent-primary) !important; color:var(--accent-primary); }
            .organ-row:hover { background:var(--bg-subtle); cursor:pointer; }
            .organ-row.selected { background:#EFF6FF; }
        </style>
    `;
    if(window.feather) feather.replace();

    
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('harvested_at_input').value = now.toISOString().slice(0, 16);

    await loadOrganData();
    organInterval = setInterval(ticker, 1000);
}

async function loadOrganData() {
    allOrgans = await API.get('organs') || [];
    filterOrgans();
}


function filterOrgans() {
    const oType = document.getElementById('of-type').value;
    const oStatus = document.getElementById('of-status').value;
    
    let filtered = allOrgans.filter(o => {
        if(oType !== 'All' && o.organ_type !== oType) return false;
        if(oStatus !== 'All' && o.status !== oStatus) return false;
        return true;
    });

    
    filtered.sort((a, b) => {
        if (!a.expires_at) return 1;
        if (!b.expires_at) return -1;
        return new Date(a.expires_at) - new Date(b.expires_at);
    });

    const listHtml = filtered.length === 0 
        ? `<div class="empty-state" style="padding:40px;"><i data-feather="heart"></i><p>No organs found</p></div>`
        : `<div class="table-wrapper" style="border:none;"><table style="width:100%;">
            <thead><tr><th style="width:40px;padding-left:16px;"></th><th>Type</th><th>Donor</th><th>Blood Type</th><th>Status</th><th>Viability Remaining</th></tr></thead>
            <tbody>
                ${filtered.map(o => {
                    return `
                        <tr class="organ-row ${selectedOrgan && selectedOrgan.organ_id === o.organ_id ? 'selected' : ''}" onclick="selectOrgan(${o.organ_id})">
                            <td style="font-size:20px; padding-left:16px; text-align:center;">${ORGAN_EMOJI[o.organ_type]||'🔴'}</td>
                            <td style="font-weight:600; color:var(--text-primary); text-transform:capitalize;">${o.organ_type}</td>
                            <td><span style="font-family:var(--font-mono); font-size:12px;">#${o.donor_id}</span></td>
                            <td><span style="background:${BLOOD_COLORS[o.blood_type]||'#eee'}; color:#111827; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600;">${o.blood_type||'—'}</span></td>
                            <td>${statusBadge(o.status)}</td>
                            <td>
                                <div class="organ-progress-container" data-id="${o.organ_id}" style="width:80px;"></div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table></div>`;

    document.getElementById('organs-list').innerHTML = listHtml;
    if(window.feather) feather.replace();
    
    updateProgressBars();
}

function updateProgressBars() {
    document.querySelectorAll('.organ-progress-container').forEach(el => {
        const id = parseInt(el.dataset.id);
        const organ = allOrgans.find(o => o.organ_id === id);
        if(!organ) return;
        
        let pct = 0; let color = '#E5E7EB'; let text = '—';
        if(organ.status === 'available' && organ.expires_at) {
            const now = new Date().getTime();
            const start = new Date(organ.harvested_at).getTime();
            const end = new Date(organ.expires_at).getTime();
            const total = end - start;
            let remaining = end - now;
            
            if(remaining < 0) remaining = 0;
            pct = total > 0 ? (remaining / total) * 100 : 0;
            
            if(pct > 50) color = '#0E9F6E';
            else if(pct > 20) color = '#D97706';
            else color = '#E02424';
            
            const hrs = Math.floor(remaining / 3600000);
            const mins = Math.floor((remaining % 3600000) / 60000);
            text = `${hrs}h ${mins}m remaining`;
            
            if(remaining === 0) text = 'Expired';
        }

        el.innerHTML = `
            <div style="background:var(--border); height:6px; border-radius:3px; overflow:hidden; width:100%;">
                <div style="height:100%; width:${pct}%; background:${color};"></div>
            </div>
            <div style="font-size:10px; font-weight:600; color:${color}; margin-top:4px;">${text}</div>
        `;
    });
}

function ticker() {
    updateProgressBars();
    
    
    if(selectedOrgan && selectedOrgan.status === 'available' && selectedOrgan.expires_at) {
        const timerEl = document.getElementById('sticky-timer');
        if(timerEl) {
            const end = new Date(selectedOrgan.expires_at).getTime();
            const diff = end - new Date().getTime();
            if(diff <= 0) {
                timerEl.textContent = "00:00:00";
                timerEl.style.color = '#E02424';
            } else {
                const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                timerEl.textContent = `${h}:${m}:${s}`;
                timerEl.style.color = diff < 2*3600000 ? '#E02424' : '#111827';
            }
        }
    }
}

function selectOrgan(id) {
    selectedOrgan = allOrgans.find(o => o.organ_id === id);
    if(!selectedOrgan) return;
    
    
    document.querySelectorAll('.organ-row').forEach(r => r.classList.remove('selected'));
    const rows = document.querySelectorAll('.organ-row');
    
    filterOrgans(); 

    document.getElementById('organ-detail-empty').style.display = 'none';
    const panel = document.getElementById('organ-detail-panel');
    panel.style.display = 'block';

    const o = selectedOrgan;
    const isAvail = o.status === 'available';

    panel.innerHTML = `
        <div class="panel" style="padding:var(--space-xl); position:relative;">
            <button class="modal-close" style="position:absolute; top:20px; right:20px;" onclick="closeOrganDetail()"><i data-feather="x"></i></button>
            <div style="text-align:center; padding-bottom:var(--space-md); border-bottom:1px solid var(--border); margin-bottom:var(--space-md);">
                <div style="font-size:48px; margin-bottom:4px;">${ORGAN_EMOJI[o.organ_type]||'🔴'}</div>
                <div style="font-family:var(--font-heading); font-size:24px; font-weight:700; color:var(--text-primary); text-transform:capitalize;">${o.organ_type}</div>
                <div style="margin-top:8px;">${statusBadge(o.status)}</div>
            </div>
            
            <div style="margin-bottom:var(--space-md); text-align:center;">
                <div style="font-size:11px; text-transform:uppercase; color:var(--text-muted); font-weight:600; margin-bottom:4px;">Viability Timer</div>
                <div id="sticky-timer" style="font-family:var(--font-mono); font-size:36px; font-weight:700; letter-spacing:2px; color:#111827; line-height:1;">
                    ${isAvail ? '--:--:--' : '00:00:00'}
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:var(--space-lg); background:var(--bg-subtle); padding:16px; border-radius:var(--radius-sm);">
                <div><div style="font-size:10px; text-transform:uppercase; color:var(--text-muted);">Donor ID</div><div style="font-weight:600; font-size:13px;">#${o.donor_id}</div></div>
                <div><div style="font-size:10px; text-transform:uppercase; color:var(--text-muted);">Blood</div><div style="font-weight:600; font-size:13px;"><span style="background:${BLOOD_COLORS[o.blood_type]||'#eee'}; padding:2px 6px; border-radius:10px;">${o.blood_type||'—'}</span></div></div>
                <div><div style="font-size:10px; text-transform:uppercase; color:var(--text-muted);">Harvested</div><div style="font-weight:500; font-size:12px;">${formatDateTime(o.harvested_at)}</div></div>
                <div><div style="font-size:10px; text-transform:uppercase; color:var(--text-muted);">Storage</div><div style="font-weight:500; font-size:12px;">Hosp #${o.storage_hospital_id||'—'}</div></div>
                <div style="grid-column:1/-1;"><div style="font-size:10px; text-transform:uppercase; color:var(--text-muted);">Tissue Type</div><div style="font-weight:500; font-size:12px;">${o.tissue_type||'—'}</div></div>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
                ${isAvail ? `
                    <button class="btn btn-primary" style="width:100%; justify-content:center;" onclick="goMatching('${o.organ_type}')">
                        <i data-feather="git-pull-request"></i> Run Matching
                    </button>
                    <!-- Small status toggles can go here -->
                ` : `
                    <div style="text-align:center; color:var(--text-muted); font-size:12px;">Organ is no longer available.</div>
                `}
            </div>
        </div>
    `;
    if(window.feather) feather.replace();
    ticker(); 
}

function closeOrganDetail() {
    selectedOrgan = null;
    document.getElementById('organ-detail-panel').style.display = 'none';
    document.getElementById('organ-detail-empty').style.display = 'flex';
    filterOrgans();
}

function goMatching(type) {
    
    
    navigateTo('matching');
    setTimeout(() => {
        const sel = document.getElementById('me-organ-type');
        if(sel) { sel.value = type; }
    }, 200);
}


function toggleOrganDrawer() {
    document.getElementById('organ-drawer').classList.add('open');
    document.getElementById('organ-drawer-overlay').classList.add('show');
}
function closeOrganDrawer() {
    document.getElementById('organ-drawer').classList.remove('open');
    document.getElementById('organ-drawer-overlay').classList.remove('show');
}

function selectOrganType(type) {
    document.getElementById('selected-organ-type').value = type;
    document.querySelectorAll('.organ-type-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelector(`.organ-type-btn[data-type="${type}"]`).classList.add('selected');
    
    
    const hrs = ORGAN_VIABILITY_HOURS[type];
    const helper = document.getElementById('organ-viability-helper');
    helper.textContent = `Viability: ${hrs} hours window`;
    calculateExpiryPreview();
}

function calculateExpiryPreview() {
    const type = document.getElementById('selected-organ-type').value;
    const startStr = document.getElementById('harvested_at_input').value;
    const helper = document.getElementById('organ-viability-helper');
    if(!type || !startStr) return;
    
    const hrs = ORGAN_VIABILITY_HOURS[type];
    const dt = new Date(startStr);
    dt.setHours(dt.getHours() + hrs);
    helper.innerHTML = `<span style="color:var(--text-primary); font-weight:500;">Viability window: ${hrs}h</span> (Expires: ${formatDateTime(dt.toISOString())})`;
}

async function submitOrgan(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    if(!data.organ_type) { showToast('Select an organ type', 'error'); return; }
    
    const res = await API.post('organs', data);
    if(res && res.organ_id) {
        showToast('Organ registered', 'success');
        closeOrganDrawer();
        e.target.reset();
        document.querySelectorAll('.organ-type-btn').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('organ-viability-helper').textContent = 'Select type to show viability window.';
        await loadOrganData();
    } else {
        showToast('Failed to register', 'error');
    }
}
