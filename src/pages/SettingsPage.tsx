import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardContent } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import {
  Settings,
  ShieldCheck,
  Moon,
  Sun,
  Lock,
  RotateCcw,
  Sliders,
  CheckCircle2,
  HardDrive,
  Info
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode, restoreOriginalLedger, showToast } = useApp();

  const [simulatedLatency, setSimulatedLatency] = useState<number>(350);
  const [privacySensitivity, setPrivacySensitivity] = useState<'Standard' | 'Strict'>('Strict');
  const [kAnonymityThreshold, setKAnonymityThreshold] = useState<number>(5);

  const handleSavePreferences = () => {
    showToast('success', 'Preferences Saved', 'Prototype demonstration preferences updated.');
  };

  const handleReset = async () => {
    await restoreOriginalLedger();
    showToast('info', 'Demo State Restored', 'All synthetic records and cryptographic ledger reset to baseline.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Platform Demonstration Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure local prototype behavior, simulation latencies, and demonstration controls
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Demo State
        </Button>
      </div>

      {/* Interface & Theme */}
      <Card>
        <CardHeader
          title="User Interface & Appearance"
          subtitle="Toggle daylight enterprise theme or sleek dark mode"
        />
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {isDarkMode ? 'Dark Theme' : 'Light Theme (Default Enterprise)'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isDarkMode ? 'Optimized for low-light enterprise monitoring' : 'Clean white and soft-grey surfaces with deep navy typography'}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
            >
              Toggle to {isDarkMode ? 'Light' : 'Dark'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & K-Anonymity Config */}
      <Card>
        <CardHeader
          title="Privacy Engine Configuration"
          subtitle="Thresholds for Question Shield masking and Rule Reality Check aggregation"
        />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  K-Anonymity Threshold
                </span>
                <Badge variant="purple" size="sm">
                  k = {kAnonymityThreshold}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Minimum distinct individuals required in a cohort before displaying telemetry.
              </p>
              <select
                value={kAnonymityThreshold}
                onChange={e => setKAnonymityThreshold(Number(e.target.value))}
                className="w-full mt-2 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value={3}>k = 3 (Relaxed)</option>
                <option value={5}>k = 5 (Standard Enterprise Default)</option>
                <option value={10}>k = 10 (Strict Institutional)</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Question Shield Sensitivity
                </span>
                <Badge variant="success" size="sm">
                  {privacySensitivity}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pattern matching depth for employee IDs, card numbers, and names.
              </p>
              <select
                value={privacySensitivity}
                onChange={e => setPrivacySensitivity(e.target.value as any)}
                className="w-full mt-2 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="Strict">Strict (Mask Names, IDs, Emails, Phones, Financials)</option>
                <option value="Standard">Standard (Mask IDs, Emails, Financials)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={handleSavePreferences}>
              Save Engine Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prototype Architecture Overview */}
      <Card>
        <CardHeader
          title="FinNova Prototype Architecture & Compliance"
          subtitle="Verified offline client-side architecture stack"
        />
        <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono">
              <span className="text-slate-400 block text-[10px]">Frontend Core</span>
              <strong className="text-slate-900 dark:text-slate-100">React 19 + TypeScript + Vite</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono">
              <span className="text-slate-400 block text-[10px]">Styling System</span>
              <strong className="text-slate-900 dark:text-slate-100">Tailwind CSS (Custom Enterprise Palette)</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono">
              <span className="text-slate-400 block text-[10px]">Cryptographic Anchor</span>
              <strong className="text-slate-900 dark:text-slate-100">W3C Web Crypto API (SHA-256 Digest)</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 font-mono">
              <span className="text-slate-400 block text-[10px]">Retrieval Engine</span>
              <strong className="text-slate-900 dark:text-slate-100">Deterministic Local Corpus Matching</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic pt-1">
            FinNova prototype runs 100% locally in browser memory without external AI model keys, backend services, or cloud data transfers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
