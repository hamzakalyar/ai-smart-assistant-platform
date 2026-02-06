"""
Database Setup with SQLAlchemy

This file configures the database connection and provides:
- Database engine (connection to SQLite/PostgreSQL)
- Session management (how we interact with the database)
- Base class for all models

LEARNING CONCEPTS:
- SQLAlchemy ORM (Object-Relational Mapping)
- Database sessions and connections
- Context managers for safe database access
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import logging

from config import settings

logger = logging.getLogger(__name__)


# ==================== DATABASE ENGINE ====================
"""
LEARNING: Database Engine

The engine is the connection pool to your database.
Think of it as the "bridge" between Python and the database.

Arguments:
- connect_args={'check_same_thread': False}: SQLite-specific
  (SQLite normally allows only one thread, we disable that check)
- pool_pre_ping=True: Check if connection is alive before using it
- echo=True: Log all SQL statements (useful for learning, disable in production)
"""

# Create engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    pool_pre_ping=True,
    echo=settings.DEBUG  # Log SQL queries in debug mode
)

logger.info(f"📊 Database engine created: {settings.DATABASE_URL}")


# ==================== SESSION FACTORY ====================
"""
LEARNING: Sessions

A session is like a "workspace" for database operations.
You can:
- Query data: session.query(User).filter(...)
- Add new records: session.add(new_user)
- Commit changes: session.commit()
- Rollback mistakes: session.rollback()

SessionLocal is a factory - calling it creates a new session.
"""

SessionLocal = sessionmaker(
    autocommit=False,  # Don't auto-commit (we control when to save)
    autoflush=False,   # Don't auto-flush (we control when to sync)
    bind=engine        # Connected to our database engine
)


# ==================== BASE CLASS ====================
"""
LEARNING: Declarative Base

All our models (User, SymptomCheck, etc.) will inherit from this Base.
SQLAlchemy uses this to:
- Track all your models
- Create database tables
- Generate SQL queries

Example:
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
"""

Base = declarative_base()


# ==================== DEPENDENCY INJECTION ====================
"""
LEARNING: Dependency Injection in FastAPI

This function provides a database session to route handlers.
FastAPI automatically:
1. Calls this function to get a session
2. Passes the session to your route
3. Closes the session when done (even if an error occurs)

Usage in routes:
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
"""

def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency for FastAPI routes.
    
    Yields:
        Session: SQLAlchemy database session
        
    Example:
        ```python
        @app.get("/users")
        def read_users(db: Session = Depends(get_db)):
            return db.query(User).all()
        ```
    """
    db = SessionLocal()
    try:
        yield db  # Provide session to the route
    except Exception as e:
        logger.error(f"Database error: {e}")
        db.rollback()  # Undo changes if error occurs
        raise
    finally:
        db.close()  # Always close the session


# ==================== DATABASE initialization ====================
def init_db() -> None:
    """
    Initialize database by creating all tables.
    
    LEARNING: Table Creation
    
    This reads all models that inherit from Base and creates
    their corresponding tables in the database.
    
    Called on application startup (in main.py lifespan).
    """
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {e}")
        raise


# ==================== DATABASE UTILITIES ====================
def drop_all_tables() -> None:
    """
    Drop all tables from the database.
    
    ⚠️  WARNING: This deletes ALL data!
    
    Use cases:
    - Starting fresh in development
    - Running tests that need a clean database
    - NEVER use in production without backups!
    """
    logger.warning("⚠️  Dropping all database tables...")
    Base.metadata.drop_all(bind=engine)
    logger.info("🗑️  All tables dropped")


def reset_database() -> None:
    """
    Complete database reset: drop all tables and recreate them.
    
    ⚠️  WARNING: This deletes ALL data!
    """
    drop_all_tables()
    init_db()
    logger.info("🔄 Database reset complete")


# ==================== CONNECTION TESTING ====================
def test_database_connection() -> bool:
    """
    Test if database connection is working.
    
    Returns:
        bool: True if connection successful, False otherwise
    """
    try:
        db = SessionLocal()
        # Try a simple query
        db.execute("SELECT 1")
        db.close()
        logger.info("✅ Database connection test successful")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection test failed: {e}")
        return False


# Run connection test on import (only in debug mode)
if settings.DEBUG:
    test_database_connection()
