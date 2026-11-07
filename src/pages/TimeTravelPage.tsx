import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SYNTHETIC_POLICIES } from '../data/policies';
import { PolicyDocument, PolicyVersion } from '../types';
import { Card, CardHeader, CardContent } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import {
  History,
  Calendar,
  Clock,
  UserCheck,
  FileText,
  GitCompare,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const TimeTravelPage: React.FC = () => {
  const { openDocumentById } = useApp();

  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('POL-HR-001');
  const selectedPolicy: PolicyDocument =
    SYNTHETIC_POLICIES.find(p => p.id === selectedPolicyId) || SYNTHETIC_POLICIES[0];

  const [selectedVersionIdx, setSelectedVersionIdx] = useState<number>(
    selectedPolicy.versions.length - 1
  );

  // Custom Point-in-Time date picker
  const [pointInTimeDate, setPointInTimeDate] = useState<string>('2024-03-01');

  // Compare mode
  const [compareMode, setCompareMode] = useState<boolean>(true);

  const currentVersionObj: PolicyVersion = selectedPolicy.versions[selectedVersionIdx] || selectedPolicy.versions[0];
  const previousVersionObj: PolicyVersion | null =
    selectedVersionIdx > 0 ? selectedPolicy.versions[selectedVersionIdx - 1] : null;

  // Determine which version was active on the picked date
  const earliestDate = selectedPolicy.versions[0].effectiveDate;
  const isDateBeforeEarliest = pointInTimeDate < earliestDate;

  const activeVersionForDate = [...selectedPolicy.versions]
    .reverse()
    .find(v => pointInTimeDate >= v.effectiveDate);

  const handleSelectDate = (dateStr: string) => {
    setPointInTimeDate(dateStr);
    const matchIdx = selectedPolicy.versions.findIndex(v => v.effectiveDate === dateStr);
    if (matchIdx !== -1) {
      setSelectedVersionIdx(matchIdx);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Policy Time Travel: Historical Lineage & Diff
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inspect exact historical policy snapshots and codified amendments across effective dates
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant={compareMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
            leftIcon={<GitCompare className="w-4 h-4" />}
          >
            {compareMode ? 'Comparison Diff: On' : 'Single Version View'}
          </Button>
        </div>
      </div>

      {/* Policy Selector & Point-in-time Date Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Policy Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Target Policy:</span>
              <select
                value={selectedPolicyId}
                onChange={e => {
                  setSelectedPolicyId(e.target.value);
                  const p = SYNTHETIC_POLICIES.find(x => x.id === e.target.value);
                  if (p) setSelectedVersionIdx(p.versions.length - 1);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
              >
                {SYNTHETIC_POLICIES.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.id}: {p.title} ({p.versions.length} versions)
                  </option>
                ))}
              </select>
            </div>

            {/* Date Time Machine Picker */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Point-in-Time Snapshot:
              </span>
              <input
                type="date"
                value={pointInTimeDate}
                onChange={e => handleSelectDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Handling Dates Before Earliest Version Gracefully */}
      {isDateBeforeEarliest && (
        <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/30">
          <CardContent className="p-5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                No Codified Policy Existed on {pointInTimeDate}
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                The earliest recorded corporate version for <strong>{selectedPolicy.title}</strong> is <strong>{selectedPolicy.versions[0].version}</strong>, which became effective on <strong>{earliestDate}</strong>.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Prior to this date, informal local departmental arrangements were in effect. No binding corporate rules existed on record.
              </p>
              <button
                onClick={() => handleSelectDate(earliestDate)}
                className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Jump to Earliest Effective Snapshot ({earliestDate}) →
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Version Timeline Slider / Buttons */}
      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Version Evolution Timeline</span>
            </div>
          }
          subtitle={`Tracking ${selectedPolicy.versions.length} approved versions for ${selectedPolicy.id}`}
        />
        <CardContent>
          <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-4 pt-2">
            {selectedPolicy.versions.map((ver, idx) => {
              const isSelected = idx === selectedVersionIdx;
              const isPast = idx < selectedVersionIdx;
              return (
                <div
                  key={ver.version}
                  onClick={() => {
                    setSelectedVersionIdx(idx);
                    setPointInTimeDate(ver.effectiveDate);
                  }}
                  className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md border-indigo-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
                      {ver.version}
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {ver.effectiveDate}
                    </span>
                  </div>

                  <h5 className={`text-xs font-semibold mt-2 line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                    {ver.changelogNotes}
                  </h5>

                  <div className={`mt-3 pt-2 border-t text-[11px] flex items-center justify-between ${
                    isSelected ? 'border-indigo-500 text-indigo-100' : 'border-slate-100 dark:border-slate-800 text-slate-400'
                  }`}>
                    <span className="truncate">Signoff: {ver.approvedBy}</span>
                    <span>{ver.keyClauses.length} clauses</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Diff / Content Display */}
      {!isDateBeforeEarliest && (
        <div className="space-y-6">
          {compareMode && previousVersionObj ? (
            /* Diff Comparison View */
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-3">
                    <GitCompare className="w-5 h-5 text-indigo-500" />
                    <span>
                      Codified Diff: {previousVersionObj.version} ({previousVersionObj.effectiveDate}) → {currentVersionObj.version} ({currentVersionObj.effectiveDate})
                    </span>
                  </div>
                }
                subtitle="Green indicates newly codified clauses; Amber indicates amended/superseded provisions"
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDocumentById(selectedPolicy.id, currentVersionObj.version)}
                  >
                    Open Document Modal
                  </Button>
                }
              />
              <CardContent className="space-y-4">
                {/* Summary Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                      <span>Baseline: {previousVersionObj.version}</span>
                      <span>Approved: {previousVersionObj.effectiveDate}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {previousVersionObj.summary}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                      <span>Amended: {currentVersionObj.version}</span>
                      <span>Approved: {currentVersionObj.effectiveDate}</span>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {currentVersionObj.summary}
                    </p>
                  </div>
                </div>

                {/* Clause-by-Clause Evolution Diff */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Clause Changes & Additions
                  </h4>
                  {currentVersionObj.keyClauses.map(clause => {
                    const prevClause = previousVersionObj.keyClauses.find(c => c.clauseNumber === clause.clauseNumber);
                    const isNew = !prevClause;
                    const isChanged = prevClause && prevClause.text !== clause.text;

                    return (
                      <div
                        key={clause.clauseNumber}
                        className={`p-4 rounded-xl border transition-all ${
                          isNew
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                            : isChanged
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={isNew ? 'success' : isChanged ? 'warning' : 'neutral'} size="sm">
                              Clause {clause.clauseNumber} {isNew ? '(Newly Added)' : isChanged ? '(Amended)' : '(Unchanged)'}
                            </Badge>
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                              {clause.title}
                            </span>
                          </div>
                        </div>

                        {/* If changed: show previous and new side by side */}
                        {isChanged && prevClause ? (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200">
                              <span className="font-semibold block mb-1">Previous ({previousVersionObj.version}):</span>
                              <del>{prevClause.text}</del>
                            </div>
                            <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200">
                              <span className="font-semibold block mb-1">Current ({currentVersionObj.version}):</span>
                              <ins className="no-underline">{clause.text}</ins>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                            {clause.text}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Single Version Full View */
            <Card>
              <CardHeader
                title={`${selectedPolicy.title} (${currentVersionObj.version})`}
                subtitle={`Effective: ${currentVersionObj.effectiveDate} • Approved by: ${currentVersionObj.approvedBy} (${currentVersionObj.approverRole})`}
                action={
                  <Badge variant="primary">
                    Single Version View
                  </Badge>
                }
              />
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono whitespace-pre-line leading-relaxed">
                  {currentVersionObj.fullContent}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
