import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SYNTHETIC_CONFLICTS } from '../data/conflicts';
import { SYNTHETIC_POLICIES } from '../data/policies';
import { PolicyConflict } from '../types';
import { analyzeConflictApi } from '../services/api';
import { Card, CardHeader, CardContent } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import {
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Scale,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

export const ConflictResolverPage: React.FC = () => {
  const { openDocumentById, showToast } = useApp();

  const [selectedConflict, setSelectedConflict] = useState<PolicyConflict>(SYNTHETIC_CONFLICTS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(true);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisCompleted(false);

    try {
      const result = await analyzeConflictApi(selectedConflict.id);
      if (result.conflict) {
        setSelectedConflict(result.conflict);
      }
      showToast(
        'info',
        'Precedence Evaluated via Backend',
        `Precedence status: ${result.conflict?.resolutionStatus || selectedConflict.resolutionStatus}`
      );
    } catch (err) {
      // Fallback
      showToast(
        'info',
        'Precedence Evaluated (Local)',
        `Determined resolution status: ${selectedConflict.resolutionStatus}`
      );
    } finally {
      setIsAnalyzing(false);
      setAnalysisCompleted(true);
    }
  };

  const getPolicyMeta = (policyId: string) => {
    return SYNTHETIC_POLICIES.find(p => p.id === policyId);
  };

  const policyAMeta = getPolicyMeta(selectedConflict.policyA.id);
  const policyBMeta = getPolicyMeta(selectedConflict.policyB.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Policy Conflict Resolver
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-document contradiction analysis, legal precedence ordering, and human review routing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="danger" size="md">
            {SYNTHETIC_CONFLICTS.filter(c => c.severity === 'Critical').length} Critical
          </Badge>
          <Badge variant="warning" size="md">
            {SYNTHETIC_CONFLICTS.filter(c => c.resolutionStatus === 'Requires Human Review').length} Review Required
          </Badge>
        </div>
      </div>

      {/* Conflict Selection Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SYNTHETIC_CONFLICTS.map(c => {
          const isSelected = selectedConflict.id === c.id;
          return (
            <div
              key={c.id}
              onClick={() => {
                setSelectedConflict(c);
                setAnalysisCompleted(true);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <Badge
                  variant={c.severity === 'Critical' ? 'danger' : c.severity === 'High' ? 'warning' : 'neutral'}
                  size="sm"
                >
                  {c.severity}
                </Badge>
                <span className="text-[11px] font-mono font-medium text-slate-400">
                  {c.id}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-2 line-clamp-1">
                {c.title}
              </h4>

              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {c.policyA.id}
                </span>
                <span>vs</span>
                <span className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {c.policyB.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Comparison Canvas */}
      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {selectedConflict.title}
              </span>
              <Badge
                variant={selectedConflict.resolutionStatus === 'Resolved By Precedence' ? 'success' : 'warning'}
                icon={selectedConflict.resolutionStatus === 'Resolved By Precedence' ? <CheckCircle2 className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
              >
                {selectedConflict.resolutionStatus}
              </Badge>
            </div>
          }
          subtitle={`Impacted Units: ${selectedConflict.affectedDepartments.join(', ')}`}
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Re-Analyze Precedence
            </Button>
          }
        />
        <CardContent className="space-y-6">
          {/* Side by Side Contradiction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Policy A Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedConflict.policyA.id} ({selectedConflict.policyA.version})
                    </span>
                    <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {policyAMeta?.title}
                    </h5>
                  </div>
                  <button
                    onClick={() => openDocumentById(selectedConflict.policyA.id, selectedConflict.policyA.version)}
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    title="Open Document"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] font-semibold uppercase text-slate-400 mb-1">
                    Cited Clause {selectedConflict.policyA.clauseNumber}
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
                    "{selectedConflict.policyA.statement}"
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Domain: {policyAMeta?.category}</span>
                <span>Owner: {policyAMeta?.ownerDepartment}</span>
              </div>
            </div>

            {/* Policy B Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/60">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedConflict.policyB.id} ({selectedConflict.policyB.version})
                    </span>
                    <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {policyBMeta?.title}
                    </h5>
                  </div>
                  <button
                    onClick={() => openDocumentById(selectedConflict.policyB.id, selectedConflict.policyB.version)}
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    title="Open Document"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] font-semibold uppercase text-slate-400 mb-1">
                    Cited Clause {selectedConflict.policyB.clauseNumber}
                  </div>
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-950 dark:text-rose-200 font-medium leading-relaxed">
                    "{selectedConflict.policyB.statement}"
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Domain: {policyBMeta?.category}</span>
                <span>Owner: {policyBMeta?.ownerDepartment}</span>
              </div>
            </div>
          </div>

          {/* Conflict Explanation & Precedence Panel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Root Cause & Contradiction Details
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedConflict.conflictDescription}
              </p>
            </div>

            {/* Precedence Determination */}
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  Governance Precedence Ruling
                </h5>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                {selectedConflict.precedenceRule}
              </p>
            </div>

            {/* Recommended Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Recommended Remediation Action
                </span>
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  {selectedConflict.recommendedAction}
                </p>
              </div>

              <Button
                variant={selectedConflict.resolutionStatus === 'Requires Human Review' ? 'danger' : 'primary'}
                size="sm"
                onClick={() => {
                  showToast(
                    'success',
                    'Remediation Dispatched',
                    selectedConflict.resolutionStatus === 'Requires Human Review'
                      ? 'Escalation ticket dispatched to Joint Legal-Security Working Group.'
                      : 'ERP rule updated to enforce established precedence order.'
                  );
                }}
              >
                {selectedConflict.resolutionStatus === 'Requires Human Review' ? 'Escalate to Working Group' : 'Apply Automated Fix'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
