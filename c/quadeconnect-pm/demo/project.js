'use strict';
/* =====================================================================
   QuadeConnect PM — project.js
   Inside a project: header, category tabs, Details (+ Hours Pay Plan,
   team access), Work Orders, Study Projects, Activity.
   ===================================================================== */

function projectTabs(p, ch) {
  const pub = list => isClient() ? list.filter(d => d.published).length : list.length;
  const all = [
    { k: 'details', l: 'Details' },
    { k: 'workorders', l: 'Work Orders', n: ch.workOrders.length },
    { k: 'studies', l: 'Study Projects', n: ch.studies.length },
    { k: 'sheets', l: 'Sheets', n: pub(ch.sheets) },
    { k: 'shop', l: 'Shop Drawings', n: pub(ch.shop) },
    { k: 'files', l: 'Files', n: isClient() ? ch.files.filter(f => CLIENT_FILE_CATS.includes(f.cat)).length : ch.files.length },
    { k: 'qc', l: 'QC Review', n: ch.shop.filter(s => s.qcStatus === 'Pending QC').length },
    { k: 'submittals', l: 'Submittals', n: isClient() ? ch.submittals.filter(s => s.status !== 'Draft').length : ch.submittals.length },
    { k: 'activity', l: 'Activity' }
  ];
  const clientTabs = ['details', 'sheets', 'shop', 'files', 'submittals'];
  return isClient() ? all.filter(t => clientTabs.includes(t.k)) : all;
}

function renderProject(no, tab, id) {
  const p = state.projects.find(x => x.no === no);
  if (!p) { $('#view').innerHTML = `<div class="denied">Project ${esc(no)} not found.</div>`; return; }
  if (!canAccess(no)) {
    $('#view').innerHTML = `<div class="denied"><h2>Access denied</h2><p>${esc(me().name)} (${role()}) is not assigned to ${esc(no)}.</p><a href="#/projects/grid">Back to my projects</a></div>`; return;
  }
  const ch = state.children[no]; const tabs = projectTabs(p, ch);
  if (!tabs.find(t => t.k === tab)) tab = 'details';
  const tabLabel = tabs.find(t => t.k === tab).l;
  const sub = id ? ` › <a href="#/project/${no}/${tab}">${tabLabel}</a> › View` : ` › ${tabLabel}`;
  const pills = canSeeCost()
    ? `<div class="pills"><span class="pill">Original Contract Value: ${fmt$(p.origContract)}</span><span class="pill">Current Contract Value: ${fmt$(p.currentContract)}</span><span class="pill">Work Orders Value: ${fmt$(p.woValue)}</span></div>`
    : `<div class="pills"><span class="badge b-gray">Customer: ${esc(p.customer)}</span><span class="badge" style="background:${STAGE_COLORS[p.stage]}22;color:${STAGE_COLORS[p.stage]}">${p.stage}</span><span class="badge b-gray">PM: ${esc(p.pm)}</span></div>`;
  const budgetOk = p.estCost <= p.currentContract;
  $('#view').innerHTML = `
    <div class="crumb"><span class="chev">›</span> <a href="#/projects/grid">Projects</a> › <a href="#/project/${no}/details">${esc(p.name)}</a>${sub}</div>
    <div class="proj-head"><div><h1>${p.no} - ${esc(p.name)}</h1>${pills}</div>
      ${canSeeCost() ? `<span class="budget-ok" style="${budgetOk ? '' : 'background:#fee2e2;color:#991b1b'}">${budgetOk ? 'Budget is up to date' : 'Over budget'}</span>` : ''}</div>
    <div class="tabs">${tabs.map(t => `<a class="${t.k === tab ? 'active' : ''}" href="#/project/${no}/${t.k}">${t.n !== undefined ? `<span class="cnt">${t.n}</span>` : ''}${t.l}</a>`).join('')}</div>
    <div id="tabBody"></div>`;
  const R = { details: renderDetails, workorders: renderWorkOrders, studies: renderStudies, sheets: (p, ch, id) => renderDocs(p, ch, 'sheets', id), shop: (p, ch, id) => renderDocs(p, ch, 'shop', id), files: renderFiles, qc: renderQC, submittals: renderSubmittals, activity: renderActivity };
  R[tab](p, ch, id);
}
const rerender = () => route();

/* ---------- DETAILS ---------- */
function renderDetails(p, ch) {
  const hb = sum(p.hoursBudget), hl = sum(p.hoursLogged);
  const editHours = canManage(); const editRates = isAdmin();
  const team = state.users.filter(u => u.role !== 'Admin' && u.projects.includes(p.no));
  const overview = `<div class="card"><h3>Project Overview</h3><div class="kv">
      <div>Project No.</div><div><b>${p.no}</b></div><div>Name</div><div>${esc(p.name)}</div>
      <div>Customer</div><div>${esc(p.customer)}</div><div>Architect</div><div>${esc(p.architect)}</div>
      <div>Location</div><div>${esc(p.location)}</div><div>Stage</div><div>${p.stage}</div>
      <div>Priority</div><div><span class="prio ${p.priority}">⚑ ${p.priority}</span></div><div>Project Manager</div><div>${esc(p.pm)}</div>
      <div>Start</div><div>${fmtDate(p.start)}</div><div>Target Completion</div><div>${fmtDate(p.due)}</div>
      <div>AWI Grade</div><div>${p.awiGrade}</div><div>Primary Finish</div><div>${p.veneer}</div></div></div>`;
  if (isClient()) {
    const done = STAGES.indexOf(p.stage);
    $('#tabBody').innerHTML = `<div class="cards">${overview}<div class="card"><h3>Project Progress</h3>
      ${STAGES.map((s, i) => `<div class="check"><span>${i < done ? '✅' : i === done ? '🔶' : '⬜'}</span><span>${s}</span></div>`).join('')}
      <p class="hint">Upload drawings & specs in <a href="#/project/${p.no}/files">Files</a>; review drawings in <a href="#/project/${p.no}/submittals">Submittals</a>.</p></div></div>`;
    return;
  }
  const fin = canSeeCost() ? `<div class="card"><h3>Financial Summary <span class="badge b-green">Admin only</span></h3><div class="kv">
      <div>Original Contract</div><div>${fmt$(p.origContract)}</div><div>Change Orders</div><div>${fmt$(p.currentContract - p.origContract)}</div>
      <div>Current Contract</div><div><b>${fmt$(p.currentContract)}</b></div><div>Work Orders Value</div><div>${fmt$(p.woValue)}</div>
      <div>Billed</div><div>${fmt$(p.billed)} (${fmtPct(p.currentContract ? p.billed / p.currentContract * 100 : 0)})</div>
      <div>Est. Grand Total Cost</div><div>${fmt$(p.estCost)}</div>
      <div>Labor Cost to Date</div><div>${fmt$(TRADES.reduce((a, t) => a + p.hoursLogged[t] * state.rates[t], 0))}</div>
      <div>Projected Margin</div><div><b>${fmtPct(p.currentContract ? (p.currentContract - p.estCost) / p.currentContract * 100 : 0)}</b></div></div></div>`
    : `<div class="card"><h3>Financial Summary</h3><div class="lock">🔒 Contract values, billing, costs and pay rates are visible to Admin only. Your role (${role()}) sees hours.</div></div>`;
  const hoursRows = TRADES.map(t => {
    const b = p.hoursBudget[t], l = p.hoursLogged[t], pct = b ? l / b * 100 : 0;
    return `<tr><td>${t}</td>
      <td>${editHours ? `<input type="number" min="0" id="hb_${t}" value="${b}">` : b}</td><td>${l}</td>
      <td><div class="bar"><span class="${pct > 100 ? 'over' : ''}" style="width:${Math.min(100, pct)}%"></span></div> ${Math.round(pct)}%</td>
      ${canSeeCost() ? `<td>${editRates ? `$<input type="number" min="0" id="rate_${t}" value="${state.rates[t]}" style="width:60px">` : fmt$(state.rates[t])}/hr</td><td>${fmt$(b * state.rates[t])}</td><td>${fmt$(l * state.rates[t])}</td>` : ''}</tr>`;
  }).join('');
  const hours = `<div class="card" style="grid-column:1/-1"><h3>Hours & Pay Plan</h3>
    <table class="mini"><thead><tr><th>Trade</th><th>Budget hrs</th><th>Logged hrs</th><th>Progress</th>${canSeeCost() ? '<th>Pay rate</th><th>Labor budget</th><th>Labor actual</th>' : ''}</tr></thead>
    <tbody>${hoursRows}<tr><th>Total</th><th>${hb}</th><th>${hl}</th><th>${hb ? Math.round(hl / hb * 100) : 0}%</th>
      ${canSeeCost() ? `<th></th><th>${fmt$(TRADES.reduce((a, t) => a + p.hoursBudget[t] * state.rates[t], 0))}</th><th>${fmt$(TRADES.reduce((a, t) => a + p.hoursLogged[t] * state.rates[t], 0))}</th>` : ''}</tr></tbody></table>
    <div class="actions">${editHours ? `<button class="btn primary small" onclick="saveHoursPlan('${p.no}')">Save plan</button>` : ''}
      ${canLogHours() ? `<button class="btn ghost small" onclick="openLogHours('${p.no}')">+ Log hours</button>` : ''}</div></div>`;
  const teamCard = `<div class="card"><h3>Team & Project Access</h3>
    <p class="hint">People ticked here can open this project (without cost data). Admins see every project.</p>
    ${state.users.filter(u => u.role !== 'Admin').map(u => `<label class="check"><input type="checkbox" ${u.projects.includes(p.no) ? 'checked' : ''} ${isAdmin() ? '' : 'disabled'} onchange="toggleAccess('${u.id}','${p.no}',this.checked)"> <span><b>${esc(u.name)}</b> — ${u.role}</span></label>`).join('')}
    ${!isAdmin() ? `<p class="hint">Assigned: ${team.map(u => esc(u.name)).join(', ')}</p>` : ''}</div>`;
  $('#tabBody').innerHTML = `<div class="cards">${overview}${fin}${hours}${teamCard}</div>`;
}
function saveHoursPlan(no) {
  const p = state.projects.find(x => x.no === no);
  TRADES.forEach(t => {
    const hb = document.getElementById('hb_' + t); if (hb) p.hoursBudget[t] = Math.max(0, Number(hb.value) || 0);
    const r = document.getElementById('rate_' + t); if (r && isAdmin()) state.rates[t] = Math.max(0, Number(r.value) || 0);
  });
  log(no, 'Updated hours & pay plan'); save(); toast('Hours plan saved'); rerender();
}
function openLogHours(no) {
  openModal('Log hours', `<div class="form"><label>Trade</label><select id="lhTrade">${TRADES.map(t => `<option>${t}</option>`).join('')}</select>
    <label>Hours</label><input id="lhHours" type="number" min="0.5" step="0.5" value="4"><label>Note</label><input id="lhNote" placeholder="e.g. Drafted 101.00 elevations"></div>`,
    `<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="logHours('${no}')">Log</button>`);
}
function logHours(no) {
  const p = state.projects.find(x => x.no === no); const t = $('#lhTrade').value; const h = Number($('#lhHours').value) || 0;
  if (h <= 0) return toast('Enter hours');
  p.hoursLogged[t] += h; log(no, `Logged ${h}h ${t}${$('#lhNote').value ? ' — ' + $('#lhNote').value : ''}`); save(); closeModal(); toast('Hours logged'); rerender();
}
function toggleAccess(uidv, no, on) {
  if (!isAdmin()) return;
  const u = state.users.find(x => x.id === uidv);
  u.projects = on ? [...new Set([...u.projects, no])] : u.projects.filter(x => x !== no);
  log(no, `${on ? 'Granted' : 'Removed'} project access: ${u.name}`); save(); toast(`${u.name} ${on ? 'can now' : 'can no longer'} access ${no}`);
}

/* ---------- WORK ORDERS ---------- */
function renderWorkOrders(p, ch) {
  const rows = ch.workOrders.map(w => {
    const dwgs = ch.shop.filter(s => s.woId === w.id);
    return `<tr><td><b>${w.no}</b></td><td>${esc(w.name)}</td>
      <td>${canManage() ? `<select onchange="setWoStatus('${p.no}','${w.id}',this.value)">${WO_STATUSES.map(s => `<option ${s === w.status ? 'selected' : ''}>${s}</option>`).join('')}</select>` : `<span class="badge b-blue">${w.status}</span>`}</td>
      <td>${dwgs.map(d => `<a href="#/project/${p.no}/shop/${d.id}">${d.number}</a>`).join(', ') || '—'}</td>
      <td class="num">${w.budgetHours}</td><td class="num">${w.actualHours}</td><td>${fmtDate(w.shipDate)}</td>
      ${canSeeCost() ? `<td class="num">${fmt$(w.value)}</td>` : ''}</tr>`;
  }).join('');
  $('#tabBody').innerHTML = `${canManage() ? `<div class="actions"><button class="btn orange" onclick="openAddWo('${p.no}')">+ New Work Order</button></div>` : ''}
    <div class="table-wrap"><table class="grid"><thead><tr><th>Work Order</th><th>Name</th><th>Status</th><th>Linked Shop Drawings</th><th class="num">Budget hrs</th><th class="num">Actual hrs</th><th>Ship Date</th>${canSeeCost() ? '<th class="num">Value</th>' : ''}</tr></thead>
    <tbody>${rows}</tbody>${canSeeCost() ? `<tfoot><tr><td colspan="7">Total</td><td class="num">${fmt$(ch.workOrders.reduce((a, w) => a + w.value, 0))}</td></tr></tfoot>` : ''}</table></div>
    <p class="hint">A Work Order is released to the shop only after its linked shop drawings are approved through QC and Submittals.</p>`;
}
function setWoStatus(no, id, s) { const w = state.children[no].workOrders.find(x => x.id === id); log(no, `${w.no} status: ${w.status} → ${s}`); w.status = s; save(); toast('Work order updated'); }
function openAddWo(no, fromStudy) {
  const st = fromStudy ? state.children[no].studies.find(s => s.id === fromStudy) : null;
  openModal('New Work Order', `<div class="form"><label>Name</label><input id="woName" value="${st ? esc(st.title.replace(/ study$/i, '')) : ''}">
    <div class="row"><div><label>Budget hours</label><input id="woHours" type="number" value="120"></div><div><label>Ship date</label><input id="woShip" type="date" value="${isoAdd(todayIso(), 45)}"></div></div>
    ${canSeeCost() ? '<label>Value ($)</label><input id="woValue" type="number" value="25000">' : ''}</div>`,
    `<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="addWo('${no}','${fromStudy || ''}')">Create</button>`);
}
function addWo(no, fromStudy) {
  const ch = state.children[no]; const name = $('#woName').value.trim(); if (!name) return toast('Name required');
  const w = { id: uid(), no: `${no}-${String(11 + ch.workOrders.length * 7).padStart(3, '0')}p`, name, status: 'Draft', value: canSeeCost() ? Number($('#woValue').value) || 0 : 0, budgetHours: Number($('#woHours').value) || 0, actualHours: 0, shipDate: $('#woShip').value };
  ch.workOrders.push(w);
  if (fromStudy) { const s = ch.studies.find(x => x.id === fromStudy); s.convertedWo = w.no; s.status = 'Converted'; }
  log(no, `Created Work Order ${w.no} — ${name}`); save(); closeModal(); toast('Work order created');
  location.hash = `#/project/${no}/workorders`; rerender();
}

/* ---------- STUDY PROJECTS ---------- */
function renderStudies(p, ch) {
  $('#tabBody').innerHTML = `${canEditDocs() ? `<div class="actions"><button class="btn orange" onclick="openAddStudy('${p.no}')">+ New Study</button></div>` : ''}
    <div class="table-wrap"><table class="grid"><thead><tr><th>Study</th><th>Title</th><th>Engineer</th><th>Status</th><th class="num">Budget hrs</th><th class="num">Logged hrs</th><th>Work Order</th><th></th></tr></thead><tbody>
    ${ch.studies.map(s => `<tr><td><b>${s.no}</b></td><td>${esc(s.title)}</td><td>${esc(s.engineer)}</td><td><span class="badge ${s.status === 'Converted' ? 'b-green' : s.status === 'Complete' ? 'b-blue' : 'b-amber'}">${s.status}</span></td>
      <td class="num">${s.budgetHours}</td><td class="num">${s.loggedHours}</td><td>${s.convertedWo || '—'}</td>
      <td>${!s.convertedWo && canManage() ? `<button class="btn small primary" onclick="openAddWo('${p.no}','${s.id}')">Convert to Work Order</button>` : ''}</td></tr>`).join('')}
    </tbody></table></div><p class="hint">Study Projects hold pre-production engineering research (feasibility, mockups, value engineering). Once proven, convert them into a Work Order.</p>`;
}
function openAddStudy(no) {
  openModal('New Study Project', `<div class="form"><label>Title</label><input id="stTitle" placeholder="e.g. Acoustic wood ceiling mockup study">
    <div class="row"><div><label>Engineer</label><input id="stEng" value="${esc(me().name)}"></div><div><label>Budget hours</label><input id="stHours" type="number" value="16"></div></div></div>`,
    `<button class="btn ghost" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="addStudy('${no}')">Create</button>`);
}
function addStudy(no) {
  const ch = state.children[no]; const title = $('#stTitle').value.trim(); if (!title) return toast('Title required');
  ch.studies.push({ id: uid(), no: 'ST-' + String(ch.studies.length + 1).padStart(2, '0'), title, engineer: $('#stEng').value, status: 'In Progress', budgetHours: Number($('#stHours').value) || 0, loggedHours: 0, convertedWo: '' });
  log(no, `Created study: ${title}`); save(); closeModal(); rerender();
}

/* ---------- ACTIVITY ---------- */
function renderActivity(p, ch) {
  $('#tabBody').innerHTML = `<div class="panel activity">${ch.activity.map(a => `<div><div class="t">${a.t} · ${esc(a.user)}</div>${esc(a.text)}</div>`).join('') || 'No activity yet.'}</div>`;
}

