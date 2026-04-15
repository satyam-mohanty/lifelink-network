

let allDonors = [];
let donorFilters = { blood_type: 'All', donor_type: 'All', eligibility: 'All' };

async function renderDonors() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-lg);">
            <div>
                <p style="color:var(--text-secondary);font-size:14px;margin:0;" id="donors-subtitle">Loading donors...</p>
            </div>
            <button class="btn btn-primary" onclick="toggleDonorDrawer('register')"><i data-feather="plus"></i> Register Donor</button>
        </div>

        <!-- Filter Bar -->
        <div class="panel" style="padding:var(--space-md); margin-bottom:var(--space-lg);">
            <div style="display:flex;gap:var(--space-xl);align-items:center;flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:var(--space-sm);">
                    <span style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-right:8px;text-transform:uppercase;">Blood:</span>
                    <div id="filter-blood" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-sm);">
                    <span style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-right:8px;text-transform:uppercase;">Type:</span>
                    <div id="filter-type" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-sm);">
                    <span style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-right:8px;text-transform:uppercase;">Status:</span>
                    <div id="filter-elig" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="panel" style="padding: 0; overflow: hidden;">
            <div id="donors-table"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
        </div>

        <!-- Shared Drawer for Add/Edit/View -->
        <div class="modal-overlay" id="donor-drawer-overlay" onclick="closeDonorDrawer()"></div>
        <div class="slide-panel" id="donor-drawer" style="width: 420px;">
            <div class="slide-panel-inner" id="donor-drawer-content" style="padding:0;">
                <!-- Content injected dynamically -->
            </div>
        </div>
    `;

    donorsRenderPillFilters();
    if(window.feather) feather.replace();
    await fetchDonors();
}

function donorsRenderPillFilters() {
    const renderPills = (id, options, current, filterKey) => {
        document.getElementById(id).innerHTML = options.map(opt => `
            <button onclick="setDonorFilter('${filterKey}', '${opt}')" 
                style="padding:4px 12px; border-radius:16px; font-size:12px; font-weight:500; border:1px solid ${current === opt ? 'var(--accent-primary)' : 'var(--border)'}; background:${current === opt ? 'var(--accent-primary)' : 'transparent'}; color:${current === opt ? 'white' : 'var(--text-secondary)'}; cursor:pointer; font-family:var(--font-body); transition:all 0.2s;">
                ${opt}
            </button>
        `).join('');
    };

    renderPills('filter-blood', ['All','A+','A-','B+','B-','AB+','AB-','O+','O-'], donorFilters.blood_type, 'blood_type');
    renderPills('filter-type', ['All','Blood','Organ','Both'], donorFilters.donor_type, 'donor_type');
    renderPills('filter-elig', ['All','Eligible','Ineligible'], donorFilters.eligibility, 'eligibility');
}

function setDonorFilter(key, value) {
    donorFilters[key] = value;
    donorsRenderPillFilters();
    renderDonorsTable();
}

async function fetchDonors() {
    allDonors = await API.get('donors') || [];
    document.getElementById('donors-subtitle').textContent = `${allDonors.length} donors registered`;
    renderDonorsTable();
}


function renderDonorsTable() {
    const target = document.getElementById('donors-table');
    let filtered = allDonors.filter(d => {
        if(donorFilters.blood_type !== 'All' && d.blood_type !== donorFilters.blood_type) return false;
        if(donorFilters.donor_type !== 'All' && String(d.donor_type).toLowerCase() !== donorFilters.donor_type.toLowerCase()) return false;
        if(donorFilters.eligibility === 'Eligible' && !d.is_eligible) return false;
        if(donorFilters.eligibility === 'Ineligible' && d.is_eligible) return false;
        return true;
    });

    if (filtered.length === 0) {
        renderEmptyState(target, { icon: 'users', title: 'No donors registered yet', subtitle: 'Nothing to show' });
        if(window.feather) feather.replace();
        return;
    }

    target.innerHTML = `<div class="table-wrapper" style="border:none;">
        <table style="width:100%;">
            <thead><tr>
                <th style="padding-left:var(--space-lg);">ID</th><th>Name</th><th>Blood Type</th><th>Type</th><th>Last Donation</th><th>Status</th><th>City</th><th style="text-align:right;padding-right:var(--space-lg);">Actions</th>
            </tr></thead>
            <tbody>${filtered.map(d => {
                const bCol = BLOOD_COLORS[d.blood_type] || '#E5E7EB';
                return `<tr>
                    <td style="color:var(--text-primary);font-family:var(--font-mono);font-size:13px;padding-left:var(--space-lg);">#${d.donor_id}</td>
                    <td style="color:var(--text-primary);font-weight:500;">${d.full_name}</td>
                    <td><span style="background:${bCol}; color:#111827; padding:4px 8px; border-radius:12px; font-weight:600; font-size:11px;">${d.blood_type}</span></td>
                    <td style="text-transform:capitalize;">${d.donor_type}</td>
                    <td>${formatDate(d.last_donation_date)}</td>
                    <td>${d.is_eligible ? '<span class="badge badge-available">Eligible</span>' : '<span class="badge badge-expired">Ineligible</span>'}</td>
                    <td>${d.city || '—'}</td>
                    <td style="text-align:right;padding-right:var(--space-lg);">
                        <button class="btn btn-secondary btn-sm" style="padding:0 8px;" onclick="viewDonor(${d.donor_id})"><i data-feather="eye"></i></button>
                        <button class="btn ${d.is_eligible ? 'btn-secondary' : 'btn-primary'} btn-sm" style="padding:0 8px; margin-left:4px;" onclick="toggleEligibilityInline(${d.donor_id}, ${!d.is_eligible})"><i data-feather="${d.is_eligible ? 'x' : 'check'}"></i></button></div></td>
                </tr>`;
            }).join('')}</tbody>
        </table>
    </div>`;
    if(window.feather) feather.replace();
}

async function toggleEligibilityInline(id, val) {
    const res = await API.put(`donors/${id}/eligibility`, { is_eligible: val });
    if(res) {
        showToast(val ? 'Marked eligible' : 'Marked ineligible', 'success');
        await fetchDonors();
    }
}


function toggleDonorDrawer(mode, data = null) {
    const drawer = document.getElementById('donor-drawer');
    const overlay = document.getElementById('donor-drawer-overlay');
    const content = document.getElementById('donor-drawer-content');
    
    if(!drawer.classList.contains('open')) {
        drawer.classList.add('open');
        overlay.classList.add('show');
    }

    if(mode === 'register') {
        content.innerHTML = `
            <div style="padding:var(--space-xl);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);">
                    <div style="font-family:var(--font-heading);font-weight:600;font-size:18px;">Register Donor</div>
                    <button class="modal-close" onclick="closeDonorDrawer()"><i data-feather="x"></i></button>
                </div>
                <form onsubmit="submitDonor(event)">
                    <div style="font-size:12px;font-weight:600;color:var(--accent-primary);text-transform:uppercase;margin-bottom:var(--space-sm);">Personal Info</div>
                    <div class="form-row">
                        <div class="form-group" style="grid-column: span 2;"><label class="form-label">Full Name *</label><input class="form-input" name="full_name" required></div>
                        <div class="form-group"><label class="form-label">Date of Birth *</label><input class="form-input" type="date" name="dob" required></div>
                        <div class="form-group"><label class="form-label">Gender</label>
                            <select class="form-select" name="gender"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
                        </div>
                    </div>
                    
                    <div style="font-size:12px;font-weight:600;color:var(--accent-primary);text-transform:uppercase;margin-top:var(--space-md);margin-bottom:var(--space-sm);">Medical Info</div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Blood Type *</label>
                            <select class="form-select" name="blood_type" required><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select>
                        </div>
                        <div class="form-group"><label class="form-label">Donor Type *</label>
                            <select class="form-select" name="donor_type" required><option value="blood">Blood</option><option value="organ">Organ</option><option value="both">Both</option></select>
                        </div>
                        <div class="form-group"><label class="form-label">Weight (kg)</label><input class="form-input" type="number" step="0.1" name="weight_kg"></div>
                    </div>

                    <div style="font-size:12px;font-weight:600;color:var(--accent-primary);text-transform:uppercase;margin-top:var(--space-md);margin-bottom:var(--space-sm);">Contact Info</div>
                    <div class="form-row">
                        <div class="form-group" style="grid-column: span 2;"><label class="form-label">Address</label><input class="form-input" name="address"></div>
                        <div class="form-group"><label class="form-label">City</label><input class="form-input" name="city"></div>
                        <div class="form-group"><label class="form-label">State</label><input class="form-input" name="state"></div>
                        <div class="form-group"><label class="form-label">Phone</label><input class="form-input" name="phone"></div>
                        <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" name="email"></div>
                    </div>
                    
                    <div style="margin-top:var(--space-xl); display:flex; gap:12px; justify-content:flex-end;">
                        <button type="button" class="btn btn-secondary" onclick="closeDonorDrawer()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Register</button>
                    </div>
                </form>
            </div>
        `;
    }
    if(window.feather) feather.replace();
}

function closeDonorDrawer() {
    document.getElementById('donor-drawer').classList.remove('open');
    document.getElementById('donor-drawer-overlay').classList.remove('show');
}

async function viewDonor(id) {
    toggleDonorDrawer('view');
    const content = document.getElementById('donor-drawer-content');
    content.innerHTML = `<table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table>`;
    
    const donor = await API.get(`donors/${id}`);
    if(!donor) {
        content.innerHTML = '<div style="padding:var(--space-xl);">Failed to load donor.</div>';
        return;
    }

    const initials = donor.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const history = donor.health_history || [];

    content.innerHTML = `
        <div style="background:var(--bg-subtle); padding:var(--space-xl) var(--space-xl) var(--space-md) var(--space-xl); border-bottom:1px solid var(--border); position:relative;">
            <button class="modal-close" style="position:absolute; top:20px; right:20px;" onclick="closeDonorDrawer()"><i data-feather="x"></i></button>
            <div style="display:flex; align-items:center; gap:var(--space-md); margin-bottom:var(--space-md);">
                <div style="width:64px; height:64px; border-radius:50%; background:var(--accent-primary); color:white; display:flex; align-items:center; justify-content:center; font-family:var(--font-heading); font-size:24px; font-weight:700;">${initials}</div>
                <div>
                    <div style="font-family:var(--font-heading); font-size:20px; font-weight:600; color:var(--text-primary); margin-bottom:4px;">${donor.full_name}</div>
                    <div style="display:flex; gap:8px;">
                        <span style="background:${BLOOD_COLORS[donor.blood_type]||'#eee'}; color:#111827; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600;">${donor.blood_type}</span>
                        <span style="background:white; border:1px solid var(--border); color:var(--text-secondary); padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600; text-transform:capitalize;">${donor.donor_type} Donor</span>
                    </div>
                </div>
            </div>
        </div>

        <div style="padding:var(--space-xl); overflow-y:auto; max-height:calc(100vh - 120px);">
            <div style="font-size:12px;font-weight:600;color:var(--accent-primary);text-transform:uppercase;margin-bottom:var(--space-sm);">Personal Details</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:var(--space-xl);">
                <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Status</div><div style="margin-top:4px;">${donor.is_eligible ? '<span class="badge badge-available">Eligible</span>' : '<span class="badge badge-expired">Ineligible</span>'}</div></div>
                <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Gender</div><div style="font-size:13px; font-weight:500; margin-top:2px; text-transform:capitalize;">${donor.gender || '—'}</div></div>
                <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">DOB</div><div style="font-size:13px; font-weight:500; margin-top:2px;">${formatDate(donor.dob)}</div></div>
                <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Weight</div><div style="font-size:13px; font-weight:500; margin-top:2px;">${donor.weight_kg ? donor.weight_kg+' kg' : '—'}</div></div>
                <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Phone</div><div style="font-size:13px; font-weight:500; margin-top:2px;">${donor.phone || '—'}</div></div>
                <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Email</div><div style="font-size:13px; font-weight:500; margin-top:2px; word-break:break-all;">${donor.email || '—'}</div></div>
                <div style="grid-column: span 2;"><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">City/State</div><div style="font-size:13px; font-weight:500; margin-top:2px;">${donor.city||'—'}, ${donor.state||''}</div></div>
            </div>

            <div style="font-size:12px;font-weight:600;color:var(--accent-primary);text-transform:uppercase;margin-bottom:var(--space-sm);">Donation History</div>
            <div style="margin-bottom:var(--space-xl);">
                <div style="font-size:13px; color:var(--text-primary); font-weight:500;">Last Donation: <span style="font-weight:400; color:var(--text-secondary);">${formatDate(donor.last_donation_date)}</span></div>
            </div>

            <div style="font-size:12px;font-weight:600;color:var(--accent-primary);text-transform:uppercase;margin-bottom:var(--space-sm);">Health History</div>
            <div style="margin-bottom:var(--space-xl);">
                ${history.length > 0 ? history.map(h => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border);">
                        <div>
                            <div style="font-size:13px; font-weight:500; color:var(--text-primary);">${h.condition_name}</div>
                            <div style="font-size:11px; color:var(--text-muted);">Diagnosed ${h.diagnosed_year || '—'}</div>
                        </div>
                        ${h.is_disqualifying ? '<span class="badge badge-critical">Disqualifying</span>' : '<span class="badge badge-low">Ok</span>'}
                    </div>
                `).join('') : '<div style="font-size:13px; color:var(--text-muted);">No health conditions reported.</div>'}
                
                <div style="margin-top:16px; padding:12px; background:var(--bg-subtle); border-radius:var(--radius-sm);">
                    <div style="font-size:11px; font-weight:600; color:var(--text-secondary); margin-bottom:8px; text-transform:uppercase;">Add Record</div>
                    <form onsubmit="addHealthRecord(event, ${donor.donor_id})" style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        <input class="form-input" style="height:28px; font-size:12px; grid-column:span 2;" name="condition_name" placeholder="Condition name" required>
                        <input class="form-input" style="height:28px; font-size:12px;" name="diagnosed_year" type="number" placeholder="Year">
                        <select class="form-select" style="height:28px; font-size:12px; padding-top:0; padding-bottom:0;" name="is_disqualifying">
                            <option value="false">Not Disqualifying</option><option value="true">Disqualifying</option>
                        </select>
                        <button type="submit" class="btn btn-secondary btn-sm" style="grid-column:span 2;">Add Record</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    if(window.feather) feather.replace();
}

async function addHealthRecord(e, donorId) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.is_disqualifying = data.is_disqualifying === 'true';
    const res = await API.post(`donors/${donorId}/health`, data);
    if(res) {
        showToast('Health record added', 'success');
        viewDonor(donorId);
    }
}

async function submitDonor(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    
    if (data.weight_kg === '' || data.weight_kg === undefined) data.weight_kg = null;
    if (data.last_donation_date === '' || data.last_donation_date === undefined) data.last_donation_date = null;
    if (data.phone === '') data.phone = null;
    if (data.email === '') data.email = null;
    if (data.address === '') data.address = null;
    if (data.city === '') data.city = null;
    if (data.state === '') data.state = null;
    const res = await API.post('donors', data);
    if(res && (res.id || res.message)) {
        showToast('Donor registered successfully!', 'success');
        closeDonorDrawer();
        await fetchDonors();
    } else {
        showToast('Failed to register donor', 'error');
    }
}
