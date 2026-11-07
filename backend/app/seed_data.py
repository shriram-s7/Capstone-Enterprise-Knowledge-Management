"""
Synthetic demonstration data for FinNova Platform.
Includes 12 policies, 3 planted conflicts, 6 decisions, and 8 policy-practice records.
"""

SYNTHETIC_POLICIES = [
  {
    "id": "POL-HR-001",
    "title": "Remote & Flexible Work Framework",
    "category": "HR & People",
    "ownerDepartment": "People Operations",
    "currentVersion": "v2.0",
    "lastReviewedDate": "2024-03-01",
    "nextReviewDate": "2025-03-01",
    "status": "Active",
    "scope": "All full-time and contractual employees across global offices",
    "tags": ["remote work", "hybrid", "work from home", "stipend", "equipment"],
    "versions": [
      {
        "version": "v1.0",
        "effectiveDate": "2022-01-15",
        "approvedBy": "Claire Dunphy",
        "approverRole": "VP of Human Resources",
        "summary": "Original remote work protocol permitting up to 2 days per week remote with manager approval.",
        "fullContent": "FinNova recognizes the evolving workplace landscape. Employees in eligible positions may request up to two (2) days of remote work per calendar week with written managerial endorsement.\n\nSection 1: Eligibility - Full-time staff post-probationary review.\nSection 2: Home Office - Employees receive a one-time $300 technology contribution.\nSection 3: Core Hours - Standard synchronous availability from 10:00 AM to 4:00 PM local time.",
        "keyClauses": [
          { "clauseNumber": "1.2", "title": "Remote Work Allocation", "text": "Eligible staff may work remotely up to two days per week upon manager approval." },
          { "clauseNumber": "2.1", "title": "Home Office Allowance", "text": "One-time $300 home setup allowance provided through standard payroll." },
          { "clauseNumber": "3.1", "title": "Core Availability", "text": "Employees must remain active on corporate messaging between 10:00 and 16:00 local time." }
        ],
        "changelogNotes": "Initial policy publication post-pandemic stabilization."
      },
      {
        "version": "v1.5",
        "effectiveDate": "2023-06-01",
        "supersedesVersion": "v1.0",
        "approvedBy": "Marcus Sterling",
        "approverRole": "Chief People Officer",
        "summary": "Expansion to hybrid 3-days remote model and increase in ergonomic home allowance.",
        "fullContent": "Under FinNova Hybrid 2023, employees may schedule up to three (3) days of remote work per week. Ergonomic home allowance increased to $500 biennially. Core working hours adjusted to 10:00 AM to 3:00 PM.\n\nSection 4: Technical Connectivity - Home routers must be WPA2/WPA3 protected.",
        "keyClauses": [
          { "clauseNumber": "1.2", "title": "Remote Work Allocation", "text": "Eligible staff may work remotely up to three days per week in agreement with their department lead." },
          { "clauseNumber": "2.1", "title": "Home Office Allowance", "text": "Bi-annual ergonomic and technology stipend of $500." },
          { "clauseNumber": "5.3", "title": "Network Connectivity", "text": "Employees may connect personal peripheral equipment and use standard residential Wi-Fi without VPN for low-risk collaboration tools (Slack/Notion)." }
        ],
        "changelogNotes": "Expanded remote days from 2 to 3 and raised home office allowance."
      },
      {
        "version": "v2.0",
        "effectiveDate": "2024-03-01",
        "supersedesVersion": "v1.5",
        "approvedBy": "Marcus Sterling",
        "approverRole": "Chief People Officer",
        "summary": "Fully modernized remote framework with quarterly travel stipends, asynchronous core guidelines, and security requirements.",
        "fullContent": "FinNova Remote 2.0 establishes role-based flexibility. Roles classified as 'Remote-First' may work up to 100% remote with designated quarterly team on-sites. Hybrid roles require 4 in-office days per fortnight.\n\nSection 1: Stipend Structure - $800 initial home setup plus $75 monthly internet reimbursement.\nSection 2: Work Outside Home Country - Permitted up to 30 consecutive business days per calendar year with People Ops and Tax approval.\nSection 3: Synchronous Overlap - Minimum 4 hours daily overlap with primary pod timezone.",
        "keyClauses": [
          { "clauseNumber": "1.4", "title": "Tiered Remote Eligibility", "text": "Roles designated as Remote-First may work remotely full-time. Hybrid roles require minimum 4 in-office days per fortnight." },
          { "clauseNumber": "2.2", "title": "Home Office & Broadband Reimbursement", "text": "Initial $800 home setup subsidy, accompanied by $75 monthly recurring broadband reimbursement." },
          { "clauseNumber": "3.4", "title": "International Remote Work", "text": "Staff may work abroad for up to 30 calendar days annually subject to People Ops tax clearance." },
          { "clauseNumber": "5.3", "title": "Peripheral & Network Policy", "text": "Employees may connect personal peripheral equipment and use standard residential Wi-Fi without VPN for low-risk collaboration tools (Slack/Notion)." }
        ],
        "changelogNotes": "Comprehensive 2024 overhaul introducing 30-day international work, $800 initial stipend, and monthly broadband."
      }
    ]
  },
  {
    "id": "POL-HR-002",
    "title": "Annual & Personal Leave Guidelines",
    "category": "HR & People",
    "ownerDepartment": "People Operations",
    "currentVersion": "v2.0",
    "lastReviewedDate": "2024-01-10",
    "nextReviewDate": "2025-01-10",
    "status": "Active",
    "scope": "All permanent FinNova employees globally",
    "tags": ["leave", "vacation", "pto", "sick leave", "rollover", "bereavement"],
    "versions": [
      {
        "version": "v1.0",
        "effectiveDate": "2022-01-01",
        "approvedBy": "Claire Dunphy",
        "approverRole": "VP of Human Resources",
        "summary": "Standard 20 days annual PTO with a strict cap of 5 rollover days into the subsequent year.",
        "fullContent": "Permanent staff earn 20 days paid annual leave accrued monthly. Up to 5 unused days may roll over to Q1 of the following year. Unused rollover days expire on March 31. Sick leave is provided up to 10 days per year with medical certificate required after 3 consecutive days.",
        "keyClauses": [
          { "clauseNumber": "2.1", "title": "Annual Leave Entitlement", "text": "Standard allocation of 20 accrued days of paid time off per calendar year." },
          { "clauseNumber": "3.2", "title": "Year-End Rollover", "text": "A maximum of 5 unused annual leave days may carry forward into the subsequent calendar year, expiring March 31." },
          { "clauseNumber": "4.1", "title": "Sick Leave Documentation", "text": "Absences exceeding three consecutive days require an authorized medical certificate." }
        ],
        "changelogNotes": "Base corporate PTO policy."
      },
      {
        "version": "v2.0",
        "effectiveDate": "2023-10-01",
        "supersedesVersion": "v1.0",
        "approvedBy": "Marcus Sterling",
        "approverRole": "Chief People Officer",
        "summary": "Upgraded to 25 days annual leave, 8-day rollover allowance, plus 2 dedicated Recharge & Well-being mental health days.",
        "fullContent": "Annual PTO increased to 25 days for all permanent employees. Rollover allowance raised to 8 days with expiration extended to April 30. Introduction of 2 company-paid Recharge Days per year. Parental leave expanded to 16 weeks fully paid for primary caregivers and 8 weeks for secondary caregivers.",
        "keyClauses": [
          { "clauseNumber": "2.1", "title": "Annual Leave Entitlement", "text": "Permanent full-time staff receive 25 paid annual leave days accrued pro-rata monthly." },
          { "clauseNumber": "3.2", "title": "Year-End Rollover Cap", "text": "Up to 8 days of unused annual leave may be carried over into the next year, usable until April 30." },
          { "clauseNumber": "5.1", "title": "Recharge & Mental Well-being Days", "text": "Two dedicated global recharge days allocated annually, non-accruing and non-expiring within the calendar year." }
        ],
        "changelogNotes": "Enhanced PTO allocation to 25 days, increased rollover to 8 days, and codified parental leave."
      }
    ]
  },
  {
    "id": "POL-HR-003",
    "title": "Employee Lifecycle: Onboarding & Offboarding",
    "category": "HR & People",
    "ownerDepartment": "People Operations",
    "currentVersion": "v1.2",
    "lastReviewedDate": "2023-11-20",
    "nextReviewDate": "2024-11-20",
    "status": "Active",
    "scope": "All global employees, contractors, and hiring managers",
    "tags": ["onboarding", "offboarding", "hardware provisioning", "background checks"],
    "versions": [
      {
        "version": "v1.2",
        "effectiveDate": "2023-11-20",
        "approvedBy": "Marcus Sterling",
        "approverRole": "Chief People Officer",
        "summary": "Standard operating procedure for new hire verification, IT credentialing, security training, and exit revocation.",
        "fullContent": "New hires must complete mandatory identity verification and criminal background screening 5 business days prior to Day 1. Mandatory compliance modules must be completed within 14 days of start date.\n\nUpon departure, all corporate access must be revoked within 60 minutes of termination timestamp.",
        "keyClauses": [
          { "clauseNumber": "2.3", "title": "Pre-Employment Screening", "text": "Identity and criminal record screening must be completed 5 business days before official start." },
          { "clauseNumber": "4.1", "title": "Mandatory Compliance Training", "text": "New personnel must achieve passing grades on Information Security and PII courses within 14 calendar days." },
          { "clauseNumber": "7.2", "title": "Account Revocation SLA", "text": "IT Identity Governance must revoke active directory credentials within 60 minutes of exit notice." }
        ],
        "changelogNotes": "Incorporated automated Okta lifecycle provisioning and 60-minute revocation SLA."
      }
    ]
  },
  {
    "id": "POL-FIN-001",
    "title": "Corporate Expense Reimbursement Policy",
    "category": "Finance & Travel",
    "ownerDepartment": "Finance & Accounting",
    "currentVersion": "v2.2",
    "lastReviewedDate": "2024-05-15",
    "nextReviewDate": "2025-05-15",
    "status": "Active",
    "scope": "All employees submitting out-of-pocket or corporate card expenses",
    "tags": ["expenses", "receipts", "meals", "per diem", "approval limits"],
    "versions": [
      {
        "version": "v1.0",
        "effectiveDate": "2022-04-10",
        "approvedBy": "Evelyn Vance",
        "approverRole": "Chief Financial Officer",
        "summary": "Baseline expense policy requiring paper or scan receipts for all items over $25.",
        "fullContent": "Employees must submit business expenses within 30 days of incurrence. Receipts required for all expenses exceeding $25.",
        "keyClauses": [
          { "clauseNumber": "2.1", "title": "Submission Window", "text": "Expense reports must be submitted via Concur within 30 days of the transaction date." },
          { "clauseNumber": "3.1", "title": "Receipt Substantiation Threshold", "text": "Itemized receipts are mandatory for any individual line item exceeding $25 USD." }
        ],
        "changelogNotes": "Initial expense rules."
      },
      {
        "version": "v2.0",
        "effectiveDate": "2023-11-01",
        "supersedesVersion": "v1.0",
        "approvedBy": "Evelyn Vance",
        "approverRole": "Chief Financial Officer",
        "summary": "Digital receipt digitization, modern approval tiers, and meal allowance caps.",
        "fullContent": "All expense reports must be submitted within 45 days. Itemized receipts required for items over $35. Meal per diems capped at $65/day for local business events.",
        "keyClauses": [
          { "clauseNumber": "2.1", "title": "Submission Window", "text": "Reports must be submitted within 45 days of transaction." },
          { "clauseNumber": "4.2", "title": "Daily Meal Allowance Cap", "text": "Daily meal expenses incurred during business activities capped at $65 per person per day." }
        ],
        "changelogNotes": "Relaxed receipt threshold to $35 and updated meal limits."
      },
      {
        "version": "v2.2",
        "effectiveDate": "2024-05-15",
        "supersedesVersion": "v2.0",
        "approvedBy": "Evelyn Vance",
        "approverRole": "Chief Financial Officer",
        "summary": "Current corporate expense guideline: $50 receipt threshold and $75 daily meal cap.",
        "fullContent": "FinNova requires corporate credit card usage for all travel and operational purchases where feasible. Out-of-pocket expense claims must be logged within 45 days of purchase.\n\nSection 3: Receipts - Itemized receipts required for all expenses of $50 or more. Credit card statements alone are insufficient.\nSection 4: Meals - Meals during general business meetings and single-day travel are capped at $75 per diem.",
        "keyClauses": [
          { "clauseNumber": "3.1", "title": "Itemized Receipt Requirement", "text": "Legible itemized receipts showing VAT/tax breakdown are mandatory for any purchase equal to or exceeding $50 USD." },
          { "clauseNumber": "4.2", "title": "Daily Meal Allowance Cap", "text": "Daily expenditure on meals during company business is strictly capped at $75 USD per employee per day." },
          { "clauseNumber": "5.2", "title": "Approval Hierarchy", "text": "Expenses under $1,000 require manager approval; $1,000-$5,000 require Department VP approval; over $5,000 require CFO signoff." }
        ],
        "changelogNotes": "Raised receipt threshold to $50 and meal cap to $75."
      }
    ]
  },
  {
    "id": "POL-FIN-002",
    "title": "Vendor Procurement & Third-Party Diligence",
    "category": "Finance & Travel",
    "ownerDepartment": "Finance & Procurement",
    "currentVersion": "v2.0",
    "lastReviewedDate": "2024-02-15",
    "nextReviewDate": "2025-02-15",
    "status": "Active",
    "scope": "All contracts, software licenses, and third-party vendor engagements",
    "tags": ["procurement", "vendor", "contracts", "soc2", "rfp", "bidding"],
    "versions": [
      {
        "version": "v2.0",
        "effectiveDate": "2024-02-15",
        "approvedBy": "Evelyn Vance",
        "approverRole": "Chief Financial Officer",
        "summary": "Comprehensive vendor risk tiering, competitive bidding thresholds, and InfoSec SOC-2 certification requirements.",
        "fullContent": "Any contract involving annual expenditure exceeding $25,000 requires minimum three (3) competitive vendor bids or an approved single-source justification form signed by the CFO.\n\nAll software vendors processing FinNova confidential data must furnish an independent SOC 2 Type II or ISO 27001 audit report within the preceding 12 months.",
        "keyClauses": [
          { "clauseNumber": "2.1", "title": "Competitive Bidding Threshold", "text": "Procurements over $25,000 ARR must solicit at least 3 formal competitive proposals." },
          { "clauseNumber": "3.4", "title": "Security Audit Verification", "text": "SaaS and cloud providers handling corporate data must present valid SOC 2 Type II certification dated within 12 months." },
          { "clauseNumber": "5.1", "title": "Contract Signature Authority", "text": "Only authorized corporate officers (VP Legal, CFO, CEO) are legally empowered to execute binding vendor agreements." }
        ],
        "changelogNotes": "Mandated SOC-2 verification for all SaaS contracts and strict auto-renew notice."
      }
    ]
  },
  {
    "id": "POL-FIN-003",
    "title": "Global Business Travel & Subsistence Policy",
    "category": "Finance & Travel",
    "ownerDepartment": "Finance & Travel Services",
    "currentVersion": "v2.1",
    "lastReviewedDate": "2024-04-10",
    "nextReviewDate": "2025-04-10",
    "status": "Active",
    "scope": "All employees undertaking domestic and international travel for FinNova business",
    "tags": ["travel", "flights", "hotels", "per diem", "meals", "booking"],
    "versions": [
      {
        "version": "v2.1",
        "effectiveDate": "2024-04-10",
        "approvedBy": "Evelyn Vance",
        "approverRole": "Chief Financial Officer",
        "summary": "Travel booking windows, class of travel, and dedicated $100 travel subsistence allowance.",
        "fullContent": "All travel must be booked through the corporate travel partner at least 14 days in advance for domestic journeys and 21 days for international journeys.\n\nSection 3: Travel Subsistence - Due to elevated dining costs while traveling away from home base, employees receive a meal and incidental allowance of up to $100 USD per day for overnight travel.\nSection 4: Lodging - Maximum $220/night in Tier 2 cities, $350/night in Tier 1 metropolitans (NYC, London, Tokyo, SF).",
        "keyClauses": [
          { "clauseNumber": "1.2", "title": "Advance Booking Lead Time", "text": "Domestic travel must be reserved minimum 14 days in advance; international flights minimum 21 days in advance." },
          { "clauseNumber": "2.3", "title": "Flight Cabin Class Rules", "text": "Economy is standard for all trips under 6 hours; Premium Economy for flights 6-10 hours; Business class only permitted above 10 hours with EVP pre-clearance." },
          { "clauseNumber": "3.1", "title": "Travel Meal Subsistence Cap", "text": "Employees on authorized overnight business travel are granted a meal and incidental allowance of up to $100 USD per day." },
          { "clauseNumber": "4.2", "title": "Hotel Cost Ceilings", "text": "Lodging is capped at $220/night standard, or $350/night in designated Tier-1 financial centers." }
        ],
        "changelogNotes": "Updated travel allowance to $100 per day for travel and established Tier-1 city caps."
      }
    ]
  },
  {
    "id": "POL-SEC-001",
    "title": "Enterprise Information Security Standards",
    "category": "Security & Infosec",
    "ownerDepartment": "Information Security & CISO",
    "currentVersion": "v3.0",
    "lastReviewedDate": "2024-01-10",
    "nextReviewDate": "2025-01-10",
    "status": "Active",
    "scope": "Universal across all devices, cloud tenancies, networks, and personnel",
    "tags": ["infosec", "vpn", "encryption", "mfa", "passwords", "zero trust"],
    "versions": [
      {
        "version": "v1.0",
        "effectiveDate": "2021-09-01",
        "approvedBy": "Tariq Al-Mansoor",
        "approverRole": "Chief Information Security Officer",
        "summary": "Baseline infosec guidelines: 12-character passwords, annual password changes, optional VPN.",
        "fullContent": "Passwords must be 12 characters. VPN required when handling production banking data. Anti-virus definitions updated weekly.",
        "keyClauses": [
          { "clauseNumber": "1.1", "title": "Password Composition", "text": "Passwords must contain at least 12 alphanumeric characters." },
          { "clauseNumber": "2.4", "title": "Remote Access", "text": "VPN access required when accessing production database environments." }
        ],
        "changelogNotes": "Original enterprise infosec baseline."
      },
      {
        "version": "v2.0",
        "effectiveDate": "2023-01-15",
        "supersedesVersion": "v1.0",
        "approvedBy": "Tariq Al-Mansoor",
        "approverRole": "Chief Information Security Officer",
        "summary": "Phishing-resistant MFA (FIDO2) mandate, full-disk BitLocker/FileVault encryption.",
        "fullContent": "FIDO2 hardware keys or biometric Passkeys required for SSO. Full-disk encryption mandatory on all laptops. Session timeouts set at 15 minutes of inactivity.",
        "keyClauses": [
          { "clauseNumber": "1.2", "title": "Multi-Factor Authentication", "text": "Hardware or biometric phishing-resistant MFA required for all cloud infrastructure." },
          { "clauseNumber": "3.1", "title": "Full Disk Encryption", "text": "All endpoint laptops must maintain active BitLocker or FileVault 256-bit AES encryption." }
        ],
        "changelogNotes": "Introduced FIDO2 MFA and mandatory disk encryption."
      },
      {
        "version": "v3.0",
        "effectiveDate": "2024-01-10",
        "supersedesVersion": "v2.0",
        "approvedBy": "Board of Directors & Tariq Al-Mansoor",
        "approverRole": "CISO & Audit Committee Chair",
        "summary": "Zero Trust architecture, mandatory GlobalProtect Always-On VPN, and strict peripheral blocking.",
        "fullContent": "FinNova enforces an uncompromising Zero Trust security posture. All company-managed workstations, laptops, and mobile devices must route 100% of network traffic through GlobalProtect Always-On VPN with zero exemptions, regardless of whether access is for internal services or external cloud applications.",
        "keyClauses": [
          { "clauseNumber": "2.4", "title": "Mandatory Tunneling & External Network Access", "text": "All company-managed devices connecting from external networks must route 100% of network traffic through GlobalProtect Always-On VPN with zero exceptions." },
          { "clauseNumber": "3.3", "title": "Removable Media Block", "text": "USB mass storage and unauthorized external peripheral storage devices are strictly blocked by endpoint DLP." },
          { "clauseNumber": "4.1", "title": "Cryptographic Standards", "text": "All corporate communications must utilize TLS 1.3; sensitive databases require AES-256 transparent column encryption." }
        ],
        "changelogNotes": "Implemented Zero Trust Always-On VPN mandate approved by Board of Directors."
      }
    ]
  },
  {
    "id": "POL-SEC-002",
    "title": "Access Control & Privileged Identity Governance",
    "category": "Security & Infosec",
    "ownerDepartment": "Information Security & CISO",
    "currentVersion": "v2.0",
    "lastReviewedDate": "2023-12-05",
    "nextReviewDate": "2024-12-05",
    "status": "Active",
    "scope": "All cloud accounts, databases, source control, and infrastructure roles",
    "tags": ["access control", "rbac", "pam", "jit access", "least privilege"],
    "versions": [
      {
        "version": "v2.0",
        "effectiveDate": "2023-12-05",
        "approvedBy": "Tariq Al-Mansoor",
        "approverRole": "Chief Information Security Officer",
        "summary": "Role-Based Access Control (RBAC), Just-In-Time (JIT) elevation, and quarterly access reviews.",
        "fullContent": "Access must be governed by Principle of Least Privilege. Permanent administrative privileges on production clusters are forbidden. Production access must be granted via JIT access requests lasting no more than 4 hours, requiring dual-engineer signoff.",
        "keyClauses": [
          { "clauseNumber": "1.2", "title": "Least Privilege Enforcement", "text": "Users are provisioned only the minimal entitlements necessary for their verified job role." },
          { "clauseNumber": "3.1", "title": "Just-In-Time (JIT) Privileged Access", "text": "Production administrative access is restricted to ephemeral tokens expiring within 4 hours, requiring secondary approval." },
          { "clauseNumber": "5.4", "title": "Account Inactivity Threshold", "text": "Accounts dormant for more than 45 days will be disabled automatically by identity governance engines." }
        ],
        "changelogNotes": "Deprecating permanent AWS root/admin privileges in favor of JIT PAM."
      }
    ]
  },
  {
    "id": "POL-SEC-003",
    "title": "Enterprise Data Classification & Handling",
    "category": "Security & Infosec",
    "ownerDepartment": "Data Governance & CISO",
    "currentVersion": "v1.5",
    "lastReviewedDate": "2024-02-01",
    "nextReviewDate": "2025-02-01",
    "status": "Active",
    "scope": "All data created, processed, transmitted, or stored by FinNova systems",
    "tags": ["data classification", "confidential", "pii", "secret", "retention", "dlp"],
    "versions": [
      {
        "version": "v1.5",
        "effectiveDate": "2024-02-01",
        "approvedBy": "Tariq Al-Mansoor",
        "approverRole": "Chief Information Security Officer",
        "summary": "Four-tier data classification model: Public, Internal, Confidential, and Restricted/PII.",
        "fullContent": "All information assets must be classified into one of four tiers: Public, Internal, Confidential, Restricted/PII. Restricted data may never be exported to unencrypted storage or personal devices. Masking or tokenization is mandatory during non-production testing.",
        "keyClauses": [
          { "clauseNumber": "1.3", "title": "Four Tier Data Schema", "text": "Data must be tagged as Public, Internal, Confidential, or Restricted." },
          { "clauseNumber": "3.2", "title": "Handling of Restricted & PII Data", "text": "PII and Restricted assets must be encrypted at rest and in transit; pseudonymization is mandatory in analytics." },
          { "clauseNumber": "4.4", "title": "Data Loss Prevention (DLP) Triggers", "text": "Outbound emails containing unencrypted SSN, credit cards, or customer banking details are automatically quarantined." }
        ],
        "changelogNotes": "Aligned classification schema with GDPR, CCPA, and SOC 2 Type II controls."
      }
    ]
  },
  {
    "id": "POL-SEC-004",
    "title": "Cybersecurity Incident Response & Escalation",
    "category": "Security & Infosec",
    "ownerDepartment": "Information Security & CISO",
    "currentVersion": "v2.0",
    "lastReviewedDate": "2024-03-20",
    "nextReviewDate": "2025-03-20",
    "status": "Active",
    "scope": "All security events, data breaches, vulnerability discoveries, and outages",
    "tags": ["incident response", "breach", "security severity", "war room", "archiving"],
    "versions": [
      {
        "version": "v2.0",
        "effectiveDate": "2024-03-20",
        "approvedBy": "Tariq Al-Mansoor",
        "approverRole": "Chief Information Security Officer",
        "summary": "Severity tiering (SEV-1 to SEV-4), 15-minute response SLA for SEV-1, and 365-day communication archiving.",
        "fullContent": "Any suspected compromise must be reported immediately to security@finnova.internal. All incident war-room channels, logs, chat transcripts, and forensic snapshots must be preserved and archived for a minimum of 365 days post-incident resolution to support regulatory and insurance audits.",
        "keyClauses": [
          { "clauseNumber": "2.1", "title": "Initial Reporting Window", "text": "Employees discovering potential security compromises must notify the SOC within 15 minutes." },
          { "clauseNumber": "4.2", "title": "SEV-1 Executive Escalation", "text": "Critical incidents involving customer data require CEO and General Counsel notification within 60 minutes." },
          { "clauseNumber": "6.1", "title": "Incident Communication Archiving SLA", "text": "Incident war-room channels, forensic captures, and communication logs must be archived for a minimum of 365 days post-incident resolution." }
        ],
        "changelogNotes": "Codified 365-day mandatory retention for all incident response channels and legal hold protocols."
      }
    ]
  },
  {
    "id": "POL-LEG-001",
    "title": "Corporate Document Retention & Destruction Schedule",
    "category": "Legal & Compliance",
    "ownerDepartment": "Legal & Regulatory Compliance",
    "currentVersion": "v1.3",
    "lastReviewedDate": "2023-08-01",
    "nextReviewDate": "2024-08-01",
    "status": "Active",
    "scope": "All physical and digital records generated in the course of company business",
    "tags": ["document retention", "purging", "legal hold", "slack", "email retention"],
    "versions": [
      {
        "version": "v1.0",
        "effectiveDate": "2020-05-01",
        "approvedBy": "Arthur Pendelton",
        "approverRole": "General Counsel",
        "summary": "Standard 7-year retention for tax/financials; 30-day default for chat logs.",
        "fullContent": "Tax records maintained 7 years. Internal employee chat records kept for 30 days before auto-pruning.",
        "keyClauses": [
          { "clauseNumber": "1.1", "title": "Tax Records", "text": "Financial and tax ledgers preserved for seven years." },
          { "clauseNumber": "2.2", "title": "Ephemeral Messaging", "text": "Chat logs purged after 30 days." }
        ],
        "changelogNotes": "First corporate document retention schedule."
      },
      {
        "version": "v1.3",
        "effectiveDate": "2023-08-01",
        "supersedesVersion": "v1.0",
        "approvedBy": "Arthur Pendelton",
        "approverRole": "General Counsel",
        "summary": "Standard retention schedules: Financial records 7 years, Contracts 10 years, Ephemeral messaging 90 days.",
        "fullContent": "FinNova enforces automated digital hygiene to minimize discovery liability.\n\nSection 1: General Ledgers & Tax - Retained for seven (7) years following tax filing.\nSection 2: Internal Collaboration Tools - Internal ephemeral communication channels (Slack/Teams) shall be automatically purged every 90 days, unless an explicit Legal Hold order has been served.",
        "keyClauses": [
          { "clauseNumber": "1.4", "title": "Statutory Financial Retention", "text": "Tax filings, audited statements, and board minutes must be retained for seven full calendar years." },
          { "clauseNumber": "2.2", "title": "Automated Ephemeral Messaging Purge", "text": "Internal ephemeral communication channels (Slack/Teams) shall be purged every 90 days." },
          { "clauseNumber": "5.1", "title": "Legal Hold Supremacy", "text": "In the event of active litigation or subpoena, the Legal Hold order suspends all automated purging routines for affected custodians." }
        ],
        "changelogNotes": "Adjusted Slack chat retention from 30 to 90 days and codified Legal Hold workflow."
      }
    ]
  },
  {
    "id": "POL-PRIV-001",
    "title": "Global Employee & Client Privacy Protection",
    "category": "Legal & Compliance",
    "ownerDepartment": "Privacy Office & Legal",
    "currentVersion": "v2.0",
    "lastReviewedDate": "2024-01-25",
    "nextReviewDate": "2025-01-25",
    "status": "Active",
    "scope": "All processing of personal data across global employees, contractors, and customers",
    "tags": ["privacy", "gdpr", "ccpa", "data protection", "pii", "anonymization", "crypto"],
    "versions": [
      {
        "version": "v2.0",
        "effectiveDate": "2024-01-25",
        "approvedBy": "Elena Rostova",
        "approverRole": "Chief Privacy Officer",
        "summary": "Privacy-by-design, client-side PII sanitization for AI queries, cryptographic audit trails, and strict purpose limitation.",
        "fullContent": "FinNova upholds privacy as a non-negotiable core value.\n\nSection 1: Privacy by Design - Any AI or query interface must filter employee identifiers (emails, employee IDs, phone numbers) prior to processing.\nSection 2: Immutable Cryptographic Audit Trails - All data processing decisions and sanitization events must log cryptographic hashes to a tamper-evident audit ledger.\nSection 4: K-Anonymity Threshold - Group analytics across employee datasets must adhere to a minimum cohort of five (5) distinct individuals to prevent reverse identification.",
        "keyClauses": [
          { "clauseNumber": "1.2", "title": "Client-Side AI Query Sanitization", "text": "Personal identifiers including names, email addresses, phone numbers, and employee numbers must be sanitized before processing." },
          { "clauseNumber": "2.3", "title": "Cryptographic Audit Receipts", "text": "Sanitization events must produce cryptographic SHA-256 receipts verifiable by compliance officers." },
          { "clauseNumber": "4.1", "title": "K-Anonymity Reporting Minimum", "text": "Workforce analytics aggregations must suppress metrics for any demographic or departmental subgroup containing fewer than five individuals." }
        ],
        "changelogNotes": "Codified mandatory client-side AI sanitization and k-anonymity cohort threshold of 5 individuals."
      }
    ]
  }
]

SYNTHETIC_CONFLICTS = [
  {
    "id": "CONF-001",
    "title": "Travel Subsistence Meal Cap vs General Expense Limit",
    "severity": "Medium",
    "policyA": {
      "id": "POL-FIN-001",
      "version": "v2.2",
      "clauseNumber": "4.2",
      "statement": "Daily expenditure on meals during company business is strictly capped at $75 USD per employee per day."
    },
    "policyB": {
      "id": "POL-FIN-003",
      "version": "v2.1",
      "clauseNumber": "3.1",
      "statement": "Employees on authorized overnight business travel are granted a meal and incidental allowance of up to $100 USD per day."
    },
    "conflictDescription": "POL-FIN-001 sets a rigid $75/day ceiling for all meal claims, whereas POL-FIN-003 authorizes up to $100/day specifically for overnight travel. Without programmatic differentiation, finance expense processors reject legitimate $90 travel dining claims.",
    "resolutionStatus": "Resolved By Precedence",
    "precedenceRule": "Lex specialis derogat legi generali: The specific Travel Policy (POL-FIN-003) governs overnight business travel subsistence, superseding the general operational expense policy (POL-FIN-001) for travel itineraries with overnight hotel stays.",
    "recommendedAction": "Automate rule hierarchy in Concur: if an itinerary contains an associated lodging booking or travel request ID, apply the $100 travel threshold; otherwise enforce the standard $75 meeting meal cap.",
    "affectedDepartments": ["Sales & Business Dev", "Customer Success", "Executive Leadership", "Engineering"]
  },
  {
    "id": "CONF-002",
    "title": "Home Network Exemption vs Zero Trust Always-On VPN Mandate",
    "severity": "Critical",
    "policyA": {
      "id": "POL-HR-001",
      "version": "v2.0",
      "clauseNumber": "5.3",
      "statement": "Employees may connect personal peripheral equipment and use standard residential Wi-Fi without VPN for low-risk collaboration tools (Slack/Notion)."
    },
    "policyB": {
      "id": "POL-SEC-001",
      "version": "v3.0",
      "clauseNumber": "2.4",
      "statement": "All company-managed devices connecting from external networks must route 100% of network traffic through GlobalProtect Always-On VPN with zero exceptions."
    },
    "conflictDescription": "The HR Remote Work Framework suggests employees can browse Slack and Notion over residential Wi-Fi without VPN, contradicting the Board-approved Zero Trust Information Security Standard which mandates 100% full-tunnel VPN encryption on all corporate endpoints.",
    "resolutionStatus": "Resolved By Precedence",
    "precedenceRule": "FinNova Corporate Governance Charter Section 4.2: Board-approved Information Security Standards (POL-SEC-001) possess absolute institutional supremacy over department-level HR operational frameworks.",
    "recommendedAction": "Maintain MDM enforcement of GlobalProtect Always-On VPN across 100% of fleet. Issue an administrative erratum to POL-HR-001 Clause 5.3 to eliminate misleading residential Wi-Fi exemptions.",
    "affectedDepartments": ["All Remote Staff", "People Operations", "Information Security", "IT Operations"]
  },
  {
    "id": "CONF-003",
    "title": "Ephemeral Chat 90-Day Purge vs 365-Day Incident War Room Archiving",
    "severity": "High",
    "policyA": {
      "id": "POL-LEG-001",
      "version": "v1.3",
      "clauseNumber": "2.2",
      "statement": "Internal ephemeral communication channels (Slack/Teams) shall be purged every 90 days."
    },
    "policyB": {
      "id": "POL-SEC-004",
      "version": "v2.0",
      "clauseNumber": "6.1",
      "statement": "Incident war-room channels, forensic captures, and communication logs must be archived for a minimum of 365 days post-incident resolution."
    },
    "conflictDescription": "The legal automated document destruction schedule executes an indiscriminate 90-day deletion across corporate Slack channels, risking premature destruction of SEV-1 and SEV-2 cybersecurity incident investigation war rooms required for 1-year regulatory compliance.",
    "resolutionStatus": "Requires Human Review",
    "precedenceRule": "Undetermined Precedence: Automated retention API lacks an automated webhook bridge between the Incident Response ticketing system and Slack retention exemptions without manual legal hold issuance.",
    "recommendedAction": "Convene Joint Legal-Security Working Group: Implement an automated integration that applies Slack Legal Hold tags to any channel matching '#incident-sev*' upon ticket creation, preventing automated purge routines.",
    "affectedDepartments": ["Information Security & SOC", "Legal & Regulatory Compliance", "DevOps & Infrastructure"]
  }
]

SYNTHETIC_DECISIONS = [
  {
    "id": "DEC-2024-089",
    "title": "Distributed Engineering Pod Ergonomic & Broadband Grant",
    "department": "Engineering & Product",
    "date": "2024-03-12",
    "ownerName": "Devon Zhao",
    "ownerRole": "VP of Infrastructure Engineering",
    "status": "Approved",
    "businessContext": "Following the closure of the secondary Austin regional facility, 42 backend engineers transitioned to permanent Remote-First classification. Under POL-HR-001 v2.0, equipment and connectivity stipends were authorized.",
    "decisionSummary": "Authorized a one-time $800 home workspace ergonomic upgrade and $75/mo internet subsidy for 42 newly re-designated Remote-First engineers, citing POL-HR-001 v2.0 Clause 2.2.",
    "relevantPolicyIds": [
      {
        "policyId": "POL-HR-001",
        "versionUsed": "v2.0",
        "clauseCited": "Clause 2.2 (Home Office & Broadband Reimbursement)"
      },
      {
        "policyId": "POL-SEC-001",
        "versionUsed": "v3.0",
        "clauseCited": "Clause 2.4 (Mandatory Always-On Tunneling)"
      }
    ],
    "supportingEvidence": [
      {
        "id": "EVD-089-1",
        "type": "Cost-Benefit Model",
        "title": "Austin Facility Lease Termination vs Remote Stipend Net Savings",
        "summary": "Direct facility savings of $340k annually against one-off equipment grant of $33.6k and recurring broadband of $37.8k/yr.",
        "sourceDocument": "FIN-AUDIT-2024-AUSTIN-OPEX.pdf"
      }
    ],
    "rationale": "Transition aligns with FinNova 2024 distributed workforce roadmap. Stipend adheres strictly to policy maximums without executive escalation.",
    "impactMetrics": [
      { "metricName": "Annual OpEx Reduction", "value": "$268,600", "change": "+18%" },
      { "metricName": "Employee Satisfaction Score", "value": "94%", "change": "+12%" }
    ],
    "relatedDecisionIds": ["DEC-2024-201"]
  },
  {
    "id": "DEC-2024-112",
    "title": "Emergency Cloud Security Telemetry Vendor Fast-Track",
    "department": "Information Security & CISO",
    "date": "2024-04-05",
    "ownerName": "Tariq Al-Mansoor",
    "ownerRole": "Chief Information Security Officer",
    "status": "Approved",
    "businessContext": "Urgent vulnerability patch in production Kubernetes ingress required deployment of specialized real-time eBPF runtime threat detection.",
    "decisionSummary": "Approved single-source procurement under POL-FIN-002 v2.0 Clause 2.1 exception clause, expediting vendor contract with immediate CFO and Legal pre-clearance.",
    "relevantPolicyIds": [
      {
        "policyId": "POL-FIN-002",
        "versionUsed": "v2.0",
        "clauseCited": "Clause 2.1 (Competitive Bidding Exception)"
      }
    ],
    "supportingEvidence": [
      {
        "id": "EVD-112-1",
        "type": "Legal Review",
        "title": "Vendor SOC 2 Type II Independent Audit Verification",
        "summary": "PricewaterhouseCoopers SOC 2 Type II report for Vendor inspected and verified with zero material exceptions.",
        "sourceDocument": "DATADOG-SOC2-REPORT-2023.pdf"
      }
    ],
    "rationale": "Delay in competitive RFP would prolong cluster vulnerability window beyond the 15-minute SLA threshold defined in incident policy.",
    "impactMetrics": [
      { "metricName": "Mean Time to Detect (MTTD)", "value": "42 seconds", "change": "-84%" }
    ],
    "relatedDecisionIds": ["DEC-2024-167"]
  }
]

SYNTHETIC_PRACTICES = [
  {
    "id": "PRAC-001",
    "department": "Sales & Business Dev",
    "policyId": "POL-FIN-001",
    "policyName": "Corporate Expense Reimbursement (Receipt Substantiation)",
    "metricName": "Itemized Receipt Attachment Rate (>=$50)",
    "targetComplianceRate": 98,
    "actualComplianceRate": 74,
    "period": "2024-Q3",
    "observedCount": 420,
    "samplePersonCount": 38,
    "driftStatus": "Severe Drift",
    "primaryRootCause": "Frequent travel and client dinners leading to delayed receipt collection; reliance on card-statement screenshots rather than itemized restaurant receipts.",
    "recommendedRemediation": "Deploy Navan mobile OCR instant-capture prompts after card swipe; block reimbursement submissions lacking itemized VAT breakdowns.",
    "historicalTrend": [
      { "month": "Apr", "target": 98, "actual": 95 },
      { "month": "May", "target": 98, "actual": 89 },
      { "month": "Jun", "target": 98, "actual": 83 },
      { "month": "Jul", "target": 98, "actual": 78 },
      { "month": "Aug", "target": 98, "actual": 76 },
      { "month": "Sep", "target": 98, "actual": 74 }
    ]
  },
  {
    "id": "PRAC-007",
    "department": "Executive Leadership Office",
    "policyId": "POL-SEC-001",
    "policyName": "Enterprise Information Security (Hardware Security Keys)",
    "metricName": "FIDO2 Hardware Key Physical Usage",
    "targetComplianceRate": 100,
    "actualComplianceRate": 75,
    "period": "2024-Q3",
    "observedCount": 16,
    "samplePersonCount": 4, # UNDER THRESHOLD (k < 5)
    "driftStatus": "Moderate Drift",
    "primaryRootCause": "Frequent travel leading to occasional SMS fallback.",
    "recommendedRemediation": "Data suppressed for privacy: minimum cohort size is 5 individuals.",
    "historicalTrend": [
      { "month": "Apr", "target": 100, "actual": 100 },
      { "month": "Sep", "target": 100, "actual": 75 }
    ]
  }
]

SEED_AUDIT_DRAFTS = [
  {
    "eventType": "POLICY_ACCESS",
    "actorId": "SYSTEM-GENESIS",
    "actorRole": "Root Security Anchor",
    "summary": "FinNova Cryptographic Audit Ledger Initialized (Web Crypto SHA-256 Chain)",
    "metadataPayload": {
      "engineVersion": "2.4.0",
      "securityStandard": "FIPS 180-4 SHA-256",
      "environment": "Demonstration Prototype"
    }
  },
  {
    "eventType": "PII_SHIELD_APPLIED",
    "actorId": "SVC-QUESTION-SHIELD-01",
    "actorRole": "Automated Privacy Gateway",
    "summary": "Detected and masked 2 PII entities (Email, Employee ID) in executive inquiry",
    "metadataPayload": {
      "sanitizedTokensCount": 2,
      "riskLevel": "Elevated",
      "processingTimeMs": 14,
      "algorithm": "Client-Side Regex + Named Dictionary"
    }
  },
  {
    "eventType": "POLICY_SUPERSEDED",
    "actorId": "EXEC-CISO-TARIQ",
    "actorRole": "Chief Information Security Officer",
    "summary": "Activated POL-SEC-001 v3.0 (Zero Trust Always-On VPN) superseding v2.0",
    "metadataPayload": {
      "policyId": "POL-SEC-001",
      "oldVersion": "v2.0",
      "newVersion": "v3.0",
      "boardResolutionId": "RES-2024-INF-09"
    }
  },
  {
    "eventType": "POLICY_ACCESS",
    "actorId": "USR-DEV-0881",
    "actorRole": "Senior Staff Engineer",
    "summary": "Retrieved POL-HR-001 v2.0 Clause 2.2 for remote broadband reimbursement check",
    "metadataPayload": {
      "policyId": "POL-HR-001",
      "version": "v2.0",
      "retrievalLatencyMs": 8,
      "queryMatchScore": 0.94
    }
  },
  {
    "eventType": "QUESTION_SANITIZATION",
    "actorId": "SVC-QUESTION-SHIELD-01",
    "actorRole": "Automated Privacy Gateway",
    "summary": "Question sanitized before local retrieval: Personal names replaced with [PERSON_1]",
    "metadataPayload": {
      "tokensReplaced": 1,
      "targetEntity": "NAME",
      "zeroRetentionConfirmed": True
    }
  }
]
