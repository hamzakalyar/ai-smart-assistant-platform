"""
User Model

Represents users in the system with role-based access control.

LEARNING CONCEPTS:
- SQLAlchemy ORM (Object-Relational Mapping)
- Database relationships (one-to-many)
- Enum for role management
- Timestamps with default values
"""

from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from database import Base


class UserRole(enum.Enum):
    """
    LEARNING: Python Enums
    
    Enums provide a type-safe way to represent a fixed set of values.
    Better than using strings because:
    - Type checking catches typos
    - IDE autocomplete
    - Clear documentation of valid values
    """
    GUEST = "guest"      # Limited access (can use features but no history)
    USER = "user"        # Full access to all AI features + history
    ADMIN = "admin"      # Can manage users, FAQs, view analytics


class User(Base):
    """
    User Model
    
    Stores user account information and manages authentication.
    
    LEARNING: SQLAlchemy Model Definition
    - Inherits from Base (defined in database.py)
    - __tablename__ defines the database table name
    - Column() defines each database column with type and constraints
    - relationship() defines connections to other tables
    """
    
    __tablename__ = "users"
    
    # Primary Key
    # LEARNING: Primary keys uniquely identify each row
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # User Information
    # LEARNING: nullable=False means this field is required
    name = Column(String(100), nullable=False)
    
    # LEARNING: unique=True prevents duplicate emails
    email = Column(String(255), unique=True, nullable=False, index=True)
    
    # LEARNING: Never store plain passwords! This will store hashed passwords
    password_hash = Column(String(255), nullable=False)
    
    # Role-based Access Control
    # LEARNING: Enum column restricts values to UserRole enum
    role = Column(
        SQLEnum(UserRole),
        default=UserRole.USER,
        nullable=False
    )
    
    # Timestamps
    # LEARNING: default=datetime.utcnow sets timestamp when row is created
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    """
    LEARNING: SQLAlchemy Relationships
    
    These don't create database columns, but allow easy access to related data.
    
    Example:
        user = db.query(User).first()
        user.symptom_checks  # Automatically fetches all symptom checks for this user
    
    Arguments:
    - "SymptomCheck": The related model (in quotes to avoid circular imports)
    - back_populates: Creates bidirectional relationship
    - cascade: What happens when user is deleted (delete related records too)
    """
    symptom_checks = relationship(
        "SymptomCheck",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    
    chatbot_logs = relationship(
        "ChatbotLog",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    
    resume_analyses = relationship(
        "ResumeAnalysis",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self):
        """
        LEARNING: __repr__ method
        
        Defines how the object appears when printed.
        Useful for debugging.
        """
        return f"<User(id={self.id}, email={self.email}, role={self.role.value})>"
    
    def to_dict(self):
        """
        Convert user to dictionary (for JSON responses).
        
        LEARNING: Never send password_hash to frontend!
        """
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role.value,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
