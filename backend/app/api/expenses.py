from __future__ import annotations

from datetime import date as Date
from decimal import Decimal
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session, contains_eager

from app.api.dependencies import get_current_user
from app.api.groups import GroupResponse, get_owned_group
from app.db.session import get_db
from app.models import Expense, Group, User
from app.utils.pagination import Page, paginate

router = APIRouter(prefix="/api/v1/expenses", tags=["expenses"])


class ExpenseUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    description: str = Field(min_length=1, max_length=255)
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    date: Date


class ExpenseCreate(ExpenseUpdate):
    group_id: UUID


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    group_id: UUID
    description: str
    amount: Decimal
    date: Date
    group: GroupResponse | None = None  # only with ?include=group


def to_response(expense: Expense, with_group: bool = False) -> ExpenseResponse:
    # built by hand so that expense.group is never lazy-loaded unless asked for;
    # group is left unset otherwise, so exclude_unset drops it from the JSON
    extra = {"group": GroupResponse.model_validate(expense.group)} if with_group else {}
    return ExpenseResponse(
        id=expense.id,
        group_id=expense.group_id,
        description=expense.description,
        amount=expense.amount,
        date=expense.date,
        **extra,
    )


@router.post(
    "",
    response_model=ExpenseResponse,
    response_model_exclude_unset=True,
    status_code=status.HTTP_201_CREATED,
)
def create_expense(
    payload: ExpenseCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ExpenseResponse:
    get_owned_group(payload.group_id, user, db)  # 404 unless it is the caller's group
    expense = Expense(**payload.model_dump())
    db.add(expense)
    db.commit()
    return to_response(expense)


@router.get("", response_model=Page[ExpenseResponse], response_model_exclude_unset=True)
def list_expenses(
    group_id: UUID | None = None,
    include: Literal["group"] | None = None,
    cursor: str | None = None,
    limit: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if group_id:
        get_owned_group(group_id, user, db)  # 404 unless it is the caller's group
    stmt = select(Expense).join(Expense.group).where(Group.owner_id == user.id)
    if include:
        stmt = stmt.options(contains_eager(Expense.group))
    if group_id:
        stmt = stmt.where(Expense.group_id == group_id)
    page = paginate(db, stmt, Expense.date, Expense, cursor, limit)
    page["items"] = [to_response(e, with_group=bool(include)) for e in page["items"]]
    return page


def get_owned_expense(expense_id: UUID, user: User, db: Session) -> Expense:
    expense = db.scalar(
        select(Expense)
        .join(Expense.group)
        .where(Expense.id == expense_id, Group.owner_id == user.id)
    )
    if expense is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse, response_model_exclude_unset=True)
def update_expense(
    expense_id: UUID,
    payload: ExpenseUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ExpenseResponse:
    expense = get_owned_expense(expense_id, user, db)
    for field, value in payload.model_dump().items():
        setattr(expense, field, value)
    db.commit()
    return to_response(expense)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    db.delete(get_owned_expense(expense_id, user, db))
    db.commit()
