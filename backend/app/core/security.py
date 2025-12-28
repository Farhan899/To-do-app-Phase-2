from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import HTTPException, status
from typing import Dict, Any
from app.core.config import settings

def decode_jwt(token: str, secret: str = settings.BETTER_AUTH_SECRET) -> Dict[str, Any]:
    """
    Decode and validate JWT token.

    Args:
        token: JWT token string
        secret: Secret key for verification

    Returns:
        Decoded JWT payload

    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )

        # Verify required claims
        if "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing user ID (sub claim)"
            )

        return payload

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}"
        )

def verify_user_access(token_user_id: str, path_user_id: str) -> None:
    """
    Verify that the authenticated user matches the path user_id.

    Args:
        token_user_id: User ID from JWT token (sub claim)
        path_user_id: User ID from URL path parameter

    Raises:
        HTTPException: 403 if user IDs don't match
    """
    if token_user_id != path_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: cannot access another user's resources"
        )
