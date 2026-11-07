import { AuditBlock } from '../types';
import { createChainedBlock } from '../services/auditService';

interface SeedBlockDraft {
  eventType: AuditBlock['eventType'];
  actorId: string;
  actorRole: string;
  summary: string;
  metadataPayload: Record<string, string | number | boolean>;
}

export const SEED_AUDIT_DRAFTS: SeedBlockDraft[] = [
  {
    eventType: 'PII_SHIELD_APPLIED',
    actorId: 'SVC-QUESTION-SHIELD-01',
    actorRole: 'Automated Privacy Gateway',
    summary: 'Detected and masked 2 PII entities (Email, Employee ID) in executive inquiry',
    metadataPayload: {
      sanitizedTokensCount: 2,
      riskLevel: 'Elevated',
      processingTimeMs: 14,
      algorithm: 'Client-Side Regex + Named Dictionary'
    }
  },
  {
    eventType: 'POLICY_SUPERSEDED',
    actorId: 'EXEC-CISO-TARIQ',
    actorRole: 'Chief Information Security Officer',
    summary: 'Activated POL-SEC-001 v3.0 (Zero Trust Always-On VPN) superseding v2.0',
    metadataPayload: {
      policyId: 'POL-SEC-001',
      oldVersion: 'v2.0',
      newVersion: 'v3.0',
      boardResolutionId: 'RES-2024-INF-09'
    }
  },
  {
    eventType: 'POLICY_ACCESS',
    actorId: 'USR-DEV-0881',
    actorRole: 'Senior Staff Engineer',
    summary: 'Retrieved POL-HR-001 v2.0 Clause 2.2 for remote broadband reimbursement check',
    metadataPayload: {
      policyId: 'POL-HR-001',
      version: 'v2.0',
      retrievalLatencyMs: 8,
      queryMatchScore: 0.94
    }
  },
  {
    eventType: 'QUESTION_SANITIZATION',
    actorId: 'SVC-QUESTION-SHIELD-01',
    actorRole: 'Automated Privacy Gateway',
    summary: 'Question sanitized before local retrieval: Personal names replaced with [PERSON_1]',
    metadataPayload: {
      tokensReplaced: 1,
      targetEntity: 'NAME',
      zeroRetentionConfirmed: true
    }
  },
  {
    eventType: 'DECISION_EVALUATION',
    actorId: 'EXEC-GC-ARTHUR',
    actorRole: 'General Counsel',
    summary: 'Recorded DEC-2024-167: Statutory retention deferral for cross-border EBA inquiry',
    metadataPayload: {
      decisionId: 'DEC-2024-167',
      custodiansProtected: 18,
      litigationHoldActive: true
    }
  },
  {
    eventType: 'COMPLIANCE_DRIFT_ALERT',
    actorId: 'SVC-REALITY-CHECK-DAEMON',
    actorRole: 'Continuous Policy Compliance Monitor',
    summary: 'Triggered Moderate Drift warning on POL-SEC-002 JIT access revocation compliance (88% vs 100% target)',
    metadataPayload: {
      policyId: 'POL-SEC-002',
      department: 'Engineering & Product',
      cohortSize: 26,
      currentComplianceRate: 88
    }
  },
  {
    eventType: 'PII_SHIELD_APPLIED',
    actorId: 'SVC-QUESTION-SHIELD-01',
    actorRole: 'Automated Privacy Gateway',
    summary: 'Masked corporate credit card pattern in travel reimbursement inquiry',
    metadataPayload: {
      maskedType: 'FINANCIAL',
      sanitizedTokensCount: 1,
      retentionVerified: 'Zero-Persistence'
    }
  },
  {
    eventType: 'POLICY_ACCESS',
    actorId: 'USR-FIN-0342',
    actorRole: 'Senior Accounts Payable Analyst',
    summary: 'Queried POL-FIN-003 v2.1 travel subsistence guidelines for overseas delegation',
    metadataPayload: {
      policyId: 'POL-FIN-003',
      version: 'v2.1',
      clauseCited: '3.1'
    }
  }
];

// Helper to generate a valid, cryptographically linked seed ledger
export async function generateInitialLedger(): Promise<AuditBlock[]> {
  const chain: AuditBlock[] = [];
  
  // Genesis Block
  const genesis = await createChainedBlock(
    chain,
    'POLICY_ACCESS',
    'SYSTEM-GENESIS',
    'Root Security Anchor',
    'FinNova Cryptographic Audit Ledger Initialized (Web Crypto SHA-256 Chain)',
    {
      engineVersion: '2.4.0',
      securityStandard: 'FIPS 180-4 SHA-256',
      environment: 'Demonstration Prototype'
    }
  );
  chain.push(genesis);

  // Subsequent Blocks
  for (const draft of SEED_AUDIT_DRAFTS) {
    const block = await createChainedBlock(
      chain,
      draft.eventType,
      draft.actorId,
      draft.actorRole,
      draft.summary,
      draft.metadataPayload
    );
    chain.push(block);
  }

  return chain;
}
