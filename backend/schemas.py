"""
Pydantic Schemas for Request/Response Validation

Defines data structures for API requests and responses.

LEARNING CONCEPTS:
- Pydantic models for validation
- Request/response DTOs (Data Transfer Objects)
- Type safety and automatic validation
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime


# ==================== USER SCHEMAS ====================

class UserBase(BaseModel):
    """
    LEARNING: Base Schema Pattern
    
    Common fields that multiple schemas share.
    Other schemas inherit from this to avoid duplication.
    """
    email: EmailStr  # Automatically validates email format
    name: str = Field(..., min_length=1, max_length=100)


class UserRegister(UserBase):
    """
    Schema for user registration request.
    
    LEARNING: Request Validation
    
    When user sends POST /api/auth/register, FastAPI automatically:
    1. Validates email is valid format
    2. Checks password meets length requirements
    3. Rejects request if validation fails
    4. Converts JSON to this Python object
    
    Example valid request:
    {
        "email": "user@example.com",
        "name": "John Doe",
        "password": "SecurePass123!"
    }
    """
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('password')
    def password_strength(cls, v):
        """
        LEARNING: Custom Validators
        
        Pydantic validators run additional checks beyond basic types.
        This ensures password meets security requirements.
        """
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        return v


class UserLogin(BaseModel):
    """
    Schema for login request.
    
    Simpler than registration - just email and password.
    """
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """
    Schema for updating user profile.
    
    LEARNING: Optional Fields
    
    All fields are optional so user can update just name, or just email.
    Use Optional[] to allow None values.
    """
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    """
    Schema for user data in responses.
    
    LEARNING: Response Models
    
    What goes back to the frontend.
    NOTE: Never include password_hash in responses!
    
    Example response:
    {
        "id": 123,
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user",
        "created_at": "2024-01-01T00:00:00"
    }
    """
    id: int
    role: str
    created_at: datetime
    
    class Config:
        """
        LEARNING: Pydantic Config
        
        orm_mode = True allows creating this schema from SQLAlchemy models.
        
        Example:
        user_db = db.query(User).first()  # SQLAlchemy model
        user_response = UserResponse.from_orm(user_db)  # Convert to Pydantic
        """
        from_attributes = True  # Pydantic v2 syntax (was orm_mode in v1)


class TokenResponse(BaseModel):
    """
    Schema for authentication token response.
    
    Sent after successful login or registration.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ==================== SYMPTOM CHECK SCHEMAS ====================

class SymptomCheckRequest(BaseModel):
    """
    Schema for symptom analysis request.
    
    LEARNING: Complex Validation
    
    Field() allows adding constraints:
    - min_length/max_length for strings
    - ge/le for numbers (greater equal, less equal)
    - description for API documentation
    """
    symptoms: str = Field(..., min_length=10, max_length=1000, description="Describe your symptoms")
    age: int = Field(..., ge=1, le=120, description="Your age")
    gender: str = Field(..., description="Your gender (Male/Female/Other)")
    duration: str = Field(..., max_length=100, description="How long you've had symptoms (e.g., '3 days')")
    
    @validator('gender')
    def validate_gender(cls, v):
        """Ensure gender is one of accepted values."""
        allowed = ['male', 'female', 'other']
        if v.lower() not in allowed:
            raise ValueError(f'Gender must be one of: {", ".join(allowed)}')
        return v.lower()


class SymptomCheckResponse(BaseModel):
    """Schema for symptom analysis response."""
    id: int
    symptoms: str
    age: int
    gender: str
    duration: str
    ai_response: str
    severity: str
    timestamp: datetime
    
    class Config:
        from_attributes = True


# ==================== CHATBOT SCHEMAS ====================

class ChatbotQueryRequest(BaseModel):
    """
    Schema for chatbot message request.
    """
    question: str = Field(..., min_length=1, max_length=1000)
    session_id: Optional[str] = None  # For conversation context


class ChatbotQueryResponse(BaseModel):
    """Schema for chatbot response."""
    id: int
    question: str
    answer: str
    session_id: Optional[str]
    timestamp: datetime
    
    class Config:
        from_attributes = True


class ChatbotFeedbackRequest(BaseModel):
    """Schema for rating chatbot response."""
    rating: int = Field(..., ge=1, le=5, description="Rating from 1-5 stars")


# ==================== RESUME ANALYSIS SCHEMAS ====================

class ResumeAnalysisResponse(BaseModel):
    """Schema for resume analysis result."""
    id: int
    filename: str
    target_role: str
    overall_score: int
    ats_score: Optional[int]
    feedback_json: Optional[dict]
    summary: Optional[str]
    timestamp: datetime
    
    class Config:
        from_attributes = True


# ==================== FAQ SCHEMAS ====================

class FAQBase(BaseModel):
    """Base FAQ schema."""
    question: str = Field(..., min_length=10, max_length=500)
    answer: str = Field(..., min_length=10)
    category: Optional[str] = None
    is_active: bool = True


class FAQCreate(FAQBase):
    """Schema for creating FAQ (admin only)."""
    pass


class FAQUpdate(BaseModel):
    """Schema for updating FAQ (admin only)."""
    question: Optional[str] = Field(None, min_length=10, max_length=500)
    answer: Optional[str] = Field(None, min_length=10)
    category: Optional[str] = None
    is_active: Optional[bool] = None


class FAQResponse(FAQBase):
    """Schema for FAQ in responses."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# ==================== COMMON SCHEMAS ====================

class MessageResponse(BaseModel):
    """
    Generic message response.
    
    Used for simple success/error messages.
    """
    message: str
    detail: Optional[str] = None


class ErrorResponse(BaseModel):
    """Schema for error responses."""
    error: str
    detail: Optional[str] = None
