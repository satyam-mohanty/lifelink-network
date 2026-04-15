

let allPatients = [];
let patAllHospitals = [];
let patientFilters = { urgency: 'All', organ: 'All', hospital_id: '' };



async function renderPatients() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-lg);">
            <div><p style="color:var(--text-secondary);font-size:14px;margin:0;" id="patients-subtitle">Loading patients...</p></div>
            <button class="btn btn-primary" onclick="togglePatientDrawer('register')"><i data-feather="plus"></i> Add Patient</button>
        </div>

        <div class="panel" style="padding:var(--space-md); margin-bottom:var(--space-lg);">
            <div style="display:flex;gap:var(--space-xl);align-items:center;flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:var(--space-sm);">
                    <span style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-right:8px;text-transform:uppercase;">Urgency:</span>
                    <div id="filter-urgency" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-sm);">
                    <span style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-right:8px;text-transform:uppercase;">Organ:</span>
                    <div id="filter-organ" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-sm);flex:1;max-width:250px;">
                    <span style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-right:8px;text-transform:uppercase;">Hospital:</span>
                    <select class="form-select" id="filter-hospital" onchange="setPatientFilter('hospital_id', this.value)" style="height:32px;padding-top:0;padding-bottom:0;">
                        <option value="">All Hospitals</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="panel" style="padding: 0; overflow: hidden;">
            <div id="patients-table"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
        </div>

        <div class="modal-overlay" id="patient-drawer-overlay" onclick="closePatientDrawer()"></div>
        <div class="slide-panel" id="patient-drawer" style="width: 460px;">
            <div class="slide-panel-inner" id="patient-drawer-content" style="padding:0;"></div>
        </div>
    `;
    if(window.feather) feather.replace();
    
    
    const [h, p] = await Promise.all([
        API.get('hospitals'),
        API.get('patients')
    ]);
    patAllHospitals = h || [];
    allPatients = p || [];

    const hospSelect = document.getElementById('filter-hospital');
    if (hospSelect) {
        patAllHospitals.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.hospital_id;
            opt.textContent = `${h.name} (#${h.hospital_id})`;
            hospSelect.appendChild(opt);
        });
    }

    patientsRenderPillFilters();
    renderPatientsTable();
}

function patientsRenderPillFilters() {
    const renderPills = (id, options, current, filterKey) => {
        document.getElementById(id).innerHTML = options.map(opt => `
            <button onclick="setPatientFilter('${filterKey}', '${opt.val}')" 
                style="padding:4px 12px; border-radius:16px; font-size:12px; font-weight:500; border:1px solid ${current === opt.val ? 'var(--accent-primary)' : 'var(--border)'}; background:${current === opt.val ? 'var(--accent-primary)' : 'transparent'}; color:${current === opt.val ? 'white' : 'var(--text-secondary)'}; cursor:pointer; font-family:var(--font-body); transition:all 0.2s; text-transform:capitalize;">
                ${opt.label}
            </button>
        `).join('');
    };

    renderPills('filter-urgency', [
        {val:'All',label:'All'},{val:'critical',label:'Critical'},{val:'high',label:'High'},{val:'medium',label:'Medium'},{val:'low',label:'Low'}
    ], patientFilters.urgency, 'urgency');

    renderPills('filter-organ', [
        {val:'All',label:'All'},{val:'none',label:'None'},{val:'kidney',label:'Kidney'},{val:'liver',label:'Liver'},{val:'heart',label:'Heart'},{val:'lungs',label:'Lungs'}
    ], patientFilters.organ, 'organ');
}

function setPatientFilter(key, value) {
    patientFilters[key] = value;
    if(key !== 'hospital_id') patientsRenderPillFilters();
    renderPatientsTable();
}


function renderPatientsTable() {
    document.getElementById('patients-subtitle').textContent = `${allPatients.length} registered patients`;
    const target = document.getElementById('patients-table');
    
    let filtered = allPatients.filter(p => {
        if(patientFilters.urgency !== 'All' && p.urgency_level !== patientFilters.urgency) return false;
        if(patientFilters.organ !== 'All' && p.organ_needed !== patientFilters.organ) return false;
        if(patientFilters.hospital_id && String(p.hospital_id) !== patientFilters.hospital_id) return false;
        return true;
    });

    filtered.sort((a,b) => {
        return (URGENCY_LEVELS[b.urgency_level]?.val || 0) - (URGENCY_LEVELS[a.urgency_level]?.val || 0);
    });

    if (filtered.length === 0) {
        renderEmptyState(target, { icon: 'user', title: 'No patients added', subtitle: 'Nothing to show' });
        if(window.feather) feather.replace(); return;
    }

    target.innerHTML = `<div class="table-wrapper" style="border:none;">
        <table style="width:100%; border-collapse: separate; border-spacing: 0;">
            <thead><tr>
                <th style="padding-left:var(--space-lg);">ID</th><th>Name</th><th>Blood Type</th><th>Organ Needed</th><th>Urgency</th><th>Waiting Since</th><th>Hospital</th><th style="padding-right:var(--space-lg);">Actions</th>
            </tr></thead>
            <tbody>${filtered.map(p => {
                const bCol = BLOOD_COLORS[p.blood_type] || '#E5E7EB';
                const uCol = URGENCY_LEVELS[p.urgency_level]?.col || '#E5E7EB';
                const waitDays = Math.max(0, Math.floor((new Date() - new Date(p.waiting_since)) / 86400000));
                
                let organDisplay = '—';
                if(p.organ_needed !== 'none') {
                    organDisplay = `${ORGAN_EMOJI[p.organ_needed]||''} <span style="text-transform:capitalize;">${p.organ_needed}</span>`;
                }

                return `<tr>
                    <td style="padding-left:var(--space-lg); border-left:4px solid ${uCol}; font-family:var(--font-mono); font-size:13px;">#${p.patient_id}</td>
                    <td style="font-weight:600; color:var(--text-primary);">${p.full_name}</td>
                    <td><span style="background:${bCol}; color:#111827; padding:4px 8px; border-radius:12px; font-weight:600; font-size:11px;">${p.blood_type}</span></td>
                    <td>${organDisplay}</td>
                    <td><span style="color:${uCol}; text-transform:capitalize; font-weight:600; font-size:13px;">${p.urgency_level}</span></td>
                    <td><span title="${formatDate(p.waiting_since)}" style="color:var(--text-secondary); cursor:help;">${waitDays} days</span></td>
                    <td>#${p.hospital_id}</td>
                    <td style="padding-right:var(--space-lg);">
                        <button class="btn btn-secondary btn-sm" style="padding:0 8px;" onclick="viewPatient(${p.patient_id})"><i data-feather="eye"></i> View</button></div></td>
                </tr>`;
            }).join('')}</tbody>
        </table>
    </div>`;
    if(window.feather) feather.replace();
}

function togglePatientDrawer(mode) {
    const drawer = document.getElementById('patient-drawer');
    const overlay = document.getElementById('patient-drawer-overlay');
    const content = document.getElementById('patient-drawer-content');
    
    if(!drawer.classList.contains('open')) {
        drawer.classList.add('open');
        overlay.classList.add('show');
    }

    if(mode === 'register') {
        content.innerHTML = `
            <div style="padding:var(--space-xl);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);">
                    <div style="font-family:var(--font-heading);font-weight:600;font-size:18px;">Register Patient</div>
                    <button class="modal-close" onclick="closePatientDrawer()"><i data-feather="x"></i></button>
                </div>
                <form onsubmit="submitPatient(event)">
                    <div class="form-row">
                        <div class="form-group" style="grid-column: span 2;"><label class="form-label">Full Name *</label><input class="form-input" name="full_name" required></div>
                        <div class="form-group" style="grid-column: span 2;"><label class="form-label">Hospital ID *</label>
                            <select class="form-select" name="hospital_id" required>
                                ${patAllHospitals.map(h => `<option value="${h.hospital_id}">${h.name} (#${h.hospital_id})</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">DOB *</label><input class="form-input" type="date" name="dob" required></div>
                        <div class="form-group"><label class="form-label">Gender</label><select class="form-select" name="gender"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Blood Type *</label><select class="form-select" name="blood_type" required><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></div>
                        <div class="form-group"><label class="form-label">Tissue Type</label><input class="form-input" name="tissue_type" placeholder="e.g. HLA-A2"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Organ Needed</label><select class="form-select" name="organ_needed"><option value="none">None</option><option>kidney</option><option>liver</option><option>heart</option><option>lungs</option><option>cornea</option><option>pancreas</option><option>intestine</option></select></div>
                        <div class="form-group"><label class="form-label">Urgency</label><select class="form-select" name="urgency_level"><option>low</option><option>medium</option><option>high</option><option>critical</option></select></div>
                    </div>
                    <div class="form-group"><label class="form-label">Medical Notes</label><textarea class="form-textarea" name="medical_notes"></textarea></div>
                    <div style="margin-top:var(--space-xl); display:flex; gap:12px; justify-content:flex-end;">
                        <button type="button" class="btn btn-secondary" onclick="closePatientDrawer()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Patient</button>
                    </div>
                </form>
            </div>
        `;
    }
    if(window.feather) feather.replace();
}

function closePatientDrawer() {
    document.getElementById('patient-drawer').classList.remove('open');
    document.getElementById('patient-drawer-overlay').classList.remove('show');
}

async function viewPatient(id) {
    togglePatientDrawer('view');
    const content = document.getElementById('patient-drawer-content');
    content.innerHTML = `<table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table>`;
    
    const patient = await API.get(`patients/${id}`);
    if(!patient) {
        content.innerHTML = '<div style="padding:var(--space-xl);">Failed to load.</div>';
        return;
    }

    const waitDays = Math.max(0, Math.floor((new Date() - new Date(patient.waiting_since)) / 86400000));
    const bloodReqs = patient.blood_requests || [];
    const organReqs = patient.organ_requests || [];
    const h = patAllHospitals.find(hx => hx.hospital_id === patient.hospital_id) || {name: 'Unknown Hospital'};
    
    let organDisplay = 'None';
    if(patient.organ_needed !== 'none') { organDisplay = `${ORGAN_EMOJI[patient.organ_needed]||''} ${patient.organ_needed}`; }

    content.innerHTML = `
        <div style="background:var(--bg-subtle); padding:var(--space-xl) var(--space-xl) var(--space-lg) var(--space-xl); border-bottom:1px solid var(--border); position:relative;">
            <button class="modal-close" style="position:absolute; top:20px; right:20px;" onclick="closePatientDrawer()"><i data-feather="x"></i></button>
            <div style="font-family:var(--font-heading); font-size:22px; font-weight:700; color:var(--text-primary); margin-bottom:12px;">${patient.full_name}</div>
            
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:16px;">
                <span style="background:${BLOOD_COLORS[patient.blood_type]||'#eee'}; color:#111827; padding:4px 10px; border-radius:12px; font-size:12px; font-weight:600;">${patient.blood_type}</span>
                <span style="background:white; border:1px solid var(--border); color:${URGENCY_LEVELS[patient.urgency_level]?.col||'inherit'}; padding:4px 10px; border-radius:12px; font-size:12px; font-weight:600; text-transform:capitalize;">${patient.urgency_level} Urgency</span>
                <span style="font-size:12px; color:var(--text-secondary); margin-left:4px;">Waiting ${waitDays} days</span>
            </div>
            
            <div style="display:flex; gap:12px;">
                <button class="btn btn-primary btn-sm" onclick="quickReq('blood', ${patient.patient_id})"><i data-feather="droplet"></i> New Blood Req</button>
                <button class="btn btn-primary btn-sm" onclick="quickReq('organ', ${patient.patient_id})"><i data-feather="heart"></i> New Organ Req</button>
            </div>
        </div>

        <div style="padding:var(--space-xl); overflow-y:auto; max-height:calc(100vh - 160px);">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:var(--space-lg);">
                <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Hospital</div><div style="font-size:13px; font-weight:500; margin-top:2px;">${h.name} (#${patient.hospital_id})</div></div>
                <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">DOB / Gender</div><div style="font-size:13px; font-weight:500; margin-top:2px; text-transform:capitalize;">${formatDate(patient.dob)} / ${patient.gender}</div></div>
                <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Organ Needed</div><div style="font-size:13px; font-weight:500; margin-top:2px; text-transform:capitalize;">${organDisplay}</div></div>
                <div><div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Tissue Type</div><div style="font-size:13px; font-weight:500; margin-top:2px;">${patient.tissue_type || '—'}</div></div>
            </div>

            ${patient.medical_notes ? `
                <div style="margin-bottom:var(--space-lg);">
                    <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Medical Notes</div>
                    <div style="font-size:13px; color:var(--text-secondary); line-height:1.5; background:var(--bg-base); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border); white-space:pre-wrap;">${patient.medical_notes}</div>
                </div>
            ` : ''}

            <div style="font-size:12px;font-weight:600;color:var(--accent-primary);text-transform:uppercase;margin-bottom:var(--space-sm);">Active Requests</div>
            ${(bloodReqs.length === 0 && organReqs.length === 0) ? '<div class="text-muted" style="font-size:12px;">No active requests.</div>' : ''}
            
            <div style="display:flex; flex-direction:column; gap:8px;">
                ${bloodReqs.map(r => `
                    <div style="padding:10px 14px; border:1px solid var(--border); border-left:3px solid var(--accent-primary); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-size:13px; font-weight:600; color:var(--text-primary);">Blood: ${r.blood_type} (${r.quantity_ml_needed}ml)</div>
                            <div style="font-size:11px; color:var(--text-muted);">Req #${r.request_id} · ${formatDate(r.requested_at)}</div>
                        </div>
                        <span style="font-size:11px; font-weight:600; color:var(--text-secondary); text-transform:capitalize;">${r.status}</span>
                    </div>
                `).join('')}
                ${organReqs.map(r => `
                    <div style="padding:10px 14px; border:1px solid var(--border); border-left:3px solid var(--accent-secondary); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-size:13px; font-weight:600; color:var(--text-primary); text-transform:capitalize;">Organ: ${r.organ_type}</div>
                            <div style="font-size:11px; color:var(--text-muted);">Req #${r.request_id} · ${formatDate(r.requested_at)}</div>
                        </div>
                        <span style="font-size:11px; font-weight:600; color:var(--text-secondary); text-transform:capitalize;">${r.status}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    if(window.feather) feather.replace();
}

function quickReq(type, pid) {
    navigateTo('requests');
    
}

async function submitPatient(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const res = await API.post('patients', data);
    if(res && res.patient_id) {
        showToast('Patient added', 'success');
        closePatientDrawer();
        await loadPatientData();
    } else {
        showToast('Failed to add', 'error');
    }
}

async function loadPatientData() {
    allPatients = await API.get('patients') || [];
    renderPatientsTable();
}
