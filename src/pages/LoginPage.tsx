import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileText,
  GitBranch,
  ShieldCheck,
  Building2,
  Users,
  Sparkles
} from 'lucide-react';
import { forgotPasswordApi } from '../services/authApi';

interface DemoAccount {
  roleName: string;
  roleCode: string;
  email: string;
  password: string;
  name: string;
  department: string;
  description: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    roleName: 'Super Administrator',
    roleCode: 'SUPER_ADMIN',
    email: 'admin@finnova.demo',
    password: 'Admin!FinNova2026#Secure',
    name: 'Alex Vance',
    department: 'InfoSec & Compliance',
    description: 'System health, user management, audit verification, security events'
  },
  {
    roleName: 'Executive Management',
    roleCode: 'EXECUTIVE',
    email: 'executive@finnova.demo',
    password: 'Exec!Sterling2026#Chief',
    name: 'Victoria Sterling (CEO)',
    department: 'Executive Office',
    description: 'Executive overview, policy conflicts, decision summaries & impact'
  },
  {
    roleName: 'Department Head',
    roleCode: 'DEPARTMENT_HEAD',
    email: 'head@finnova.demo',
    password: 'Head!Engineering2026#Lead',
    name: 'Marcus Chen',
    department: 'Software Engineering',
    description: 'Departmental dashboard, team policies & conflict analysis'
  },
  {
    roleName: 'Manager',
    roleCode: 'MANAGER',
    email: 'manager@finnova.demo',
    password: 'Mgr!InfraTeam2026#Track',
    name: 'Elena Rostova',
    department: 'Software Engineering',
    description: 'Team operational insights, direct reports & policy access'
  },
  {
    roleName: 'Employee',
    roleCode: 'EMPLOYEE',
    email: 'employee@finnova.demo',
    password: 'Emp!DavidKim2026#Access',
    name: 'David Kim',
    department: 'Software Engineering',
    description: 'Knowledge Assistant, Question Shield & policy citations'
  },
  {
    roleName: 'Auditor',
    roleCode: 'AUDITOR',
    email: 'auditor@finnova.demo',
    password: 'Audit!Bennett2026#Verify',
    name: 'Sophia Bennett',
    department: 'Compliance & Audit',
    description: 'Cryptographic SHA-256 audit ledger verification & compliance log'
  }
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotResult, setForgotResult] = useState<{ status: string; message: string; reset_token?: string; note: string } | null>(null);
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);

  // Target path after redirect
  const from = (location.state as any)?.from?.pathname || '/';

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setErrorMessage('Corporate email address is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid corporate email format (e.g., name@finnova.demo).');
      return false;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), password, rememberMe);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your corporate credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectDemoAccount = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMessage(null);
  };

  const handleQuickLogin = async (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await login(acc.email, acc.password, rememberMe);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setIsForgotSubmitting(true);
    try {
      const res = await forgotPasswordApi(forgotEmail.trim());
      setForgotResult(res);
    } catch (err: any) {
      setForgotResult({
        status: 'error',
        message: err.message || 'Unable to process reset request.',
        note: 'Please contact FinNova SecOps Administrator.'
      });
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* LEFT PANEL: Enterprise Identity & Value Proposition */}
      <div className="relative w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Subtle grid and radial background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">FinNova</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Enterprise
                </span>
              </div>
              <span className="text-xs text-slate-400 tracking-wide block">
                Knowledge & Decision Intelligence Platform
              </span>
            </div>
          </div>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 my-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Zero-Cloud • Privacy-First Architecture
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Intelligence. Trust. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">
              Accountability.
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
            FinNova unifies corporate policy retrieval, organizational hierarchy, and precedence-backed conflict resolution with an immutable, cryptographically verifiable audit ledger.
          </p>

          {/* Three Feature Highlight Cards */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Secure Enterprise Knowledge</h4>
                <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                  100% local deterministic retrieval with strict clause citations and anti-hallucination guardrails.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 mt-0.5">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Policy Intelligence</h4>
                <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                  Deterministic conflict detection applying legal precedence (<span className="italic">lex specialis</span> and authority hierarchy).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Privacy-First Decision Support</h4>
                <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                  Real-time Question Shield PII masking with verifiable SHA-256 blockchain-style hash audit receipts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Seals */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Argon2id Hash Authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SHA-256 Ledger Guard</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Sign-In Form & Demo Credentials Switcher */}
      <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Form Header */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Corporate Sign In
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Authenticate using your registered FinNova corporate email to access your role-specific enterprise dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Corporate Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="corporate-email-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@finnova.demo"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="corporate-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter corporate password"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Remember this device for 7 days
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="signin-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to FinNova</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Demo Roles Selector */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                Demo Evaluation Accounts (1-Click Fill)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(acc => {
                const isCurrent = email === acc.email;
                const roleSlug = acc.roleCode.toLowerCase().replace('_', '-');
                return (
                  <div
                    key={acc.roleCode}
                    id={`demo-card-${roleSlug}`}
                    onClick={() => handleSelectDemoAccount(acc)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate">
                        {acc.roleName}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {acc.name}
                      </div>
                      <div className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                        {acc.roleCode}
                      </div>
                    </div>

                    <button
                      type="button"
                      id={`instant-login-${roleSlug}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickLogin(acc);
                      }}
                      className="mt-2 w-full py-1 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-400/10 dark:hover:bg-indigo-500 dark:text-indigo-300 dark:hover:text-white text-[10px] font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Authorized Access Only: </span>
              All sign-in attempts are cryptographically timestamped and verified against the FinNova immutable ledger.
            </div>
          </div>

          {/* Footer Contact */}
          <div className="text-center text-xs text-slate-400">
            Need access or an account password reset?{' '}
            <button
              onClick={() => setIsForgotModalOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Contact SecOps Administrator
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Corporate Password Reset
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotResult(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            {!forgotResult ? (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter your registered corporate email address. FinNova enterprise security enforces administrator verification for credential resets to prevent account takeovers.
                </p>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="e.g. employee@finnova.demo"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isForgotSubmitting}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
                  >
                    {isForgotSubmitting ? 'Requesting...' : 'Request Reset'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {forgotResult.message}
                  </div>
                  {forgotResult.reset_token && (
                    <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/60 font-mono text-[11px]">
                      Ticket Token: <span className="text-emerald-950 dark:text-white select-all">{forgotResult.reset_token}</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {forgotResult.note}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setForgotResult(null);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
