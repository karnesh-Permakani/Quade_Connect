import os

workspace_dir = r"c:\Users\MARIESWARI\Desktop\c"
demo_dir = os.path.join(workspace_dir, "quadeconnect-pm", "demo")

# 1. Read demo source files
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

# Strip any previous appended theme blocks from styles.css
clean_css = css_content.split("/* ==================== DISTINCTIVE DARK THEMES ENGINE ==================== */")[0]
clean_css = clean_css.split("/* ==================== QUADECONNECT ADVANCED THEME ENGINE ==================== */")[0].strip()

# Rich, ultra-stylish dark color themes
themes_block = """
/* ==================== DISTINCTIVE DARK THEMES ENGINE ==================== */

/* --- 1. DEFAULT: FORGED AMBER & INDUSTRIAL MILLWORK DARK (theme-amber) --- */
:root, [data-theme="amber"], [data-theme="dark"] {
  --navy: #f8fafc;
  --navy-light: #fde68a;
  --blue: #fbbf24;
  --blue2: #f59e0b;
  --blue-hover: #fcd34d;
  --link: #fbbf24;
  --orange: #f59e0b;
  --orange-dark: #d97706;
  --border: #28303f;
  --border-light: #1c222e;
  --bg: #07090e;
  --surface: #0e121a;
  --surface-alt: #141a24;
  --surface-hover: #1c2433;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --table-th-bg: #0a0d14;
  --table-th-text: #f59e0b;
  --table-row-hover: #161e2b;
  --kanban-col-bg: #0b0e14;
  --green: #10b981;
  --green-bg: rgba(16, 185, 129, 0.2);
  --red: #ef4444;
  --red-bg: rgba(239, 68, 68, 0.2);
  --amber: #f59e0b;
  --amber-bg: rgba(245, 158, 11, 0.2);
  --purple: #c084fc;
  --purple-bg: rgba(192, 132, 252, 0.2);
  --pill: #261f10;
  --pill-text: #fbbf24;
  --pill-border: #78350f;
  --accent-glow: 0 0 16px rgba(245, 158, 11, 0.35);
  --card-border-glow: 1px solid rgba(245, 158, 11, 0.22);
}

/* --- 2. CYBERPUNK / NEON CYAN & PITCH BLACK (theme-cyber) --- */
[data-theme="cyber"] {
  --navy: #ffffff;
  --navy-light: #a5f3fc;
  --blue: #00f5ff;
  --blue2: #06b6d4;
  --blue-hover: #67e8f9;
  --link: #00f5ff;
  --orange: #ff007f;
  --orange-dark: #e11d48;
  --border: #152238;
  --border-light: #0d1726;
  --bg: #04060a;
  --surface: #090e17;
  --surface-alt: #0f1827;
  --surface-hover: #17243b;
  --text: #f8fafc;
  --text-muted: #7dd3fc;
  --table-th-bg: #060910;
  --table-th-text: #00f5ff;
  --table-row-hover: #111e33;
  --kanban-col-bg: #060a12;
  --green: #00ff88;
  --green-bg: rgba(0, 255, 136, 0.2);
  --red: #ff0055;
  --red-bg: rgba(255, 0, 85, 0.2);
  --amber: #ffaa00;
  --amber-bg: rgba(255, 170, 0, 0.2);
  --purple: #d946ef;
  --purple-bg: rgba(217, 70, 239, 0.2);
  --pill: #082f49;
  --pill-text: #38bdf8;
  --pill-border: #0369a1;
  --accent-glow: 0 0 18px rgba(0, 245, 255, 0.4);
  --card-border-glow: 1px solid rgba(0, 245, 255, 0.28);
}

/* --- 3. EMERALD MATRIX / LUMINESCENT FOREST DARK (theme-emerald) --- */
[data-theme="emerald"] {
  --navy: #f0fdf4;
  --navy-light: #86efac;
  --blue: #10b981;
  --blue2: #059669;
  --blue-hover: #34d399;
  --link: #10b981;
  --orange: #f59e0b;
  --orange-dark: #d97706;
  --border: #163326;
  --border-light: #0c1f17;
  --bg: #030a07;
  --surface: #071710;
  --surface-alt: #0c2419;
  --surface-hover: #123324;
  --text: #f0fdf4;
  --text-muted: #6ee7b7;
  --table-th-bg: #04100b;
  --table-th-text: #10b981;
  --table-row-hover: #0e2b1e;
  --kanban-col-bg: #04100b;
  --green: #00ff9d;
  --green-bg: rgba(0, 255, 157, 0.2);
  --red: #f87171;
  --red-bg: rgba(248, 113, 113, 0.2);
  --amber: #fbbf24;
  --amber-bg: rgba(251, 191, 36, 0.2);
  --purple: #a78bfa;
  --purple-bg: rgba(167, 139, 250, 0.2);
  --pill: #064e3b;
  --pill-text: #a7f3d0;
  --pill-border: #047857;
  --accent-glow: 0 0 16px rgba(16, 185, 129, 0.35);
  --card-border-glow: 1px solid rgba(16, 185, 129, 0.25);
}

/* --- 4. DEEP AMETHYST / CYBER VOID (theme-amethyst) --- */
[data-theme="amethyst"] {
  --navy: #faf5ff;
  --navy-light: #d8b4fe;
  --blue: #a855f7;
  --blue2: #9333ea;
  --blue-hover: #c084fc;
  --link: #c084fc;
  --orange: #f43f5e;
  --orange-dark: #e11d48;
  --border: #2e1d4d;
  --border-light: #1b1030;
  --bg: #080412;
  --surface: #0f0821;
  --surface-alt: #170d33;
  --surface-hover: #221447;
  --text: #faf5ff;
  --text-muted: #c084fc;
  --table-th-bg: #0a0517;
  --table-th-text: #c084fc;
  --table-row-hover: #1c103d;
  --kanban-col-bg: #0a0517;
  --green: #34d399;
  --green-bg: rgba(52, 211, 153, 0.2);
  --red: #fb7185;
  --red-bg: rgba(251, 113, 133, 0.2);
  --amber: #fde047;
  --amber-bg: rgba(253, 224, 71, 0.2);
  --purple: #c084fc;
  --purple-bg: rgba(192, 132, 252, 0.2);
  --pill: #3b0764;
  --pill-text: #e9d5ff;
  --pill-border: #6b21a8;
  --accent-glow: 0 0 16px rgba(168, 85, 247, 0.4);
  --card-border-glow: 1px solid rgba(168, 85, 247, 0.3);
}

/* --- 5. MONOLITHIC CARBON / TITANIUM STEEL (theme-carbon) --- */
[data-theme="carbon"] {
  --navy: #ffffff;
  --navy-light: #e5e5e5;
  --blue: #3b82f6;
  --blue2: #2563eb;
  --blue-hover: #60a5fa;
  --link: #60a5fa;
  --orange: #ff5722;
  --orange-dark: #e64a19;
  --border: #262626;
  --border-light: #171717;
  --bg: #000000;
  --surface: #0d0d0d;
  --surface-alt: #141414;
  --surface-hover: #1f1f1f;
  --text: #f5f5f5;
  --text-muted: #a3a3a3;
  --table-th-bg: #080808;
  --table-th-text: #ffffff;
  --table-row-hover: #171717;
  --kanban-col-bg: #080808;
  --green: #22c55e;
  --green-bg: rgba(34, 197, 94, 0.2);
  --red: #ef4444;
  --red-bg: rgba(239, 68, 68, 0.2);
  --amber: #f59e0b;
  --amber-bg: rgba(245, 158, 11, 0.2);
  --purple: #a855f7;
  --purple-bg: rgba(168, 85, 247, 0.2);
  --pill: #1f1f1f;
  --pill-text: #ffffff;
  --pill-border: #404040;
  --accent-glow: 0 0 14px rgba(255, 255, 255, 0.2);
  --card-border-glow: 1px solid rgba(255, 255, 255, 0.2);
}

/* --- 6. CLEAN LIGHT THEME (theme-light) --- */
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
  --pill-text: #0369a1;
  --pill-border: #bae6fd;
  --accent-glow: none;
  --card-border-glow: 1px solid var(--border);
}

/* ==================== GLOBAL COMPONENT OVERRIDES ==================== */
body {
  background: var(--bg) !important;
  color: var(--text) !important;
  transition: background-color 0.25s ease, color 0.25s ease;
}

/* Top Navigation Bar */
.topbar {
  background: var(--surface) !important;
  border-bottom: 1px solid var(--border) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  backdrop-filter: blur(14px);
}
.brand .logo {
  box-shadow: var(--accent-glow);
}
.brand .module {
  background: var(--surface-alt) !important;
  color: var(--blue) !important;
  border-color: var(--border) !important;
}
.topnav a {
  color: var(--text) !important;
}
.topnav a:hover {
  color: var(--blue) !important;
}

/* Theme Switcher Live Pill Bar */
.theme-switch-group {
  display: flex;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 3px;
  gap: 3px;
}
.theme-switch-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
  box-shadow: var(--accent-glow);
}

/* Millwork Quick Subbar */
.inn-subbar {
  background: var(--surface) !important;
  border-bottom: 1px solid var(--border) !important;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.inn-btn-project {
  background: var(--surface-alt) !important;
  border: var(--card-border-glow) !important;
  color: var(--text) !important;
  padding: 5px 11px;
  border-radius: 6px;
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
  box-shadow: var(--accent-glow);
  transform: translateY(-1px);
}
.inn-btn-project.active {
  background: var(--blue2) !important;
  color: #fff !important;
  border-color: var(--blue2) !important;
  box-shadow: var(--accent-glow);
}

/* Panels & Cards with Glowing Depth */
.panel, .card {
  background: var(--surface) !important;
  border: var(--card-border-glow) !important;
  color: var(--text) !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
.card h3 {
  color: var(--navy) !important;
  border-bottom: 1px solid var(--border-light) !important;
}
.page-head h1, .proj-head h1 {
  color: var(--navy) !important;
}

/* High-Density Data Tables */
.table-wrap {
  background: var(--surface) !important;
  border: var(--card-border-glow) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}
table.grid th {
  background: var(--table-th-bg) !important;
  color: var(--table-th-text) !important;
  border-bottom: 1px solid var(--border) !important;
  border-right: 1px solid var(--border-light) !important;
  letter-spacing: 0.5px;
}
table.grid th:hover {
  background: var(--surface-hover) !important;
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
  text-shadow: var(--accent-glow);
}
.tabs .cnt {
  background: var(--surface-alt) !important;
  color: var(--blue) !important;
  border: 1px solid var(--border) !important;
}

/* Pills & Badges */
.pill {
  background: var(--pill) !important;
  color: var(--pill-text) !important;
  border: 1px solid var(--pill-border) !important;
}
.sigma {
  background: var(--surface-alt) !important;
  color: var(--blue) !important;
  border: 1px solid var(--border) !important;
  font-weight: 800;
}

/* Kanban Board */
.kcol {
  background: var(--kanban-col-bg) !important;
  border: var(--card-border-glow) !important;
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
  border: 1px solid var(--border) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.kcard:hover {
  border-color: var(--blue) !important;
  background: var(--surface-alt) !important;
  box-shadow: var(--accent-glow);
  transform: translateY(-2px);
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
  border: var(--card-border-glow) !important;
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

/* Document Viewer & Revision Compare */
.viewer {
  background: var(--surface) !important;
  border: var(--card-border-glow) !important;
}
.rev {
  background: var(--surface-alt) !important;
  border: 1px solid var(--border) !important;
  color: var(--text) !important;
}
.rev:hover {
  background: var(--surface-hover) !important;
  border-color: var(--blue) !important;
}
.rev.viewing {
  border-color: var(--orange) !important;
  background: rgba(245, 158, 11, 0.15) !important;
  box-shadow: var(--accent-glow);
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

/* Modals & Forms */
.mcard {
  background: var(--surface) !important;
  border: var(--card-border-glow) !important;
  color: var(--text) !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}
.mhead {
  background: var(--surface) !important;
  border-bottom: 1px solid var(--border) !important;
}
.mhead h3 {
  color: var(--navy) !important;
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
  box-shadow: var(--accent-glow);
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
  background: var(--surface-alt) !important;
  border-color: var(--border) !important;
  color: var(--blue) !important;
}
.role-banner.restricted {
  background: rgba(245, 158, 11, 0.12) !important;
  border-color: rgba(245, 158, 11, 0.3) !important;
  color: var(--orange) !important;
}

/* Master Studio Custom Overrides */
.token-card { background: var(--surface) !important; border: var(--card-border-glow) !important; color: var(--text) !important; }
.token-info b { color: var(--navy) !important; }
.token-info span { color: var(--text-muted) !important; }
.spec-box { background: var(--surface) !important; border: var(--card-border-glow) !important; color: var(--text) !important; }
.spec-box h3 { color: var(--navy) !important; border-bottom: 2px solid var(--blue2) !important; }
.flow-step { border-left: 3px solid var(--blue2) !important; }
.flow-step h4 { color: var(--navy) !important; }
.flow-step p { color: var(--text-muted) !important; }
.wireframe-box { background: var(--surface-alt) !important; border-color: var(--border) !important; color: var(--text) !important; }
.comparison-table th { background: var(--table-th-bg) !important; color: var(--table-th-text) !important; border: 1px solid var(--border) !important; }
.comparison-table td { background: var(--surface) !important; color: var(--text) !important; border: 1px solid var(--border) !important; }
.comparison-table tr:nth-child(even) td { background: var(--surface-alt) !important; }
.sec-hero { background: linear-gradient(135deg, var(--surface-alt) 0%, var(--surface-hover) 100%) !important; border: var(--card-border-glow) !important; }
"""

full_css = clean_css + "\n\n" + themes_block

# 2. Write updated styles.css
with open(os.path.join(demo_dir, "styles.css"), "w", encoding="utf-8") as f:
    f.write(full_css)
print("Updated quadeconnect-pm/demo/styles.css")

# 3. Build Full Project View Demo
theme_buttons_html = """
    <!-- Distinctive Dark Themes Bar -->
    <div class="theme-switch-group" title="Select UI Color Theme">
      <button class="theme-switch-btn active" id="btn-theme-amber" onclick="setAppTheme('amber')">🔥 Forged Amber</button>
      <button class="theme-switch-btn" id="btn-theme-cyber" onclick="setAppTheme('cyber')">⚡ Neon Cyan</button>
      <button class="theme-switch-btn" id="btn-theme-emerald" onclick="setAppTheme('emerald')">🧪 Emerald Matrix</button>
      <button class="theme-switch-btn" id="btn-theme-amethyst" onclick="setAppTheme('amethyst')">🔮 Cyber Violet</button>
      <button class="theme-switch-btn" id="btn-theme-carbon" onclick="setAppTheme('carbon')">⬛ Pitch Carbon</button>
      <button class="theme-switch-btn" id="btn-theme-light" onclick="setAppTheme('light')">☀️ Clean Light</button>
    </div>
"""

full_demo_html = f"""<!DOCTYPE html>
<html lang="en" data-theme="amber">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QuadeConnect — Full Project View (Architectural Millwork)</title>
<style>
{full_css}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body data-theme="amber">

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
    
    {theme_buttons_html}

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
const AVAILABLE_THEMES = ['amber', 'cyber', 'emerald', 'amethyst', 'carbon', 'light'];

// Theme Management Functions
function setAppTheme(themeName) {{
  if (!AVAILABLE_THEMES.includes(themeName)) themeName = 'amber';
  
  document.documentElement.setAttribute('data-theme', themeName);
  document.body.setAttribute('data-theme', themeName);
  localStorage.setItem('quadeconnect_theme', themeName);
  
  // Update button active state
  AVAILABLE_THEMES.forEach(t => {{
    const btn = document.getElementById('btn-theme-' + t);
    if (btn) {{
      if (t === themeName) btn.classList.add('active');
      else btn.classList.remove('active');
    }}
  }});

  if (typeof toast === 'function') {{
    toast('Switched to ' + themeName.toUpperCase() + ' Theme');
  }}
}}

// Initialize Theme from localStorage or default to 'amber' (Forged Amber & Millwork Dark)
(function initTheme() {{
  const saved = localStorage.getItem('quadeconnect_theme') || 'amber';
  setAppTheme(saved);
}})();

{data_js}

{views_js}

{project_js}

{app_js}

// Auto-navigate to Project P-26-1132 on initial load so user lands directly in Full Project View!
window.addEventListener('load', () => {{
  const saved = localStorage.getItem('quadeconnect_theme') || 'amber';
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
print("Updated QuadeConnect_Full_Project_View_Demo.html")

# 4. Also update build_master_studio.py and regenerate QuadeConnect_Master_UI_UX_Studio.html
# Read build_master_studio.py
studio_script = os.path.join(workspace_dir, "build_master_studio.py")
with open(studio_script, "r", encoding="utf-8") as f:
    bms_code = f.read()

# Execute build_master_studio.py to rebuild QuadeConnect_Master_UI_UX_Studio.html
import subprocess
res = subprocess.run(["python", studio_script], capture_output=True, text=True)
print("Rebuilt QuadeConnect_Master_UI_UX_Studio.html:", res.stdout)

