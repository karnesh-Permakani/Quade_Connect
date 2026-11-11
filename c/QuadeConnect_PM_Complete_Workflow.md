# QuadeConnect — Project Management Module
## Complete Deep-Dive Workflow & Feature Specification for Architectural Millwork
**Domain Reference:** Innergy ERP (`app.innergy.com`) + ClickUp Productivity Platform  
**Industry:** Architectural Millwork & Custom Casework Fabrication

---

## 1. Executive Summary & System Vision

**QuadeConnect Project Management** is an end-to-end project management module purpose-built for **Architectural Millwork** companies. It merges:
1. **ClickUp's Modern Productivity UX**: Multi-view project management (Grid, Kanban, Gantt, Calendar, Dashboards), custom fields, granular filtering, column grouping, task dependencies, and real-time collaboration.
2. **Innergy's Millwork Domain Depth**: Contract vs. Work Order financial tracking, AIA-style architectural **Sheets** management, engineering **Shop Drawings** with mockup packages, **Submittals**, **QC Reviews**, **Study Projects**, **Installer Schedules**, **Impediments**, and page-level PDF revision tracking.
3. **Cloud Storage & Role-Based Security**: AWS S3 / Box cloud document pipeline with in-browser PDF rendering, annotation layers, and strict **Role-Based Access Control (RBAC)** where Admins see full contract financials and hourly costs, while Engineers, QC, and Operations Heads see only their assigned projects with all cost/billing fields completely stripped.

---

## 2. Role-Based Access Control (RBAC) & Cost Masking

A core requirement of QuadeConnect is strict separation between **Financial/Admin visibility** and **Execution/Engineering visibility**.

| Role | Project Scope | Cost & Billing Visibility | Hourly Rate & Pay Visibility | Key Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin / Admin** | **All Projects** across company | **Full Access** (Original Contract, Current Contract, WO Value, Billed, Billed %, Est. Grand Total Cost) | **Full Access** (Set hourly pay rates, view labor budgets vs. actuals) | Create projects, manage budgets, configure rates, assign teams, full CRUD |
| **Operations Head** | **Assigned Projects Only** | **Hidden** (No contract values, billing, or cost columns) | **Hours Only** (Sees budgeted vs. logged hours, no dollar rates) | Assign engineers/field crew, manage schedules, work orders, approve QC |
| **Project Manager (PM)** | **Assigned Projects Only** | **Configurable** (Hidden by default; optional read-only budget health badge) | **Hours Only** | Manage project tabs, submittals, sheets, shop drawings, client portal publish |
| **Engineer / Drafter** | **Assigned Projects Only** | **Hidden** | **Own Hours Only** (Logs time on assigned tasks/drawings) | Upload Shop Drawings, view Sheets, address QC markups & RFIs |
| **QC Reviewer** | **Assigned Projects Only** | **Hidden** | **Own Hours Only** | Review Shop Drawings, complete QC checklists, markup PDFs, approve/reject |
| **Field / Installer** | **Assigned Projects Only** | **Hidden** | **Own Hours Only** | View published drawings/sheets, log daily field progress, log impediments |
| **Client (External)** | **Own Project(s) Only** (Restricted Portal) | **Hidden** (Unless Invoice Portal explicitly enabled for Client Admin) | **Hidden** | Upload intake files (S3/Box), view published drawings, markup PDFs, approve/reject submittals |

---

## 3. Master End-to-End 6-Phase Workflow (Line-by-Line Connection)

This workflow connects your **6-Phase Flow Diagram** directly into the **Innergy-style Project Management UI**.

### Phase 1: Sales & CRM Pipeline
1. **Lead Captured**: Incoming lead from Ad, Referral, Website, or GC invitation to bid.
2. **CRM Pipeline Progression**: Moves through `New` -> `Qualified` -> `Proposal / Estimating`.
3. **Study Project (Pre-Bid Analysis)**: Before winning, complex jobs can be opened as a **Study Project** to evaluate architectural sheets, long-lead veneers, and hardware feasibility.
4. **Lead Won? (Decision Gate)**:
   - **No**: Archived with loss reason.
   - **Yes**: Triggers automated handoff to Operations & Client Workspace:
     - Auto-generates unique **Project Number** (e.g., `P-26-1137`).
     - Creates **Client Account** and sends restricted Client Portal invite.
     - provisions **AWS S3 / Box Folder Structure** (`/Projects/P-26-1137/{Sheets,Shop-Drawings,Files,Submittals,QC,Client-Uploads}`).

### Phase 2: Operations & Estimating Intake
1. **Ops Notified of New Project Intake**: Operations Head and Admin receive instant alert.
2. **Analyze Files & Estimate (BOQ / BOM)**:
   - Estimators break down architectural drawings into **Bill of Quantities (BOQ)** and **Bill of Materials (BOM)**.
   - Set **Labor Hours & Pay Plan**: Define hours for Engineering, CNC/Fabrication, Finishing, and Installation, multiplied by role hourly rates (visible only to Admin).
3. **Create Project Folder & Allocate Team**:
   - Admin/Ops Head assigns specific Engineers, QC Reviewers, and Field Leads to the project.
   - *RBAC Enforcement*: Assigned engineers immediately see the project in their Grid/Kanban without any financial columns.
4. **Set Up Tasks, Work Logs & Milestones**:
   - Break project into **Work Orders** (e.g., `P-26-1132-011p - Lobby Reception`, `Restroom Mockup`, `Bar Counter`).
   - Set milestone dates for Submittals, Shop Drawings, Fabrication, and Installer Schedule.
5. **Project Execution Begins**: Project status moves to `Active / Engineering`.

### Phase 3: Client Workspace (External Portal)
1. **Dedicated Restricted Client Dashboard**: Client logs in and sees only their project header, milestone tracker, and action items.
2. **Upload Project Files (Drawings, Specs via Box/S3)**:
   - Client drags and drops architectural PDFs, addenda, bulletins, and finish specs.
   - Files upload directly via pre-signed URLs to **AWS S3 or Box**, automatically linked into the project's **Files** and **Sheets** intake queue.
3. **In-Browser PDF Annotation & Markup**: Client can open any published Shop Drawing or Submittal directly in the website (no download required) and draw redlines, callouts, and stamps.
4. **Schedule Google Meet Calls / Team Chat**: Built-in scheduling and contextual comment threads per drawing/sheet.
5. **Track Progress**: Live Kanban board and milestone progress bars.

### Phase 4: Team Execution (Inside the Project Hub)
1. **Engineering Team**:
   - Studies architectural **Sheets** (e.g., `G0.02`, `A1.01`).
   - Produces detailed millwork **Shop Drawings** (e.g., `100.10 Table of Contents`, `101.00 Restroom Mockup`, `102.49 Bar Counter`) linked to specific **Work Orders**.
2. **QC Team**:
   - Reviews drafted Shop Drawings against architectural sheets, AWI (Architectural Woodwork Institute) standards, dimensions, grain direction, and hardware schedules.
   - Logs non-conformances or passes the drawing to `Ready to Publish`.
3. **Field Team**:
   - Uses **Installer Schedule** tab, logs daily check-in/out, site measurements, and **Impediments** (e.g., "GC wall blocking not ready on Floor 2").
4. **Full Viewer Sync**: Every status change updates the master Project Grid, Kanban board, and Gantt timeline in real time.

### Phase 5: Revision Loop (REVX) & Submittal Cycle
1. **Publish to Client**: Approved Shop Drawings are selected via **Publish Log** and pushed to the Client Workspace as a **Submittal** or **Mockup Package**.
2. **Client Submits Revision Request (REVX)**: Client reviews in-browser and either approves or marks up changes needed.
3. **Engineering Reviews Revision Request**: Engineer views client markups overlaid on the PDF.
4. **Update Drawing & Upload New Version**:
   - Engineer uploads revised PDF under a new Version Set (e.g., `MOCKUP PACKAGE #1` -> `MOCKUP PACKAGE #2`).
   - System auto-calculates page count (slides in PDF), generates page thumbnails, and appends to **Revision History**.
5. **QC Team Validates Changes**: QC verifies all redlines were addressed before re-notifying client.
6. **Client Approved? (Decision Gate)**:
   - **No**: Loops back to Engineering (Rev 2, Rev 3, etc.).
   - **Yes**: Revision finalized! Locked as an **Immutable Archive in S3/Box**, stamped `Approved for Construction (AFC)`, and releases the linked **Work Order** to shop fabrication.

### Phase 6: Finance & Closeout (Admin Only)
1. **Budget Management & Cost Tracking**:
   - Real-time comparison of `Original Total Contract` + `Change Orders` = `Current Contract Value` vs. `Estimated Grand Total Cost` (Labor hours × pay rate + Material POs + Overhead).
2. **Progress Billing & Invoices**:
   - Track `Work Orders Value`, `Billed ($)`, and `Billed %` (e.g., 6.79%, 50%, 100%) with bottom-row grand totals across all active projects.
3. **Project Closeout**:
   - Final punch list sign-off, as-built drawings archived, retention billed, and lessons learned saved to library.

---

## 4. Deep Breakdown of Project Views & Inside-Project Tabs (Ref: Uploaded Images)

### 4.1 Master Projects List — Grid & Kanban Views (Ref: Image 1)
- **Top Navigation & Switcher**: Breadcrumb `Projects > Grid` with instant toggle buttons for **Grid View**, **Kanban View**, **Gantt View**, and **Calendar View**.
- **Saved Views & Grouping**: Dropdown for `Default View *`, `Create Filter` builder, and drag-and-drop column grouping (`Drag a column header here to group by that column` — e.g., Group by Customer, Status, or PM).
- **Columns in Admin View**:
  1. `Proj No.` (e.g., `P-26-1137`, `P-26-1132`) — clickable link into project.
  2. `Name` (e.g., `BWI Project Oasis (Baltimore)`, `[26011R] AUS Project Oasis (Austin)`).
  3. `Customer` (e.g., `Whiting Turner - DC`, `Hensel Phelps - Austin`).
  4. `Original Total Contract` (e.g., `$6,573,906.00`) — *Admin Only*.
  5. `Current Contract Value` (e.g., `$8,838,759.00`) — *Admin Only*.
  6. `Work Orders Value` (e.g., `$5,114,150.01`) — *Admin Only*.
  7. `Billed` (e.g., `$347,137.50`) — *Admin Only*.
  8. `Billed %` (e.g., `6.79%`, `100%`) — *Admin Only*.
  9. `Estimated Grand Total Cost` (e.g., `$3,812,367.00`) — *Admin Only*.
- **Summary Footer Row**: Displays live aggregate totals at the bottom of the grid (e.g., `$194,573,602.48` Original Contract, `$229,804,78...` Current Contract, `$195,337,262.87` Work Orders).
- **Columns in Engineer / Ops Head View**: Cost columns are stripped and replaced with `Phase`, `Assigned Engineers`, `Open Work Orders`, `Pending QC`, `Pending Submittals`, `Target Ship Date`, and `Hours Logged vs. Budgeted Hours`.
- **Projects Kanban View** (`#/projects/kanban`):
  - Columns represent Millwork Lifecycle Stages: `Study / Pre-Bid` -> `Engineering & Drafting` -> `In QC Review` -> `Out for Submittal` -> `Approved / Ready for Fab` -> `In Fabrication` -> `Installation` -> `Closeout`.
  - Cards display Project No., Name, Customer, Due Date, Priority badge, and item counters (Sheets, Shop Drawings, Impediments).

---

### 4.2 Inside a Project — Header & 11 Category Tabs (Ref: Images 3, 4, 5)
When clicking a project (e.g., `P-26-1132 - [26011R] AUS Project Oasis (Austin)`), the persistent Project Header displays:
- **Title**: `P-26-1132 - [26011R] AUS Project Oasis (Austin)`
- **Financial Pills (Hidden for Engineers/Ops)**:
  - `Original Contract Value: $363,375.00`
  - `Current Contract Value: $5,114,150.00`
  - `Work Orders Value: $5,114,150.01`
  - Status Pill: `Budget is up to date`
- **Category Navigation Tabs (with live badge counts)**:
  1. **Details & Custom Fields**: Project metadata, client contacts, site address, AWI quality grade, veneer species, hardware specs, and team assignments + labor hour allocations.
  2. **Study Projects**: Pre-engineering technical feasibility studies, complex joinery mockups, value-engineering options, and material yield studies before releasing to production.
  3. **Work Orders (`199`)**: Production packages (e.g., `P-26-1132-011p`, `P-26-1132-025p`). Tracks status, fabrication hours, linked shop drawings, and shipping dates.
  4. **Installer Schedule**: Gantt/Calendar timeline for field installation crews, delivery staging, and site readiness.
  5. **Sheets (`306` / `216`)**: Architectural & contract drawings provided by the client/architect.
  6. **Shop Drawings (`52`)**: Internal CAD/PDF fabrication drawings created by millwork engineers.
  7. **Files (`174` / `50`)**: S3/Box cloud repository for specs, contracts, finish schedules, photos, and general docs.
  8. **QC Review**: Quality control inspection queue, drawing verification checklists, and shop floor QC sign-offs.
  9. **Submittals (`42`)**: Formal transmittal packages (Shop Drawings, Product Data, Veneer/Laminate Samples) sent to the Architect/GC for sign-off.
  10. **Notes (`11`) & Impediments (`7`)**: Project logs, blockers, RFIs, and field issues holding up progress.

---

### 4.3 Sheets Tab — Grid View & Single Sheet Viewer with Revision History (Ref: Images 4 & 5)

#### A. Sheets Grid View (`Projects > BWI Project Oasis > Sheets > Grid` — Image 5)
- **Top Action Bar**:
  - `UPLOAD AND PROCESS NEW SHEETS` (Uploads multi-page PDF to S3/Box, splits or indexes pages, runs OCR on title blocks to auto-detect Sheet Number and Sheet Name).
  - `MANAGE VERSIONS` (Group sheets into Version Sets like `90 IFP`, `Bulletin 01`, `100% CD`).
  - `PUBLISH LOG (0/5)` (Controls which uploaded sheets are live for field/client viewing).
- **Grid Columns**:
  - `Sheet Number` (`G0.00`, `G0.01`, `G0.02`, `G0.10`, `G0.20`, `G1.01`)
  - `Sheet Name` (`COVER SHEET`, `SHEET INDEX`, `PROJECT INFORMATION`, `ADA STANDARDS`, `RESPONSIBILITY MATRIX`)
  - `Version` (`Bulletin 01`, `90 IFP`)
  - `Issue Date` (`08/31/2026`, `07/31/2026`)
  - `Sheet Info` (Interactive badges showing **Page/Slide Count** e.g. `Σ4`, `Σ3`, `Σ1`, plus icons for 3D model link, pinned markups, linked work orders, and location pins)
  - `Upload Date` (`09/03/2026 06:31 AM`)
  - `Uploaded By` (`Rob Redmond`)
  - `Tags` & `Published Status`

#### B. Sheet Single View & PDF Slide/Revision Inspector (`Projects > ... > Sheets > View` — Image 4)
Clicking any sheet (e.g., `G0.02 - PROJECT INFORMATION`) opens the split-pane **Sheet Viewer**:
- **Left Metadata & Revision Panel**:
  - `Sheet Number *`: Editable input (`G0.02`)
  - `Sheet Name`: Editable input (`PROJECT INFORMATION`)
  - `Version Set *`: Dropdown selector (`90 IFP`, `Bulletin 01`, etc.)
  - `Tags`: Multi-tag search/input
  - `SAVE CHANGES` button
  - **Revision History List (Bottom Left)**:
    - Displays every historical version of this sheet (e.g., `90 IFP (now viewing) — Issued: 07/31/2026`, `Bulletin 01 — Issued: 08/31/2026`).
    - Clicking any prior revision loads that exact PDF from S3/Box and allows **Side-by-Side / Overlay Diff Comparison**.
- **Right Interactive PDF Canvas & Slide Carousel**:
  - Renders the high-resolution architectural sheet directly in the browser via S3/Box signed stream.
  - **Multi-Slide / Multi-Page Navigation**: Shows previous/next slide thumbnail previews on the left and right edges (`<` thumbnail `>`), plus total slide count indicator (e.g., `Slide 1 of 3` corresponding to `Σ3` in the grid) so engineers and PMs immediately know how many pages/slides exist inside that PDF file.
  - Built-in zoom, pan, measurement calibration, callout pins, and markup overlays.

---

### 4.4 Shop Drawings Tab — Millwork Engineering & Work Order Linking (Ref: Image 3)
(`Projects > [26011R] AUS Project Oasis (Austin) > Shop Drawings > Grid`)
- **Top Action Bar**:
  - `UPLOAD AND PROCESS NEW SHOP DRAWINGS`
  - `MANAGE VERSIONS` (Manages submittal/mockup iterations like `MOCKUP PACKAGE # 1`, `MOCKUP PACKAGE # 2`, `MOCKUP PACKAGE # 5`)
  - `PUBLISH LOG (0/18)`
- **Grid Columns**:
  - `Shop Drawing Number` (`100.10`, `101.00`, `101.01`, `101.02`, `102.49`, `102.50`)
  - `Shop Drawing Name` (`TABLE OF CONTENTS`, `RESTROOM MOCKUP`, `102.5 BAR COUNTER`)
  - `Version` (`MOCKUP PACKAGE # 5`, `MOCKUP PACKAGE # 1`, `MOCKUP PACKAGE # 2`)
  - `Issue Date` (`09/29/2026`, `09/08/2026`)
  - `Work Orders` (Direct clickable link to the production Work Order, e.g., `P-26-1132-011p`, `P-26-1132-025p`, `P-26-1132-022p`)
  - `Shop Drawing Info` (Shows **PDF Slide/Page Count badge** e.g., `Σ9` = 9 slides/pages in PDF, `Σ2` = 2 slides/pages in PDF, plus pin and attachment indicators)
  - `Upload Date` (`10/05/2026 11:15 AM`)
  - `Uploaded By` (`Ariana Samarripa`, `Christopher Holland`)
  - `Tags`
- **Clicking a Shop Drawing**: Opens the same split-pane viewer as Sheets, showing the left-side metadata, linked Work Order, QC status, full **Revision History**, and multi-slide PDF viewer with markup tools.

