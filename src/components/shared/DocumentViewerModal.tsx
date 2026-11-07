import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Dialog } from './Dialog';
import { Badge } from './Badge';
import { Button } from './Button';
import { FileText, Copy, Check, Calendar, ShieldCheck, UserCheck, Layers } from 'lucide-react';

export const DocumentViewerModal: React.FC = () => {
  const { previewDocument, setPreviewDocument, previewVersion, setPreviewVersion, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (previewDocument && !previewVersion) {
      setPreviewVersion(previewDocument.currentVersion);
    }
  }, [previewDocument, previewVersion, setPreviewVersion]);

  if (!previewDocument) return null;

  const selectedVersionObj = previewDocument.versions.find(v => v.version === previewVersion) 
    || previewDocument.versions[previewDocument.versions.length - 1];

  const handleCopy = () => {
    const textToCopy = `# ${previewDocument.title} (${selectedVersionObj.version})\nEffective: ${selectedVersionObj.effectiveDate}\nApproved By: ${selectedVersionObj.approvedBy} (${selectedVersionObj.approverRole})\n\n${selectedVersionObj.fullContent}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('success', 'Document Copied to Clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      isOpen={!!previewDocument}
      onClose={() => setPreviewDocument(null)}
      title={
        <div className="flex items-center gap-2.5 flex-wrap">
          <Badge variant="primary" icon={<FileText className="w-3.5 h-3.5" />}>
            {previewDocument.id}
          </Badge>
          <span className="font-semibold">{previewDocument.title}</span>
        </div>
      }
      description={`Category: ${previewDocument.category} • Owner: ${previewDocument.ownerDepartment}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Metadata Header & Version Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Version:
            </span>
            <div className="flex items-center gap-1.5">
              {previewDocument.versions.map(v => (
                <button
                  key={v.version}
                  onClick={() => setPreviewVersion(v.version)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    v.version === selectedVersionObj.version
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {v.version}
                  {v.version === previewDocument.currentVersion && ' (Active)'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Effective: <strong>{selectedVersionObj.effectiveDate}</strong>
            </span>
            <span className="inline-flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              Signoff: <strong>{selectedVersionObj.approvedBy}</strong> ({selectedVersionObj.approverRole})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied' : 'Copy Policy'}
            </Button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Executive Summary ({selectedVersionObj.version})
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {selectedVersionObj.summary}
          </p>
          {selectedVersionObj.changelogNotes && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
              Version Changelog: {selectedVersionObj.changelogNotes}
            </p>
          )}
        </div>

        {/* Key Clauses */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Key Codified Clauses ({selectedVersionObj.keyClauses.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedVersionObj.keyClauses.map(clause => (
              <div
                key={clause.clauseNumber}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-800/80 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="primary" size="sm">
                    Clause {clause.clauseNumber}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {clause.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {clause.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Policy Body */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Full Policy Text
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
            {selectedVersionObj.fullContent}
          </div>
        </div>

        {/* Footer Notice */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Scope: {previewDocument.scope}</span>
          <span>Next Scheduled Review: {previewDocument.nextReviewDate}</span>
        </div>
      </div>
    </Dialog>
  );
};
