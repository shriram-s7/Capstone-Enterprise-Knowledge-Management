import { PolicyConflict } from '../types';

export const SYNTHETIC_CONFLICTS: PolicyConflict[] = [
  {
    id: 'CONF-001',
    title: 'Travel Subsistence Meal Cap vs General Expense Limit',
    severity: 'Medium',
    policyA: {
      id: 'POL-FIN-001',
      version: 'v2.2',
      clauseNumber: '4.2',
      statement: 'Daily expenditure on meals during company business is strictly capped at $75 USD per employee per day.'
    },
    policyB: {
      id: 'POL-FIN-003',
      version: 'v2.1',
      clauseNumber: '3.1',
      statement: 'Employees on authorized overnight business travel are granted a meal and incidental allowance of up to $100 USD per day.'
    },
    conflictDescription: 'POL-FIN-001 sets a rigid $75/day ceiling for all meal claims, whereas POL-FIN-003 authorizes up to $100/day specifically for overnight travel. Without programmatic differentiation, finance expense processors reject legitimate $90 travel dining claims.',
    resolutionStatus: 'Resolved By Precedence',
    precedenceRule: 'Lex specialis derogat legi generali: The specific Travel Policy (POL-FIN-003) governs overnight business travel subsistence, superseding the general operational expense policy (POL-FIN-001) for travel itineraries with overnight hotel stays.',
    recommendedAction: 'Automate rule hierarchy in Concur: if an itinerary contains an associated lodging booking or travel request ID, apply the $100 travel threshold; otherwise enforce the standard $75 meeting meal cap.',
    affectedDepartments: ['Sales & Business Dev', 'Customer Success', 'Executive Leadership', 'Engineering']
  },
  {
    id: 'CONF-002',
    title: 'Home Network Exemption vs Zero Trust Always-On VPN Mandate',
    severity: 'Critical',
    policyA: {
      id: 'POL-HR-001',
      version: 'v2.0',
      clauseNumber: '5.3',
      statement: 'Employees may connect personal peripheral equipment and use standard residential Wi-Fi without VPN for low-risk collaboration tools (Slack/Notion).'
    },
    policyB: {
      id: 'POL-SEC-001',
      version: 'v3.0',
      clauseNumber: '2.4',
      statement: 'All company-managed devices connecting from external networks must route 100% of network traffic through GlobalProtect Always-On VPN with zero exceptions.'
    },
    conflictDescription: 'The HR Remote Work Framework suggests employees can browse Slack and Notion over residential Wi-Fi without VPN, contradicting the Board-approved Zero Trust Information Security Standard which mandates 100% full-tunnel VPN encryption on all corporate endpoints.',
    resolutionStatus: 'Resolved By Precedence',
    precedenceRule: 'FinNova Corporate Governance Charter Section 4.2: Board-approved Information Security Standards (POL-SEC-001) possess absolute institutional supremacy over department-level HR operational frameworks.',
    recommendedAction: 'Maintain MDM enforcement of GlobalProtect Always-On VPN across 100% of fleet. Issue an administrative erratum to POL-HR-001 Clause 5.3 to eliminate misleading residential Wi-Fi exemptions.',
    affectedDepartments: ['All Remote Staff', 'People Operations', 'Information Security', 'IT Operations']
  },
  {
    id: 'CONF-003',
    title: 'Ephemeral Chat 90-Day Purge vs 365-Day Incident War Room Archiving',
    severity: 'High',
    policyA: {
      id: 'POL-LEG-001',
      version: 'v1.3',
      clauseNumber: '2.2',
      statement: 'Internal ephemeral communication channels (Slack/Teams) shall be purged every 90 days.'
    },
    policyB: {
      id: 'POL-SEC-004',
      version: 'v2.0',
      clauseNumber: '6.1',
      statement: 'Incident war-room channels, forensic captures, and communication logs must be archived for a minimum of 365 days post-incident resolution.'
    },
    conflictDescription: 'The legal automated document destruction schedule executes an indiscriminate 90-day deletion across corporate Slack channels, risking premature destruction of SEV-1 and SEV-2 cybersecurity incident investigation war rooms required for 1-year regulatory compliance.',
    resolutionStatus: 'Requires Human Review',
    precedenceRule: 'Undetermined Precedence: Automated retention API lacks an automated webhook bridge between the Incident Response ticketing system and Slack retention exemptions without manual legal hold issuance.',
    recommendedAction: 'Convene Joint Legal-Security Working Group: Implement an automated integration that applies Slack Legal Hold tags to any channel matching "#incident-sev*" upon ticket creation, preventing automated purge routines.',
    affectedDepartments: ['Information Security & SOC', 'Legal & Regulatory Compliance', 'DevOps & Infrastructure']
  }
];
