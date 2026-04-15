

let allHospitals = [];
let hospAllPatients = [];
let hospAllRequests = [];

async function renderHospitals() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-lg);">
            <div><p style="color:var(--text-secondary);font-size:14px;margin:0;" id="hospitals-subtitle">Loading hospitals...</p></div>
            <button class="btn btn-primary" onclick="toggleHospitalDrawer('register')"><i data-feather="plus"></i> Register Hospital</button>
        </div>

        <div id="hospitals-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:var(--space-md);">
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:24px; width: 100%;">    ${Array(4).fill(0).map(()=>`        <div class="organ-card" style="padding:24px; min-height:160px;">           <div class="skeleton-row" style="width:40px; height:40px; border-radius:8px; margin-bottom:16px;"></div>           <div class="skeleton-row" style="width:60%; height:20px; margin-bottom:8px;"></div>           <div class="skeleton-row" style="width:40%; height:14px; margin-bottom:24px;"></div>           <div style="display:flex; gap:8px;">               <div class="skeleton-row" style="width:50%; height:14px;"></div>               <div class="skeleton-row" style="width:50%; height:14px;"></div>           </div>        </div>    `).join('')}</div>
        </div>

        <!-- Single Drawer -->
        <div class="modal-overlay" id="hospital-drawer-overlay" onclick="closeHospitalDrawer()"></div>
        <div class="slide-panel" id="hospital-drawer" style="width: 500px;">
            <div class="slide-panel-inner" id="hospital-drawer-content" style="padding:0;">
                <!-- Content injected dynamically -->
            </div>
        </div>
    `;
    if(window.feather) feather.replace();
    await loadHospitalData();
}

async function loadHospitalData() {
    
    const [h, p, r] = await Promise.all([
        API.get('hospitals'),
        API.get('patients'),
        API.get('requests')
    ]);
    allHospitals = h || [];
    hospAllPatients = p || [];
    hospAllRequests = r || [];
    document.getElementById('hospitals-subtitle').textContent = `${allHospitals.length} registered facilities`;
    renderHospitalsGrid();
}

function renderHospitalsGrid() {
    const grid = document.getElementById('hospitals-grid');
    if (allHospitals.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i data-feather="home"></i><p>No hospitals found</p></div>`;
        if(window.feather) feather.replace(); return;
    }

    grid.innerHTML = allHospitals.map(h => {
        const hPatients = hospAllPatients.filter(p => p.hospital_id === h.hospital_id).length;
        const hRequests = hospAllRequests.filter(r => r.hospital_id === h.hospital_id).length;
        
        const borderCol = h.is_verified ? '#0E9F6E' : '#D97706';
        const badge = h.is_verified 
            ? '<span style="color:#0E9F6E; background:#DEF7EC; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600;"><i data-feather="check-circle" style="width:10px; height:10px; margin-bottom:-1px;"></i> Verified</span>'
            : '<span style="color:#D97706; background:#FDF6B2; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600;">Pending</span>';

        return `
        <div class="panel" style="padding:16px; margin-bottom:0; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                <div style="font-family:var(--font-heading); font-weight:600; font-size:16px; color:var(--text-primary); line-height:1.3;">${h.name}</div>
                <div>${badge}</div>
            </div>
            
            <div style="font-size:13px; color:var(--text-secondary); margin-bottom:4px; display:flex; gap:8px; align-items:center;">
                <i data-feather="map-pin" style="width:12px; height:12px;"></i> ${h.city||'—'}, ${h.state||'—'}
            </div>
            <div style="font-size:13px; color:var(--text-secondary); margin-bottom:4px; display:flex; gap:8px; align-items:center;">
                <i data-feather="phone" style="width:12px; height:12px;"></i> ${h.phone||'—'}
            </div>
            <div style="font-size:13px; color:var(--text-secondary); margin-bottom:16px; display:flex; gap:8px; align-items:center;">
                <i data-feather="file-text" style="width:12px; height:12px;"></i> <span style="font-family:var(--font-mono); font-size:12px;">${h.license_number}</span>
            </div>

            <div style="margin-top:auto; padding-top:16px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:12px; font-weight:500; color:var(--text-muted);">
                    <span style="color:var(--text-primary);">${hPatients}</span> pts <span style="margin:0 4px;color:var(--border);">|</span> <span style="color:var(--text-primary);">${hRequests}</span> reqs
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn ${h.is_verified ? 'btn-secondary' : 'btn-primary'} btn-sm" style="padding:0 10px; font-size:11px;" onclick="toggleVerify(${h.hospital_id}, ${!h.is_verified})">
                        ${h.is_verified ? 'Revoke' : 'Verify'}
                    </button>
                    <button class="btn btn-secondary btn-sm" style="padding:0 10px; font-size:11px;" onclick="toggleHospitalDrawer('view', ${h.hospital_id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
    if(window.feather) feather.replace();
}

async function toggleVerify(id, val) {
    await API.put(`hospitals/${id}/verify`, { is_verified: val });
    showToast(val ? 'Hospital verified' : 'Verification revoked', 'success');
    await loadHospitalData();
}

function toggleHospitalDrawer(mode, id = null) {
    const drawer = document.getElementById('hospital-drawer');
    const overlay = document.getElementById('hospital-drawer-overlay');
    const content = document.getElementById('hospital-drawer-content');
    
    if(!drawer.classList.contains('open')) {
        drawer.classList.add('open');
        overlay.classList.add('show');
    }

    if(mode === 'register') {
        content.innerHTML = `
            <div style="padding:var(--space-xl);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);">
                    <div style="font-family:var(--font-heading);font-weight:600;font-size:18px;">Register Hospital</div>
                    <button class="modal-close" onclick="closeHospitalDrawer()"><i data-feather="x"></i></button>
                </div>
                <form onsubmit="submitHospital(event)">
                    <div class="form-row">
                        <div class="form-group" style="grid-column: span 2;"><label class="form-label">Hospital Name *</label><input class="form-input" name="name" required></div>
                        <div class="form-group" style="grid-column: span 2;"><label class="form-label">Address</label><input class="form-input" name="address"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">City</label><input class="form-input" name="city"></div>
                        <div class="form-group"><label class="form-label">State</label><input class="form-input" name="state"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Pincode</label><input class="form-input" name="pincode"></div>
                        <div class="form-group"><label class="form-label">License No. *</label><input class="form-input" name="license_number" required></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Phone</label><input class="form-input" name="phone"></div>
                        <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" name="email"></div>
                    </div>
                    
                    <div style="margin-top:var(--space-xl); display:flex; gap:12px; justify-content:flex-end;">
                        <button type="button" class="btn btn-secondary" onclick="closeHospitalDrawer()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Register</button>
                    </div>
                </form>
            </div>
        `;
    } else if (mode === 'view' && id) {
        const h = allHospitals.find(h => h.hospital_id === id);
        const pts = hospAllPatients.filter(p => p.hospital_id === id);
        const reqs = hospAllRequests.filter(r => r.hospital_id === id).sort((a,b) => new Date(b.requested_at) - new Date(a.requested_at)).slice(0, 10);
        
        content.innerHTML = `
            <div style="background:var(--bg-subtle); padding:var(--space-xl); border-bottom:1px solid var(--border); position:relative;">
                <button class="modal-close" style="position:absolute; top:20px; right:20px;" onclick="closeHospitalDrawer()"><i data-feather="x"></i></button>
                <div style="font-family:var(--font-heading); font-size:20px; font-weight:600; color:var(--text-primary); margin-bottom:8px; padding-right:24px;">${h.name}</div>
                <div style="display:flex; gap:16px; font-size:12px; color:var(--text-secondary);">
                    <div><span style="font-weight:600;color:var(--text-primary);">License:</span> ${h.license_number}</div>
                    <div><span style="font-weight:600;color:var(--text-primary);">Status:</span> ${h.is_verified?'Verified':'Pending'}</div>
                </div>
            </div>

            <div style="padding:var(--space-xl); overflow-y:auto; max-height:calc(100vh - 110px);">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:var(--space-xl);">
                    <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Phone</div><div style="font-size:13px; font-weight:500; margin-top:2px;">${h.phone||'—'}</div></div>
                    <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Email</div><div style="font-size:13px; font-weight:500; margin-top:2px; word-break:break-all;">${h.email||'—'}</div></div>
                    <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Address</div><div style="font-size:13px; font-weight:500; margin-top:2px;">${h.address||'—'}</div></div>
                    <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Location</div><div style="font-size:13px; font-weight:500; margin-top:2px;">${h.city||'—'}, ${h.state||'—'} ${h.pincode||''}</div></div>
                </div>

                <div style="font-size:12px;font-weight:600;color:var(--accent-primary);text-transform:uppercase;margin-bottom:var(--space-md);">Patients (${pts.length})</div>
                ${pts.length > 0 ? `
                    <div class="table-wrapper" style="margin-bottom:var(--space-xl);">
                        <table style="width:100%; font-size:12px;">
                            <thead><tr><th>Name</th><th>Blood</th><th>Organ Needed</th></tr></thead>
                            <tbody>
                                ${pts.map(p => `<tr><td style="font-weight:500;">${p.full_name}</td><td>${p.blood_type}</td><td style="text-transform:capitalize;">${p.organ_needed==='none'?'—':p.organ_needed}</td></tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : '<div class="text-muted" style="font-size:12px;margin-bottom:var(--space-xl);">No registered patients.</div>'}

                <div style="font-size:12px;font-weight:600;color:var(--accent-primary);text-transform:uppercase;margin-bottom:var(--space-md);">Recent Requests (${reqs.length})</div>
                ${reqs.length > 0 ? `
                    <div class="table-wrapper">
                        <table style="width:100%; font-size:12px;">
                            <thead><tr><th>Type</th><th>Detail</th><th>Urgency</th><th>Status</th></tr></thead>
                            <tbody>
                                ${reqs.map(r => {
                                    const rType = r.type || (r.organ_type ? 'organ' : 'blood');
                                    const det = rType==='blood' ? (r.blood_type+' '+r.quantity_ml_needed+'ml') : r.organ_type;
                                    return `<tr><td style="text-transform:capitalize;font-weight:500;">${rType}</td><td>${det}</td><td>${r.urgency_level}</td><td>${r.status}</td></tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : '<div class="text-muted" style="font-size:12px;">No requests found.</div>'}
            </div>
        `;
    }
    if(window.feather) feather.replace();
}

function closeHospitalDrawer() {
    document.getElementById('hospital-drawer').classList.remove('open');
    document.getElementById('hospital-drawer-overlay').classList.remove('show');
}

async function submitHospital(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const res = await API.post('hospitals', data);
    if(res && res.hospital_id) {
        showToast('Hospital registered', 'success');
        closeHospitalDrawer();
        await loadHospitalData();
    } else {
        showToast('Registration failed', 'error');
    }
}
