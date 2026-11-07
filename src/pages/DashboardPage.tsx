import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SYNTHETIC_POLICIES } from '../data/policies';
import { SYNTHETIC_CONFLICTS } from '../data/conflicts';
import { Card, CardHeader, CardContent } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import {
  FileText,
  Layers,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Lock,
  GitCompare,
  TrendingDown,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { SuperAdminDashboardView } from '../components/dashboard/SuperAdminDashboardView';
import { DepartmentHeadDashboardView } from '../components/dashboard/DepartmentHeadDashboardView';
import { ManagerDashboardView } from '../components/dashboard/ManagerDashboardView';
import { EmployeeDashboardView } from '../components/dashboard/EmployeeDashboardView';
import { AuditorDashboardView } from '../components/dashboard/AuditorDashboardView';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { openDocumentById, verifyCurrentLedger, isLedgerVerifying } = useApp();

  // Role-specific view dispatching
  if (role === 'SUPER_ADMIN') {
    return <SuperAdminDashboardView />;
  }
  if (role === 'DEPARTMENT_HEAD') {
    return <DepartmentHeadDashboardView />;
  }
  if (role === 'MANAGER') {
    return <ManagerDashboardView />;
  }
  if (role === 'EMPLOYEE') {
    return <EmployeeDashboardView />;
  }
  if (role === 'AUDITOR') {
    return <AuditorDashboardView />;
  }

  // Metrics derived from synthetic dataset
  const totalPolicies = SYNTHETIC_POLICIES.length;
  const totalVersions = SYNTHETIC_POLICIES.reduce((acc, p) => acc + p.versions.length, 0);
  const categories = Array.from(new Set(SYNTHETIC_POLICIES.map(p => p.category)));
  const criticalConflicts = SYNTHETIC_CONFLICTS.filter(c => c.severity === 'Critical').length;

  // Chart data for weekly inquiry volumes across knowledge spaces
  const weeklyUsageData = [
    { day: 'Mon', 'HR & People': 42, 'Security': 68, 'Finance': 35, 'Legal': 18 },
    { day: 'Tue', 'HR & People': 56, 'Security': 84, 'Finance': 48, 'Legal': 24 },
    { day: 'Wed', 'HR & People': 64, 'Security': 92, 'Finance': 54, 'Legal': 31 },
    { day: 'Thu', 'HR & People': 51, 'Security': 79, 'Finance': 44, 'Legal': 22 },
    { day: 'Fri', 'HR & People': 38, 'Security': 62, 'Finance': 39, 'Legal': 19 },
    { day: 'Sat', 'HR & People': 12, 'Security': 24, 'Finance': 10, 'Legal': 5 },
    { day: 'Sun', 'HR & People': 8, 'Security': 18, 'Finance': 6, 'Legal': 3 },
  ];

  const complianceSummaryData = [
    { space: 'Engineering', target: 100, actual: 94 },
    { space: 'Sales & BD', target: 98, actual: 74 },
    { space: 'Customer Ops', target: 100, actual: 94 },
    { space: 'People Ops', target: 100, actual: 98 },
    { space: 'Finance', target: 100, actual: 100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner Notice for Prototype */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-card border border-indigo-800/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Deterministic Demonstration Environment
            </span>
          </div>
          <h2 className="text-lg font-bold">
            FinNova Privacy-First Enterprise Intelligence
          </h2>
          <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed">
            All AI responses, policy analytics, decision lineages, and cryptographic SHA-256 ledger blocks operate deterministically in your browser. Zero employee PII leaves this device.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/knowledge')}
            leftIcon={<MessageSquare className="w-4 h-4" />}
          >
            Ask Knowledge Base
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => verifyCurrentLedger()}
            isLoading={isLedgerVerifying}
            className="text-white border-indigo-700 hover:bg-indigo-800/50"
            leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
          >
            Verify Ledger
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <Card hoverable onClick={() => navigate('/time-travel')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Knowledge Documents
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalPolicies}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                across {categories.length} spaces
              </span>
            </div>
            <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
              <span>{totalVersions} historical versions tracked</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card hoverable onClick={() => navigate('/knowledge')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Questions Answered
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                1,842
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +14% this month
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              Citation Accuracy: <strong className="text-slate-800 dark:text-slate-200">99.4% verified</strong>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card hoverable onClick={() => navigate('/shield')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Privacy Protection
              </span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                1,215
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                entities sanitized
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              Persistence Level: <strong className="text-emerald-600 dark:text-emerald-400">0% (Zero-Raw PII)</strong>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card hoverable onClick={() => navigate('/conflicts')}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Policy Contradictions
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {SYNTHETIC_CONFLICTS.length}
              </span>
              <Badge variant="danger" size="sm">
                {criticalConflicts} Critical
              </Badge>
            </div>
            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <span>View Conflict Resolver</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knowledge Usage Chart (2 Cols) */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Weekly Knowledge Queries by Operational Space"
            subtitle="Demonstration volume of employee inquiries resolved with direct policy citations"
            action={
              <Badge variant="primary" size="sm">
                Last 7 Days
              </Badge>
            }
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorHR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorFin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#F8FAFC',
                      fontSize: '12px'
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="Security" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorSec)" />
                  <Area type="monotone" dataKey="HR & People" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorHR)" />
                  <Area type="monotone" dataKey="Finance" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorFin)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Practice vs Policy Compliance Overview (1 Col) */}
        <Card>
          <CardHeader
            title="Department Compliance Adherence"
            subtitle="Observed practice vs codified policy target"
            action={
              <button
                onClick={() => navigate('/reality-check')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Inspect Drift →
              </button>
            }
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceSummaryData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                  <YAxis dataKey="space" type="category" tick={{ fontSize: 11, fill: '#64748B' }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#F8FAFC',
                      fontSize: '12px'
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="actual" name="Actual Adherence" fill="#6366F1" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target" name="Policy Target" fill="#CBD5E1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflicts & Gaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Policy Conflicts Alert Widget */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Detected Policy Contradictions</span>
              </div>
            }
            subtitle="Automated cross-document consistency checks"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/conflicts')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Resolve in Module
              </Button>
            }
          />
          <CardContent className="space-y-3">
            {SYNTHETIC_CONFLICTS.map(conflict => (
              <div
                key={conflict.id}
                onClick={() => navigate('/conflicts')}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700/80 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={conflict.severity === 'Critical' ? 'danger' : 'warning'} size="sm">
                      {conflict.severity}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {conflict.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 shrink-0">
                    {conflict.resolutionStatus === 'Resolved By Precedence' ? 'Precedence Identified' : 'Human Review Needed'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {conflict.conflictDescription}
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-mono bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                    {conflict.policyA.id} ({conflict.policyA.version})
                  </span>
                  <span>vs</span>
                  <span className="font-mono bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                    {conflict.policyB.id} ({conflict.policyB.version})
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Knowledge Gap & Refusal Monitoring */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Knowledge Gap & Insufficient Evidence Log</span>
              </div>
            }
            subtitle="Queries rejected by local retrieval due to lack of approved policy clauses"
            action={
              <Badge variant="neutral" size="sm">
                Zero Hallucination
              </Badge>
            }
          />
          <CardContent className="space-y-3">
            {[
              {
                topic: 'Cryptocurrency Trading & Digital Asset Bonuses',
                inquiries: 38,
                lastQueried: '3 hours ago',
                status: 'Gap: No Codified Policy',
                recommendedAction: 'Legal & Compliance review needed to establish firm-wide crypto stance.'
              },
              {
                topic: 'Personal Mobile Device (BYOD) Biometric Retention',
                inquiries: 24,
                lastQueried: 'Yesterday',
                status: 'Gap: Unspecified in POL-SEC-001',
                recommendedAction: 'Draft addendum to Endpoint Security Standards for iOS/Android Knox.'
              },
              {
                topic: 'Generative AI Public API Tooling Usage Outside Approved Tenant',
                inquiries: 51,
                lastQueried: '2 days ago',
                status: 'Pending CISO Approval',
                recommendedAction: 'Incorporate commercial enterprise terms exception into POL-SEC-003.'
              }
            ].map(gap => (
              <div
                key={gap.topic}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {gap.topic}
                  </h4>
                  <Badge variant="neutral" size="sm">
                    {gap.inquiries} queries
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {gap.recommendedAction}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Last queried: {gap.lastQueried}</span>
                  <button
                    onClick={() => navigate('/knowledge')}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Test refusal in Assistant →
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Launch & Recent Policies Table */}
      <Card>
        <CardHeader
          title="Active Policy Registry & Inspection"
          subtitle="Explore the 12 core organizational governance documents"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/time-travel')}
            >
              Time Travel History
            </Button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold border-y border-slate-200 dark:border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Policy Code</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Domain Space</th>
                <th className="py-3 px-4">Active Version</th>
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SYNTHETIC_POLICIES.slice(0, 6).map(policy => {
                const latest = policy.versions[policy.versions.length - 1];
                return (
                  <tr
                    key={policy.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                      {policy.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                      {policy.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {policy.category}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="primary" size="sm">
                        {latest.version}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {latest.effectiveDate}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success" size="sm">
                        {policy.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openDocumentById(policy.id)}
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline"
                      >
                        Inspect
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
