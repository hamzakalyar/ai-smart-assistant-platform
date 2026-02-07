"""
Authentication Routes

Handles user registration, login, and profile management.

LEARNING CONCEPTS:
- RESTful API design
- FastAPI route handlers
- Request/response flow
- Error handling
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User, UserRole
from schemas import (
    UserRegister,
    UserLogin,
    UserUpdate,
    UserResponse,
    TokenResponse,
    MessageResponse
)
from auth import hash_password, verify_password, create_user_token
from dependencies import get_current_user

# Create router
"""
LEARNING: APIRouter

Routers group related endpoints together.
In main.py, we include this router with prefix="/api/auth"

So routes defined here:
- @router.post("/register") becomes POST /api/auth/register
- @router.post("/login") becomes POST /api/auth/login
"""
router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """
    Register a new user account.
    
    LEARNING: Registration Flow
    
    1. Receive user data (email, name, password)
    2. Check if email already exists
    3. Hash the password (NEVER store plain text!)
    4. Create user in database
    5. Generate JWT token
    6. Return token + user info
    
    Args:
        user_data: UserRegister schema (validated by Pydantic)
        db: Database session (injected by FastAPI)
        
    Returns:
        TokenResponse with access_token and user info
        
    Raises:
        HTTPException 400: If email already registered
        
    Example request:
    POST /api/auth/register
    {
        "email": "user@example.com",
        "name": "John Doe",
        "password": "SecurePass123!"
    }
    
    Example response:
    {
        "access_token": "eyJhbGci...",
        "token_type": "bearer",
        "user": {
            "id": 1,
            "email": "user@example.com",
            "name": "John Doe",
            "role": "user"
        }
    }
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    password_hash = hash_password(user_data.password)
    
    # Create new user
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=password_hash,
        role=UserRole.USER  # Default role
    )
    
    # Save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Get the ID that was auto-generated
    
    # Create access token
    token = create_user_token(
        user_id=new_user.id,
        email=new_user.email,
        role=new_user.role.value
    )
    
    # Return token and user info
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.from_orm(new_user)
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login with email and password.
    
    LEARNING: Login Flow
    
    1. Receive email and password
    2. Find user by email
    3. Verify password hash matches
    4. Generate new JWT token
    5. Return token + user info
    
    Args:
        credentials: UserLogin schema
        db: Database session
        
    Returns:
        TokenResponse with access_token and user info
        
    Raises:
        HTTPException 401: If email or password is incorrect
        
    Example request:
    POST /api/auth/login
    {
        "email": "user@example.com",
        "password": "SecurePass123!"
    }
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        # Don't reveal if email exists (security best practice)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    token = create_user_token(
        user_id=user.id,
        email=user.email,
        role=user.role.value
    )
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """
    Get current user's profile.
    
    LEARNING: Protected Routes
    
    Depends(get_current_user) means:
    - User MUST be authenticated (valid JWT token)
    - If not, FastAPI automatically returns 401 Unauthorized
    - If yes, current_user contains the User object
    
    Example request:
    GET /api/auth/profile
    Headers:
        Authorization: Bearer eyJhbGci...
    
    Example response:
    {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user",
        "created_at": "2024-01-01T00:00:00"
    }
    """
    return UserResponse.from_orm(current_user)


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile.
    
    LEARNING: Partial Updates
    
    User can update just name, or just email, or both.
    We only update fields that were provided (not None).
    
    Args:
        update_data: UserUpdate schema (all fields optional)
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated user info
        
    Example request:
    PUT /api/auth/profile
    Headers:
        Authorization: Bearer eyJhbGci...
    Body:
    {
        "name": "Jane Doe"
    }
    """
    # Update only provided fields
    if update_data.name is not None:
        current_user.name = update_data.name
    
    if update_data.email is not None:
        # Check if new email is already taken
        existing = db.query(User).filter(
            User.email == update_data.email,
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        current_user.email = update_data.email
    
    # Save changes
    db.commit()
    db.refresh(current_user)
    
    return UserResponse.from_orm(current_user)


@router.delete("/account", response_model=MessageResponse)
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete current user's account.
    
    LEARNING: Cascade Deletes
    
    When we delete a user, SQLAlchemy automatically deletes:
    - All their symptom checks
    - All their chatbot logs
    - All their resume analyses
    
    This is because we defined cascade="all, delete-orphan" in the models.
    
    Returns:
        Success message
    """
    db.delete(current_user)
    db.commit()
    
    return MessageResponse(
        message="Account deleted successfully"
    )
