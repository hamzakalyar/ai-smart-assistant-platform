"""
Chatbot Log Model

Stores chatbot conversations and feedback ratings.

LEARNING CONCEPTS:
- Nullable foreign keys (for guest users)
- Rating/feedback systems
- Conversation history tracking
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class ChatbotLog(Base):
    """
    Chatbot Log Model
    
    Stores each chatbot interaction with optional user rating.
    """
    
    __tablename__ = "chatbot_logs"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # User (nullable for guest users)
    """
    LEARNING: Optional Relationships
    
    user_id is nullable=True because:
    - Guest users can use chatbot without account
    - We still want to log their questions for analytics
    - If user_id is None, it's a guest interaction
    """
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    
    # Conversation Data
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    
    # Feedback System
    """
    LEARNING: Rating System
    
    rating: 1-5 stars (nullable because users might not rate)
    - 5: Excellent response
    - 4: Good response
    - 3: Okay response
    - 2: Poor response
    - 1: Very poor response
    - None: Not rated yet
    """
    rating = Column(Integer, nullable=True)  # 1-5 stars, or None if not rated
    
    # Session tracking (optional)
    """
    LEARNING: Session Management
    
    session_id groups related messages in a conversation.
    Example: If user asks 3 questions in a row, they share the same session_id.
    This helps provide context-aware responses.
    """
    session_id = Column(String(100), nullable=True, index=True)
    
    # Metadata
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationship
    user = relationship("User", back_populates="chatbot_logs")
    
    def __repr__(self):
        return f"<ChatbotLog(id={self.id}, user_id={self.user_id}, rating={self.rating})>"
    
    def to_dict(self):
        """Convert to dictionary for JSON responses."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "question": self.question,
            "answer": self.answer,
            "rating": self.rating,
            "session_id": self.session_id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }
