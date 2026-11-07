import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuditBlock, PolicyDocument } from '../types';
import { generateInitialLedger } from '../data/auditEvents';
import { verifyLedgerChain, VerificationResult, createChainedBlock } from '../services/auditService';
import { SYNTHETIC_POLICIES } from '../data/policies';
import {
  checkBackendHealth,
  fetchAuditLedgerApi,
  verifyAuditLedgerApi,
  tamperAuditLedgerApi,
  restoreAuditLedgerApi
} from '../services/api';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'alert' | 'info' | 'success';
  read: boolean;
  linkPath?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  // Backend status
  isBackendConnected: boolean;
  refreshBackendStatus: () => Promise<void>;
  // Modal / Document Preview
  previewDocument: PolicyDocument | null;
  setPreviewDocument: (doc: PolicyDocument | null) => void;
  previewVersion: string | null;
  setPreviewVersion: (ver: string | null) => void;
  openDocumentById: (policyId: string, version?: string) => void;
  // Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  // Cryptographic Ledger
  ledger: AuditBlock[];
  isLedgerVerifying: boolean;
  verificationResult: VerificationResult | null;
  verifyCurrentLedger: () => Promise<VerificationResult>;
  simulateTamperAttack: () => Promise<void>;
  restoreOriginalLedger: () => Promise<void>;
  logAuditEvent: (
    eventType: AuditBlock['eventType'],
    actorRole: string,
    summary: string,
    metadata: Record<string, string | number | boolean>
  ) => Promise<AuditBlock>;
  // Toasts
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('finnova_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('finnova_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('finnova_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Backend connection status
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const refreshBackendStatus = async () => {
    const health = await checkBackendHealth();
    setIsBackendConnected(!!health);
  };

  useEffect(() => {
    refreshBackendStatus();
    const interval = setInterval(refreshBackendStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Document preview state
  const [previewDocument, setPreviewDocument] = useState<PolicyDocument | null>(null);
  const [previewVersion, setPreviewVersion] = useState<string | null>(null);

  const openDocumentById = (policyId: string, version?: string) => {
    const found = SYNTHETIC_POLICIES.find(p => p.id === policyId);
    if (found) {
      setPreviewDocument(found);
      setPreviewVersion(version || found.currentVersion);
    }
  };

  // Search Palette state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Notifications
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'NOTIF-01',
      title: 'Policy Conflict Detected',
      description: 'Critical conflict between POL-HR-001 (Wi-Fi) and POL-SEC-001 (Zero Trust VPN).',
      timestamp: '15m ago',
      type: 'alert',
      read: false,
      linkPath: '/conflicts'
    },
    {
      id: 'NOTIF-02',
      title: 'Compliance Drift Warning',
      description: 'Sales expense receipt adherence dropped below 80% threshold in Q3.',
      timestamp: '2h ago',
      type: 'alert',
      read: false,
      linkPath: '/reality-check'
    },
    {
      id: 'NOTIF-03',
      title: 'Ledger Hash Verified',
      description: 'Periodic background check verified 9 blocks with 100% cryptographic integrity.',
      timestamp: '5h ago',
      type: 'success',
      read: true,
      linkPath: '/privacy'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };
  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Audit Ledger State
  const [ledger, setLedger] = useState<AuditBlock[]>([]);
  const [isLedgerVerifying, setIsLedgerVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Initialize ledger (attempts backend first, falls back to local seed)
  useEffect(() => {
    const initLedger = async () => {
      try {
        const backendBlocks = await fetchAuditLedgerApi();
        if (backendBlocks && backendBlocks.length > 0) {
          setLedger(backendBlocks);
          const v = await verifyAuditLedgerApi();
          setVerificationResult(v);
          return;
        }
      } catch (e) {
        // Fallback to local
      }

      const initialChain = await generateInitialLedger();
      setLedger(initialChain);
      const res = await verifyLedgerChain(initialChain);
      setVerificationResult(res);
    };

    initLedger();
  }, []);

  const verifyCurrentLedger = async (): Promise<VerificationResult> => {
    setIsLedgerVerifying(true);
    await new Promise(r => setTimeout(r, 300));

    try {
      // First try backend verify
      const backendRes = await verifyAuditLedgerApi();
      setVerificationResult(backendRes);
      // Refresh ledger state from backend
      const blocks = await fetchAuditLedgerApi();
      if (blocks) setLedger(blocks);

      setIsLedgerVerifying(false);
      if (backendRes.isValid) {
        showToast('success', 'Ledger Integrity Verified', `FastAPI backend verified ${backendRes.totalBlocksVerified} blocks against SHA-256 hashes.`);
      } else {
        showToast('error', 'Tamper Detected!', backendRes.failureReason || 'Cryptographic chain corrupted.');
      }
      return backendRes;
    } catch (e) {
      // Local fallback verification
      const res = await verifyLedgerChain(ledger);
      setVerificationResult(res);
      setIsLedgerVerifying(false);
      if (res.isValid) {
        showToast('success', 'Ledger Integrity Verified', `All ${res.totalBlocksVerified} blocks matched cryptographic SHA-256 hashes.`);
      } else {
        showToast('error', 'Tamper Detected!', res.failureReason || 'Cryptographic chain corrupted.');
      }
      return res;
    }
  };

  const simulateTamperAttack = async () => {
    try {
      await tamperAuditLedgerApi(3);
      const blocks = await fetchAuditLedgerApi();
      if (blocks) setLedger(blocks);
      showToast('warning', 'Tamper Injected into Block #3 (SQLite)', 'Database record payload secretly altered. Click "Verify Integrity" to witness backend cryptographic detection.');
      return;
    } catch (e) {
      // Local fallback
    }

    if (ledger.length <= 3) return;
    const tampered = ledger.map(b => {
      if (b.blockNumber === 3) {
        return {
          ...b,
          summary: 'UNAUTHORIZED MUTATION: Altered access log to bypass CISO review.',
          actorId: 'MALICIOUS-ACTOR-INJECTED'
        };
      }
      return b;
    });
    setLedger(tampered);
    showToast('warning', 'Tamper Injected into Block #3', 'Payload has been secretly modified. Click "Verify Ledger" to witness cryptographic detection.');
  };

  const restoreOriginalLedger = async () => {
    try {
      await restoreAuditLedgerApi();
      const blocks = await fetchAuditLedgerApi();
      if (blocks) setLedger(blocks);
      const res = await verifyAuditLedgerApi();
      setVerificationResult(res);
      showToast('success', 'Ledger Restored', 'Cryptographic SQLite ledger restored to genuine state.');
      return;
    } catch (e) {
      // Local fallback
    }

    const restored = await generateInitialLedger();
    setLedger(restored);
    const res = await verifyLedgerChain(restored);
    setVerificationResult(res);
    showToast('success', 'Ledger Restored', 'Cryptographic chain successfully restored to genuine state.');
  };

  const logAuditEvent = async (
    eventType: AuditBlock['eventType'],
    actorRole: string,
    summary: string,
    metadata: Record<string, string | number | boolean>
  ): Promise<AuditBlock> => {
    const actorId = 'SVC-KNOWLEDGE-WORKER-09';
    const newBlock = await createChainedBlock(
      ledger,
      eventType,
      actorId,
      actorRole,
      summary,
      metadata
    );
    setLedger(prev => [...prev, newBlock]);
    return newBlock;
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        isBackendConnected,
        refreshBackendStatus,
        previewDocument,
        setPreviewDocument,
        previewVersion,
        setPreviewVersion,
        openDocumentById,
        isSearchOpen,
        setIsSearchOpen,
        notifications,
        unreadCount,
        markAllNotificationsRead,
        isNotificationsOpen,
        setIsNotificationsOpen,
        ledger,
        isLedgerVerifying,
        verificationResult,
        verifyCurrentLedger,
        simulateTamperAttack,
        restoreOriginalLedger,
        logAuditEvent,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
