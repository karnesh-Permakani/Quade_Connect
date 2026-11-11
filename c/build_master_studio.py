import os

workspace_dir = r"c:\Users\MARIESWARI\Desktop\c"
demo_dir = os.path.join(workspace_dir, "quadeconnect-pm", "demo")

# Read CSS and JS files
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

master_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QuadeConnect — Complete UI & UX Design Studio (Architectural Millwork)</title>
<style>
/* Embedded Core App Styles */
{css_content}

/* Master Studio Navigation & Design Showcase Styles */
.studio-header {{
  background: #0b1120;
  color: #fff;
  border-bottom: 1px solid #1e293b;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}}
.studio-brand {{
  display: flex;
  align-items: center;
  gap: 12px;
}}
.studio-brand .badge-studio {{
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}}
.studio-brand h1 {{
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.3px;
}}
.studio-nav {{
  display: flex;
  background: #1e293b;
  padding: 3px;
  border-radius: 8px;
  gap: 2px;
}}
.studio-nav button {{
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}}
.studio-nav button:hover {{
  color: #fff;
  background: rgba(255,255,255,0.05);
}}
.studio-nav button.active {{
  background: #2563eb;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}}

/* Studio Tab Views */
.studio-section {{
  display: none;
  animation: fadeIn 0.2s ease;
}}
.studio-section.active {{
  display: block;
}}

/* Design Showcase Components */
.design-showcase {{
  max-width: 1400px;
  margin: 20px auto 60px;
  padding: 0 24px;
}}
.sec-hero {{
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  color: #fff;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-md);
}}
.sec-hero h2 {{
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}}
.sec-hero p {{
  font-size: 13.5px;
  color: #cbd5e1;
  margin: 0;
  max-width: 850px;
  line-height: 1.5;
}}

.token-grid {{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}}
.token-card {{
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
}}
.swatch {{
  height: 80px;
  display: flex;
  align-items: flex-end;
  padding: 10px;
  font-weight: 800;
  font-family: Consolas, monospace;
  font-size: 13px;
}}
.token-info {{
  padding: 12px;
  font-size: 12px;
}}
.token-info b {{
  display: block;
  font-size: 13px;
  color: var(--navy);
  margin-bottom: 2px;
}}
.token-info span {{
  color: var(--text-muted);
  font-size: 11px;
}}

.spec-box {{
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-xs);
}}
.spec-box h3 {{
  margin: 0 0 14px;
  font-size: 16px;
  font-weight: 800;
  color: var(--navy);
  border-bottom: 2.5px solid var(--blue2);
  padding-bottom: 6px;
}}

.flow-step {{
  border-left: 3px solid var(--blue2);
  padding-left: 16px;
  margin-bottom: 16px;
}}
.flow-step h4 {{
  margin: 0 0 4px;
  font-size: 13.5px;
  font-weight: 800;
  color: var(--navy);
}}
.flow-step p {{
  margin: 0;
  color: #475569;
  font-size: 12.5px;
  line-height: 1.45;
}}

.wireframe-box {{
  background: #f8fafc;
  border: 1px dashed #94a3b8;
  border-radius: 8px;
  padding: 16px;
  font-family: Consolas, monospace;
  font-size: 11px;
  line-height: 1.4;
  white-space: pre-wrap;
  color: #0f172a;
  overflow-x: auto;
  margin-top: 10px;
}}

.comparison-table {{
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-top: 10px;
}}
.comparison-table th {{
  background: var(--navy);
  color: #fff;
  padding: 8px 12px;
  text-align: left;
  font-weight: 700;
}}
.comparison-table td {{
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}}
.comparison-table tr:nth-child(even) td {{
  background: #f8fafc;
}}
</style>
<!-- PDF.js library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>

<!-- Studio Master Navigation Bar -->
<div class="studio-header">
  <div class="studio-brand">
    <span class="badge-studio">Master UI &amp; UX Studio</span>
    <h1>QuadeConnect — Architectural Millwork Project Management</h1>
  </div>
  <div class="studio-nav">
    <button class="active" onclick="switchStudioTab('app', this)">
      <span>🚀</span> Live Interactive Prototype
    </button>
    <button onclick="switchStudioTab('design', this)">
      <span>🎨</span> UI Design Tokens
    </button>
    <button onclick="switchStudioTab('wireframes', this)">
      <span>📐</span> Screen Wireframes
    </button>
    <button onclick="switchStudioTab('workflow', this)">
      <span>🔄</span> 6-Phase Process Map
    </button>
    <button onclick="switchStudioTab('rbac', this)">
      <span>🛡️</span> RBAC Cost Masking
    </button>
    <button onclick="switchStudioTab('matrix', this)">
      <span>📊</span> Feature Comparison
    </button>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 1: LIVE INTERACTIVE PROTOTYPE                                     -->
<!-- ========================================================================= -->
<div id="sec-app" class="studio-section active">
  <header class="topbar">
    <div class="brand" onclick="location.hash='#/projects/grid'">
      <span class="logo">Q</span><span>Quade<b>Connect</b></span><span class="module">Project Management</span>
    </div>
    <nav class="topnav">
      <a href="#/projects/grid" id="nav-projects">Projects</a>
    </nav>
    <div class="top-right">
      <input id="globalSearch" class="global-search" placeholder="Global Search… (Proj No / Name / Customer)">
      <label class="role-label">Viewing as
        <select id="roleSelect"></select>
      </label>
      <button class="btn ghost small" onclick="resetDemo()" title="Reset all demo data">Reset Demo</button>
    </div>
  </header>
  <main id="view"></main>
  <div id="modal"></div>
  <div id="toast"></div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 2: UI DESIGN TOKENS & DESIGN SYSTEM                               -->
<!-- ========================================================================= -->
<div id="sec-design" class="studio-section">
  <div class="design-showcase">
    <div class="sec-hero">
      <h2>UI Design System &amp; Design Tokens</h2>
      <p>A precision-crafted design language tailored for architectural millwork manufacturing: balancing high-density data tables, technical engineering CAD documents, and fluid ClickUp-style project views.</p>
    </div>

    <div class="spec-box">
      <h3>1. Primary Color Tokens &amp; Semantic Palette</h3>
      <div class="token-grid">
        <div class="token-card">
          <div class="swatch" style="background:#0f172a;color:#fff">#0f172a</div>
          <div class="token-info">
            <b>Industrial Navy (Slate 900)</b>
            <span>Primary text, master headings, table footer sums, dominant branding.</span>
          </div>
        </div>
        <div class="token-card">
          <div class="swatch" style="background:#f97316;color:#fff">#f97316</div>
          <div class="token-info">
            <b>Innergy Orange (Orange 500)</b>
            <span>Millwork CTAs, active tab underlines, upload buttons, revision highlights.</span>
          </div>
        </div>
        <div class="token-card">
          <div class="swatch" style="background:#2563eb;color:#fff">#2563eb</div>
          <div class="token-info">
            <b>Precision Blue (Blue 600)</b>
            <span>Interactive links, Work Order bridges, primary buttons, drawing numbers.</span>
          </div>
        </div>
        <div class="token-card">
          <div class="swatch" style="background:#16a34a;color:#fff">#16a34a</div>
          <div class="token-info">
            <b>Emerald Success (Green 600)</b>
            <span>"Budget is up to date", QC Approved, Submittal sign-off, 100% billed.</span>
          </div>
        </div>
        <div class="token-card">
          <div class="swatch" style="background:#d97706;color:#fff">#d97706</div>
          <div class="token-info">
            <b>Amber Warning (Amber 600)</b>
            <span>Pending Submittals, High Priority flags, Revision Sets in progress.</span>
          </div>
        </div>
        <div class="token-card">
          <div class="swatch" style="background:#dc2626;color:#fff">#dc2626</div>
          <div class="token-info">
            <b>Crimson Danger (Red 600)</b>
            <span>Over-budget alert, QC Rejected, Critical Priority, Over-hours progress bar.</span>
          </div>
        </div>
        <div class="token-card">
          <div class="swatch" style="background:#7c3aed;color:#fff">#7c3aed</div>
          <div class="token-info">
            <b>Purple Review (Purple 600)</b>
            <span>QC Review inspection queue, non-conformance flags, checklists.</span>
          </div>
        </div>
        <div class="token-card">
          <div class="swatch" style="background:#f8fafc;color:#0f172a;border-bottom:1px solid #cbd5e1">#f8fafc</div>
          <div class="token-info">
            <b>Surface Neutral (Slate 50)</b>
            <span>High-density zebra table rows, card toolbars, split-pane metadata panels.</span>
          </div>
        </div>
      </div>
    </div>

    <div class="spec-box">
      <h3>2. Typography &amp; Tabular Data Scale</h3>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Level</th>
            <th>Size / Weight</th>
            <th>Font Specimen</th>
            <th>Application</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Display 1</td>
            <td>22px / 800 Bold</td>
            <td style="font-size:22px;font-weight:800">Projects Master Hub</td>
            <td>Page titles, Project detail header</td>
          </tr>
          <tr>
            <td>Heading 2</td>
            <td>16px / 700 Bold</td>
            <td style="font-size:16px;font-weight:700">Hours Pay &amp; Labor Budget Plan</td>
            <td>Card headers, Modal titles</td>
          </tr>
          <tr>
            <td>Heading 3</td>
            <td>14px / 800 Bold</td>
            <td style="font-size:14px;font-weight:800">G0.02 — PROJECT INFORMATION</td>
            <td>Document titles, Submittal packages</td>
          </tr>
          <tr>
            <td>Tabular Figures</td>
            <td>12.5px / Monospace</td>
            <td style="font-family:Consolas,monospace;font-size:13px;font-weight:700">$5,114,150.01 | Σ9 Slides | P-26-1132-025p</td>
            <td>Financial values, Slide counts, WO numbers</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 3: SCREEN WIREFRAMES & BLUEPRINTS                                 -->
<!-- ========================================================================= -->
<div id="sec-wireframes" class="studio-section">
  <div class="design-showcase">
    <div class="sec-hero">
      <h2>High-Fidelity Screen Wireframes &amp; Blueprints</h2>
      <p>Detailed structural wireframes showing component hierarchy, button placement, and split-pane layout geometry.</p>
    </div>

    <div class="spec-box">
      <h3>Screen 1: Master Projects Workspace (Grid &amp; Kanban Switcher) — Ref Image 1</h3>
      <div class="wireframe-box">
+--------------------------------------------------------------------------------------------------------------------+
|  [Q] QuadeConnect  [Projects]                     [🔍 Search by Proj No, Name...]   [Viewing as: Sarah Mitchell v]  |
+--------------------------------------------------------------------------------------------------------------------+
|  Projects > Grid                                                                                                   |
|  Projects                                                          [▦ Grid] [▥ Kanban] [▤ Gantt]                   |
|  [Admin View: All 11 Projects | Full Financials Active]                                                            |
|                                                                                                                    |
|  Group by: [Customer v]  Clear Filters  ⤓ Export CSV                                       Showing 11 projects    |
|  +----------------------------------------------------------------------------------------------------------------+
|  | Proj No.   | Name                | Customer        | Current Contract | Work Orders Val | Billed % | Hours Bar |
|  |------------+---------------------+-----------------+------------------+-----------------+----------+-----------|
|  | P-26-1137  | BWI Project Oasis   | Whiting Turner  | $8,838,759.00    | $0.00           | 0.00%    | [==  ] 25%|
|  | P-26-1132  | AUS Project Oasis   | Hensel Phelps   | $5,114,150.00    | $5,114,150.01   | 6.79%    | [====] 81%|
|  | P-26-1136  | Omni Midland Hotel  | Beck Group      | $4,229,775.00    | $4,229,775.01   | 0.00%    | [=   ] 19%|
|  +----------------------------------------------------------------------------------------------------------------+
|  | PORTFOLIO TOTALS (Admin Only):                      $229,804,78...    $195,337,262.87   14.2%      64% Labor   |
+--------------------------------------------------------------------------------------------------------------------+
      </div>
    </div>

    <div class="spec-box">
      <h3>Screen 2: Split-Pane Multi-Slide PDF Studio (Sheets &amp; Shop Drawings) — Ref Image 4</h3>
      <div class="wireframe-box">
+--------------------------------------------------------------------------------------------------------------------+
|  < Back to Sheets Grid                                            [⇄ Compare Revisions]  [⤓ Download Signed PDF]   |
+--------------------------------------------------------------------------------------------------------------------+
|  +-------------------------------+  +-----------------------------------------------------------------------------+  |
|  | METADATA & REVISION HISTORY   |  | MULTI-SLIDE IN-BROWSER PDF CANVAS               [-] [ 100% ] [+] [✎ Add Pin]|  |
|  |-------------------------------|  |-----------------------------------------------------------------------------|  |
|  | Sheet Number: [G0.02         ]|  |  +-----------------------------------------------------------------------+  |  |
|  | Sheet Name:   [PROJECT INFO  ]|  |  | <                                                                   > |  |  |
|  | Version Set:  [90 IFP       v]|  |  |    QUADECONNECT ARCHITECTURAL MILLWORK SPECIFICATION                  |  |  |
|  | Tags:         [Code, General ]|  |  |    SHEET: G0.02 - PROJECT INFORMATION | SLIDE 1 OF 3 (90 IFP)        |  |  |
|  |                               |  |  |                                                                       |  |  |
|  | [ Save Changes ]              |  |  |    +-------------------------+     +-------------------------------+  |  |  |
|  |                               |  |  |    | Architectural Plan View |     | General Millwork Notes        |  |  |  |
|  | REVISION HISTORY TIMELINE:    |  |  |    | - Lobby Reception Area  |     | 1. Field verify all dimensions|  |  |  |
|  | • 90 IFP (now viewing)        |  |  |    | - Restroom Vanities     |     | 2. AWI Premium Grade Casework |  |  |  |
|  |   Issued: 07/31/2026 | 3 pgs  |  |  |    +-------------------------+     +-------------------------------+  |  |  |
|  | • Bulletin 01                 |  |  |                                                                       |  |  |
|  |   Issued: 08/31/2026 | 4 pgs  |  |  +-----------------------------------------------------------------------+  |  |
|  +-------------------------------+  |                                                                             |  |
|                                     |  [Slide 1: Cover/Plan]  [Slide 2: Enlarged Casework]  [Slide 3: Schedules]  |  |
|                                     +-----------------------------------------------------------------------------+  |
+--------------------------------------------------------------------------------------------------------------------+
      </div>
    </div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 4: 6-PHASE PROCESS WORKFLOW MAP                                   -->
<!-- ========================================================================= -->
<div id="sec-workflow" class="studio-section">
  <div class="design-showcase">
    <div class="sec-hero">
      <h2>6-Phase End-to-End Architectural Millwork Workflow</h2>
      <p>Connecting your uploaded process diagram line-by-line directly into the software architecture.</p>
    </div>

    <div class="spec-box">
      <h3>Phase-by-Phase Process Engine</h3>
      <div class="flow-step">
        <h4>Phase 1: Sales &amp; CRM Intake Pipeline</h4>
        <p>Lead captured from GC or website bid invite &rarr; Moves through CRM stages &rarr; Optional pre-bid Study Project evaluated &rarr; Lead Won triggers automatic sequential Project Number generation (e.g. P-26-1132), creates Client Portal login, and provisions AWS S3/Box folders.</p>
      </div>
      <div class="flow-step">
        <h4>Phase 2: Operations &amp; Estimating Setup</h4>
        <p>Estimators build Bill of Quantities (BOQ) &amp; Bill of Materials (BOM) &rarr; Admin sets Hours Pay Plan ($/hr rates for Engineering, CNC/Fab, Finishing, Install) &rarr; Ops Head allocates project to specific team members &rarr; Project broken into numbered Work Orders (e.g. P-26-1132-011p).</p>
      </div>
      <div class="flow-step">
        <h4>Phase 3: Client Workspace &amp; S3 / Box Intake</h4>
        <p>Client logs into dedicated portal &rarr; Uploads architectural PDFs and addenda via pre-signed S3/Box URLs &rarr; Documents link automatically into project Sheets and Files tabs &rarr; In-browser PDF viewing with zero download requirements.</p>
      </div>
      <div class="flow-step">
        <h4>Phase 4: Team Execution Inside the Project</h4>
        <p>Engineering studies architectural Sheets &rarr; Drafts detailed CAD Shop Drawings tied to Work Orders &rarr; Automated worker scans PDFs to count slides/pages (displayed as &Sigma;4, &Sigma;9) and render thumbnails &rarr; QC Team runs 10-point AWI inspection checklist before client submittal.</p>
      </div>
      <div class="flow-step">
        <h4>Phase 5: Revision Loop (REVX) &amp; Submittals</h4>
        <p>PM publishes approved drawings via Publish Log &rarr; Client marks up redlines in-browser &rarr; Drafters upload revised Version Set (e.g. MOCKUP PACKAGE #1 &rarr; #2) &rarr; Prior versions preserved in Revision History &rarr; Client approves &rarr; File locked as Immutable Archive in S3 and released to shop floor.</p>
      </div>
      <div class="flow-step">
        <h4>Phase 6: Finance &amp; Closeout</h4>
        <p>Admin tracks Original vs Current Contract, Work Orders Value, and Billed % &rarr; Progress billing generated &rarr; Final client punch-list sign-off &rarr; As-builts locked and Lessons Learned saved.</p>
      </div>
    </div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 5: RBAC & COST MASKING MATRIX                                     -->
<!-- ========================================================================= -->
<div id="sec-rbac" class="studio-section">
  <div class="design-showcase">
    <div class="sec-hero">
      <h2>Role-Based Access Control (RBAC) &amp; Cost Masking</h2>
      <p>Strict access security guaranteeing that non-admin roles never see contract figures, profit margins, or labor pay rates.</p>
    </div>

    <div class="spec-box">
      <h3>Role Permission &amp; Visibility Matrix</h3>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Project Scope</th>
            <th>Contract &amp; Cost Columns</th>
            <th>Hourly Pay &amp; Labor</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Super Admin / Admin</b></td>
            <td><span class="badge b-blue">ALL Projects</span></td>
            <td><span class="badge b-green">FULL ACCESS</span> (Contract, WO, Billed, Est Cost)</td>
            <td><span class="badge b-green">FULL ACCESS</span> (Sets $/hr rates &amp; labor costs)</td>
            <td>Full CRUD, Rate Cards, S3 Config, All 11 Tabs</td>
          </tr>
          <tr>
            <td><b>Operations Head</b></td>
            <td><span class="badge b-blue">Assigned Projects</span></td>
            <td><span class="badge b-red">STRIPPED / HIDDEN</span></td>
            <td><span class="badge b-blue">HOURS ONLY</span> (Budgeted vs Actual hrs)</td>
            <td>Allocate Team, Work Orders, Installer Schedule</td>
          </tr>
          <tr>
            <td><b>Project Manager</b></td>
            <td><span class="badge b-blue">Assigned Projects</span></td>
            <td><span class="badge b-red">STRIPPED / HIDDEN</span></td>
            <td><span class="badge b-blue">HOURS ONLY</span></td>
            <td>Manage Tabs, Submittals, Publish Log, RFIs</td>
          </tr>
          <tr>
            <td><b>Engineer / Drafter</b></td>
            <td><span class="badge b-blue">Assigned Projects</span></td>
            <td><span class="badge b-red">STRIPPED / HIDDEN</span></td>
            <td><span class="badge b-blue">OWN HOURS</span></td>
            <td>View Sheets, Upload Shop Drawings, Link WOs</td>
          </tr>
          <tr>
            <td><b>QC Reviewer</b></td>
            <td><span class="badge b-blue">Assigned Projects</span></td>
            <td><span class="badge b-red">STRIPPED / HIDDEN</span></td>
            <td><span class="badge b-blue">OWN HOURS</span></td>
            <td>QC Review Queue, AWI Checklists, Redlines</td>
          </tr>
          <tr>
            <td><b>Client (External)</b></td>
            <td><span class="badge b-blue">Own Project Only</span></td>
            <td><span class="badge b-red">STRIPPED / HIDDEN</span></td>
            <td><span class="badge b-red">HIDDEN</span></td>
            <td>Upload Files to S3, View Published PDFs, Sign Submittals</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- SECTION 6: FEATURE COMPARISON MATRIX                                      -->
<!-- ========================================================================= -->
<div id="sec-matrix" class="studio-section">
  <div class="design-showcase">
    <div class="sec-hero">
      <h2>ClickUp vs. Innergy vs. QuadeConnect PM Matrix</h2>
      <p>How QuadeConnect synthesizes ClickUp's productivity engine with Innergy's millwork manufacturing depth.</p>
    </div>

    <div class="spec-box">
      <h3>Capability Matrix</h3>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Feature / Capability</th>
            <th>ClickUp</th>
            <th>Innergy ERP</th>
            <th>QuadeConnect PM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Master Projects High-Density Grid</td>
            <td>Yes (Generic tasks)</td>
            <td>Yes (Millwork contracts)</td>
            <td><b>YES — High-Density Grid + Footer Sums</b></td>
          </tr>
          <tr>
            <td>Projects Kanban (#/projects/kanban)</td>
            <td>Yes</td>
            <td>Yes</td>
            <td><b>YES — 7 Millwork Stages Drag &amp; Drop</b></td>
          </tr>
          <tr>
            <td>Contract, WO Value &amp; Billed %</td>
            <td>No</td>
            <td>Yes</td>
            <td><b>YES — Full Financial Tracking (Admin)</b></td>
          </tr>
          <tr>
            <td>Role-Based Cost Masking</td>
            <td>Limited</td>
            <td>Partial</td>
            <td><b>YES — Strict API-Level Field Masking</b></td>
          </tr>
          <tr>
            <td>Hours Pay Plan ($/hr Rates)</td>
            <td>No</td>
            <td>Yes</td>
            <td><b>YES — Configurable Pay Rates &amp; Hours</b></td>
          </tr>
          <tr>
            <td>Architectural Sheets Grid &amp; Versions</td>
            <td>No</td>
            <td>Yes</td>
            <td><b>YES — 90 IFP, Bulletin 01, OCR Intake</b></td>
          </tr>
          <tr>
            <td>Shop Drawings Tied to Work Orders</td>
            <td>No</td>
            <td>Yes</td>
            <td><b>YES — Mockup Packages #1..#5 Linked to WOs</b></td>
          </tr>
          <tr>
            <td>PDF Slide Count Badges (&Sigma;4, &Sigma;9)</td>
            <td>No</td>
            <td>Yes</td>
            <td><b>YES — Automatic Slide Count Extraction</b></td>
          </tr>
          <tr>
            <td>Split-Pane Multi-Slide PDF Viewer</td>
            <td>No</td>
            <td>Yes</td>
            <td><b>YES — In-Browser Canvas + Thumbnails</b></td>
          </tr>
          <tr>
            <td>Revision History &amp; Diff Comparison</td>
            <td>Basic Proofing</td>
            <td>Yes</td>
            <td><b>YES — Side-by-Side Revision Diff Overlay</b></td>
          </tr>
          <tr>
            <td>Internal QC Review Gate</td>
            <td>No</td>
            <td>Partial</td>
            <td><b>YES — 10-Point AWI Inspection Checklist</b></td>
          </tr>
          <tr>
            <td>Formal Submittal Transmittals (REVX)</td>
            <td>No</td>
            <td>Yes</td>
            <td><b>YES — Ball-in-Court &amp; Client Sign-off</b></td>
          </tr>
          <tr>
            <td>Direct AWS S3 / Box Cloud Storage</td>
            <td>Attachments only</td>
            <td>Proprietary</td>
            <td><b>YES — Pre-Signed S3 Streaming Pipeline</b></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- EMBEDDED JAVASCRIPT LOGIC                                                 -->
<!-- ========================================================================= -->
<script>
// Switch between Studio Tabs
function switchStudioTab(tabKey, btn) {{
  document.querySelectorAll('.studio-nav button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.studio-section').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sec-' + tabKey).classList.add('active');
  if (tabKey === 'app') {{
    route();
  }}
}}

/* Embedded Data & Logic */
{data_js}

/* Embedded Views */
{views_js}

/* Embedded Project Details */
{project_js}

/* Embedded App & Document Viewer */
{app_js}
</script>
</body>
</html>
"""

output_path = os.path.join(workspace_dir, "QuadeConnect_Master_UI_UX_Studio.html")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(master_html)

print("Master Studio HTML generated successfully:", output_path)

