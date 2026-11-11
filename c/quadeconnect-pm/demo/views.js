'use strict';
/* =====================================================================
   QuadeConnect PM — views.js
   Router + Master Projects views: Grid (Innergy style), Kanban, Gantt
   ===================================================================== */

const ui = { grid: { q: {}, sort: { k: 'no', dir: -1 }, group: '', page: 1, size: 25 }, docId: null, viewVer: 0, slide: 0, zoom: 1, compare: false, fileCat: 'All', docSearch: '' };

/* ---------- Router ---------- */
function route() {
  const h = location.hash.replace(/^#\/?/, '') || 'projects/grid';
  const parts = h.split('/');
  closeModal();
  if (parts[0] === 'project' && parts[1]) return renderProject(decodeURIComponent(parts[1]), parts[2] || 'details', parts[3]);
  return renderProjects(parts[1] || 'grid');
}

function initRoleSelect() {
  $('#roleSelect').innerHTML = state.users.map(u => `<option value="${u.id}" ${u.id === state.currentUser ? 'selected' : ''}>${esc(u.name)} — ${u.role}</option>`).join('');
}

/* ---------- Projects list page ---------- */
function renderProjects(view) {
  const label = { grid: 'Grid', kanban: 'Kanban', gantt: 'Gantt' }[view] || 'Grid';
  const banner = isAdmin()
    ? `<div class="role-banner"><b>Admin view:</b> all ${state.projects.length} projects with full contract, billing and cost columns.</div>`
    : `<div class="role-banner restricted"><b>${role()} view (${esc(me().name)}):</b> you only see the ${visibleProjects().length} project(s) you are assigned to. Contract values, billing and costs are hidden.</div>`;
  $('#view').innerHTML = `
    <div class="crumb"><span class="chev">›</span> <a href="#/projects/grid">Projects</a> › ${label}</div>
    <div class="page-head"><h1>Projects</h1>
      <div class="view-switch">
        <button class="${view === 'grid' ? 'active' : ''}" onclick="location.hash='#/projects/grid'">▦ Grid</button>
        <button class="${view === 'kanban' ? 'active' : ''}" onclick="location.hash='#/projects/kanban'">▥ Kanban</button>
        <button class="${view === 'gantt' ? 'active' : ''}" onclick="location.hash='#/projects/gantt'">▤ Gantt</button>
      </div></div>
    ${banner}
    <div id="pview"></div>`;
  if (view === 'kanban') renderKanban(); else if (view === 'gantt') renderGantt(); else renderGrid();
}

/* ---------- GRID ---------- */
function gridColumns() {
  const c = [{ k: 'no', l: 'Proj No.', t: 'link' }, { k: 'name', l: 'Name', t: 'link' }, { k: 'customer', l: 'Customer' }];
  if (canSeeCost()) c.push(
    { k: 'origContract', l: 'Original Total Contract', t: '$' }, { k: 'currentContract', l: 'Current Contract Value', t: '$' },
    { k: 'woValue', l: 'Work Orders Value', t: '$' }, { k: 'billed', l: 'Billed', t: '$' }, { k: 'billedPct', l: 'Billed %', t: '%' },
    { k: 'estCost', l: 'Estimated Grand Total Cost', t: '$' });
  c.push({ k: 'stage', l: 'Stage', t: 'stage' }, { k: 'pm', l: 'PM' }, { k: 'priority', l: 'Priority', t: 'prio' },
    { k: 'due', l: 'Target Date', t: 'date' }, { k: 'hoursPct', l: 'Hours Used', t: 'hrs' });
  return c;
}
function rowData(p) {
  const s = sanitize(p); const hb = sum(p.hoursBudget), hl = sum(p.hoursLogged);
  const r = { ...s, hb, hl, hoursPct: hb ? hl / hb * 100 : 0 };
  if (canSeeCost()) r.billedPct = p.currentContract ? p.billed / p.currentContract * 100 : 0;
  return r;
}
function renderGrid() {
  const cols = gridColumns(); const g = ui.grid;
  $('#pview').innerHTML = `
    <div class="panel">
      <div class="toolbar">
        <span class="hint">Group by</span>
        <select onchange="ui.grid.group=this.value;renderGridBody()">
          ${[['', 'None'], ['customer', 'Customer'], ['stage', 'Stage'], ['pm', 'Project Manager'], ['priority', 'Priority']].map(([v, l]) => `<option value="${v}" ${g.group === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
        <span class="spacer"></span>
        <button class="btn ghost small" onclick="clearFilters()">Clear filters</button>
        <button class="btn ghost small" onclick="exportCsv()">⤓ Export CSV</button>
      </div>
      <div class="table-wrap"><table class="grid">
        <thead><tr>${cols.map(c => `<th class="${['$', '%', 'hrs'].includes(c.t) ? 'num' : ''}" onclick="sortBy('${c.k}')">${c.l} ${g.sort.k === c.k ? (g.sort.dir > 0 ? '▲' : '▼') : ''}</th>`).join('')}</tr>
          <tr class="filters">${cols.map(c => `<td><input placeholder="🔍" value="${esc(g.q[c.k] || '')}" oninput="ui.grid.q['${c.k}']=this.value;ui.grid.page=1;renderGridBody()"></td>`).join('')}</tr></thead>
        <tbody id="gridBody"></tbody><tfoot id="gridFoot"></tfoot>
      </table></div>
      <div class="pager" id="gridPager"></div>
    </div>`;
  renderGridBody();
}
function filteredRows() {
  const cols = gridColumns(); const g = ui.grid;
  let rows = visibleProjects().map(rowData);
  cols.forEach(c => {
    const q = (g.q[c.k] || '').toLowerCase().trim();
    if (q) rows = rows.filter(r => String(c.t === 'date' ? fmtDate(r[c.k]) : r[c.k] ?? '').toLowerCase().includes(q));
  });
  const k = g.sort.k, d = g.sort.dir;
  rows.sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * d);
  return rows;
}
function cellHTML(c, r) {
  const v = r[c.k];
  switch (c.t) {
    case 'link': return `<a href="#/project/${encodeURIComponent(r.no)}/details">${esc(v)}</a>`;
    case '$': return fmt$(v);
    case '%': return fmtPct(v);
    case 'date': return fmtDate(v);
    case 'stage': return `<span class="badge" style="background:${STAGE_COLORS[v]}22;color:${STAGE_COLORS[v]}">${esc(v)}</span>`;
    case 'prio': return `<span class="prio ${v}">⚑ ${v}</span>`;
    case 'hrs': return `<div style="display:flex;gap:6px;align-items:center;justify-content:flex-end"><span>${r.hl}/${r.hb}h</span><div class="bar"><span class="${v > 100 ? 'over' : ''}" style="width:${Math.min(100, v)}%"></span></div></div>`;
    default: return esc(v);
  }
}
function renderGridBody() {
  const cols = gridColumns(); const g = ui.grid; const rows = filteredRows();
  const rowHTML = r => `<tr>${cols.map(c => `<td class="${['$', '%', 'hrs'].includes(c.t) ? 'num' : ''}">${cellHTML(c, r)}</td>`).join('')}</tr>`;
  let body = '';
  if (g.group) {
    const groups = {}; rows.forEach(r => (groups[r[g.group]] = groups[r[g.group]] || []).push(r));
    Object.keys(groups).sort().forEach(k => {
      body += `<tr class="group"><td colspan="${cols.length}">${esc(k)} (${groups[k].length})</td></tr>` + groups[k].map(rowHTML).join('');
    });
    $('#gridPager').innerHTML = `<span>${rows.length} items</span>`;
  } else {
    const pages = Math.max(1, Math.ceil(rows.length / g.size)); g.page = Math.min(g.page, pages);
    body = rows.slice((g.page - 1) * g.size, g.page * g.size).map(rowHTML).join('');
    $('#gridPager').innerHTML = [25, 50, 100, 500].map(s => `<a class="${g.size === s ? 'active' : ''}" onclick="ui.grid.size=${s};ui.grid.page=1;renderGridBody()">${s}</a>`).join(' ')
      + `<span style="margin-left:auto">${rows.length ? (g.page - 1) * g.size + 1 : 0} - ${Math.min(rows.length, g.page * g.size)} of ${rows.length} items</span>`
      + Array.from({ length: pages }, (_, i) => `<a class="${g.page === i + 1 ? 'active' : ''}" onclick="ui.grid.page=${i + 1};renderGridBody()">${i + 1}</a>`).join(' ');
  }
  $('#gridBody').innerHTML = body || `<tr><td colspan="${cols.length}" style="text-align:center;color:#6b7280;padding:20px">No projects match.</td></tr>`;
  // Footer totals (portfolio sums) — only meaningful for currency columns => Admin only
  $('#gridFoot').innerHTML = canSeeCost()
    ? `<tr>${cols.map(c => `<td class="num">${c.t === '$' ? fmt$(rows.reduce((a, r) => a + Number(r[c.k] || 0), 0)) : ''}</td>`).join('')}</tr>` : '';
}
function sortBy(k) { const s = ui.grid.sort; s.dir = s.k === k ? -s.dir : 1; s.k = k; renderGrid(); }
function clearFilters() { ui.grid.q = {}; ui.grid.group = ''; renderGrid(); }
function exportCsv() {
  const cols = gridColumns(); const rows = filteredRows();
  const csv = [cols.map(c => `"${c.l}"`).join(',')].concat(rows.map(r => cols.map(c => `"${String(r[c.k] ?? '').replace(/"/g, '""')}"`).join(','))).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'projects.csv'; a.click();
}

/* ---------- KANBAN ---------- */
function renderKanban() {
  const ps = visibleProjects(); const drag = canMoveStage();
  $('#pview').innerHTML = `<div class="hint" style="margin-bottom:8px">${drag ? 'Drag cards between columns to move a project to the next millwork stage.' : 'Read-only: only Admin / Operations Head can move project stages.'}</div>
  <div class="kanban">${STAGES.map(st => {
    const cards = ps.filter(p => p.stage === st);
    return `<div class="kcol" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="dropStage(event,'${st}')">
      <div class="khead" style="border-top-color:${STAGE_COLORS[st]}">${st}<span class="count">${cards.length}</span></div>
      ${cards.map(p => kanbanCard(p, drag)).join('')}</div>`;
  }).join('')}</div>`;
}
function canMoveStage() { return canManage(); }
function kanbanCard(p, drag) {
  const ch = state.children[p.no]; const hb = sum(p.hoursBudget), hl = sum(p.hoursLogged); const pct = hb ? hl / hb * 100 : 0;
  const pendingQc = ch.shop.filter(s => s.qcStatus === 'Pending QC').length;
  return `<div class="kcard" ${drag ? 'draggable="true"' : ''} ondragstart="event.dataTransfer.setData('text','${p.no}')" onclick="location.hash='#/project/${p.no}/details'">
    <div class="kno">${p.no}</div><div class="kname">${esc(p.name)}</div><div class="kcust">${esc(p.customer)}</div>
    <div class="kmeta"><span class="badge b-gray">${ch.sheets.length} Sheets</span><span class="badge b-gray">${ch.shop.length} Shop Dwgs</span>
      <span class="badge b-gray">${ch.workOrders.length} WOs</span>${pendingQc ? `<span class="badge b-purple">${pendingQc} QC</span>` : ''}</div>
    <div class="kfoot"><span class="prio ${p.priority}">⚑ ${p.priority}</span><span>${esc(p.pm)}</span></div>
    <div class="kfoot"><div class="bar" style="flex:1;margin-right:6px"><span class="${pct > 100 ? 'over' : ''}" style="width:${Math.min(100, pct)}%"></span></div><span>${Math.round(pct)}% hrs</span></div>
    ${canSeeCost() ? `<div class="kfoot"><span class="hint">Contract</span><b>${fmt$(p.currentContract)}</b></div>` : ''}
  </div>`;
}
function dropStage(ev, stage) {
  ev.preventDefault();
  if (!canMoveStage()) return toast('You do not have permission to move stages');
  const no = ev.dataTransfer.getData('text'); const p = state.projects.find(x => x.no === no);
  if (!p || p.stage === stage) return renderKanban();
  log(no, `Moved project stage: ${p.stage} → ${stage}`); p.stage = stage; save(); renderKanban(); toast(`${no} moved to ${stage}`);
}

/* ---------- GANTT ---------- */
function renderGantt() {
  const ps = [...visibleProjects()].sort((a, b) => a.start.localeCompare(b.start));
  if (!ps.length) { $('#pview').innerHTML = '<div class="panel">No projects.</div>'; return; }
  const min = new Date(ps.reduce((m, p) => p.start < m ? p.start : m, ps[0].start) + 'T00:00:00'); min.setDate(1);
  const maxIso = ps.reduce((m, p) => p.due > m ? p.due : m, ps[0].due);
  const max = new Date(maxIso + 'T00:00:00'); max.setMonth(max.getMonth() + 1, 1);
  const span = max - min; const months = [];
  for (let d = new Date(min); d < max; d.setMonth(d.getMonth() + 1)) months.push(d.toLocaleString('en-US', { month: 'short', year: '2-digit' }));
  const pos = iso => ((new Date(iso + 'T00:00:00') - min) / span * 100);
  const today = pos(todayIso());
  $('#pview').innerHTML = `<div class="gantt">
    <div class="grow"><div class="glabel"><b>Project</b></div><div class="gmonths">${months.map(m => `<div>${m}</div>`).join('')}</div></div>
    ${ps.map(p => `<div class="grow"><div class="glabel"><a href="#/project/${p.no}/details">${p.no}</a> ${esc(p.name)}</div>
      <div class="gtrack">${today >= 0 && today <= 100 ? `<div class="gtoday" style="left:${today}%"></div>` : ''}
        <div class="gbar" title="${fmtDate(p.start)} → ${fmtDate(p.due)}" style="left:${pos(p.start)}%;width:${Math.max(2, pos(p.due) - pos(p.start))}%;background:${STAGE_COLORS[p.stage]}">${p.stage}</div></div></div>`).join('')}
  </div><div class="hint" style="margin-top:6px">Bars run from project start to target completion; colour = current millwork stage; orange line = today.</div>`;
}

/* ---------- Modal helpers ---------- */
function openModal(title, body, foot, wide) {
  $('#modal').innerHTML = `<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal ${wide ? 'wide' : ''}">
    <div class="mhead"><span>${title}</span><button onclick="closeModal()">×</button></div>
    <div class="mbody">${body}</div><div class="mfoot">${foot || '<button class="btn ghost" onclick="closeModal()">Close</button>'}</div></div></div>`;
}
function closeModal() { const m = $('#modal'); if (m) m.innerHTML = ''; }

/* ---------- Boot ---------- */
window.addEventListener('DOMContentLoaded', () => {
  if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  load(); initRoleSelect();
  $('#roleSelect').addEventListener('change', e => { state.currentUser = e.target.value; save(); ui.docId = null; toast(`Now viewing as ${me().name} (${role()})`); location.hash = '#/projects/grid'; route(); });
  $('#globalSearch').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return; ui.grid.q = { name: e.target.value }; location.hash = '#/projects/grid'; route();
  });
  window.addEventListener('hashchange', route);
  route();
});

