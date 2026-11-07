import { PracticeRecord } from '../types';

export const SYNTHETIC_PRACTICES: PracticeRecord[] = [
  {
    id: 'PRAC-001',
    department: 'Sales & Business Dev',
    policyId: 'POL-FIN-001',
    policyName: 'Corporate Expense Reimbursement (Receipt Substantiation)',
    metricName: 'Itemized Receipt Attachment Rate (>=$50)',
    targetComplianceRate: 98,
    actualComplianceRate: 74,
    period: '2024-Q3',
    observedCount: 420,
    samplePersonCount: 38,
    driftStatus: 'Severe Drift',
    primaryRootCause: 'Frequent travel and client dinners leading to delayed receipt collection; reliance on card-statement screenshots rather than itemized restaurant receipts.',
    recommendedRemediation: 'Deploy Navan mobile OCR instant-capture prompts after card swipe; block reimbursement submissions lacking itemized VAT breakdowns.',
    historicalTrend: [
      { month: 'Apr', target: 98, actual: 95 },
      { month: 'May', target: 98, actual: 89 },
      { month: 'Jun', target: 98, actual: 83 },
      { month: 'Jul', target: 98, actual: 78 },
      { month: 'Aug', target: 98, actual: 76 },
      { month: 'Sep', target: 98, actual: 74 }
    ]
  },
  {
    id: 'PRAC-002',
    department: 'Engineering & Product',
    policyId: 'POL-SEC-001',
    policyName: 'Enterprise Information Security (Zero Trust VPN Telemetry)',
    metricName: 'Always-On VPN Tunneling Adherence',
    targetComplianceRate: 100,
    actualComplianceRate: 99.4,
    period: '2024-Q3',
    observedCount: 1850,
    samplePersonCount: 142,
    driftStatus: 'Normal',
    primaryRootCause: 'Isolated split-tunnel testing during local Docker bridge development.',
    recommendedRemediation: 'Automate endpoint MDM watchdog daemon to re-engage GlobalProtect within 30 seconds of disruption.',
    historicalTrend: [
      { month: 'Apr', target: 100, actual: 99.1 },
      { month: 'May', target: 100, actual: 99.2 },
      { month: 'Jun', target: 100, actual: 99.6 },
      { month: 'Jul', target: 100, actual: 99.3 },
      { month: 'Aug', target: 100, actual: 99.5 },
      { month: 'Sep', target: 100, actual: 99.4 }
    ]
  },
  {
    id: 'PRAC-003',
    department: 'Engineering & Product',
    policyId: 'POL-SEC-002',
    policyName: 'Access Control (Just-In-Time Elevation Lifetime)',
    metricName: 'Production Elevation Revocation within 4 Hours',
    targetComplianceRate: 100,
    actualComplianceRate: 88,
    period: '2024-Q3',
    observedCount: 310,
    samplePersonCount: 26,
    driftStatus: 'Moderate Drift',
    primaryRootCause: 'Engineers manually requesting JIT extensions during overnight deployments without secondary architect authorization.',
    recommendedRemediation: 'Enforce hard Okta session boundary that invalidates tokens at 240 minutes regardless of active SSH connections.',
    historicalTrend: [
      { month: 'Apr', target: 100, actual: 98 },
      { month: 'May', target: 100, actual: 96 },
      { month: 'Jun', target: 100, actual: 92 },
      { month: 'Jul', target: 100, actual: 90 },
      { month: 'Aug', target: 100, actual: 89 },
      { month: 'Sep', target: 100, actual: 88 }
    ]
  },
  {
    id: 'PRAC-004',
    department: 'Customer Operations',
    policyId: 'POL-SEC-003',
    policyName: 'Enterprise Data Classification (PII Redaction in Zendesk)',
    metricName: 'Customer Bank Account Redaction Adherence',
    targetComplianceRate: 100,
    actualComplianceRate: 94.2,
    period: '2024-Q3',
    observedCount: 3400,
    samplePersonCount: 64,
    driftStatus: 'Moderate Drift',
    primaryRootCause: 'Customers attaching unredacted PDF bank statements via chat widget; agent auto-forwarding without triggering DLP redaction tool.',
    recommendedRemediation: 'Activate serverless pre-ingestion regex filter on ticket attachment intake pipeline.',
    historicalTrend: [
      { month: 'Apr', target: 100, actual: 98.5 },
      { month: 'May', target: 100, actual: 97.8 },
      { month: 'Jun', target: 100, actual: 96.2 },
      { month: 'Jul', target: 100, actual: 95.1 },
      { month: 'Aug', target: 100, actual: 94.6 },
      { month: 'Sep', target: 100, actual: 94.2 }
    ]
  },
  {
    id: 'PRAC-005',
    department: 'People Operations',
    policyId: 'POL-HR-003',
    policyName: 'Employee Onboarding & Offboarding Lifecycle',
    metricName: '60-Minute Offboarding Identity Revocation SLA',
    targetComplianceRate: 100,
    actualComplianceRate: 97.6,
    period: '2024-Q3',
    observedCount: 82,
    samplePersonCount: 18,
    driftStatus: 'Normal',
    primaryRootCause: 'Minor latency in third-party SaaS SCIM connectors for legacy marketing tools.',
    recommendedRemediation: 'Transition remaining 2 manual SaaS directories to automated Okta SCIM sync.',
    historicalTrend: [
      { month: 'Apr', target: 100, actual: 96.0 },
      { month: 'May', target: 100, actual: 96.5 },
      { month: 'Jun', target: 100, actual: 97.0 },
      { month: 'Jul', target: 100, actual: 97.2 },
      { month: 'Aug', target: 100, actual: 97.5 },
      { month: 'Sep', target: 100, actual: 97.6 }
    ]
  },
  {
    id: 'PRAC-006',
    department: 'Finance & Legal',
    policyId: 'POL-FIN-002',
    policyName: 'Vendor Procurement & Third-Party Diligence',
    metricName: 'Pre-Execution SOC 2 Verification for SaaS ($25k+)',
    targetComplianceRate: 100,
    actualComplianceRate: 100,
    period: '2024-Q3',
    observedCount: 45,
    samplePersonCount: 14,
    driftStatus: 'Normal',
    primaryRootCause: 'Zero compliance gap observed; legal procurement gate holds PO release until SOC 2 verified.',
    recommendedRemediation: 'Maintain existing automated Ironclad vendor intake checks.',
    historicalTrend: [
      { month: 'Apr', target: 100, actual: 100 },
      { month: 'May', target: 100, actual: 100 },
      { month: 'Jun', target: 100, actual: 100 },
      { month: 'Jul', target: 100, actual: 100 },
      { month: 'Aug', target: 100, actual: 100 },
      { month: 'Sep', target: 100, actual: 100 }
    ]
  },
  // Small group 1: Executive Office (Cohort size: 4 < 5 threshold) -> MUST BE SUPPRESSED!
  {
    id: 'PRAC-007',
    department: 'Executive Leadership Office',
    policyId: 'POL-SEC-001',
    policyName: 'Enterprise Information Security (Hardware Security Keys)',
    metricName: 'FIDO2 Hardware Key Physical Usage',
    targetComplianceRate: 100,
    actualComplianceRate: 75,
    period: '2024-Q3',
    observedCount: 16,
    samplePersonCount: 4, // UNDER THRESHOLD (k < 5)
    driftStatus: 'Moderate Drift',
    primaryRootCause: 'Frequent travel leading to occasional SMS fallback.',
    recommendedRemediation: 'Suppress individual cohort telemetry to protect executive privacy.',
    historicalTrend: [
      { month: 'Apr', target: 100, actual: 100 },
      { month: 'May', target: 100, actual: 80 },
      { month: 'Jun', target: 100, actual: 75 },
      { month: 'Jul', target: 100, actual: 75 },
      { month: 'Aug', target: 100, actual: 75 },
      { month: 'Sep', target: 100, actual: 75 }
    ]
  },
  // Small group 2: Cryptographic Infrastructure Pod (Cohort size: 3 < 5 threshold) -> MUST BE SUPPRESSED!
  {
    id: 'PRAC-008',
    department: 'Cryptographic Core Pod',
    policyId: 'POL-SEC-002',
    policyName: 'Access Control (HSM Dual-Control Ceremonies)',
    metricName: 'Key Ceremony Quorum Verification',
    targetComplianceRate: 100,
    actualComplianceRate: 100,
    period: '2024-Q3',
    observedCount: 8,
    samplePersonCount: 3, // UNDER THRESHOLD (k < 5)
    driftStatus: 'Normal',
    primaryRootCause: 'N/A',
    recommendedRemediation: 'Data suppressed for privacy: minimum cohort size is 5 individuals.',
    historicalTrend: [
      { month: 'Apr', target: 100, actual: 100 },
      { month: 'May', target: 100, actual: 100 },
      { month: 'Jun', target: 100, actual: 100 },
      { month: 'Jul', target: 100, actual: 100 },
      { month: 'Aug', target: 100, actual: 100 },
      { month: 'Sep', target: 100, actual: 100 }
    ]
  }
];
