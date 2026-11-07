import { User, Department, SecurityEvent, HierarchyOverview, LoginResponsePayload, UserRole } from '../types/auth';

const BACKEND_BASE = 'http://127.0.0.1:8000';

async function authFetch<T>(endpoint: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const authToken = token || sessionStorage.getItem('finnova_auth_token') || localStorage.getItem('finnova_auth_token');
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const finalOptions: RequestInit = {
    ...options,
    headers
  };

  // First try proxy /api
  try {
    const res = await fetch(`/api${endpoint}`, finalOptions);
    if (res.ok) {
      return await res.json();
    }
    if (res.status === 401 || res.status === 403 || res.status === 400 || res.status === 429) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }
  } catch (err: any) {
    if (err.message && (err.message.includes('401') || err.message.includes('403') || err.message.includes('400') || err.message.includes('429'))) {
      throw err;
    }
    // Network or proxy fallback to direct backend URL
  }

  const resDirect = await fetch(`${BACKEND_BASE}/api${endpoint}`, finalOptions);
  if (!resDirect.ok) {
    const err = await resDirect.json().catch(() => ({ detail: resDirect.statusText }));
    throw new Error(err.detail || `Request failed with status ${resDirect.status}`);
  }
  return await resDirect.json();
}

export async function loginApi(corporate_email: string, password: string, remember_me: boolean = false): Promise<LoginResponsePayload> {
  return await authFetch<LoginResponsePayload>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ corporate_email, password, remember_me })
  });
}

export async function logoutApi(token?: string | null): Promise<{ status: string; message: string }> {
  try {
    return await authFetch<{ status: string; message: string }>('/auth/logout', {
      method: 'POST'
    }, token);
  } catch (err) {
    return { status: 'logged_out', message: 'Client-side session cleared.' };
  }
}

export async function fetchCurrentUserApi(token?: string | null): Promise<User> {
  return await authFetch<User>('/auth/me', {
    method: 'GET'
  }, token);
}

export async function changePasswordApi(current_password: string, new_password: string, token?: string | null): Promise<{ status: string; message: string }> {
  return await authFetch<{ status: string; message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password, new_password })
  }, token);
}

export async function forgotPasswordApi(corporate_email: string): Promise<{ status: string; message: string; reset_token?: string; note: string }> {
  return await authFetch<{ status: string; message: string; reset_token?: string; note: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ corporate_email })
  });
}

export async function resetPasswordApi(reset_token: string, new_password: string): Promise<{ status: string; message: string }> {
  return await authFetch<{ status: string; message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ reset_token, new_password })
  });
}

export async function fetchUsersApi(token?: string | null): Promise<User[]> {
  return await authFetch<User[]>('/users', {
    method: 'GET'
  }, token);
}

export async function createUserApi(data: {
  employee_id: string;
  full_name: string;
  corporate_email: string;
  password: string;
  role: UserRole;
  department_id?: string | null;
  manager_id?: string | null;
}, token?: string | null): Promise<User> {
  return await authFetch<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data)
  }, token);
}

export async function updateUserStatusApi(userId: string, is_active: boolean, token?: string | null): Promise<{ status: string; user_id: string; is_active: boolean; message: string }> {
  return await authFetch<{ status: string; user_id: string; is_active: boolean; message: string }>(`/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active })
  }, token);
}

export async function fetchDepartmentsApi(token?: string | null): Promise<Department[]> {
  return await authFetch<Department[]>('/departments', {
    method: 'GET'
  }, token);
}

export async function fetchSecurityEventsApi(limit: number = 50, token?: string | null): Promise<SecurityEvent[]> {
  return await authFetch<SecurityEvent[]>(`/security/events?limit=${limit}`, {
    method: 'GET'
  }, token);
}

export async function fetchHierarchyOverviewApi(token?: string | null): Promise<HierarchyOverview> {
  return await authFetch<HierarchyOverview>('/hierarchy/overview', {
    method: 'GET'
  }, token);
}
