import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional

from backend.app.config import CORS_ORIGINS
from backend.app.database import (
    init_db,
    get_all_policies_db,
    get_policy_by_id_db,
    get_all_conflicts_db,
    get_all_decisions_db,
    get_all_practices_db,
    get_audit_ledger_db,
    tamper_audit_block_db,
    restore_audit_ledger_db
)
from backend.app.schemas import (
    HealthResponse,
    KnowledgeAskRequest,
    KnowledgeAskResponse,
    SanitizeRequest,
    SanitizeResponse,
    ConflictAnalyzeRequest,
    AuditVerifyResponse,
    AuditTamperRequest
)
from backend.app.services.retrieval_service import retrieve_knowledge_answer
from backend.app.services.privacy_service import sanitize_question
from backend.app.services.conflict_service import analyze_policy_conflict, get_conflicts
from backend.app.services.audit_service import verify_audit_chain

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("finnova")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-initialize SQLite schema and seed synthetic records idempotently
    logger.info("Initializing FinNova SQLite database & cryptographic ledger...")
    init_db()
    logger.info("FinNova database initialized successfully.")
    yield

app = FastAPI(
    title="FinNova Privacy-First Enterprise Knowledge & Decision Intelligence API",
    description="Backend API for local deterministic knowledge retrieval, client-side PII sanitization, policy conflict analysis, and SHA-256 verifiable audit ledger.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication & Organizational Hierarchy Router
from backend.app.auth.routes import router as auth_router
app.include_router(auth_router)

# Unified Enterprise Intelligence Integrations Router
from backend.app.integrations.routes import router as integrations_router
app.include_router(integrations_router)

# 1. Health Endpoint
@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def get_health():
    policies = get_all_policies_db()
    ledger = get_audit_ledger_db()
    return {
        "status": "ok",
        "app": "FinNova Privacy-First Enterprise Knowledge & Decision Intelligence",
        "version": "1.0.0",
        "database": "connected",
        "policies_count": len(policies),
        "audit_blocks_count": len(ledger)
    }

# 2. Knowledge Assistant Endpoint
@app.post("/api/knowledge/ask", response_model=KnowledgeAskResponse, tags=["Knowledge Assistant"])
def ask_knowledge(request: KnowledgeAskRequest):
    result = retrieve_knowledge_answer(request.query, request.category)
    return result

# 3. Question Shield Endpoint (Zero unmasked persistence)
@app.post("/api/privacy/sanitize", response_model=SanitizeResponse, tags=["Question Shield"])
def sanitize_text(request: SanitizeRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="Text payload must not be empty.")
    result = sanitize_question(request.text)
    return result

# 4. Policy Conflict Resolver Endpoints
@app.get("/api/policies", tags=["Policies"])
def list_policies():
    return get_all_policies_db()

@app.get("/api/policies/{policy_id}", tags=["Policies"])
def get_policy(policy_id: str):
    policy = get_policy_by_id_db(policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail=f"Policy {policy_id} not found.")
    return policy

@app.get("/api/conflicts", tags=["Conflict Resolver"])
def list_conflicts():
    return get_conflicts()

@app.post("/api/policies/analyze-conflict", tags=["Conflict Resolver"])
def analyze_conflict(request: ConflictAnalyzeRequest):
    result = analyze_policy_conflict(
        conflict_id=request.conflictId,
        policy_a_id=request.policyAId,
        policy_b_id=request.policyBId
    )
    return result

# 5. Privacy Center & Cryptographic Audit Ledger Endpoints
@app.get("/api/audit/receipts", tags=["Privacy Center"])
@app.get("/api/audit/ledger", tags=["Privacy Center"])
def get_audit_ledger():
    return get_audit_ledger_db()

@app.post("/api/audit/verify", response_model=AuditVerifyResponse, tags=["Privacy Center"])
def verify_ledger():
    ledger = get_audit_ledger_db()
    verification = verify_audit_chain(ledger)
    return verification

@app.post("/api/audit/tamper", tags=["Privacy Center"])
def tamper_ledger(request: Optional[AuditTamperRequest] = None):
    block_num = request.blockNumber if request and request.blockNumber is not None else 3
    summary = request.tamperedSummary if request and request.tamperedSummary else "UNAUTHORIZED MUTATION: Altered log"
    success = tamper_audit_block_db(block_num, summary)
    if not success:
        raise HTTPException(status_code=404, detail=f"Block #{block_num} not found to tamper.")
    return {
        "status": "tampered",
        "blockNumber": block_num,
        "message": f"Block #{block_num} has been modified in SQLite without recomputing hash. Verify ledger to detect."
    }

@app.post("/api/audit/restore", tags=["Privacy Center"])
def restore_ledger():
    restore_audit_ledger_db()
    return {
        "status": "restored",
        "message": "Cryptographic audit ledger has been restored to genuine seed state."
    }

# 6. Additional Read Endpoints
@app.get("/api/decisions", tags=["Decisions"])
def list_decisions():
    return get_all_decisions_db()

@app.get("/api/practices", tags=["Reality Check"])
def list_practices():
    return get_all_practices_db()
