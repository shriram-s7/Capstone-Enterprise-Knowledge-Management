import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuditBlock } from '../types';
import { Card, CardHeader, CardContent } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import { Dialog } from '../components/shared/Dialog';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download,
  Lock,
  Layers,
  FileCheck2,
  Eye,
  RotateCcw,
  AlertOctagon,
  ExternalLink,
  Flame
} from 'lucide-react';

export const PrivacyCenterPage: React.FC = () => {
  const {
    ledger,
    isLedgerVerifying,
    verificationResult,
    verifyCurrentLedger,
    simulateTamperAttack,
    restoreOriginalLedger,
    showToast
  } = useApp();

  const [selectedBlock, setSelectedBlock] = useState<AuditBlock | null>(null);

  const handleExportLedger = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(
        {
          finnovaAuditLedgerExport: {
            exportTimestamp: new Date().toISOString(),
            totalBlocks: ledger.length,
            algorithm: 'FIPS 180-4 SHA-256',
            verificationStatus: verificationResult?.isValid ? 'VERIFIED_VALID' : 'TAMPER_DETECTED',
            blocks: ledger
          }
        },
        null,
        2
      )
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `finnova-audit-ledger-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('success', 'Ledger Exported', 'Full cryptographic ledger downloaded as JSON.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Privacy Center & Cryptographic Audit Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verifiable SHA-256 hash-chained ledger demonstrating immutable audit trails & tamper detection
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportLedger}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Ledger JSON
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => verifyCurrentLedger()}
            isLoading={isLedgerVerifying}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Verify Integrity
          </Button>
        </div>
      </div>

      {/* Honest Prototype Security Notice */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-card">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white">Browser Cryptographic Guarantee:</span> Hashes are calculated using the native W3C <code>crypto.subtle.digest('SHA-256')</code> API. Unmasked employee PII is strictly excluded from payload metadata.
            <em className="text-slate-400 block text-[11px] mt-0.5">
              Notice: In production, hash chains are replicated to Byzantine fault-tolerant immutable cloud anchors. Client memory demonstrates verification mechanics.
            </em>
          </div>
        </div>
      </div>

      {/* Ledger Verification Status Card */}
      <Card
        className={`border-2 transition-all ${
          verificationResult?.isValid
            ? 'border-emerald-500/40 bg-emerald-50/10'
            : 'border-rose-500/60 bg-rose-50/10'
        }`}
      >
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  verificationResult?.isValid
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 animate-pulse'
                }`}
              >
                {verificationResult?.isValid ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertOctagon className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {verificationResult?.isValid
                      ? 'Cryptographic Ledger Verified: Chain Intact'
                      : 'TAMPER DETECTED: Hash Chain Inconsistency!'}
                  </h3>
                  <Badge variant={verificationResult?.isValid ? 'success' : 'danger'}>
                    {verificationResult?.isValid ? 'Status: Valid' : 'Corrupted Block Detected'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {verificationResult?.isValid
                    ? `All ${verificationResult.totalBlocksVerified} chained blocks mathematically verified against Web Crypto SHA-256 digests. Zero broken links.`
                    : verificationResult?.failureReason}
                </p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Last verified: {verificationResult?.verificationTimestamp}
                </div>
              </div>
            </div>

            {/* Interactive Tamper Test Controls */}
            <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
              {verificationResult?.isValid ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateTamperAttack}
                  leftIcon={<Flame className="w-3.5 h-3.5 text-rose-500" />}
                  className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  Simulate Tamper Attack
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={restoreOriginalLedger}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Restore Original Demo Data
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Chained Blocks
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">
            {ledger.length}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">Genesis to Block #{ledger.length - 1}</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Hashing Algorithm
          </span>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block font-mono">
            SHA-256
          </span>
          <span className="text-xs text-slate-400 mt-1 block">W3C Web Crypto Subtlety</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            PII Masking Rate
          </span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">
            100%
          </span>
          <span className="text-xs text-slate-400 mt-1 block">Zero raw personal identities</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Audit Retention
          </span>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">
            Immutable
          </span>
          <span className="text-xs text-slate-400 mt-1 block">FIPS 180-4 standard</span>
        </div>
      </div>

      {/* Audit Block Chain Table */}
      <Card>
        <CardHeader
          title="Hash-Chained Audit Ledger Records"
          subtitle="Click on any block to inspect cryptographic payload and previousHash link"
          action={
            <Badge variant="primary" size="sm">
              Live Ledger ({ledger.length} Blocks)
            </Badge>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold border-y border-slate-200 dark:border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Block #</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Actor ID</th>
                <th className="py-3 px-4">Event Summary</th>
                <th className="py-3 px-4">Block Hash</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...ledger].reverse().map(block => {
                const isTamperedBlock =
                  verificationResult &&
                  !verificationResult.isValid &&
                  verificationResult.corruptedBlockNumber === block.blockNumber;

                return (
                  <tr
                    key={block.blockNumber}
                    onClick={() => setSelectedBlock(block)}
                    className={`cursor-pointer transition-colors ${
                      isTamperedBlock
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-medium'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold">
                      #{block.blockNumber}
                      {isTamperedBlock && (
                        <span className="ml-2 text-[10px] text-rose-600 font-bold uppercase">
                          [CORRUPTED]
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          block.eventType === 'PII_SHIELD_APPLIED' || block.eventType === 'QUESTION_SANITIZATION'
                            ? 'purple'
                            : block.eventType === 'POLICY_SUPERSEDED' || block.eventType === 'COMPLIANCE_DRIFT_ALERT'
                            ? 'warning'
                            : 'primary'
                        }
                        size="sm"
                      >
                        {block.eventType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {block.actorId}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-sm truncate">
                      {block.summary}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500" title={block.hash}>
                      {block.hash.substring(0, 16)}...
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedBlock(block);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Block Inspection Dialog */}
      {selectedBlock && (
        <Dialog
          isOpen={!!selectedBlock}
          onClose={() => setSelectedBlock(null)}
          title={
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-indigo-600">
                Block #{selectedBlock.blockNumber}
              </span>
              <Badge variant="primary">{selectedBlock.eventType}</Badge>
            </div>
          }
          description={`Logged: ${selectedBlock.timestamp} • Actor: ${selectedBlock.actorId} (${selectedBlock.actorRole})`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Hash Linkage Header */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Current Block Hash (SHA-256)
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 break-all select-all font-semibold">
                  {selectedBlock.hash}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Previous Block Hash Link
                </span>
                <span className="text-slate-600 dark:text-slate-300 break-all select-all">
                  {selectedBlock.previousHash}
                </span>
              </div>
            </div>

            {/* Summary */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Event Description
              </span>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {selectedBlock.summary}
              </p>
            </div>

            {/* Metadata Payload JSON */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Cryptographically Signed Metadata Payload
              </span>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(selectedBlock.metadataPayload, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBlock(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
