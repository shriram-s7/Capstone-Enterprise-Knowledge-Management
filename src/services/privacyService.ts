import { DetectedEntity, PrivacyReceipt } from '../types';
import { computeSha256 } from './auditService';

// Known fictional employee names in FinNova dataset
const KNOWN_FICTIONAL_NAMES = [
  'Elena Rostova',
  'Arthur Pendelton',
  'Tariq Al-Mansoor',
  'Marcus Sterling',
  'Evelyn Vance',
  'Claire Dunphy',
  'Devon Zhao',
  'Sarah Jenkins',
  'David Kim',
  'Alice Vance',
  'Jonathan Miller',
  'Rachel Green',
  'Carlos Mendez',
  'Priya Patel',
  'Alex Chen',
  'Marcus Vance'
];

export interface SanitizationResult {
  originalText: string;
  sanitizedText: string;
  detectedEntities: DetectedEntity[];
  receipt: PrivacyReceipt;
}

export async function detectAndSanitizeText(rawInput: string): Promise<SanitizationResult> {
  let processed = rawInput;
  const detectedEntities: DetectedEntity[] = [];

  const counters = {
    PERSON: 0,
    EMAIL: 0,
    PHONE: 0,
    EMPLOYEE_ID: 0,
    NATIONAL_ID: 0,
    FINANCIAL: 0
  };

  const nameMapping = new Map<string, string>();
  const emailMapping = new Map<string, string>();
  const phoneMapping = new Map<string, string>();
  const empMapping = new Map<string, string>();

  // 1. Detect Names from known synthetic employee directory
  for (const name of KNOWN_FICTIONAL_NAMES) {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(rawInput)) !== null) {
      if (!nameMapping.has(match[0].toLowerCase())) {
        counters.PERSON++;
        nameMapping.set(match[0].toLowerCase(), `[PERSON_${counters.PERSON}]`);
      }
      detectedEntities.push({
        type: 'NAME',
        value: match[0],
        replacement: nameMapping.get(match[0].toLowerCase())!,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.98
      });
    }
  }

  // 2. Detect Email addresses (supporting standard and internal corporate TLDs)
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,15}\b/g;
  let emailMatch: RegExpExecArray | null;
  while ((emailMatch = emailRegex.exec(rawInput)) !== null) {
    const val = emailMatch[0];
    if (!emailMapping.has(val.toLowerCase())) {
      counters.EMAIL++;
      emailMapping.set(val.toLowerCase(), `[EMAIL_${counters.EMAIL}]`);
    }
    detectedEntities.push({
      type: 'EMAIL',
      value: val,
      replacement: emailMapping.get(val.toLowerCase())!,
      startIndex: emailMatch.index,
      endIndex: emailMatch.index + val.length,
      confidence: 0.99
    });
  }

  // 3. Detect Employee IDs (e.g. FN-10492, EMP-9921, FN8821)
  const empIdRegex = /\b(?:FN|EMP|ID)[-_]?[0-9]{4,6}\b/gi;
  let empMatch: RegExpExecArray | null;
  while ((empMatch = empIdRegex.exec(rawInput)) !== null) {
    const val = empMatch[0];
    if (!empMapping.has(val.toUpperCase())) {
      counters.EMPLOYEE_ID++;
      empMapping.set(val.toUpperCase(), `[EMPLOYEE_ID_${counters.EMPLOYEE_ID}]`);
    }
    detectedEntities.push({
      type: 'EMPLOYEE_ID',
      value: val,
      replacement: empMapping.get(val.toUpperCase())!,
      startIndex: empMatch.index,
      endIndex: empMatch.index + val.length,
      confidence: 0.96
    });
  }

  // 4. Detect Phone Numbers (international and US formats)
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  let phoneMatch: RegExpExecArray | null;
  while ((phoneMatch = phoneRegex.exec(rawInput)) !== null) {
    const val = phoneMatch[0];
    if (!phoneMapping.has(val)) {
      counters.PHONE++;
      phoneMapping.set(val, `[PHONE_${counters.PHONE}]`);
    }
    detectedEntities.push({
      type: 'PHONE',
      value: val,
      replacement: phoneMapping.get(val)!,
      startIndex: phoneMatch.index,
      endIndex: phoneMatch.index + val.length,
      confidence: 0.95
    });
  }

  // 5. Detect SSN / National IDs (xxx-xx-xxxx)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  let ssnMatch: RegExpExecArray | null;
  while ((ssnMatch = ssnRegex.exec(rawInput)) !== null) {
    counters.NATIONAL_ID++;
    detectedEntities.push({
      type: 'NATIONAL_ID',
      value: ssnMatch[0],
      replacement: `[NATIONAL_ID_${counters.NATIONAL_ID}]`,
      startIndex: ssnMatch.index,
      endIndex: ssnMatch.index + ssnMatch[0].length,
      confidence: 0.99
    });
  }

  // 6. Detect Financial Card Numbers (16 digits or 4x4 groups)
  const cardRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
  let cardMatch: RegExpExecArray | null;
  while ((cardMatch = cardRegex.exec(rawInput)) !== null) {
    counters.FINANCIAL++;
    detectedEntities.push({
      type: 'FINANCIAL',
      value: cardMatch[0],
      replacement: `[CARD_NUMBER_${counters.FINANCIAL}]`,
      startIndex: cardMatch.index,
      endIndex: cardMatch.index + cardMatch[0].length,
      confidence: 0.97
    });
  }

  // Sort entities descending by length of matched value to avoid substring collisions
  const sortedEntities = [...detectedEntities].sort((a, b) => b.value.length - a.value.length);

  for (const entity of sortedEntities) {
    // Replace all occurrences of this exact entity value
    const escaped = entity.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    processed = processed.replace(new RegExp(escaped, 'gi'), entity.replacement);
  }

  // Compute SHA-256 of the sanitized string
  const sanitizedHash = await computeSha256(processed);

  const distinctCategories = Array.from(new Set(detectedEntities.map(e => e.type)));
  const categoryLabels = distinctCategories.map(cat => {
    switch (cat) {
      case 'EMAIL': return 'Email Address';
      case 'PHONE': return 'Phone Number';
      case 'EMPLOYEE_ID': return 'Corporate Employee ID';
      case 'NAME': return 'Identifiable Personal Name';
      case 'NATIONAL_ID': return 'National Identification Number';
      case 'FINANCIAL': return 'Payment Card / Account';
      default: return cat;
    }
  });

  const receipt: PrivacyReceipt = {
    receiptId: `RCPT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    originalCharLength: rawInput.length,
    sanitizedCharLength: processed.length,
    entitiesDetectedCount: detectedEntities.length,
    detectedCategories: categoryLabels,
    sanitizedHash,
    piiRetentionGuaranteed: true,
    sanitizedPreview: processed.length > 90 ? processed.substring(0, 90) + '...' : processed
  };

  return {
    originalText: rawInput,
    sanitizedText: processed,
    detectedEntities,
    receipt
  };
}
