import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  User,
  ExternalLink,
  Lock,
  LogOut,
  KeyRound
} from 'lucide-react';
import { Badge } from '../shared/Badge';

export const TopNavbar: React.FC<{ sidebarCollapsed: boolean }> = ({ sidebarCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isDarkMode,
    toggleDarkMode,
    isBackendConnected,
    setIsSearchOpen,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    restoreOriginalLedger,
    showToast
  } = useApp();

  const { user, logout, changePassword } = useAuth();
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Change Password Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [isChangingPw, setIsChangingPw] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const routeTitles: Record<string, { title: string; category: string }> = {
    '/': { title: 'Executive Overview', category: 'Executive Dashboard' },
    '/knowledge': { title: 'AI Knowledge Assistant', category: 'Intelligence' },
    '/shield': { title: 'Question Shield', category: 'Privacy Gateway' },
    '/conflicts': { title: 'Policy Conflict Resolver', category: 'Governance' },
    '/reality-check': { title: 'Rule Reality Check', category: 'Analytics' },
    '/ask-why': { title: 'Ask Why: Decision Lineage', category: 'Auditability' },
    '/time-travel': { title: 'Policy Time Travel', category: 'History & Diff' },
    '/privacy': { title: 'Privacy & Cryptographic Ledger', category: 'Security' },
    '/settings': { title: 'Platform Settings & Config', category: 'Administration' },
  };

  const currentMeta = routeTitles[location.pathname] || { title: 'FinNova Intelligence', category: 'Platform' };

  const handleResetDemo = async () => {
    await restoreOriginalLedger();
    setProfileMenuOpen(false);
    showToast('info', 'Demo State Reset', 'Cryptographic ledger and simulated session restored.');
  };

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    showToast('info', 'Signed Out', 'Your session has been securely invalidated.');
    navigate('/login');
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) {
      showToast('warning', 'Password Too Short', 'New password must be at least 8 characters long.');
      return;
    }
    if (newPw !== confirmPw) {
      showToast('warning', 'Mismatch', 'New passwords do not match.');
      return;
    }

    setIsChangingPw(true);
    try {
      await changePassword(currentPw, newPw);
      showToast('success', 'Password Updated', 'Your corporate password has been changed.');
      setIsChangePasswordOpen(false);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message);
    } finally {
      setIsChangingPw(false);
    }
  };

  const userInitials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)
    : 'FN';

  const roleBadgeVariant =
    user?.role === 'SUPER_ADMIN' ? 'purple' :
    user?.role === 'EXECUTIVE' ? 'amber' :
    user?.role === 'DEPARTMENT_HEAD' ? 'blue' :
    user?.role === 'MANAGER' ? 'sky' :
    user?.role === 'AUDITOR' ? 'emerald' : 'slate';

  return (
    <>
      <header
        className={`fixed top-0 right-0 z-20 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300 flex items-center justify-between px-6 ${
          sidebarCollapsed ? 'left-20' : 'left-64'
        }`}
      >
        {/* Breadcrumb / Title */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
            {currentMeta.category}
          </span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {currentMeta.title}
          </h1>
          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
            isBackendConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>{isBackendConnected ? 'FastAPI + SQLite Active' : 'Client-Side Mode'}</span>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Search Bar Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-all text-xs"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Search policies & decisions...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-mono text-slate-400 dark:text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-float z-50 p-4 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Notifications ({unreadCount} unread)
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
                    >
                      Mark read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.linkPath) navigate(n.linkPath);
                        setNotifMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                        n.read ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40' : 'bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {n.type === 'alert' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {n.title}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                            {n.description}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {n.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {userInitials}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {user?.full_name || 'Authenticated User'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {user?.role || 'Guest'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-float z-50 p-3 space-y-2 animate-in fade-in duration-150">
                <div className="p-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {user?.full_name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                    {user?.corporate_email}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant={roleBadgeVariant as any} size="sm" icon={<Lock className="w-3 h-3" />}>
                      Clearance: {user?.role}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Dept: {user?.department_name || user?.department_code || 'General'}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsChangePasswordOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                    Change Password
                  </button>

                  <button
                    onClick={() => {
                      navigate('/privacy');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                    Privacy Audit Ledger
                  </button>

                  <button
                    onClick={() => {
                      navigate('/settings');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Platform Settings
                  </button>

                  <button
                    onClick={handleResetDemo}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Ledger State
                  </button>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                Change Corporate Password
              </h3>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  New Password (Min 8 Characters)
                </label>
                <input
                  type="password"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPw}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  {isChangingPw ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
