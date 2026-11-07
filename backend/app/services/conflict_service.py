from typing import Dict, Any, List, Optional
from backend.app.database import get_all_conflicts_db, append_audit_block_db

def get_conflicts() -> List[Dict[str, Any]]:
    return get_all_conflicts_db()

def analyze_policy_conflict(
    conflict_id: Optional[str] = None,
    policy_a_id: Optional[str] = None,
    policy_b_id: Optional[str] = None
) -> Dict[str, Any]:
    conflicts = get_all_conflicts_db()
    matched = None

    if conflict_id:
        for c in conflicts:
            if c["id"] == conflict_id:
                matched = c
                break

    if not matched and policy_a_id and policy_b_id:
        p_a = policy_a_id.upper()
        p_b = policy_b_id.upper()
        for c in conflicts:
            c_a = c["policyA"]["id"].upper()
            c_b = c["policyB"]["id"].upper()
            if (c_a == p_a and c_b == p_b) or (c_a == p_b and c_b == p_a):
                matched = c
                break

    if not matched and conflicts:
        matched = conflicts[0]

    if not matched:
        return {
            "status": "No conflict detected",
            "conflict": None,
            "precedenceEstablished": False
        }

    # Record evaluation event in audit ledger
    append_audit_block_db(
        event_type="POLICY_ACCESS",
        actor_id="SVC-CONFLICT-RESOLVER-01",
        actor_role="Governance Engine",
        summary=f"Evaluated policy contradiction: {matched['title']} ({matched['resolutionStatus']})",
        metadata_payload={
            "conflictId": matched["id"],
            "severity": matched["severity"],
            "resolutionStatus": matched["resolutionStatus"]
        }
    )

    return {
        "status": "Analyzed",
        "conflict": matched,
        "precedenceEstablished": matched["resolutionStatus"] == "Resolved By Precedence",
        "governingPrecedenceRule": matched.get("precedenceRule"),
        "recommendedAction": matched["recommendedAction"]
    }
