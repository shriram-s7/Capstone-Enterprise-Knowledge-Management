import sqlite3
import json
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from backend.app.config import DB_PATH
from backend.app.seed_data import (
    SYNTHETIC_POLICIES,
    SYNTHETIC_CONFLICTS,
    SYNTHETIC_DECISIONS,
    SYNTHETIC_PRACTICES,
    SEED_AUDIT_DRAFTS
)
from backend.app.services.audit_service import (
    GENESIS_PREV_HASH,
    create_block_hash
)

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS policies (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        owner_department TEXT NOT NULL,
        current_version TEXT NOT NULL,
        last_reviewed_date TEXT NOT NULL,
        next_review_date TEXT NOT NULL,
        status TEXT NOT NULL,
        scope TEXT NOT NULL,
        tags_json TEXT NOT NULL,
        versions_json TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS conflicts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        severity TEXT NOT NULL,
        policy_a_json TEXT NOT NULL,
        policy_b_json TEXT NOT NULL,
        conflict_description TEXT NOT NULL,
        resolution_status TEXT NOT NULL,
        precedence_rule TEXT,
        recommended_action TEXT NOT NULL,
        affected_departments_json TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        date TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        owner_role TEXT NOT NULL,
        status TEXT NOT NULL,
        business_context TEXT NOT NULL,
        decision_summary TEXT NOT NULL,
        relevant_policies_json TEXT NOT NULL,
        supporting_evidence_json TEXT NOT NULL,
        rationale TEXT NOT NULL,
        impact_metrics_json TEXT NOT NULL,
        related_decisions_json TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS practices (
        id TEXT PRIMARY KEY,
        department TEXT NOT NULL,
        policy_id TEXT NOT NULL,
        policy_name TEXT NOT NULL,
        metric_name TEXT NOT NULL,
        target_compliance_rate REAL NOT NULL,
        actual_compliance_rate REAL NOT NULL,
        period TEXT NOT NULL,
        observed_count INTEGER NOT NULL,
        sample_person_count INTEGER NOT NULL,
        drift_status TEXT NOT NULL,
        primary_root_cause TEXT NOT NULL,
        recommended_remediation TEXT NOT NULL,
        historical_trend_json TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_ledger (
        block_number INTEGER PRIMARY KEY,
        timestamp TEXT NOT NULL,
        event_type TEXT NOT NULL,
        actor_id TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        summary TEXT NOT NULL,
        metadata_payload_json TEXT NOT NULL,
        previous_hash TEXT NOT NULL,
        hash TEXT NOT NULL
    );
    """)

    conn.commit()

    # Seed policies if empty
    cursor.execute("SELECT COUNT(*) FROM policies;")
    if cursor.fetchone()[0] == 0:
        for p in SYNTHETIC_POLICIES:
            cursor.execute("""
            INSERT INTO policies (id, title, category, owner_department, current_version, last_reviewed_date, next_review_date, status, scope, tags_json, versions_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["id"], p["title"], p["category"], p["ownerDepartment"], p["currentVersion"],
                p["lastReviewedDate"], p["nextReviewDate"], p["status"], p["scope"],
                json.dumps(p["tags"]), json.dumps(p["versions"])
            ))

    # Seed conflicts if empty
    cursor.execute("SELECT COUNT(*) FROM conflicts;")
    if cursor.fetchone()[0] == 0:
        for c in SYNTHETIC_CONFLICTS:
            cursor.execute("""
            INSERT INTO conflicts (id, title, severity, policy_a_json, policy_b_json, conflict_description, resolution_status, precedence_rule, recommended_action, affected_departments_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                c["id"], c["title"], c["severity"], json.dumps(c["policyA"]), json.dumps(c["policyB"]),
                c["conflictDescription"], c["resolutionStatus"], c.get("precedenceRule"), c["recommendedAction"],
                json.dumps(c["affectedDepartments"])
            ))

    # Seed decisions if empty
    cursor.execute("SELECT COUNT(*) FROM decisions;")
    if cursor.fetchone()[0] == 0:
        for d in SYNTHETIC_DECISIONS:
            cursor.execute("""
            INSERT INTO decisions (id, title, department, date, owner_name, owner_role, status, business_context, decision_summary, relevant_policies_json, supporting_evidence_json, rationale, impact_metrics_json, related_decisions_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                d["id"], d["title"], d["department"], d["date"], d["ownerName"], d["ownerRole"],
                d["status"], d["businessContext"], d["decisionSummary"], json.dumps(d["relevantPolicyIds"]),
                json.dumps(d["supportingEvidence"]), d["rationale"], json.dumps(d["impactMetrics"]),
                json.dumps(d.get("relatedDecisionIds", []))
            ))

    # Seed practices if empty
    cursor.execute("SELECT COUNT(*) FROM practices;")
    if cursor.fetchone()[0] == 0:
        for pr in SYNTHETIC_PRACTICES:
            cursor.execute("""
            INSERT INTO practices (id, department, policy_id, policy_name, metric_name, target_compliance_rate, actual_compliance_rate, period, observed_count, sample_person_count, drift_status, primary_root_cause, recommended_remediation, historical_trend_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                pr["id"], pr["department"], pr["policyId"], pr["policyName"], pr["metricName"],
                pr["targetComplianceRate"], pr["actualComplianceRate"], pr["period"], pr["observedCount"],
                pr["samplePersonCount"], pr["driftStatus"], pr["primaryRootCause"], pr["recommendedRemediation"],
                json.dumps(pr["historicalTrend"])
            ))

    # Seed audit ledger if empty
    cursor.execute("SELECT COUNT(*) FROM audit_ledger;")
    if cursor.fetchone()[0] == 0:
        seed_ledger(conn)

    conn.commit()
    conn.close()

    # Initialize authentication & organizational hierarchy tables and seed demo accounts
    from backend.app.auth.service import init_auth_tables
    init_auth_tables()

def seed_ledger(conn):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM audit_ledger;")

    prev_hash = GENESIS_PREV_HASH
    for i, draft in enumerate(SEED_AUDIT_DRAFTS):
        timestamp = f"2024-03-01T{10+i:02d}:00:00Z"
        curr_hash = create_block_hash(
            i, timestamp, draft["eventType"], draft["actorId"], draft["actorRole"],
            draft["summary"], draft["metadataPayload"], prev_hash
        )
        cursor.execute("""
        INSERT INTO audit_ledger (block_number, timestamp, event_type, actor_id, actor_role, summary, metadata_payload_json, previous_hash, hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            i, timestamp, draft["eventType"], draft["actorId"], draft["actorRole"],
            draft["summary"], json.dumps(draft["metadataPayload"]), prev_hash, curr_hash
        ))
        prev_hash = curr_hash

def get_all_policies_db() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM policies;")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "title": r["title"],
            "category": r["category"],
            "ownerDepartment": r["owner_department"],
            "currentVersion": r["current_version"],
            "lastReviewedDate": r["last_reviewed_date"],
            "nextReviewDate": r["next_review_date"],
            "status": r["status"],
            "scope": r["scope"],
            "tags": json.loads(r["tags_json"]),
            "versions": json.loads(r["versions_json"])
        })
    return result

def get_policy_by_id_db(policy_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM policies WHERE id = ?;", (policy_id,))
    r = cursor.fetchone()
    conn.close()
    if not r:
        return None
    return {
        "id": r["id"],
        "title": r["title"],
        "category": r["category"],
        "ownerDepartment": r["owner_department"],
        "currentVersion": r["current_version"],
        "lastReviewedDate": r["last_reviewed_date"],
        "nextReviewDate": r["next_review_date"],
        "status": r["status"],
        "scope": r["scope"],
        "tags": json.loads(r["tags_json"]),
        "versions": json.loads(r["versions_json"])
    }

def get_all_conflicts_db() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM conflicts;")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "title": r["title"],
            "severity": r["severity"],
            "policyA": json.loads(r["policy_a_json"]),
            "policyB": json.loads(r["policy_b_json"]),
            "conflictDescription": r["conflict_description"],
            "resolutionStatus": r["resolution_status"],
            "precedenceRule": r["precedence_rule"],
            "recommendedAction": r["recommended_action"],
            "affectedDepartments": json.loads(r["affected_departments_json"])
        })
    return result

def get_all_decisions_db() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM decisions;")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "title": r["title"],
            "department": r["department"],
            "date": r["date"],
            "ownerName": r["owner_name"],
            "ownerRole": r["owner_role"],
            "status": r["status"],
            "businessContext": r["business_context"],
            "decisionSummary": r["decision_summary"],
            "relevantPolicyIds": json.loads(r["relevant_policies_json"]),
            "supportingEvidence": json.loads(r["supporting_evidence_json"]),
            "rationale": r["rationale"],
            "impactMetrics": json.loads(r["impact_metrics_json"]),
            "relatedDecisionIds": json.loads(r["related_decisions_json"])
        })
    return result

def get_all_practices_db() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM practices;")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "department": r["department"],
            "policyId": r["policy_id"],
            "policyName": r["policy_name"],
            "metricName": r["metric_name"],
            "targetComplianceRate": r["target_compliance_rate"],
            "actualComplianceRate": r["actual_compliance_rate"],
            "period": r["period"],
            "observedCount": r["observed_count"],
            "samplePersonCount": r["sample_person_count"],
            "driftStatus": r["drift_status"],
            "primaryRootCause": r["primary_root_cause"],
            "recommendedRemediation": r["recommended_remediation"],
            "historicalTrend": json.loads(r["historical_trend_json"])
        })
    return result

def get_audit_ledger_db() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_ledger ORDER BY block_number ASC;")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "blockNumber": r["block_number"],
            "timestamp": r["timestamp"],
            "eventType": r["event_type"],
            "actorId": r["actor_id"],
            "actorRole": r["actor_role"],
            "summary": r["summary"],
            "metadataPayload": json.loads(r["metadata_payload_json"]),
            "previousHash": r["previous_hash"],
            "hash": r["hash"]
        })
    return result

def append_audit_block_db(
    event_type: str,
    actor_id: str,
    actor_role: str,
    summary: str,
    metadata_payload: Dict[str, Any]
) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT block_number, hash FROM audit_ledger ORDER BY block_number DESC LIMIT 1;")
    last_row = cursor.fetchone()

    if last_row:
        block_number = last_row["block_number"] + 1
        previous_hash = last_row["hash"]
    else:
        block_number = 0
        previous_hash = GENESIS_PREV_HASH

    timestamp = datetime.now(timezone.utc).isoformat()
    curr_hash = create_block_hash(
        block_number, timestamp, event_type, actor_id, actor_role, summary, metadata_payload, previous_hash
    )

    cursor.execute("""
    INSERT INTO audit_ledger (block_number, timestamp, event_type, actor_id, actor_role, summary, metadata_payload_json, previous_hash, hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        block_number, timestamp, event_type, actor_id, actor_role, summary,
        json.dumps(metadata_payload), previous_hash, curr_hash
    ))
    conn.commit()
    conn.close()

    return {
        "blockNumber": block_number,
        "timestamp": timestamp,
        "eventType": event_type,
        "actorId": actor_id,
        "actorRole": actor_role,
        "summary": summary,
        "metadataPayload": metadata_payload,
        "previousHash": previous_hash,
        "hash": curr_hash
    }

def tamper_audit_block_db(block_number: int, new_summary: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE audit_ledger
    SET summary = ?, actor_id = 'MALICIOUS-ACTOR-MUTATION'
    WHERE block_number = ?;
    """, (new_summary, block_number))
    updated = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return updated

def restore_audit_ledger_db():
    conn = get_connection()
    seed_ledger(conn)
    conn.commit()
    conn.close()
