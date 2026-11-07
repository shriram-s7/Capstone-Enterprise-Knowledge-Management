export type UserRole =
  | 'SUPER_ADMIN'
  | 'EXECUTIVE'
  | 'DEPARTMENT_HEAD'
  | 'MANAGER'
  | 'EMPLOYEE'
  | 'AUDITOR';

export interface User {
  id: string;
  employee_id: string;
  full_name: string;
  corporate_email: string;
  role: UserRole;
  department_id?: string | null;
  department_name?: string | null;
  department_code?: string | null;
  manager_id?: string | null;
  manager_name?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string | null;
}

export interface Department {
  id: string;
  department_name: string;
  department_code: string;
  department_head_id?: string | null;
  created_at: string;
  member_count?: number;
}

export interface SecurityEvent {
  id: string;
  user_id?: string | null;
  user_email?: string | null;
  event_type: string;
  timestamp: string;
  status: string;
  metadata_json: string;
}

export interface HierarchyOverview {
  viewerRole: UserRole;
  viewerDepartmentId?: string | null;
  totalUsers: number;
  activeUsers: number;
  totalDepartments: number;
  roleDistribution: Record<string, number>;
  departments: Department[];
}

export interface LoginResponsePayload {
  token: string;
  token_type: string;
  expires_at: string;
  user: User;
}
