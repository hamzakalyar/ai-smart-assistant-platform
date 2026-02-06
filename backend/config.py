"""
Configuration Management with Pydantic Settings

This file manages all environment variables and app configuration.
Using Pydantic Settings provides:
- Type validation (ensures PORT is an integer, etc.)
- Default values
- Automatic .env file loading
- IDE autocomplete

LEARNING CONCEPTS:
- Environment variables for configuration
- Pydantic BaseSettings for validation
- Keeping secrets out of code (API keys, passwords)
- Different configs for dev/staging/production
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os


class Settings(BaseSettings):
    """
    Application Configuration
    
    LEARNING: Why use a config class?
    - Centralized configuration
    - Type safety (can't accidentally use string as int)
    - Easy testing (mock settings)
    - Clear documentation of what config exists
    """
    
    # ==================== APPLICATION ====================
    APP_NAME: str = "AI Smart Assistant Platform"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"  # development, staging, production
    DEBUG: bool = True
    
    # ==================== DATABASE ====================
    """
    LEARNING: Database URLs
    
    SQLite URL format: sqlite:///./database.db
    PostgreSQL format: postgresql://user:password@localhost/dbname
    
    Using SQLite for development (no server needed).
    For production, switch to PostgreSQL or MySQL.
    """
    DATABASE_URL: str = "sqlite:///./medbot.db"
    
    # ==================== JWT AUTHENTICATION ====================
    """
    LEARNING: JWT (JSON Web Tokens)
    
    JWT_SECRET: A secret key used to sign tokens (like a password)
    - MUST be kept secret
    - MUST be different in production
    - Generate with: openssl rand -hex 32
    
    JWT_ALGORITHM: How to encode the token (HS256 is standard)
    ACCESS_TOKEN_EXPIRE_MINUTES: How long tokens are valid
    """
    JWT_SECRET: str = "CHANGE_THIS_IN_PRODUCTION_USE_RANDOM_STRING"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # ==================== AI API KEYS ====================
    """
    LEARNING: Free AI API Keys
    
    These are loaded from environment variables (.env file).
    Never hardcode API keys in your code!
    
    Get keys from:
    - Gemini: https://ai.google.dev/
    - Groq: https://console.groq.com/
    - HuggingFace: https://huggingface.co/settings/tokens
    
    The app will try each provider in order until one works.
    This provides redundancy if one service is down.
    """
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    
    # Default AI models for each provider
    GEMINI_MODEL: str = "gemini-pro"
    GROQ_MODEL: str = "mixtral-8x7b-32768"  # Fast and free
    HUGGINGFACE_MODEL: str = "meta-llama/Llama-2-70b-chat-hf"
    
    # ==================== CORS CONFIGURATION ====================
    """
    LEARNING: CORS (Cross-Origin Resource Sharing)
    
    Lists which frontend URLs can access your API.
    Development: localhost:3000, localhost:5173 (Vite default)
    Production: Add your actual domain
    """
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # ==================== FILE UPLOADS ====================
    """
    LEARNING: File Upload Configuration
    
    UPLOAD_DIR: Where to store uploaded resumes
    MAX_UPLOAD_SIZE: Max file size in bytes (5MB = 5 * 1024 * 1024)
    ALLOWED_EXTENSIONS: Only allow specific file types for security
    """
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5 MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "docx"]
    
    # ==================== PAGINATION ====================
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # ==================== RATE LIMITING ====================
    """
    Optional: Prevent abuse by limiting requests per IP
    For portfolio/learning, we'll skip implementing this,
    but in production you'd want it.
    """
    RATE_LIMIT_ENABLED: bool = False
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # ==================== PYDANTIC SETTINGS CONFIG ====================
    """
    LEARNING: Model Config
    
    This tells Pydantic to:
    1. Load values from a .env file
    2. Read .env file with UTF-8 encoding
    3. Be case-insensitive with env var names
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="allow"  # Allow extra fields not defined here
    )
    
    def __init__(self, **kwargs):
        """
        Custom initialization to create upload directory if it doesn't exist.
        """
        super().__init__(**kwargs)
        
        # Create upload directory on startup
        if not os.path.exists(self.UPLOAD_DIR):
            os.makedirs(self.UPLOAD_DIR)
            print(f"📁 Created upload directory: {self.UPLOAD_DIR}")


# Create a single instance to use throughout the app
"""
LEARNING: Singleton Pattern

We create ONE instance of Settings and import it everywhere.
This ensures:
- Configuration is loaded once
- All parts of the app use the same config
- Easy to mock in tests
"""
settings = Settings()


# Validation on import
if settings.ENVIRONMENT == "production":
    """
    LEARNING: Production Safety Checks
    
    Before deploying, validate critical settings.
    This prevents common security mistakes.
    """
    if settings.JWT_SECRET == "CHANGE_THIS_IN_PRODUCTION_USE_RANDOM_STRING":
        raise ValueError(
            "⚠️  SECURITY WARNING: You must change JWT_SECRET in production! "
            "Generate a secure key with: openssl rand -hex 32"
        )
    
    if settings.DEBUG:
        print("⚠️  WARNING: DEBUG mode is enabled in production!")
    
    if not (settings.GEMINI_API_KEY or settings.GROQ_API_KEY or settings.HUGGINGFACE_API_KEY):
        raise ValueError(
            "⚠️  ERROR: No AI API keys configured! "
            "Set at least one: GEMINI_API_KEY, GROQ_API_KEY, or HUGGINGFACE_API_KEY"
        )


# Helper function to check which AI providers are available
def get_available_ai_providers() -> List[str]:
    """
    Returns list of configured AI providers.
    Useful for logging and choosing which provider to use.
    """
    providers = []
    if settings.GEMINI_API_KEY:
        providers.append("Gemini")
    if settings.GROQ_API_KEY:
        providers.append("Groq")
    if settings.HUGGINGFACE_API_KEY:
        providers.append("HuggingFace")
    return providers


# Log configuration on import (only in development)
if settings.DEBUG:
    print("=" * 60)
    print(f"🔧 {settings.APP_NAME} v{settings.VERSION}")
    print(f"🌍 Environment: {settings.ENVIRONMENT}")
    print(f"🗄️  Database: {settings.DATABASE_URL}")
    print(f"🤖 AI Providers: {', '.join(get_available_ai_providers()) or 'None configured'}")
    print(f"🌐 CORS Origins: {len(settings.CORS_ORIGINS)} allowed")
    print("=" * 60)
