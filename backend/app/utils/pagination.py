from __future__ import annotations

import base64
import binascii
import json
from typing import Generic, TypeVar
from uuid import UUID

from fastapi import HTTPException, status
from pydantic import BaseModel
from sqlalchemy import Select, tuple_
from sqlalchemy.orm import Session

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    items: list[T]
    next_cursor: str | None = None


def paginate(db: Session, stmt: Select, sort_col, model, cursor: str | None, limit: int):
    """Keyset pagination, newest first, on (sort_col, id): stable under inserts, O(limit).

    sort_col must be a non-null date/datetime column of model, which must have a UUID `id`.
    """
    if cursor:
        try:
            ts, row_id = json.loads(base64.urlsafe_b64decode(cursor))
            after = (sort_col.type.python_type.fromisoformat(ts), UUID(row_id))
            stmt = stmt.where(tuple_(sort_col, model.id) < after)
        except ValueError, TypeError, binascii.Error:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid cursor") from None
    rows = list(db.scalars(stmt.order_by(sort_col.desc(), model.id.desc()).limit(limit + 1)).all())
    next_cursor = None
    if len(rows) > limit:
        rows = rows[:limit]
        last = rows[-1]
        key = json.dumps([getattr(last, sort_col.key).isoformat(), str(last.id)])
        next_cursor = base64.urlsafe_b64encode(key.encode()).decode()
    return {"items": rows, "next_cursor": next_cursor}
