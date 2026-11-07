from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

class UserRole(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    EXECUTIVE = "EXECUTIVE"
    DEPARTMENT_HEAD = "DEPARTMENT_HEAD"
    MANAGER = "MANAGER"
    EMPLOYEE = "EMPLOYEE"
    AUDITOR = "AUDITOR"

class DepartmentResponse(BaseModel):
    id: str
    department_name: str
    department_code: str
    department_head_id: Optional[str] = None
    created_at: str
    member_count: Optional[int] = 0

class UserResponse(BaseModel):
    id: str
    employee_id: str
    full_name: str
    corporate_email: str
    role: UserRole
    department_id: Optional[str] = None
    department_name: Optional[str] = None
    department_code: Optional[str] = None
    manager_id: Optional[str] = None
    manager_name: Optional[str] = None
    is_active: bool
    created_at: str
    updated_at: str
    last_login_at: Optional[str] = None

class LoginRequest(BaseModel):
    corporate_email: str = Field(..., json_schema_extra={"example": "admin@finnova.demo"})
    password: str = Field(..., min_length=1)
    remember_me: Optional[bool] = False

class LoginResponse(BaseModel):
    token: str
    token_type: str = "Bearer"
    expires_at: str
    user: UserResponse

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

class ForgotPasswordRequest(BaseModel):
    corporate_email: str

class ForgotPasswordResponse(BaseModel):
    status: str
    message: str
    reset_token: Optional[str] = None
    note: str

class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str = Field(..., min_length=8)

class CreateUserRequest(BaseModel):
    employee_id: str
    full_name: str
    corporate_email: str
    password: str = Field(..., min_length=8)
    role: UserRole
    department_id: Optional[str] = None
    manager_id: Optional[str] = None

class UpdateUserStatusRequest(BaseModel):
    is_active: bool

class AccessEventResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    event_type: str
    timestamp: str
    status: str
    metadata_json: str
