import random
import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.models.entities import Complaint, Habitation, User
from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintUpdate,
    ComplaintItem,
    ComplaintListResponse,
)

router = APIRouter(prefix="/complaints")


def generate_complaint_code(db: Session) -> str:
    count = db.query(Complaint).count() + 1
    rand_suffix = random.randint(10, 99)
    return f"CMP-2026-{count:04d}{rand_suffix}"


@router.get("", response_model=ComplaintListResponse)
def list_complaints(
    status: Optional[str] = Query(None, description="Filter by status (Submitted, Under Review, In Progress, Resolved, Rejected)"),
    issue_type: Optional[str] = Query(None, description="Filter by issue type"),
    habitation_id: Optional[str] = Query(None, description="Filter by habitation ID"),
    search: Optional[str] = Query(None, description="Search term across location or description"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """
    List complaints with multi-parameter filtering for administrative overview and user tracking.
    """
    query = db.query(Complaint)

    if status:
        query = query.filter(Complaint.status == status)
    if issue_type:
        query = query.filter(Complaint.issue_type == issue_type)
    if habitation_id:
        query = query.filter(Complaint.habitation_id == habitation_id)
    if search:
        s = f"%{search.strip()}%"
        query = query.filter((Complaint.location_text.ilike(s)) | (Complaint.description.ilike(s)) | (Complaint.complaint_code.ilike(s)))

    total = query.count()
    records = query.order_by(desc(Complaint.created_at)).offset(offset).limit(limit).all()

    # Calculate status breakdown counts
    open_count = db.query(Complaint).filter(Complaint.status.in_(["Submitted", "Under Review"])).count()
    in_progress_count = db.query(Complaint).filter(Complaint.status == "In Progress").count()
    resolved_count = db.query(Complaint).filter(Complaint.status == "Resolved").count()

    items = []
    for c in records:
        hab_name = c.habitation_rel.name if c.habitation_rel else None
        items.append(
            ComplaintItem(
                id=c.id,
                complaint_code=c.complaint_code,
                user_id=c.user_id,
                habitation_id=c.habitation_id,
                habitation_name=hab_name,
                issue_type=c.issue_type,
                location_text=c.location_text,
                description=c.description,
                photo_url=c.photo_url,
                contact_name=c.contact_name,
                contact_phone=c.contact_phone,
                status=c.status,
                assigned_to=c.assigned_to,
                admin_notes=c.admin_notes,
                created_at=c.created_at,
                updated_at=c.updated_at,
            )
        )

    return ComplaintListResponse(
        items=items,
        total=total,
        open_count=open_count,
        in_progress_count=in_progress_count,
        resolved_count=resolved_count,
    )


@router.post("", response_model=ComplaintItem, status_code=status.HTTP_201_CREATED)
def submit_complaint(
    payload: ComplaintCreate,
    user_id: Optional[str] = Query(None, description="Optional submitting user ID"),
    db: Session = Depends(get_db),
):
    """
    Submit a citizen complaint / hazard damage report.
    """
    code = generate_complaint_code(db)
    new_complaint = Complaint(
        id=str(uuid.uuid4()),
        complaint_code=code,
        user_id=user_id,
        habitation_id=payload.habitation_id,
        issue_type=payload.issue_type,
        location_text=payload.location_text.strip(),
        description=payload.description.strip(),
        photo_url=payload.photo_url,
        contact_name=payload.contact_name.strip(),
        contact_phone=payload.contact_phone.strip(),
        status="Submitted",
        assigned_to="Disaster Response Team (Pending Review)",
        admin_notes="Report logged by citizen. Queued for field inspection.",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    hab_name = new_complaint.habitation_rel.name if new_complaint.habitation_rel else None

    return ComplaintItem(
        id=new_complaint.id,
        complaint_code=new_complaint.complaint_code,
        user_id=new_complaint.user_id,
        habitation_id=new_complaint.habitation_id,
        habitation_name=hab_name,
        issue_type=new_complaint.issue_type,
        location_text=new_complaint.location_text,
        description=new_complaint.description,
        photo_url=new_complaint.photo_url,
        contact_name=new_complaint.contact_name,
        contact_phone=new_complaint.contact_phone,
        status=new_complaint.status,
        assigned_to=new_complaint.assigned_to,
        admin_notes=new_complaint.admin_notes,
        created_at=new_complaint.created_at,
        updated_at=new_complaint.updated_at,
    )


@router.get("/{complaint_id}", response_model=ComplaintItem)
def get_complaint(complaint_id: str, db: Session = Depends(get_db)):
    """
    Retrieve single complaint details by ID or code.
    """
    c = db.query(Complaint).filter((Complaint.id == complaint_id) | (Complaint.complaint_code == complaint_id)).first()
    if not c:
        raise HTTPException(status_code=404, detail="Complaint record not found.")

    hab_name = c.habitation_rel.name if c.habitation_rel else None
    return ComplaintItem(
        id=c.id,
        complaint_code=c.complaint_code,
        user_id=c.user_id,
        habitation_id=c.habitation_id,
        habitation_name=hab_name,
        issue_type=c.issue_type,
        location_text=c.location_text,
        description=c.description,
        photo_url=c.photo_url,
        contact_name=c.contact_name,
        contact_phone=c.contact_phone,
        status=c.status,
        assigned_to=c.assigned_to,
        admin_notes=c.admin_notes,
        created_at=c.created_at,
        updated_at=c.updated_at,
    )


@router.patch("/{complaint_id}", response_model=ComplaintItem)
def update_complaint(
    complaint_id: str,
    payload: ComplaintUpdate,
    db: Session = Depends(get_db),
):
    """
    Administrative management: update status, assign officer, add notes.
    """
    c = db.query(Complaint).filter((Complaint.id == complaint_id) | (Complaint.complaint_code == complaint_id)).first()
    if not c:
        raise HTTPException(status_code=404, detail="Complaint record not found.")

    if payload.status:
        c.status = payload.status
    if payload.assigned_to is not None:
        c.assigned_to = payload.assigned_to
    if payload.admin_notes is not None:
        c.admin_notes = payload.admin_notes
    c.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(c)

    hab_name = c.habitation_rel.name if c.habitation_rel else None
    return ComplaintItem(
        id=c.id,
        complaint_code=c.complaint_code,
        user_id=c.user_id,
        habitation_id=c.habitation_id,
        habitation_name=hab_name,
        issue_type=c.issue_type,
        location_text=c.location_text,
        description=c.description,
        photo_url=c.photo_url,
        contact_name=c.contact_name,
        contact_phone=c.contact_phone,
        status=c.status,
        assigned_to=c.assigned_to,
        admin_notes=c.admin_notes,
        created_at=c.created_at,
        updated_at=c.updated_at,
    )
