import sqlite3
import json
import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from backend.app.config import DB_PATH
from backend.app.auth.security import hash_password, verify_password, generate_session_token, hash_token
from backend.app.auth.seed_users import DEMO_DEPARTMENTS, DEMO_USERS

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_auth_tables():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        department_name TEXT NOT NULL,
        department_code TEXT NOT NULL UNIQUE,
        department_head_id TEXT,
        created_at TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        employee_id TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        corporate_email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        department_id TEXT REFERENCES departments(id),
        manager_id TEXT REFERENCES users(id),
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        last_login_at TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        session_token_hash TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        revoked_at TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS access_events (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        user_email TEXT,
        event_type TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL,
        metadata_json TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        used_at TEXT
    );
    """)

    conn.commit()

    # Seed departments if empty
    cursor.execute("SELECT COUNT(*) FROM departments;")
    if cursor.fetchone()[0] == 0:
        now_str = datetime.now(timezone.utc).isoformat()
        for dept in DEMO_DEPARTMENTS:
            cursor.execute("""
            INSERT INTO departments (id, department_name, department_code, department_head_id, created_at)
            VALUES (?, ?, ?, ?, ?)
            """, (
                dept["id"],
                dept["department_name"],
                dept["department_code"],
                dept["department_head_id"],
                now_str
            ))
        conn.commit()

    # Seed users if empty
    cursor.execute("SELECT COUNT(*) FROM users;")
    if cursor.fetchone()[0] == 0:
        now_str = datetime.now(timezone.utc).isoformat()
        for u in DEMO_USERS:
            pw_hash = hash_password(u["password_plaintext"])
            cursor.execute("""
            INSERT INTO users (id, employee_id, full_name, corporate_email, password_hash, role, department_id, manager_id, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
            """, (
                u["id"],
                u["employee_id"],
                u["full_name"],
                u["corporate_email"].lower().strip(),
                pw_hash,
                u["role"],
                u["department_id"],
                u["manager_id"],
                now_str,
                now_str
            ))
        conn.commit()

    conn.close()

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT u.*, d.department_name, d.department_code, m.full_name as manager_name
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN users m ON u.manager_id = m.id
    WHERE LOWER(u.corporate_email) = LOWER(?)
    """, (email.strip(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT u.*, d.department_name, d.department_code, m.full_name as manager_name
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN users m ON u.manager_id = m.id
    WHERE u.id = ?
    """, (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_session_user(raw_token: str) -> Optional[Dict[str, Any]]:
    token_h = hash_token(raw_token)
    now_str = datetime.now(timezone.utc).isoformat()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT s.id as session_id, s.expires_at, s.revoked_at,
           u.id, u.employee_id, u.full_name, u.corporate_email, u.role,
           u.department_id, u.manager_id, u.is_active, u.created_at, u.updated_at, u.last_login_at,
           d.department_name, d.department_code, m.full_name as manager_name
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN users m ON u.manager_id = m.id
    WHERE s.session_token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ?
    """, (token_h, now_str))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def create_session(user_id: str, remember_me: bool = False) -> Dict[str, Any]:
    raw_token, token_hash = generate_session_token()
    duration_days = 7 if remember_me else 1
    expires_at = (datetime.now(timezone.utc) + timedelta(days=duration_days)).isoformat()
    now_str = datetime.now(timezone.utc).isoformat()
    session_id = f"sess-{uuid.uuid4().hex[:12]}"

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO sessions (id, user_id, session_token_hash, created_at, expires_at)
    VALUES (?, ?, ?, ?, ?)
    """, (session_id, user_id, token_hash, now_str, expires_at))

    cursor.execute("""
    UPDATE users SET last_login_at = ? WHERE id = ?
    """, (now_str, user_id))

    conn.commit()
    conn.close()

    return {
        "token": raw_token,
        "expires_at": expires_at
    }

def revoke_session(raw_token: str) -> bool:
    token_h = hash_token(raw_token)
    now_str = datetime.now(timezone.utc).isoformat()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE sessions SET revoked_at = ? WHERE session_token_hash = ? AND revoked_at IS NULL
    """, (now_str, token_h))
    revoked = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return revoked

def update_password(user_id: str, new_plaintext_password: str) -> bool:
    new_hash = hash_password(new_plaintext_password)
    now_str = datetime.now(timezone.utc).isoformat()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?
    """, (new_hash, now_str, user_id))
    # Invalidate all active sessions for this user for security
    cursor.execute("""
    UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL
    """, (now_str, user_id))
    conn.commit()
    conn.close()
    return True

def get_all_users() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT u.id, u.employee_id, u.full_name, u.corporate_email, u.role,
           u.department_id, u.manager_id, u.is_active, u.created_at, u.updated_at, u.last_login_at,
           d.department_name, d.department_code, m.full_name as manager_name
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN users m ON u.manager_id = m.id
    ORDER BY u.created_at ASC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_user(
    employee_id: str,
    full_name: str,
    corporate_email: str,
    password_plaintext: str,
    role: str,
    department_id: Optional[str] = None,
    manager_id: Optional[str] = None
) -> Dict[str, Any]:
    pw_hash = hash_password(password_plaintext)
    now_str = datetime.now(timezone.utc).isoformat()
    user_id = f"usr-{uuid.uuid4().hex[:8]}"

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO users (id, employee_id, full_name, corporate_email, password_hash, role, department_id, manager_id, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    """, (
        user_id,
        employee_id.strip(),
        full_name.strip(),
        corporate_email.strip().lower(),
        pw_hash,
        role,
        department_id,
        manager_id,
        now_str,
        now_str
    ))
    conn.commit()
    conn.close()
    return get_user_by_id(user_id)

def set_user_active_status(user_id: str, is_active: bool) -> bool:
    now_str = datetime.now(timezone.utc).isoformat()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?
    """, (1 if is_active else 0, now_str, user_id))
    if not is_active:
        # Revoke active sessions if deactivated
        cursor.execute("""
        UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL
        """, (now_str, user_id))
    updated = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return updated

def get_all_departments() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT d.*, COUNT(u.id) as member_count
    FROM departments d
    LEFT JOIN users u ON d.id = u.department_id AND u.is_active = 1
    GROUP BY d.id
    ORDER BY d.department_name ASC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def log_access_event(
    event_type: str,
    status: str,
    user_id: Optional[str] = None,
    user_email: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
):
    event_id = f"evt-{uuid.uuid4().hex[:12]}"
    now_str = datetime.now(timezone.utc).isoformat()
    # Strip any potential sensitive parameters from metadata
    safe_metadata = {}
    if metadata:
        for k, v in metadata.items():
            if k.lower() not in ("password", "token", "raw_question", "secret"):
                safe_metadata[k] = v

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO access_events (id, user_id, user_email, event_type, timestamp, status, metadata_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        event_id,
        user_id,
        user_email,
        event_type,
        now_str,
        status,
        json.dumps(safe_metadata)
    ))
    conn.commit()
    conn.close()

def get_access_events(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM access_events ORDER BY timestamp DESC LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def create_password_reset_token(user_id: str) -> str:
    raw_token = f"rst_{uuid.uuid4().hex}"
    token_h = hash_token(raw_token)
    expires_at = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
    reset_id = f"rst-{uuid.uuid4().hex[:8]}"

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
    VALUES (?, ?, ?, ?)
    """, (reset_id, user_id, token_h, expires_at))
    conn.commit()
    conn.close()
    return raw_token

def use_password_reset_token(raw_token: str, new_password: str) -> bool:
    token_h = hash_token(raw_token)
    now_str = datetime.now(timezone.utc).isoformat()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT user_id, expires_at, used_at FROM password_reset_tokens
    WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?
    """, (token_h, now_str))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return False

    user_id = row["user_id"]
    cursor.execute("""
    UPDATE password_reset_tokens SET used_at = ? WHERE token_hash = ?
    """, (now_str, token_h))
    conn.commit()
    conn.close()

    return update_password(user_id, new_password)
