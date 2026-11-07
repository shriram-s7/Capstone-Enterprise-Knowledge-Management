import pytest
import sqlite3
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.config import DB_PATH
from backend.app.database import init_db

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    init_db()

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

# 1. Health Endpoint Test
def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"
    assert data["policies_count"] >= 12
    assert data["audit_blocks_count"] >= 5

# 2. Knowledge Assistant Tests (Retrieval and Refusal)
def test_knowledge_retrieval_supported_query(client):
    response = client.post("/api/knowledge/ask", json={
        "query": "What is our remote work home office stipend?",
        "category": "All"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["isRefusal"] is False
    assert "$800" in data["answer"] or "Remote-First" in data["answer"]
    assert len(data["citations"]) > 0
    assert data["citations"][0]["policyId"] in ("POL-HR-001", "POL-SEC-001")
    assert "relevanceScore" in data["citations"][0]

def test_knowledge_retrieval_refusal_unsupported_query(client):
    # Query something completely unsupported by FinNova policies
    response = client.post("/api/knowledge/ask", json={
        "query": "What is our cryptocurrency trading bonus and token reward policy?",
        "category": "All"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["isRefusal"] is True
    assert data["confidence"] == "Insufficient Evidence"
    assert "Insufficient Documentary Evidence" in data["answer"]
    assert len(data["citations"]) == 0  # Crucial: Never fabricates citations!

# 3. Question Shield Tests (PII Masking & Zero Unmasked Persistence)
def test_privacy_sanitize_masks_pii(client):
    raw_query = "Hello, I am David Kim (FN-88210). Please send my reimbursement to david.kim@finnova.internal or call +1 (555) 392-8192."
    response = client.post("/api/privacy/sanitize", json={"text": raw_query})
    assert response.status_code == 200
    data = response.json()

    sanitized = data["sanitizedText"]
    # Verify raw identifiers are masked
    assert "David Kim" not in sanitized
    assert "FN-88210" not in sanitized
    assert "david.kim@finnova.internal" not in sanitized
    assert "555" not in sanitized

    # Verify replacement tokens are present
    assert "[PERSON_" in sanitized
    assert "[EMPLOYEE_ID_" in sanitized
    assert "[EMAIL_" in sanitized
    assert "[PHONE_" in sanitized

    # Verify cryptographic privacy receipt
    receipt = data["receipt"]
    assert receipt["piiRetentionGuaranteed"] is True
    assert len(receipt["sanitizedHash"]) == 64  # SHA-256 length
    assert receipt["entitiesDetectedCount"] >= 4

def test_unmasked_question_is_never_persisted(client):
    secret_marker = "VERY_SECRET_RAW_PII_TOKEN_XYZ_9999"
    raw_text = f"My name is {secret_marker} and my email is test999@finnova.internal."
    client.post("/api/privacy/sanitize", json={"text": raw_text})

    # Query SQLite directly to verify the raw secret marker was NEVER saved
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT summary, metadata_payload_json FROM audit_ledger;")
    rows = cursor.fetchall()
    conn.close()

    for summary, meta in rows:
        assert secret_marker not in summary, "Raw unmasked PII was found in audit summary!"
        assert secret_marker not in meta, "Raw unmasked PII was found in audit metadata!"

# 4. Policy Conflict Resolver Tests
def test_get_policies(client):
    response = client.get("/api/policies")
    assert response.status_code == 200
    policies = response.json()
    assert len(policies) >= 12
    ids = [p["id"] for p in policies]
    assert "POL-HR-001" in ids
    assert "POL-SEC-001" in ids
    assert "POL-FIN-001" in ids

def test_analyze_conflict_precedence(client):
    # Test CONF-001: Travel Subsistence ($100) vs Expense Meal Cap ($75)
    response = client.post("/api/policies/analyze-conflict", json={"conflictId": "CONF-001"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Analyzed"
    assert data["conflict"]["id"] == "CONF-001"
    assert data["precedenceEstablished"] is True
    assert "Lex specialis" in data["governingPrecedenceRule"]

def test_analyze_conflict_human_review(client):
    # Test CONF-003: 90-Day Slack purge vs 365-Day Incident war-room archiving
    response = client.post("/api/policies/analyze-conflict", json={"conflictId": "CONF-003"})
    assert response.status_code == 200
    data = response.json()
    assert data["conflict"]["id"] == "CONF-003"
    assert data["precedenceEstablished"] is False
    assert data["conflict"]["resolutionStatus"] == "Requires Human Review"

# 5. Privacy Center & Audit Hash Chain Verification Tests
def test_audit_chain_verification_and_tamper_detection(client):
    # Step A: Ensure genuine baseline passes verification
    client.post("/api/audit/restore")
    verify_res = client.post("/api/audit/verify")
    assert verify_res.status_code == 200
    v_data = verify_res.json()
    assert v_data["isValid"] is True
    assert v_data["totalBlocksVerified"] >= 5

    # Step B: Tamper with Block #3 in SQLite without updating cryptographic hashes
    tamper_res = client.post("/api/audit/tamper", json={
        "blockNumber": 3,
        "tamperedSummary": "TAMPER ATTACK: Modified unauthorized payload"
    })
    assert tamper_res.status_code == 200

    # Step C: Re-verify ledger — must fail and catch block 3
    tampered_verify = client.post("/api/audit/verify")
    assert tampered_verify.status_code == 200
    tv_data = tampered_verify.json()
    assert tv_data["isValid"] is False
    assert tv_data["corruptedBlockNumber"] == 3
    assert "Tampering" in tv_data["failureReason"] or "Broken" in tv_data["failureReason"]

    # Step D: Restore and re-verify
    restore_res = client.post("/api/audit/restore")
    assert restore_res.status_code == 200
    final_verify = client.post("/api/audit/verify")
    assert final_verify.status_code == 200
    assert final_verify.json()["isValid"] is True
