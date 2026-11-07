import hashlib
import json
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple

GENESIS_PREV_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

def serialize_block_for_hashing(
    block_number: int,
    timestamp: str,
    event_type: str,
    actor_id: str,
    actor_role: str,
    summary: str,
    metadata_payload: Dict[str, Any],
    previous_hash: str
) -> str:
    """Constructs canonical string representation for cryptographic SHA-256 calculation."""
    sorted_meta = {k: metadata_payload[k] for k in sorted(metadata_payload.keys())}
    # Compact JSON without spaces for cross-platform deterministic serialization
    meta_json = json.dumps(sorted_meta, separators=(',', ':'), ensure_ascii=False)
    return f"{block_number}|{timestamp}|{event_type}|{actor_id}|{actor_role}|{summary}|{meta_json}|{previous_hash}"

def compute_sha256(canonical_string: str) -> str:
    """Calculates SHA-256 hexadecimal digest using native Python hashlib."""
    return hashlib.sha256(canonical_string.encode('utf-8')).hexdigest()

def create_block_hash(
    block_number: int,
    timestamp: str,
    event_type: str,
    actor_id: str,
    actor_role: str,
    summary: str,
    metadata_payload: Dict[str, Any],
    previous_hash: str
) -> str:
    canonical = serialize_block_for_hashing(
        block_number, timestamp, event_type, actor_id, actor_role, summary, metadata_payload, previous_hash
    )
    return compute_sha256(canonical)

def verify_audit_chain(blocks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Recalculates cryptographic hashes for all blocks in sequence.
    Verifies hash chaining and payload integrity.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    if not blocks:
        return {
            "isValid": True,
            "totalBlocksVerified": 0,
            "verificationTimestamp": now_iso
        }

    for i, block in enumerate(blocks):
        b_num = block["blockNumber"]
        prev_hash = block["previousHash"]
        curr_hash = block["hash"]

        # Link verification
        if i == 0:
            if prev_hash != GENESIS_PREV_HASH:
                return {
                    "isValid": False,
                    "totalBlocksVerified": i,
                    "corruptedBlockNumber": b_num,
                    "expectedHash": GENESIS_PREV_HASH,
                    "actualHash": prev_hash,
                    "failureReason": f"Genesis block previousHash must be 64 zeroes. Found: {prev_hash}",
                    "verificationTimestamp": now_iso
                }
        else:
            prev_block = blocks[i - 1]
            if prev_hash != prev_block["hash"]:
                return {
                    "isValid": False,
                    "totalBlocksVerified": i,
                    "corruptedBlockNumber": b_num,
                    "expectedHash": prev_block["hash"],
                    "actualHash": prev_hash,
                    "failureReason": f"Broken Hash Link at Block #{b_num}: previousHash does not match Block #{prev_block['blockNumber']}'s hash",
                    "verificationTimestamp": now_iso
                }

        # Payload recalculation verification
        recomputed = create_block_hash(
            block["blockNumber"],
            block["timestamp"],
            block["eventType"],
            block["actorId"],
            block["actorRole"],
            block["summary"],
            block["metadataPayload"],
            block["previousHash"]
        )

        if recomputed != curr_hash:
            return {
                "isValid": False,
                "totalBlocksVerified": i,
                "corruptedBlockNumber": b_num,
                "expectedHash": recomputed,
                "actualHash": curr_hash,
                "failureReason": f"Data Tampering Detected in Block #{b_num}: Payload has been modified after hashing",
                "verificationTimestamp": now_iso
            }

    return {
        "isValid": True,
        "totalBlocksVerified": len(blocks),
        "verificationTimestamp": now_iso
    }
