export type PolicyCategory = 'HR & People' | 'Security & Infosec' | 'Finance & Travel' | 'Legal & Compliance';

export interface PolicyVersion {
  version: string;
  effectiveDate: string; // ISO date 'YYYY-MM-DD'
  supersedesVersion?: string;
  approvedBy: string;
  approverRole: string;
  summary: string;
  fullContent: string;
  keyClauses: {
    clauseNumber: string;
    title: string;
    text: string;
  }[];
  changelogNotes: string;
}

export interface PolicyDocument {
  id: string; // e.g. POL-HR-001
  title: string;
  category: PolicyCategory;
  ownerDepartment: string;
  currentVersion: string;
  lastReviewedDate: string;
  nextReviewDate: string;
  status: 'Active' | 'Under Review' | 'Deprecated';
  scope: string;
  versions: PolicyVersion[];
  tags: string[];
}

export interface PolicyConflict {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  policyA: {
    id: string;
    version: string;
    clauseNumber: string;
    statement: string;
  };
  policyB: {
    id: string;
    version: string;
    clauseNumber: string;
    statement: string;
  };
  conflictDescription: string;
  resolutionStatus: 'Resolved By Precedence' | 'Requires Human Review';
  precedenceRule?: string;
  recommendedAction: string;
  affectedDepartments: string[];
}

export interface DecisionRecord {
  id: string; // e.g. DEC-2024-089
  title: string;
  department: string;
  date: string;
  ownerName: string;
  ownerRole: string;
  status: 'Approved' | 'Executed' | 'Conditional' | 'Under Review';
  businessContext: string;
  decisionSummary: string;
  relevantPolicyIds: {
    policyId: string;
    versionUsed: string;
    clauseCited: string;
  }[];
  supportingEvidence: {
    id: string;
    type: 'Metric Data' | 'Audit Finding' | 'Legal Review' | 'Cost-Benefit Model';
    title: string;
    summary: string;
    sourceDocument?: string;
  }[];
  rationale: string;
  impactMetrics: {
    metricName: string;
    value: string;
    change: string;
  }[];
  relatedDecisionIds?: string[];
}

export interface PracticeRecord {
  id: string;
  department: string;
  policyId: string;
  policyName: string;
  metricName: string;
  targetComplianceRate: number; // percentage, e.g. 95
  actualComplianceRate: number; // percentage, e.g. 82
  period: string; // '2024-Q1', '2024-Q2', etc.
  observedCount: number;
  samplePersonCount: number; // For k-anonymity check (must be >= 5)
  driftStatus: 'Normal' | 'Moderate Drift' | 'Severe Drift';
  primaryRootCause: string;
  recommendedRemediation: string;
  historicalTrend: {
    month: string;
    target: number;
    actual: number;
  }[];
}

export interface DetectedEntity {
  type: 'EMAIL' | 'PHONE' | 'EMPLOYEE_ID' | 'NAME' | 'NATIONAL_ID' | 'FINANCIAL';
  value: string;
  replacement: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
}

export interface PrivacyReceipt {
  receiptId: string;
  timestamp: string;
  originalCharLength: number;
  sanitizedCharLength: number;
  entitiesDetectedCount: number;
  detectedCategories: string[];
  sanitizedHash: string; // SHA-256 of sanitized text
  piiRetentionGuaranteed: boolean;
  sanitizedPreview: string;
}

export interface AuditBlock {
  blockNumber: number;
  timestamp: string;
  eventType: 'QUESTION_SANITIZATION' | 'POLICY_ACCESS' | 'DECISION_EVALUATION' | 'PII_SHIELD_APPLIED' | 'COMPLIANCE_DRIFT_ALERT' | 'POLICY_SUPERSEDED';
  actorId: string; // Synthetic ID e.g. "SVC-KNOWLEDGE-WORKER-09"
  actorRole: string;
  summary: string;
  metadataPayload: Record<string, string | number | boolean>;
  previousHash: string;
  hash: string;
}

export interface ChatCitation {
  policyId: string;
  policyTitle: string;
  version: string;
  effectiveDate: string;
  clauseNumber: string;
  clauseTitle: string;
  relevanceScore: number;
  matchedText: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: ChatCitation[];
  isRefusal?: boolean;
  confidence?: 'High' | 'Medium' | 'Low' | 'Insufficient Evidence';
  sanitizationApplied?: boolean;
  receiptId?: string;
}
