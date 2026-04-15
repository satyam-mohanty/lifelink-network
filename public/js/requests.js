

let activeRequestTab = 'blood';
let allRequests = [];
let reqAllHospitals = [];
let reqAllPatients = [];
let reqStatusFilter = 'All'; 

const STATUS_STEPS = ['requested', 'matched', 'dispatched', 'delivered'];


async function renderRequests() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md);">
            <div><p style="color:var(--text-secondary);font-size:14px;margin:0;">Manage and track fulfillment pipelines</p></div>
            <div style="display:flex;gap:var(--space-sm);">
                <button class="btn btn-secondary" onclick="toggleReqDrawer('blood')"><i data-feather="droplet"></i> Blood Request</button>
                <button class="btn btn-primary" onclick="toggleReqDrawer('organ')"><i data-feather="heart"></i> Organ Request</button>
            </div>
        </div>

        <div style="display:flex; justify-content:center; margin-bottom:var(--space-xl);">
            <div style="display:flex; background:var(--bg-subtle); padding:6px; border-radius:30px; gap:4px;">
                <button class="tab-btn-pill ${activeRequestTab === 'blood' ? 'active' : ''}" id="tab-blood" onclick="switchRequestTab('blood')">Blood Requests</button>
                <button class="tab-btn-pill ${activeRequestTab === 'organ' ? 'active' : ''}" id="tab-organ" onclick="switchRequestTab('organ')">Organ Requests</button>
            </div>
        </div>

        <!-- Pipeline Overview Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-lg); background:white; padding:20px; border-radius:var(--radius); border:1px solid var(--border); box-shadow:var(--shadow-sm);" id="pipeline-bar">
            <!-- Injected dynamically -->
        </div>

        <div class="panel" style="padding: 0; overflow: hidden;">
            <div id="requests-table"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
        </div>

        <!-- Slide Drawer for Forms -->
        <div class="modal-overlay" id="req-drawer-overlay" onclick="closeReqDrawer()"></div>
        <div class="slide-panel" id="req-drawer" style="width: 460px;">
            <div class="slide-panel-inner" id="req-drawer-content" style="padding:0;"></div>
        </div>
        
        <style>
            .tab-btn-pill { padding:8px 24px; border-radius:24px; background:transparent; border:none; color:var(--text-secondary); font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s; }
            .tab-btn-pill.active { background:white; color:var(--text-primary); box-shadow:var(--shadow-sm); }
            
            .pipeline-card { flex:1; display:flex; flex-direction:column; align-items:center; padding:12px; border-radius:var(--radius-sm); border:1px solid transparent; cursor:pointer; transition:all 0.2s; position:relative; z-index:1; background:white; }
            .pipeline-card:hover { background:var(--bg-subtle); border-color:var(--border); }
            .pipeline-card.active { background:var(--bg-subtle); border-color:var(--accent-primary); box-shadow:0 0 0 1px var(--accent-primary); }
            
            .pipeline-arrow-conn { flex-grow:0.5; height:2px; background:var(--border); position:relative; top:-4px; margin:0 16px; min-width:30px; }
            .pipeline-arrow-conn::after { content:''; position:absolute; right:0; top:-4px; width:10px; height:10px; border-top:2px solid var(--border); border-right:2px solid var(--border); transform:rotate(45deg); }
            
            .mini-pipe-container { display:flex; align-items:center; gap:0; width:100px; }
            .mini-pipe-dot { width:8px; height:8px; border-radius:50%; background:var(--border); position:relative; z-index:2; flex-shrink:0; }
            .mini-pipe-dot.filled { background:var(--accent-primary); }
            .mini-pipe-line { flex:1; height:2px; background:var(--border); position:relative; z-index:1; }
            .mini-pipe-line.filled { background:var(--accent-primary); }
            
            .urgency-radio { display:block; flex:1; }
            .urgency-radio input[type="radio"] { display:none; }
            .urgency-radio .urgency-box { text-align:center; padding:8px 4px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:12px; font-weight:600; cursor:pointer; transition:all 0.2s; text-transform:capitalize; }
            .urgency-radio input[type="radio"]:checked + .urgency-box { box-shadow:0 0 0 1px currentColor; }
        </style>
    `;
    if(window.feather) feather.replace();

    const [h, p] = await Promise.all([
        API.get('hospitals'),
        API.get('patients')
    ]);
    reqAllHospitals = h || [];
    reqAllPatients = p || [];

    await loadRequestData();
}

function switchRequestTab(tab) {
    activeRequestTab = tab;
    document.getElementById('tab-blood').classList.toggle('active', tab === 'blood');
    document.getElementById('tab-organ').classList.toggle('active', tab === 'organ');
    reqStatusFilter = 'All'; 
    renderPipelineBar();
    requestsRenderTable();
}

async function loadRequestData() {
    allRequests = await API.get('requests') || [];
    renderPipelineBar();
    requestsRenderTable();
}

function renderPipelineBar() {
    const pBar = document.getElementById('pipeline-bar');
    const reqs = allRequests.filter(r => (r.type === activeRequestTab) || (activeRequestTab==='organ'&&r.organ_type) || (activeRequestTab==='blood'&&r.blood_type));
    
    pBar.innerHTML = STATUS_STEPS.map((step, i) => {
        const count = reqs.filter(r => r.status === step).length;
        const isActive = reqStatusFilter === step;
        const isLast = i === STATUS_STEPS.length - 1;
        
        const cardHtml = `
            <div class="pipeline-card ${isActive ? 'active' : ''}" onclick="setPipelineFilter('${step}')">
                <div style="font-size:11px; font-weight:600; color:var(--text-secondary); text-transform:uppercase; margin-bottom:8px;">${step}</div>
                <div style="font-family:var(--font-heading); font-size:24px; font-weight:700; color:${isActive ? 'var(--accent-primary)' : 'var(--text-primary)'};">${count}</div>
            </div>
        `;
        
        return isLast ? cardHtml : cardHtml + '<div class="pipeline-arrow-conn"></div>';
    }).join('');
}

function setPipelineFilter(status) {
    if (reqStatusFilter === status) reqStatusFilter = 'All';
    else reqStatusFilter = status;
    renderPipelineBar();
    requestsRenderTable();
}


function renderMiniPipeline(status) {
    const idx = STATUS_STEPS.indexOf(status);
    if(idx === -1) return `<span style="color:var(--text-muted);font-size:11px;text-transform:capitalize;">${status}</span>`; 
    
    return `
        <div class="mini-pipe-container" title="${status}">
            ${STATUS_STEPS.map((s, i) => {
                const isFilled = i <= idx;
                const isLineFilled = i < idx;
                const isLast = i === STATUS_STEPS.length - 1;
                const dot = `<div class="mini-pipe-dot ${isFilled?'filled':''}"></div>`;
                const line = `<div class="mini-pipe-line ${isLineFilled?'filled':''}"></div>`;
                return isLast ? dot : dot + line;
            }).join('')}
        </div>
    `;
}

function requestsRenderTable() {
    const target = document.getElementById('requests-table');
    let reqs = allRequests.filter(r => (r.type === activeRequestTab) || (activeRequestTab==='organ'&&r.organ_type) || (activeRequestTab==='blood'&&r.blood_type));
    
    if (reqStatusFilter !== 'All') {
        reqs = reqs.filter(r => r.status === reqStatusFilter);
    }

    reqs.sort((a,b) => new Date(b.requested_at) - new Date(a.requested_at));

    if (reqs.length === 0) {
        renderEmptyState(target, { icon: 'clipboard', title: 'No requests found', subtitle: 'Nothing to show' });
        if(window.feather) feather.replace(); return;
    }

    let headHtml = '';
    if (activeRequestTab === 'blood') {
        headHtml = `<tr><th style="padding-left:var(--space-lg);">ID</th><th>Patient</th><th>Hospital</th><th>Blood Type</th><th>Qty</th><th>Urgency</th><th>Status</th><th>Requested</th><th style="text-align:right;padding-right:var(--space-lg);">Actions</th></tr>`;
    } else {
        headHtml = `<tr><th style="padding-left:var(--space-lg);">ID</th><th>Patient</th><th>Hospital</th><th>Organ Type</th><th>Urgency</th><th>Status</th><th>Requested</th><th style="text-align:right;padding-right:var(--space-lg);">Actions</th></tr>`;
    }

    let rowsHtml = reqs.map(r => {
        const uCol = URGENCY_LEVELS[r.urgency_level]?.col || '#E5E7EB';
        const p = reqAllPatients.find(px => px.patient_id === r.patient_id);
        const pName = p ? p.full_name : (r.patient_id ? '#'+r.patient_id : '—');
        
        let detailHtml = '';
        if (activeRequestTab === 'blood') {
            const bCol = BLOOD_COLORS[r.blood_type] || '#E5E7EB';
            detailHtml = `
                <td><span style="background:${bCol}; color:#111827; padding:4px 8px; border-radius:12px; font-weight:600; font-size:11px;">${r.blood_type}</span></td>
                <td style="font-weight:500;">${r.quantity_ml_needed}ml</td>
            `;
        } else {
            detailHtml = `<td style="font-weight:600; color:var(--text-primary); text-transform:capitalize;">${r.organ_type}</td>`;
        }

        return `
            <tr>
                <td style="padding-left:var(--space-lg); font-family:var(--font-mono); font-size:13px; color:var(--text-secondary);">#${r.request_id}</td>
                <td style="font-weight:500; color:var(--text-primary);">${pName}</td>
                <td><div style="font-size:12px; font-weight:500;">Hosp #${r.hospital_id}</div></td>
                ${detailHtml}
                <td><span style="color:${uCol}; text-transform:capitalize; font-weight:600; font-size:13px;">${r.urgency_level}</span></td>
                <td>${renderMiniPipeline(r.status)}</td>
                <td style="font-size:13px;">${formatDate(r.requested_at)}</td>
                <td style="text-align:right; padding-right:var(--space-lg); min-width:140px;">
                    ${r.status === 'requested' ? `
                        <button class="btn btn-primary btn-sm" style="padding:0 8px; margin-right:4px;" onclick="goMatch(${r.request_id})"><i data-feather="git-pull-request"></i> Match</button>
                    ` : ''}
                    <button class="btn btn-secondary btn-sm" style="padding:0 8px;" onclick="viewRequest(${r.request_id})"><i data-feather="eye"></i></button></div></td>
            </tr>
        `;
    }).join('');

    target.innerHTML = `<div class="table-wrapper" style="border:none;"><table style="width:100%;"><thead>${headHtml}</thead><tbody>${rowsHtml}</tbody></table></div>`;
    if(window.feather) feather.replace();
}

function goMatch(reqId) {
    navigateTo('matching');
}

function viewRequest(reqId) {
    
    showToast('Request #'+reqId);
}

function toggleReqDrawer(type) {
    const drawer = document.getElementById('req-drawer');
    const overlay = document.getElementById('req-drawer-overlay');
    const content = document.getElementById('req-drawer-content');
    
    drawer.classList.add('open');
    overlay.classList.add('show');

    const urgencyRadios = `
        <div style="display:flex; gap:8px;">
            <label class="urgency-radio" style="color:#E02424;"><input type="radio" name="urgency_level" value="critical" required><div class="urgency-box" style="background:#FDF2F2;border-color:#F8B4B4;">Critical</div></label>
            <label class="urgency-radio" style="color:#D97706;"><input type="radio" name="urgency_level" value="high"><div class="urgency-box" style="background:#FDF6B2;border-color:#E3A008;">High</div></label>
            <label class="urgency-radio" style="color:#1A56DB;"><input type="radio" name="urgency_level" value="medium" checked><div class="urgency-box" style="background:#E1EFFE;border-color:#76A9FA;">Medium</div></label>
            <label class="urgency-radio" style="color:#0E9F6E;"><input type="radio" name="urgency_level" value="low"><div class="urgency-box" style="background:#DEF7EC;border-color:#31C48D;">Low</div></label>
        </div>
    `;

    if(type === 'blood') {
        content.innerHTML = `
            <div style="padding:var(--space-xl);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);">
                    <div style="font-family:var(--font-heading);font-weight:600;font-size:18px;">New Blood Request</div>
                    <button class="modal-close" onclick="closeReqDrawer()"><i data-feather="x"></i></button>
                </div>
                <form onsubmit="submitReq(event, 'blood')">
                    <div class="form-group"><label class="form-label">Hospital ID *</label>
                        <select class="form-select" name="hospital_id" id="form_hosp" onchange="updatePat()" required>
                            <option value="">Select Hospital</option>
                            ${reqAllHospitals.map(h => `<option value="${h.hospital_id}">${h.name} (#${h.hospital_id})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label class="form-label">Patient ID</label>
                        <select class="form-select" name="patient_id" id="form_pat">
                            <option value="">Select Hospital First...</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label class="form-label">Blood Type *</label>
                            <select class="form-select" name="blood_type" required><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select>
                        </div>
                        <div class="form-group"><label class="form-label">Quantity (ml) *</label><input class="form-input" type="number" name="quantity_ml_needed" value="450" required></div>
                    </div>
                    <div class="form-group"><label class="form-label">Urgency *</label>${urgencyRadios}</div>
                    
                    <div style="margin-top:var(--space-xl); display:flex; justify-content:flex-end; gap:12px;">
                        <button type="button" class="btn btn-secondary" onclick="closeReqDrawer()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Create Request</button>
                    </div>
                </form>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div style="padding:var(--space-xl);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-xl);">
                    <div style="font-family:var(--font-heading);font-weight:600;font-size:18px;">New Organ Request</div>
                    <button class="modal-close" onclick="closeReqDrawer()"><i data-feather="x"></i></button>
                </div>
                <form onsubmit="submitReq(event, 'organ')">
                    <div class="form-group"><label class="form-label">Hospital ID *</label>
                        <select class="form-select" name="hospital_id" id="form_hosp" onchange="updatePat()" required>
                            <option value="">Select Hospital</option>
                            ${reqAllHospitals.map(h => `<option value="${h.hospital_id}">${h.name} (#${h.hospital_id})</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label class="form-label">Patient ID *</label>
                        <select class="form-select" name="patient_id" id="form_pat" required>
                            <option value="">Select Hospital First...</option>
                        </select>
                    </div>
                    <div class="form-group"><label class="form-label">Organ Type *</label>
                        <select class="form-select" name="organ_type" required><option>kidney</option><option>liver</option><option>heart</option><option>lungs</option><option>cornea</option><option>pancreas</option><option>intestine</option></select>
                    </div>
                    <div class="form-group"><label class="form-label">Urgency *</label>${urgencyRadios}</div>
                    
                    <div style="margin-top:var(--space-xl); display:flex; justify-content:flex-end; gap:12px;">
                        <button type="button" class="btn btn-secondary" onclick="closeReqDrawer()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Create Request</button>
                    </div>
                </form>
            </div>
        `;
    }
    if(window.feather) feather.replace();
}


window.updatePat = function() {
    const hid = document.getElementById('form_hosp').value;
    const pSel = document.getElementById('form_pat');
    pSel.innerHTML = '<option value="">Optional Patient...</option>';
    const matching = reqAllPatients.filter(p => p.hospital_id == hid);
    matching.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.patient_id;
        opt.textContent = `${p.full_name} (#${p.patient_id})`;
        pSel.appendChild(opt);
    });
}

function closeReqDrawer() {
    document.getElementById('req-drawer').classList.remove('open');
    document.getElementById('req-drawer-overlay').classList.remove('show');
}

async function submitReq(e, type) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const res = await API.post(`requests/${type}`, data);
    if(res && res.request_id) {
        showToast(`${type==='blood'?'Blood':'Organ'} request created`, 'success');
        closeReqDrawer();
        await loadRequestData();
    } else {
        showToast('Failed to create', 'error');
    }
}
