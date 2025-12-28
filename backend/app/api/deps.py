from typing import Annotated
from fastapi import Depends, HTTPException, status, Header
from app.core.security import decode_jwt

def get_current_user(
    authorization: Annotated[str | None, Header()] = None
) -> str:
    """
    FastAPI dependency for extracting authenticated user ID from JWT.

    Args:
        authorization: Authorization header (Bearer <token>)

    Returns:
        User ID from JWT sub claim

    Raises:
        HTTPException: 401 if token is missing or invalid
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected 'Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]
    payload = decode_jwt(token)

    return payload["sub"]  # Return user_id
