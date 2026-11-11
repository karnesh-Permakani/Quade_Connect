import os
import base64

# Paths to uploaded images
artifact_dir = r"C:\Users\MARIESWARI\.gemini\antigravity\brain\e424fa8c-acbc-485e-a214-1f1bf1c3ba4e"
workspace_dir = r"c:\Users\MARIESWARI\Desktop\c"

images = {
    "grid": os.path.join(artifact_dir, "img_projects_grid.jpg"),
    "flow": os.path.join(artifact_dir, "img_flow_diagram.png"),
    "shop": os.path.join(artifact_dir, "img_shop_drawings.jpg"),
    "sheet_view": os.path.join(artifact_dir, "img_sheet_view.jpg"),
    "sheets_grid": os.path.join(artifact_dir, "img_sheets_grid.jpg"),
}

b64_images = {}
for k, p in images.items():
    if os.path.exists(p):
        with open(p, "rb") as f:
            ext = "png" if p.endswith(".png") else "jpeg"
            b64_images[k] = f"data:image/{ext};base64," + base64.b64encode(f.read()).decode("utf-8")
    else:
        b64_images[k] = ""

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>QuadeConnect — Project Management Complete Workflow (Architectural Millwork)</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 14mm;
  }}
  * {{
    box-sizing: border-box;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }}
  body {{
    margin: 0;
    padding: 0;
    color: #1e293b;
    background: #ffffff;
    font-size: 10.5pt;
    line-height: 1.5;
  }}
  .cover {{
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
    color: #ffffff;
    padding: 36px 32px;
    border-radius: 10px;
    margin-bottom: 24px;
  }}
  .cover .badge {{
    display: inline-block;
    background: rgba(56, 189, 248, 0.2);
    border: 1px solid #38bdf8;
    color: #7dd3fc;
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 12px;
  }}
  .cover h1 {{
    margin: 0 0 8px 0;
    font-size: 22pt;
    font-weight: 800;
    letter-spacing: -0.5px;
  }}
  .cover h2 {{
    margin: 0 0 16px 0;
    font-size: 13pt;
    font-weight: 400;
    color: #cbd5e1;
  }}
  .cover .meta-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    border-top: 1px solid rgba(255,255,255,0.18);
    padding-top: 14px;
    margin-top: 16px;
    font-size: 9pt;
  }}
  .cover .meta-item strong {{
    display: block;
    color: #94a3b8;
    font-size: 7.5pt;
    text-transform: uppercase;
  }}
  h2.sec-title {{
    font-size: 14pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2.5px solid #2563eb;
    padding-bottom: 5px;
    margin-top: 26px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }}
  h3.sub-title {{
    font-size: 11.5pt;
    font-weight: 700;
    color: #1e40af;
    margin-top: 16px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }}
  p {{
    margin: 0 0 10px 0;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 18px 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }}
  th {{
    background: #0f172a;
    color: #ffffff;
    text-align: left;
    padding: 7px 9px;
    font-weight: 600;
  }}
  td {{
    padding: 6px 9px;
    border-bottom: 1px solid #cbd5e1;
    vertical-align: top;
  }}
  tr:nth-child(even) td {{
    background: #f8fafc;
  }}
  .callout {{
    background: #eff6ff;
    border-left: 4px solid #2563eb;
    padding: 10px 14px;
    border-radius: 0 6px 6px 0;
    margin: 12px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }}
  .phase-box {{
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    margin-bottom: 14px;
    overflow: hidden;
    page-break-inside: avoid;
  }}
  .phase-header {{
    background: #1e293b;
    color: #ffffff;
    padding: 8px 14px;
    font-weight: 700;
    font-size: 10.5pt;
    display: flex;
    justify-content: space-between;
  }}
  .phase-header span.tag {{
    background: #3b82f6;
    color: #fff;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 8pt;
  }}
  .phase-body {{
    padding: 10px 14px;
    background: #ffffff;
  }}
  .step-line {{
    margin-bottom: 6px;
    padding-left: 12px;
    border-left: 2px solid #93c5fd;
  }}
  .step-line strong {{
    color: #0f172a;
  }}
  .img-card {{
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 8px;
    background: #f8fafc;
    margin: 12px 0;
    page-break-inside: avoid;
  }}
  .img-card img {{
    width: 100%;
    height: auto;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }}
  .img-caption {{
    font-size: 8.5pt;
    color: #475569;
    font-weight: 600;
    margin-top: 6px;
    text-align: center;
  }}
  .two-col {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }}
  .flow-visual {{
    background: #0f172a;
    color: #f8fafc;
    padding: 14px;
    border-radius: 8px;
    font-family: Consolas, monospace;
    font-size: 8.5pt;
    line-height: 1.4;
    white-space: pre-wrap;
    margin: 10px 0;
    page-break-inside: avoid;
  }}
  .page-break {{
    page-break-before: always;
  }}
  .pill-green {{
    background: #dcfce7;
    color: #166534;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 8pt;
  }}
  .pill-red {{
    background: #fee2e2;
    color: #991b1b;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 8pt;
  }}
  .pill-blue {{
    background: #dbeafe;
    color: #1e40af;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 8pt;
  }}
</style>
</head>
<body>

<div class="cover">
  <div class="badge">Complete Architectural Millwork Specification</div>
  <h1>QuadeConnect — Project Management Module</h1>
  <h2>Deep Line-by-Line Process Workflow, ClickUp + Innergy Feature Synthesis & Role Architecture</h2>
  <div class="meta-grid">
    <div class="meta-item"><strong>Domain Reference</strong>Innergy ERP + ClickUp</div>
    <div class="meta-item"><strong>Industry Focus</strong>Architectural Millwork</div>
    <div class="meta-item"><strong>Cloud Storage</strong>AWS S3 / Box + PDF Viewer</div>
    <div class="meta-item"><strong>Security Model</strong>Role-Gated Cost Masking</div>
  </div>
</div>

<h2 class="sec-title">1. Executive Summary & Core Vision</h2>
<p>
  <strong>QuadeConnect Project Management</strong> is a complete, deep-featured project execution hub built specifically for <strong>Architectural Millwork</strong> fabrication companies. Thinking as an experienced Millwork Project Manager, a project cannot just be a simple to-do list—it must connect <strong>Contract Financials, Work Orders, Architectural Sheets, Engineering Shop Drawings, Mockup Packages, Submittals, QC Reviews, Installer Schedules, and Cloud Document Revision Loops</strong> in one unified workspace.
</p>
<div class="callout">
  <strong>Core Synthesis Formula:</strong><br>
  <strong>ClickUp Productivity Engine</strong> (Grid, Kanban, Gantt, Custom Views, Grouping, Filters, Task Dependencies) 
  <strong>+ Innergy Millwork ERP Domain</strong> (Proj No, Contract vs. Work Order Values, Sheets, Shop Drawings, Submittals, Impediments, Page/Slide Count &amp; Revision History) 
  <strong>+ S3/Box Cloud &amp; Strict RBAC Cost Hiding</strong>.
</div>

<h2 class="sec-title">2. Role-Based Access Control (RBAC) &amp; Cost Visibility Rules</h2>
<p>
  In architectural millwork, <strong>Admins</strong> manage contract values, billing percentages, and hourly pay rates, while <strong>Engineers, Drafters, QC Reviewers, and Operations Heads</strong> focus strictly on assigned projects, technical drawings, hours budgeted, and production milestones—with <strong>zero visibility into dollar costs or contract prices</strong>.
</p>

<table>
  <thead>
    <tr>
      <th>Role</th>
      <th>Project Access Scope</th>
      <th>Contract &amp; Cost Visibility</th>
      <th>Hourly Rate &amp; Pay Plan</th>
      <th>Primary Modules &amp; Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Super Admin / Admin</strong></td>
      <td><span class="pill-blue">ALL Projects</span></td>
      <td><span class="pill-green">FULL ACCESS</span><br>Sees Original Contract, Current Contract, WO Value, Billed $, Billed %, Est. Grand Total Cost</td>
      <td><span class="pill-green">FULL ACCESS</span><br>Configures hourly pay rates ($/hr) per role/user &amp; views labor cost totals</td>
      <td>Master Grid &amp; Kanban, Financials, Rate Cards, S3/Box Config, Team Allocation, All Project Tabs</td>
    </tr>
    <tr>
      <td><strong>Operations Head</strong></td>
      <td><span class="pill-blue">Assigned Set of Projects</span></td>
      <td><span class="pill-red">HIDDEN</span><br>All dollar columns stripped from Grid, Kanban &amp; Project Header</td>
      <td><span class="pill-blue">HOURS ONLY</span><br>Sees budgeted hours vs. actual hours logged (no $ rates)</td>
      <td>Assign Engineers/Crew, Manage Work Orders, Study Projects, Installer Schedule, Approve QC</td>
    </tr>
    <tr>
      <td><strong>Project Manager (PM)</strong></td>
      <td><span class="pill-blue">Assigned Set of Projects</span></td>
      <td><span class="pill-red">HIDDEN</span> (or optional Status Badge only: "Budget Up to Date")</td>
      <td><span class="pill-blue">HOURS ONLY</span><br>Plans task hour budgets &amp; monitors schedule health</td>
      <td>Manage Details, Work Orders, Sheets, Shop Drawings, Submittals, Publish Log, Client RFI Loop</td>
    </tr>
    <tr>
      <td><strong>Engineer / Drafter</strong></td>
      <td><span class="pill-blue">Assigned Set of Projects</span></td>
      <td><span class="pill-red">HIDDEN</span><br>Zero financial data returned by API</td>
      <td><span class="pill-blue">OWN HOURS</span><br>Logs hours spent on assigned Shop Drawings &amp; Study Projects</td>
      <td>View Architectural Sheets, Upload/Revise Shop Drawings, Link Work Orders, Fix QC Markups</td>
    </tr>
    <tr>
      <td><strong>QC Reviewer</strong></td>
      <td><span class="pill-blue">Assigned Set of Projects</span></td>
      <td><span class="pill-red">HIDDEN</span></td>
      <td><span class="pill-blue">OWN HOURS</span></td>
      <td>QC Review Tab, In-Browser PDF Markup, Verify Revisions, Approve/Reject Shop Drawings</td>
    </tr>
    <tr>
      <td><strong>Client / GC (External)</strong></td>
      <td><span class="pill-blue">Own Project Portal Only</span></td>
      <td><span class="pill-red">HIDDEN</span> (Except formal invoices if billing portal enabled)</td>
      <td><span class="pill-red">HIDDEN</span></td>
      <td>Upload intake files to S3/Box, View Published Drawings/Submittals, Markup PDFs, Approve/Revise</td>
    </tr>
  </tbody>
</table>

<h2 class="sec-title">3. Line-by-Line End-to-End Process Workflow (Connecting Your Flow Diagram)</h2>

<div class="img-card">
  <img src="{b64_images['flow']}" alt="Master 6-Phase Flow Diagram">
  <div class="img-caption">Reference Image 2: Master 6-Phase Process Flow Diagram Connected into QuadeConnect PM</div>
</div>

<div class="phase-box">
  <div class="phase-header">
    <span>PHASE 1: Sales &amp; CRM Intake Pipeline</span>
    <span class="tag">Lead to Project Conversion</span>
  </div>
  <div class="phase-body">
    <div class="step-line"><strong>Line 1.1 — Lead Captured:</strong> Incoming bid invitation from General Contractor (GC), Architect, Referral, or Web form is logged in CRM.</div>
    <div class="step-line"><strong>Line 1.2 — CRM Pipeline Progression:</strong> Deal moves through <code>New &rarr; Qualified &rarr; Study Project &rarr; Proposal Submitted</code>.</div>
    <div class="step-line"><strong>Line 1.3 — Study Project Evaluation:</strong> Pre-award technical study to check architectural sheets, custom wood veneers, AWI grade requirements, and specialty hardware lead times.</div>
    <div class="step-line"><strong>Line 1.4 — Decision Gate (Lead Won?):</strong> When marked <strong>WON</strong>, the system automatically:
      (a) Generates a sequential <strong>Project No.</strong> (e.g., <code>P-26-1137</code>),
      (b) Creates the <strong>Client Portal Account</strong> with restricted permissions,
      (c) Provisions the cloud storage folder tree in <strong>AWS S3 / Box</strong>, and
      (d) Fires an intake alert to Operations.
    </div>
  </div>
</div>

<div class="phase-box">
  <div class="phase-header">
    <span>PHASE 2: Operations &amp; Estimating Setup</span>
    <span class="tag">BOQ / BOM, Hours Pay Plan &amp; Team Allocation</span>
  </div>
  <div class="phase-body">
    <div class="step-line"><strong>Line 2.1 — Ops Notified of New Project Intake:</strong> Operations Head opens the newly created Project shell in QuadeConnect.</div>
    <div class="step-line"><strong>Line 2.2 — Analyze Files &amp; Estimate (Blocking = BOQ / BOM):</strong> Break down architectural plans into Bill of Quantities (casework cabinets, wall panels, reception desks, trim) and Bill of Materials.</div>
    <div class="step-line"><strong>Line 2.3 — Hours Pay &amp; Labor Budget Plan:</strong> Admin sets role hourly rates (e.g., Engineering $65/hr, CNC/Fab $45/hr, Finishing $48/hr, Install $55/hr) and allocates budgeted hours per phase. System calculates <code>Estimated Grand Total Cost</code> (visible only to Admin).</div>
    <div class="step-line"><strong>Line 2.4 — Create Project Folder &amp; Allocate Team:</strong> Ops Head assigns specific Engineers, QC Reviewers, and Field Leads to the project. Assigned staff immediately see the project in their Grid/Kanban (with all cost columns hidden).</div>
    <div class="step-line"><strong>Line 2.5 — Set Up Work Orders, Tasks &amp; Milestones:</strong> Project is subdivided into numbered <strong>Work Orders</strong> (e.g., <code>P-26-1132-011p</code>, <code>P-26-1132-025p</code>) with target submittal, fabrication, and installation dates.</div>
  </div>
</div>

<div class="phase-box">
  <div class="phase-header">
    <span>PHASE 3: Client Workspace &amp; Cloud File Intake (AWS S3 / Box)</span>
    <span class="tag">External Collaboration Portal</span>
  </div>
  <div class="phase-body">
    <div class="step-line"><strong>Line 3.1 — Dedicated Restricted Client Dashboard:</strong> Client logs into their branded portal and sees only their assigned project(s).</div>
    <div class="step-line"><strong>Line 3.2 — Client File Upload via S3 / Box:</strong> Client uploads contract drawings, architectural bulletins, specifications, and field schedules. Files stream directly to AWS S3 or Box bucket and appear linked inside the project's <strong>Files</strong> and <strong>Sheets</strong> tabs.</div>
    <div class="step-line"><strong>Line 3.3 — In-Browser PDF Opening &amp; Markup:</strong> Both internal staff and clients click any linked file to open it directly inside the QuadeConnect web viewer (powered by S3/Box signed URLs) without downloading—complete with redline annotations, measurements, and comment pins.</div>
    <div class="step-line"><strong>Line 3.4 — Live Meetings &amp; Status Tracking:</strong> Client can schedule Google Meet calls, chat with the PM, and watch live Kanban/milestone progress.</div>
  </div>
</div>

<div class="phase-box">
  <div class="phase-header">
    <span>PHASE 4: Internal Team Execution (Engineering, QC &amp; Field)</span>
    <span class="tag">Inside-Project Execution</span>
  </div>
  <div class="phase-body">
    <div class="step-line"><strong>Line 4.1 — Engineering (Sheets &rarr; Shop Drawings):</strong> Engineers review published Architectural <strong>Sheets</strong> (e.g., <code>G0.02</code>, <code>A1.01</code>) and draft detailed millwork <strong>Shop Drawings</strong> (e.g., <code>101.00 Restroom Mockup</code>, <code>102.49 Bar Counter</code>) linked to specific <strong>Work Orders</strong>.</div>
    <div class="step-line"><strong>Line 4.2 — Automated PDF Processing (Slide/Page Count &amp; Thumbnails):</strong> When a multi-page PDF is uploaded to Sheets or Shop Drawings, the backend counts total pages/slides (displayed as <code>&Sigma;9</code>, <code>&Sigma;4</code>, <code>&Sigma;3</code>, <code>&Sigma;2</code>), extracts title block metadata, and generates per-slide thumbnails.</div>
    <div class="step-line"><strong>Line 4.3 — QC Review &amp; Non-Conformance Check:</strong> Before any drawing reaches the client, QC opens it in the viewer, runs the Millwork QC Checklist (dimensions, joinery, veneer grain, hardware, ADA clearance), and either approves or flags redlines back to Engineering.</div>
    <div class="step-line"><strong>Line 4.4 — Field Team Execution:</strong> Installers follow the <strong>Installer Schedule</strong>, log daily check-ins, upload site photos, and report site blockers in the <strong>Impediments</strong> tab.</div>
  </div>
</div>

<div class="phase-box">
  <div class="phase-header">
    <span>PHASE 5: Revision Loop (REVX) &amp; Submittals Approval</span>
    <span class="tag">Version Control &amp; Immutable Archive</span>
  </div>
  <div class="phase-body">
    <div class="step-line"><strong>Line 5.1 — Publish Log &amp; Submittal Transmittal:</strong> PM selects QC-approved Shop Drawings via <strong>Publish Log</strong> and packages them into a formal <strong>Submittal</strong> for the Client/Architect.</div>
    <div class="step-line"><strong>Line 5.2 — Client Submits Revision Request (REVX):</strong> Client/Architect marks up the PDF in-browser and marks status as <code>Revise &amp; Resubmit</code> or <code>Approved as Noted</code>.</div>
    <div class="step-line"><strong>Line 5.3 — Engineering Uploads New Version Set:</strong> Engineer revises CAD drawing and uploads a new Version Set (e.g., <code>MOCKUP PACKAGE #1</code> &rarr; <code>MOCKUP PACKAGE #2</code>). The system preserves all prior versions in the <strong>Revision History</strong> panel with exact issue dates and slide counts.</div>
    <div class="step-line"><strong>Line 5.4 — QC Validates &rarr; Client Approves:</strong> QC verifies the fix; Client approves. The approved PDF is locked as an <strong>Immutable Archive in S3/Box</strong> and the linked <strong>Work Order</strong> is released to CNC/Shop Fabrication.</div>
  </div>
</div>

<div class="phase-box">
  <div class="phase-header">
    <span>PHASE 6: Finance, Progress Billing &amp; Closeout (Admin Only)</span>
    <span class="tag">Contract vs. Cost &amp; AIA Billing</span>
  </div>
  <div class="phase-body">
    <div class="step-line"><strong>Line 6.1 — Real-Time Cost Tracking:</strong> Admin tracks <code>Original Total Contract</code>, <code>Current Contract Value</code> (including change orders), <code>Work Orders Value</code>, and <code>Estimated Grand Total Cost</code> (Labor hours &times; hourly pay + materials).</div>
    <div class="step-line"><strong>Line 6.2 — Progress Billing:</strong> Tracks <code>Billed ($)</code> and <code>Billed %</code> per project and across the entire company portfolio.</div>
    <div class="step-line"><strong>Line 6.3 — Closeout &amp; Lessons Learned:</strong> Final client sign-off, as-built archive locked, retention invoiced, and lessons learned saved.</div>
  </div>
</div>

<div class="page-break"></div>

<h2 class="sec-title">4. Deep Breakdown of Reference Screens &amp; Inside-Project Modules</h2>

<h3 class="sub-title">4.1 Master Projects List — Grid View &amp; Kanban Board (Ref: Image 1 &amp; Innergy Kanban)</h3>
<div class="img-card">
  <img src="{b64_images['grid']}" alt="Projects Master Grid View">
  <div class="img-caption">Reference Image 1: Master Projects Grid View (Admin Full Financial View)</div>
</div>

<div class="two-col">
  <div>
    <strong>Admin Grid Columns (Shown in Image 1):</strong>
    <ul>
      <li><strong>Proj No.</strong> (<code>P-26-1137</code>, <code>P-26-1136</code>, <code>P-26-1132</code>)</li>
      <li><strong>Name</strong> (<code>BWI Project Oasis</code>, <code>[26019N] Omni Midland Hotel</code>)</li>
      <li><strong>Customer</strong> (<code>Whiting Turner</code>, <code>Hensel Phelps</code>, <code>Beck Group</code>)</li>
      <li><strong>Original Total Contract</strong> (e.g., <code>$6,573,906.00</code>)</li>
      <li><strong>Current Contract Value</strong> (e.g., <code>$8,838,759.00</code>)</li>
      <li><strong>Work Orders Value</strong> (e.g., <code>$4,229,775.01</code>)</li>
      <li><strong>Billed</strong> &amp; <strong>Billed %</strong> (e.g., <code>$347,137.50</code> | <code>6.79%</code>)</li>
      <li><strong>Estimated Grand Total Cost</strong> (e.g., <code>$6,278,759...</code>)</li>
      <li><strong>Aggregate Footer Totals:</strong> Sums all contract, WO, billed, and cost columns across all 243 projects.</li>
    </ul>
  </div>
  <div>
    <strong>ClickUp + Innergy Kanban View (<code>#/projects/kanban</code>):</strong>
    <ul>
      <li><strong>Toggle Switch:</strong> Top-right icons switch instantaneously between <strong>Grid View</strong>, <strong>Kanban Board</strong>, <strong>Gantt Timeline</strong>, and <strong>Calendar</strong>.</li>
      <li><strong>Kanban Columns (Millwork Stages):</strong>
        <code>Study / Pre-Bid</code> &rarr; <code>Engineering / Drafting</code> &rarr; <code>QC Review</code> &rarr; <code>Submittal Pending</code> &rarr; <code>Ready for Fab</code> &rarr; <code>In Shop Production</code> &rarr; <code>Site Installation</code> &rarr; <code>Closeout</code>.
      </li>
      <li><strong>Kanban Cards:</strong> Show Proj No., Name, Customer, PM Avatar, Due Date, Priority, and quick-badges for open Work Orders, Sheets, Shop Drawings, and Impediments (with costs hidden for non-admins).</li>
    </ul>
  </div>
</div>

<h3 class="sub-title">4.2 Inside a Project — All 11 Category Tabs Explained (Ref: Images 3, 4, 5)</h3>
<p>When a user clicks into any project (e.g., <code>P-26-1132 - [26011R] AUS Project Oasis (Austin)</code>), the top header displays the project identity, budget health status badge (<code>Budget is up to date</code>), and the <strong>Millwork Category Tab Bar</strong>:</p>

<table>
  <thead>
    <tr>
      <th>Category Tab</th>
      <th>Purpose in Architectural Millwork</th>
      <th>Key Data, Features &amp; Connections</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>1. Details</strong></td>
      <td>Central project charter, client/GC contacts, site address, and labor hour budget plan.</td>
      <td>Project No, Customer, Architect, GC, Start/End Dates, Assigned Team (Engineers, QC, Ops), Labor Hours Budget vs. Actuals, Financial Summary (Admin only).</td>
    </tr>
    <tr>
      <td><strong>2. Custom Fields</strong></td>
      <td>ClickUp-style dynamic fields tailored to architectural millwork specs.</td>
      <td>AWI Quality Grade (Economy, Custom, Premium), Veneer Cut/Species, Finish System, FSC Certification Required, Fire Rating, Hardware Supplier, Delivery Floor/Phasing.</td>
    </tr>
    <tr>
      <td><strong>3. Study Projects</strong></td>
      <td>Technical engineering research, complex joinery mockups, &amp; pre-production feasibility.</td>
      <td>Tracks engineering study hours, 3D CAD prototypes, CNC test cuts, material yield calculations, and value-engineering options before releasing formal Shop Drawings.</td>
    </tr>
    <tr>
      <td><strong>4. Work Orders (199)</strong></td>
      <td>Production &amp; installation packages breaking the contract into buildable scopes.</td>
      <td>WO Number (e.g., <code>P-26-1132-011p</code>, <code>025p</code>), Scope Name, Room/Area, Linked Shop Drawings, BOM materials, Fabrication Hours, Ship Date, Install Status.</td>
    </tr>
    <tr>
      <td><strong>5. Installer Schedule</strong></td>
      <td>Field installation crew planning, delivery staging, and site readiness calendar.</td>
      <td>Gantt/Calendar view of site deliveries, crew assignments, daily field check-in logs, floor-by-floor completion %, and punch list items.</td>
    </tr>
    <tr>
      <td><strong>6. Sheets (306 / 216)</strong></td>
      <td>Master architectural, structural, &amp; interior design contract drawings from client.</td>
      <td>Sheet No (<code>G0.00</code>, <code>G0.02</code>), Sheet Name, Version Set (<code>90 IFP</code>, <code>Bulletin 01</code>), Issue Date, PDF Slide Count (<code>&Sigma;4</code>, <code>&Sigma;3</code>), In-Browser Viewer &amp; Revision History.</td>
    </tr>
    <tr>
      <td><strong>7. Shop Drawings (52)</strong></td>
      <td>Millwork engineering CAD/PDF fabrication drawings created by internal drafters.</td>
      <td>Drawing No (<code>100.10</code>, <code>101.00</code>, <code>102.49</code>), Name (<code>RESTROOM MOCKUP</code>, <code>BAR COUNTER</code>), Version (<code>MOCKUP PACKAGE #1..#5</code>), Linked Work Order, PDF Slide Count (<code>&Sigma;9</code>, <code>&Sigma;2</code>).</td>
    </tr>
    <tr>
      <td><strong>8. Files (174 / 50)</strong></td>
      <td>Cloud document repository backed by <strong>AWS S3 / Box</strong>.</td>
      <td>Organized folders for Specs, Contracts, Cut Sheets, Client Uploads, RFIs, Photos. Pre-signed URLs open all PDFs/images directly inside the web app.</td>
    </tr>
    <tr>
      <td><strong>9. QC Review</strong></td>
      <td>Internal quality assurance gate for Shop Drawings and shop fabrication.</td>
      <td>Pending QC queue, AWI/Millwork verification checklist, PDF redline markup layer, Approve / Reject / Revise status, Reviewer audit trail.</td>
    </tr>
    <tr>
      <td><strong>10. Submittals (42)</strong></td>
      <td>Formal approval packages sent to Architect/GC (Drawings, Product Data, Physical Samples).</td>
      <td>Submittal No, Spec Section (e.g., <code>06 41 00 Custom Casework</code>), Linked Shop Drawings, Transmittal PDF generator, Ball-in-Court tracking, Architect sign-off status.</td>
    </tr>
    <tr>
      <td><strong>11. Notes (11) &amp; Impediments (7)</strong></td>
      <td>Communication threads and active blockers delaying engineering, shop, or install.</td>
      <td>Impediment severity, root cause (e.g., "Missing field dimensions from GC", "Veneer backordered"), assigned owner, days blocked, resolution log.</td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<h3 class="sub-title">4.3 Deep Dive: Sheets Grid, Sheet Viewer, Slide Counts &amp; Revision History (Ref: Images 4 &amp; 5)</h3>

<div class="img-card">
  <img src="{b64_images['sheets_grid']}" alt="Published Sheets Grid">
  <div class="img-caption">Reference Image 5: Project Sheets Grid — Showing Sheet Number, Name, Version Set, Issue Date &amp; Sheet Info (Slide Counts &Sigma;4, &Sigma;3, &Sigma;1)</div>
</div>

<div class="img-card">
  <img src="{b64_images['sheet_view']}" alt="Sheet Viewer and Revision History">
  <div class="img-caption">Reference Image 4: Inside Sheet View (G0.02) — Left Metadata &amp; Revision History Panel + Right Multi-Slide PDF Viewer with Prev/Next Slide Previews</div>
</div>

<ul>
  <li><strong>Upload &amp; Process New Sheets:</strong> Uploading a PDF to S3/Box automatically parses the document, counts the number of slides/pages inside the PDF (shown in the grid under <code>Sheet Info</code> as <code>&Sigma;4</code> = 4 slides, <code>&Sigma;3</code> = 3 slides, <code>&Sigma;1</code> = 1 slide), and generates high-res page thumbnails.</li>
  <li><strong>Manage Versions &amp; Revision History:</strong> In the Sheet View (Image 4, bottom-left), the <strong>Revision History</strong> panel tracks every architectural issuance (e.g., <code>90 IFP (now viewing) — Issued: 07/31/2026</code> vs. <code>Bulletin 01 — Issued: 08/31/2026</code>). Engineers can switch between revisions or overlay them to spot exact dimensional changes.</li>
  <li><strong>Interactive Slide Carousel in Viewer:</strong> The right-hand canvas displays the active PDF slide with left/right slide preview thumbnails (<code>&lt;</code> and <code>&gt;</code>) so users can flip through every page/slide of a multi-page PDF without leaving the page.</li>
</ul>

<h3 class="sub-title">4.4 Deep Dive: Shop Drawings Grid &amp; Work Order Connection (Ref: Image 3)</h3>

<div class="img-card">
  <img src="{b64_images['shop']}" alt="Published Shop Drawings Grid">
  <div class="img-caption">Reference Image 3: Published Shop Drawings Grid — Showing Drawing No, Mockup Package Versions, Linked Work Orders &amp; Slide Counts (&Sigma;9, &Sigma;2)</div>
</div>

<ul>
  <li><strong>Direct Work Order Linking:</strong> Every Shop Drawing row (e.g., <code>100.10 TABLE OF CONTENTS</code>, <code>101.00 RESTROOM MOCKUP</code>, <code>102.49 102.5 BAR COUNTER</code>) links directly to its production <strong>Work Order</strong> (<code>P-26-1132-011p</code>, <code>P-26-1132-025p</code>, <code>P-26-1132-022p</code>).</li>
  <li><strong>Mockup Package Versioning:</strong> Supports iterative millwork submittal packages (<code>MOCKUP PACKAGE # 1</code>, <code>MOCKUP PACKAGE # 2</code>, <code>MOCKUP PACKAGE # 5</code>) with automatic slide/page count badges (<code>&Sigma;9</code> = 9 slides in PDF, <code>&Sigma;2</code> = 2 slides in PDF).</li>
  <li><strong>Publish Log Gatekeeper:</strong> The <code>PUBLISH LOG (0/18)</code> button ensures only QC-approved shop drawings are published to the Client Portal and Field Installers.</li>
</ul>

<h2 class="sec-title">5. Complete System Architecture &amp; Database Schema Blueprint</h2>
<div class="flow-visual">
[CLIENT / ENGINEER / ADMIN BROWSER]
       │
       ▼
[API GATEWAY + RBAC COST-MASKING MIDDLEWARE]
       ├──► If Role != ADMIN: Strip (original_contract, current_contract, wo_value, billed, billed_pct, est_total_cost, hourly_rate_usd)
       │
       ├──► [PROJECT &amp; WORK ORDER SERVICE] ──► PostgreSQL (Projects, WorkOrders, StudyProjects, Tasks, Impediments, LaborHours)
       │
       ├──► [DOCUMENT &amp; CAD/PDF PIPELINE]  ──► AWS S3 / Box Storage (Pre-Signed Upload/View URLs, Immutable Revision Archives)
       │         └──► PDF Worker (PyMuPDF / PDF.js): Extracts Page/Slide Count (&Sigma;N), Generates Slide Thumbnails, Runs Title-Block OCR
       │
       └──► [QC, SUBMITTALS &amp; REVX ENGINE] ──► Annotation Layer DB (Non-destructive PDF Markups, QC Checklists, Submittal Logs)
</div>

</body>
</html>
"""

html_path = os.path.join(workspace_dir, "QuadeConnect_PM_Complete_Workflow.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML written successfully:", html_path)

