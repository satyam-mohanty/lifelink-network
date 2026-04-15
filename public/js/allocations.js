

let allAllocations = [];
let allocFilters = { type: '', status: '', date_start: '', date_end: '' };

const STATUS_LABELS = {
    approved: '<span style="background:var(--bg-subtle);color:var(--text-secondary);padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;"><i data-feather="check-circle" style="width:10px;height:10px;"></i> Approved</span>',
    dispatched: '<span style="background:#FEF08A;color:#B45309;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;"><i data-feather="truck" style="width:10px;height:10px;"></i> Dispatched</span>',
    delivered: '<span style="background:#DEF7EC;color:#0E9F6E;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;"><i data-feather="map-pin" style="width:10px;height:10px;"></i> Delivered</span>',
    failed: '<span style="background:#FDF2F2;color:#E02424;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;"><i data-feather="x-octagon" style="width:10px;height:10px;"></i> Failed</span>'
};

async function renderAllocations() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="view-header" style="margin-bottom:var(--space-lg);">
            <h1>ALLOCATIONS</h1>
            <p>Logistics, dispatch tracking, and fulfillment audit trails</p>
        </div>

        <div class="panel" style="padding:var(--space-md); margin-bottom:var(--space-lg); display:flex; gap:var(--space-lg); align-items:flex-end; flex-wrap:wrap;">
            <div class="form-group" style="margin:0; flex:1; min-width:140px;">
                <label class="form-label" style="font-size:11px;">Type</label>
                <select class="form-select" id="af-type" style="height:32px; font-size:13px;" onchange="updateFilters()">
                    <option value="">All</option><option value="blood">Blood</option><option value="organ">Organ</option>
                </select>
            </div>
            <div class="form-group" style="margin:0; flex:1; min-width:140px;">
                <label class="form-label" style="font-size:11px;">Status</label>
                <select class="form-select" id="af-status" style="height:32px; font-size:13px;" onchange="updateFilters()">
                    <option value="">All</option><option value="approved">Approved</option><option value="dispatched">Dispatched</option><option value="delivered">Delivered</option><option value="failed">Failed</option>
                </select>
            </div>
            <div class="form-group" style="margin:0; flex:1; min-width:140px;">
                <label class="form-label" style="font-size:11px;">Start Date</label>
                <input class="form-input" type="date" id="af-dstart" style="height:32px; font-size:13px;" onchange="updateFilters()">
            </div>
            <div class="form-group" style="margin:0; flex:1; min-width:140px;">
                <label class="form-label" style="font-size:11px;">End Date</label>
                <input class="form-input" type="date" id="af-dend" style="height:32px; font-size:13px;" onchange="updateFilters()">
            </div>
        </div>

        <div class="panel" style="padding:0; overflow:hidden;">
            <div id="alloc-table"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
        </div>

        <style>
            .exp-row { display:none; background:var(--bg-base); font-size:13px; border-bottom:1px solid var(--border); box-shadow:inset 0 3px 6px rgba(0,0,0,0.02); }
            .exp-row.open { display:table-row; }
            .exp-content { display:grid; grid-template-columns:1fr 1fr 1fr; gap:24px; padding:24px; }
            
            .timeline-col { position:relative; padding-left:16px; border-left:2px solid var(--border); display:flex; flex-direction:column; gap:16px; margin-left:8px; }
            .timeline-item { position:relative; }
            .timeline-dot { position:absolute; left:-23px; top:2px; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 0 0 2px var(--border); background:var(--bg-base); }
            .timeline-dot.done { background:var(--accent-primary); box-shadow:0 0 0 2px var(--accent-primary); }
            .timeline-dot.failed { background:var(--accent-danger); box-shadow:0 0 0 2px var(--accent-danger); }
            
            table { width:100%; border-collapse:collapse; text-align:left; }
            th { padding:12px 16px; font-size:11px; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid var(--border); background:var(--bg-subtle); }
            td { padding:14px 16px; font-size:13px; color:var(--text-primary); border-bottom:1px solid var(--border); }
            tbody tr:not(.exp-row):hover { background:var(--bg-subtle); cursor:pointer; }
            
            .inline-actions { display:none; flex-direction:column; gap:8px; margin-top:16px; padding-top:16px; border-top:1px dashed var(--border); }
            .inline-actions.show { display:flex; }
        </style>
    `;
    if(window.feather) feather.replace();
    await loadAllocData();
}

function updateFilters() {
    allocFilters.type = document.getElementById('af-type').value;
    allocFilters.status = document.getElementById('af-status').value;
    allocFilters.date_start = document.getElementById('af-dstart').value;
    allocFilters.date_end = document.getElementById('af-dend').value;
    allocationsRenderTable();
}

async function loadAllocData() {
    allAllocations = await API.get('allocations') || [];
    allocationsRenderTable();
}

function allocationsRenderTable() {
    const target = document.getElementById('alloc-table');
    let filtered = allAllocations.filter(a => {
        if(allocFilters.type && a.request_type !== allocFilters.type) return false;
        if(allocFilters.status && a.status !== allocFilters.status) return false;
        
        if(allocFilters.date_start || allocFilters.date_end) {
            const d = new Date(a.approved_at);
            if(allocFilters.date_start && d < new Date(allocFilters.date_start)) return false;
            if(allocFilters.date_end) {
                const end = new Date(allocFilters.date_end);
                end.setHours(23,59,59);
                if(d > end) return false;
            }
        }
        return true;
    });

    if (filtered.length === 0) {
        renderEmptyState(target, { icon: 'package', title: 'No allocations recorded', subtitle: 'Nothing to show' });
        if(window.feather) feather.replace(); return;
    }

    const tRows = filtered.map(a => {
        const bgBadge = a.request_type === 'blood' 
            ? '<span style="color:var(--accent-primary);font-weight:600;"><i data-feather="droplet" style="width:12px;height:12px;"></i> Blood</span>'
            : '<span style="color:#0E9F6E;font-weight:600;"><i data-feather="heart" style="width:12px;height:12px;"></i> Organ</span>';

        let delUi = '—';
        if (a.status === 'delivered') {
            if (a.expected_delivery && a.actual_delivery) {
                const diff = (new Date(a.actual_delivery) - new Date(a.expected_delivery)) / 60000;
                if (diff > 0) delUi = `<span style="color:var(--accent-danger);font-weight:600;">${Math.round(diff)} min late</span>`;
                else delUi = `<span style="color:#0E9F6E;font-weight:600;">On time</span>`;
            } else {
                delUi = `<span style="color:#0E9F6E;font-weight:600;">Delivered</span>`;
            }
        } else if (a.status === 'dispatched' && a.expected_delivery) {
            const diff = (new Date(a.expected_delivery) - new Date()) / 60000;
            if (diff > 0) {
                const h = Math.floor(diff/60); const m = Math.round(diff%60);
                delUi = `<span style="color:#D97706;font-weight:600;">Expected in ${h}h ${m}m</span>`;
            } else {
                delUi = `<span style="color:var(--accent-danger);font-weight:600;">Overdue by ${Math.abs(Math.round(diff))}m</span>`;
            }
        } else if (a.status === 'failed') {
            delUi = `<span style="color:var(--accent-danger);font-weight:600;text-decoration:line-through;">Failed</span>`;
        }

        const expId = `exp_${a.allocation_id}`;

        const actBtns = `
            <div class="inline-actions ${(a.status==='approved'||a.status==='dispatched')?'show':''}" id="actions_${a.allocation_id}">
                ${a.status === 'approved' ? `<button class="btn btn-primary btn-sm" onclick="showConfirmInline(event, ${a.allocation_id}, 'dispatched')"><i data-feather="truck" style="width:14px;height:14px;"></i> Mark Dispatched</button>` : ''}
                ${a.status === 'dispatched' ? `
                    <button class="btn btn-primary btn-sm" onclick="showConfirmInline(event, ${a.allocation_id}, 'delivered')" style="background:#0E9F6E;border-color:#0E9F6E;"><i data-feather="check" style="width:14px;height:14px;"></i> Mark Delivered</button>
                    <button class="btn btn-secondary btn-sm" style="color:var(--accent-danger);border-color:var(--accent-danger);" onclick="showConfirmInline(event, ${a.allocation_id}, 'failed')"><i data-feather="x" style="width:14px;height:14px;"></i> Mark Failed</button>
                ` : ''}
                <div id="confirm_${a.allocation_id}" style="display:none; padding:8px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:12px; flex-direction:column; gap:8px;">
                    <span style="font-weight:600;">Confirm status change?</span>
                    <div style="display:flex;gap:8px;">
                        <button class="btn btn-primary btn-sm" id="btn_conf_yes_${a.allocation_id}">Yes</button>
                        <button class="btn btn-secondary btn-sm" onclick="hideConfirmInline(${a.allocation_id})">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        return `
            <tr onclick="toggleExp('${expId}')">
                <td style="font-family:var(--font-mono);font-weight:600;color:var(--text-secondary);">#${a.allocation_id}</td>
                <td>${bgBadge}</td>
                <td style="font-family:var(--font-mono);color:var(--text-secondary);">Req #${a.request_id}</td>
                <td>${a.approved_by || '—'}</td>
                <td style="color:var(--text-secondary);">${formatDate(a.approved_at)}</td>
                <td style="color:var(--text-secondary);${a.status==='failed'?'text-decoration:line-through;':''}">${a.expected_delivery ? formatDateTime(a.expected_delivery) : '—'}</td>
                <td>${delUi}</td>
                <td>${STATUS_LABELS[a.status]||a.status}</td>
                <td style="text-align:right;"><i data-feather="chevron-down" style="color:var(--text-muted);width:16px;height:16px;"></i></td>
            </tr>
            <tr id="${expId}" class="exp-row">
                <td colspan="9" style="padding:0;">
                    <div class="exp-content">
                        <!-- Col 1: Item Details -->
                        <div>
                            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Allocated Item</div>
                            <div style="background:white; padding:16px; border-radius:var(--radius-sm); border:1px solid var(--border);">
                                ${a.request_type==='blood' ? `
                                    <div style="display:flex;gap:12px;margin-bottom:8px;">
                                        <div style="background:#FDF2F2; color:var(--accent-primary); width:40px; height:40px; border-radius:8px; display:flex; align-items:center; justify-content:center;"><i data-feather="droplet"></i></div>
                                        <div>
                                            <div style="font-family:var(--font-heading); font-weight:600; font-size:15px;">Bag UID: ${a.bag_uid}</div>
                                            <div style="color:var(--accent-primary); font-family:var(--font-display); font-size:18px; line-height:1;">${a.blood_type}</div>
                                        </div>
                                    </div>
                                ` : `
                                    <div style="display:flex;gap:12px;margin-bottom:8px;">
                                        <div style="background:#FDF2F2; color:var(--accent-primary); width:40px; height:40px; border-radius:8px; display:flex; align-items:center; justify-content:center;"><i data-feather="heart"></i></div>
                                        <div>
                                            <div style="font-family:var(--font-heading); font-weight:600; font-size:15px; text-transform:capitalize;">${a.organ_type}</div>
                                            <div style="color:var(--text-secondary); font-size:13px; margin-top:2px;">Organ ID: #${a.organ_id||'Unknown'}</div>
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>

                        <!-- Col 2: Destination -->
                        <div>
                            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Destination</div>
                            <div style="background:white; padding:16px; border-radius:var(--radius-sm); border:1px solid var(--border);">
                                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-weight:600;color:var(--text-primary);"><i data-feather="user" style="width:14px;height:14px;color:var(--text-secondary);"></i> ${a.patient_name||'Unknown Patient'}</div>
                                <div style="display:flex;align-items:center;gap:8px;color:var(--text-secondary);"><i data-feather="home" style="width:14px;height:14px;color:var(--text-secondary);"></i> ${a.hospital_name||'Unknown Hospital'}</div>
                            </div>
                            ${actBtns}
                        </div>

                        <!-- Col 3: Audit Trail -->
                        <div>
                            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Audit Timeline</div>
                            <div class="timeline-col">
                                <div class="timeline-item">
                                    <div class="timeline-dot done"></div>
                                    <div style="font-weight:600; color:var(--text-primary);">Approved</div>
                                    <div style="font-size:12px; color:var(--text-secondary);">${formatDateTime(a.approved_at)} by ${a.approved_by}</div>
                                </div>
                                <div class="timeline-item">
                                    <div class="timeline-dot ${(a.dispatch_time)?'done':''} ${a.status==='failed'&&!a.dispatch_time?'failed':''}"></div>
                                    <div style="font-weight:600; color:${a.dispatch_time?'var(--text-primary)':'var(--text-muted)'};">${a.status==='failed'&&!a.dispatch_time?'Failed':'Dispatched'}</div>
                                    <div style="font-size:12px; color:var(--text-secondary);">${a.dispatch_time?formatDateTime(a.dispatch_time):'—'}</div>
                                </div>
                                <div class="timeline-item">
                                    <div class="timeline-dot ${(a.status==='delivered')?'done':''} ${a.status==='failed'?'failed':''}"></div>
                                    <div style="font-weight:600; color:${a.actual_delivery||a.status==='failed'?'var(--text-primary)':'var(--text-muted)'};">${a.status==='failed'?'Failed':'Delivered'}</div>
                                    <div style="font-size:12px; color:var(--text-secondary);">${a.actual_delivery?formatDateTime(a.actual_delivery):'—'}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </td>
            </tr>
        `;
    }).join('');

    target.innerHTML = `<table>
        <thead>
            <tr><th>No.</th><th>Type</th><th>Req ID</th><th>Approver</th><th>Approved</th><th>Expected</th><th>Arrival</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>${tRows}</tbody>
    </table>`;
    if(window.feather) feather.replace();
}

function toggleExp(id) {
    const el = document.getElementById(id);
    const wasOpen = el.classList.contains('open');
    document.querySelectorAll('.exp-row').forEach(r => r.classList.remove('open'));
    if(!wasOpen) el.classList.add('open');
}

function showConfirmInline(e, id, status) {
    e.stopPropagation();
    Array.from(document.getElementById('actions_'+id).children).forEach(c => {
        if(c.id !== 'confirm_'+id) c.style.display = 'none';
    });
    document.getElementById('confirm_'+id).style.display = 'flex';
    document.getElementById('btn_conf_yes_'+id).onclick = (ev) => { ev.stopPropagation(); updateStatus(id, status); };
}

function hideConfirmInline(id) {
    Array.from(document.getElementById('actions_'+id).children).forEach(c => {
        if(c.id !== 'confirm_'+id) c.style.display = '';
    });
    document.getElementById('confirm_'+id).style.display = 'none';
}

async function updateStatus(id, status) {
    const res = await API.put(`allocations/${id}/delivery`, { status });
    if(res && res.message) {
        showToast('Status updated successfully', 'success');
        await loadAllocData();
    } else {
        showToast('Update failed', 'error');
        hideConfirmInline(id);
    }
}
