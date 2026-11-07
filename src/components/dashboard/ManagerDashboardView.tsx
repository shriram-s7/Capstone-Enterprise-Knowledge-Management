import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { User } from '../../types/auth';
import { fetchUsersApi } from '../../services/authApi';
import { SYNTHETIC_POLICIES } from '../../data/policies';
import {
  Users,
  Bot,
  ShieldAlert,
  FileText,
  ArrowRight,
  Search,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../shared/Card';

export const ManagerDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openDocumentById } = useApp();

  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [quickQuery, setQuickQuery] = useState('');

  useEffect(() => {
    fetchUsersApi()
      .then(uList => {
        // Filter team members reporting to this manager
        const team = uList.filter(u => u.manager_id === user?.id || u.id === user?.id);
        setTeamMembers(team);
      })
      .catch(() => setTeamMembers([]));
  }, [user]);

  const handleLaunchAssistant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    navigate('/knowledge', { state: { initialQuery: quickQuery.trim() } });
  };

  const teamPolicies = SYNTHETIC_POLICIES.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Team Management • {user?.department_code || 'ENG'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Platform Infrastructure Operations
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Manager operational cockpit for guiding direct reports, enforcing secure knowledge standards, and maintaining team compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/knowledge')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-md shadow-sky-600/30 transition-all"
          >
            <Bot className="w-4 h-4" />
            Launch Knowledge Assistant
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

      {/* Quick Knowledge Query Bar */}
      <Card className="p-4 border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 dark:from-indigo-950/20 to-transparent">
        <form onSubmit={handleLaunchAssistant} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Bot className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={quickQuery}
              onChange={e => setQuickQuery(e.target.value)}
              placeholder="Ask an operational policy question (e.g. 'What is the standard PR review approval requirement?')"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shrink-0 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Query with Citations
          </button>
        </form>
      </Card>

      {/* Team Roster & Applicable Policies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Direct Reports */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex items-center justify-between pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Assigned Team Roster
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct reports within your organizational operational scope.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">{teamMembers.length} Staff</span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {teamMembers.map(tm => (
                <div key={tm.id} className="p-3.5 px-4 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs">
                      {tm.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {tm.full_name} {tm.id === user?.id && <span className="text-slate-400 font-normal">(You)</span>}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {tm.corporate_email} • ID: {tm.employee_id}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 block">
                      {tm.role}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      Status: Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Relevant Policies for Team */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex items-center justify-between pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Team Operational Standards
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Governing standards for engineering and infrastructure operations.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {teamPolicies.map(pol => (
              <div
                key={pol.id}
                onClick={() => openDocumentById(pol.id)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400">
                      {pol.id}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      v{pol.currentVersion}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
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
