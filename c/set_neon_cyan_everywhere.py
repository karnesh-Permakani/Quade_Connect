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

# Pure, High-Energy Neon Cyan Master Theme Definition
neon_cyan_css = """
/* ==========================================================================
   QUADECONNECT PM — ULTRA NEON CYAN CYBERPUNK MASTER THEME
   Dominant Palette: Laser Cyan (#00f5ff), Electric Cyan (#00e5ff),
   OLED Void Black (#030508), Dark Glass Obsidian (#070d18 / #0c1526)
   ========================================================================== */

:root, [data-theme="cyber"], [data-theme="neoncyan"], [data-theme="dark"] {
  --navy: #ffffff;
  --navy-light: #a5f3fc;
  --blue: #00f5ff;
  --blue2: #00f5ff;
  --blue-hover: #38bdf8;
  --link: #00f5ff;
  --orange: #00f5ff;
  --orange-dark: #0284c7;
  --border: #132742;
  --border-light: #091322;
  --bg: #030508;
  --surface: #070d18;
  --surface-alt: #0b1424;
  --surface-hover: #101e36;
  --text: #f0fdf4;
  --text-muted: #7dd3fc;
  --table-th-bg: #040812;
  --table-th-text: #00f5ff;
  --table-row-hover: #0c1b33;
  --kanban-col-bg: #050a14;
  --green: #00ff9d;
  --green-bg: rgba(0, 255, 157, 0.16);
  --red: #ff0055;
  --red-bg: rgba(255, 0, 85, 0.16);
  --amber: #00f5ff;
  --amber-bg: rgba(0, 245, 255, 0.16);
  --purple: #d946ef;
  --purple-bg: rgba(217, 70, 239, 0.16);
  --pill: #082f49;
  --pill-text: #00f5ff;
  --pill-border: #00f5ff;
  --accent-glow: 0 0 18px rgba(0, 245, 255, 0.5);
  --card-border-glow: 1px solid rgba(0, 245, 255, 0.35);
  --card-glow-shadow: 0 4px 24px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 245, 255, 0.12);
}

/* Base Body Application Overrides */
body {
  background: var(--bg) !important;
  color: var(--text) !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  letter-spacing: 0.15px;
}

/* Top Navigation Bar with Neon Cyan Glassmorphism */
.topbar {
  background: rgba(7, 13, 24, 0.95) !important;
  border-bottom: 1px solid var(--border) !important;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(0, 245, 255, 0.25);
  backdrop-filter: blur(16px);
}
.brand .logo {
  background: linear-gradient(135deg, #00f5ff, #0284c7) !important;
  color: #030508 !important;
  font-weight: 900 !important;
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.6) !important;
}
.brand b {
  color: #00f5ff !important;
  text-shadow: 0 0 10px rgba(0, 245, 255, 0.6);
}
.brand .module {
  background: rgba(0, 245, 255, 0.12) !important;
  color: #00f5ff !important;
  border: 1px solid rgba(0, 245, 255, 0.4) !important;
  box-shadow: 0 0 10px rgba(0, 245, 255, 0.2);
}
.topnav a {
  color: var(--text) !important;
  transition: all 0.2s ease;
}
.topnav a:hover {
  color: #00f5ff !important;
  text-shadow: 0 0 8px rgba(0, 245, 255, 0.6);
}

/* Quick Jump Millwork Subbar */
.inn-subbar {
  background: #060a13 !important;
  border-bottom: 1px solid rgba(0, 245, 255, 0.2) !important;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.inn-btn-project {
  background: #0b1424 !important;
  border: 1px solid rgba(0, 245, 255, 0.25) !important;
  color: var(--text) !important;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.inn-btn-project:hover {
  background: #101e36 !important;
  border-color: #00f5ff !important;
  color: #00f5ff !important;
  box-shadow: 0 0 14px rgba(0, 245, 255, 0.4);
  transform: translateY(-1px);
}
.inn-btn-project.active {
  background: #00f5ff !important;
  color: #030508 !important;
  border-color: #00f5ff !important;
  box-shadow: 0 0 18px rgba(0, 245, 255, 0.6) !important;
}

/* Search Bar & Role Select */
.global-search {
  background: #0b1424 !important;
  border: 1px solid rgba(0, 245, 255, 0.3) !important;
  color: #ffffff !important;
}
.global-search:focus {
  background: #070d18 !important;
  border-color: #00f5ff !important;
  box-shadow: 0 0 15px rgba(0, 245, 255, 0.4) !important;
}
.role-label {
  background: #0b1424 !important;
  border: 1px solid rgba(0, 245, 255, 0.3) !important;
  color: #7dd3fc !important;
}
.role-label select {
  color: #00f5ff !important;
  background: transparent !important;
  font-weight: 800 !important;
}
.role-label select option {
  background: #070d18 !important;
  color: #00f5ff !important;
}

/* Theme Switcher Controls */
.theme-switch-group {
  display: flex;
  background: #0b1424;
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 20px;
  padding: 3px;
  gap: 3px;
}
.theme-switch-btn {
  background: transparent;
  border: none;
  color: #7dd3fc;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.theme-switch-btn:hover {
  color: #00f5ff;
  background: rgba(0, 245, 255, 0.1);
}
.theme-switch-btn.active {
  background: #00f5ff !important;
  color: #030508 !important;
  font-weight: 800 !important;
  box-shadow: 0 0 16px rgba(0, 245, 255, 0.6) !important;
}

/* Cards & Panels with Neon Obsidian Glass */
.panel, .card {
  background: #070d18 !important;
  border: 1px solid rgba(0, 245, 255, 0.28) !important;
  color: var(--text) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.6), 0 0 10px rgba(0, 245, 255, 0.08) !important;
}
.card h3 {
  color: #00f5ff !important;
  border-bottom: 1px solid rgba(0, 245, 255, 0.2) !important;
  text-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
}
.page-head h1, .proj-head h1 {
  color: #ffffff !important;
  text-shadow: 0 0 12px rgba(0, 245, 255, 0.3);
}

/* High-Density Data Tables */
.table-wrap {
  background: #070d18 !important;
  border: 1px solid rgba(0, 245, 255, 0.3) !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 245, 255, 0.1) !important;
}
table.grid th {
  background: #040812 !important;
  color: #00f5ff !important;
  border-bottom: 1px solid rgba(0, 245, 255, 0.35) !important;
  border-right: 1px solid #091322 !important;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(0, 245, 255, 0.4);
}
table.grid th:hover {
  background: #0b1424 !important;
}
table.grid td {
  color: var(--text) !important;
  border-bottom: 1px solid #091322 !important;
  border-right: 1px solid #091322 !important;
}
table.grid tbody tr:hover td {
  background: #0c1b33 !important;
}
table.grid tr.filters td {
  background: #070d18 !important;
  border-bottom: 1px solid rgba(0, 245, 255, 0.25) !important;
}
table.grid tr.filters input {
  background: #0b1424 !important;
  border: 1px solid rgba(0, 245, 255, 0.25) !important;
  color: #ffffff !important;
}
table.grid tr.filters input:focus {
  border-color: #00f5ff !important;
  box-shadow: 0 0 10px rgba(0, 245, 255, 0.4) !important;
}
table.grid tfoot td {
  background: #040812 !important;
  color: #00f5ff !important;
  border-top: 2px solid rgba(0, 245, 255, 0.4) !important;
}
table.grid tr.group td {
  background: #0b1424 !important;
  color: #00f5ff !important;
  border-top: 1px solid rgba(0, 245, 255, 0.2) !important;
}

/* Tabs with Glowing Neon Cyan Laser Line */
.tabs {
  border-bottom: 1px solid rgba(0, 245, 255, 0.25) !important;
}
.tabs a {
  color: #7dd3fc !important;
  font-weight: 700;
  transition: all 0.2s ease;
}
.tabs a:hover {
  background: #0b1424 !important;
  color: #00f5ff !important;
}
.tabs a.active {
  color: #00f5ff !important;
  border-bottom-color: #00f5ff !important;
  text-shadow: 0 0 12px rgba(0, 245, 255, 0.6) !important;
}
.tabs .cnt {
  background: rgba(0, 245, 255, 0.15) !important;
  color: #00f5ff !important;
  border: 1px solid rgba(0, 245, 255, 0.4) !important;
  box-shadow: 0 0 8px rgba(0, 245, 255, 0.2);
}

/* Micro-Badges & Indicators */
.pill {
  background: rgba(0, 245, 255, 0.12) !important;
  color: #00f5ff !important;
  border: 1px solid rgba(0, 245, 255, 0.4) !important;
  box-shadow: 0 0 8px rgba(0, 245, 255, 0.25);
}
.sigma {
  background: rgba(0, 245, 255, 0.15) !important;
  color: #00f5ff !important;
  border: 1px solid rgba(0, 245, 255, 0.35) !important;
  font-weight: 800;
  box-shadow: 0 0 6px rgba(0, 245, 255, 0.2);
}
.badge.b-blue {
  background: rgba(0, 245, 255, 0.15) !important;
  color: #00f5ff !important;
  border: 1px solid rgba(0, 245, 255, 0.35) !important;
}
.badge.b-green {
  background: rgba(0, 255, 157, 0.15) !important;
  color: #00ff9d !important;
  border: 1px solid rgba(0, 255, 157, 0.35) !important;
}

/* Kanban Board with Glowing Cyan Headers */
.kcol {
  background: #050a14 !important;
  border: 1px solid rgba(0, 245, 255, 0.25) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}
.khead {
  color: #00f5ff !important;
  text-shadow: 0 0 8px rgba(0, 245, 255, 0.4);
}
.khead .count {
  background: #0b1424 !important;
  color: #00f5ff !important;
  border: 1px solid rgba(0, 245, 255, 0.35) !important;
}
.kcard {
  background: #070d18 !important;
  border: 1px solid rgba(0, 245, 255, 0.2) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}
.kcard:hover {
  border-color: #00f5ff !important;
  background: #0c172a !important;
  box-shadow: 0 0 16px rgba(0, 245, 255, 0.4) !important;
  transform: translateY(-2px);
}
.kcard .kname {
  color: #ffffff !important;
}
.kcard .kno {
  color: #00f5ff !important;
  text-shadow: 0 0 6px rgba(0, 245, 255, 0.3);
}

/* Split-Pane Document Viewer & Drawing Canvas */
.viewer {
  background: #070d18 !important;
  border: 1px solid rgba(0, 245, 255, 0.3) !important;
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.15);
}
.rev {
  background: #0b1424 !important;
  border: 1px solid rgba(0, 245, 255, 0.2) !important;
  color: var(--text) !important;
}
.rev:hover {
  background: #101e36 !important;
  border-color: #00f5ff !important;
  box-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
}
.rev.viewing {
  border-color: #00f5ff !important;
  background: rgba(0, 245, 255, 0.15) !important;
  box-shadow: 0 0 15px rgba(0, 245, 255, 0.4) !important;
}
.rev .rname {
  color: #00f5ff !important;
}
.vnav {
  background: #0b1424 !important;
  border-color: rgba(0, 245, 255, 0.25) !important;
  color: #00f5ff !important;
}
.docmeta label {
  color: #7dd3fc !important;
}
.docmeta input, .docmeta select {
  background: #0b1424 !important;
  border: 1px solid rgba(0, 245, 255, 0.25) !important;
  color: #ffffff !important;
}

/* Modals & Forms */
.mcard {
  background: #070d18 !important;
  border: 1px solid #00f5ff !important;
  color: var(--text) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 245, 255, 0.35) !important;
}
.mhead {
  background: #040812 !important;
  border-bottom: 1px solid rgba(0, 245, 255, 0.3) !important;
}
.mhead h3 {
  color: #00f5ff !important;
  text-shadow: 0 0 10px rgba(0, 245, 255, 0.4);
}
.mbody {
  background: #070d18 !important;
}
.mfoot {
  background: #040812 !important;
  border-top: 1px solid rgba(0, 245, 255, 0.25) !important;
}
.form label {
  color: #7dd3fc !important;
}
.form input, .form select, .form textarea {
  background: #0b1424 !important;
  border: 1px solid rgba(0, 245, 255, 0.25) !important;
  color: #ffffff !important;
}
.form input:focus, .form select:focus, .form textarea:focus {
  background: #070d18 !important;
  border-color: #00f5ff !important;
  box-shadow: 0 0 12px rgba(0, 245, 255, 0.45) !important;
}

/* Primary Action Buttons */
.btn.primary, .btn.orange {
  background: linear-gradient(135deg, #00f5ff, #0284c7) !important;
  color: #030508 !important;
  font-weight: 800 !important;
  border: none !important;
  box-shadow: 0 0 15px rgba(0, 245, 255, 0.5) !important;
}
.btn.primary:hover, .btn.orange:hover {
  filter: brightness(1.2) !important;
  box-shadow: 0 0 22px rgba(0, 245, 255, 0.7) !important;
}
.btn.ghost {
  background: #0b1424 !important;
  border: 1px solid rgba(0, 245, 255, 0.3) !important;
  color: #00f5ff !important;
}
.btn.ghost:hover {
  background: #101e36 !important;
  border-color: #00f5ff !important;
  box-shadow: 0 0 12px rgba(0, 245, 255, 0.4) !important;
}

/* Master Studio Custom Overrides */
.studio-header {
  background: #040812 !important;
  border-bottom: 1px solid rgba(0, 245, 255, 0.35) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 245, 255, 0.15) !important;
}
.badge-studio {
  background: linear-gradient(135deg, #00f5ff, #0284c7) !important;
  color: #030508 !important;
  box-shadow: 0 0 12px rgba(0, 245, 255, 0.5) !important;
}
.studio-brand h1 {
  color: #ffffff !important;
}
.studio-nav {
  background: #0b1424 !important;
  border: 1px solid rgba(0, 245, 255, 0.25) !important;
}
.studio-nav button {
  color: #7dd3fc !important;
}
.studio-nav button:hover {
  color: #00f5ff !important;
  background: rgba(0, 245, 255, 0.1) !important;
}
.studio-nav button.active {
  background: #00f5ff !important;
  color: #030508 !important;
  font-weight: 800 !important;
  box-shadow: 0 0 15px rgba(0, 245, 255, 0.5) !important;
}
.token-card { background: #070d18 !important; border: 1px solid rgba(0, 245, 255, 0.3) !important; color: var(--text) !important; }
.token-info b { color: #00f5ff !important; }
.token-info span { color: #7dd3fc !important; }
.spec-box { background: #070d18 !important; border: 1px solid rgba(0, 245, 255, 0.3) !important; color: var(--text) !important; }
.spec-box h3 { color: #00f5ff !important; border-bottom: 2px solid #00f5ff !important; text-shadow: 0 0 8px rgba(0, 245, 255, 0.4); }
.flow-step { border-left: 3px solid #00f5ff !important; }
.flow-step h4 { color: #00f5ff !important; }
.flow-step p { color: #7dd3fc !important; }
.wireframe-box { background: #0b1424 !important; border-color: rgba(0, 245, 255, 0.3) !important; color: #00f5ff !important; }
.comparison-table th { background: #040812 !important; color: #00f5ff !important; border: 1px solid rgba(0, 245, 255, 0.25) !important; }
.comparison-table td { background: #070d18 !important; color: var(--text) !important; border: 1px solid rgba(0, 245, 255, 0.15) !important; }
.comparison-table tr:nth-child(even) td { background: #0b1424 !important; }
.sec-hero { background: linear-gradient(135deg, #070d18 0%, #0c172a 100%) !important; border: 1px solid rgba(0, 245, 255, 0.3) !important; }
"""

# 2. Write updated styles.css
full_css = clean_css + "\n\n" + neon_cyan_css
with open(os.path.join(demo_dir, "styles.css"), "w", encoding="utf-8") as f:
    f.write(full_css)
print("Updated quadeconnect-pm/demo/styles.css with Pure Neon Cyan Theme.")

# 3. Build Full Project View Demo with Neon Cyan as Root & Hardwired Default
theme_buttons_html = """
    <!-- Neon Cyan Active Indicator & Theme Bar -->
    <div class="theme-switch-group" title="Active Theme: Neon Cyan Cyberpunk">
      <button class="theme-switch-btn active" id="btn-theme-cyber" onclick="setAppTheme('cyber')">⚡ Neon Cyan (Active)</button>
      <button class="theme-switch-btn" id="btn-theme-amber" onclick="setAppTheme('amber')">🔥 Amber</button>
      <button class="theme-switch-btn" id="btn-theme-emerald" onclick="setAppTheme('emerald')">🧪 Emerald</button>
      <button class="theme-switch-btn" id="btn-theme-light" onclick="setAppTheme('light')">☀️ Light</button>
    </div>
"""

full_demo_html = f"""<!DOCTYPE html>
<html lang="en" data-theme="cyber">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QuadeConnect — Neon Cyan Architectural Millwork ERP</title>
<style>
{full_css}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body data-theme="cyber">

<!-- Master Navigation Bar -->
<header class="topbar">
  <div class="brand" onclick="location.hash='#/projects/grid'">
    <span class="logo">Q</span>
    <span>Quade<b>Connect</b></span>
    <span class="module">Neon Cyan Edition</span>
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
    <span style="font-size:11px;font-weight:700;color:#00f5ff;text-transform:uppercase;text-shadow:0 0 8px rgba(0,245,255,0.4)">Quick Jump:</span>
    <button class="inn-btn-project active" onclick="location.hash='#/project/P-26-1132/shop'">
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
  <div style="font-size:11.5px;color:#7dd3fc;font-weight:600">
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
const AVAILABLE_THEMES = ['cyber', 'amber', 'emerald', 'light'];

// Theme Management Functions
function setAppTheme(themeName) {{
  if (!AVAILABLE_THEMES.includes(themeName)) themeName = 'cyber';
  
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

// Initialize Theme to 'cyber' (Neon Cyan)
(function initTheme() {{
  setAppTheme('cyber');
}})();

{data_js}

{views_js}

{project_js}

{app_js}

// Auto-navigate to Project P-26-1132 on initial load so user lands directly in Full Project View!
window.addEventListener('load', () => {{
  setAppTheme('cyber');

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
print("Updated QuadeConnect_Full_Project_View_Demo.html with Neon Cyan default.")

# 4. Also update QuadeConnect_Master_UI_UX_Studio.html
studio_script = os.path.join(workspace_dir, "build_master_studio.py")
if os.path.exists(studio_script):
    import subprocess
    res = subprocess.run(["python", studio_script], capture_output=True, text=True)
    print("Rebuilt QuadeConnect_Master_UI_UX_Studio.html:", res.stdout)

