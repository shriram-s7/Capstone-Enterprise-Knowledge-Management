/**
 * Centralized API service connecting the FinNova React frontend
 * to the local Python FastAPI backend (with graceful local fallback).
 */

import {
  AuditBlock,
  ChatCitation,
  PolicyCategory,
  PolicyDocument,
  PolicyConflict,
  PrivacyReceipt,
  DetectedEntity
} from '../types';
import { retrieveKnowledge } from './retrievalService';
import { detectAndSanitizeText } from './privacyService';

const BACKEND_BASE = 'http://127.0.0.1:8000';

async function fetchWithFallback<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // First try relative /api (Vite proxy)
  try {
    const res = await fetch(`/api${endpoint}`, options);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Relative failed, try direct BACKEND_BASE
  }

  const res = await fetch(`${BACKEND_BASE}/api${endpoint}`, options);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Error ${res.status}: ${errText}`);
  }
  return await res.json();
}

export interface BackendHealth {
  status: string;
  app: string;
  version: string;
  database: string;
  policies_count: number;
  audit_blocks_count: number;
}

export interface AskKnowledgeResult {
  answer: string;
  citations: ChatCitation[];
  isRefusal: boolean;
  confidence: 'High' | 'Medium' | 'Low' | 'Insufficient Evidence';
  source: 'backend' | 'local_fallback';
}

export interface SanitizeResult {
  originalText?: string;
  sanitizedText: string;
  receipt: PrivacyReceipt;
  detectedEntities: DetectedEntity[];
  source: 'backend' | 'local_fallback';
}

export interface ConflictAnalysisResult {
  status: string;
  conflict: PolicyConflict | null;
  precedenceEstablished: boolean;
  governingPrecedenceRule?: string;
  recommendedAction: string;
}

export interface VerificationResultPayload {
  isValid: boolean;
  totalBlocksVerified: number;
  corruptedBlockNumber?: number;
  expectedHash?: string;
  actualHash?: string;
  failureReason?: string;
  verificationTimestamp: string;
}

// 1. Backend Health Check
export async function checkBackendHealth(): Promise<BackendHealth | null> {
  try {
    return await fetchWithFallback<BackendHealth>('/health', { method: 'GET' });
  } catch (err) {
    return null;
  }
}

// 2. Knowledge Assistant API
export async function askKnowledgeApi(
  query: string,
  category: PolicyCategory | 'All' = 'All'
): Promise<AskKnowledgeResult> {
  try {
    const data = await fetchWithFallback<{
      answer: string;
      citations: ChatCitation[];
      isRefusal: boolean;
      confidence: 'High' | 'Medium' | 'Low' | 'Insufficient Evidence';
    }>('/knowledge/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, category })
    });
    return { ...data, source: 'backend' };
  } catch (err) {
    // Local fallback
    const local = retrieveKnowledge(query, category);
    return { ...local, source: 'local_fallback' };
  }
}

// 3. Question Shield API
export async function sanitizePrivacyApi(text: string): Promise<SanitizeResult> {
  try {
    const data = await fetchWithFallback<{
      sanitizedText: string;
      receipt: PrivacyReceipt;
      detectedEntities: DetectedEntity[];
    }>('/privacy/sanitize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return { ...data, source: 'backend' };
  } catch (err) {
    // Local fallback
    const local = await detectAndSanitizeText(text);
    return {
      sanitizedText: local.sanitizedText,
      receipt: local.receipt,
      detectedEntities: local.detectedEntities,
      source: 'local_fallback'
    };
  }
}

// 4. Policy Conflict Resolver API
export async function analyzeConflictApi(
  conflictId?: string,
  policyAId?: string,
  policyBId?: string
): Promise<ConflictAnalysisResult> {
  return await fetchWithFallback<ConflictAnalysisResult>('/policies/analyze-conflict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conflictId, policyAId, policyBId })
  });
}

export async function fetchPoliciesApi(): Promise<PolicyDocument[]> {
  return await fetchWithFallback<PolicyDocument[]>('/policies', { method: 'GET' });
}

export async function fetchConflictsApi(): Promise<PolicyConflict[]> {
  return await fetchWithFallback<PolicyConflict[]>('/conflicts', { method: 'GET' });
}

// 5. Privacy Center & Cryptographic Ledger API
export async function fetchAuditLedgerApi(): Promise<AuditBlock[]> {
  return await fetchWithFallback<AuditBlock[]>('/audit/ledger', { method: 'GET' });
}

export async function verifyAuditLedgerApi(): Promise<VerificationResultPayload> {
  return await fetchWithFallback<VerificationResultPayload>('/audit/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function tamperAuditLedgerApi(
  blockNumber: number = 3,
  summary: string = 'UNAUTHORIZED MUTATION: Altered access log to bypass CISO review.'
): Promise<{ status: string; blockNumber: number; message: string }> {
  return await fetchWithFallback<{ status: string; blockNumber: number; message: string }>('/audit/tamper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blockNumber, tamperedSummary: summary })
  });
}

export async function restoreAuditLedgerApi(): Promise<{ status: string; message: string }> {
  return await fetchWithFallback<{ status: string; message: string }>('/audit/restore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
}
