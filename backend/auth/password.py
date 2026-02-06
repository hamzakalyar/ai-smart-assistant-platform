"""
Password Hashing and Verification

Secure password handling using bcrypt.

LEARNING CONCEPTS:
- Never store plain text passwords!
- One-way hashing (can't reverse to get original password)
- Salt and pepper for additional security
- Password strength validation
"""

from passlib.context import CryptContext
import re

# Create password context with bcrypt
"""
LEARNING: Password Hashing with Bcrypt

Bcrypt is a password hashing function designed to be slow.
Why slow? To make brute-force attacks impractical!

Arguments:
- schemes=["bcrypt"]: Use bcrypt algorithm
- deprecated="auto": Automatically update old hashes
"""
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a password for storing.
    
    LEARNING: One-Way Hashing
    
    When user creates account:
    1. User submits password: "mypassword123"
    2. We hash it: "$2b$12$random_salt_and_hash..."
    3. Store hash in database
    4. Original password is never stored!
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
        
    Example:
        >>> hash_password("mySecurePassword")
        '$2b$12$KIXqVxl0KZ3i9abcdefghijklmnopqrstuvwxyz...'
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    LEARNING: Password Verification
    
    When user logs in:
    1. User submits password: "mypassword123"
    2. We hash: we hash the entered the submitted password
    3. Compare: Does it match the stored hash?
    4. If yes: Password is correct!
    5. If no: Password is wrong
    
    Args:
        plain_password: User-submitted password
        hashed_password: Hash from database
        
    Returns:
        True if password matches, False otherwise
        
    Example:
        >>> hashed = hash_password("myPassword")
        >>> verify_password("myPassword", hashed)
        True
        >>> verify_password("wrongPassword", hashed)
        False
    """
    return pwd_context.verify(plain_password, hashed_password)


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Check if password meets security requirements.
    
    LEARNING: Password Policy
    
    Strong passwords should have:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    
    Args:
        password: Password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
        
    Example:
        >>> validate_password_strength("weak")
        (False, "Password must be at least 8 characters")
        >>> validate_password_strength("StrongP@ss123")
        (True, "")
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    
    return True, ""


# Example usage (for learning)
if __name__ == "__main__":
    """
    LEARNING: Test the password functions
    
    Run this file directly to see how password hashing works:
    python backend/auth/password.py
    """
    print("=== Password Hashing Demo ===\n")
    
    # Create a password
    original_password = "MySecureP@ssw0rd"
    print(f"Original password: {original_password}")
    
    # Hash it
    hashed = hash_password(original_password)
    print(f"Hashed password: {hashed}\n")
    
    # Verify correct password
    is_correct = verify_password(original_password, hashed)
    print(f"Verify correct password: {is_correct}")
    
    # Verify wrong password
    is_wrong = verify_password("WrongPassword", hashed)
    print(f"Verify wrong password: {is_wrong}\n")
    
    # Test password strength
    weak_passwords = ["weak", "12345678", "Password", "Pass@123"]
    strong_passwords = ["StrongP@ss123", "MySecure#2024"]
    
    print("=== Password Strength Tests ===")
    for pwd in weak_passwords + strong_passwords:
        is_valid, message = validate_password_strength(pwd)
        status = "✓ STRONG" if is_valid else f"✗ WEAK: {message}"
        print(f"{pwd:20} → {status}")
