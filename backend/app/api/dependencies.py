from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.identity import User, UserSession
from app.services.identity import InvalidSessionError, get_valid_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_session(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> UserSession:
    try:
        return get_valid_session(db, token=token)
    except InvalidSessionError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None


def get_current_user(
    session: UserSession = Depends(get_current_session),
) -> User:
    return session.user
