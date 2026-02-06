"""
FAQ Model

Admin-managed frequently asked questions for the chatbot.

LEARNING CONCEPTS:
- Admin-only content management
- Boolean flags for active/inactive records
- Categorization systems
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime

from database import Base


class FAQ(Base):
    """
    FAQ Model
    
    Stores frequently asked questions that the chatbot can reference.
    Only admins can create/edit/delete FAQs.
    """
    
    __tablename__ = "faqs"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Question and Answer
    """
    LEARNING: Text vs String
    
    question: String (limited length, good for questions)
    answer: Text (unlimited length, good for detailed answers)
    """
    question = Column(String(500), nullable=False, unique=True, index=True)
    answer = Column(Text, nullable=False)
    
    # Categorization
    """
    LEARNING: Categories for Organization
    
    Examples:
    - "general" - General health info
    - "symptoms" - About specific symptoms
    - "medications" - Drug information
    - "prevention" - Preventive care
    """
    category = Column(String(100), nullable=True, index=True)
    
    # Active/Inactive Flag
    """
    LEARNING: Soft Delete Pattern
    
    Instead of deleting FAQs, we mark them as inactive.
    Benefits:
    - Can reactivate later
    - Keeps history
    - No broken references
    
    The chatbot will only use FAQs where is_active=True
    """
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    
    # Metadata
    """
    LEARNING: Audit Trail
    
    Track when FAQ was created and last updated.
    Useful for:
    - Admin dashboard showing recent changes
    - Identifying outdated content
    """
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Who created/updated (optional enhancement)
    # created_by_admin_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    def __repr__(self):
        return f"<FAQ(id={self.id}, question='{self.question[:50]}...', active={self.is_active})>"
    
    def to_dict(self):
        """Convert to dictionary for JSON responses."""
        return {
            "id": self.id,
            "question": self.question,
            "answer": self.answer,
            "category": self.category,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
