"""
Database Models Package

This package contains all SQLAlchemy ORM models for the application.

LEARNING: Package Structure
- __init__.py makes this directory a Python package
- Allows importing models with: from models import User
- Centralizes model imports for easy access
"""

from .user import User
from .symptom_check import SymptomCheck
from .chatbot_log import ChatbotLog
from .resume_analysis import ResumeAnalysis
from .faq import FAQ

# Export all models
__all__ = [
    "User",
    "SymptomCheck",
    "ChatbotLog",
    "ResumeAnalysis",
    "FAQ"
]
