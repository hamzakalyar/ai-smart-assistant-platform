"""
FastAPI Backend - Main Application Entry Point

This is the heart of our FastAPI application. It sets up:
- The FastAPI app instance
- CORS middleware for frontend communication
- Database initialization
- API route registration
- Global exception handlers

LEARNING CONCEPTS:
- FastAPI app creation and configuration  
- Middleware for cross-origin requests (CORS)
- Application lifecycle events (startup/shutdown)
- Modular route organization
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

# Import configuration and database setup
from config import settings
from database import engine, Base

# Import all route modules
# (commented out until we create them)
# from routes import auth, symptoms, chatbot, resume, admin

# Configure logging for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Application Lifespan Context Manager
# This runs code on startup and shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    LEARNING: Lifespan events in FastAPI
    
    This function runs when the application starts and stops.
    It's perfect for:
    - Creating database tables
    - Loading ML models
    - Opening connections to external services
    """
    # STARTUP: Create all database tables
    logger.info("🚀 Starting up AI MedBot Backend...")
    logger.info("📊 Creating database tables...")
    
    Base.metadata.create_all(bind=engine)
    
    logger.info("✅ Database tables created successfully!")
    logger.info(f"🔧 Environment: {settings.ENVIRONMENT}")
    logger.info(f"🌐 CORS Origins: {settings.CORS_ORIGINS}")
    
    yield  # Application runs here
    
    # SHUTDOWN: Cleanup operations
    logger.info("👋 Shutting down AI MedBot Backend...")


# Create FastAPI Application Instance
app = FastAPI(
    title="AI Smart Assistant Platform",
    description="AI-powered health assistant with symptom checker, chatbot, and resume analyzer",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI at /docs
    redoc_url="/redoc",  # ReDoc UI at /redoc
    lifespan=lifespan  # Register lifecycle events
)


# Configure CORS Middleware
"""
LEARNING: CORS (Cross-Origin Resource Sharing)

When your React frontend (localhost:3000) tries to access your
FastAPI backend (localhost:8000), browsers block it by default
for security. CORS middleware tells the browser "it's okay to
allow requests from these origins."

In production, you'd set CORS_ORIGINS to your actual domain.
"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Which domains can access
    allow_credentials=True,  # Allow cookies
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Root Endpoint - Health Check
@app.get("/", tags=["Health"])
async def root():
    """
    Simple health check endpoint.
    Useful for:
    - Verifying the API is running
    - Docker health checks
    - Monitoring services
    """
    return {
        "message": "AI Smart Assistant Platform API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }


# Global Exception Handler
"""
LEARNING: Exception Handling

Instead of letting errors crash the app or show ugly messages,
we catch them and return clean JSON responses with proper
HTTP status codes.
"""
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches any unhandled exceptions across the entire app.
    
    Args:
        request: The incoming HTTP request
        exc: The exception that was raised
    
    Returns:
        JSON response with error details
    """
    logger.error(f"❌ Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred",
            "type": type(exc).__name__
        }
    )


# Register API Routes
"""
LEARNING: Modular Route Organization

Instead of putting all endpoints in this file, we organize them
into separate route files (auth.py, symptoms.py, etc.) and
include them here with a prefix and tags.

Example:
- app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
- All routes in auth.py will be under /api/auth/...
- They'll be grouped under "Authentication" in the API docs
"""

from routes import auth

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# TODO: Uncomment as we create each router
# app.include_router(symptoms.router, prefix="/api/symptoms", tags=["Symptom Checker"])
# app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
# app.include_router(resume.router, prefix="/api/resume", tags=["Resume Analyzer"])
# app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


# Development Server Entry Point
if __name__ == "__main__":
    """
    LEARNING: Running FastAPI
    
    This block runs only when you execute: python main.py
    
    In production, you'd use a production-grade ASGI server:
    uvicorn main:app --host 0.0.0.0 --port 8000
    
    The --reload flag auto-restarts the server when code changes.
    Perfect for development!
    """
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )
