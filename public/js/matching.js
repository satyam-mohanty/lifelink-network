

let matchStep = 1;
let matchType = null; 
let bTypeSelected = null;
let bTypeOrgSelected = null;
let oTypeSelected = null;

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ORGAN_TYPES = [
    {id: 'kidney', emoji: '🫘', label: 'Kidney'},
    {id: 'liver', emoji: '🫁', label: 'Liver'},
    {id: 'heart', emoji: '🫀', label: 'Heart'},
    {id: 'lungs', emoji: '🫁', label: 'Lungs'},
    {id: 'cornea', emoji: '👁️', label: 'Cornea'},
    {id: 'pancreas', emoji: '🟤', label: 'Pancreas'},
    {id: 'intestine', emoji: '🔴', label: 'Intestine'}
];

async function renderMatching() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="view-header" style="margin-bottom:var(--space-xl);">
            <h1>MATCHING ENGINE</h1>
            <p>ABO+Rh compatibility matching for blood bags and organs</p>
        </div>

        <div style="max-width:900px; margin:0 auto; padding-bottom:var(--space-2xl);">
            <!-- Step 1 -->
            <div id="step-1-container">
                <div style="font-size:12px; font-weight:600; color:var(--text-secondary); text-transform:uppercase; margin-bottom:12px; letter-spacing:1px;">Step 1 — Select Match Type</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-lg);">
                    <div class="match-type-card" id="card-blood" onclick="selectMatchType('blood')">
                        <div style="font-size:40px; margin-bottom:12px;">🩸</div>
                        <div style="font-family:var(--font-heading); font-size:20px; font-weight:600; color:var(--text-primary);">Blood Match</div>
                        <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">Find compatible inventory bags</div>
                    </div>
                    <div class="match-type-card" id="card-organ" onclick="selectMatchType('organ')">
                        <div style="font-size:40px; margin-bottom:12px;">🫀</div>
                        <div style="font-family:var(--font-heading); font-size:20px; font-weight:600; color:var(--text-primary);">Organ Match</div>
                        <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">Find compatible organ donors</div>
                    </div>
                </div>
            </div>

            <!-- Step 2 -->
            <div id="step-2-container" style="display:none; margin-top:var(--space-2xl);">
                <div style="font-size:12px; font-weight:600; color:var(--text-secondary); text-transform:uppercase; margin-bottom:12px; letter-spacing:1px;">Step 2 — Enter Parameters</div>
                <div class="panel" style="padding:var(--space-xl);">
                    <div id="form-blood-container" style="display:none;">
                        <form onsubmit="runBloodMatch(event)">
                            <div style="margin-bottom:var(--space-lg);">
                                <label class="form-label">Patient Blood Type *</label>
                                <div class="grid-buttons">
                                    ${BLOOD_TYPES.map(bt => `<button type="button" class="grid-btn bt-btn-blood" onclick="selectBT('blood', '${bt}')">${bt}</button>`).join('')}
                                </div>
                                <input type="hidden" name="patient_blood_type" id="hidden_bt_blood" required>
                            </div>
                            <div style="margin-bottom:var(--space-xl);">
                                <label class="form-label">Quantity Needed</label>
                                <div style="position:relative; width:200px;">
                                    <input class="form-input" type="number" name="quantity_ml" value="450" required style="padding-right:40px;">
                                    <span style="position:absolute; right:12px; top:50%; transform:translateY(-50%); font-size:13px; color:var(--text-muted); pointer-events:none;">ml</span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary" style="padding:12px 24px;"><i data-feather="search"></i> Find Compatible Bags</button>
                        </form>
                    </div>

                    <div id="form-organ-container" style="display:none;">
                        <form onsubmit="runOrganMatch(event)">
                            <div style="margin-bottom:var(--space-lg);">
                                <label class="form-label">Organ Type Needed *</label>
                                <div class="grid-buttons" style="grid-template-columns:repeat(4,1fr);">
                                    ${ORGAN_TYPES.map(o => `<button type="button" class="grid-btn ot-btn" onclick="selectOT('${o.id}')">${o.emoji} ${o.label}</button>`).join('')}
                                </div>
                                <input type="hidden" name="organ_type" id="hidden_ot_organ" required>
                            </div>
                            <div style="margin-bottom:var(--space-lg);">
                                <label class="form-label">Patient Blood Type *</label>
                                <div class="grid-buttons">
                                    ${BLOOD_TYPES.map(bt => `<button type="button" class="grid-btn bt-btn-organ" onclick="selectBT('organ', '${bt}')">${bt}</button>`).join('')}
                                </div>
                                <input type="hidden" name="patient_blood_type" id="hidden_bt_organ" required>
                            </div>
                            <div style="margin-bottom:var(--space-xl);">
                                <label class="form-label">Tissue Type (Optional)</label>
                                <input class="form-input" name="tissue_type" placeholder="e.g. HLA-A2, HLA-B7" style="max-width:300px;">
                            </div>
                            <button type="submit" class="btn btn-primary" style="padding:12px 24px;"><i data-feather="search"></i> Find Organ Matches</button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div id="scanning-state" style="display:none; margin-top:var(--space-2xl);">
                <div style="font-size:13px; color:var(--text-secondary); margin-bottom:8px; display:flex; justify-content:space-between;">
                    <span>Scanning compatibility...</span>
                    <span class="pulse-text" style="color:var(--accent-primary);">Working</span>
                </div>
                <div style="height:4px; background:var(--bg-subtle); border-radius:2px; overflow:hidden; margin-bottom:var(--space-xl);">
                    <div class="progress-bar-indeterminate" style="height:100%; width:30%; background:var(--accent-primary); border-radius:2px;"></div>
                </div>
                <div class="skeleton-loader">
                    <div class="skeleton-row" style="height:40px; margin-bottom:12px;"></div>
                    <div class="skeleton-row" style="height:40px; margin-bottom:12px; width:90%;"></div>
                    <div class="skeleton-row" style="height:40px; margin-bottom:12px; width:95%;"></div>
                </div>
            </div>

            <!-- Step 3 -->
            <div id="step-3-container" style="display:none; margin-top:var(--space-2xl);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div style="font-size:12px; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px;">Step 3 — Results</div>
                    <button class="btn btn-secondary btn-sm" onclick="resetMatching()"><i data-feather="rotate-ccw"></i> New Match</button>
                </div>
                <div id="match-results-area"></div>
            </div>
        </div>

        <style>
            .match-type-card { border:1.5px solid var(--border); border-radius:var(--radius); padding:var(--space-xl); text-align:center; cursor:pointer; transition:all 0.2s; background:white; }
            .match-type-card:hover { border-color:var(--text-muted); transform:translateY(-2px); }
            .match-type-card.selected { border-color:var(--accent-primary); background:#FDF2F2; box-shadow:0 0 0 1px var(--accent-primary); }
            
            .grid-buttons { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
            .grid-btn { padding:10px; border:1px solid var(--border); border-radius:var(--radius-sm); background:white; font-size:14px; font-weight:600; color:var(--text-secondary); cursor:pointer; transition:all 0.2s; }
            .grid-btn:hover { background:var(--bg-subtle); }
            .grid-btn.selected { background:var(--accent-primary); color:white; border-color:var(--accent-primary); }
            
            @keyframes progress-anim {
                0% { transform:translateX(-100%); }
                100% { transform:translateX(400%); }
            }
            .progress-bar-indeterminate { animation: progress-anim 1.5s infinite linear; }
            @keyframes pulse-text-anim { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
            .pulse-text { animation: pulse-text-anim 1.5s infinite; }
            
            .accordion-form { background:var(--bg-subtle); padding:16px; border-top:1px solid var(--border); display:none; }
            .accordion-form.open { display:block; }
            
            .organ-match-ring { width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:4px solid var(--border); position:relative; }
        </style>
    `;
    if(window.feather) feather.replace();
}

function selectMatchType(type) {
    matchType = type;
    document.getElementById('card-blood').classList.toggle('selected', type === 'blood');
    document.getElementById('card-organ').classList.toggle('selected', type === 'organ');
    
    document.getElementById('step-2-container').style.display = 'block';
    
    document.getElementById('form-blood-container').style.display = type === 'blood' ? 'block' : 'none';
    document.getElementById('form-organ-container').style.display = type === 'organ' ? 'block' : 'none';
    
    document.getElementById('step-3-container').style.display = 'none';
    document.getElementById('scanning-state').style.display = 'none';
    
    
    document.getElementById('step-2-container').scrollIntoView({behavior:'smooth', block:'start'});
}

function selectBT(form, val) {
    if(form === 'blood') {
        bTypeSelected = val;
        document.getElementById('hidden_bt_blood').value = val;
        document.querySelectorAll('.bt-btn-blood').forEach(b => b.classList.toggle('selected', b.textContent.trim() === val));
    } else {
        bTypeOrgSelected = val;
        document.getElementById('hidden_bt_organ').value = val;
        document.querySelectorAll('.bt-btn-organ').forEach(b => b.classList.toggle('selected', b.textContent.trim() === val));
    }
}

function selectOT(val) {
    oTypeSelected = val;
    document.getElementById('hidden_ot_organ').value = val;
    const labelMatch = ORGAN_TYPES.find(o=>o.id===val).label;
    document.querySelectorAll('.ot-btn').forEach(b => b.classList.toggle('selected', b.textContent.includes(labelMatch)));
}

function resetMatching() {
    matchType = null;
    document.getElementById('card-blood').classList.remove('selected');
    document.getElementById('card-organ').classList.remove('selected');
    document.getElementById('step-2-container').style.display = 'none';
    document.getElementById('step-3-container').style.display = 'none';
    document.getElementById('scanning-state').style.display = 'none';
}

function showScanning() {
    document.getElementById('step-3-container').style.display = 'none';
    document.getElementById('scanning-state').style.display = 'block';
    document.getElementById('scanning-state').scrollIntoView({behavior:'smooth', block:'center'});
}

async function runBloodMatch(e) {
    e.preventDefault();
    if(!bTypeSelected) return showToast('Select a blood type', 'error');
    
    const data = Object.fromEntries(new FormData(e.target).entries());
    showScanning();
    await new Promise(r => setTimeout(r, 1200));

    const results = await API.post('match/blood', data);
    document.getElementById('scanning-state').style.display = 'none';
    document.getElementById('step-3-container').style.display = 'block';
    
    const target = document.getElementById('match-results-area');
    
    if (!results || results.length === 0) {
        renderEmptyState(target, { icon: 'search', title: 'Run a search to see compatible matches', subtitle: 'Nothing to show' });
        return;
    }

    const tRows = results.map(b => {
        const compatTag = b.blood_type === 'O-' 
            ? '<span style="background:var(--accent-secondary);color:white;font-size:10px;padding:2px 6px;border-radius:10px;font-weight:600;">Universal Donor</span>'
            : '<span style="background:#DEF7EC;color:#0E9F6E;font-size:10px;padding:2px 6px;border-radius:10px;font-weight:600;">Compatible</span>';
            
        return `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="font-family:var(--font-mono);font-size:13px;color:var(--text-secondary);padding:12px 16px;">${b.bag_uid}</td>
                <td style="font-weight:600;padding:12px 16px;">${b.blood_type}</td>
                <td style="padding:12px 16px;">${b.quantity_ml}ml</td>
                <td style="font-size:13px;padding:12px 16px;">${formatDate(b.expiry_date)}</td>
                <td style="font-size:13px;color:var(--text-secondary);padding:12px 16px;">${b.storage_location||'—'}</td>
                <td style="padding:12px 16px;">${compatTag}</td>
                <td style="text-align:right;padding:12px 16px;">
                    <button class="btn btn-primary btn-sm" onclick="toggleAllocRow('blood_${b.bag_id}')">Allocate</button></div></td>
            </tr>
            <tr>
                <td colspan="7" style="padding:0;">
                    <div id="alloc_form_blood_${b.bag_id}" class="accordion-form">
                        <form onsubmit="submitInlineAlloc(event, 'blood', ${b.bag_id})" style="display:flex;gap:12px;align-items:flex-end;">
                            <div style="flex:1;"><label class="form-label" style="font-size:11px;">Request ID *</label><input type="number" class="form-input" style="height:32px;font-size:13px;" name="request_id" required></div>
                            <div style="flex:1;"><label class="form-label" style="font-size:11px;">Approved By *</label><input class="form-input" style="height:32px;font-size:13px;" name="approved_by" required></div>
                            <button type="submit" class="btn btn-primary" style="height:32px;font-size:12px;padding:0 16px;">Confirm Allocation</button>
                        </form>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    target.innerHTML = `
        <div class="panel" style="padding:0; overflow:hidden;">
            <table style="width:100%; border-collapse:collapse; text-align:left;">
                <thead>
                    <tr style="background:var(--bg-subtle); border-bottom:1px solid var(--border);">
                        <th style="padding:12px 16px;font-size:12px;color:var(--text-secondary);font-weight:600;">Bag UID</th>
                        <th style="padding:12px 16px;font-size:12px;color:var(--text-secondary);font-weight:600;">Type</th>
                        <th style="padding:12px 16px;font-size:12px;color:var(--text-secondary);font-weight:600;">Qty</th>
                        <th style="padding:12px 16px;font-size:12px;color:var(--text-secondary);font-weight:600;">Expires</th>
                        <th style="padding:12px 16px;font-size:12px;color:var(--text-secondary);font-weight:600;">Location</th>
                        <th style="padding:12px 16px;font-size:12px;color:var(--text-secondary);font-weight:600;">Compatibility</th>
                        <th style="padding:12px 16px;"></th>
                    </tr>
                </thead>
                <tbody>${tRows}</tbody>
            </table>
        </div>
    `;
    document.getElementById('step-3-container').scrollIntoView({behavior:'smooth', block:'start'});
}

async function runOrganMatch(e) {
    e.preventDefault();
    if(!oTypeSelected || !bTypeOrgSelected) return showToast('Complete required fields', 'error');
    
    const data = Object.fromEntries(new FormData(e.target).entries());
    showScanning();
    await new Promise(r => setTimeout(r, 1200));

    const results = await API.post('match/organ', data);
    document.getElementById('scanning-state').style.display = 'none';
    document.getElementById('step-3-container').style.display = 'block';
    
    const target = document.getElementById('match-results-area');
    
    if (!results || results.length === 0) {
        renderEmptyState(target, { icon: 'search', title: 'Run a search to see compatible matches', subtitle: 'Nothing to show' });
        return;
    }

    target.innerHTML = `
        <div style="display:grid; grid-template-columns:1fr; gap:16px;">
            ${results.map(o => {
                const scoreMax = 100;
                const scorePct = Math.min((o.match_score / scoreMax) * 100, 100);
                const ringCol = scorePct >= 80 ? '#0E9F6E' : (scorePct >= 50 ? '#D97706' : '#E02424');
                const emoji = (ORGAN_TYPES.find(x=>x.id===o.organ_type)?.emoji)||'🔴';
                const cd = o.expires_at ? countdown(o.expires_at) : { text: '—' };
                
                return `
                <div class="panel" style="padding:0; overflow:hidden;">
                    <div style="padding:var(--space-xl); display:flex; gap:var(--space-xl); align-items:center;">
                        <div class="organ-match-ring" style="border-color:${ringCol}; color:${ringCol};">
                            <span style="font-family:var(--font-heading); font-size:28px; font-weight:700;">${o.match_score}</span>
                            <span style="font-size:12px; font-weight:600; margin-left:2px; margin-top:8px;">%</span>
                        </div>
                        <div style="flex:1;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                                <span style="font-size:20px;">${emoji}</span>
                                <span style="font-family:var(--font-heading); font-size:18px; font-weight:600; text-transform:capitalize;">${o.organ_type}</span>
                                <span style="font-size:13px; color:var(--text-secondary); margin-left:auto;">Donor: ${o.donor_name||'#'+o.donor_id}</span>
                            </div>
                            <div style="display:flex; gap:16px; font-size:13px; color:var(--text-secondary); margin-top:8px;">
                                <div><strong style="color:var(--text-primary);">Blood:</strong> ${o.donor_blood_type}</div>
                                <div><strong style="color:var(--text-primary);">Tissue:</strong> ${o.tissue_type||'—'}</div>
                                <div style="margin-left:auto;"><strong style="color:var(--text-primary);">Time Left:</strong> ${cd.text}</div>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="toggleAllocRow('organ_${o.organ_id}')">Allocate</button>
                    </div>
                    <div id="alloc_form_organ_${o.organ_id}" class="accordion-form">
                        <form onsubmit="submitInlineAlloc(event, 'organ', ${o.organ_id})" style="display:flex;gap:12px;align-items:flex-end;max-width:600px;margin:0 auto;">
                            <div style="flex:1;"><label class="form-label" style="font-size:11px;">Request ID *</label><input type="number" class="form-input" style="height:32px;font-size:13px;" name="request_id" required></div>
                            <div style="flex:1;"><label class="form-label" style="font-size:11px;">Approved By *</label><input class="form-input" style="height:32px;font-size:13px;" name="approved_by" required></div>
                            <div style="flex:1;"><label class="form-label" style="font-size:11px;">Expected Delivery (Opt)</label><input type="datetime-local" class="form-input" style="height:32px;font-size:13px;" name="expected_delivery"></div>
                            <button type="submit" class="btn btn-primary" style="height:32px;font-size:12px;padding:0 16px;">Confirm</button>
                        </form>
                    </div>
                </div>
                `;
            }).join('')}
        </div>
    `;
    document.getElementById('step-3-container').scrollIntoView({behavior:'smooth', block:'start'});
}

function toggleAllocRow(idStr) {
    document.getElementById('alloc_form_'+idStr).classList.toggle('open');
}

async function submitInlineAlloc(e, type, id) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target).entries());
    let res;

    if (type === 'blood') {
        res = await API.post('allocate/blood', { request_id: parseInt(fd.request_id), bag_id: parseInt(id), approved_by: fd.approved_by });
    } else {
        res = await API.post('allocate/organ', { request_id: parseInt(fd.request_id), organ_id: parseInt(id), approved_by: fd.approved_by, expected_delivery: fd.expected_delivery || null });
    }

    if (res && res.message) {
        showToast(res.message, 'success');
        document.getElementById('alloc_form_'+type+'_'+id).classList.remove('open');
    } else {
        showToast('Allocation failed', 'error');
    }
}
