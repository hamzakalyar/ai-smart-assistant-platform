"""
Symptom Checker Routes

AI-powered symptom analysis endpoints.

LEARNING CONCEPTS:
- Integrating AI with APIs
- Handling optional authentication
- Storing AI responses in database
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models.user import User
from models.symptom_check import SymptomCheck, SeverityLevel
from schemas import SymptomCheckRequest, SymptomCheckResponse
from services.ai_service import generate_symptom_analysis
from dependencies import get_optional_user
import json

router = APIRouter()


@router.post("/check", response_model=SymptomCheckResponse, status_code=status.HTTP_201_CREATED)
async def check_symptoms(
    symptom_data: SymptomCheckRequest,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    """
    Analyze symptoms using AI.
    
    LEARNING: Optional Authentication
    
    This endpoint works for BOTH:
    - Authenticated users (saves to their history)
    - Guest users (still works, but no history saved)
    
    Uses Depends(get_optional_user) which returns:
    - User object if authenticated
    - None if guest
    
    Args:
        symptom_data: Symptom information
        db: Database session  
        user: Optional user (None for guests)
        
    Returns:
        AI analysis with severity and recommendations
        
    Example request:
    POST /api/symptoms/check
    {
        "symptoms": "I have a severe headache and fever for 3 days",
        "age": 30,
        "gender": "male",
        "duration": "3 days"
    }
    
    Example response:
    {
        "id": 1,
        "symptoms": "I have a severe headache...",
        "ai_response": "Based on your symptoms...",
        "severity": "medium",
        "timestamp": "2024-01-01T00:00:00"
    }
    """
    try:
        # Get AI analysis
        """
        LEARNING: Async AI Calls
        
        'await' pauses this function until AI responds.
        Meanwhile, FastAPI can handle other requests!
        This is non-blocking async I/O.
        """
        ai_result = await generate_symptom_analysis(
            symptoms=symptom_data.symptoms,
            age=symptom_data.age,
            gender=symptom_data.gender,
            duration=symptom_data.duration
        )
        
        # Parse AI response to determine severity
        """
        LEARNING: Parsing AI Responses
        
        AI might return unstructured text or JSON.
        We need to extract the severity level from the response.
        
        Simple approach: Look for keywords
        Better approach: Ask AI to return structured JSON
        """
        severity = determine_severity(ai_result["ai_response"])
        
        # Create symptom check record
        symptom_check = SymptomCheck(
            user_id=user.id if user else None,  # None for guests
            symptoms=symptom_data.symptoms,
            age=symptom_data.age,
            gender=symptom_data.gender,
            duration=symptom_data.duration,
            ai_response=ai_result["ai_response"],
            severity=severity
        )
        
        # Save to database (if user is registered, saves to history)
        db.add(symptom_check)
        db.commit()
        db.refresh(symptom_check)
        
        return SymptomCheckResponse.from_orm(symptom_check)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze symptoms: {str(e)}"
        )


@router.get("/history", response_model=List[SymptomCheckResponse])
async def get_symptom_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    limit: int = 20,
    offset: int = 0
):
    """
    Get user's symptom check history.
    
    LEARNING: Pagination
    
    Instead of returning ALL records (could be thousands!):
    - limit: How many records to return (default 20)
    - offset: How many to skip (for "page 2", offset=20)
    
    This is essential for performance with large datasets.
    
    Args:
        db: Database session
        user: Current authenticated user (required)
        limit: Max number of records to return
        offset: Number of records to skip
        
    Returns:
        List of past symptom checks
        
    Example request:
    GET /api/symptoms/history?limit=10&offset=0
    Headers:
        Authorization: Bearer <token>
    """
    from dependencies import get_current_user
    
    # Query user's symptom checks, ordered by most recent first
    """
    LEARNING: SQLAlchemy Queries
    
    - filter(): WHERE clause
    - order_by(): ORDER BY clause (-timestamp means descending)
    - limit()/offset(): LIMIT and OFFSET for pagination
    - all(): Execute query and return all results
    """
    checks = (
        db.query(SymptomCheck)
        .filter(SymptomCheck.user_id == user.id)
        .order_by(SymptomCheck.timestamp.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )
    
    return [SymptomCheckResponse.from_orm(check) for check in checks]


def determine_severity(ai_response: str) -> SeverityLevel:
    """
    Extract severity level from AI response.
    
    LEARNING: Parsing Unstructured Text
    
    AI might say:
    - "This appears to be LOW severity..."
    - "MEDIUM severity: These symptoms..."
    - "HIGH severity - seek immediate care!"
    
    We look for keywords to classify.
    
    Args:
        ai_response: AI's text response
        
    Returns:
        SeverityLevel enum
    """
    response_lower = ai_response.lower()
    
    # Check for high severity keywords
    high_keywords = ["high severity", "urgent", "emergency", "immediate", "serious", "severe"]
    if any(keyword in response_lower for keyword in high_keywords):
        return SeverityLevel.HIGH
    
    # Check for low severity keywords
    low_keywords = ["low severity", "minor", "mild", "self-care", "not serious"]
    if any(keyword in response_lower for keyword in low_keywords):
        return SeverityLevel.LOW
    
    # Default to medium
    return SeverityLevel.MEDIUM
