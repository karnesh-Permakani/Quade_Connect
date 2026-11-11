// =====================================================================
// QuadeConnect PM — TypeScript Data Models & Interfaces
// Domain: Architectural Millwork & Custom Casework Fabrication
// =====================================================================

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'OPS_HEAD'
  | 'PROJECT_MANAGER'
  | 'ENGINEER'
  | 'QC_REVIEWER'
  | 'FIELD_INSTALLER'
  | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedProjectNos: string[]; // Projects this user has permission to access
}

export type ProjectStage =
  | 'Study / Pre-Bid'
  | 'Engineering'
  | 'QC Review'
  | 'Submittal'
  | 'Fabrication'
  | 'Installation'
  | 'Closeout';

export type ProjectPriority = 'Low' | 'Normal' | 'High' | 'Critical';

export type MillworkTrade = 'Engineering' | 'Fabrication' | 'Finishing' | 'Installation';

export type TradePayRates = Record<MillworkTrade, number>; // Hourly pay rates ($/hr) — Admin only

export type TradeHours = Record<MillworkTrade, number>;

export interface Project {
  no: string;              // e.g. "P-26-1132"
  code?: string;           // e.g. "26011R"
  name: string;            // e.g. "[26011R] AUS Project Oasis (Austin)"
  customer: string;        // e.g. "Hensel Phelps - Austin"
  architect: string;       // e.g. "PGAL"
  location: string;
  stage: ProjectStage;
  priority: ProjectPriority;
  pm: string;              // Project Manager name
  startDate: string;       // ISO YYYY-MM-DD
  dueDate: string;

  // Financial Fields (Strictly masked for non-Admin roles)
  origContractVal?: number;
  currentContractVal?: number;
  woTotalVal?: number;
  billedVal?: number;
  billedPct?: number;
  estGrandTotalCost?: number;

  // Millwork Specifications (ClickUp-Style Custom Fields)
  awiGrade: 'Economy' | 'Custom' | 'Premium';
  primaryVeneer: string;   // e.g. "Plain Sliced White Oak"
  finishSystem: string;    // e.g. "Conversion Varnish Satin"

  // Labor Hour Budgets
  hoursBudget: TradeHours;
  hoursLogged: TradeHours;
}

export type WOStatus =
  | 'Draft'
  | 'Engineering'
  | 'Approved'
  | 'Released to Fab'
  | 'In Production'
  | 'Shipped'
  | 'Installed'
  | 'Closed';

export interface WorkOrder {
  id: string;
  no: string;              // e.g. "P-26-1132-011p"
  name: string;
  status: WOStatus;
  value?: number;          // Admin only
  budgetHours: number;
  actualHours: number;
  shipDate: string;
}

export interface StudyProject {
  id: string;
  no: string;              // e.g. "ST-01"
  title: string;
  engineer: string;
  status: 'In Progress' | 'Complete' | 'Converted';
  budgetHours: number;
  loggedHours: number;
  convertedWoNo?: string;
}

export interface SheetVersion {
  id: string;
  name: string;            // e.g. "90 IFP", "Bulletin 01"
  issueDate: string;
  slideCount: number;      // Number of slides/pages in PDF (Σ4, Σ3)
  uploadedBy: string;
  uploadedAt: string;
  s3Key: string;
}

export interface Sheet {
  id: string;
  number: string;          // e.g. "G0.00", "G0.02", "A1.01"
  name: string;            // e.g. "PROJECT INFORMATION"
  versions: SheetVersion[];
  currentVersionIndex: number;
  tags: string[];
  isPublished: boolean;
  hasMarkups: boolean;
}

export interface ShopDrawingVersion {
  id: string;
  name: string;            // e.g. "MOCKUP PACKAGE # 1", "MOCKUP PACKAGE # 2"
  issueDate: string;
  slideCount: number;      // e.g. Σ9, Σ2
  uploadedBy: string;
  uploadedAt: string;
  s3Key: string;
}

export type QCStatus = 'Pending QC' | 'QC Approved' | 'Rejected';

export interface ShopDrawing {
  id: string;
  number: string;          // e.g. "100.10", "101.00", "102.49"
  name: string;            // e.g. "RESTROOM MOCKUP", "BAR COUNTER"
  woId?: string;           // Direct link to WorkOrder.id
  versions: ShopDrawingVersion[];
  currentVersionIndex: number;
  tags: string[];
  qcStatus: QCStatus;
  isPublished: boolean;
  hasMarkups: boolean;
}

export interface ProjectFile {
  id: string;
  name: string;
  category: 'Contracts' | 'Specifications' | 'Cut Sheets' | 'Client Uploads' | 'Photos' | 'Shared with Client';
  sizeFormatted: string;
  uploadedBy: string;
  date: string;
  s3Uri: string;
}

export interface SubmittalItem {
  id: string;
  no: string;              // e.g. "SUB-001"
  title: string;
  specSection: string;     // e.g. "06 41 00 Architectural Wood Casework"
  revisionNo: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Revise & Resubmit';
  ballInCourt: string;     // e.g. "Client / Architect" or "Engineering"
  attachedDrawingIds: string[];
  sentDate?: string;
  dueDate?: string;
  auditTrail: { timestamp: string; user: string; action: string }[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  description: string;
}

