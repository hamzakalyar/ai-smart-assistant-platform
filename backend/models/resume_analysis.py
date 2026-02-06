"""
Resume Analysis Model

Stores uploaded resumes and AI analysis results.

LEARNING CONCEPTS:
- File metadata storage
- Score/rating systems
- JSON data storage
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class ResumeAnalysis(Base):
    """
    Resume Analysis Model
    
    Stores resume upload metadata and AI feedback.
    """
    
    __tablename__ = "resume_analyses"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # User (required - only registered users can analyze resumes)
    """
    LEARNING: Required vs Optional Foreign Keys
    
    Unlike chatbot_logs, this is NOT nullable because:
    - Resume analysis is a premium feature
    - Need to track analysis history
    - Users must be logged in to download reports
    """
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # File Information
    """
    LEARNING: File Storage Strategy
    
    We store:
    - filename: Original file name
    - file_path: Where the file is saved on disk (or cloud storage URL)
    - file_size: In bytes
    
    We DON'T store the actual file content in the database because:
    - Database would become huge
    - Slow queries
    - Better to store files on disk/cloud and just reference them
    """
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)  # Path to uploaded file
    file_size = Column(Integer, nullable=True)  # Size in bytes
    
    # Analysis Parameters
    target_role = Column(String(200), nullable=False)  # e.g., "Software Engineer"
    
    # Analysis Results
    """
    LEARNING: Score Storage
    
    overall_score: 0-100 rating
    ats_score: ATS (Applicant Tracking System) compatibility score 0-100
    """
    overall_score = Column(Integer, nullable=False)  # 0-100
    ats_score = Column(Integer, nullable=True)  # 0-100, ATS compatibility
    
    # Detailed Feedback
    """
    LEARNING: JSON Column Type
    
    feedback_json can store complex structured data:
    {
        "strengths": ["Strong technical skills", "Clear formatting"],
        "improvements": ["Add more metrics", "Expand project descriptions"],
        "missing_keywords": ["Python", "AWS", "Docker"],
        "formatting_feedback": "Use bullet points consistently"
    }
    
    SQLAlchemy automatically serializes/deserializes JSON.
    """
    feedback_json = Column(JSON, nullable=True)
    
    # Summary (plain text for easy display)
    summary = Column(Text, nullable=True)
    
    # Metadata
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationship
    user = relationship("User", back_populates="resume_analyses")
    
    def __repr__(self):
        return f"<ResumeAnalysis(id={self.id}, user_id={self.user_id}, score={self.overall_score})>"
    
    def to_dict(self):
        """Convert to dictionary for JSON responses."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "filename": self.filename,
            "target_role": self.target_role,
            "overall_score": self.overall_score,
            "ats_score": self.ats_score,
            "feedback_json": self.feedback_json,
            "summary": self.summary,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None
        }
