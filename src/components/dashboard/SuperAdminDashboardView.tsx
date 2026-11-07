import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { User, Department, SecurityEvent, UserRole } from '../../types/auth';
import {
  fetchUsersApi,
  createUserApi,
  updateUserStatusApi,
  fetchDepartmentsApi,
  fetchSecurityEventsApi,
  fetchHierarchyOverviewApi
} from '../../services/authApi';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Building2,
  Lock,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Key,
  ShieldAlert
} from 'lucide-react';
import { Badge } from '../shared/Badge';
import { Card, CardHeader, CardContent } from '../shared/Card';

export const SuperAdminDashboardView: React.FC = () => {
  const { user } = useAuth();
  const { showToast, verifyCurrentLedger, isLedgerVerifying, verificationResult } = useApp();

  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');

  // Create User Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createEmployeeId, setCreateEmployeeId] = useState('');
  const [createFullName, setCreateFullName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState<UserRole>('EMPLOYEE');
  const [createDeptId, setCreateDeptId] = useState<string>('DEP-ENG');
  const [isCreating, setIsCreating] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [uList, dList, eList] = await Promise.all([
        fetchUsersApi(),
        fetchDepartmentsApi(),
        fetchSecurityEventsApi(20)
      ]);
      setUsers(uList);
      setDepartments(dList);
      setEvents(eList);
    } catch (err: any) {
      showToast('error', 'Failed to load administrative data', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleUserStatus = async (targetUser: User) => {
    if (targetUser.id === user?.id) {
      showToast('warning', 'Action Denied', 'You cannot deactivate your own Super Administrator account.');
      return;
    }

    try {
      const newStatus = !targetUser.is_active;
      await updateUserStatusApi(targetUser.id, newStatus);
      showToast('success', 'User Status Updated', `${targetUser.full_name} is now ${newStatus ? 'Active' : 'Inactive'}.`);
      loadAdminData();
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createEmployeeId.trim() || !createFullName.trim() || !createEmail.trim() || !createPassword) {
      showToast('warning', 'Incomplete Form', 'All fields are required.');
      return;
    }

    setIsCreating(true);
    try {
      await createUserApi({
        employee_id: createEmployeeId.trim(),
        full_name: createFullName.trim(),
        corporate_email: createEmail.trim(),
        password: createPassword,
        role: createRole,
        department_id: createDeptId
      });
      showToast('success', 'User Provisioned', `Account created for ${createFullName}.`);
      setIsCreateModalOpen(false);
      setCreateEmployeeId('');
      setCreateFullName('');
      setCreateEmail('');
      setCreatePassword('');
      loadAdminData();
    } catch (err: any) {
      showToast('error', 'Creation Failed', err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.corporate_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employee_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Platform Administration
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Super Administrator Control Plane
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Manage organizational identity, assign role clearance levels, monitor security access events, and verify cryptographic ledger integrity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Provision New User
          </button>
          <button
            onClick={verifyCurrentLedger}
            disabled={isLedgerVerifying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {isLedgerVerifying ? 'Verifying Chain...' : 'Verify Ledger'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Provisioned Users</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{users.length}</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                {users.filter(u => u.is_active).length} Active accounts
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Departments</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{departments.length}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Isolated organizational units
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Security Events Logged</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{events.length}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Recent access audits
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Ledger Integrity</p>
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5" />
                Verified
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                SHA-256 Hash Chaining
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* User Directory & Role Assignment Section */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Organizational Identity & Access Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active corporate directory with role-based clearance and department assignments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search name, email, ID..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRoleFilter}
              onChange={e => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Roles</option>
              <option value="SUPER_ADMIN">Super Administrator</option>
              <option value="EXECUTIVE">Executive</option>
              <option value="DEPARTMENT_HEAD">Department Head</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="AUDITOR">Auditor</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-y border-slate-200 dark:border-slate-800 font-semibold">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Role Clearance</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Reporting Line</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {u.full_name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {u.corporate_email} • {u.employee_id}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          : u.role === 'EXECUTIVE'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : u.role === 'DEPARTMENT_HEAD'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : u.role === 'MANAGER'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                          : u.role === 'AUDITOR'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {u.department_name || u.department_code || 'General'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {u.manager_name ? `Reports to ${u.manager_name}` : 'Direct Board Report'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.is_active
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.id !== user?.id && (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                            u.is_active
                              ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                              : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                          }`}
                        >
                          {u.is_active ? 'Deactivate' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Security Events Monitoring */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex items-center justify-between pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Access & Security Monitoring Events
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit logs of corporate logins, credential validations, and permission checks (zero secrets stored).
            </p>
          </div>
          <button
            onClick={loadAdminData}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
            {events.slice(0, 8).map(ev => (
              <div key={ev.id} className="p-3.5 px-4 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    ev.status === 'SUCCESS'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                  }`}>
                    {ev.status === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {ev.event_type}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      User: {ev.user_email || 'Unauthenticated'} • Status: {ev.status}
                    </div>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Provision User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                Provision Corporate Account
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={createEmployeeId}
                  onChange={e => setCreateEmployeeId(e.target.value)}
                  placeholder="e.g. FN-00888"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={createFullName}
                  onChange={e => setCreateFullName(e.target.value)}
                  placeholder="e.g. Samantha Wright"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  value={createEmail}
                  onChange={e => setCreateEmail(e.target.value)}
                  placeholder="e.g. s.wright@finnova.demo"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Initial Password (Argon2id Hashed)
                </label>
                <input
                  type="password"
                  value={createPassword}
                  onChange={e => setCreatePassword(e.target.value)}
                  placeholder="Min 8 chars with symbols"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Role Clearance
                  </label>
                  <select
                    value={createRole}
                    onChange={e => setCreateRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="DEPARTMENT_HEAD">DEPARTMENT_HEAD</option>
                    <option value="EXECUTIVE">EXECUTIVE</option>
                    <option value="AUDITOR">AUDITOR</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Department
                  </label>
                  <select
                    value={createDeptId}
                    onChange={e => setCreateDeptId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.department_code} ({d.department_name.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  {isCreating ? 'Provisioning...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
