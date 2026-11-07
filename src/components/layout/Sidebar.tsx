import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Bot,
  ShieldAlert,
  GitCompare,
  TrendingDown,
  HelpCircle,
  History,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Lock,
  Network
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { role, user } = useAuth();

  const allNavItems = [
    { name: role === 'SUPER_ADMIN' ? 'Admin Plane' : role === 'EMPLOYEE' ? 'My Portal' : role === 'AUDITOR' ? 'Audit Monitor' : 'Executive Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5 shrink-0" />, roles: ['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'EMPLOYEE', 'AUDITOR'] },
    { name: 'Unified Intelligence', path: '/unified-intelligence', icon: <Network className="w-5 h-5 shrink-0" />, roles: ['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'EMPLOYEE', 'AUDITOR'] },
    { name: 'Knowledge Assistant', path: '/knowledge', icon: <Bot className="w-5 h-5 shrink-0" />, roles: ['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'EMPLOYEE', 'AUDITOR'] },
    { name: 'Question Shield', path: '/shield', icon: <ShieldAlert className="w-5 h-5 shrink-0" />, roles: ['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Conflict Resolver', path: '/conflicts', icon: <GitCompare className="w-5 h-5 shrink-0" />, roles: ['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'AUDITOR'] },
    { name: 'Rule Reality Check', path: '/reality-check', icon: <TrendingDown className="w-5 h-5 shrink-0" />, roles: ['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER'] },
    { name: 'Ask Why', path: '/ask-why', icon: <HelpCircle className="w-5 h-5 shrink-0" />, roles: ['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'AUDITOR'] },
    { name: 'Time Travel', path: '/time-travel', icon: <History className="w-5 h-5 shrink-0" />, roles: ['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'AUDITOR'] },
    { name: 'Privacy Center', path: '/privacy', icon: <ShieldCheck className="w-5 h-5 shrink-0" />, roles: ['SUPER_ADMIN', 'EXECUTIVE', 'AUDITOR'] },
    { name: 'System Settings', path: '/settings', icon: <Settings className="w-5 h-5 shrink-0" />, roles: ['SUPER_ADMIN', 'EXECUTIVE'] },
  ];

  const navItems = allNavItems.filter(item => !role || item.roles.includes(role));

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-slate-900 text-slate-100 transition-all duration-300 border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                FinNova
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Demo
                </span>
              </span>
              <span className="text-[11px] text-slate-400 tracking-wide">
                Decision Intelligence
              </span>
            </div>
          )}
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '•••' : 'Core Modules'}
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              } ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? item.name : undefined}
          >
            {item.icon}
            {!collapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Privacy Status Banner */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {!collapsed && user && (
          <div className="px-2 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[11px] flex items-center justify-between">
            <span className="text-slate-400">Clearance:</span>
            <span className="font-mono font-semibold text-indigo-300">{user.role}</span>
          </div>
        )}

        <div className={`p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className="relative shrink-0">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-200 truncate">
                Zero-Persistence Mode
              </div>
              <div className="text-[11px] text-emerald-400/90 truncate">
                Local-only execution
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
