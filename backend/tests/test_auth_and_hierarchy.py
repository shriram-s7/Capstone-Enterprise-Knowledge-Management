import pytest
import sqlite3
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.config import DB_PATH
from backend.app.database import init_db

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    init_db()

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

# 1. Successful Login Test for Super Admin
def test_login_success_super_admin(client):
    response = client.post("/api/auth/login", json={
        "corporate_email": "admin@finnova.demo",
        "password": "Admin!FinNova2026#Secure",
        "remember_me": True
    })
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["token_type"] == "Bearer"
    assert "expires_at" in data
    user = data["user"]
    assert user["corporate_email"] == "admin@finnova.demo"
    assert user["role"] == "SUPER_ADMIN"
    assert user["employee_id"] == "FN-00001"
    # STRICT SECURITY CHECK: password_hash must NEVER be exposed
    assert "password_hash" not in user
    assert "password" not in user

# 2. Invalid Password Generic Error Test
def test_login_invalid_password_generic_error(client):
    response = client.post("/api/auth/login", json={
        "corporate_email": "admin@finnova.demo",
        "password": "WrongPassword123!"
    })
    assert response.status_code == 401
    assert "Invalid corporate email or password" in response.json()["detail"]

# 3. Unknown Account Generic Error Test (Prevent enumeration)
def test_login_unknown_account_generic_error(client):
    response = client.post("/api/auth/login", json={
        "corporate_email": "nonexistent@finnova.demo",
        "password": "AnyPassword123!"
    })
    assert response.status_code == 401
    assert "Invalid corporate email or password" in response.json()["detail"]

# 4. Unauthorized Access (Missing Token) Test
def test_unauthorized_access_without_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
    assert "token required" in response.json()["detail"].lower()

# 5. Get Current User Profile (Me)
def test_get_current_user_profile(client):
    login_res = client.post("/api/auth/login", json={
        "corporate_email": "executive@finnova.demo",
        "password": "Exec!Sterling2026#Chief"
    })
    assert login_res.status_code == 200
    token = login_res.json()["token"]

    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    user = response.json()
    assert user["role"] == "EXECUTIVE"
    assert user["full_name"] == "Victoria Sterling"
    assert "password_hash" not in user

# 6. Role-Based Access Restriction (Employee Blocked from User Management)
def test_role_authorization_employee_cannot_create_user(client):
    # Log in as Employee
    emp_login = client.post("/api/auth/login", json={
        "corporate_email": "employee@finnova.demo",
        "password": "Emp!DavidKim2026#Access"
    })
    assert emp_login.status_code == 200
    emp_token = emp_login.json()["token"]

    # Attempt to create a user (SUPER_ADMIN only)
    create_res = client.post("/api/users", headers={"Authorization": f"Bearer {emp_token}"}, json={
        "employee_id": "FN-99999",
        "full_name": "Hacker Impostor",
        "corporate_email": "hacker@finnova.demo",
        "password": "HackerPassword123!",
        "role": "SUPER_ADMIN"
    })
    assert create_res.status_code == 403
    assert "Access denied" in create_res.json()["detail"]

# 7. Super Admin Can Create User and Deactivate Account
def test_super_admin_create_and_deactivate_user(client):
    import uuid
    unique_suffix = uuid.uuid4().hex[:6]
    test_emp_id = f"FN-{unique_suffix}"
    test_email = f"intern_{unique_suffix}@finnova.demo"

    admin_login = client.post("/api/auth/login", json={
        "corporate_email": "admin@finnova.demo",
        "password": "Admin!FinNova2026#Secure"
    })
    admin_token = admin_login.json()["token"]

    # Create new employee
    create_res = client.post("/api/users", headers={"Authorization": f"Bearer {admin_token}"}, json={
        "employee_id": test_emp_id,
        "full_name": "Test Intern",
        "corporate_email": test_email,
        "password": "InternSecurePassword2026!",
        "role": "EMPLOYEE",
        "department_id": "DEP-ENG"
    })
    assert create_res.status_code == 200
    new_user = create_res.json()
    user_id = new_user["id"]
    assert new_user["corporate_email"] == test_email
    assert "password_hash" not in new_user

    # Deactivate the account
    deactivate_res = client.patch(f"/api/users/{user_id}/status", headers={"Authorization": f"Bearer {admin_token}"}, json={
        "is_active": False
    })
    assert deactivate_res.status_code == 200
    assert deactivate_res.json()["is_active"] is False

    # Attempt to log in with deactivated account
    intern_login = client.post("/api/auth/login", json={
        "corporate_email": test_email,
        "password": "InternSecurePassword2026!"
    })
    assert intern_login.status_code == 403
    assert "deactivated" in intern_login.json()["detail"].lower()

# 8. Department Isolation: Department Head Only Sees Their Department's Members
def test_department_head_isolation(client):
    # Marcus Chen is head of DEP-ENG
    head_login = client.post("/api/auth/login", json={
        "corporate_email": "head@finnova.demo",
        "password": "Head!Engineering2026#Lead"
    })
    head_token = head_login.json()["token"]

    list_res = client.get("/api/users", headers={"Authorization": f"Bearer {head_token}"})
    assert list_res.status_code == 200
    dept_users = list_res.json()
    # All returned users must belong to DEP-ENG
    for u in dept_users:
        assert u["department_id"] == "DEP-ENG"

# 9. Manager Access Boundary: Manager Only Sees Their Team
def test_manager_team_boundary(client):
    # Elena Rostova is manager of David Kim
    mgr_login = client.post("/api/auth/login", json={
        "corporate_email": "manager@finnova.demo",
        "password": "Mgr!InfraTeam2026#Track"
    })
    mgr_token = mgr_login.json()["token"]

    list_res = client.get("/api/users", headers={"Authorization": f"Bearer {mgr_token}"})
    assert list_res.status_code == 200
    team_users = list_res.json()
    # Team members report to Elena or is Elena herself
    for u in team_users:
        assert u["manager_id"] == "usr-mgr" or u["id"] == "usr-mgr"

# 10. Logout and Session Invalidation Test
def test_logout_session_invalidation(client):
    login_res = client.post("/api/auth/login", json={
        "corporate_email": "auditor@finnova.demo",
        "password": "Audit!Bennett2026#Verify"
    })
    token = login_res.json()["token"]

    # Verify active session works
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200

    # Logout
    logout_res = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert logout_res.status_code == 200
    assert logout_res.json()["status"] == "logged_out"

    # Verify session is now revoked and returns 401
    me_after_logout = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_after_logout.status_code == 401

# 11. Security Events Logging Test (No secrets stored)
def test_security_events_monitoring_no_secrets(client):
    admin_login = client.post("/api/auth/login", json={
        "corporate_email": "admin@finnova.demo",
        "password": "Admin!FinNova2026#Secure"
    })
    admin_token = admin_login.json()["token"]

    events_res = client.get("/api/security/events", headers={"Authorization": f"Bearer {admin_token}"})
    assert events_res.status_code == 200
    events = events_res.json()
    assert len(events) > 0

    # Verify no raw password or authorization secrets in database
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM access_events;")
    db_events = cursor.fetchall()
    conn.close()

    for ev in db_events:
        meta_str = ev["metadata_json"]
        assert "password" not in meta_str.lower() or "password_changed" in ev["event_type"].lower()
        assert "Admin!FinNova2026#Secure" not in meta_str
        assert "Bearer" not in meta_str
