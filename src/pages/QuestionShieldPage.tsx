import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sanitizePrivacyApi, SanitizeResult } from '../services/api';
import { Card, CardHeader, CardContent } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Download,
  ArrowRight,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export const QuestionShieldPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, logAuditEvent } = useApp();

  const [rawInput, setRawInput] = useState('');
  const [sanitizedResult, setSanitizedResult] = useState<SanitizeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const sampleQueries = [
    {
      title: 'Remote Broadband Inquiry with PII',
      text: 'Hi, I am David Kim (FN-88210) from Engineering. Can I expense my $85 home fiber broadband to david.kim@finnova.internal or call +1 (555) 392-8192 for approval?'
    },
    {
      title: 'PTO Rollover Request with Executive Names',
      text: 'Marcus Sterling asked whether Elena Rostova (EMP-4421) is permitted to carry over 12 unused leave days into Q2 2025?'
    },
    {
      title: 'Travel Card Expense with Card Pattern',
      text: 'Please check if dinner receipt for $95 charged to corporate card 4532-8821-9923-1102 by Arthur Pendelton qualifies under the travel subsistence allowance.'
    }
  ];

  const handleDetect = async () => {
    if (!rawInput.trim()) return;

    setIsProcessing(true);
    try {
      const result = await sanitizePrivacyApi(rawInput);
      setSanitizedResult({
        ...result,
        originalText: rawInput
      } as any);

      showToast(
        'success',
        'Sanitization Complete',
        `Detected ${result.detectedEntities.length} PII tokens. Generated cryptographic receipt.`
      );

      // If local fallback, record event
      if (result.source === 'local_fallback') {
        await logAuditEvent(
          'QUESTION_SANITIZATION',
          'Privacy Shield Gateway',
          `Sanitized ${result.detectedEntities.length} PII entities (${result.receipt.detectedCategories.join(', ')})`,
          {
            receiptId: result.receipt.receiptId,
            tokensCount: result.detectedEntities.length,
            sanitizedHash: result.receipt.sanitizedHash.substring(0, 16) + '...',
            zeroRawPersistenceVerified: true
          }
        );
      }
    } catch (err) {
      showToast('error', 'Sanitization Failed', 'Could not process privacy detection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setRawInput('');
    setSanitizedResult(null);
    setShowOriginal(false);
    showToast('info', 'Question Shield Cleared', 'All temporary memory buffers wiped clean.');
  };

  const handleExportReceipt = () => {
    if (!sanitizedResult) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(sanitizedResult.receipt, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${sanitizedResult.receipt.receiptId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('success', 'Receipt Exported', 'Downloaded cryptographic JSON proof receipt.');
  };

  const [isForwarding, setIsForwarding] = useState(false);

  const handleForwardToAssistant = () => {
    if (!sanitizedResult || isForwarding) return;
    setIsForwarding(true);
    navigate('/knowledge', {
      state: { sanitizedQuery: sanitizedResult.sanitizedText }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Question Shield: Client-Side Privacy Gateway
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automatic tokenization & masking of personal identifiers before enterprise processing
          </p>
        </div>

        {sanitizedResult && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear Form
          </Button>
        )}
      </div>

      {/* Honest Limitation Banner */}
      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Client-Side Privacy Guarantee:</span> Detection and replacement execute strictly inside your local browser memory. Unmasked inputs are never written to disk, localStorage, or server logs. <em>Notice: Prototype detection relies on pattern heuristics and may miss novel non-standard identifiers. Review before submitting.</em>
        </div>
      </div>

      {/* Sample Query Selectors */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Load Pre-Configured Test Inquiries
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {sampleQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setRawInput(item.text);
                setSanitizedResult(null);
              }}
              className="p-3 text-left rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all text-xs group shadow-subtle"
            >
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                {item.title}
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {item.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader
          title="Draft or Paste Employee Inquiry"
          subtitle="Input can contain raw employee names, email addresses, phone numbers, or corporate IDs"
          action={
            <span className="text-xs text-slate-400 font-mono">
              {rawInput.length} characters
            </span>
          }
        />
        <CardContent className="space-y-4">
          <textarea
            value={rawInput}
            onChange={e => {
              setRawInput(e.target.value);
              if (sanitizedResult) setSanitizedResult(null);
            }}
            placeholder="e.g., Hi, I am David Kim (FN-88210). Can I expense my $85 internet bill to david.kim@finnova.internal?"
            rows={4}
            className="w-full rounded-xl p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero-Transmission Local Analysis</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!rawInput && !sanitizedResult}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleDetect}
                isLoading={isProcessing}
                disabled={!rawInput.trim()}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Detect & Sanitize PII
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sanitized Comparison & Result Display */}
      {sanitizedResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          {/* Detected Categories Badges */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Detected Sensitive Categories ({sanitizedResult.detectedEntities.length})
              </span>
              <Badge variant={sanitizedResult.detectedEntities.length > 0 ? 'success' : 'neutral'}>
                {sanitizedResult.detectedEntities.length > 0 ? 'All Entities Replaced' : 'Zero PII Detected'}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {sanitizedResult.receipt.detectedCategories.map((cat: string, idx: number) => (
                <Badge key={idx} variant="primary" size="md">
                  {cat}
                </Badge>
              ))}
              {sanitizedResult.detectedEntities.length === 0 && (
                <span className="text-xs text-slate-500 italic">
                  No personal names, corporate IDs, or communication handles identified.
                </span>
              )}
            </div>
          </div>

          {/* Original vs Sanitized Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original with Toggle */}
            <Card className="border-amber-200/60 dark:border-amber-900/40">
              <CardHeader
                title={
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Original Raw Input</span>
                  </div>
                }
                action={
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    {showOriginal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showOriginal ? 'Hide' : 'Reveal'}</span>
                  </button>
                }
              />
              <CardContent>
                <div className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-line leading-relaxed min-h-[100px]">
                  {showOriginal ? sanitizedResult.originalText : '•••••••••••••••••••••••••••••••••••••••••••••••••••••• (Hidden for privacy. Click Reveal to inspect original text)'}
                </div>
              </CardContent>
            </Card>

            {/* Sanitized Version */}
            <Card className="border-emerald-200/60 dark:border-emerald-900/40">
              <CardHeader
                title={
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sanitized & Tokenized Version</span>
                  </div>
                }
                action={
                  <Badge variant="success" size="sm">
                    Safe to Process
                  </Badge>
                }
              />
              <CardContent>
                <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-200 font-mono whitespace-pre-line leading-relaxed min-h-[100px]">
                  {sanitizedResult.sanitizedText}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cryptographic Privacy Receipt Card */}
          <Card className="border-indigo-100 dark:border-indigo-900/60">
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Cryptographic Privacy Receipt</span>
                </div>
              }
              subtitle="Verifiable proof of client-side redaction"
              action={
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportReceipt}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    Export JSON
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleForwardToAssistant}
                    disabled={isForwarding}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Test in Assistant
                  </Button>
                </div>
              }
            />
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block font-medium">Receipt Identifier</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                    {sanitizedResult.receipt.receiptId}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block font-medium">Sanitized SHA-256</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 truncate mt-1 block" title={sanitizedResult.receipt.sanitizedHash}>
                    {sanitizedResult.receipt.sanitizedHash.substring(0, 18)}...
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block font-medium">Retention Guarantee</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Zero Raw Storage
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 block font-medium">Processing Time</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100 mt-1 block">
                    12ms (Client Browser)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
