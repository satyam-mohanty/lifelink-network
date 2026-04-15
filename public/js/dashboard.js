

async function renderDashboard() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
        <div class="stats-grid" id="stats-grid">
            <div class="stat-card"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
            <div class="stat-card"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
            <div class="stat-card"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
            <div class="stat-card"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
        </div>

        <div class="panel dashboard-grid-full" id="blood-chart-panel" style="background: white; border-radius: var(--radius); padding: var(--space-lg); border: 1px solid var(--border); margin-bottom: var(--space-lg); box-shadow: var(--shadow-sm);">
            <div style="font-family: var(--font-heading); font-size: 15px; font-weight: 600; margin-bottom: 16px;">Blood Inventory by Type</div>
            <div style="position: relative; height: 180px; width: 100%;">
                <canvas id="blood-inventory-chart"></canvas>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 3fr 2fr; gap: var(--space-lg); margin-bottom: var(--space-lg);" class="responsive-grid">
            <div class="panel" id="organs-panel" style="margin-bottom: 0;">
                <div class="panel-header">
                    <span class="panel-title" style="font-size: 16px;">Organs Expiring Soon</span>
                </div>
                <div id="organs-expiring-list"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
            </div>
            
            <div class="panel" id="alerts-panel" style="margin-bottom: 0; display: flex; flex-direction: column;">
                <div class="panel-header" style="margin-bottom: 12px;">
                    <span class="panel-title" style="font-size: 16px;">Recent Alerts</span>
                </div>
                <div id="alerts-list" style="flex: 1;"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
            </div>
        </div>

        <div class="panel dashboard-grid-full" id="requests-panel" style="margin-bottom: 0;">
            <div class="panel-header">
                <span class="panel-title" style="font-size: 16px;">Recent Requests</span>
            </div>
            <div id="requests-list"><table style="width:100%; border-collapse:collapse; text-align:left;">    <tbody>        ${Array(5).fill(0).map(()=>`            <tr style="border-bottom:1px solid var(--border);">                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:30px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:120px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:80px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:100px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:90px;height:14px;border-radius:2px;"></div></td>                <td style="padding:14px 16px;"><div class="skeleton-row" style="width:60px;height:14px;border-radius:2px;"></div></td>            </tr>        `).join('')}    </tbody></table></div>
        </div>
        <style>
            @media (max-width: 1000px) { .responsive-grid { grid-template-columns: 1fr !important; } }
            .alert-item-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
        </style>
    `;

    
    if(window.feather) feather.replace();

    
    const [donors, bloodSummary, organs, alerts, requests] = await Promise.all([
        API.get('donors?is_eligible=true'),
        API.get('blood/summary'),
        API.get('organs?status=available'),
        API.get('alerts'),
        API.get('requests'),
    ]);

    
    const donorCount = donors ? donors.length : 0;
    const bloodTotal = bloodSummary ? bloodSummary.reduce((s, b) => s + b.count, 0) : 0;
    const organCount = organs ? organs.length : 0;
    const alertCount = alerts ? alerts.filter(a => !a.is_resolved).length : 0;

    
    const alertBadge = document.getElementById('topbar-alert-badge');
    if (alertBadge) {
        if (alertCount > 0) {
            alertBadge.textContent = alertCount;
            alertBadge.style.display = 'flex';
        } else {
            alertBadge.style.display = 'none';
        }
    }

    document.getElementById('stats-grid').innerHTML = `
        <div class="stat-card">
            <div class="stat-card-icon" style="background: #FEF2F4; color: #C0152A; width: 40px; height: 40px; border-radius: 8px;"><i data-feather="users"></i></div>
            <div class="stat-card-content">
                <div class="stat-card-value">${donorCount}</div>
                <div class="stat-card-label">Eligible Donors</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon" style="background: #FEF2F4; color: #C0152A; width: 40px; height: 40px; border-radius: 8px;"><i data-feather="droplet"></i></div>
            <div class="stat-card-content">
                <div class="stat-card-value">${bloodTotal}</div>
                <div class="stat-card-label">Blood Units</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon" style="background: #EFF6FF; color: #1A56DB; width: 40px; height: 40px; border-radius: 8px;"><i data-feather="heart"></i></div>
            <div class="stat-card-content">
                <div class="stat-card-value">${organCount}</div>
                <div class="stat-card-label">Organs Available</div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon" style="background: #FFFBEB; color: #D97706; width: 40px; height: 40px; border-radius: 8px;"><i data-feather="bell"></i></div>
            <div class="stat-card-content">
                <div class="stat-card-value">${alertCount}</div>
                <div class="stat-card-label">Unresolved Alerts</div>
            </div>
        </div>
    `;

    
    const allTypes = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
    const summaryMap = {};
    if (bloodSummary) bloodSummary.forEach(b => summaryMap[b.blood_type] = b.count);
    
    const counts = allTypes.map(bt => summaryMap[bt] || 0);
    const bgColors = counts.map(c => {
        if (c < 3) return '#E02424';
        if (c <= 9) return '#D97706';
        return '#0E9F6E';
    });

    const ctx = document.getElementById('blood-inventory-chart').getContext('2d');
    if (window._dashboardBloodChart) { window._dashboardBloodChart.destroy(); }
    window._dashboardBloodChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allTypes,
            datasets: [{
                data: counts,
                backgroundColor: bgColors,
                borderRadius: 4,
                barThickness: 16
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) { return ` ${context.raw} Units`; }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: '#E5E7EB', drawBorder: false },
                    ticks: { font: { family: 'Inter', size: 11 }, color: '#6B7280' }
                },
                y: {
                    grid: { display: false, drawBorder: false },
                    ticks: { font: { family: 'Sora', weight: '600', size: 12 }, color: '#111827' }
                }
            }
        }
    });

    
    const organsList = document.getElementById('organs-expiring-list');
    if (organs && organs.length > 0) {
        const urgentOrgans = organs.filter(o => {
            if (!o.expires_at) return false;
            const diff = new Date(o.expires_at) - new Date();
            return diff > 0 && diff < 24 * 3600000;
        }).sort((a,b) => new Date(a.expires_at) - new Date(b.expires_at)).slice(0, 5);

        if (urgentOrgans.length === 0) {
            renderEmptyState(organsList, { icon: 'check-circle', title: 'No organs critically expiring', subtitle: 'All clear.' });
        } else {
            organsList.innerHTML = `
                <div class="table-wrapper"><table>
                    <thead><tr>
                        <th>Organ Type</th><th>Blood Type</th><th>Expires At</th><th>Time Remaining</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                        ${urgentOrgans.map(o => {
                            const expiresAt = new Date(o.expires_at);
                            const now = new Date();
                            const diffMs = expiresAt - now;
                            const diffHrs = diffMs / 3600000;
                            
                            let timeColor = '#0E9F6E';
                            if (diffHrs < 2) timeColor = '#E02424';
                            else if (diffHrs < 6) timeColor = '#D97706';

                            const cd = countdown(o.expires_at);
                            return `<tr>
                                <td style="color:var(--text-primary);font-weight:600;">${o.organ_type}</td>
                                <td>${o.blood_type || '—'}</td>
                                <td>${formatDateTime(o.expires_at)}</td>
                                <td style="color: ${timeColor}; font-weight: 600;">${cd.text}</td>
                                <td>${statusBadge(o.status)}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table></div>
            `;
        }
    } else {
        renderEmptyState(organsList, { icon: 'check-circle', title: 'No organs critically expiring', subtitle: 'All clear.' });
    }

    
    const alertsList = document.getElementById('alerts-list');
    const unresolved = alerts ? alerts.filter(a => !a.is_resolved).sort((a,b) => new Date(b.created_at) - new Date(a.created_at)) : [];
    if (unresolved.length > 0) {
        const recent = unresolved.slice(0, 5);
        alertsList.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: var(--space-sm); margin-bottom: var(--space-md);">
                ${recent.map(a => {
                    let borderColor = '#E5E7EB';
                    if(a.alert_type === 'emergency' || a.alert_type === 'expiry' || a.alert_type === 'low_stock') borderColor = '#E02424';
                    else if(a.alert_type === 'organ_expiring') borderColor = '#D97706';
                    
                    return `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: white;">
                        <div style="flex: 1; min-width: 0;">
                            <div class="alert-item-truncate" style="font-size: 13px; color: var(--text-primary); font-weight: 500; margin-bottom: 4px;">${a.message}</div>
                            <div style="font-size: 11px; color: var(--text-muted);">${timeAgo(a.created_at)}</div>
                        </div>
                        <button class="btn btn-danger btn-sm" style="padding: 0 10px; height: 26px; font-size: 11px; flex-shrink: 0;" onclick="resolveDashboardAlert(${a.alert_id})">Resolve</button>
                    </div>`;
                }).join('')}
            </div>
            <div style="text-align: center; margin-top: auto; padding-top: var(--space-sm);">
                <a href="#" onclick="navigateTo('alerts')" style="font-size: 13px; color: var(--accent-secondary); font-weight: 500; text-decoration: none;">View All Alerts &rarr;</a>
            </div>
        `;
    } else {
        renderEmptyState(alertsList, { icon: 'check-circle', title: 'All clear — no active alerts', subtitle: 'System healthy.' });
    }

    
    const requestsList = document.getElementById('requests-list');
    if (requests && requests.length > 0) {
        const recent = requests.sort((a,b) => new Date(b.requested_at) - new Date(a.requested_at)).slice(0, 8);
        requestsList.innerHTML = `
            <div style="display: flex; gap: var(--space-md); overflow-x: auto; padding-bottom: 8px;">
                ${recent.map(r => {
                    const rType = r.type || (r.organ_type ? 'organ' : 'blood');
                    const detail = rType === 'blood' ? (r.blood_type || '—') : (r.organ_type || '—');
                    
                    // Logic for pipeline visualization
                    const s = r.status.toLowerCase();
                    const sRequested = true; // always requested
                    const sMatched = ['matched', 'dispatched', 'delivered'].includes(s);
                    const sDispatched = ['dispatched', 'delivered'].includes(s);
                    const sDelivered = ['delivered'].includes(s);

                    return `
                        <div style="min-width: 280px; flex-shrink: 0; padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: white;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; align-items: flex-start;">
                                <div>
                                    <span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">#${r.request_id}</span>
                                    <div style="font-size: 14px; font-weight: 600; color: var(--text-primary); margin-top: 2px;">${r.hospital_name || 'Hospital A'}</div>
                                </div>
                                <div style="display: flex; gap: 4px; flex-direction: column; align-items: flex-end;">
                                    ${statusBadge(rType)}
                                    ${urgencyBadge(r.urgency_level)}
                                </div>
                            </div>
                            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; display: flex; align-items: center; gap: 6px;">
                                <i data-feather="${rType === 'organ' ? 'heart' : 'droplet'}" style="width: 14px; height: 14px;"></i> 
                                ${detail}
                            </div>
                            <div class="pipeline">
                                <span class="pipeline-step ${sRequested ? 'pipeline-active' : ''}">Req</span>
                                <span class="pipeline-arrow">&rarr;</span>
                                <span class="pipeline-step ${sMatched ? 'pipeline-active' : ''}">Match</span>
                                <span class="pipeline-arrow">&rarr;</span>
                                <span class="pipeline-step ${sDispatched ? 'pipeline-active' : ''}">Disp</span>
                                <span class="pipeline-arrow">&rarr;</span>
                                <span class="pipeline-step ${sDelivered ? 'pipeline-active' : ''}">Deliv</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        renderEmptyState(requestsList, { icon: 'inbox', title: 'No requests yet', subtitle: 'System idle.' });
    }

    if(window.feather) feather.replace();
}


async function resolveDashboardAlert(id) {
    const result = await API.put(`alerts/${id}/resolve`, {});
    if (result) {
        showToast('Alert resolved', 'success');
        renderDashboard();
    }
}
