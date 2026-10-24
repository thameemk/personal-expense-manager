from __future__ import annotations

from uuid import UUID

import pycountry
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.session import get_db
from app.models import Group, User
from app.utils.pagination import Page, paginate

router = APIRouter(prefix="/api/v1/groups", tags=["groups"])


class GroupCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=120)
    currency: str = "INR"  # ISO 4217

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, value: str) -> str:
        value = value.upper()
        if pycountry.currencies.get(alpha_3=value) is None:
            raise ValueError("Enter a valid ISO 4217 currency code")
        return value


class GroupResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    currency: str


def get_owned_group(group_id: UUID, user: User, db: Session) -> Group:
    group = db.get(Group, group_id)
    if group is None or group.owner_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
    return group


@router.post("", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
def create_group(
    payload: GroupCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> Group:
    group = Group(owner_id=user.id, name=payload.name, currency=payload.currency)
    db.add(group)
    db.commit()
    return group


@router.get("", response_model=Page[GroupResponse])
def list_groups(
    cursor: str | None = None,
    limit: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Group).where(Group.owner_id == user.id)
    return paginate(db, stmt, Group.created_at, Group, cursor, limit)
