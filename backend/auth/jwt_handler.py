"""
JWT (JSON Web Token) Handler

Create and verify JWT tokens for authentication.

LEARNING CONCEPTS:
- JWT structure (header.payload.signature)
- Token-based authentication
- Token expiration
- Secure token signing
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt

from config import settings


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    LEARNING: How JWT Works
    
    1. Take user data (like user_id, email)
    2. Add expiration time
    3. Sign it with secret key
    4. Return encoded token
    
    JWT Structure:
    - Header: {"alg": "HS256", "typ": "JWT"}
    - Payload: {"user_id": 123, "exp": 1234567890}
    - Signature: HMACSHA256(header + payload, SECRET_KEY)
    
    Final token looks like: xxxxx.yyyyy.zzzzz
    
    Args:
        data: Dictionary of data to encode (usually user_id, email, role)
        expires_delta: Optional custom expiration time
        
    Returns:
        Encoded JWT token string
        
    Example:
        >>> token = create_access_token({"user_id": 123, "email": "user@example.com"})
        >>> print(token)
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjN9.abc123...'
    """
    # Copy data to avoid modifying original
    to_encode = data.copy()
    
    # Set expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Add expiration to payload
    to_encode.update({"exp": expire})
    
    # Encode and sign the token
    """
    LEARNING: Token Signing
    
    jwt.encode() creates the token by:
    1. Encoding header and payload as base64
    2. Signing with SECRET_KEY using HS256 algorithm
    3. Combining: header.payload.signature
    
    The signature ensures token can't be tampered with!
    """
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return encoded_jwt


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT token.
    
    LEARNING: Token Verification
    
    1. Decode the token
    2. Verify signature (using SECRET_KEY)
    3. Check expiration
    4. Return payload if valid
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded payload if valid, None if invalid
        
    Example:
        >>> token = create_access_token({"user_id": 123})
        >>> payload = verify_token(token)
        >>> print(payload)
        {'user_id': 123, 'exp': 1234567890}
    """
    try:
        # Decode and verify token
        """
        LEARNING: What can go wrong?
        
        - Invalid signature: Token was tampered with
        - Expired token: Token is too old
        - Malformed token: Not a valid JWT
        
        jwt.decode() handles all these checks!
        """
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
        
    except JWTError as e:
        # Token is invalid (expired, tampered, or malformed)
        print(f"JWT verification failed: {e}")
        return None


def extract_user_id(token: str) -> Optional[int]:
    """
    Extract user ID from JWT token.
    
    Convenience function to get user_id without handling payload dict.
    
    Args:
        token: JWT token string
        
    Returns:
        User ID if token is valid, None otherwise
        
    Example:
        >>> token = create_access_token({"user_id": 123})
        >>> user_id = extract_user_id(token)
        >>> print(user_id)
        123
    """
    payload = verify_token(token)
    if payload:
        return payload.get("user_id")
    return None


def create_user_token(user_id: int, email: str, role: str) -> str:
    """
    Create a token with standard user data.
    
    LEARNING: What to include in JWT payload?
    
    Include:
    - user_id: To identify the user
    - email: For display purposes
    - role: For authorization checks
    
    Don't include:
    - Password (security risk!)
    - Sensitive data (tokens can be decoded)
    - Too much data (makes token large)
    
    Args:
        user_id: User's database ID
        email: User's email
        role: User's role (user/admin)
        
    Returns:
        JWT token string
    """
    token_data = {
        "user_id": user_id,
        "email": email,
        "role": role
    }
    return create_access_token(token_data)


# Example usage (for learning)
if __name__ == "__main__":
    """
    LEARNING: Test JWT functions
    
    Run this file directly to see how JWT works:
    python backend/auth/jwt_handler.py
    """
    print("=== JWT Token Demo ===\n")
    
    # Create a token
    print("1. Creating token for user...")
    token = create_user_token(
        user_id=123,
        email="test@example.com",
        role="user"
    )
    print(f"Token: {token[:50]}...\n")
    
    # Verify the token
    print("2. Verifying token...")
    payload = verify_token(token)
    print(f"Payload: {payload}\n")
    
    # Extract user ID
    print("3. Extracting user ID...")
    user_id = extract_user_id(token)
    print(f"User ID: {user_id}\n")
    
    # Try invalid token
    print("4. Testing invalid token...")
    invalid_payload = verify_token("invalid.token.here")
    print(f"Invalid token result: {invalid_payload}\n")
    
    # Create expired token
    print("5. Testing expired token...")
    expired_token = create_access_token(
        {"user_id": 123},
        expires_delta=timedelta(seconds=-1)  # Already expired!
    )
    expired_payload = verify_token(expired_token)
    print(f"Expired token result: {expired_payload}")
