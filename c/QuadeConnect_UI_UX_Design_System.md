# QuadeConnect PM — Complete UI & UX Design System Specification
### Modern Enterprise Design Language for Architectural Millwork Project Management
**Inspiration:** ClickUp 3.0 Fluid Work Management UX + Innergy Architectural Millwork ERP Depth  
**Target Viewports:** 1920×1080 (Engineering Workstations), 1440×900 (Laptops), 1024×768 (Shop Floor iPads)

---

## 1. Design System Tokens & Foundation

### 1.1 Color Palette & Semantic System
The color architecture balances the heavy industrial nature of architectural millwork with high-tech software precision:

| Token Name | Hex Code | Visual Swatch | Semantic Application |
| :--- | :--- | :--- | :--- |
| **Navy Dominant** | `#0f172a` | Slate 900 | Master branding, primary headings, sticky header borders, tfoot totals |
| **Blue Primary** | `#2563eb` | Blue 600 | Active interactive states, links, primary CTA buttons, selected tabs |
| **Innergy Orange** | `#f97316` | Orange 500 | Core millwork actions, active Kanban headers, upload buttons, pin markers |
| **Emerald Success** | `#16a34a` | Green 600 | "Budget is up to date", QC Approved, Submittal Approved, 100% billed |
| **Amber Warning** | `#d97706` | Amber 600 | Pending Submittals, High Priority flags, Revision Sets in progress |
| **Crimson Danger** | `#dc2626` | Red 600 | Over-budget alert, QC Rejected, Critical Priority, Over-hours bar |
| **Purple Review** | `#7c3aed` | Purple 600 | QC Review module, non-conformance flags, inspection counters |
| **Surface Light** | `#f8fafc` | Slate 50 | High-density grid zebra rows, toolbars, modal footers |
| **Border Neutral** | `#e2e8f0` | Slate 200 | Table cell divisions, card borders, tab separation lines |

### 1.2 Typography Hierarchy
* **Font Family:** `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif`
* **Tabular Numbers:** `font-variant-numeric: tabular-nums;` (Critical for financial columns, dimensions, and hours counters so numbers align perfectly vertically).
* **Code & Dimensions:** `Consolas, "Fira Code", monospace` (Used for Sheet Numbers `G0.02`, Drawing Numbers `101.00`, and S3 URIs).

| Level | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1** | 22px | 800 (Bold) | 28px | -0.5px | Master Page Titles ("Projects", Project Name) |
| **Heading 2** | 16px | 700 (Bold) | 22px | -0.3px | Modal Titles, Section Dividers |
| **Heading 3** | 14px | 800 (Bold) | 20px | Normal | Card Titles, Drawer Headers |
| **Body Bold** | 12.5px | 700 (Semi) | 18px | Normal | Grid Column Headers, Work Order IDs, Badges |
| **Body Regular** | 12.5px | 400 (Regular)| 18px | Normal | Table Data Cells, Form Labels, Descriptions |
| **Micro Tag** | 10.5px | 700 (Bold) | 14px | +0.4px | Slide Count Badges (`Σ4`), Status Pills, Revision tags |

---

## 2. Persona-Driven User Experience (UX) Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │               5 MILLWORK USER PERSONAS                 │
                    └───────────────────────────┬────────────────────────────┘
                                                │
         ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
         ▼                  ▼                   ▼                   ▼                  ▼
[1. Executive/Admin]   [2. Ops Head]      [3. Drafter/Eng]     [4. QC Inspector]  [5. GC / Client]
• Portfolio health     • Project intake   • Architectural      • AWI 10-point     • Dedicated portal
• Contract vs. cost    • Team allocation    sheet intake         checklist        • Direct S3 upload
• Pay rates ($/hr)     • Work Orders      • CAD Shop Drawings  • PDF redlines     • Slide markup
• AIA Progress bill    • Hours tracking   • Multi-slide viewer • Pass / Reject    • Submittal sign-off
```

### Persona 1: The Executive & Chief Estimator (Admin)
* **UX Goal:** Immediate visibility into portfolio financial health, change order impacts, and labor cost margins.
* **Key Screen Experience:** Sees full financial grid with Original vs. Current Contract, Work Orders Value, Billed %, and Estimated Grand Total Cost ($229.8M portfolio sum). Can configure trade hourly pay rates ($/hr) in the Details tab.

### Persona 2: The Operations Head & Project Manager
* **UX Goal:** Smooth project intake, crew scheduling, and Work Order delivery on time.
* **Key Screen Experience:** Cost columns are automatically stripped. Sees Kanban boards, Gantt timelines, budgeted vs. actual labor hours, and installer field logs. Manages the **Publish Log** gatekeeper before drawings reach the client.

### Persona 3: The Engineering Drafter
* **UX Goal:** Study architect's design sheets, produce millwork fabrication drawings, and resolve revision cycles quickly.
* **Key Screen Experience:** Works in the **Sheets** and **Shop Drawings** tabs. Uses the **Split-Pane Viewer** with slide carousels, version switchers (`90 IFP` vs `Bulletin 01`), and links drawings directly to production Work Orders.

### Persona 4: The Quality Control (QC) Inspector
* **UX Goal:** Catch drafting errors, veneer grain mismatch, or missing hardware before manufacturing begins.
* **Key Screen Experience:** Uses the **QC Review Tab** with a standardized 10-point AWI inspection checklist. Can add redlines directly onto specific slides of the PDF and click *Approve* or *Reject & Return to Drafter*.

### Persona 5: The General Contractor & Architect (External Client)
* **UX Goal:** Frictionless drawing reviews, clear revision tracking, and fast submittal approvals.
* **Key Screen Experience:** Enters a dedicated, branded **Client Workspace**. Uploads intake drawings directly to AWS S3/Box, reviews published mockup packages in the browser without downloading software, and stamps submittals `Approved` or `Revise & Resubmit`.

---

## 3. High-Fidelity UI Screen Blueprints & Layout Wireframes

### Screen 1: Master Projects Workspace (Grid & Kanban Switcher)
Replicates Innergy's high-density operational view paired with ClickUp's dynamic controls:

```
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
|  | ...        | ...                 | ...             | ...              | ...             | ...      | ...       |
|  +----------------------------------------------------------------------------------------------------------------+
|  | PORTFOLIO TOTALS (Admin Only):                      $229,804,78...    $195,337,262.87   14.2%      64% Labor   |
+--------------------------------------------------------------------------------------------------------------------+
```

---

### Screen 2: Inside-Project Command Center & 11 Category Tabs

```
+--------------------------------------------------------------------------------------------------------------------+
|  Projects > P-26-1132 - AUS Project Oasis > Details                                                                |
|  P-26-1132 — [26011R] AUS Project Oasis (Austin)                             [✓ Budget is up to date]              |
|  [Orig: $363,375.00]  [Current: $5,114,150.00]  [Work Orders: $5,114,150.01]                                       |
+--------------------------------------------------------------------------------------------------------------------+
|  [Details & Pay] [Work Orders (4)] [Studies (2)] [Sheets (5)] [Shop Dwgs (4)] [Files (7)] [QC (1)] [Submittals (3)]|
+--------------------------------------------------------------------------------------------------------------------+
|  +---------------------------------------+  +--------------------------------------------------------------------+  |
|  | Project Charter & Specifications      |  | Hours Pay & Labor Budget Plan                       [+ Log Hours]  |  |
|  |---------------------------------------|  |--------------------------------------------------------------------|  |
|  | Project No:    P-26-1132              |  | Trade        | Budget | Logged | Pay Rate | Labor Budget | Actual    |  |
|  | Customer:      Hensel Phelps          |  |--------------+--------+--------+----------+--------------+-----------|  |
|  | Architect:     Page Southerland Page  |  | Engineering  | 480h   | 390h   | $65.00/h | $31,200.00   | $25,350   |  |
|  | AWI Grade:     Premium Grade          |  | Fabrication  | 1350h  | 520h   | $45.00/h | $60,750.00   | $23,400   |  |
|  | Veneer:        Rift White Oak         |  | Finishing    | 320h   | 40h    | $48.00/h | $15,360.00   | $1,920    |  |
|  | Finish:        Matte Conversion Varn. |  | Installation | 400h   | 0h     | $55.00/h | $22,000.00   | $0.00     |  |
|  +---------------------------------------+  +--------------------------------------------------------------------+  |
+--------------------------------------------------------------------------------------------------------------------+
```

---

### Screen 3: Split-Pane Multi-Slide PDF Studio (Ref: Image 4)

```
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
```

---

## 4. Interaction Patterns & Micro-UX

### 4.1 Automated Slide-Counting Engine (`ΣN`)
* When an architectural PDF or shop drawing set is uploaded:
  1. The file streams directly to AWS S3 / Box via a time-limited pre-signed PUT URL.
  2. The background worker parses the PDF and returns the exact page/slide count.
  3. The UI automatically displays the micro-badge **`Σ4`** or **`Σ9`** in the grid column.
  4. The in-browser viewer creates a thumbnail preview card for each slide, allowing users to jump directly to any page without downloading the full document.

### 4.2 Revision Comparison Mode (`⇄ Compare Revisions`)
* Clicking `Compare Revisions` splits the right-hand canvas into two synchronised viewports:
  * **Left Canvas (Previous Revision):** Displays `90 IFP` (highlighted in red border).
  * **Right Canvas (Current Revision):** Displays `Bulletin 01` (highlighted in green border).
  * Moving the zoom or pan slider synchronises both viewports, enabling drafters and GCs to spot dimensional discrepancies instantly.

### 4.3 1-Click Study Project Conversion
* Millwork companies frequently invest 10–30 hours in technical feasibility (e.g. testing whether curved wood veneer will crack on a tight radius).
* In QuadeConnect, the engineer logs time under `Study Projects`.
* Once proven, clicking **`Convert to Work Order`** automatically transforms the study into an active shop Work Order (`P-26-1132-039p`), sets the status to `Draft`, transfers the logged hours, and allocates the production budget.

---

## 5. Responsive Adaptations (Workstation vs. Shop Floor Tablet)

| UI Element | Desktop Workstation (1920×1080) | Shop-Floor Tablet / iPad (1024×768) | Mobile Phone (390×844) |
| :--- | :--- | :--- | :--- |
| **Project Grid** | 14 columns visible with horizontal scroll & sticky left Proj No | 8 core columns visible; financials condensed to drawer | Single-column stacked cards with priority badges |
| **Document Studio** | Side-by-side split layout (4 cols metadata, 8 cols PDF canvas) | Top/bottom collapsed layout; metadata hidden in slide-over drawer | Fullscreen canvas with pinch-to-zoom; metadata in bottom sheet |
| **Kanban Board** | 7 columns visible simultaneously on wide monitors | Horizontal swipe between columns with column navigation pills | Single column view with swipe left/right |
| **Redline Markups** | Mouse hover callout pins with rich text comment popup | Touch-and-hold to drop annotation pins; Apple Pencil support | View-only pins with bottom drawer comment thread |

---

## 6. Implementation Status

1. **Live Interactive Demo:**  
   The UI/UX styling has been applied to [`quadeconnect-pm/demo/styles.css`](file:///c:/Users/MARIESWARI/Desktop/c/quadeconnect-pm/demo/styles.css) and is live in your browser:  
   👉 **[Open QuadeConnect Live Demo (`index.html`)](file:///c:/Users/MARIESWARI/Desktop/c/quadeconnect-pm/demo/index.html)**
2. **React + Tailwind Component System:**  
   The modular UI components in [`quadeconnect-pm/src/`](file:///c:/Users/MARIESWARI/Desktop/c/quadeconnect-pm/src/) reflect this design language, ready for production compilation with `npm run build`.
3. **Workflow PDF Document:**  
   The 12-page executive specification [`QuadeConnect_Complete_Workflow.pdf`](file:///c:/Users/MARIESWARI/Desktop/c/QuadeConnect_Complete_Workflow.pdf) contains the full process diagrams and reference image comparisons.

