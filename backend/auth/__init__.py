"""
Authentication Package

Provides JWT token handling and password security.
"""

from .jwt_handler import (
    create_access_token,
    verify_token,
    extract_user_id,
    create_user_token
)

from .password import (
    hash_password,
    verify_password,
    validate_password_strength
)

__all__ = [
    # JWT functions
    "create_access_token",
    "verify_token",
    "extract_user_id",
    "create_user_token",
    # Password functions
    "hash_password",
    "verify_password",
    "validate_password_strength"
]
