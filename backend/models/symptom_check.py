"""
Symptom Check Model

Stores symptom analysis requests and AI responses.

LEARNING CONCEPTS:
- Foreign keys (linking to other tables)
- JSON storage in databases
- Enum for severity levels
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from database import Base


class SeverityLevel(enum.Enum):
    """
    LEARNING: Enum for Severity Classification
    
    AI will analyze symptoms and classify severity into these levels.
    """
    LOW = "low"          # Minor symptoms, self-care recommended
    MEDIUM = "medium"    # Moderate symptoms, consider seeing doctor
    HIGH = "high"        # Serious symptoms, seek medical attention soon


class SymptomCheck(Base):
    """
    Symptom Check Model
    
    Stores user symptom inputs and AI analysis results.
    """
    
    __tablename__ = "symptom_checks"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Foreign Key to User
    """
    LEARNING: Foreign Keys
    
    Links this table to the users table.
    - user_id column stores the ID of the user who made this check
    - ForeignKey("users.id") creates the database constraint
    - nullable=True allows guest users (no account required)
    """
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    # Symptom Information
    symptoms = Column(Text, nullable=False)  # Text allows longer input than String
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    duration = Column(String(100), nullable=False)  # e.g., "3 days", "1 week"
    
    # AI Response
    """
    LEARNING: Storing Complex Data
    
    ai_response could be JSON with:
    {
        "possible_conditions": ["Condition 1", "Condition 2"],
        "precautions": ["Precaution 1", "Precaution 2"],
        "when_to_see_doctor": "Warning signs..."
    }
    
    We store it as Text for flexibility with different AI response formats.
    """
    ai_response = Column(Text, nullable=False)
    
    # Severity Classification
    severity = Column(
        SQLEnum(SeverityLevel),
        nullable=False,
        default=SeverityLevel.MEDIUM
    )
    
    # Metadata
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationship back to User
    """
    LEARNING: Bidirectional Relationships
    
    This creates a two-way link:
    - symptom_check.user gives you the User object
    - user.symptom_checks gives you all SymptomCheck objects for that user
    """
    user = relationship("User", back_populates="symptom_checks")
    
    def __repr__(self):
        return f"<SymptomCheck(id={self.id}, user_id={self.user_id}, severity={self.severity.value})>"
    
    def to_dict(self):
        """Convert to dictionary for JSON responses."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "symptoms": self.symptoms,
            "age": self.age,
            "gender": self.gender,
            "duration": self.duration,
            "ai_response": self.ai_response,
            "severity": self.severity.value,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }
