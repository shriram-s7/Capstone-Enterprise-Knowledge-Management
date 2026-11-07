import { AuditBlock } from '../types';

// Convert ArrayBuffer to hex string
export function bufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

// Compute SHA-256 hash using the native browser Web Crypto API
export async function computeSha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return bufferToHex(hashBuffer);
}

// Construct canonical string representation of an audit block for hashing
export function serializeBlockForHashing(
  blockNumber: number,
  timestamp: string,
  eventType: string,
  actorId: string,
  actorRole: string,
  summary: string,
  metadataPayload: Record<string, string | number | boolean>,
  previousHash: string
): string {
  const sortedMetadata = Object.keys(metadataPayload)
    .sort()
    .reduce<Record<string, string | number | boolean>>((acc, key) => {
      acc[key] = metadataPayload[key];
      return acc;
    }, {});

  return `${blockNumber}|${timestamp}|${eventType}|${actorId}|${actorRole}|${summary}|${JSON.stringify(sortedMetadata)}|${previousHash}`;
}

export interface VerificationResult {
  isValid: boolean;
  totalBlocksVerified: number;
  corruptedBlockNumber?: number;
  expectedHash?: string;
  actualHash?: string;
  failureReason?: string;
  verificationTimestamp: string;
}

// Full recalculation and cryptographic verification of the hash-chained ledger
export async function verifyLedgerChain(chain: AuditBlock[]): Promise<VerificationResult> {
  const timestamp = new Date().toISOString();
  if (!chain || chain.length === 0) {
    return {
      isValid: true,
      totalBlocksVerified: 0,
      verificationTimestamp: timestamp
    };
  }

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];

    // Check previous hash link
    if (i === 0) {
      if (block.previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return {
          isValid: false,
          totalBlocksVerified: i,
          corruptedBlockNumber: block.blockNumber,
          failureReason: `Genesis block previousHash must be 64 zeroes. Found: ${block.previousHash}`,
          verificationTimestamp: timestamp
        };
      }
    } else {
      const prevBlock = chain[i - 1];
      if (block.previousHash !== prevBlock.hash) {
        return {
          isValid: false,
          totalBlocksVerified: i,
          corruptedBlockNumber: block.blockNumber,
          expectedHash: prevBlock.hash,
          actualHash: block.previousHash,
          failureReason: `Broken Hash Link at Block #${block.blockNumber}: previousHash does not match Block #${prevBlock.blockNumber}'s actual hash`,
          verificationTimestamp: timestamp
        };
      }
    }

    // Recalculate block's own hash from its canonical payload
    const canonicalString = serializeBlockForHashing(
      block.blockNumber,
      block.timestamp,
      block.eventType,
      block.actorId,
      block.actorRole,
      block.summary,
      block.metadataPayload,
      block.previousHash
    );

    const recomputedHash = await computeSha256(canonicalString);
    if (recomputedHash !== block.hash) {
      return {
        isValid: false,
        totalBlocksVerified: i,
        corruptedBlockNumber: block.blockNumber,
        expectedHash: recomputedHash,
        actualHash: block.hash,
        failureReason: `Data Tampering Detected in Block #${block.blockNumber}: Payload has been modified after hashing`,
        verificationTimestamp: timestamp
      };
    }
  }

  return {
    isValid: true,
    totalBlocksVerified: chain.length,
    verificationTimestamp: timestamp
  };
}

// Create a new verified block chained to the existing ledger
export async function createChainedBlock(
  chain: AuditBlock[],
  eventType: AuditBlock['eventType'],
  actorId: string,
  actorRole: string,
  summary: string,
  metadataPayload: Record<string, string | number | boolean>
): Promise<AuditBlock> {
  const previousBlock = chain.length > 0 ? chain[chain.length - 1] : null;
  const blockNumber = previousBlock ? previousBlock.blockNumber + 1 : 0;
  const previousHash = previousBlock ? previousBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000';
  const timestamp = new Date().toISOString();

  const canonicalString = serializeBlockForHashing(
    blockNumber,
    timestamp,
    eventType,
    actorId,
    actorRole,
    summary,
    metadataPayload,
    previousHash
  );

  const hash = await computeSha256(canonicalString);

  return {
    blockNumber,
    timestamp,
    eventType,
    actorId,
    actorRole,
    summary,
    metadataPayload,
    previousHash,
    hash
  };
}
