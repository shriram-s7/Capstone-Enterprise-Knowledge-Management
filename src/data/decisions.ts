import { DecisionRecord } from '../types';

export const SYNTHETIC_DECISIONS: DecisionRecord[] = [
  {
    id: 'DEC-2024-089',
    title: 'Distributed Engineering Pod Ergonomic & Broadband Grant',
    department: 'Engineering & Product',
    date: '2024-03-12',
    ownerName: 'Devon Zhao',
    ownerRole: 'VP of Infrastructure Engineering',
    status: 'Approved',
    businessContext: 'Following the closure of the secondary Austin regional facility, 42 backend engineers transitioned to permanent Remote-First classification. Under POL-HR-001 v2.0, equipment and connectivity stipends were authorized.',
    decisionSummary: 'Authorized a one-time $800 home workspace ergonomic upgrade and $75/mo internet subsidy for 42 newly re-designated Remote-First engineers, citing POL-HR-001 v2.0 Clause 2.2.',
    relevantPolicyIds: [
      {
        policyId: 'POL-HR-001',
        versionUsed: 'v2.0',
        clauseCited: 'Clause 2.2 (Home Office & Broadband Reimbursement)'
      },
      {
        policyId: 'POL-SEC-001',
        versionUsed: 'v3.0',
        clauseCited: 'Clause 2.4 (Mandatory Always-On Tunneling)'
      }
    ],
    supportingEvidence: [
      {
        id: 'EVD-089-1',
        type: 'Cost-Benefit Model',
        title: 'Austin Facility Lease Termination vs Remote Stipend Net Savings',
        summary: 'Direct facility savings of $340k annually against one-off equipment grant of $33.6k and recurring broadband of $37.8k/yr.',
        sourceDocument: 'FIN-AUDIT-2024-AUSTIN-OPEX.pdf'
      },
      {
        id: 'EVD-089-2',
        type: 'Audit Finding',
        title: 'Information Security Device Compliance Check',
        summary: '100% of 42 laptops confirmed enrolled in Okta FastPass and GlobalProtect Always-On VPN profile prior to grant disbursal.',
        sourceDocument: 'SEC-COMPLIANCE-REPORT-POD-A.pdf'
      }
    ],
    rationale: 'Transition aligns with FinNova 2024 distributed workforce roadmap. Stipend adheres strictly to policy maximums without executive escalation.',
    impactMetrics: [
      { metricName: 'Annual OpEx Reduction', value: '$268,600', change: '+18%' },
      { metricName: 'Employee Satisfaction Score', value: '94%', change: '+12%' },
      { metricName: 'VPN Telemetry Adherence', value: '100%', change: '0%' }
    ],
    relatedDecisionIds: ['DEC-2024-201']
  },
  {
    id: 'DEC-2024-112',
    title: 'Emergency Cloud Security Telemetry Vendor Fast-Track',
    department: 'Information Security & CISO',
    date: '2024-04-05',
    ownerName: 'Tariq Al-Mansoor',
    ownerRole: 'Chief Information Security Officer',
    status: 'Approved',
    businessContext: 'Urgent vulnerability patch in production Kubernetes ingress required deployment of specialized real-time eBPF runtime threat detection (Datadog Cloud SIEM extension).',
    decisionSummary: 'Approved single-source procurement under POL-FIN-002 v2.0 Clause 2.1 exception clause, expediting vendor contract with immediate CFO and Legal pre-clearance.',
    relevantPolicyIds: [
      {
        policyId: 'POL-FIN-002',
        versionUsed: 'v2.0',
        clauseCited: 'Clause 2.1 (Competitive Bidding Exception) & Clause 3.4 (SOC 2 Verification)'
      },
      {
        policyId: 'POL-SEC-004',
        versionUsed: 'v2.0',
        clauseCited: 'Clause 2.1 (Immediate Incident Escalation)'
      }
    ],
    supportingEvidence: [
      {
        id: 'EVD-112-1',
        type: 'Legal Review',
        title: 'Vendor SOC 2 Type II Independent Audit Verification',
        summary: 'PricewaterhouseCoopers SOC 2 Type II report for Vendor inspected and verified with zero material exceptions.',
        sourceDocument: 'DATADOG-SOC2-REPORT-2023.pdf'
      },
      {
        id: 'EVD-112-2',
        type: 'Audit Finding',
        title: 'CISO Single-Source Justification Memo',
        summary: 'Sole vendor with existing zero-day kernel filter compatible with hardened FinNova Linux kernels.',
        sourceDocument: 'MEMO-CISO-SINGLE-SOURCE-0424.pdf'
      }
    ],
    rationale: 'Delay in competitive RFP would prolong cluster vulnerability window beyond the 15-minute SLA threshold defined in incident policy.',
    impactMetrics: [
      { metricName: 'Mean Time to Detect (MTTD)', value: '42 seconds', change: '-84%' },
      { metricName: 'Ingress Threat Coverage', value: '99.8%', change: '+32%' }
    ],
    relatedDecisionIds: ['DEC-2024-167']
  },
  {
    id: 'DEC-2024-145',
    title: 'Tokyo FinTech Global Summit Travel Per-Diem Exception',
    department: 'Sales & Business Dev',
    date: '2024-05-18',
    ownerName: 'Evelyn Vance',
    ownerRole: 'Chief Financial Officer',
    status: 'Approved',
    businessContext: 'Senior enterprise delegation of 4 account executives representing FinNova at Tokyo FinTech Summit faced extreme seasonal hotel and dining inflation above standard foreign per-diem rates.',
    decisionSummary: 'Invoked POL-FIN-003 v2.1 Section 4.2 Tier-1 metropolitan ceiling ($350/night lodging) and authorized $130/day subsistence exception for the 5-day summit window.',
    relevantPolicyIds: [
      {
        policyId: 'POL-FIN-003',
        versionUsed: 'v2.1',
        clauseCited: 'Clause 3.1 (Travel Subsistence) & Clause 4.2 (Tier-1 City Ceilings)'
      },
      {
        policyId: 'POL-FIN-001',
        versionUsed: 'v2.2',
        clauseCited: 'Clause 5.2 (Approval Hierarchy)'
      }
    ],
    supportingEvidence: [
      {
        id: 'EVD-145-1',
        type: 'Metric Data',
        title: 'Tokyo Chiyoda District Hospitality Index During Summit Week',
        summary: 'Independent Navan benchmark confirmed average business class lodging rates at $385/night during international summit.',
        sourceDocument: 'NAVAN-MARKET-SURGE-TOKYO-MAY24.pdf'
      },
      {
        id: 'EVD-145-2',
        type: 'Cost-Benefit Model',
        title: 'APAC Pipeline Opportunity Valuation',
        summary: 'Delegation secured $2.4M ARR in signed term sheets with top-tier Japanese institutional asset managers.',
        sourceDocument: 'SALES-APAC-Q2-PIPELINE.xlsx'
      }
    ],
    rationale: 'Strict enforcement of non-Tier 1 $220 limit would have required booking lodging 90 minutes away from convention center, compromising client executive hospitality.',
    impactMetrics: [
      { metricName: 'Pipeline Generated', value: '$2,400,000', change: '+140%' },
      { metricName: 'Cost per Enterprise Lead', value: '$410', change: '-28%' }
    ]
  },
  {
    id: 'DEC-2024-167',
    title: 'Statutory Retention Deferral & Litigation Hold for Cross-Border Audit',
    department: 'Legal & Regulatory Compliance',
    date: '2024-06-22',
    ownerName: 'Arthur Pendelton',
    ownerRole: 'General Counsel',
    status: 'Approved',
    businessContext: 'Formal regulatory inquiry by European Banking Authority regarding transaction routing latency necessitated preservation of communications across payments engineering and treasury.',
    decisionSummary: 'Issued formal Legal Hold Order pursuant to POL-LEG-001 v1.3 Clause 5.1, superseding the automated 90-day Slack and email purge routine for 18 named custodians.',
    relevantPolicyIds: [
      {
        policyId: 'POL-LEG-001',
        versionUsed: 'v1.3',
        clauseCited: 'Clause 5.1 (Legal Hold Supremacy) & Clause 2.2 (Ephemeral Purge Suspension)'
      },
      {
        policyId: 'POL-PRIV-001',
        versionUsed: 'v2.0',
        clauseCited: 'Clause 2.3 (Cryptographic Audit Receipts)'
      }
    ],
    supportingEvidence: [
      {
        id: 'EVD-167-1',
        type: 'Legal Review',
        title: 'EBA Inquiry Docket Reference #EBA-INV-2024-0991',
        summary: 'Official notification of inquiry into algorithmic cross-border currency conversion settlement times.',
        sourceDocument: 'REGULATORY-NOTICE-EBA-0991.pdf'
      },
      {
        id: 'EVD-167-2',
        type: 'Audit Finding',
        title: 'Cryptographic Custodian Ledger Freeze Receipt',
        summary: 'Automated Slack DLP purge successfully suspended for custodians with SHA-256 seal logged to audit ledger.',
        sourceDocument: 'LEDGER-RECEIPT-HOLD-167.json'
      }
    ],
    rationale: 'Purging communications during an active inquiry triggers severe regulatory sanctions for evidence spoliation under FINRA and GDPR directives.',
    impactMetrics: [
      { metricName: 'Regulatory Compliance Score', value: '100%', change: '0%' },
      { metricName: 'Preserved Evidence Integrity', value: 'Verified', change: 'SHA-256' }
    ],
    relatedDecisionIds: ['DEC-2024-112']
  },
  {
    id: 'DEC-2024-201',
    title: 'Ephemeral Privileged Access Elevation for Core Database Engine Migration',
    department: 'DevOps & Site Reliability',
    date: '2024-07-14',
    ownerName: 'Elena Rostova & Tariq Al-Mansoor',
    ownerRole: 'Chief Privacy Officer & CISO',
    status: 'Executed',
    businessContext: 'Zero-downtime migration of PostgreSQL 12 customer transactions ledger to Aurora PostgreSQL 15 required temporary database superuser role for Lead Database Architect.',
    decisionSummary: 'Granted an 8-hour temporary JIT privileged access window under POL-SEC-002 v2.0 Clause 3.1 with continuous biometric keystroke logging and full session recording.',
    relevantPolicyIds: [
      {
        policyId: 'POL-SEC-002',
        versionUsed: 'v2.0',
        clauseCited: 'Clause 3.1 (Just-In-Time Privileged Access)'
      },
      {
        policyId: 'POL-PRIV-001',
        versionUsed: 'v2.0',
        clauseCited: 'Clause 1.2 (PII Shield) & Clause 4.1 (K-Anonymity)'
      }
    ],
    supportingEvidence: [
      {
        id: 'EVD-201-1',
        type: 'Audit Finding',
        title: 'Dual-Engineer Approval Signature Token',
        summary: 'Cryptographically signed authorization by both Lead Infrastructure Architect and Security Incident Commander.',
        sourceDocument: 'PAM-TOKEN-SIG-2024-0714.asc'
      },
      {
        id: 'EVD-201-2',
        type: 'Metric Data',
        title: 'Session Telemetry Recording & Automated PII Masking Verification',
        summary: 'Screen capture and query logger confirmed zero raw PII display; automatic cryptographic mask masked all PAN numbers.',
        sourceDocument: 'TELEMETRY-AUDIT-SESSION-771.log'
      }
    ],
    rationale: 'Migration was critical to eliminate deprecated engine vulnerabilities; ephemeral token self-revoked at 06:00 UTC without privilege spillover.',
    impactMetrics: [
      { metricName: 'Migration Downtime', value: '0 seconds', change: '-100%' },
      { metricName: 'Database Query Throughput', value: '18,500 qps', change: '+45%' },
      { metricName: 'Privilege Exposure Duration', value: '7h 12m', change: 'Closed' }
    ],
    relatedDecisionIds: ['DEC-2024-089']
  },
  {
    id: 'DEC-2024-240',
    title: 'Product Core Q4 Launch Squad Special PTO Rollover Approval',
    department: 'People Operations & Product',
    date: '2024-09-02',
    ownerName: 'Marcus Sterling',
    ownerRole: 'Chief People Officer',
    status: 'Approved',
    businessContext: 'Due to mission-critical regulatory compliance launch of FinNova NextGen Core in Q3/Q4, 14 engineers and product designers had their scheduled summer holidays blacked out.',
    decisionSummary: 'Approved exceptional rollover of up to 12 unused leave days (exceeding standard 8-day limit under POL-HR-002 v2.0 Clause 3.2) usable through June 30, 2025.',
    relevantPolicyIds: [
      {
        policyId: 'POL-HR-002',
        versionUsed: 'v2.0',
        clauseCited: 'Clause 3.2 (Year-End Rollover Cap Exception) & Clause 5.1 (Recharge Days)'
      }
    ],
    supportingEvidence: [
      {
        id: 'EVD-240-1',
        type: 'Metric Data',
        title: 'Launch Squad Overtime & On-Call Telemetry',
        summary: 'Telemetry indicated average 52-hour work weeks during sprint crunch to achieve ISO 27001 recertification.',
        sourceDocument: 'JIRA-SPRINT-BURNDOWN-NEXTGEN.pdf'
      },
      {
        id: 'EVD-240-2',
        type: 'Legal Review',
        title: 'Fair Labor Standards & Employee Welfare Assessment',
        summary: 'Compensation & Benefits committee endorsed rollover extension to avert employee burnout and unwanted attrition.',
        sourceDocument: 'PEOPLE-OPS-MEMO-PTO-EXCEPTIONS.pdf'
      }
    ],
    rationale: 'Punishing team members by forfeiting earned holiday caused by mandatory launch blackouts contradicts FinNova people-first ethos.',
    impactMetrics: [
      { metricName: 'Sprint Delivery On-Time', value: '100%', change: '0%' },
      { metricName: 'Squad Retention Rate', value: '100%', change: '+8%' },
      { metricName: 'Approved Rollover Days', value: '144 days total', change: 'Capped' }
    ]
  }
];
