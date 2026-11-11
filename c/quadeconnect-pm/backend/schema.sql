-- =====================================================================
-- QuadeConnect Project Management — PostgreSQL Database Schema
-- Domain: Architectural Millwork & Custom Casework Fabrication
-- Features: Strict RBAC Cost Masking, S3/Box File Registry, PDF Slide
--           Counters (ΣN), Revision Sets, Mockup Packages, Submittals.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations & Users
CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN', 'ADMIN', 'OPS_HEAD', 'PROJECT_MANAGER',
    'ENGINEER', 'QC_REVIEWER', 'FIELD_INSTALLER', 'CLIENT'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'ENGINEER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin-Only Trade Hourly Pay Rates
CREATE TABLE trade_pay_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_name VARCHAR(100) UNIQUE NOT NULL, -- 'Engineering', 'Fabrication', 'Finishing', 'Installation'
    hourly_rate_usd NUMERIC(10, 2) NOT NULL, -- e.g. 65.00, 45.00, 48.00, 55.00
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- 2. Master Projects
CREATE TYPE project_stage AS ENUM (
    'STUDY_PRE_BID', 'ENGINEERING', 'QC_REVIEW',
    'SUBMITTAL', 'FABRICATION', 'INSTALLATION', 'CLOSEOUT'
);

CREATE TYPE project_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proj_no VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'P-26-1132', 'P-26-1137'
    code VARCHAR(50),                   -- e.g. '26011R', '26019N'
    name VARCHAR(255) NOT NULL,
    customer VARCHAR(255) NOT NULL,
    architect VARCHAR(255),
    location VARCHAR(255),
    stage project_stage NOT NULL DEFAULT 'STUDY_PRE_BID',
    priority project_priority NOT NULL DEFAULT 'NORMAL',
    pm_id UUID REFERENCES users(id),
    
    -- FINANCIAL COLUMNS (Strictly Admin-Only Visibility)
    orig_contract_val NUMERIC(14, 2) DEFAULT 0.00,
    current_contract_val NUMERIC(14, 2) DEFAULT 0.00,
    wo_total_val NUMERIC(14, 2) DEFAULT 0.00,
    billed_val NUMERIC(14, 2) DEFAULT 0.00,
    billed_pct NUMERIC(5, 2) DEFAULT 0.00,
    est_grand_total_cost NUMERIC(14, 2) DEFAULT 0.00,
    
    -- Millwork Specifications (ClickUp-Style Custom Fields)
    awi_grade VARCHAR(50) DEFAULT 'Premium', -- 'Economy', 'Custom', 'Premium'
    primary_veneer VARCHAR(150),             -- e.g. 'Rift White Oak', 'Walnut'
    finish_system VARCHAR(150),
    
    -- Timeline
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Assignments (Controls which non-Admin users can see which projects)
CREATE TABLE project_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_in_project VARCHAR(50),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, user_id)
);

-- 3. Labor Hours Budget & Actuals
CREATE TABLE project_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    trade_name VARCHAR(100) NOT NULL,
    budget_hours NUMERIC(10, 1) DEFAULT 0.0,
    logged_hours NUMERIC(10, 1) DEFAULT 0.0,
    UNIQUE (project_id, trade_name)
);

-- 4. Work Orders (Production Scopes)
CREATE TYPE wo_status AS ENUM (
    'DRAFT', 'ENGINEERING', 'APPROVED', 'RELEASED_TO_FAB',
    'IN_PRODUCTION', 'SHIPPED', 'INSTALLED', 'CLOSED'
);

CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    wo_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'P-26-1132-011p'
    name VARCHAR(255) NOT NULL,
    status wo_status NOT NULL DEFAULT 'DRAFT',
    wo_value NUMERIC(12, 2) DEFAULT 0.00,   -- Admin only
    budget_hours NUMERIC(10, 1) DEFAULT 0.0,
    actual_hours NUMERIC(10, 1) DEFAULT 0.0,
    ship_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Study Projects (Pre-Engineering Technical R&D)
CREATE TABLE study_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    study_no VARCHAR(50) NOT NULL, -- 'ST-01'
    title VARCHAR(255) NOT NULL,
    assigned_engineer_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    budget_hours NUMERIC(10, 1) DEFAULT 0.0,
    logged_hours NUMERIC(10, 1) DEFAULT 0.0,
    converted_wo_id UUID REFERENCES work_orders(id)
);

-- 6. Architectural Sheets
CREATE TABLE sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    sheet_number VARCHAR(50) NOT NULL, -- 'G0.00', 'G0.02', 'A1.01'
    sheet_name VARCHAR(255) NOT NULL,  -- 'PROJECT INFORMATION'
    is_published BOOLEAN DEFAULT FALSE,
    has_pinned_markups BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    UNIQUE (project_id, sheet_number)
);

CREATE TABLE sheet_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sheet_id UUID REFERENCES sheets(id) ON DELETE CASCADE,
    version_set_name VARCHAR(100) NOT NULL, -- '90 IFP', 'Bulletin 01'
    issue_date DATE NOT NULL,
    slide_count INT NOT NULL DEFAULT 1,      -- Extracted from PDF (Σ4, Σ3)
    s3_key VARCHAR(500) NOT NULL,
    thumbnails_s3_prefix VARCHAR(500),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Engineering Shop Drawings
CREATE TABLE shop_drawings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES work_orders(id),
    drawing_number VARCHAR(50) NOT NULL, -- '100.10', '101.00', '102.49'
    drawing_name VARCHAR(255) NOT NULL,  -- 'RESTROOM MOCKUP', 'BAR COUNTER'
    qc_status VARCHAR(50) DEFAULT 'PENDING_QC', -- 'PENDING_QC', 'QC_APPROVED', 'REJECTED'
    is_published BOOLEAN DEFAULT FALSE,
    has_pinned_markups BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    UNIQUE (project_id, drawing_number)
);

CREATE TABLE shop_drawing_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_drawing_id UUID REFERENCES shop_drawings(id) ON DELETE CASCADE,
    version_name VARCHAR(100) NOT NULL, -- 'MOCKUP PACKAGE # 1', 'MOCKUP PACKAGE # 2'
    issue_date DATE NOT NULL,
    slide_count INT NOT NULL DEFAULT 1, -- Extracted from PDF (Σ9, Σ2)
    s3_key VARCHAR(500) NOT NULL,
    thumbnails_s3_prefix VARCHAR(500),
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Cloud Files (AWS S3 / Box Registry)
CREATE TABLE project_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Contracts', 'Specifications', 'Cut Sheets', 'Client Uploads'
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100),
    s3_key VARCHAR(500) NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Internal QC Reviews & Non-Destructive Annotation Pins
CREATE TABLE qc_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_drawing_version_id UUID REFERENCES shop_drawing_versions(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL, -- 'QC_APPROVED', 'REJECTED'
    checklist_data JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pdf_annotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_type VARCHAR(50) NOT NULL, -- 'SHEET' or 'SHOP_DRAWING'
    version_id UUID NOT NULL,
    slide_index INT NOT NULL DEFAULT 0,
    author_id UUID REFERENCES users(id),
    annotation_type VARCHAR(50), -- 'PIN', 'REDLINE', 'MEASUREMENT'
    vector_json JSONB NOT NULL,
    comment_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Submittals & Revision Loop (REVX)
CREATE TABLE submittals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    submittal_no VARCHAR(50) NOT NULL, -- 'SUB-001'
    title VARCHAR(255) NOT NULL,
    spec_section VARCHAR(100) DEFAULT '06 41 00 Architectural Wood Casework',
    revision_no INT DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED', -- 'DRAFT', 'SUBMITTED', 'APPROVED', 'REVISE_RESUBMIT'
    ball_in_court VARCHAR(100) DEFAULT 'CLIENT_ARCHITECT',
    transmittal_s3_key VARCHAR(500),
    sent_date DATE,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submittal_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submittal_id UUID REFERENCES submittals(id) ON DELETE CASCADE,
    shop_drawing_version_id UUID REFERENCES shop_drawing_versions(id)
);

