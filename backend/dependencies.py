"""
Dependency Functions for FastAPI Routes

These functions are used with Depends() in route handlers.

LEARNING CONCEPTS:
- Dependency injection in FastAPI
- Authentication middleware
- Extracting data from requests (headers, tokens, etc.)
"""

from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.user import User, UserRole
from auth import verify_token


# Security scheme for Swagger UI
"""
LEARNING: HTTPBearer

This tells FastAPI to expect authentication in format:
Authorization: Bearer <token>

Shows a "lock" icon in Swagger docs where you can enter token.
"""
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token.
    
    LEARNING: How This Works
    
    1. FastAPI extracts "Authorization: Bearer <token>" header
    2. We verify the token
    3. We fetch user from database
    4. Return user object to route handler
    
    If anything fails, raise 401 Unauthorized.
    
    Usage in routes:
    @router.get("/profile")
    def get_profile(user: User = Depends(get_current_user)):
        return user.to_dict()
    
    Args:
        credentials: HTTP Bearer token from request header
        db: Database session
        
    Returns:
        User object if authenticated
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    # Extract token from credentials
    token = credentials.credentials
    
    # Verify and decode token
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user ID from token
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Ensure current user is an admin.
    
    LEARNING: Dependency Chaining
    
    This depends on get_current_user, which depends on security.
    FastAPI automatically chains them:
    1. Check Bearer token exists
    2. Verify token and get user
    3. Check if user is admin
    
    Usage:
    @router.delete("/users/{user_id}")
    def delete_user(
        user_id: int,
        admin: User = Depends(get_current_admin)
    ):
        # Only admins can reach this code
        pass
    
    Args:
        current_user: User object from get_current_user
        
    Returns:
        User object if user is admin
        
    Raises:
        HTTPException: If user is not an admin
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


async def get_optional_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get user if token provided, None if not.
    
    LEARNING: Optional Authentication
    
    Some routes allow both authenticated AND guest users:
    - Chatbot (guests can ask questions)
    - Symptom checker (limited for guests)
    
    This dependency returns:
    - User object if valid token provided
    - None if no token (guest user)
    
    Usage:
    @router.post("/chatbot/query")
    def chatbot_query(
        question: str,
        user: Optional[User] = Depends(get_optional_user)
    ):
        if user:
            # Save to user's history
            pass
        else:
            # Guest user, no history
            pass
    
    Args:
        authorization: Authorization header (optional)
        db: Database session
        
    Returns:
        User object if authenticated, None otherwise
    """
    if not authorization:
        return None
    
    # Extract token from "Bearer <token>"
    if not authorization.startswith("Bearer "):
        return None
    
    token = authorization.split(" ")[1]
    
    # Verify token
    payload = verify_token(token)
    if not payload:
        return None
    
    # Get user
    user_id = payload.get("user_id")
    if not user_id:
        return None
    
    user = db.query(User).filter(User.id == user_id).first()
    return user


def require_role(*allowed_roles: UserRole):
    """
    Decorator factory for role-based access control.
    
    LEARNING: Custom Permission Decorators
    
    Create flexible permission checks:
    
    Usage:
    @router.get("/admin/stats")
    def get_stats(user: User = Depends(require_role(UserRole.ADMIN))):
        pass
    
    @router.post("/premium-feature")
    def premium(user: User = Depends(require_role(UserRole.USER, UserRole.ADMIN))):
        pass
    
    Args:
        *allowed_roles: Variable number of allowed user roles
        
    Returns:
        Dependency function that checks user role
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {[r.value for r in allowed_roles]}"
            )
        return current_user
    
    return role_checker
