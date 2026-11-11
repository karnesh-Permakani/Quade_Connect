import os
import pymupdf as fitz

artifact_dir = r"C:\Users\MARIESWARI\.gemini\antigravity\brain\e424fa8c-acbc-485e-a214-1f1bf1c3ba4e"
workspace_dir = r"c:\Users\MARIESWARI\Desktop\c"

images = {
    "grid": os.path.join(artifact_dir, "img_projects_grid.jpg"),
    "flow": os.path.join(artifact_dir, "img_flow_diagram.png"),
    "shop": os.path.join(artifact_dir, "img_shop_drawings.jpg"),
    "sheet_view": os.path.join(artifact_dir, "img_sheet_view.jpg"),
    "sheets_grid": os.path.join(artifact_dir, "img_sheets_grid.jpg"),
}

doc = fitz.open()
W, H = 595, 842  # A4 Portrait (points)

# Color Palette
NAVY = (0.05, 0.09, 0.17)
BLUE = (0.14, 0.38, 0.90)
DARK_BLUE = (0.09, 0.20, 0.48)
TEAL = (0.05, 0.55, 0.55)
AMBER = (0.85, 0.45, 0.05)
GREEN = (0.08, 0.52, 0.25)
RED = (0.75, 0.12, 0.12)
PURPLE = (0.42, 0.20, 0.72)

DARK = (0.12, 0.16, 0.23)
GRAY = (0.40, 0.46, 0.54)
LIGHT_BG = (0.96, 0.97, 0.99)
BLUE_BG = (0.93, 0.96, 1.00)
GREEN_BG = (0.90, 0.98, 0.93)
RED_BG = (0.99, 0.91, 0.91)
AMBER_BG = (1.00, 0.96, 0.88)
WHITE = (1.0, 1.0, 1.0)
BORDER = (0.80, 0.84, 0.89)

def new_page(section_tag="QUADECONNECT PM — COMPLETE ARCHITECTURAL MILLWORK WORKFLOW"):
    page = doc.new_page(width=W, height=H)
    # Top Header Bar
    page.draw_rect(fitz.Rect(0, 0, W, 28), color=None, fill=NAVY)
    page.insert_text((32, 18), section_tag, fontsize=8, fontname="hebo", color=(0.75, 0.86, 1.0))
    page.insert_text((W - 85, 18), f"Page {len(doc)} of 12", fontsize=8, fontname="hebo", color=(0.65, 0.78, 0.95))
    # Bottom Footer Bar
    page.draw_line(fitz.Point(32, H - 26), fitz.Point(W - 32, H - 26), color=BORDER, width=0.7)
    page.insert_text((32, H - 14), "QuadeConnect Project Management | Domain: Innergy ERP + ClickUp | Architectural Millwork", fontsize=7.5, fontname="helv", color=GRAY)
    page.insert_text((W - 145, H - 14), "Confidential Technical Spec", fontsize=7.5, fontname="helv", color=GRAY)
    return page

def sec_banner(page, y, num_str, title, color=NAVY):
    page.draw_rect(fitz.Rect(32, y, W - 32, y + 24), color=None, fill=color, radius=0.08)
    page.draw_rect(fitz.Rect(36, y + 4, 68, y + 20), color=None, fill=BLUE, radius=0.15)
    page.insert_text((42, y + 15), num_str, fontsize=8.5, fontname="hebo", color=WHITE)
    page.insert_text((76, y + 16), title, fontsize=10.5, fontname="hebo", color=WHITE)
    return y + 30

def sub_banner(page, y, title, accent=BLUE):
    page.draw_rect(fitz.Rect(32, y, W - 32, y + 18), color=None, fill=BLUE_BG)
    page.draw_rect(fitz.Rect(32, y, 35, y + 18), color=None, fill=accent)
    page.insert_text((42, y + 13), title, fontsize=9.2, fontname="hebo", color=DARK_BLUE)
    return y + 23

def wrap_lines(text, max_chars):
    words = text.split(" ")
    lines, curr = [], ""
    for w in words:
        if len(curr) + len(w) + 1 <= max_chars:
            curr = (curr + " " + w).strip()
        else:
            if curr:
                lines.append(curr)
            curr = w
    if curr:
        lines.append(curr)
    return lines

def draw_para(page, y, text, x=32, width=W-64, fontsize=8.8, fontname="helv", color=DARK, lh=12.2):
    max_chars = int(width / (fontsize * 0.49))
    for ln in wrap_lines(text, max_chars):
        page.insert_text((x, y), ln, fontsize=fontsize, fontname=fontname, color=color)
        y += lh
    return y

def draw_step_card(page, y, step_code, title, bullets, accent=BLUE, bg=LIGHT_BG):
    # Calculate height first
    all_lines = []
    for b in bullets:
        w_lines = wrap_lines(b, 92)
        all_lines.append(w_lines)
    total_text_lines = sum(len(x) for x in all_lines)
    box_h = 22 + total_text_lines * 11.2 + len(bullets) * 2.5 + 6
    page.draw_rect(fitz.Rect(32, y, W - 32, y + box_h), color=BORDER, fill=bg, width=0.7, radius=0.04)
    page.draw_rect(fitz.Rect(32, y, 36, y + box_h), color=None, fill=accent)
    # Header badge
    page.draw_rect(fitz.Rect(42, y + 5, 98, y + 18), color=None, fill=accent, radius=0.15)
    page.insert_text((47, y + 14), step_code, fontsize=7.5, fontname="hebo", color=WHITE)
    page.insert_text((105, y + 14.5), title, fontsize=9.2, fontname="hebo", color=NAVY)
    cy = y + 28
    for w_lines in all_lines:
        page.draw_circle(fitz.Point(46, cy - 3), 1.8, color=accent, fill=accent)
        for idx, ln in enumerate(w_lines):
            page.insert_text((53, cy), ln, fontsize=8.2, fontname="helv", color=DARK)
            cy += 11.2
        cy += 2.5
    return y + box_h + 6

def draw_image_card(page, y, img_path, caption, max_h=195):
    if not os.path.exists(img_path):
        return y
    img_doc = fitz.open(img_path)
    pix = img_doc[0].get_pixmap()
    iw, ih = pix.width, pix.height
    avail_w = W - 76
    scale = min(avail_w / iw, max_h / ih)
    disp_w, disp_h = iw * scale, ih * scale
    x0 = 32 + (avail_w + 12 - disp_w) / 2
    page.draw_rect(fitz.Rect(32, y, W - 32, y + disp_h + 22), color=BORDER, fill=LIGHT_BG, width=0.8, radius=0.03)
    page.insert_image(fitz.Rect(x0, y + 4, x0 + disp_w, y + 4 + disp_h), filename=img_path)
    page.insert_text((40, y + disp_h + 16), caption, fontsize=7.8, fontname="hebo", color=DARK_BLUE)
    img_doc.close()
    return y + disp_h + 28

def draw_flow_node(page, x, y, w, h, title, subtitle="", fill=NAVY, text_color=WHITE, border_color=None):
    page.draw_rect(fitz.Rect(x, y, x + w, y + h), color=border_color, fill=fill, width=1.0 if border_color else 0, radius=0.1)
    page.insert_text((x + 6, y + (13 if subtitle else h/2 + 3)), title, fontsize=7.8, fontname="hebo", color=text_color)
    if subtitle:
        page.insert_text((x + 6, y + 24), subtitle, fontsize=6.8, fontname="helv", color=text_color)

def draw_arrow_down(page, x, y1, y2, color=BLUE):
    page.draw_line(fitz.Point(x, y1), fitz.Point(x, y2), color=color, width=1.3)
    page.draw_polyline([fitz.Point(x - 3.5, y2 - 4.5), fitz.Point(x, y2), fitz.Point(x + 3.5, y2 - 4.5)], color=color, width=1.3)

def draw_arrow_right(page, x1, x2, y, color=BLUE):
    page.draw_line(fitz.Point(x1, y), fitz.Point(x2, y), color=color, width=1.3)
    page.draw_polyline([fitz.Point(x2 - 4.5, y - 3.5), fitz.Point(x2, y), fitz.Point(x2 - 4.5, y + 3.5)], color=color, width=1.3)

# ==============================================================================
# PAGE 1: MASTER COVER, VISION & END-TO-END VISUAL ARCHITECTURE DIAGRAM
# ==============================================================================
p1 = new_page("PAGE 1 — EXECUTIVE BLUEPRINT & VISUAL WORKFLOW ARCHITECTURE")

# Hero Banner
p1.draw_rect(fitz.Rect(32, 36, W - 32, 148), color=None, fill=NAVY, radius=0.05)
p1.draw_rect(fitz.Rect(44, 46, 295, 62), color=BLUE, fill=DARK_BLUE, width=0.8, radius=0.15)
p1.insert_text((52, 57), "QUADECONNECT — COMPLETE WORKFLOW SPECIFICATION", fontsize=7.5, fontname="hebo", color=(0.55, 0.88, 1.0))
p1.insert_text((44, 84), "QuadeConnect Project Management", fontsize=18.5, fontname="hebo", color=WHITE)
p1.insert_text((44, 102), "ClickUp Work Management UX + Innergy Architectural Millwork ERP Domain", fontsize=10, fontname="helv", color=(0.82, 0.88, 0.98))
p1.insert_text((44, 121), "100% Connected Flow: CRM Intake -> Estimating & Hours Pay -> Master Grid & Kanban -> Inside-Project", fontsize=8, fontname="helv", color=(0.65, 0.78, 0.95))
p1.insert_text((44, 134), "11 Millwork Tabs -> S3/Box Multi-Slide PDF Viewer -> QC & Submittal Loop (REVX) -> Billing & Closeout", fontsize=8, fontname="helv", color=(0.65, 0.78, 0.95))

y = 158
y = sec_banner(p1, y, "SEC 01", "Master Visual Process Flowchart (6 Connected Lifecycle Phases)")

# Draw Visual 6-Phase Flowchart on Page 1
box_y = y + 4
p1.draw_rect(fitz.Rect(32, box_y, W - 32, box_y + 275), color=BORDER, fill=LIGHT_BG, width=0.8, radius=0.03)

# Column 1: Phases 1 & 2
draw_flow_node(p1, 44, box_y + 10, 150, 34, "PHASE 1: SALES & CRM", "Lead -> Study Project -> Won", fill=NAVY)
draw_arrow_down(p1, 119, box_y + 44, box_y + 56)
draw_flow_node(p1, 44, box_y + 56, 150, 34, "AUTO PROJECT PROVISION", "Proj No + S3/Box + Client Portal", fill=DARK_BLUE)
draw_arrow_down(p1, 119, box_y + 90, box_y + 102)
draw_flow_node(p1, 44, box_y + 102, 150, 34, "PHASE 2: OPS & ESTIMATING", "BOQ/BOM + Hours Pay Plan ($/hr)", fill=TEAL)
draw_arrow_down(p1, 119, box_y + 136, box_y + 148)
draw_flow_node(p1, 44, box_y + 148, 150, 34, "RBAC TEAM ALLOCATION", "Admin=All+$ | Eng/Ops=Assigned", fill=TEAL)
draw_arrow_down(p1, 119, box_y + 182, box_y + 194)
draw_flow_node(p1, 44, box_y + 194, 150, 34, "WORK ORDERS & MILESTONES", "Break into WOs (P-26-1132-011p)", fill=TEAL)
draw_arrow_right(p1, 194, 214, box_y + 211)

# Column 2: Phases 3 & 4
draw_flow_node(p1, 214, box_y + 10, 165, 34, "PHASE 3: CLIENT WORKSPACE", "Upload Drawings/Specs to S3/Box", fill=PURPLE)
draw_arrow_down(p1, 296, box_y + 44, box_y + 56)
draw_flow_node(p1, 214, box_y + 56, 165, 34, "PDF ENGINE & SLIDE COUNT", "Auto Count Slides (Sigma-N) & OCR", fill=PURPLE)
draw_arrow_down(p1, 296, box_y + 90, box_y + 102)
draw_flow_node(p1, 214, box_y + 102, 165, 34, "PHASE 4: SHEETS & SHOP DWGs", "Arch Sheets -> Millwork CAD Dwgs", fill=BLUE)
draw_arrow_down(p1, 296, box_y + 136, box_y + 148)
draw_flow_node(p1, 214, box_y + 148, 165, 34, "INTERNAL QC REVIEW GATE", "AWI Checklist + Redline Markups", fill=BLUE)
draw_arrow_down(p1, 296, box_y + 182, box_y + 194)
draw_flow_node(p1, 214, box_y + 194, 165, 34, "PUBLISH LOG & SUBMITTALS", "Push Approved Mockup Pkg to Client", fill=BLUE)
draw_arrow_right(p1, 379, 399, box_y + 211)

# Column 3: Phases 5 & 6
draw_flow_node(p1, 399, box_y + 10, 152, 34, "PHASE 5: REVISION LOOP", "Client Reviews PDF In-Browser", fill=AMBER)
draw_arrow_down(p1, 475, box_y + 44, box_y + 56)
draw_flow_node(p1, 399, box_y + 56, 152, 34, "CLIENT DECISION GATE", "If Revise -> New Version Set (#2)", fill=AMBER)
draw_arrow_down(p1, 475, box_y + 90, box_y + 102)
draw_flow_node(p1, 399, box_y + 102, 152, 34, "APPROVED FOR FAB (AFC)", "Immutable S3 Archive + Release WO", fill=GREEN)
draw_arrow_down(p1, 475, box_y + 136, box_y + 148)
draw_flow_node(p1, 399, box_y + 148, 152, 34, "SHOP FAB & SITE INSTALL", "Installer Schedule + Impediments", fill=GREEN)
draw_arrow_down(p1, 475, box_y + 182, box_y + 194)
draw_flow_node(p1, 399, box_y + 194, 152, 34, "PHASE 6: FINANCE & CLOSE", "Admin Billing % + Client Sign-off", fill=NAVY)

# Bottom strip inside flowchart box
p1.draw_rect(fitz.Rect(44, box_y + 236, W - 44, box_y + 266), color=BLUE, fill=BLUE_BG, width=0.8, radius=0.08)
p1.insert_text((52, box_y + 249), "CONTINUOUS REAL-TIME SYNC ACROSS ALL VIEWS:", fontsize=8, fontname="hebo", color=DARK_BLUE)
p1.insert_text((52, box_y + 260), "Master Projects Grid  |  Projects Kanban (#/projects/kanban)  |  Gantt Schedule  |  Inside-Project 11 Tabs  |  Client Portal", fontsize=7.8, fontname="helv", color=DARK)

y = box_y + 286
y = sec_banner(p1, y, "SEC 02", "Document Roadmap — What Every Section of This PDF Covers")

toc_items = [
    ("Pages 1-2:", "Executive Architecture, Your Uploaded 6-Phase Flow Diagram & Role-Based Cost Masking (Admin vs. Engineers/Ops)"),
    ("Pages 3-4:", "Line-by-Line Process Connection (Phases 1 to 6: CRM, Estimating, Hours Pay Plan, S3/Box Intake, Execution, REVX)"),
    ("Page 5:", "Master Projects Hub — Grid View (Ref Image 1) & ClickUp/Innergy Kanban Board (app.innergy.com/#/projects/kanban)"),
    ("Page 6:", "Inside a Project — Deep Breakdown of All 11 Architectural Millwork Tabs (Details, Study Projects, Work Orders, etc.)"),
    ("Pages 7-8:", "Sheets Module Deep Dive (Ref Images 4 & 5) — Grid, Multi-Slide PDF Viewer, Slide Counts (Sigma-N) & Revision History"),
    ("Page 9:", "Shop Drawings Module Deep Dive (Ref Image 3) — Mockup Packages, Work Order Links & Publish Log Gatekeeper"),
    ("Pages 10-12:", "Work Orders, Study Projects, QC Review, Submittals, S3/Box Pipeline, Database ER Model & Feature Comparison Matrix")
]
for pg_lbl, desc in toc_items:
    p1.insert_text((38, y + 10), pg_lbl, fontsize=8.3, fontname="hebo", color=BLUE)
    p1.insert_text((98, y + 10), desc, fontsize=8.2, fontname="helv", color=DARK)
    y += 14.5

# ==============================================================================
# PAGE 2: UPLOADED FLOW DIAGRAM & ROLE-BASED ACCESS CONTROL (RBAC)
# ==============================================================================
p2 = new_page("PAGE 2 — UPLOADED FLOW DIAGRAM & ROLE-BASED ACCESS CONTROL (RBAC)")
y = 38
y = sec_banner(p2, y, "SEC 03", "Your Uploaded 6-Phase Flow Diagram & System Mapping")
y = draw_image_card(p2, y + 2, images["flow"], "Reference Image 2: Your Uploaded 6-Phase Flow Diagram (Sales/CRM -> Ops/Estimating -> Client Workspace -> Execution -> REVX -> Finance)", max_h=240)

y = sec_banner(p2, y, "SEC 04", "Role-Based Access Control (RBAC) & Strict Cost/Pay Visibility Rules")
y = draw_para(p2, y,
    "As required for QuadeConnect: Admins have unrestricted access to all projects, contract financials, billing percentages, and hourly pay rates. Engineers, Drafters, QC Reviewers, and Operations Heads are strictly limited to the specific set of projects they work on, and ALL cost/contract dollar values are stripped at the API level.",
    fontsize=8.6, lh=11.8)
y += 4

# Detailed RBAC Table
cols = [32, 122, 218, 345, 445, W - 32]
headers = ["User Role", "Project Access Scope", "Contract & Cost Visibility", "Hours Pay & Labor Plan", "Allowed Modules & Actions"]
p2.draw_rect(fitz.Rect(32, y, W - 32, y + 18), color=None, fill=NAVY)
for i, h_text in enumerate(headers):
    p2.insert_text((cols[i] + 4, y + 12), h_text, fontsize=7.6, fontname="hebo", color=WHITE)
y += 18

rbac_rows = [
    ("Super Admin / Admin", "ALL Projects (100% Portfolio)", "VISIBLE: Original Contract, Current Contract, WO Value, Billed $, Billed %, Est. Grand Total Cost", "VISIBLE: Sets $/hr pay rates per trade & views total labor $", "Create Projects, Manage Budgets, S3/Box Config, Rate Cards, All 11 Tabs"),
    ("Operations Head", "Assigned Set of Projects Only", "HIDDEN: Zero dollar or billing columns shown in Grid or Header", "HOURS ONLY: Views budgeted hours vs. actual logged hours", "Allocate Team, Manage Study Projects, Work Orders, Installer Schedule, QC"),
    ("Project Manager", "Assigned Set of Projects Only", "HIDDEN: Sees only non-dollar badge ('Budget is up to date')", "HOURS ONLY: Tracks engineering & shop task hours vs plan", "Manage Details, Sheets, Shop Drawings, Submittals, Publish Log, RFIs"),
    ("Engineer / Drafter", "Assigned Set of Projects Only", "HIDDEN: Stripped by backend API middleware", "OWN HOURS: Logs hours on assigned drawings & study projects", "Read Sheets, Upload Shop Drawings, Link Work Orders, Fix QC Redlines"),
    ("QC Reviewer", "Assigned Set of Projects Only", "HIDDEN: Stripped by backend API middleware", "OWN HOURS: Logs QC inspection hours", "Open QC Queue, Run Millwork Checklists, Add PDF Redlines, Approve/Reject"),
    ("Field / Installer", "Assigned Set of Projects Only", "HIDDEN: Stripped by backend API middleware", "OWN HOURS: Daily check-in/out & site logs", "View Installer Schedule, Read Published Drawings, Log Site Impediments"),
    ("Client (External)", "Own Project Portal Only", "HIDDEN: Sees only their scope (unless Invoice Portal enabled)", "HIDDEN: Never sees internal hours or rates", "Upload Intake Files (S3/Box), View Published PDFs, Markup, Approve REVX")
]

for idx, r in enumerate(rbac_rows):
    rh = 32
    bg = LIGHT_BG if idx % 2 == 0 else WHITE
    p2.draw_rect(fitz.Rect(32, y, W - 32, y + rh), color=BORDER, fill=bg, width=0.5)
    for ci, val in enumerate(r):
        cw = cols[ci+1] - cols[ci] - 6
        lines = wrap_lines(val, int(cw / 3.7))
        fn = "hebo" if ci == 0 else "helv"
        clr = RED if "HIDDEN" in val else (GREEN if "VISIBLE" in val else DARK)
        for li, ln in enumerate(lines[:3]):
            p2.insert_text((cols[ci] + 4, y + 10 + li * 9.5), ln, fontsize=7.1, fontname=fn if li == 0 else "helv", color=clr)
    y += rh

y += 8
p2.draw_rect(fitz.Rect(32, y, W - 32, y + 48), color=BLUE, fill=BLUE_BG, width=0.8, radius=0.05)
p2.insert_text((40, y + 14), "HOW BACKEND API ENFORCES COST HIDING & PROJECT SCOPING:", fontsize=8.3, fontname="hebo", color=DARK_BLUE)
p2.insert_text((40, y + 26), "1. Query Scoping: SELECT * FROM projects WHERE id IN (SELECT project_id FROM project_assignments WHERE user_id = current_user.id)", fontsize=7.6, fontname="helv", color=DARK)
p2.insert_text((40, y + 38), "2. DTO Serializer Guard: If user.role != 'ADMIN', strip [original_contract, current_contract, wo_value, billed, billed_pct, est_cost, hourly_rate].", fontsize=7.6, fontname="helv", color=DARK)

# ==============================================================================
# PAGE 3: DEEP LINE-BY-LINE WORKFLOW — PHASES 1, 2 & 3
# ==============================================================================
p3 = new_page("PAGE 3 — DEEP LINE-BY-LINE PROCESS WORKFLOW (PHASES 1, 2 & 3)")
y = 38
y = sec_banner(p3, y, "PHASE 1", "Sales & CRM Pipeline -> Pre-Bid Study Project -> Project Creation", color=NAVY)

p1_steps = [
    ("STEP 1.1", "Lead Capture & Millwork Bid Intake", [
        "Incoming bid opportunities arrive via General Contractors (Whiting Turner, Hensel Phelps, Beck Group), Architects, Referrals, or Website.",
        "Captures Customer Name, Project Location, Bid Due Date, Architectural Specification Sections (e.g., CSI Division 06 40 00 Architectural Woodwork), and preliminary drawing links."
    ]),
    ("STEP 1.2", "CRM Pipeline Progression & Study Project Trigger", [
        "Deal progresses through CRM stages: New Lead -> Qualified -> Study Project / Estimating -> Proposal Sent -> Negotiation.",
        "For complex custom millwork (curved reception desks, acoustic wall panels, exotic veneers), estimator triggers a 'Study Project' to analyze joinery, CNC feasibility, and material waste factors."
    ]),
    ("STEP 1.3", "Decision Gate: Lead Won? -> Automated Project Provisioning", [
        "If LOST: Deal archived with loss reason code for historical estimating analytics.",
        "If WON: System automatically creates a Master Project Record with sequential Project No. (e.g., P-26-1137), provisions the AWS S3 / Box cloud folder tree, creates the restricted Client Portal account, and notifies Operations Head."
    ])
]
for code, title, b_list in p1_steps:
    y = draw_step_card(p3, y, code, title, b_list, accent=NAVY)

y += 4
y = sec_banner(p3, y, "PHASE 2", "Operations & Estimating Setup (BOQ/BOM, Hours Pay Plan & Team Allocation)", color=TEAL)

p2_steps = [
    ("STEP 2.1", "Operations Intake, BOQ / BOM Breakdown & Hours Pay Plan", [
        "Operations Head & Estimator review intake files and generate the Bill of Quantities (BOQ) and Bill of Materials (BOM: substrates, veneers, laminates, solid surface, hardware).",
        "Admin configures the Hours Pay Plan: sets hourly pay rates ($/hr) per department (Engineering/Drafting, CNC Machining, Assembly/Cabinetmaking, Finishing, Site Installation) and assigns budgeted hours per phase.",
        "System computes Estimated Grand Total Cost = (Budgeted Hours x Hourly Rate) + Material BOM Cost + Subcontractor/Overhead allocation (visible strictly to Admin)."
    ]),
    ("STEP 2.2", "Project Folder Setup & Role-Based Team Allocation", [
        "S3 / Box auto-creates subfolders: /Sheets, /Shop-Drawings, /Work-Orders, /Submittals, /QC-Reviews, /Study-Projects, /Files, and /Client-Uploads.",
        "Operations Head assigns the dedicated Project Manager, Lead Engineers/Drafters, QC Reviewer, and Field Superintendent.",
        "RBAC immediately grants those assigned users access to this project in their Grid and Kanban views—while hiding all contract and cost columns."
    ]),
    ("STEP 2.3", "Work Order Breakdown & Milestone Scheduling", [
        "Project is broken down into buildable Work Orders (e.g., P-26-1132-011p Table of Contents, P-26-1132-025p Restroom Mockup, P-26-1132-022p Bar Counter).",
        "ClickUp-style task dependencies and milestones are linked: Sheets Review -> Shop Drawing Drafting -> QC Review -> Client Submittal -> CNC Fabrication -> Site Installation."
    ])
]
for code, title, b_list in p2_steps:
    y = draw_step_card(p3, y, code, title, b_list, accent=TEAL)

y += 4
y = sec_banner(p3, y, "PHASE 3", "Client Workspace & Cloud Document Intake (AWS S3 / Box)", color=PURPLE)

p3_steps = [
    ("STEP 3.1", "Restricted Client Portal & Direct S3 / Box File Uploads", [
        "Client logs into their dedicated workspace and uploads architectural drawing sets (IFP, Bulletins, Addenda), finish schedules, and hardware cutsheets.",
        "Files upload via pre-signed URLs directly to AWS S3 or Box, automatically linking to the project's Files and Sheets tabs and notifying the PM."
    ]),
    ("STEP 3.2", "In-Browser PDF Opening, Markup & Live Progress Tracking", [
        "All linked S3/Box files open directly inside the QuadeConnect web application (zero local software required) with tools to mark up redlines, schedule Google Meet calls, and track live Kanban progress."
    ])
]
for code, title, b_list in p3_steps:
    y = draw_step_card(p3, y, code, title, b_list, accent=PURPLE)

# ==============================================================================
# PAGE 4: DEEP LINE-BY-LINE WORKFLOW — PHASES 4, 5 & 6
# ==============================================================================
p4 = new_page("PAGE 4 — DEEP LINE-BY-LINE PROCESS WORKFLOW (PHASES 4, 5 & 6)")
y = 38
y = sec_banner(p4, y, "PHASE 4", "Team Execution Inside the Project (Engineering, QC & Field Teams)", color=BLUE)

p4_steps = [
    ("STEP 4.1", "Engineering Execution: Architectural Sheets -> Millwork Shop Drawings", [
        "Engineers open the project's Sheets tab to study contract drawings (e.g., G0.02 Project Information, ADA Standards, Floor Plans) and field dimensions.",
        "Engineers produce detailed CAD Shop Drawings (elevations, sections, joinery details, panel layouts, hardware callouts) and upload PDFs to the Shop Drawings tab linked to specific Work Orders.",
        "Automated PDF Processor parses every uploaded PDF: extracts total slide/page count (displayed as Sigma-9, Sigma-4, Sigma-2), renders high-res page thumbnails, and logs the Version Set."
    ]),
    ("STEP 4.2", "Internal QC Review Gate (Checklist + Redline Verification)", [
        "Uploaded Shop Drawings enter 'Pending QC Review'. The QC Reviewer opens the drawing in the split-pane viewer and verifies it against the Millwork QC Checklist (dimensions, AWI grade, veneer grain matching, edge banding, hardware clearances, blocking).",
        "If errors exist, QC draws non-destructive redlines directly on the PDF slide and marks status 'QC Rejected' -> Engineer is notified to upload a corrected file.",
        "If passed, QC marks 'QC Approved' -> Drawing moves to the Publish Log queue."
    ]),
    ("STEP 4.3", "Field Team Execution: Installer Schedule, Daily Logs & Impediments", [
        "Field crews view the Installer Schedule tab, log daily check-in/out hours, upload site readiness photos, and log any site blockers in the Impediments tab (e.g., 'GC drywall not ready on Level 3').",
        "All engineering, QC, and field updates synchronize in real time with the Master Project Grid, Kanban Board, and Client Progress Tracker."
    ])
]
for code, title, b_list in p4_steps:
    y = draw_step_card(p4, y, code, title, b_list, accent=BLUE)

y += 4
y = sec_banner(p4, y, "PHASE 5", "Revision Loop (REVX), Version History & Submittal Sign-Off", color=AMBER)

p5_steps = [
    ("STEP 5.1", "Publish Log -> Client Submittal & Revision Request (REVX)", [
        "PM selects QC-approved Shop Drawings in the Publish Log (e.g., PUBLISH LOG 0/18) and issues a formal Submittal package (e.g., MOCKUP PACKAGE #1) to the Client/Architect.",
        "Client reviews the multi-slide PDF in-browser. If changes are needed, the client pins redline annotations and submits a Revision Request (REVX)."
    ]),
    ("STEP 5.2", "Engineering Version Update -> QC Validation -> Immutable Archive", [
        "Engineer reviews the client's REVX redlines, updates the CAD drawing, and uploads a new Version Set (e.g., MOCKUP PACKAGE #2).",
        "The previous version remains permanently accessible in the bottom-left Revision History panel (with side-by-side diff comparison and slide counts).",
        "QC validates the revised drawing -> Client re-reviews and clicks Approve -> System locks the PDF as an Immutable Archive in S3/Box and releases the linked Work Order for CNC & Shop Fabrication."
    ])
]
for code, title, b_list in p5_steps:
    y = draw_step_card(p4, y, code, title, b_list, accent=AMBER)

y += 4
y = sec_banner(p4, y, "PHASE 6", "Finance, Progress Billing & Project Closeout (Admin Only)", color=GREEN)

p6_steps = [
    ("STEP 6.1", "Real-Time Budget vs. Actual Cost Tracking (Admin View)", [
        "Admin monitors Original Total Contract, Approved Change Orders, Current Contract Value, Work Orders Value, and Estimated Grand Total Cost (actual logged hours x hourly pay rate + material POs)."
    ]),
    ("STEP 6.2", "Progress Billing (Billed $ & Billed %) & Closeout Archive", [
        "Generates AIA-style progress billing invoices, updates Billed ($) and Billed % in the Master Grid, captures final Client Sign-Off, and archives Lessons Learned."
    ])
]
for code, title, b_list in p6_steps:
    y = draw_step_card(p4, y, code, title, b_list, accent=GREEN)

# ==============================================================================
# PAGE 5: MASTER PROJECTS HUB — GRID VIEW & KANBAN BOARD
# ==============================================================================
p5 = new_page("PAGE 5 — MASTER PROJECTS HUB: GRID VIEW & KANBAN BOARD")
y = 38
y = sec_banner(p5, y, "SEC 05", "Master Projects Grid View (Ref: Image 1 — Admin Full Financial View)")
y = draw_image_card(p5, y + 2, images["grid"], "Reference Image 1: Innergy Master Projects Grid View — Proj No, Name, Customer, Contract Values, Work Orders Value, Billed $ & %", max_h=185)

y = sub_banner(p5, y, "Column-by-Column Specification of the Master Projects Grid")
grid_cols_spec = [
    ("1. Proj No. (Sortable / Filterable):", "Unique project identifier (e.g., P-26-1137, P-26-1136, P-26-1132). Clicking opens the 11-tab Project Hub."),
    ("2. Name (Searchable):", "Includes internal job code + descriptive title (e.g., [26011R] AUS Project Oasis (Austin), [26019N] Omni Midland Hotel)."),
    ("3. Customer (Groupable):", "General Contractor or Owner (e.g., Whiting Turner - DC, Beck Group - Dallas, Hensel Phelps - Austin). Drag header to group by Customer."),
    ("4. Original Total Contract [ADMIN ONLY]:", "Initial signed base contract amount (e.g., $6,573,906.00; portfolio footer sum = $194,573,602.48)."),
    ("5. Current Contract Value [ADMIN ONLY]:", "Original Contract + Approved Change Orders (e.g., $8,838,759.00; portfolio footer sum = $229,804,78...)."),
    ("6. Work Orders Value [ADMIN ONLY]:", "Cumulative dollar value of issued production Work Orders (e.g., $5,114,150.01; portfolio sum = $195,337,262.87)."),
    ("7. Billed & Billed % [ADMIN ONLY]:", "Total invoiced to date ($347,137.50) and percentage billed against Current Contract (6.79%, 50%, 100%)."),
    ("8. Estimated Grand Total Cost [ADMIN ONLY]:", "Projected total cost combining Labor (Hours x Pay Rate) + Materials + Overhead ($3,812,367.00).")
]
for t, d in grid_cols_spec:
    p5.insert_text((36, y + 9), t, fontsize=8, fontname="hebo", color=NAVY)
    p5.insert_text((210, y + 9), d, fontsize=7.8, fontname="helv", color=DARK)
    y += 14

y += 6
y = sec_banner(p5, y, "SEC 06", "Projects Kanban View (Ref: app.innergy.com/#/projects/kanban + ClickUp UX)")
y = draw_para(p5, y,
    "Clicking the Kanban icon in the top-right switcher transforms the Projects Grid into an interactive ClickUp + Innergy Kanban Board (#/projects/kanban). Projects move across architectural millwork lifecycle columns via drag-and-drop:",
    fontsize=8.5, lh=11.5)
y += 4

# Visual Kanban Board Mockup on Page 5
k_cols = [
    ("1. STUDY / PRE-BID", TEAL, ["P-26-1140 Lobby", "Veneer yield study", "2 Study Items"]),
    ("2. ENGINEERING", BLUE, ["P-26-1137 BWI Oasis", "216 Sheets | 52 Dwgs", "PM: R. Redmond"]),
    ("3. QC & SUBMITTAL", PURPLE, ["P-26-1132 AUS Oasis", "Mockup Pkg #5 Out", "42 Submittals"]),
    ("4. SHOP PRODUCTION", AMBER, ["P-26-1135 BNA Oasis", "199 Work Orders", "CNC & Cabinet Assy"]),
    ("5. SITE INSTALL", GREEN, ["P-26-1133 Samsung", "Installer Crew A", "100% Billed / Close"])
]
kx = 32
kw = (W - 64 - 16) / 5
for k_title, k_clr, k_cards in k_cols:
    p5.draw_rect(fitz.Rect(kx, y, kx + kw, y + 110), color=BORDER, fill=LIGHT_BG, width=0.7, radius=0.04)
    p5.draw_rect(fitz.Rect(kx, y, kx + kw, y + 18), color=None, fill=k_clr, radius=0.04)
    p5.insert_text((kx + 4, y + 12), k_title, fontsize=6.8, fontname="hebo", color=WHITE)
    # Card 1 inside column
    p5.draw_rect(fitz.Rect(kx + 4, y + 24, kx + kw - 4, y + 72), color=BORDER, fill=WHITE, width=0.6, radius=0.04)
    p5.insert_text((kx + 7, y + 35), k_cards[0], fontsize=7, fontname="hebo", color=NAVY)
    p5.insert_text((kx + 7, y + 47), k_cards[1], fontsize=6.5, fontname="helv", color=DARK)
    p5.insert_text((kx + 7, y + 59), k_cards[2], fontsize=6.5, fontname="helv", color=BLUE)
    # Card 2 placeholder
    p5.draw_rect(fitz.Rect(kx + 4, y + 77, kx + kw - 4, y + 104), color=BORDER, fill=WHITE, width=0.5, radius=0.04)
    p5.insert_text((kx + 7, y + 88), "+ Drag Card Here", fontsize=6.3, fontname="helv", color=GRAY)
    p5.insert_text((kx + 7, y + 98), "WIP Limit & Filters", fontsize=6.0, fontname="helv", color=GRAY)
    kx += kw + 4

y += 118
p5.insert_text((32, y + 8), "Kanban Capabilities:", fontsize=8.2, fontname="hebo", color=NAVY)
p5.insert_text((120, y + 8), "Swimlanes by Customer / PM / Priority  |  Card Counters (Sheets, Shop Drawings, WOs, Impediments)  |  Cost Badges Hidden for Engineers", fontsize=7.8, fontname="helv", color=DARK)

# ==============================================================================
# PAGE 6: INSIDE A PROJECT — ALL 11 MILLWORK CATEGORY TABS
# ==============================================================================
p6 = new_page("PAGE 6 — INSIDE A PROJECT: ALL 11 ARCHITECTURAL MILLWORK CATEGORY TABS")
y = 38
y = sec_banner(p6, y, "SEC 07", "Inside-Project Persistent Header & Role-Based Financial Pills")

# Draw Mock Project Header Bar
p6.draw_rect(fitz.Rect(32, y, W - 32, y + 66), color=BORDER, fill=WHITE, width=0.9, radius=0.04)
p6.insert_text((40, y + 14), "Projects > [26011R] AUS Project Oasis (Austin) > Shop Drawings > Grid", fontsize=7.5, fontname="helv", color=BLUE)
p6.insert_text((40, y + 30), "P-26-1132 - [26011R] AUS Project Oasis (Austin)", fontsize=12, fontname="hebo", color=NAVY)
p6.draw_rect(fitz.Rect(W - 135, y + 16, W - 40, y + 32), color=None, fill=LIGHT_BG, radius=0.1)
p6.insert_text((W - 128, y + 27), "Budget is up to date", fontsize=7.5, fontname="hebo", color=DARK)
# Financial Pills (Admin Only)
p6.draw_rect(fitz.Rect(40, y + 36, 182, y + 50), color=None, fill=BLUE_BG, radius=0.1)
p6.insert_text((45, y + 46), "Original Contract Value: $363,375.00", fontsize=7, fontname="hebo", color=DARK_BLUE)
p6.draw_rect(fitz.Rect(188, y + 36, 338, y + 50), color=None, fill=BLUE_BG, radius=0.1)
p6.insert_text((193, y + 46), "Current Contract Value: $5,114,150.00", fontsize=7, fontname="hebo", color=DARK_BLUE)
p6.draw_rect(fitz.Rect(344, y + 36, 488, y + 50), color=None, fill=BLUE_BG, radius=0.1)
p6.insert_text((349, y + 46), "Work Orders Value: $5,114,150.01", fontsize=7, fontname="hebo", color=DARK_BLUE)
# Tab strip
p6.insert_text((40, y + 61), "Details | Custom Fields | Study Projects | 199 Work Orders | Installer Schedule | 306 Sheets | 52 Shop Drawings | 174 Files | QC Review | 42 Submittals | 7 Impediments", fontsize=6.9, fontname="hebo", color=BLUE)

y += 74
y = sec_banner(p6, y, "SEC 08", "Deep Functional Breakdown of All 11 Inside-Project Category Tabs")

tabs_detail = [
    ("1. Details Tab", "Project Overview, Contacts & Hours Pay Plan",
     "Stores Project No, Name, Customer, Architect, GC, Site Address, Contract Dates, Assigned Team (PM, Engineers, QC, Installers), and the Hours Pay Budget (Engineering hrs, CNC/Fab hrs, Finishing hrs, Install hrs). Admin sees full financial margin summary; Engineers see only scope & hours."),
    ("2. Custom Fields Tab", "Dynamic Architectural Millwork Specifications",
     "ClickUp-style customizable fields: AWI Quality Grade (Premium/Custom/Economy), Wood Veneer Species & Cut (Plain Sliced White Oak, Rift Walnut), Finish System (Conversion Varnish, Stain Match), Substrate (MDF, Particleboard, Fire-Rated), Hardware Brand (Blum, Hafele), and FSC Chain-of-Custody."),
    ("3. Study Projects Tab", "Pre-Engineering R&D, Mockup Studies & Value Engineering",
     "Dedicated space for complex millwork engineering studies before releasing production drawings: 3D solid modeling trials, custom knife/molding profile studies, curved reception desk framing tests, veneer flitch yield studies, and value-engineering options."),
    ("4. Work Orders Tab (199)", "Buildable Production Scopes & Shop Floor Packages",
     "Divides the contract into numbered Work Orders (e.g., P-26-1132-011p, 025p, 022p). Tracks WO status (Draft -> Engineering -> Approved -> In CNC/Fab -> Shipped -> Installed), linked Shop Drawings, BOM material status, and budgeted vs. actual shop hours."),
    ("5. Installer Schedule Tab", "Field Delivery Staging, Crew Calendar & Site Readiness",
     "Interactive Gantt and Calendar timeline for field installation teams. Tracks floor-by-floor delivery dates, assigned installation crews, daily site check-in/out logs, field measurements, and final punch-list completion."),
    ("6. Sheets Tab (306 / 216)", "Client / Architect Contract Drawings & Bulletins",
     "Holds all architectural, structural, and interior design sheets (G0.00, G0.02, A1.01). Features 'UPLOAD AND PROCESS NEW SHEETS', 'MANAGE VERSIONS' (90 IFP, Bulletin 01), 'PUBLISH LOG', automatic PDF slide counting (Sigma-4, Sigma-3), and split-pane Revision History viewer."),
    ("7. Shop Drawings Tab (52)", "Internal Millwork CAD Fabrication Drawings",
     "Holds millwork engineering drawings (100.10 Table of Contents, 101.00 Restroom Mockup, 102.49 Bar Counter) grouped by Mockup Package versions (#1..#5) and linked directly to Work Orders with multi-slide PDF viewing (Sigma-9, Sigma-2)."),
    ("8. Files Tab (174 / 58)", "AWS S3 / Box Cloud Document Repository",
     "Structured cloud folders for Project Specifications, Signed Contracts, Hardware Schedules, Finish Sample Photos, Field Verification Photos, and Client Uploads. Every file opens in-browser via secure S3/Box signed URLs."),
    ("9. QC Review Tab", "Internal Quality Control Gate & Checklist Verification",
     "Central queue for QC Reviewers to inspect drafted Shop Drawings and physical shop mockups. Includes standardized AWI/Millwork checklists, non-destructive PDF redline tools, rejection/resubmission tracking, and pass/fail audit logs."),
    ("10. Submittals Tab (42)", "Formal Architect / GC Submittal Packages & Sign-Offs",
     "Packages approved Shop Drawings, Product Data cutsheets, and physical veneer/laminate samples into numbered Submittals with automated transmittal cover sheets, Ball-in-Court tracking, and Architect approval stamps."),
    ("11. Notes (11) & Impediments (7)", "Contextual Project Threads & Jobsite/Shop Blockers",
     "Tracks active impediments delaying progress (e.g., 'Missing field dimensions in Lobby', 'Architect finish selection pending', 'GC site elevator unavailable') with priority, owner, and days-blocked counter.")
]

for tab_name, sub_t, desc in tabs_detail:
    p6.draw_rect(fitz.Rect(32, y, W - 32, y + 36), color=BORDER, fill=LIGHT_BG, width=0.6, radius=0.03)
    p6.draw_rect(fitz.Rect(32, y, 148, y + 36), color=None, fill=NAVY, radius=0.03)
    p6.insert_text((38, y + 14), tab_name, fontsize=8, fontname="hebo", color=WHITE)
    p6.insert_text((38, y + 25), sub_t[:26], fontsize=6.5, fontname="helv", color=(0.7, 0.85, 1.0))
    lines = wrap_lines(desc, 86)
    for li, ln in enumerate(lines[:3]):
        p6.insert_text((154, y + 11 + li * 9.5), ln, fontsize=7.3, fontname="helv", color=DARK)
    y += 39.5

# ==============================================================================
# PAGE 7: SHEETS MODULE DEEP DIVE — GRID VIEW & SLIDE COUNTS (REF IMAGE 5)
# ==============================================================================
p7 = new_page("PAGE 7 — SHEETS MODULE DEEP DIVE: GRID VIEW & VERSION SETS (REF IMAGE 5)")
y = 38
y = sec_banner(p7, y, "SEC 09", "Published Sheets Grid View & Automated PDF Processing (Ref: Image 5)")
y = draw_image_card(p7, y + 2, images["sheets_grid"], "Reference Image 5: Published Sheets Grid (P-26-1137 BWI Project Oasis) — 216 Sheets, Version Sets & Slide Counts (Sigma-4, Sigma-3, Sigma-1)", max_h=195)

y = sub_banner(p7, y, "Step-by-Step Workflow Inside the Sheets Grid")
sheets_steps = [
    ("STEP 1", "Upload & Process New Sheets (S3 / Box + OCR Title Block Scan)", [
        "Clicking [UPLOAD AND PROCESS NEW SHEETS] opens the drag-and-drop uploader connected to AWS S3 / Box.",
        "When an architectural PDF package is uploaded, the backend PDF worker automatically counts the slides/pages inside each PDF, generates 300-DPI slide thumbnails, and runs OCR on the title block to extract Sheet Number (G0.00, G0.01, G0.02, G0.10, G0.20, G1.01) and Sheet Name (COVER SHEET, SHEET INDEX, PROJECT INFORMATION, ADA STANDARDS, RESPONSIBILITY MATRIX)."
    ]),
    ("STEP 2", "Understanding the 'Sheet Info' Column Badges (Slide Counts & Icons)", [
        "Sigma Badge (Sigma-4, Sigma-3, Sigma-1): Shows exact number of slides/pages inside that sheet's PDF version history so engineers immediately know how many slides exist.",
        "3D Cube Icon: Indicates linked 3D CAD / BIM reference model.",
        "Pushpin Icon (Orange when active, e.g., on G0.20): Indicates active pinned markups, RFIs, or callouts placed on that sheet.",
        "Document / Location Pin Icons: Shows linked Work Orders, Submittals, or floor-plan location markers."
    ]),
    ("STEP 3", "Manage Versions (90 IFP, Bulletin 01, Bulletin 02, 100% CD)", [
        "Clicking [MANAGE VERSIONS] allows the PM to create and organize architectural issuance sets (e.g., '90 IFP' issued 07/31/2026 vs. 'Bulletin 01' issued 08/31/2026).",
        "When a revised sheet (like G0.00 or G1.01 in Bulletin 01) is uploaded with the same Sheet Number, QuadeConnect stacks it on top of the previous version ('90 IFP') and increments the Revision History counter."
    ]),
    ("STEP 4", "Publish Log (0/5) — Controlled Release to Team & Client", [
        "Newly processed sheets remain in staging until the PM reviews and clicks [PUBLISH LOG (0/5)], ensuring field crews and engineers only build from verified architectural issuances."
    ])
]
for code, title, b_list in sheets_steps:
    y = draw_step_card(p7, y, code, title, b_list, accent=BLUE)

# ==============================================================================
# PAGE 8: SHEET VIEWER, MULTI-SLIDE CAROUSEL & REVISION HISTORY (REF IMAGE 4)
# ==============================================================================
p8 = new_page("PAGE 8 — INSIDE SHEET VIEW: MULTI-SLIDE PDF VIEWER & REVISION HISTORY (REF IMAGE 4)")
y = 38
y = sec_banner(p8, y, "SEC 10", "Inside Sheet View — Metadata, Revision History & Slide Viewer (Ref: Image 4)")
y = draw_image_card(p8, y + 2, images["sheet_view"], "Reference Image 4: Inside Sheet View (G0.02 Project Information) — Left Metadata & Revision History + Right Multi-Slide PDF Canvas", max_h=205)

y = sub_banner(p8, y, "Detailed Breakdown of the Split-Pane Sheet Viewer (Line-by-Line from Image 4)")

viewer_steps = [
    ("LEFT PANEL", "Sheet Metadata Editor & Version Set Selector", [
        "Sheet Number * [G0.02]: Editable text field for AIA sheet code.",
        "Sheet Name [PROJECT INFORMATION]: Editable descriptive sheet title.",
        "Version Set * [90 IFP]: Dropdown selector allowing instant switching between '90 IFP', 'Bulletin 01', '100% CD', or 'ASI-01'.",
        "Tags [Search...]: Add custom filter tags (e.g., 'Millwork Scope', 'Lobby', 'ADA', 'Restrooms') and click [SAVE CHANGES]."
    ]),
    ("BOTTOM LEFT", "Complete Revision History Timeline & Version Comparison", [
        "Displays the chronological Revision History list for this specific sheet:",
        "   • 90 IFP (now viewing) — Issued: 07/31/2026",
        "   • Bulletin 01 — Issued: 08/31/2026 (if applicable)",
        "Clicking any historical revision immediately loads that version's PDF into the right-hand viewer and enables Side-by-Side or Red/Blue Overlay Diff Comparison to spot architectural changes."
    ]),
    ("RIGHT CANVAS", "In-Browser Multi-Slide PDF Viewer with Prev/Next Slide Thumbnails", [
        "Streams the PDF directly from AWS S3 / Box using pre-signed URLs so it opens inside the website with zero download delay.",
        "Slide Count & Carousel Navigation: Shows miniature preview thumbnails of the Previous Slide (<) on the left and Next Slide (>) on the right, plus 'Slide X of Y' counter so users can flip through every slide/page inside a multi-page PDF.",
        "Interactive Markup Layer: Zoom, pan, calibrate scale measurements, drop Work Order pins, highlight millwork elevations, and add text/redline annotations."
    ])
]
for code, title, b_list in viewer_steps:
    y = draw_step_card(p8, y, code, title, b_list, accent=DARK_BLUE)

# ==============================================================================
# PAGE 9: SHOP DRAWINGS MODULE DEEP DIVE (REF IMAGE 3)
# ==============================================================================
p9 = new_page("PAGE 9 — SHOP DRAWINGS MODULE DEEP DIVE & WORK ORDER LINKING (REF IMAGE 3)")
y = 38
y = sec_banner(p9, y, "SEC 11", "Published Shop Drawings Grid & Mockup Packages (Ref: Image 3)")
y = draw_image_card(p9, y + 2, images["shop"], "Reference Image 3: Published Shop Drawings Grid (P-26-1132 AUS Project Oasis) — 52 Shop Drawings Linked to Work Orders", max_h=195)

y = sub_banner(p9, y, "How Shop Drawings Connect Engineering, Work Orders, QC & Submittals")

shop_steps = [
    ("NUMBERING", "Architectural Millwork Shop Drawing Hierarchy (Shown in Image 3)", [
        "100.10 — TABLE OF CONTENTS (Version: MOCKUP PACKAGE # 5 | Issue Date: 09/29/2026 | Linked WO: P-26-1132-011p | Slide Count: Sigma-9 = 9 slides in PDF).",
        "101.00 to 101.04 — RESTROOM MOCKUP (Version: MOCKUP PACKAGE # 1 | Issue Date: 09/08/2026 | Linked WO: P-26-1132-025p | Slide Count: Sigma-2 = 2 slides each).",
        "102.49 to 102.50 — 102.5 BAR COUNTER (Version: MOCKUP PACKAGE # 2 | Issue Date: 09/08/2026 | Linked WO: P-26-1132-022p | Slide Count: Sigma-2 = 2 slides each)."
    ]),
    ("WORK ORDERS", "Bidirectional Linking Between Shop Drawings & Work Orders", [
        "Every row in the Shop Drawings Grid has a clickable 'Work Orders' column (e.g., P-26-1132-011p, P-26-1132-025p, P-26-1132-022p).",
        "Clicking the Work Order link jumps straight to that Work Order's production record (showing BOM materials, CNC programs, fabrication hours, and ship date). Conversely, opening a Work Order lists all its attached Shop Drawings."
    ]),
    ("VERSIONS", "Manage Versions (Mockup Packages #1..#5) & Slide Count Badges (Sigma-N)", [
        "Millwork shop drawings evolve through iterative submittal packages (MOCKUP PACKAGE #1, #2, #5, Rev 0, Rev 1).",
        "The 'Shop Drawing Info' column displays the total PDF slide/page count badge (Sigma-9, Sigma-2) plus pin and attachment icons. Clicking any Shop Drawing opens the same Split-Pane Multi-Slide PDF Viewer & Revision History shown in Image 4."
    ]),
    ("PUBLISH LOG", "Publish Log (0/18) — Gatekeeping Between Engineering, QC & Client Portal", [
        "When Christopher Holland or Ariana Samarripa uploads 18 new/revised shop drawings, they sit in 'PUBLISH LOG (0/18)'.",
        "Once QC Review approves the drawings, the PM opens the Publish Log, selects the approved drawings, and publishes them to the Submittals tab and Client Portal."
    ])
]
for code, title, b_list in shop_steps:
    y = draw_step_card(p9, y, code, title, b_list, accent=TEAL)

# ==============================================================================
# PAGE 10: WORK ORDERS, STUDY PROJECTS, QC REVIEW & SUBMITTALS WORKFLOWS
# ==============================================================================
p10 = new_page("PAGE 10 — WORK ORDERS, STUDY PROJECTS, QC REVIEW & SUBMITTALS DEEP FLOW")
y = 38
y = sec_banner(p10, y, "SEC 12", "Deep Workflow: Study Projects & Work Orders (199 Items)")

wo_steps = [
    ("STUDY PROJ", "Study Projects Workflow (Pre-Production Technical R&D)", [
        "1. Create Study Item: Engineer creates a Study Project for high-risk millwork elements (e.g., 'Curved Acoustic Wood Ceiling Mockup', 'Custom Brass Inlay Reception Desk').",
        "2. Attach Reference Sheets & 3D Models: Link architectural sheets (G0.02) and upload preliminary CAD/SketchUp/Rhino files to S3/Box.",
        "3. Log Engineering Study Hours: Engineers log time against the Study Project budget without cluttering active shop Work Orders.",
        "4. Convert to Work Order & Shop Drawing: Once technical feasibility is proven, one click converts the Study Project into an active Work Order and Shop Drawing task."
    ]),
    ("WORK ORDERS", "Work Orders Lifecycle (From Engineering Release to Shop & Install)", [
        "1. Work Order Creation: Created during Phase 2 estimating or generated per room/elevation (e.g., P-26-1132-025p Restroom Mockup).",
        "2. Engineering & Shop Drawing Link: Shop drawings 101.00 - 101.04 are linked to WO P-26-1132-025p. WO cannot enter 'Production' until linked drawings are 'Approved'.",
        "3. Labor Hour Tracking (No Cost Shown to Staff): Tracks Budgeted Hours vs. Actual Logged Hours across Drafting, CNC Cut, Casework Assembly, Finishing, and Packing.",
        "4. Shipping & Installer Schedule Sync: When shop marks WO 'Ready to Ship', it automatically populates on the Installer Schedule calendar."
    ])
]
for code, title, b_list in wo_steps:
    y = draw_step_card(p10, y, code, title, b_list, accent=NAVY)

y += 4
y = sec_banner(p10, y, "SEC 13", "Deep Workflow: Internal QC Review & Formal Submittals (42 Items)")

qc_sub_steps = [
    ("QC REVIEW", "4-Stage Internal Quality Control (QC) Gate", [
        "Stage 1 — Automatic Queueing: Every newly uploaded Shop Drawing Version enters the QC Review tab with status 'Pending QC'.",
        "Stage 2 — Millwork Checklist Inspection: QC Reviewer verifies: (a) Field vs. Arch Dimensions, (b) Veneer Species/Cut & Grain Direction, (c) Edge Banding & Joinery Callouts, (d) Hardware Schedule Match, (e) Wall Blocking & ADA Clearances.",
        "Stage 3 — In-Browser PDF Redlining: QC draws revision clouds, arrows, and notes directly onto specific slides of the PDF.",
        "Stage 4 — Decision: If 'Rejected', returns to Engineer for revision. If 'Approved', unlocks the drawing in the Publish Log."
    ]),
    ("SUBMITTALS", "5-Stage Architect / Client Submittal Workflow", [
        "Stage 1 — Package Assembly: PM creates Submittal #012 (Spec Section 06 41 00 Custom Casework) and attaches QC-approved Shop Drawings (101.00-101.04), hardware cutsheets, and finish sample photos.",
        "Stage 2 — Transmittal PDF Generation: System auto-generates a branded Submittal Cover Sheet & Transmittal Log PDF stored in S3/Box.",
        "Stage 3 — Client Portal Notification: Client/Architect receives email + portal alert; Ball-in-Court switches to 'Client / Architect' with contractual due date timer.",
        "Stage 4 — Client Markup & Disposition: Architect reviews slides in-browser and stamps: [Approved], [Approved as Noted], or [Revise & Resubmit].",
        "Stage 5 — Revision Loop (REVX) or Fabrication Release: If Revise & Resubmit, creates Submittal Rev 1. If Approved, releases linked Work Orders to the shop floor."
    ])
]
for code, title, b_list in qc_sub_steps:
    y = draw_step_card(p10, y, code, title, b_list, accent=PURPLE)

# ==============================================================================
# PAGE 11: CLOUD STORAGE (AWS S3 / BOX) & DATABASE ER ARCHITECTURE
# ==============================================================================
p11 = new_page("PAGE 11 — AWS S3 / BOX CLOUD DOCUMENT PIPELINE & DATABASE ARCHITECTURE")
y = 38
y = sec_banner(p11, y, "SEC 14", "AWS S3 / Box Cloud Storage & In-Browser PDF Rendering Pipeline")

s3_steps = [
    ("1. UPLOAD", "Direct Pre-Signed Upload (Client & Internal Staff)", [
        "When a Client, Engineer, or PM selects a file (PDF, DWG, DXF, Revit, Image, Spec Doc), the browser requests a time-limited Pre-Signed PUT URL from the QuadeConnect API.",
        "The file uploads directly to the project's isolated S3 bucket path (/projects/{proj_no}/{category}/{version}/{filename}) or Box Enterprise folder."
    ]),
    ("2. PROCESS", "Automated PDF Slide Counter, Thumbnail Generator & Title-Block OCR", [
        "An S3 Event / Webhook triggers the Document Processing Worker (PyMuPDF + OCR):",
        "   • Counts exact number of slides/pages in the PDF and writes `page_count` (displayed as Sigma-9, Sigma-4, Sigma-3, Sigma-2 in the UI).",
        "   • Renders WebP thumbnails for every individual slide so the Sheet/Shop Drawing viewer can show instant left/right slide previews.",
        "   • Extracts Sheet/Drawing Number and Title from the PDF title block."
    ]),
    ("3. STREAM", "In-Browser Viewing & Non-Destructive Annotation Layer", [
        "Clicking any file, Sheet, or Shop Drawing generates a short-lived Pre-Signed GET URL streamed directly into the embedded PDF.js / Box Preview canvas inside the website.",
        "Redline markups, pins, and QC stamps are saved as structured JSON vectors in PostgreSQL linked to `(document_version_id, slide_number)`, keeping the original PDF immutable."
    ])
]
for code, title, b_list in s3_steps:
    y = draw_step_card(p11, y, code, title, b_list, accent=BLUE)

y += 4
y = sec_banner(p11, y, "SEC 15", "Core Relational Database Schema (PostgreSQL Entities)")

db_tables = [
    ("projects", "id, proj_no (P-26-1137), code (26011R), name, customer_id, status, kanban_stage, original_contract_val*, current_contract_val*, wo_total_val*, billed_val*, billed_pct*, est_grand_total_cost*, s3_prefix  [*Stripped for non-Admin]"),
    ("project_assignments", "id, project_id, user_id, role_in_project (PM, ENGINEER, QC, OPS_HEAD, INSTALLER, CLIENT), budgeted_hours, logged_hours"),
    ("user_pay_rates", "id, user_id, trade_role, hourly_rate_usd*  [*Strictly Admin-only table for computing Labor Cost = logged_hours x hourly_rate_usd]"),
    ("study_projects", "id, project_id, study_no, title, description, status, assigned_engineer_id, budgeted_hours, logged_hours, converted_wo_id"),
    ("work_orders", "id, project_id, wo_number (P-26-1132-011p), name, status, wo_value*, budgeted_hours, actual_hours, ship_date, install_start_date"),
    ("sheets", "id, project_id, sheet_number (G0.02), sheet_name, current_version_id, is_published, tags[]"),
    ("sheet_versions", "id, sheet_id, version_set_name (90 IFP, Bulletin 01), issue_date, slide_count (Sigma-N), s3_key, thumbnails_json, uploaded_by, uploaded_at"),
    ("shop_drawings", "id, project_id, work_order_id, drawing_number (101.00), drawing_name (RESTROOM MOCKUP), current_version_id, qc_status, is_published"),
    ("shop_drawing_versions", "id, shop_drawing_id, version_name (MOCKUP PACKAGE #1), issue_date, slide_count (Sigma-N), s3_key, thumbnails_json, uploaded_by"),
    ("qc_reviews & markups", "id, target_type (SHEET/SHOP_DWG), version_id, slide_number, reviewer_id, status, checklist_json, annotation_vectors_json, created_at"),
    ("submittals", "id, project_id, submittal_no, spec_section, title, revision_no, status, ball_in_court, linked_drawing_version_ids[], transmittal_s3_key")
]

for tbl, cols_str in db_tables:
    p11.draw_rect(fitz.Rect(32, y, W - 32, y + 22), color=BORDER, fill=LIGHT_BG, width=0.5)
    p11.insert_text((36, y + 14), tbl, fontsize=7.5, fontname="hebo", color=DARK_BLUE)
    w_l = wrap_lines(cols_str, 88)
    p11.insert_text((135, y + 9.5), w_l[0], fontsize=6.9, fontname="helv", color=DARK)
    if len(w_l) > 1:
        p11.insert_text((135, y + 18.5), w_l[1], fontsize=6.9, fontname="helv", color=DARK)
    y += 23.5

# ==============================================================================
# PAGE 12: COMPLETE FEATURE COMPARISON MATRIX & IMPLEMENTATION ROADMAP
# ==============================================================================
p12 = new_page("PAGE 12 — CLICKUP vs. INNERGY vs. QUADECONNECT MATRIX & BUILD ROADMAP")
y = 38
y = sec_banner(p12, y, "SEC 16", "Master Feature Comparison Matrix (ClickUp vs. Innergy vs. QuadeConnect)")

m_cols = [32, 235, 325, 425, W - 32]
m_headers = ["Feature / Capability", "ClickUp", "Innergy ERP", "QuadeConnect PM (Target)"]
p12.draw_rect(fitz.Rect(32, y, W - 32, y + 18), color=None, fill=NAVY)
for i, h_t in enumerate(m_headers):
    p12.insert_text((m_cols[i] + 5, y + 12), h_t, fontsize=7.8, fontname="hebo", color=WHITE)
y += 18

matrix_rows = [
    ("Master Projects Grid + Group By + Custom Filters", "Yes (Generic)", "Yes (Millwork)", "YES — Full Grid with Footer Sums & Saved Views"),
    ("Projects Kanban Board (#/projects/kanban)", "Yes", "Yes", "YES — Millwork Lifecycle Columns + Drag & Drop"),
    ("Gantt Timeline & Installer Schedule Calendar", "Yes", "Partial", "YES — Integrated Shop + Field Installer Schedule"),
    ("Contract, Work Order Value & Billed % Tracking", "No", "Yes", "YES — Full Portfolio & Project Financial Tracking"),
    ("Role-Based Cost Hiding (Admin=$ vs Eng/Ops=No $)", "Limited", "Partial", "YES — Strict API-Level Cost Masking & Project Scoping"),
    ("Hours Pay Plan (Role $/hr + Labor Hours Budget)", "Basic Time", "Yes", "YES — Trade Rate Cards (Admin) + Hours Tracking (Team)"),
    ("Study Projects (Pre-Production Millwork R&D)", "No", "Custom", "YES — Dedicated Study Projects Tab -> Converts to WO"),
    ("Work Orders Module (199+ WOs per Project)", "Tasks Only", "Yes", "YES — Full Work Orders Linked to Shop Drawings & BOM"),
    ("Architectural Sheets Grid + Version Sets (90 IFP)", "No", "Yes", "YES — Upload, OCR Title Block, Version Sets & Publish Log"),
    ("Shop Drawings Grid + Mockup Packages (#1..#5)", "No", "Yes", "YES — Linked to Work Orders with Mockup Versioning"),
    ("PDF Slide Count Badges (Sigma-9, Sigma-4) & Previews", "No", "Yes", "YES — Auto Slide Count + Split-Pane Slide Carousel"),
    ("Revision History Panel + Side-by-Side Diff Viewer", "Basic Proofing", "Yes", "YES — Full Historical Version Stack & Overlay Diff"),
    ("Internal QC Review Gate + Millwork Checklists", "No", "Partial", "YES — Dedicated QC Tab + Redline PDF Annotations"),
    ("Formal Submittals Workflow + Transmittal Logs", "No", "Yes", "YES — Submittal Packages, Ball-in-Court & REVX Loop"),
    ("AWS S3 / Box Direct Cloud Storage + Client Portal", "Attachments", "Cloud", "YES — Pre-Signed S3/Box Streaming + Client Workspace")
]

for idx, r in enumerate(matrix_rows):
    rh = 20
    bg = LIGHT_BG if idx % 2 == 0 else WHITE
    p12.draw_rect(fitz.Rect(32, y, W - 32, y + rh), color=BORDER, fill=bg, width=0.5)
    p12.insert_text((m_cols[0] + 5, y + 13), r[0], fontsize=7.3, fontname="hebo", color=NAVY)
    p12.insert_text((m_cols[1] + 5, y + 13), r[1], fontsize=7.2, fontname="helv", color=DARK)
    p12.insert_text((m_cols[2] + 5, y + 13), r[2], fontsize=7.2, fontname="helv", color=DARK)
    p12.insert_text((m_cols[3] + 5, y + 13), r[3], fontsize=7.1, fontname="hebo", color=GREEN)
    y += rh

y += 10
y = sec_banner(p12, y, "SEC 17", "Recommended Step-by-Step Build Order for Development")

build_phases = [
    ("Sprint 1 — Core Foundation, RBAC & Master Projects Hub (Grid + Kanban):",
     "Build PostgreSQL schema, JWT Auth + Role-Based Cost-Masking Middleware, Master Projects Grid (Image 1) with portfolio footer totals, and Projects Kanban Board (#/projects/kanban)."),
    ("Sprint 2 — Inside-Project Shell, Details, Custom Fields, Study Projects & Work Orders:",
     "Build the persistent Project Header, 11-tab navigation bar, Hours Pay Plan engine, Study Projects tracker, and Work Orders module."),
    ("Sprint 3 — AWS S3 / Box Integration, Sheets & Shop Drawings with Multi-Slide PDF Viewer:",
     "Integrate S3/Box pre-signed uploads, PyMuPDF background worker (computing Sigma-N slide counts & slide thumbnails), Sheets Grid (Image 5), Shop Drawings Grid (Image 3), and Split-Pane Revision History Viewer (Image 4)."),
    ("Sprint 4 — QC Review Gate, Submittals, Client Workspace & Revision Loop (REVX):",
     "Build in-browser PDF redline annotations, QC Checklist queue, Publish Log gatekeeper, Submittal transmittal generator, and restricted Client Portal.")
]

for b_title, b_desc in build_phases:
    p12.insert_text((36, y + 10), b_title, fontsize=8.2, fontname="hebo", color=BLUE)
    y = draw_para(p12, y + 21, b_desc, x=44, width=W-80, fontsize=7.8, lh=10.5)
    y += 4

out_pdf_workspace = os.path.join(workspace_dir, "QuadeConnect_Complete_Workflow.pdf")
out_pdf_prev = os.path.join(workspace_dir, "QuadeConnect_PM_Complete_Workflow.pdf")
out_pdf_artifact = os.path.join(artifact_dir, "QuadeConnect_Complete_Workflow.pdf")

doc.save(out_pdf_workspace)
doc.save(out_pdf_prev)
doc.save(out_pdf_artifact)
doc.close()
print("12-Page Complete Workflow PDF generated successfully:", out_pdf_workspace)
