from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# Health Schema
class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
    database: str
    policies_count: int
    audit_blocks_count: int

# Knowledge Assistant Schemas
class KnowledgeAskRequest(BaseModel):
    query: str
    category: Optional[str] = "All"

class Citation(BaseModel):
    policyId: str
    policyTitle: str
    version: str
    effectiveDate: str
    clauseNumber: str
    clauseTitle: str
    relevanceScore: int
    matchedText: str

class KnowledgeAskResponse(BaseModel):
    answer: str
    citations: List[Citation]
    isRefusal: bool
    confidence: str

# Question Shield Schemas
class SanitizeRequest(BaseModel):
    text: str

class DetectedEntitySchema(BaseModel):
    type: str
    value: str
    replacement: str
    startIndex: int
    endIndex: int
    confidence: float

class PrivacyReceiptSchema(BaseModel):
    receiptId: str
    timestamp: str
    originalCharLength: int
    sanitizedCharLength: int
    entitiesDetectedCount: int
    detectedCategories: List[str]
    sanitizedHash: str
    piiRetentionGuaranteed: bool
    sanitizedPreview: str

class SanitizeResponse(BaseModel):
    sanitizedText: str
    receipt: PrivacyReceiptSchema
    detectedEntities: List[DetectedEntitySchema]

# Policy & Conflict Schemas
class PolicyClause(BaseModel):
    clauseNumber: str
    title: str
    text: str

class PolicyVersionSchema(BaseModel):
    version: str
    effectiveDate: str
    supersedesVersion: Optional[str] = None
    approvedBy: str
    approverRole: str
    summary: str
    fullContent: str
    keyClauses: List[PolicyClause]
    changelogNotes: str

class PolicySchema(BaseModel):
    id: str
    title: str
    category: str
    ownerDepartment: str
    currentVersion: str
    lastReviewedDate: str
    nextReviewDate: str
    status: str
    scope: str
    tags: List[str]
    versions: List[PolicyVersionSchema]

class PolicyClauseCitation(BaseModel):
    id: str
    version: str
    clauseNumber: str
    statement: str

class PolicyConflictSchema(BaseModel):
    id: str
    title: str
    severity: str
    policyA: PolicyClauseCitation
    policyB: PolicyClauseCitation
    conflictDescription: str
    resolutionStatus: str
    precedenceRule: Optional[str] = None
    recommendedAction: str
    affectedDepartments: List[str]

class ConflictAnalyzeRequest(BaseModel):
    conflictId: Optional[str] = None
    policyAId: Optional[str] = None
    policyBId: Optional[str] = None

# Audit Ledger Schemas
class AuditBlockSchema(BaseModel):
    blockNumber: int
    timestamp: str
    eventType: str
    actorId: str
    actorRole: str
    summary: str
    metadataPayload: Dict[str, Any]
    previousHash: str
    hash: str

class AuditVerifyResponse(BaseModel):
    isValid: bool
    totalBlocksVerified: int
    corruptedBlockNumber: Optional[int] = None
    expectedHash: Optional[str] = None
    actualHash: Optional[str] = None
    failureReason: Optional[str] = None
    verificationTimestamp: str

class AuditTamperRequest(BaseModel):
    blockNumber: Optional[int] = 3
    tamperedSummary: Optional[str] = "UNAUTHORIZED MUTATION: Altered access log to bypass CISO review."
