from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models import Tag, User

router = APIRouter(prefix="/api/v1/tags", tags=["tags"])


class TagResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str


@router.get("", response_model=list[TagResponse])
def list_tags(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # unpaginated, a person's tag list stays small; paginate if it ever doesn't
    return db.scalars(select(Tag).where(Tag.owner_id == user.id).order_by(Tag.name)).all()
