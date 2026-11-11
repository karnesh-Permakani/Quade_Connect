'use strict';
/* =====================================================================
   QuadeConnect PM — data.js
   Seed data (mirrors the Innergy reference screens), constants, state,
   persistence and Role-Based Access Control helpers.
   ===================================================================== */

const STORE_KEY = 'quadeconnect_pm_demo_v1';
const STAGES = ['Study / Pre-Bid', 'Engineering', 'QC Review', 'Submittal', 'Fabrication', 'Installation', 'Closeout'];
const STAGE_COLORS = {
  'Study / Pre-Bid': '#0d9488', 'Engineering': '#2563eb', 'QC Review': '#7c3aed', 'Submittal': '#d97706',
  'Fabrication': '#ea580c', 'Installation': '#16a34a', 'Closeout': '#475569'
};
const TRADES = ['Engineering', 'Fabrication', 'Finishing', 'Installation'];
const WO_STATUSES = ['Draft', 'Engineering', 'Approved', 'Released to Fab', 'In Production', 'Shipped', 'Installed', 'Closed'];
const FILE_CATS = ['Contracts', 'Specifications', 'Cut Sheets', 'Client Uploads', 'Photos', 'Shared with Client'];
const CLIENT_FILE_CATS = ['Client Uploads', 'Shared with Client'];
const QC_CHECKLIST = [
  'Dimensions match architectural sheets & field verification',
  'Material / substrate callouts correct',
  'Veneer species, cut & grain direction indicated',
  'Edge banding specified on all exposed edges',
  'Hardware matches hardware schedule',
  'Joinery & assembly details complete',
  'Wall blocking / mounting method shown',
  'ADA clearances & heights verified',
  'Fire rating requirements met',
  'Title block, revision & Work Order reference complete'
];

/* ---------- small helpers ---------- */
let _seed = 7;
const rnd = () => { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; };
const pick = a => a[Math.floor(rnd() * a.length)];
const uid = () => Math.random().toString(36).slice(2, 10);
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt$ = n => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = n => (Number(n || 0)).toFixed(n && n % 1 ? 2 : 0) + '%';
const sum = o => Object.values(o || {}).reduce((a, b) => a + Number(b || 0), 0);
const isoAdd = (iso, days) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
const fmtDate = iso => { if (!iso) return ''; const [y, m, d] = iso.split('-'); return `${m}/${d}/${y}`; };
const todayIso = () => new Date().toISOString().slice(0, 10);
const nowStr = () => new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* ---------- Seed ---------- */
function buildSeed() {
  _seed = 7;
  // [no, name, customer, originalContract, currentContract, workOrdersValue, billed, estGrandTotalCost]  (from reference Image 1)
  const base = [
    [1137, 'BWI Project Oasis (Baltimore)', 'Whiting Turner - DC - Washington', 6573906, 8838759, 0, 0, 6278759],
    [1136, '[26019N] Omni Midland Hotel', 'Beck Group - Dallas', 4006216, 4229775, 4229775.01, 0, 3123304],
    [1135, '[26022R] BNA Project Oasis (Nashville)', 'Hensel Phelps - Nashville', 7180842, 9563814, 9563814, 0, 7303613],
    [1134, '[26020R] NXP Champion', 'Novo Construction - Austin', 2319437, 2242008, 2242008, 23511.60, 2045904],
    [1133, '[26018R] Samsung Observation Deck', 'Austin Commercial LP - Dallas', 7700, 7700, 7700, 7700, 6180],
    [1132, '[26011R] AUS Project Oasis (Austin)', 'Hensel Phelps - Austin', 363375, 5114150, 5114150.01, 347137.50, 3812367],
    [1131, '[26016N] Hotel Vin Reserve', 'Manhattan Construction - Dallas', 2532552, 1793137, 1793137, 0, 1270391],
    [1130, '[26017N] 600G Ice Machine Panels', 'Kairoi Residential - Austin', 2201, 2201, 2201, 1100.50, 1430],
    [1129, '[26014R] Sunnyvale Millwork - Panel Fix', 'Sunnyvale Millwork - Main', 49928.21, 77337, 77337, 77337, 55379],
    [1128, '[26015X] Trinity School of Midland', 'W.S. Bellows Construction Corp. - Houston', 2728885, 2630575, 2630575, 0, 1955468],
    [1127, '[26010N] Loews Arlington III', 'JE Dunn - Dallas', 5981351, 8367667, 8367667, 0, 6298853]
  ];
  const stages = ['Engineering', 'Study / Pre-Bid', 'Fabrication', 'Submittal', 'Closeout', 'Engineering', 'QC Review', 'Fabrication', 'Closeout', 'Installation', 'Installation'];
  const pms = ['Rob Redmond', 'Christopher Holland', 'Ariana Samarripa', 'Marcus Reed'];

  const projects = base.map((b, i) => {
    const hb = { Engineering: 300 + Math.round(rnd() * 500), Fabrication: 900 + Math.round(rnd() * 1500), Finishing: 200 + Math.round(rnd() * 400), Installation: 300 + Math.round(rnd() * 600) };
    const done = { 'Study / Pre-Bid': .05, 'Engineering': .3, 'QC Review': .4, 'Submittal': .45, 'Fabrication': .65, 'Installation': .85, 'Closeout': 1 }[stages[i]];
    const hl = {}; TRADES.forEach((t, ti) => hl[t] = Math.round(hb[t] * Math.min(1.1, done * (ti === 0 ? 1.4 : ti === 3 ? 0.7 : 1) * (0.8 + rnd() * 0.4))));
    return {
      no: 'P-26-' + b[0], name: b[1], customer: b[2],
      origContract: b[3], currentContract: b[4], woValue: b[5], billed: b[6], estCost: b[7],
      stage: stages[i], pm: pms[i % 4], priority: pick(['Critical', 'High', 'Normal', 'Normal', 'Low']),
      start: isoAdd('2026-05-04', i * 12), due: isoAdd('2026-11-30', 40 - i * 9 + Math.round(rnd() * 90)),
      location: b[2].split(' - ').pop(), architect: pick(['PGAL', 'Gensler', 'HKS Architects', 'Page Southerland Page']),
      awiGrade: pick(['Premium', 'Custom']), veneer: pick(['Rift White Oak', 'Plain Sliced Walnut', 'Quarter Sawn Maple', 'HPL / Solid Surface']),
      hoursBudget: hb, hoursLogged: hl
    };
  });

  const users = [
    { id: 'u1', name: 'Sarah Mitchell', role: 'Admin', projects: [] },
    { id: 'u2', name: 'Marcus Reed', role: 'Operations Head', projects: ['P-26-1132', 'P-26-1137', 'P-26-1135'] },
    { id: 'u3', name: 'Christopher Holland', role: 'Engineer', projects: ['P-26-1132', 'P-26-1137'] },
    { id: 'u4', name: 'Ariana Samarripa', role: 'QC Reviewer', projects: ['P-26-1132', 'P-26-1136'] },
    { id: 'u5', name: 'Hensel Phelps (Client)', role: 'Client', projects: ['P-26-1132'] }
  ];

  const children = {};
  projects.forEach(p => children[p.no] = genChildren(p));
  return { version: 1, currentUser: 'u1', rates: { Engineering: 65, Fabrication: 45, Finishing: 48, Installation: 55 }, users, projects, children };
}

function genChildren(p) {
  const n = p.no;
  const woNames = ['Table of Contents / General', 'Restroom Mockup Vanities', '102.5 Bar Counter', 'Lobby Reception Desk', 'Lobby Wall Panels'];
  const workOrders = woNames.map((nm, i) => ({
    id: uid(), no: `${n}-${String(11 + i * 7).padStart(3, '0')}p`, name: nm,
    status: pick(WO_STATUSES.slice(0, 6)), value: Math.round((p.woValue || p.currentContract) / 5 * (0.6 + rnd() * 0.8)),
    budgetHours: 80 + Math.round(rnd() * 300), actualHours: Math.round(rnd() * 250), shipDate: isoAdd(p.start, 60 + i * 20)
  }));

  const sheetT = [['G0.00', 'COVER SHEET'], ['G0.01', 'SHEET INDEX'], ['G0.02', 'PROJECT INFORMATION'], ['G0.10', 'ADA STANDARDS'],
    ['G0.20', 'RESPONSIBILITY MATRIX'], ['G1.01', 'LIFE SAFETY CODE ANALYSIS'], ['A2.01', 'FLOOR PLAN - LEVEL 1'], ['A5.10', 'INTERIOR ELEVATIONS'], ['A8.01', 'MILLWORK DETAILS']];
  const sheets = sheetT.map(([num, name], i) => {
    const versions = [{ id: uid(), name: '90 IFP', issue: '2026-07-31', pages: 1 + Math.floor(rnd() * 5), by: 'Rob Redmond', uploaded: '08/11/2026 08:16 AM' }];
    if (rnd() < 0.4) versions.push({ id: uid(), name: 'Bulletin 01', issue: '2026-08-31', pages: 1 + Math.floor(rnd() * 5), by: 'Rob Redmond', uploaded: '09/03/2026 06:31 AM' });
    return { id: uid(), number: num, name, versions, current: versions.length - 1, tags: i < 6 ? ['General'] : ['Millwork Scope'], published: rnd() < 0.8, markups: rnd() < 0.2 };
  });

  const shopT = [['100.10', 'TABLE OF CONTENTS', 0], ['101.00', 'RESTROOM MOCKUP', 1], ['101.01', 'RESTROOM MOCKUP', 1], ['101.02', 'RESTROOM MOCKUP', 1],
    ['102.49', '102.5 BAR COUNTER', 2], ['102.50', '102.5 BAR COUNTER', 2], ['201.00', 'RECEPTION DESK', 3], ['301.00', 'WALL PANELS - LOBBY', 4]];
  const shop = shopT.map(([num, name, wo]) => {
    const count = 1 + Math.floor(rnd() * 3);
    const versions = [];
    for (let k = 1; k <= count; k++) versions.push({ id: uid(), name: `MOCKUP PACKAGE # ${k}`, issue: isoAdd('2026-08-18', k * 10), pages: 1 + Math.floor(rnd() * 9), by: pick(['Christopher Holland', 'Ariana Samarripa']), uploaded: fmtDate(isoAdd('2026-08-18', k * 10)) + ' 03:31 PM' });
    const qc = pick(['Pending QC', 'QC Approved', 'QC Approved', 'Rejected']);
    return { id: uid(), number: num, name, woId: workOrders[wo].id, versions, current: versions.length - 1, tags: ['Mockup'], qcStatus: qc, qcHistory: [], published: qc === 'QC Approved' && rnd() < 0.8, markups: false };
  });

  const files = [
    ['Signed Subcontract Agreement.pdf', 'Contracts', '1.2 MB'], ['Spec Section 06 41 00 - Architectural Casework.pdf', 'Specifications', '840 KB'],
    ['Blum Hinge Cutsheet.pdf', 'Cut Sheets', '410 KB'], ['Hardware Schedule Rev 2.xlsx', 'Specifications', '96 KB'],
    ['Architect Finish Selections.pdf', 'Client Uploads', '3.4 MB'], ['Site Photos - Level 1.zip', 'Photos', '48 MB'],
    ['Approved Veneer Sample Photo.jpg', 'Shared with Client', '2.1 MB']
  ].map(([name, cat, size]) => ({ id: uid(), name, cat, size, by: cat === 'Client Uploads' ? 'Client' : 'Rob Redmond', date: '09/0' + (1 + Math.floor(rnd() * 8)) + '/2026', key: `s3://quadeconnect-prod/projects/${n}/files/${slug(cat)}/${name}` }));

  const appr = shop.filter(s => s.qcStatus === 'QC Approved').map(s => s.id);
  const submittals = [
    { id: uid(), no: 'SUB-001', title: 'Restroom Mockup Shop Drawings', spec: '06 41 00 Architectural Wood Casework', rev: 0, status: 'Approved', ball: '—', drawings: appr.slice(0, 2), sent: '2026-09-10', due: '2026-09-24', history: [{ t: '09/18/2026', user: 'Architect', text: 'Approved' }] },
    { id: uid(), no: 'SUB-002', title: 'Bar Counter Shop Drawings & Finish Samples', spec: '06 41 00 Architectural Wood Casework', rev: 1, status: 'Submitted', ball: 'Client', drawings: appr.slice(2, 3), sent: '2026-10-01', due: '2026-10-15', history: [{ t: '09/20/2026', user: 'Architect', text: 'Revise & Resubmit — edge profile' }] },
    { id: uid(), no: 'SUB-003', title: 'Reception Desk Hardware Product Data', spec: '08 71 00 Door Hardware', rev: 0, status: 'Draft', ball: 'Engineering', drawings: [], sent: '', due: '', history: [] }
  ];

  const studies = [
    { id: uid(), no: 'ST-01', title: 'Curved reception desk framing study', engineer: 'Christopher Holland', status: 'In Progress', budgetHours: 24, loggedHours: 14, convertedWo: '' },
    { id: uid(), no: 'ST-02', title: 'Rift white oak veneer flitch yield study', engineer: 'Ariana Samarripa', status: 'Complete', budgetHours: 12, loggedHours: 12, convertedWo: '' }
  ];

  const activity = [
    { t: '10/05/2026 11:15 AM', user: 'Ariana Samarripa', text: 'Uploaded Shop Drawing 100.10 — MOCKUP PACKAGE # 5' },
    { t: '09/03/2026 06:31 AM', user: 'Rob Redmond', text: 'Uploaded Bulletin 01 sheets' },
    { t: '08/11/2026 08:16 AM', user: 'Rob Redmond', text: 'Uploaded and processed 90 IFP sheet set' }
  ];
  return { workOrders, studies, sheets, shop, files, submittals, activity };
}

/* ---------- State & persistence ---------- */
let state;
const memCache = {}; // in-memory blobs for uploaded files (simulates S3 objects for this browser session)
function load() {
  try { state = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { state = null; }
  if (!state || state.version !== 1) state = buildSeed();
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { toast('Storage full — changes kept for this session only'); }
}
function resetDemo() {
  if (!confirm('Reset all demo data?')) return;
  localStorage.removeItem(STORE_KEY); state = buildSeed(); save(); initRoleSelect(); location.hash = '#/projects/grid'; route();
}

/* ---------- RBAC (mirrors backend middleware — see backend/src/rbac.js) ---------- */
const COST_FIELDS = ['origContract', 'currentContract', 'woValue', 'billed', 'estCost'];
const me = () => state.users.find(u => u.id === state.currentUser);
const role = () => me().role;
const isAdmin = () => role() === 'Admin';
const isClient = () => role() === 'Client';
const canSeeCost = () => isAdmin();
const canEditDocs = () => ['Admin', 'Operations Head', 'Engineer'].includes(role());
const canManage = () => ['Admin', 'Operations Head'].includes(role());
const canQC = () => ['Admin', 'Operations Head', 'QC Reviewer'].includes(role());
const canLogHours = () => !isClient();
const visibleProjects = () => isAdmin() ? state.projects : state.projects.filter(p => me().projects.includes(p.no));
const canAccess = no => isAdmin() || me().projects.includes(no);
/** Strip cost fields exactly like the API serializer does for non-admin roles. */
function sanitize(p) {
  if (canSeeCost()) return p;
  const copy = { ...p }; COST_FIELDS.forEach(f => delete copy[f]); return copy;
}
function log(no, text) {
  state.children[no].activity.unshift({ t: nowStr(), user: me().name, text });
}
function toast(msg) {
  const d = document.createElement('div'); d.textContent = msg; $('#toast').appendChild(d); setTimeout(() => d.remove(), 3200);
}

