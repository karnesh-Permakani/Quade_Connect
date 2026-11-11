import { Project, WorkOrder, StudyProject, Sheet, ShopDrawing, ProjectFile, SubmittalItem, ActivityLog } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    no: 'P-26-1137',
    name: 'BWI Project Oasis (Baltimore)',
    customer: 'Whiting Turner - DC - Washington',
    architect: 'PGAL',
    location: 'Baltimore, MD',
    stage: 'Engineering',
    priority: 'Normal',
    pm: 'Rob Redmond',
    startDate: '2026-05-04',
    dueDate: '2027-01-15',
    origContractVal: 6573906.00,
    currentContractVal: 8838759.00,
    woTotalVal: 0.00,
    billedVal: 0.00,
    billedPct: 0.00,
    estGrandTotalCost: 6278759.00,
    awiGrade: 'Premium',
    primaryVeneer: 'Quarter Sawn White Oak',
    finishSystem: 'Conversion Varnish Satin',
    hoursBudget: { Engineering: 550, Fabrication: 1600, Finishing: 380, Installation: 420 },
    hoursLogged: { Engineering: 140, Fabrication: 0, Finishing: 0, Installation: 0 }
  },
  {
    no: 'P-26-1136',
    name: '[26019N] Omni Midland Hotel',
    customer: 'Beck Group - Dallas',
    architect: 'HKS Architects',
    location: 'Midland, TX',
    stage: 'Study / Pre-Bid',
    priority: 'High',
    pm: 'Christopher Holland',
    startDate: '2026-05-18',
    dueDate: '2026-12-20',
    origContractVal: 4006216.00,
    currentContractVal: 4229775.00,
    woTotalVal: 4229775.01,
    billedVal: 0.00,
    billedPct: 0.00,
    estGrandTotalCost: 3123304.00,
    awiGrade: 'Custom',
    primaryVeneer: 'Plain Sliced American Walnut',
    finishSystem: 'Natural Stain Match',
    hoursBudget: { Engineering: 420, Fabrication: 1100, Finishing: 290, Installation: 350 },
    hoursLogged: { Engineering: 80, Fabrication: 0, Finishing: 0, Installation: 0 }
  },
  {
    no: 'P-26-1135',
    name: '[26022R] BNA Project Oasis (Nashville)',
    customer: 'Hensel Phelps - Nashville',
    architect: 'Gensler',
    location: 'Nashville, TN',
    stage: 'Fabrication',
    priority: 'Critical',
    pm: 'Ariana Samarripa',
    startDate: '2026-06-01',
    dueDate: '2026-11-30',
    origContractVal: 7180842.00,
    currentContractVal: 9563814.00,
    woTotalVal: 9563814.00,
    billedVal: 0.00,
    billedPct: 0.00,
    estGrandTotalCost: 7303613.00,
    awiGrade: 'Premium',
    primaryVeneer: 'Rift White Oak',
    finishSystem: 'Clear Conversion Varnish',
    hoursBudget: { Engineering: 700, Fabrication: 2200, Finishing: 500, Installation: 600 },
    hoursLogged: { Engineering: 680, Fabrication: 1450, Finishing: 310, Installation: 0 }
  },
  {
    no: 'P-26-1132',
    name: '[26011R] AUS Project Oasis (Austin)',
    customer: 'Hensel Phelps - Austin',
    architect: 'Page Southerland Page',
    location: 'Austin, TX',
    stage: 'Engineering',
    priority: 'Normal',
    pm: 'Christopher Holland',
    startDate: '2026-06-15',
    dueDate: '2026-12-31',
    origContractVal: 363375.00,
    currentContractVal: 5114150.00,
    woTotalVal: 5114150.01,
    billedVal: 347137.50,
    billedPct: 6.79,
    estGrandTotalCost: 3812367.00,
    awiGrade: 'Premium',
    primaryVeneer: 'Rift White Oak & Solid Surface',
    finishSystem: 'Matte Conversion Varnish',
    hoursBudget: { Engineering: 480, Fabrication: 1350, Finishing: 320, Installation: 400 },
    hoursLogged: { Engineering: 390, Fabrication: 520, Finishing: 40, Installation: 0 }
  },
  {
    no: 'P-26-1133',
    name: '[26018R] Samsung Observation Deck',
    customer: 'Austin Commercial LP - Dallas',
    architect: 'HKS Architects',
    location: 'Taylor, TX',
    stage: 'Closeout',
    priority: 'Low',
    pm: 'Marcus Reed',
    startDate: '2026-03-01',
    dueDate: '2026-10-15',
    origContractVal: 7700.00,
    currentContractVal: 7700.00,
    woTotalVal: 7700.00,
    billedVal: 7700.00,
    billedPct: 100.00,
    estGrandTotalCost: 6180.00,
    awiGrade: 'Custom',
    primaryVeneer: 'Solid Surface & Stainless',
    finishSystem: 'Factory Brushed',
    hoursBudget: { Engineering: 24, Fabrication: 60, Finishing: 12, Installation: 18 },
    hoursLogged: { Engineering: 24, Fabrication: 58, Finishing: 12, Installation: 18 }
  }
];

export interface ProjectChildrenData {
  workOrders: WorkOrder[];
  studyProjects: StudyProject[];
  sheets: Sheet[];
  shopDrawings: ShopDrawing[];
  files: ProjectFile[];
  submittals: SubmittalItem[];
  activities: ActivityLog[];
}

export const INITIAL_CHILDREN_DATA: Record<string, ProjectChildrenData> = {
  'P-26-1132': {
    workOrders: [
      { id: 'wo-11p', no: 'P-26-1132-011p', name: 'Table of Contents & General Mockups', status: 'Approved', value: 85000, budgetHours: 140, actualHours: 120, shipDate: '2026-10-15' },
      { id: 'wo-25p', no: 'P-26-1132-025p', name: 'Restroom Mockup Vanities & Surrounds', status: 'Approved', value: 340000, budgetHours: 320, actualHours: 290, shipDate: '2026-10-25' },
      { id: 'wo-22p', no: 'P-26-1132-022p', name: '102.5 Bar Counter & Back Bar Display', status: 'Engineering', value: 410000, budgetHours: 380, actualHours: 190, shipDate: '2026-11-10' },
      { id: 'wo-31p', no: 'P-26-1132-031p', name: 'Lobby Reception Desk (Phase 1)', status: 'Draft', value: 290000, budgetHours: 260, actualHours: 40, shipDate: '2026-11-28' }
    ],
    studyProjects: [
      { id: 'st-01', no: 'ST-01', title: 'Curved wood veneer joinery feasibility study', engineer: 'Christopher Holland', status: 'In Progress', budgetHours: 24, loggedHours: 16 },
      { id: 'st-02', no: 'ST-02', title: 'Solid surface thermoforming bar edge mockup', engineer: 'Ariana Samarripa', status: 'Complete', budgetHours: 18, loggedHours: 18, convertedWoNo: 'P-26-1132-022p' }
    ],
    sheets: [
      {
        id: 'sh-g00',
        number: 'G0.00',
        name: 'COVER SHEET',
        versions: [
          { id: 'v-b01', name: 'Bulletin 01', issueDate: '2026-08-31', slideCount: 4, uploadedBy: 'Rob Redmond', uploadedAt: '09/03/2026 06:31 AM', s3Key: 'projects/P-26-1132/sheets/G0.00_Bulletin01.pdf' },
          { id: 'v-90', name: '90 IFP', issueDate: '2026-07-31', slideCount: 3, uploadedBy: 'Rob Redmond', uploadedAt: '08/11/2026 08:16 AM', s3Key: 'projects/P-26-1132/sheets/G0.00_90IFP.pdf' }
        ],
        currentVersionIndex: 0,
        tags: ['General', 'Cover'],
        isPublished: true,
        hasMarkups: false
      },
      {
        id: 'sh-g01',
        number: 'G0.01',
        name: 'SHEET INDEX',
        versions: [
          { id: 'v-b01-1', name: 'Bulletin 01', issueDate: '2026-08-31', slideCount: 4, uploadedBy: 'Rob Redmond', uploadedAt: '09/03/2026 06:31 AM', s3Key: 'projects/P-26-1132/sheets/G0.01_Bulletin01.pdf' }
        ],
        currentVersionIndex: 0,
        tags: ['General'],
        isPublished: true,
        hasMarkups: false
      },
      {
        id: 'sh-g02',
        number: 'G0.02',
        name: 'PROJECT INFORMATION',
        versions: [
          { id: 'v-90-2', name: '90 IFP', issueDate: '2026-07-31', slideCount: 3, uploadedBy: 'Rob Redmond', uploadedAt: '08/11/2026 08:16 AM', s3Key: 'projects/P-26-1132/sheets/G0.02_90IFP.pdf' }
        ],
        currentVersionIndex: 0,
        tags: ['Code', 'General'],
        isPublished: true,
        hasMarkups: false
      },
      {
        id: 'sh-g10',
        number: 'G0.10',
        name: 'ADA STANDARDS',
        versions: [
          { id: 'v-90-10', name: '90 IFP', issueDate: '2026-07-31', slideCount: 3, uploadedBy: 'Rob Redmond', uploadedAt: '08/11/2026 08:16 AM', s3Key: 'projects/P-26-1132/sheets/G0.10_90IFP.pdf' }
        ],
        currentVersionIndex: 0,
        tags: ['ADA', 'Accessibility'],
        isPublished: true,
        hasMarkups: false
      },
      {
        id: 'sh-g20',
        number: 'G0.20',
        name: 'RESPONSIBILITY MATRIX',
        versions: [
          { id: 'v-90-20', name: '90 IFP', issueDate: '2026-07-31', slideCount: 3, uploadedBy: 'Rob Redmond', uploadedAt: '08/11/2026 08:16 AM', s3Key: 'projects/P-26-1132/sheets/G0.20_90IFP.pdf' }
        ],
        currentVersionIndex: 0,
        tags: ['Scope'],
        isPublished: true,
        hasMarkups: true
      }
    ],
    shopDrawings: [
      {
        id: 'sd-100-10',
        number: '100.10',
        name: 'TABLE OF CONTENTS',
        woId: 'wo-11p',
        versions: [
          { id: 'v-mp5', name: 'MOCKUP PACKAGE # 5', issueDate: '2026-09-29', slideCount: 9, uploadedBy: 'Ariana Samarripa', uploadedAt: '10/05/2026 11:15 AM', s3Key: 'projects/P-26-1132/shop/100.10_MP5.pdf' }
        ],
        currentVersionIndex: 0,
        tags: ['Mockup', 'TOC'],
        qcStatus: 'QC Approved',
        isPublished: true,
        hasMarkups: false
      },
      {
        id: 'sd-101-00',
        number: '101.00',
        name: 'RESTROOM MOCKUP',
        woId: 'wo-25p',
        versions: [
          { id: 'v-mp1-00', name: 'MOCKUP PACKAGE # 1', issueDate: '2026-09-08', slideCount: 2, uploadedBy: 'Christopher Holland', uploadedAt: '09/08/2026 03:31 PM', s3Key: 'projects/P-26-1132/shop/101.00_MP1.pdf' }
        ],
        currentVersionIndex: 0,
        tags: ['Mockup', 'Vanity'],
        qcStatus: 'QC Approved',
        isPublished: true,
        hasMarkups: false
      },
      {
        id: 'sd-101-01',
        number: '101.01',
        name: 'RESTROOM MOCKUP DETAILS',
        woId: 'wo-25p',
        versions: [
          { id: 'v-mp1-01', name: 'MOCKUP PACKAGE # 1', issueDate: '2026-09-08', slideCount: 2, uploadedBy: 'Christopher Holland', uploadedAt: '09/08/2026 03:31 PM', s3Key: 'projects/P-26-1132/shop/101.01_MP1.pdf' }
        ],
        currentVersionIndex: 0,
        tags: ['Mockup'],
        qcStatus: 'QC Approved',
        isPublished: true,
        hasMarkups: false
      },
      {
        id: 'sd-102-49',
        number: '102.49',
        name: '102.5 BAR COUNTER',
        woId: 'wo-22p',
        versions: [
          { id: 'v-mp2-49', name: 'MOCKUP PACKAGE # 2', issueDate: '2026-09-08', slideCount: 2, uploadedBy: 'Christopher Holland', uploadedAt: '09/08/2026 03:40 PM', s3Key: 'projects/P-26-1132/shop/102.49_MP2.pdf' }
        ],
        currentVersionIndex: 0,
        tags: ['Bar', 'Mockup'],
        qcStatus: 'Pending QC',
        isPublished: false,
        hasMarkups: false
      }
    ],
    files: [
      { id: 'f-1', name: 'Executed Subcontract Agreement.pdf', category: 'Contracts', sizeFormatted: '2.4 MB', uploadedBy: 'Sarah Mitchell', date: '06/20/2026', s3Uri: 's3://quadeconnect-prod/projects/P-26-1132/contracts/agreement.pdf' },
      { id: 'f-2', name: 'CSI Section 06 41 00 - Casework.pdf', category: 'Specifications', sizeFormatted: '1.1 MB', uploadedBy: 'Rob Redmond', date: '07/12/2026', s3Uri: 's3://quadeconnect-prod/projects/P-26-1132/specs/064100.pdf' },
      { id: 'f-3', name: 'Architect Finish Selections & Cutsheets.pdf', category: 'Client Uploads', sizeFormatted: '4.8 MB', uploadedBy: 'Hensel Phelps (Client)', date: '08/04/2026', s3Uri: 's3://quadeconnect-prod/projects/P-26-1132/client/finishes.pdf' }
    ],
    submittals: [
      {
        id: 'sub-01',
        no: 'SUB-001',
        title: 'Restroom Mockup Package #1 (101.00 - 101.04)',
        specSection: '06 41 00 Architectural Wood Casework',
        revisionNo: 0,
        status: 'Approved',
        ballInCourt: '—',
        attachedDrawingIds: ['sd-101-00', 'sd-101-01'],
        sentDate: '2026-09-10',
        dueDate: '2026-09-24',
        auditTrail: [
          { timestamp: '09/10/2026', user: 'Rob Redmond', action: 'Issued package to Architect' },
          { timestamp: '09/18/2026', user: 'Architect (PGAL)', action: 'Stamped Approved for Construction' }
        ]
      },
      {
        id: 'sub-02',
        no: 'SUB-002',
        title: '102.5 Bar Counter Submittal Package #2',
        specSection: '06 41 00 Architectural Wood Casework',
        revisionNo: 1,
        status: 'Submitted',
        ballInCourt: 'Client / Architect',
        attachedDrawingIds: ['sd-102-49'],
        sentDate: '2026-10-01',
        dueDate: '2026-10-15',
        auditTrail: [
          { timestamp: '10/01/2026', user: 'Christopher Holland', action: 'Uploaded revised mockup drawing package' }
        ]
      }
    ],
    activities: [
      { id: 'act-1', timestamp: '10/05/2026 11:15 AM', user: 'Ariana Samarripa', description: 'Uploaded Shop Drawing 100.10 (MOCKUP PACKAGE # 5)' },
      { id: 'act-2', timestamp: '09/29/2026 04:30 PM', user: 'Christopher Holland', description: 'Converted Study ST-02 into Work Order P-26-1132-022p' },
      { id: 'act-3', timestamp: '09/08/2026 03:31 PM', user: 'Christopher Holland', description: 'Uploaded initial Restroom Mockup shop drawings' }
    ]
  }
};

