import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { SearchPaletteModal } from './SearchPaletteModal';
import { DocumentViewerModal } from '../shared/DocumentViewerModal';
import { ToastContainer } from '../shared/Toast';

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Top Bar */}
      <TopNavbar sidebarCollapsed={sidebarCollapsed} />

      {/* Main Content Area */}
      <main
        className={`flex-1 pt-16 transition-all duration-300 ${
          sidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        <div className="max-w-7xl mx-auto p-6 sm:p-8">
          <Outlet />
        </div>
      </main>

      {/* Global Modals & Notifications */}
      <SearchPaletteModal />
      <DocumentViewerModal />
      <ToastContainer />
    </div>
  );
};
