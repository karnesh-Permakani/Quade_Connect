import os

workspace_dir = r"c:\Users\MARIESWARI\Desktop\c"
demo_dir = os.path.join(workspace_dir, "quadeconnect-pm", "demo")

# 1. Read existing files
with open(os.path.join(demo_dir, "styles.css"), "r", encoding="utf-8") as f:
    css_content = f.read()

with open(os.path.join(demo_dir, "data.js"), "r", encoding="utf-8") as f:
    data_js = f.read()

with open(os.path.join(demo_dir, "views.js"), "r", encoding="utf-8") as f:
    views_js = f.read()

with open(os.path.join(demo_dir, "project.js"), "r", encoding="utf-8") as f:
    project_js = f.read()

with open(os.path.join(demo_dir, "app.js"), "r", encoding="utf-8") as f:
    app_js = f.read()

# 2. Comprehensive High-End Theme Engine (Obsidian Dark, Blueprint Slate, Clean Enterprise Light)
theme_css = """
/* ==================== QUADECONNECT ADVANCED THEME ENGINE ==================== */
:root, [data-theme="dark"] {
  --navy: #f8fafc;
  --navy-light: #cbd5e1;
  --blue: #38bdf8;
  --blue2: #38bdf8;
  --blue-hover: #7dd3fc;
  --link: #38bdf8;
  --orange: #f97316;
  --orange-dark: #ea580c;
  --border: #243247;
  --border-light: #1a2333;
  --bg: #090d16;
  --surface: #111827;
  --surface-alt: #162032;
  --surface-hover: #1e2c45;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --table-th-bg: #0d1424;
  --table-th-text: #94a3b8;
  --table-row-hover: #16243b;
  --kanban-col-bg: #0e1626;
  --green: #10b981;
  --green-bg: rgba(16, 185, 129, 0.2);
  --red: #ef4444;
  --red-bg: rgba(239, 68, 68, 0.2);
  --amber: #f59e0b;
  --amber-bg: rgba(245, 158, 11, 0.2);
  --purple: #a855f7;
  --purple-bg: rgba(168, 85, 247, 0.2);
  --pill: #172554;
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-sm: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 8px -1px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 10px 20px -3px rgba(0, 0, 0, 0.7);
}

[data-theme="blueprint"] {
  --navy: #e2f1ff;
  --navy-light: #93c5fd;
  --blue: #00e5ff;
  --blue2: #00b4d8;
  --blue-hover: #90e0ef;
  --link: #00e5ff;
  --orange: #ffb703;
  --orange-dark: #fb8500;
  --border: #1e3a5f;
  --border-light: #132a47;
  --bg: #071526;
  --surface: #0c213b;
  --surface-alt: #112d4e;
  --surface-hover: #193e6a;
  --text: #e2f1ff;
  --text-muted: #82a8cf;
  --table-th-bg: #081a30;
  --table-th-text: #82a8cf;
  --table-row-hover: #143760;
  --kanban-col-bg: #081a30;
  --green: #06d6a0;
  --green-bg: rgba(6, 214, 160, 0.2);
  --red: #ef476f;
  --red-bg: rgba(239, 71, 111, 0.2);
  --amber: #ffd166;
  --amber-bg: rgba(255, 209, 102, 0.2);
  --purple: #b5179e;
  --purple-bg: rgba(181, 23, 158, 0.2);
  --pill: #132a47;
}

[data-theme="light"] {
  --navy: #0f172a;
  --navy-light: #1e293b;
  --blue: #1d6fb8;
  --blue2: #2563eb;
  --blue-hover: #1d4ed8;
  --link: #2563eb;
  --orange: #f97316;
  --orange-dark: #ea580c;
  --border: #e2e8f0;
  --border-light: #f1f5f9;
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-alt: #f1f5f9;
  --surface-hover: #e2e8f0;
  --text: #0f172a;
  --text-muted: #64748b;
  --table-th-bg: #f8fafc;
  --table-th-text: #475569;
  --table-row-hover: #f8fbff;
  --kanban-col-bg: #f1f5f9;
  --green: #16a34a;
  --green-bg: #dcfce7;
  --red: #dc2626;
  --red-bg: #fee2e2;
  --amber: #d97706;
  --amber-bg: #fef3c7;
  --purple: #7c3aed;
  --purple-bg: #f3e8ff;
  --pill: #e0f2fe;
}

/* Base Body Application Overrides */
body {
  background: var(--bg) !important;
  color: var(--text) !important;
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Top Navigation Bar */
.topbar {
  background: var(--surface) !important;
  border-bottom: 1px solid var(--border) !important;
  backdrop-filter: blur(12px);
}
.brand .logo {
  box-shadow: 0 0 15px rgba(249, 115, 22, 0.4);
}
.brand .module {
  background: rgba(56, 189, 248, 0.15) !important;
  color: var(--blue) !important;
  border-color: rgba(56, 189, 248, 0.3) !important;
}
.topnav a {
  color: var(--text) !important;
}
.topnav a:hover {
  color: var(--blue) !important;
}
.global-search {
  background: var(--surface-alt) !important;
  border-color: var(--border) !important;
  color: var(--text) !important;
}
.global-search:focus {
  background: var(--surface) !important;
  border-color: var(--blue) !important;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25) !important;
}
.role-label {
  background: var(--surface-alt) !important;
  border-color: var(--border) !important;
  color: var(--text-muted) !important;
}
.role-label select {
  color: var(--text) !important;
  background: transparent !important;
}
.role-label select option {
  background: var(--surface) !important;
  color: var(--text) !important;
}

/* Theme Switcher Controls */
.theme-switch-group {
  display: flex;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 2px;
  gap: 2px;
}
.theme-switch-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.theme-switch-btn:hover {
  color: var(--text);
  background: var(--surface-hover);
}
.theme-switch-btn.active {
  background: var(--blue2);
  color: #ffffff;
  box-shadow: var(--shadow-xs);
}

/* Quick Jump Millwork Subbar */
.inn-subbar {
  background: var(--surface) !important;
  border-bottom: 1px solid var(--border) !important;
  padding: 8px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.inn-quicklinks {
  display: flex;
  align-items: center;
  gap: 8px;
}
.inn-btn-project {
  background: var(--surface-alt) !important;
  border: 1px solid var(--border) !important;
  color: var(--text) !important;
  padding: 5px 11px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.inn-btn-project:hover {
  background: var(--surface-hover) !important;
  border-color: var(--blue) !important;
  transform: translateY(-1px);
}
.inn-btn-project.active {
  background: var(--blue2) !important;
  color: #fff !important;
  border-color: var(--blue2) !important;
}

/* Tables & Grids */
.table-wrap {
  background: var(--surface) !important;
  border-color: var(--border) !important;
  box-shadow: var(--shadow-sm);
}
table.grid th {
  background: var(--table-th-bg) !important;
  color: var(--table-th-text) !important;
  border-bottom: 1px solid var(--border) !important;
  border-right: 1px solid var(--border-light) !important;
}
table.grid th:hover {
  background: var(--surface-hover) !important;
  color: var(--text) !important;
}
table.grid td {
  color: var(--text) !important;
  border-bottom: 1px solid var(--border-light) !important;
  border-right: 1px solid var(--border-light) !important;
}
table.grid tbody tr:hover td {
  background: var(--table-row-hover) !important;
}
table.grid tr.filters td {
  background: var(--surface) !important;
  border-bottom: 1px solid var(--border) !important;
}
table.grid tr.filters input {
  background: var(--surface-alt) !important;
  border-color: var(--border) !important;
  color: var(--text) !important;
}
table.grid tfoot td {
  background: var(--table-th-bg) !important;
  color: var(--navy) !important;
  border-top: 2px solid var(--border) !important;
}
table.grid tr.group td {
  background: var(--surface-alt) !important;
  color: var(--text) !important;
  border-color: var(--border) !important;
}

/* Panels & Cards */
.panel, .card {
  background: var(--surface) !important;
  border: 1px solid var(--border) !important;
  color: var(--text) !important;
  box-shadow: var(--shadow-sm);
}
.card h3 {
  color: var(--navy) !important;
  border-bottom: 1px solid var(--border-light) !important;
}
.page-head h1, .proj-head h1 {
  color: var(--navy) !important;
}

/* Tabs */
.tabs {
  border-bottom: 1px solid var(--border) !important;
}
.tabs a {
  color: var(--text-muted) !important;
}
.tabs a:hover {
  background: var(--surface-alt) !important;
  color: var(--text) !important;
}
.tabs a.active {
  color: var(--orange) !important;
  border-bottom-color: var(--orange) !important;
}
.tabs .cnt {
  background: var(--surface-alt) !important;
  color: var(--blue) !important;
  border: 1px solid var(--border) !important;
}

/* Kanban Board */
.kcol {
  background: var(--kanban-col-bg) !important;
  border-color: var(--border) !important;
}
.khead {
  color: var(--navy) !important;
}
.khead .count {
  background: var(--surface-alt) !important;
  color: var(--text) !important;
  border: 1px solid var(--border) !important;
}
.kcard {
  background: var(--surface) !important;
  border-color: var(--border) !important;
  box-shadow: var(--shadow-xs);
}
.kcard:hover {
  border-color: var(--blue) !important;
  background: var(--surface-alt) !important;
  box-shadow: var(--shadow-md);
}
.kcard .kname {
  color: var(--navy) !important;
}
.kcard .kcust {
  color: var(--text-muted) !important;
}

/* Gantt Chart */
.gantt {
  background: var(--surface) !important;
  border-color: var(--border) !important;
}
.grow {
  border-bottom: 1px solid var(--border-light) !important;
}
.glabel {
  border-right: 1px solid var(--border) !important;
  color: var(--text) !important;
}
.gmonths {
  background: var(--surface-alt) !important;
}
.gmonths div {
  border-left: 1px solid var(--border-light) !important;
  color: var(--text-muted) !important;
}

/* Document Viewer & Split-Pane */
.viewer {
  background: var(--surface) !important;
  border-color: var(--border) !important;
}
.rev {
  background: var(--surface-alt) !important;
  border-color: var(--border) !important;
  color: var(--text) !important;
}
.rev:hover {
  background: var(--surface-hover) !important;
  border-color: var(--border) !important;
}
.rev.viewing {
  border-color: var(--orange) !important;
  background: rgba(249, 115, 22, 0.15) !important;
}
.rev .rname {
  color: var(--navy) !important;
}
.vnav {
  background: var(--surface-alt) !important;
  border-color: var(--border) !important;
  color: var(--text) !important;
}
.docmeta label {
  color: var(--text-muted) !important;
}
.docmeta input, .docmeta select {
  background: var(--surface-alt) !important;
  border-color: var(--border) !important;
  color: var(--text) !important;
}

/* Modals & Popups */
.mcard {
  background: var(--surface) !important;
  border: 1px solid var(--border) !important;
  color: var(--text) !important;
  box-shadow: var(--shadow-lg);
}
.mhead {
  background: var(--surface) !important;
  border-bottom: 1px solid var(--border) !important;
}
.mhead h3 {
  color: var(--navy) !important;
}
.mhead button {
  color: var(--text-muted) !important;
}
.mhead button:hover {
  color: var(--text) !important;
}
.mbody {
  background: var(--surface) !important;
}
.mfoot {
  background: var(--surface-alt) !important;
  border-top: 1px solid var(--border) !important;
}
.form label {
  color: var(--text) !important;
}
.form input, .form select, .form textarea {
  background: var(--surface-alt) !important;
  border-color: var(--border) !important;
  color: var(--text) !important;
}
.form input:focus, .form select:focus, .form textarea:focus {
  background: var(--surface) !important;
  border-color: var(--blue) !important;
}

/* Buttons */
.btn.ghost {
  background: var(--surface-alt) !important;
  border-color: var(--border) !important;
  color: var(--text) !important;
}
.btn.ghost:hover {
  background: var(--surface-hover) !important;
  border-color: var(--blue) !important;
}
.sigma {
  background: var(--surface-alt) !important;
  color: var(--text) !important;
  border: 1px solid var(--border) !important;
}
.toolbar select, .toolbar input {
  background: var(--surface-alt) !important;
  border-color: var(--border) !important;
  color: var(--text) !important;
}
.view-switch {
  background: var(--surface-alt) !important;
}
.view-switch button {
  color: var(--text-muted) !important;
}
.view-switch button.active {
  background: var(--surface) !important;
  color: var(--navy) !important;
}
.role-banner {
  background: rgba(56, 189, 248, 0.12) !important;
  border-color: rgba(56, 189, 248, 0.3) !important;
  color: var(--blue) !important;
}
.role-banner.restricted {
  background: rgba(249, 115, 22, 0.12) !important;
  border-color: rgba(249, 115, 22, 0.3) !important;
  color: var(--orange) !important;
}
"""

# 3. Write Theme CSS to styles.css as well so both sources have it
with open(os.path.join(demo_dir, "styles.css"), "w", encoding="utf-8") as f:
    f.write(css_content + "\n\n" + theme_css)

# 4. Generate the Complete Standalone Project Demo with Theme Switcher
full_demo_html = f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QuadeConnect — Full Project View (Architectural Millwork)</title>
<style>
{css_content}

{theme_css}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body data-theme="dark">

<!-- Master Navigation Bar -->
<header class="topbar">
  <div class="brand" onclick="location.hash='#/projects/grid'">
    <span class="logo">Q</span>
    <span>Quade<b>Connect</b></span>
    <span class="module">Architectural Millwork ERP</span>
  </div>

  <nav class="topnav">
    <a href="#/projects/grid" id="nav-projects">Projects Master Grid</a>
    <a href="#/projects/kanban">Kanban Board</a>
    <a href="#/projects/gantt">Gantt Timeline</a>
  </nav>

  <div class="top-right">
    <input id="globalSearch" class="global-search" placeholder="Search Proj No, Name, Customer...">
    
    <!-- Theme Switcher -->
    <div class="theme-switch-group" title="Select UI Theme Mode">
      <button class="theme-switch-btn active" id="btn-theme-dark" onclick="setAppTheme('dark')">🌙 Dark</button>
      <button class="theme-switch-btn" id="btn-theme-blueprint" onclick="setAppTheme('blueprint')">📐 Blueprint</button>
      <button class="theme-switch-btn" id="btn-theme-light" onclick="setAppTheme('light')">☀️ Light</button>
    </div>

    <!-- Role-Based Cost Masking Simulator -->
    <label class="role-label" title="Switch user role to test cost masking and project scoping">
      <span>Role:</span>
      <select id="roleSelect"></select>
    </label>

    <button class="btn ghost small" onclick="resetDemo()" title="Reset demo data to default">Reset</button>
  </div>
</header>

<!-- Quick Project Switcher Subbar -->
<div class="inn-subbar">
  <div class="inn-quicklinks">
    <span style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase">Quick Jump:</span>
    <button class="inn-btn-project" onclick="location.hash='#/project/P-26-1132/shop'">
      <span>🏢</span> P-26-1132 AUS Project Oasis (52 Shop Drawings)
    </button>
    <button class="inn-btn-project" onclick="location.hash='#/project/P-26-1137/sheets'">
      <span>🏛️</span> P-26-1137 BWI Project Oasis (216 Sheets)
    </button>
    <button class="inn-btn-project" onclick="location.hash='#/project/P-26-1132/workorders'">
      <span>🔨</span> 199 Work Orders
    </button>
    <button class="inn-btn-project" onclick="location.hash='#/project/P-26-1132/qc'">
      <span>🔍</span> QC Review Queue
    </button>
    <button class="inn-btn-project" onclick="location.hash='#/project/P-26-1132/submittals'">
      <span>📋</span> Submittals Transmittals
    </button>
  </div>
  <div style="font-size:11.5px;color:var(--text-muted);font-weight:600">
    Domain: Innergy Architectural Millwork + ClickUp High-Density UX
  </div>
</div>

<!-- Main Dynamic Content Canvas -->
<main id="view"></main>

<!-- Modals & Notifications Container -->
<div id="modal"></div>
<div id="toast"></div>

<!-- Embedded Full Application Engine -->
<script>
// Theme Management Functions
function setAppTheme(themeName) {{
  document.documentElement.setAttribute('data-theme', themeName);
  document.body.setAttribute('data-theme', themeName);
  localStorage.setItem('quadeconnect_theme', themeName);
  
  // Update button active state
  ['dark', 'blueprint', 'light'].forEach(t => {{
    const btn = document.getElementById('btn-theme-' + t);
    if (btn) {{
      if (t === themeName) btn.classList.add('active');
      else btn.classList.remove('active');
    }}
  }});

  if (typeof toast === 'function') {{
    toast('Theme changed to ' + themeName.toUpperCase() + ' Mode');
  }}
}}

// Initialize Theme from localStorage or default to Dark
(function initTheme() {{
  const saved = localStorage.getItem('quadeconnect_theme') || 'dark';
  setAppTheme(saved);
}})();

{data_js}

{views_js}

{project_js}

{app_js}

// Auto-navigate to Project P-26-1132 on initial load so user lands directly in Full Project View!
window.addEventListener('load', () => {{
  // Re-verify theme button active states
  const saved = localStorage.getItem('quadeconnect_theme') || 'dark';
  setAppTheme(saved);

  if (!location.hash || location.hash === '#/projects/grid') {{
    location.hash = '#/project/P-26-1132/shop';
  }}
}});
</script>
</body>
</html>
"""

full_demo_path = os.path.join(workspace_dir, "QuadeConnect_Full_Project_View_Demo.html")
with open(full_demo_path, "w", encoding="utf-8") as f:
    f.write(full_demo_html)

print("Full Project View Demo with Themes regenerated successfully:", full_demo_path)
