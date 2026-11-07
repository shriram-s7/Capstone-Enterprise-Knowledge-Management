import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { KnowledgeAssistantPage } from './pages/KnowledgeAssistantPage';
import { QuestionShieldPage } from './pages/QuestionShieldPage';
import { ConflictResolverPage } from './pages/ConflictResolverPage';
import { RuleRealityCheckPage } from './pages/RuleRealityCheckPage';
import { AskWhyPage } from './pages/AskWhyPage';
import { TimeTravelPage } from './pages/TimeTravelPage';
import { PrivacyCenterPage } from './pages/PrivacyCenterPage';
import { SettingsPage } from './pages/SettingsPage';
import { UnifiedIntelligencePage } from './pages/UnifiedIntelligencePage';

export function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Authentication Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Enterprise Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route
                path="/unified-intelligence"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'EMPLOYEE', 'AUDITOR']}>
                    <UnifiedIntelligencePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/knowledge"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'EMPLOYEE', 'AUDITOR']}>
                    <KnowledgeAssistantPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shield"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'EMPLOYEE']}>
                    <QuestionShieldPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/conflicts"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'AUDITOR']}>
                    <ConflictResolverPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reality-check"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER']}>
                    <RuleRealityCheckPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ask-why"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'MANAGER', 'AUDITOR']}>
                    <AskWhyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/time-travel"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXECUTIVE', 'DEPARTMENT_HEAD', 'AUDITOR']}>
                    <TimeTravelPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/privacy"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXECUTIVE', 'AUDITOR']}>
                    <PrivacyCenterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'EXECUTIVE']}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
