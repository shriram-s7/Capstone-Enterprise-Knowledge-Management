import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { User } from '../../types/auth';
import { fetchUsersApi } from '../../services/authApi';
import { SYNTHETIC_POLICIES } from '../../data/policies';
import { SYNTHETIC_CONFLICTS } from '../../data/conflicts';
import { SYNTHETIC_PRACTICES } from '../../data/practices';
import {
  Building2,
  Users,
  FileText,
  GitCompare,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  Bot
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../shared/Card';
import { Badge } from '../shared/Badge';

export const DepartmentHeadDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openDocumentById } = useApp();

  const [deptUsers, setDeptUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUsersApi()
      .then(uList => setDeptUsers(uList))
      .catch(() => setDeptUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const deptName = user?.department_name || 'Software Engineering & AI';
  const deptCode = user?.department_code || 'ENG';

  // Filter policies relevant to this department
  const relevantPolicies = SYNTHETIC_POLICIES.filter(p =>
    p.ownerDepartment.toLowerCase().includes('security') ||
    p.ownerDepartment.toLowerCase().includes('engineering') ||
    p.scope.toLowerCase().includes('all')
  );

  // Department conflicts
  const deptConflicts = SYNTHETIC_CONFLICTS.filter(c =>
    c.affectedDepartments.some(d => d.toLowerCase().includes('engineering') || d.toLowerCase().includes('all'))
  );

  // Department compliance drift
  const deptDrift = SYNTHETIC_PRACTICES.filter(pr =>
    pr.department.toLowerCase().includes('engineering')
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Departmental Oversight • {deptCode}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {deptName} Division Workspace
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Department head dashboard for reviewing governing policies, analyzing inter-departmental conflicts, and tracking operational compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/conflicts')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
          >
            <GitCompare className="w-4 h-4" />
            Resolve Policy Conflicts
          </button>
          <button
            onClick={() => navigate('/knowledge')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            Query Assistant
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Department Members</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{deptUsers.length}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Assigned to {deptCode}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Applicable Policies</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{relevantPolicies.length}</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Active & In Scope</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Flagged Conflicts</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{deptConflicts.length}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Impacting engineering workflow</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Compliance Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">94%</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Target: 95%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Policies and Conflicts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Policies */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex items-center justify-between pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Governing Departmental Policies
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authoritative standards owned by or applying to this division.
              </p>
            </div>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-medium">
              {relevantPolicies.length} Active
            </span>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {relevantPolicies.slice(0, 4).map(pol => (
              <div
                key={pol.id}
                onClick={() => openDocumentById(pol.id)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition-all flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {pol.id}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      v{pol.currentVersion}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1">
                    {pol.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    Owner: {pol.ownerDepartment} • Review: {pol.nextReviewDate}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Flagged Conflicts */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex items-center justify-between pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cross-Department Policy Contradictions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detected conflicts between departmental practices and corporate standards.
              </p>
            </div>
            <button
              onClick={() => navigate('/conflicts')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Resolve All <ArrowRight className="w-3 h-3" />
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {deptConflicts.map(conf => (
              <div
                key={conf.id}
                className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {conf.title}
                  </span>
                  <Badge variant={conf.severity === 'Critical' ? 'rose' : 'amber'} size="sm">
                    {conf.severity}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {conf.conflictDescription}
                </p>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                  Precedence: {conf.precedenceRule || 'Legal / Board Precedence'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Department Team Members Roster */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex items-center justify-between pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Department Team Roster
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Staff members under {deptName} reporting structure.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {deptUsers.length} Members
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {deptUsers.map(u => (
              <div key={u.id} className="p-3.5 px-4 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                    {u.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {u.full_name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {u.corporate_email} • ID: {u.employee_id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {u.role}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
