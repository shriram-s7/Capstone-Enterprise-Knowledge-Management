import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SYNTHETIC_DECISIONS } from '../data/decisions';
import { DecisionRecord } from '../types';
import { Card, CardHeader, CardContent } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import {
  HelpCircle,
  Calendar,
  UserCheck,
  FileText,
  Search,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  GitBranch,
  Layers
} from 'lucide-react';

export const AskWhyPage: React.FC = () => {
  const { openDocumentById } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(SYNTHETIC_DECISIONS[0].id);

  const filteredDecisions = SYNTHETIC_DECISIONS.filter(d => {
    const matchSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.businessContext.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDept = selectedDept === 'All' || d.department.includes(selectedDept);
    return matchSearch && matchDept;
  });

  const activeDecision: DecisionRecord =
    SYNTHETIC_DECISIONS.find(d => d.id === selectedDecisionId) || SYNTHETIC_DECISIONS[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Ask Why: Decision Lineage & Policy Auditability
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Trace organizational actions back to ratified policy clauses, supporting evidence, and executive rationales
          </p>
        </div>

        <Badge variant="primary" size="md">
          {SYNTHETIC_DECISIONS.length} Traceable Executive Decisions
        </Badge>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter by decision ID, owner, or keyword..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Department:</span>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering & Product</option>
                <option value="Security">Information Security</option>
                <option value="Finance">Sales & Finance</option>
                <option value="Legal">Legal & Compliance</option>
                <option value="People">People Operations</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Decision Timeline (Left) & Full Lineage Detail (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Column (1 Col) */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Decision Chronology ({filteredDecisions.length})
          </span>
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto">
            {filteredDecisions.map(d => {
              const isSelected = activeDecision.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDecisionId(d.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {d.id}
                    </span>
                    <Badge variant={d.status === 'Approved' ? 'success' : 'purple'} size="sm">
                      {d.status}
                    </Badge>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-2 line-clamp-1">
                    {d.title}
                  </h4>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">{d.ownerName}</span>
                    <span className="font-mono">{d.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Decision Lineage Canvas (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400 font-bold">
                    {activeDecision.id}
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {activeDecision.title}
                  </span>
                </div>
              }
              subtitle={`${activeDecision.department} • Authorized: ${activeDecision.date}`}
              action={
                <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  {activeDecision.status}
                </Badge>
              }
            />
            <CardContent className="space-y-6">
              {/* Executive Owner & Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Decision Author / Sponsor</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                    {activeDecision.ownerName} ({activeDecision.ownerRole})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Operational Date</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {activeDecision.date}
                  </span>
                </div>
              </div>

              {/* Business Context & Decision Summary */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Operational Context
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeDecision.businessContext}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-1">
                    Formal Executed Decision
                  </h4>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {activeDecision.decisionSummary}
                  </p>
                </div>
              </div>

              {/* Relevant Codified Policy Clauses Cited */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  Governing Policy Clauses Invoked
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {activeDecision.relevantPolicyIds.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => openDocumentById(item.policyId, item.versionUsed)}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 cursor-pointer transition-all flex items-center justify-between group shadow-subtle"
                    >
                      <div className="flex items-center gap-2.5">
                        <Badge variant="primary" size="sm">
                          {item.policyId} ({item.versionUsed})
                        </Badge>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.clauseCited}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting Evidence Artifacts */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Documentary Evidence & Independent Audits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeDecision.supportingEvidence.map(ev => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="neutral" size="sm">
                          {ev.type}
                        </Badge>
                        <span className="font-mono text-[10px] text-slate-400">
                          {ev.id}
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {ev.title}
                      </h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {ev.summary}
                      </p>
                      {ev.sourceDocument && (
                        <div className="pt-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-mono truncate">
                          Ref: {ev.sourceDocument}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Metrics */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                  Demonstrated Business Impact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeDecision.impactMetrics.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
                      <span className="text-[11px] text-slate-500 block">{m.metricName}</span>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1 block">
                        {m.value}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
                        {m.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Decisions Link */}
              {activeDecision.relatedDecisionIds && activeDecision.relatedDecisionIds.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                  <GitBranch className="w-4 h-4 text-slate-400" />
                  <span>Related Precedents:</span>
                  {activeDecision.relatedDecisionIds.map(relId => (
                    <button
                      key={relId}
                      onClick={() => setSelectedDecisionId(relId)}
                      className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      {relId}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
