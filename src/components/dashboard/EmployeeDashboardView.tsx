import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SYNTHETIC_POLICIES } from '../../data/policies';
import {
  Bot,
  ShieldAlert,
  FileText,
  User,
  Shield,
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../shared/Card';
import { Badge } from '../shared/Badge';

export const EmployeeDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openDocumentById } = useApp();

  const [questionInput, setQuestionInput] = useState('');

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    navigate('/knowledge', { state: { initialQuery: questionInput.trim() } });
  };

  const permittedPolicies = SYNTHETIC_POLICIES.filter(p =>
    p.scope.toLowerCase().includes('all') ||
    p.category.toLowerCase().includes('hr') ||
    p.category.toLowerCase().includes('security')
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Employee Portal • {user?.department_code || 'ENG'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Welcome back, {user?.full_name}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Access certified corporate knowledge, sanitize proprietary inquiries with Question Shield, and review authoritative company policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/knowledge')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Bot className="w-4 h-4" />
            Knowledge Assistant
          </button>
          <button
            onClick={() => navigate('/shield')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            Question Shield
          </button>
        </div>
      </div>

      {/* Ask Question Hero Input */}
      <Card className="p-5 border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 dark:from-indigo-950/30 to-transparent">
        <form onSubmit={handleAsk} className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Query Corporate Knowledge (Citations Guaranteed)
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={questionInput}
                onChange={e => setQuestionInput(e.target.value)}
                placeholder="Ask any policy question (e.g. 'What is our home office equipment allowance?')"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 shadow-sm transition-all"
            >
              Ask Assistant
            </button>
          </div>
        </form>
      </Card>

      {/* Profile & Privacy Guarantee Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Profile Card */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              Corporate Identity
            </h3>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Employee ID</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{user?.employee_id}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Department</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{user?.department_name || user?.department_code}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Clearance Level</span>
              <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{user?.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Reporting Manager</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{user?.manager_name || 'Department Head'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Permitted Policies Card */}
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader className="flex items-center justify-between pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Permitted Company Policies
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authoritative policies available within your clearance scope.
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
              {permittedPolicies.length} Documents
            </span>
          </CardHeader>
          <CardContent className="space-y-2">
            {permittedPolicies.slice(0, 4).map(pol => (
              <div
                key={pol.id}
                onClick={() => openDocumentById(pol.id)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {pol.id}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      v{pol.currentVersion}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {pol.category}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1">
                    {pol.title}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
