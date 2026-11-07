import secrets
import hashlib
import time
from typing import Optional, Tuple
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError

# Configure Argon2id hasher with secure parameters
ph = PasswordHasher(
    time_cost=2,        # 2 iterations
    memory_cost=65536,  # 64 MB
    parallelism=2,      # 2 parallel threads
    hash_len=32,
    type=PasswordHasher.Type.ID if hasattr(PasswordHasher, "Type") else None
) if hasattr(PasswordHasher, "Type") else PasswordHasher(
    time_cost=2,
    memory_cost=65536,
    parallelism=2,
    hash_len=32
)

def hash_password(password: str) -> str:
    """Hash a plaintext password using Argon2id with random salt."""
    return ph.hash(password)

def verify_password(hash_str: str, password: str) -> bool:
    """Verify a plaintext password against an Argon2id hash."""
    try:
        return ph.verify(hash_str, password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False

def generate_session_token() -> Tuple[str, str]:
    """
    Generate a cryptographically secure 256-bit bearer token.
    Returns (raw_token, token_hash_for_db_storage).
    The raw token is returned to the user; only the SHA-256 hash is stored in SQLite.
    """
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    return raw_token, token_hash

def hash_token(raw_token: str) -> str:
    """Hash a bearer token to look it up in the database."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

# Simple sliding window rate limiter for login attempts per IP/Email
_login_attempts = {}

def check_login_rate_limit(key: str, max_attempts: int = 5, window_seconds: int = 60) -> bool:
    """
    Returns True if allowed, False if rate limited.
    """
    now = time.time()
    history = _login_attempts.get(key, [])
    # Filter out attempts older than window
    history = [t for t in history if now - t < window_seconds]
    if len(history) >= max_attempts:
        _login_attempts[key] = history
        return False
    history.append(now)
    _login_attempts[key] = history
    return True

def reset_login_rate_limit(key: str):
    """Clear attempts on successful login."""
    if key in _login_attempts:
        del _login_attempts[key]
