import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from backend.app.auth.security import verify_password, check_login_rate_limit, reset_login_rate_limit
from backend.app.auth.schemas import (
    UserRole,
    UserResponse,
    LoginRequest,
    LoginResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    CreateUserRequest,
    UpdateUserStatusRequest,
    DepartmentResponse,
    AccessEventResponse
)
from backend.app.auth.service import (
    get_user_by_email,
    get_user_by_id,
    get_session_user,
    create_session,
    revoke_session,
    update_password,
    get_all_users,
    create_user,
    set_user_active_status,
    get_all_departments,
    log_access_event,
    get_access_events,
    create_password_reset_token,
    use_password_reset_token
)

logger = logging.getLogger("finnova.auth")
router = APIRouter(prefix="/api", tags=["Authentication & Hierarchy"])

def get_current_user(
    authorization: Optional[str] = Header(None),
    x_session_token: Optional[str] = Header(None)
) -> Dict[str, Any]:
    raw_token = None
    if authorization and authorization.startswith("Bearer "):
        raw_token = authorization.split(" ", 1)[1].strip()
    elif x_session_token:
        raw_token = x_session_token.strip()

    if not raw_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication session token required.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user = get_session_user(raw_token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired, revoked, or invalid.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated by an administrator."
        )

    return user

def require_roles(allowed_roles: List[UserRole]):
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_role = current_user.get("role")
        if user_role not in [r.value for r in allowed_roles]:
            log_access_event(
                event_type="UNAUTHORIZED_ROLE_ACCESS",
                status="FORBIDDEN",
                user_id=current_user.get("id"),
                user_email=current_user.get("corporate_email"),
                metadata={"required_roles": [r.value for r in allowed_roles], "user_role": user_role}
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {[r.value for r in allowed_roles]}"
            )
        return current_user
    return role_checker

@router.post("/auth/login", response_model=LoginResponse)
def login(request: LoginRequest, req: Request):
    client_ip = req.client.host if req.client else "unknown"
    rate_key = f"{client_ip}:{request.corporate_email.lower().strip()}"

    if not check_login_rate_limit(rate_key, max_attempts=5, window_seconds=60):
        log_access_event(
            event_type="LOGIN_RATE_LIMITED",
            status="RATE_LIMITED",
            user_email=request.corporate_email,
            metadata={"ip": client_ip}
        )
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 60 seconds before trying again."
        )

    user = get_user_by_email(request.corporate_email)

    # Use constant-time or generic failure to avoid account enumeration
    if not user or not verify_password(user["password_hash"], request.password):
        log_access_event(
            event_type="LOGIN_FAILED",
            status="INVALID_CREDENTIALS",
            user_id=user["id"] if user else None,
            user_email=request.corporate_email,
            metadata={"ip": client_ip}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid corporate email or password."
        )

    if not user.get("is_active"):
        log_access_event(
            event_type="LOGIN_DENIED_INACTIVE",
            status="INACTIVE_ACCOUNT",
            user_id=user["id"],
            user_email=user["corporate_email"]
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This corporate account has been deactivated. Please contact your FinNova administrator."
        )

    reset_login_rate_limit(rate_key)
    session_data = create_session(user["id"], remember_me=bool(request.remember_me))

    log_access_event(
        event_type="LOGIN_SUCCESS",
        status="SUCCESS",
        user_id=user["id"],
        user_email=user["corporate_email"],
        metadata={"role": user["role"], "remember_me": bool(request.remember_me)}
    )

    # Return sanitized user model (NO password_hash)
    user_resp = UserResponse(
        id=user["id"],
        employee_id=user["employee_id"],
        full_name=user["full_name"],
        corporate_email=user["corporate_email"],
        role=UserRole(user["role"]),
        department_id=user.get("department_id"),
        department_name=user.get("department_name"),
        department_code=user.get("department_code"),
        manager_id=user.get("manager_id"),
        manager_name=user.get("manager_name"),
        is_active=bool(user["is_active"]),
        created_at=user["created_at"],
        updated_at=user["updated_at"],
        last_login_at=user.get("last_login_at")
    )

    return LoginResponse(
        token=session_data["token"],
        token_type="Bearer",
        expires_at=session_data["expires_at"],
        user=user_resp
    )

@router.post("/auth/logout")
def logout(
    authorization: Optional[str] = Header(None),
    x_session_token: Optional[str] = Header(None)
):
    raw_token = None
    if authorization and authorization.startswith("Bearer "):
        raw_token = authorization.split(" ", 1)[1].strip()
    elif x_session_token:
        raw_token = x_session_token.strip()

    if raw_token:
        user = get_session_user(raw_token)
        revoke_session(raw_token)
        if user:
            log_access_event(
                event_type="LOGOUT_SUCCESS",
                status="SUCCESS",
                user_id=user.get("id"),
                user_email=user.get("corporate_email")
            )

    return {"status": "logged_out", "message": "Authentication session successfully invalidated."}

@router.get("/auth/me", response_model=UserResponse)
def get_current_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        employee_id=current_user["employee_id"],
        full_name=current_user["full_name"],
        corporate_email=current_user["corporate_email"],
        role=UserRole(current_user["role"]),
        department_id=current_user.get("department_id"),
        department_name=current_user.get("department_name"),
        department_code=current_user.get("department_code"),
        manager_id=current_user.get("manager_id"),
        manager_name=current_user.get("manager_name"),
        is_active=bool(current_user["is_active"]),
        created_at=current_user["created_at"],
        updated_at=current_user["updated_at"],
        last_login_at=current_user.get("last_login_at")
    )

@router.post("/auth/change-password")
def change_password(
    request: ChangePasswordRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    # Fetch full user with password hash
    full_user = get_user_by_id(current_user["id"])
    if not full_user or not verify_password(full_user["password_hash"], request.current_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password verification failed."
        )

    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long."
        )

    update_password(current_user["id"], request.new_password)
    log_access_event(
        event_type="PASSWORD_CHANGED",
        status="SUCCESS",
        user_id=current_user["id"],
        user_email=current_user["corporate_email"]
    )
    return {"status": "success", "message": "Password changed successfully. Please log in with your new credentials."}

@router.post("/auth/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(request: ForgotPasswordRequest):
    user = get_user_by_email(request.corporate_email)
    if not user or not user.get("is_active"):
        # Generic response to prevent email harvesting
        return ForgotPasswordResponse(
            status="received",
            message="If the corporate email is registered, password reset instructions have been recorded.",
            reset_token=None,
            note="FinNova enterprise security: Contact SecOps Admin to verify your identity and approve the password reset."
        )

    # In local demo environment, generate verifiable reset token
    raw_token = create_password_reset_token(user["id"])
    log_access_event(
        event_type="PASSWORD_RESET_REQUESTED",
        status="PENDING_ADMIN_APPROVAL",
        user_id=user["id"],
        user_email=user["corporate_email"]
    )

    return ForgotPasswordResponse(
        status="token_generated",
        message="A secure password reset ticket has been created for your corporate account.",
        reset_token=raw_token,
        note="In production, tokens are delivered via authorized internal enterprise communication channels."
    )

@router.post("/auth/reset-password")
def reset_password(request: ResetPasswordRequest):
    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long."
        )

    success = use_password_reset_token(request.reset_token, request.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid, expired, or previously used password reset token."
        )

    return {"status": "success", "message": "Your password has been reset successfully. You may now sign in."}

# --- Organizational Hierarchy Endpoints ---

@router.get("/users", response_model=List[UserResponse])
def list_users(current_user: Dict[str, Any] = Depends(get_current_user)):
    role = current_user.get("role")
    all_users = get_all_users()

    # Department Heads can only see users in their own department (Department Data Isolation)
    if role == UserRole.DEPARTMENT_HEAD.value:
        user_dept = current_user.get("department_id")
        filtered = [u for u in all_users if u.get("department_id") == user_dept]
        return [UserResponse(**u) for u in filtered]

    # Managers can only see users reporting to them or in their team
    if role == UserRole.MANAGER.value:
        mgr_id = current_user.get("id")
        user_dept = current_user.get("department_id")
        filtered = [u for u in all_users if u.get("manager_id") == mgr_id or u.get("id") == mgr_id]
        return [UserResponse(**u) for u in filtered]

    # Employees cannot list other users
    if role == UserRole.EMPLOYEE.value:
        # Return only own profile
        own = [u for u in all_users if u.get("id") == current_user.get("id")]
        return [UserResponse(**u) for u in own]

    # SUPER_ADMIN, EXECUTIVE, and AUDITOR can view organization directory
    return [UserResponse(**u) for u in all_users]

@router.post("/users", response_model=UserResponse)
def create_new_user(
    request: CreateUserRequest,
    current_user: Dict[str, Any] = Depends(require_roles([UserRole.SUPER_ADMIN]))
):
    # Check for existing email or employee ID
    existing_email = get_user_by_email(request.corporate_email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{request.corporate_email}' already exists."
        )

    all_users = get_all_users()
    if any(u["employee_id"] == request.employee_id for u in all_users):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with Employee ID '{request.employee_id}' already exists."
        )

    new_user = create_user(
        employee_id=request.employee_id,
        full_name=request.full_name,
        corporate_email=request.corporate_email,
        password_plaintext=request.password,
        role=request.role.value,
        department_id=request.department_id,
        manager_id=request.manager_id
    )

    log_access_event(
        event_type="USER_CREATED",
        status="SUCCESS",
        user_id=current_user["id"],
        user_email=current_user["corporate_email"],
        metadata={"created_employee_id": request.employee_id, "assigned_role": request.role.value}
    )

    return UserResponse(**new_user)

@router.patch("/users/{user_id}/status")
def update_user_status(
    user_id: str,
    request: UpdateUserStatusRequest,
    current_user: Dict[str, Any] = Depends(require_roles([UserRole.SUPER_ADMIN]))
):
    target_user = get_user_by_id(user_id)
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{user_id}' not found.")

    # Guard against self-deactivation by Super Admin
    if user_id == current_user["id"] and not request.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own Super Administrator account."
        )

    set_user_active_status(user_id, request.is_active)
    log_access_event(
        event_type="USER_STATUS_UPDATED",
        status="SUCCESS",
        user_id=current_user["id"],
        user_email=current_user["corporate_email"],
        metadata={"target_user_id": user_id, "new_active_status": request.is_active}
    )
    return {
        "status": "success",
        "user_id": user_id,
        "is_active": request.is_active,
        "message": f"User status updated to {'active' if request.is_active else 'inactive'}."
    }

@router.get("/departments", response_model=List[DepartmentResponse])
def list_departments(current_user: Dict[str, Any] = Depends(get_current_user)):
    depts = get_all_departments()
    return [DepartmentResponse(**d) for d in depts]

@router.get("/security/events", response_model=List[AccessEventResponse])
def list_security_events(
    limit: int = 50,
    current_user: Dict[str, Any] = Depends(require_roles([UserRole.SUPER_ADMIN, UserRole.AUDITOR]))
):
    events = get_access_events(limit=min(limit, 100))
    return [
        AccessEventResponse(
            id=e["id"],
            user_id=e.get("user_id"),
            user_email=e.get("user_email"),
            event_type=e["event_type"],
            timestamp=e["timestamp"],
            status=e["status"],
            metadata_json=e.get("metadata_json", "{}")
        )
        for e in events
    ]

@router.get("/hierarchy/overview")
def get_hierarchy_overview(current_user: Dict[str, Any] = Depends(get_current_user)):
    role = current_user.get("role")
    all_users = get_all_users()
    all_depts = get_all_departments()

    # Role distribution
    role_dist = {}
    for u in all_users:
        r = u["role"]
        role_dist[r] = role_dist.get(r, 0) + 1

    return {
        "viewerRole": role,
        "viewerDepartmentId": current_user.get("department_id"),
        "totalUsers": len(all_users),
        "activeUsers": sum(1 for u in all_users if u.get("is_active")),
        "totalDepartments": len(all_depts),
        "roleDistribution": role_dist,
        "departments": all_depts
    }
