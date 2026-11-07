import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Database
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../shared/Card';
import { Badge } from '../shared/Badge';

export const AuditorDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    ledger,
    verifyCurrentLedger,
    isLedgerVerifying,
    verificationResult,
    simulateTamperAttack,
    restoreOriginalLedger
  } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Regulatory Audit & Assurance Desk
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Cryptographic Integrity & Compliance Monitor
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Independent oversight cockpit for verifying SHA-256 tamper-evident audit receipts, inspecting blockchain-style linkage, and ensuring zero-retention regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={verifyCurrentLedger}
            disabled={isLedgerVerifying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            {isLedgerVerifying ? 'Verifying Chain...' : 'Verify Cryptographic Chain'}
          </button>
          <button
            onClick={() => navigate('/privacy')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            Open Privacy Center
          </button>
        </div>
      </div>

      {/* Verification Status Card */}
      {verificationResult && (
        <div
          className={`p-4 rounded-2xl border transition-all ${
            verificationResult.isValid
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {verificationResult.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-sm font-bold">
                  {verificationResult.isValid
                    ? `Audit Chain Valid (${verificationResult.totalBlocksVerified} Blocks Verified)`
                    : `Cryptographic Breach Detected at Block #${verificationResult.corruptedBlockNumber}`}
                </h4>
                <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                  {verificationResult.isValid
                    ? 'All blocks from Genesis (0) through the tip match their SHA-256 digital signatures with zero mutations.'
                    : `Chain link broken: ${verificationResult.failureReason}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!verificationResult.isValid ? (
                <button
                  onClick={restoreOriginalLedger}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
                >
                  Restore Genuine State
                </button>
              ) : (
                <button
                  onClick={simulateTamperAttack}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-xs font-medium border border-slate-300 dark:border-slate-700"
                >
                  Simulate Tamper Attack
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ledger Block Explorer */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex items-center justify-between pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Immutable Audit Block Ledger (Recent Transactions)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero-PII compliance receipts chained using cryptographic SHA-256 hashes.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
            {ledger.length} Chained Blocks
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto font-mono text-xs">
            {ledger.map(block => (
              <div key={block.blockNumber} className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 space-y-2">
                <div className="flex items-center justify-between font-sans">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold font-mono">
                      Block #{block.blockNumber}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                      {block.eventType}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(block.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="font-sans text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {block.summary}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="truncate text-slate-400">
                    Prev: <span className="text-slate-500 dark:text-slate-400">{block.previousHash.slice(0, 24)}...</span>
                  </div>
                  <div className="truncate text-emerald-600 dark:text-emerald-400">
                    Hash: <span className="font-semibold">{block.hash.slice(0, 24)}...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
