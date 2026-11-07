import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SYNTHETIC_PRACTICES } from '../data/practices';
import { PracticeRecord } from '../types';
import { Card, CardHeader, CardContent } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import {
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Filter,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Info,
  Calendar,
  Users
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const RuleRealityCheckPage: React.FC = () => {
  const { showToast } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024-Q3');
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('All');

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return SYNTHETIC_PRACTICES.filter(record => {
      const matchDept = selectedDept === 'All' || record.department === selectedDept;
      const matchPeriod = selectedPeriod === 'All' || record.period === selectedPeriod;
      const matchPolicy = selectedPolicyId === 'All' || record.policyId === selectedPolicyId;
      return matchDept && matchPeriod && matchPolicy;
    });
  }, [selectedDept, selectedPeriod, selectedPolicyId]);

  // Aggregate metrics
  const activeDrifts = filteredRecords.filter(r => r.driftStatus !== 'Normal');
  const avgCompliance = filteredRecords.length > 0
    ? Math.round(filteredRecords.reduce((acc, r) => acc + r.actualComplianceRate, 0) / filteredRecords.length)
    : 0;

  // Selected primary record for deep-dive chart
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    filteredRecords.length > 0 ? filteredRecords[0].id : 'PRAC-001'
  );

  const activeRecord = SYNTHETIC_PRACTICES.find(r => r.id === selectedRecordId) || filteredRecords[0];

  const isSmallGroupSuppressed = activeRecord && activeRecord.samplePersonCount < 5;

  const departmentsList = [
    'All',
    'Sales & Business Dev',
    'Engineering & Product',
    'Customer Operations',
    'People Operations',
    'Finance & Legal',
    'Executive Leadership Office', // < 5 test
    'Cryptographic Core Pod'        // < 5 test
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <TrendingDown className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Rule Reality Check: Policy vs Practice Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoring continuous organizational drift with strict K-Anonymity (k ≥ 5) privacy thresholds
          </p>
        </div>

        <Badge variant="purple" size="md" icon={<Lock className="w-3.5 h-3.5" />}>
          Privacy Threshold: Cohort ≥ 5
        </Badge>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Department Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Department:</span>
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
                >
                  {departmentsList.map(d => (
                    <option key={d} value={d}>
                      {d} {d === 'Executive Leadership Office' ? '(Cohort: 4)' : d === 'Cryptographic Core Pod' ? '(Cohort: 3)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Period Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={e => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="All">All Timeframes</option>
                  <option value="2024-Q3">2024-Q3 (Current)</option>
                  <option value="2024-Q2">2024-Q2</option>
                  <option value="2024-Q1">2024-Q1</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium">
                {filteredRecords.length} records in scope
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedDept('All');
                  setSelectedPeriod('2024-Q3');
                  setSelectedPolicyId('All');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Average Adherence Rate
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {avgCompliance}%
            </span>
            <span className="text-xs text-amber-600 font-medium">
              -6% below target
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Observed Severe Drifts
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">
              {activeDrifts.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              requiring operational intervention
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Cohort Anonymity Filter
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">
              100% Enforced
            </span>
            <span className="text-xs text-slate-500 font-medium">
              K-Anonymity (k ≥ 5)
            </span>
          </div>
        </div>
      </div>

      {/* Main Practice Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Practice Records List (1 Col) */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Telemetry Cohorts ({filteredRecords.length})
          </span>
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {filteredRecords.map(r => {
              const isSelected = activeRecord?.id === r.id;
              const isSuppressed = r.samplePersonCount < 5;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRecordId(r.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant={r.driftStatus === 'Severe Drift' ? 'danger' : r.driftStatus === 'Moderate Drift' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {r.driftStatus}
                    </Badge>
                    <span className="text-[11px] font-mono font-medium text-slate-400">
                      Cohort: {isSuppressed ? `<5 (Suppressed)` : `${r.samplePersonCount} people`}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-2 line-clamp-1">
                    {r.metricName}
                  </h4>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate">{r.department}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isSuppressed ? '•••' : `${r.actualComplianceRate}% / ${r.targetComplianceRate}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Chart & Explanation Panel (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {activeRecord && (
            <>
              {/* Check if suppressed */}
              {isSmallGroupSuppressed ? (
                <Card className="border-purple-200 dark:border-purple-900/60 bg-purple-50/20">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto shadow-sm">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        Privacy Suppression Active
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        The selected cohort (<strong>{activeRecord.department}</strong>) contains only <strong>{activeRecord.samplePersonCount} distinct individuals</strong>.
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300 font-mono bg-purple-100/60 dark:bg-purple-900/40 p-2.5 rounded-lg border border-purple-200 dark:border-purple-800">
                        POL-PRIV-001 Section 4.1: "Workforce analytics aggregations must suppress metrics for any demographic or departmental subgroup containing fewer than five individuals."
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        Displaying individual telemetry on small teams would risk reverse-identifying individual employee behaviors.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDept('All')}
                    >
                      Return to Aggregate Cohorts
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* Unsuppressed normal view */
                <>
                  <Card>
                    <CardHeader
                      title={activeRecord.metricName}
                      subtitle={`${activeRecord.department} • Target: ${activeRecord.targetComplianceRate}% vs Actual: ${activeRecord.actualComplianceRate}%`}
                      action={
                        <Badge
                          variant={activeRecord.driftStatus === 'Severe Drift' ? 'danger' : activeRecord.driftStatus === 'Moderate Drift' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {activeRecord.driftStatus}
                        </Badge>
                      }
                    />
                    <CardContent>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={activeRecord.historicalTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                            <YAxis domain={[50, 105]} tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} unit="%" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#1E293B',
                                borderRadius: '12px',
                                border: 'none',
                                color: '#F8FAFC',
                                fontSize: '12px'
                              }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                            <Line type="monotone" dataKey="actual" name="Observed Compliance" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="target" name="Policy Target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Root Cause & Remediation Card */}
                  <Card>
                    <CardContent className="p-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Identified Primary Root Cause
                        </h4>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {activeRecord.primaryRootCause}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Recommended Remediation Action
                        </span>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                          {activeRecord.recommendedRemediation}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>Observed Instances: {activeRecord.observedCount} events</span>
                        <span>Sampled Cohort: {activeRecord.samplePersonCount} employees (Verified k ≥ 5)</span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
