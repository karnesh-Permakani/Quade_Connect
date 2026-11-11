"""
QuadeConnect Project Management API Server (FastAPI)
Implements:
1. Role-Based Access Control (RBAC) with Cost-Masking Serializer.
2. AWS S3 / Box Pre-Signed URL Generator for In-Browser Document Streaming.
3. Automated PyMuPDF PDF Page/Slide Counter & Thumbnail Worker.
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import fitz  # PyMuPDF
import boto3
import os

app = FastAPI(
    title="QuadeConnect Project Management API",
    version="1.0.0",
    description="Millwork Project Management combining ClickUp UX and Innergy ERP domain depth."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# 1. RBAC & Cost-Masking Serialization Layer
# ---------------------------------------------------------

COST_SENSITIVE_FIELDS = [
    "orig_contract_val",
    "current_contract_val",
    "wo_total_val",
    "billed_val",
    "billed_pct",
    "est_grand_total_cost",
    "hourly_rate_usd",
    "labor_cost"
]

class User(BaseModel):
    id: str
    email: str
    role: str  # 'ADMIN', 'OPS_HEAD', 'PROJECT_MANAGER', 'ENGINEER', 'QC_REVIEWER', 'CLIENT'
    assigned_project_ids: List[str] = []

def get_current_user() -> User:
    # In production, parses JWT from Authorization: Bearer <token>
    # Defaulting to an Engineer to demonstrate cost masking:
    return User(
        id="usr_eng_01",
        email="christopher@quadeconnect.com",
        role="ENGINEER",
        assigned_project_ids=["P-26-1132", "P-26-1137"]
    )

def sanitize_project_response(raw_project: Dict[str, Any], user: User) -> Dict[str, Any]:
    """
    Enforces strict Role-Based Access Control (RBAC):
    - Non-Admins NEVER receive financial or contract dollar values.
    """
    cleaned = raw_project.copy()
    if user.role != "ADMIN":
        for field in COST_SENSITIVE_FIELDS:
            cleaned.pop(field, None)
    return cleaned

# ---------------------------------------------------------
# 2. AWS S3 Pre-Signed Upload & Stream Generator
# ---------------------------------------------------------

S3_BUCKET = os.getenv("AWS_S3_BUCKET", "quadeconnect-millwork-docs")
s3_client = boto3.client("s3") if os.getenv("AWS_ACCESS_KEY_ID") else None

@app.get("/api/v1/storage/upload-url")
def get_presigned_upload_url(
    project_no: str,
    category: str,
    filename: str,
    user: User = Depends(get_current_user)
):
    """
    Generates a secure pre-signed PUT URL so the client browser
    streams large architectural PDFs straight into AWS S3 / Box.
    """
    object_key = f"projects/{project_no}/{category}/{filename}"
    if s3_client:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={"Bucket": S3_BUCKET, "Key": object_key},
            ExpiresIn=3600
        )
    else:
        # Mock URL for local demonstration
        presigned_url = f"https://s3.amazonaws.com/{S3_BUCKET}/{object_key}?mock_token=xyz123"

    return {
        "upload_url": presigned_url,
        "s3_key": object_key,
        "bucket": S3_BUCKET
    }

# ---------------------------------------------------------
# 3. PyMuPDF Automated Slide Counter Worker Hook
# ---------------------------------------------------------

def process_uploaded_pdf(file_bytes: bytes) -> Dict[str, Any]:
    """
    Invoked when a PDF lands in S3:
    1. Extracts total slides/pages count (Sigma-N).
    2. Renders high-res WebP thumbnails for each slide.
    3. Runs OCR/Text extraction on title blocks.
    """
    pdf_doc = fitz.open(stream=file_bytes, filetype="pdf")
    slide_count = len(pdf_doc)
    slide_thumbnails = []

    for i in range(slide_count):
        page = pdf_doc[i]
        pix = page.get_pixmap(dpi=150)
        thumb_bytes = pix.tobytes("webp")
        slide_thumbnails.append({
            "slide_index": i,
            "size_bytes": len(thumb_bytes)
        })

    first_page_text = pdf_doc[0].get_text()
    pdf_doc.close()

    return {
        "slide_count": slide_count,
        "thumbnails_generated": len(slide_thumbnails),
        "title_block_sample": first_page_text[:300]
    }

# ---------------------------------------------------------
# 4. Projects Endpoint (Grid & Kanban Data)
# ---------------------------------------------------------

@app.get("/api/v1/projects")
def list_projects(user: User = Depends(get_current_user)):
    """
    Returns the project list:
    - Scoped to assigned projects for Engineers/Ops/Clients.
    - Strips all cost columns for non-Admins.
    """
    mock_db = [
        {
            "proj_no": "P-26-1132",
            "name": "[26011R] AUS Project Oasis (Austin)",
            "customer": "Hensel Phelps - Austin",
            "stage": "ENGINEERING",
            "orig_contract_val": 363375.00,
            "current_contract_val": 5114150.00,
            "wo_total_val": 5114150.01,
            "billed_val": 347137.50,
            "billed_pct": 6.79,
            "est_grand_total_cost": 3812367.00,
            "hours_budget": {"Engineering": 450, "Fabrication": 1200, "Installation": 320},
            "hours_logged": {"Engineering": 380, "Fabrication": 410, "Installation": 0}
        },
        {
            "proj_no": "P-26-1137",
            "name": "BWI Project Oasis (Baltimore)",
            "customer": "Whiting Turner - DC - Washington",
            "stage": "ENGINEERING",
            "orig_contract_val": 6573906.00,
            "current_contract_val": 8838759.00,
            "wo_total_val": 0.00,
            "billed_val": 0.00,
            "billed_pct": 0.00,
            "est_grand_total_cost": 6278759.00,
            "hours_budget": {"Engineering": 600, "Fabrication": 1800, "Installation": 500},
            "hours_logged": {"Engineering": 120, "Fabrication": 0, "Installation": 0}
        }
    ]

    # Filter projects by user access
    if user.role != "ADMIN":
        filtered = [p for p in mock_db if p["proj_no"] in user.assigned_project_ids]
    else:
        filtered = mock_db

    # Apply cost masking
    return [sanitize_project_response(p, user) for p in filtered]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

