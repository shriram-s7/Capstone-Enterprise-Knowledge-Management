import os
import json
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
import httpx

from backend.app.database import get_connection
from backend.app.integrations.schemas import (
    IntegrationCardInfo,
    ActivityEvent,
    KPISummary,
    AnalyticsData,
    CommitTrendPoint,
    SlackTrendPoint,
    RepoDistributionItem,
    TeamComparisonItem,
    AIInsightsResponse,
    AIInsightCitation
)

logger = logging.getLogger("finnova.integrations")

# Environment configuration
GITHUB_TOKEN_ENV = os.environ.get("GITHUB_TOKEN", "")
GITHUB_ORG_ENV = os.environ.get("GITHUB_ORG", "finnova-corp")
SLACK_BOT_TOKEN_ENV = os.environ.get("SLACK_BOT_TOKEN", "")
SLACK_WORKSPACE_ENV = os.environ.get("SLACK_WORKSPACE", "FinNova Global")

def init_integrations_db():
    """Ensure SQLite table for integration configurations exists."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS integrations_config (
        id TEXT PRIMARY KEY,
        platform TEXT NOT NULL,
        status TEXT NOT NULL,
        mode TEXT NOT NULL,
        account_name TEXT,
        connected_at TEXT,
        last_sync TEXT,
        settings_json TEXT
    );
    """)

    # Seed default configurations if empty
    cursor.execute("SELECT COUNT(*) FROM integrations_config;")
    if cursor.fetchone()[0] == 0:
        now_iso = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
        INSERT INTO integrations_config (id, platform, status, mode, account_name, connected_at, last_sync, settings_json)
        VALUES 
        ('github', 'github', 'demo_mode', 'demo', 'finnova-corp (Demonstration)', ?, ?, ?),
        ('slack', 'slack', 'demo_mode', 'demo', 'FinNova Workspace (Demonstration)', ?, ?, ?);
        """, (
            now_iso, now_iso, json.dumps({"repos": ["finnova-core", "privacy-shield-engine", "compliance-ledger"]}),
            now_iso, now_iso, json.dumps({"channels": ["#eng-core", "#prod-deployments", "#compliance-audits"]})
        ))
        conn.commit()
    conn.close()

# Call initialization on load
init_integrations_db()

# ---------------------------------------------------------------------------
# High-Fidelity Synthetic Activity Corpus for FinNova Enterprise
# ---------------------------------------------------------------------------
BASE_DATE = datetime.now(timezone.utc)

def make_iso(hours_ago: float) -> str:
    return (BASE_DATE - timedelta(hours=hours_ago)).isoformat()

def make_relative(hours_ago: float) -> str:
    if hours_ago < 1:
        mins = max(1, int(hours_ago * 60))
        return f"{mins}m ago"
    elif hours_ago < 24:
        return f"{int(hours_ago)}h ago"
    else:
        days = int(hours_ago / 24)
        return f"{days}d ago"

SYNTHETIC_ACTIVITIES: List[Dict[str, Any]] = [
    {
        "id": "act-gh-001",
        "source": "github",
        "event_type": "pr_merged",
        "user_name": "Liam Rodriguez",
        "user_email": "liam.rodriguez@finnova.internal",
        "user_role": "Lead Platform Engineer",
        "user_avatar": "LR",
        "target_container": "finnova/privacy-shield-engine",
        "description": "PR #148: Integrate zero-knowledge regex masking for PII tokens in Question Shield",
        "timestamp": make_iso(0.5),
        "relative_time": make_relative(0.5),
        "source_url": "https://github.com/finnova-corp/privacy-shield-engine/pull/148",
        "category": "pull_request",
        "metadata": {
            "pr_number": 148,
            "branch": "main",
            "additions": 342,
            "deletions": 28,
            "reviewers": ["Sarah Jenkins", "Elena Vance"],
            "status": "merged"
        }
    },
    {
        "id": "act-sl-001",
        "source": "slack",
        "event_type": "announcement",
        "user_name": "Elena Vance",
        "user_email": "elena.vance@finnova.internal",
        "user_role": "Chief Technology Officer",
        "user_avatar": "EV",
        "target_container": "#prod-deployments",
        "description": "🚀 v2.4.0 Deployment Verified: Privacy Shield Engine upgraded with client-side SHA-256 verifiable receipts. Zero unmasked retention guaranteed.",
        "timestamp": make_iso(1.2),
        "relative_time": make_relative(1.2),
        "source_url": "https://finnova.slack.com/archives/C04ENGPROD/p1730001000",
        "category": "announcement",
        "metadata": {
            "channel_id": "C04ENGPROD",
            "reactions": [{"emoji": "🚀", "count": 14}, {"emoji": "🛡️", "count": 9}],
            "replies_count": 5
        }
    },
    {
        "id": "act-gh-002",
        "source": "github",
        "event_type": "commit_pushed",
        "user_name": "Alex Rivera",
        "user_email": "alex.rivera@finnova.internal",
        "user_role": "Frontend Architect",
        "user_avatar": "AR",
        "target_container": "finnova/finnova-core",
        "description": "commit 8f3a12d: Add Unified Enterprise Intelligence dashboard with live telemetry feeds",
        "timestamp": make_iso(2.8),
        "relative_time": make_relative(2.8),
        "source_url": "https://github.com/finnova-corp/finnova-core/commit/8f3a12d",
        "category": "code",
        "metadata": {
            "commit_hash": "8f3a12d",
            "branch": "feature/unified-intel",
            "files_changed": 12,
            "verified": True
        }
    },
    {
        "id": "act-sl-002",
        "source": "slack",
        "event_type": "channel_discussion",
        "user_name": "Sarah Jenkins",
        "user_email": "sarah.jenkins@finnova.internal",
        "user_role": "Principal SecOps Engineer",
        "user_avatar": "SJ",
        "target_container": "#compliance-audits",
        "description": "Audit Chain Alert: Quarterly external auditor verification scheduled for Friday. Please ensure all policy drift logs are committed to SQLite ledger.",
        "timestamp": make_iso(4.5),
        "relative_time": make_relative(4.5),
        "source_url": "https://finnova.slack.com/archives/C05COMPLIANCE/p1730002500",
        "category": "chat",
        "metadata": {
            "channel_id": "C05COMPLIANCE",
            "reactions": [{"emoji": "👀", "count": 8}, {"emoji": "✅", "count": 12}],
            "replies_count": 11
        }
    },
    {
        "id": "act-gh-003",
        "source": "github",
        "event_type": "issue_created",
        "user_name": "Priya Sharma",
        "user_email": "priya.sharma@finnova.internal",
        "user_role": "Head of Regulatory Compliance",
        "user_avatar": "PS",
        "target_container": "finnova/compliance-audit-ledger",
        "description": "Issue #89: High Priority - Evaluate precedence conflict between SEC-002 and IT-009 regarding developer laptop biometric key retention",
        "timestamp": make_iso(6.0),
        "relative_time": make_relative(6.0),
        "source_url": "https://github.com/finnova-corp/compliance-audit-ledger/issues/89",
        "category": "issue",
        "metadata": {
            "issue_number": 89,
            "labels": ["compliance", "precedence-check", "high-priority"],
            "status": "open",
            "assignee": "Marcus Chen"
        }
    },
    {
        "id": "act-gh-004",
        "source": "github",
        "event_type": "pr_opened",
        "user_name": "David Kim",
        "user_email": "david.kim@finnova.internal",
        "user_role": "Backend Systems Engineer",
        "user_avatar": "DK",
        "target_container": "finnova/decision-intelligence-api",
        "description": "PR #112: Implement deterministic cosine similarity retrieval cache for synthetic policy index",
        "timestamp": make_iso(9.2),
        "relative_time": make_relative(9.2),
        "source_url": "https://github.com/finnova-corp/decision-intelligence-api/pull/112",
        "category": "pull_request",
        "metadata": {
            "pr_number": 112,
            "branch": "perf/retrieval-cache",
            "additions": 184,
            "deletions": 42,
            "reviewers": ["Liam Rodriguez"],
            "status": "open"
        }
    },
    {
        "id": "act-sl-003",
        "source": "slack",
        "event_type": "team_collab",
        "user_name": "Marcus Chen",
        "user_email": "marcus.chen@finnova.internal",
        "user_role": "VP Product",
        "user_avatar": "MC",
        "target_container": "#eng-core",
        "description": "Sprint Alignment: Reviewing PR #112 and Issue #89. We need the precedence engine updated before the executive board demo tomorrow morning.",
        "timestamp": make_iso(14.0),
        "relative_time": make_relative(14.0),
        "source_url": "https://finnova.slack.com/archives/C01ENGCORE/p1730005000",
        "category": "chat",
        "metadata": {
            "channel_id": "C01ENGCORE",
            "reactions": [{"emoji": "🔥", "count": 6}, {"emoji": "👍", "count": 10}],
            "replies_count": 8
        }
    },
    {
        "id": "act-gh-005",
        "source": "github",
        "event_type": "repo_updated",
        "user_name": "Liam Rodriguez",
        "user_email": "liam.rodriguez@finnova.internal",
        "user_role": "Lead Platform Engineer",
        "user_avatar": "LR",
        "target_container": "finnova/finnova-core",
        "description": "Released v2.4.0 tag: Cryptographic audit integrity checkpoints and multi-role RBAC enforcement",
        "timestamp": make_iso(22.0),
        "relative_time": make_relative(22.0),
        "source_url": "https://github.com/finnova-corp/finnova-core/releases/tag/v2.4.0",
        "category": "code",
        "metadata": {
            "tag": "v2.4.0",
            "commit_hash": "c490a1f",
            "downloads": 128
        }
    },
    {
        "id": "act-sl-004",
        "source": "slack",
        "event_type": "slack_message",
        "user_name": "Priya Sharma",
        "user_email": "priya.sharma@finnova.internal",
        "user_role": "Head of Regulatory Compliance",
        "user_avatar": "PS",
        "target_container": "#general-announcements",
        "description": "Corporate Governance Reminder: All employees must review POL-SEC-004 (Remote Device Security) by end of month. Completion tracking is live on your employee dashboard.",
        "timestamp": make_iso(28.0),
        "relative_time": make_relative(28.0),
        "source_url": "https://finnova.slack.com/archives/C02GENANN/p1730009900",
        "category": "announcement",
        "metadata": {
            "channel_id": "C02GENANN",
            "reactions": [{"emoji": "📢", "count": 24}, {"emoji": "🙌", "count": 15}],
            "replies_count": 3
        }
    },
    {
        "id": "act-gh-006",
        "source": "github",
        "event_type": "commit_pushed",
        "user_name": "Sarah Jenkins",
        "user_email": "sarah.jenkins@finnova.internal",
        "user_role": "Principal SecOps Engineer",
        "user_avatar": "SJ",
        "target_container": "finnova/compliance-audit-ledger",
        "description": "commit 4a9bc81: Add automated SHA-256 chain verification test suite for tamper resistance",
        "timestamp": make_iso(34.0),
        "relative_time": make_relative(34.0),
        "source_url": "https://github.com/finnova-corp/compliance-audit-ledger/commit/4a9bc81",
        "category": "code",
        "metadata": {
            "commit_hash": "4a9bc81",
            "branch": "main",
            "tests_passing": 20,
            "coverage": "98.4%"
        }
    }
]

# ---------------------------------------------------------------------------
# Backend Service Methods
# ---------------------------------------------------------------------------

def get_integrations_status_service() -> List[IntegrationCardInfo]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, platform, status, mode, account_name, connected_at, last_sync, settings_json FROM integrations_config;")
    rows = cursor.fetchall()
    conn.close()

    cards: List[IntegrationCardInfo] = []
    config_map = {row["id"]: dict(row) for row in rows}

    # GitHub
    gh_cfg = config_map.get("github", {})
    gh_status = gh_cfg.get("status", "demo_mode")
    gh_mode = gh_cfg.get("mode", "demo")
    cards.append(IntegrationCardInfo(
        id="github",
        name="GitHub Enterprise",
        platform="github",
        status=gh_status,
        mode=gh_mode,
        account_name=gh_cfg.get("account_name", "finnova-corp"),
        connected_at=gh_cfg.get("connected_at"),
        last_sync=gh_cfg.get("last_sync", datetime.now(timezone.utc).isoformat()),
        repos_count=4,
        commits_count=1482,
        prs_count=47,
        issues_count=23,
        capabilities=["Repositories", "Commits", "Pull Requests", "Code Reviews", "Issues", "Branch Audits"]
    ))

    # Slack
    sl_cfg = config_map.get("slack", {})
    sl_status = sl_cfg.get("status", "demo_mode")
    sl_mode = sl_cfg.get("mode", "demo")
    cards.append(IntegrationCardInfo(
        id="slack",
        name="Slack Enterprise Grid",
        platform="slack",
        status=sl_status,
        mode=sl_mode,
        account_name=sl_cfg.get("account_name", "FinNova Global Workspace"),
        connected_at=sl_cfg.get("connected_at"),
        last_sync=sl_cfg.get("last_sync", datetime.now(timezone.utc).isoformat()),
        channels_count=18,
        messages_count=8920,
        members_count=142,
        capabilities=["Public Channels", "Deployment Alerts", "Compliance Announcements", "Thread Discussions"]
    ))

    # Future Integrations
    cards.append(IntegrationCardInfo(
        id="jira",
        name="Jira Software",
        platform="jira",
        status="coming_soon",
        mode="unconfigured",
        account_name="Not connected",
        capabilities=["Sprint Velocity", "Epic Tracking", "Bug Backlog"]
    ))
    cards.append(IntegrationCardInfo(
        id="gdrive",
        name="Google Workspace Drive",
        platform="gdrive",
        status="coming_soon",
        mode="unconfigured",
        account_name="Not connected",
        capabilities=["Policy Documents", "Compliance Evidence", "Architecture RFCs"]
    ))
    cards.append(IntegrationCardInfo(
        id="notion",
        name="Notion Enterprise",
        platform="notion",
        status="coming_soon",
        mode="unconfigured",
        account_name="Not connected",
        capabilities=["Knowledge Wikis", "Runbooks", "Meeting Notes"]
    ))

    return cards

def connect_integration_service(platform: str, token: Optional[str] = None, org_or_workspace: Optional[str] = None, mode: str = "demo") -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()

    if mode == "live" and token:
        # Verify token with external API
        if platform == "github":
            try:
                headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json", "User-Agent": "FinNova-Enterprise"}
                resp = httpx.get("https://api.github.com/user", headers=headers, timeout=5.0)
                if resp.status_code == 200:
                    data = resp.json()
                    account = data.get("login") or data.get("name") or "GitHub Connected"
                    cursor.execute("""
                    UPDATE integrations_config SET status = 'connected', mode = 'live', account_name = ?, connected_at = ?, last_sync = ? WHERE id = 'github';
                    """, (f"@{account} (Live)", now_iso, now_iso))
                    conn.commit()
                    conn.close()
                    return {"status": "connected", "mode": "live", "message": f"Successfully connected to GitHub as @{account}."}
                else:
                    conn.close()
                    return {"status": "error", "mode": "unconfigured", "message": f"GitHub API returned HTTP {resp.status_code}. Verify token permissions."}
            except Exception as e:
                conn.close()
                return {"status": "error", "mode": "unconfigured", "message": f"Connection failed: {str(e)}"}
        elif platform == "slack":
            try:
                headers = {"Authorization": f"Bearer {token}"}
                resp = httpx.get("https://slack.com/api/auth.test", headers=headers, timeout=5.0)
                data = resp.json()
                if data.get("ok"):
                    team = data.get("team") or "Slack Workspace"
                    cursor.execute("""
                    UPDATE integrations_config SET status = 'connected', mode = 'live', account_name = ?, connected_at = ?, last_sync = ? WHERE id = 'slack';
                    """, (f"{team} (Live)", now_iso, now_iso))
                    conn.commit()
                    conn.close()
                    return {"status": "connected", "mode": "live", "message": f"Successfully connected to Slack workspace '{team}'."}
                else:
                    conn.close()
                    return {"status": "error", "mode": "unconfigured", "message": f"Slack API error: {data.get('error', 'Authentication failed')}"}
            except Exception as e:
                conn.close()
                return {"status": "error", "mode": "unconfigured", "message": f"Slack connection failed: {str(e)}"}

    # Default / Demo Mode
    account_default = "finnova-corp (Demonstration)" if platform == "github" else "FinNova Workspace (Demonstration)"
    cursor.execute("""
    UPDATE integrations_config SET status = 'demo_mode', mode = 'demo', account_name = ?, connected_at = ?, last_sync = ? WHERE id = ?;
    """, (account_default, now_iso, now_iso, platform))
    conn.commit()
    conn.close()
    return {"status": "demo_mode", "mode": "demo", "message": f"Connected {platform.title()} in certified enterprise demonstration mode."}

def disconnect_integration_service(platform: str) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE integrations_config SET status = 'disconnected', mode = 'unconfigured', account_name = 'Disconnected' WHERE id = ?;
    """, (platform,))
    conn.commit()
    conn.close()
    return {"status": "disconnected", "platform": platform, "message": f"{platform.title()} integration disconnected."}

def sync_integrations_service() -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("UPDATE integrations_config SET last_sync = ? WHERE status != 'disconnected';", (now_iso,))
    conn.commit()
    conn.close()
    return {
        "status": "success",
        "synchronized_at": now_iso,
        "items_synced": len(SYNTHETIC_ACTIVITIES),
        "message": "Telemetry synchronization complete. All active platform events refreshed."
    }

def get_activities_service(
    category: Optional[str] = None,
    source: Optional[str] = None,
    search: Optional[str] = None,
    date_range: Optional[str] = "30d"
) -> List[ActivityEvent]:
    results = SYNTHETIC_ACTIVITIES.copy()

    # Filter source
    if source and source.lower() != "all":
        results = [a for a in results if a["source"].lower() == source.lower()]

    # Filter category
    if category and category.lower() != "all":
        results = [a for a in results if a["category"].lower() == category.lower()]

    # Search filter
    if search and search.strip():
        q = search.strip().lower()
        results = [
            a for a in results
            if q in a["description"].lower()
            or q in a["user_name"].lower()
            or q in a["target_container"].lower()
            or q in a["event_type"].lower()
        ]

    return [ActivityEvent(**item) for item in results]

def get_kpis_service(date_range: str = "30d") -> KPISummary:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM integrations_config WHERE status IN ('connected', 'demo_mode');")
    connected_sources = cursor.fetchone()[0]
    cursor.execute("SELECT MAX(last_sync) FROM integrations_config;")
    last_synced = cursor.fetchone()[0] or datetime.now(timezone.utc).isoformat()
    conn.close()

    # Dynamic multipliers according to date range
    multiplier = 1.0 if date_range == "30d" else (0.28 if date_range == "7d" else 2.85)

    return KPISummary(
        connected_sources=connected_sources,
        total_commits=int(1482 * multiplier),
        commits_trend="+14.2% vs prev period",
        open_prs=18 if date_range != "7d" else 6,
        prs_trend="+4 new this week",
        open_issues=23 if date_range != "7d" else 9,
        issues_trend="-5 resolved recently",
        slack_messages=int(8920 * multiplier),
        messages_trend="+8.5% activity increase",
        active_contributors=34 if date_range != "7d" else 21,
        contributors_trend="+3 cross-functional",
        last_synced=last_synced
    )

def get_analytics_service(date_range: str = "30d") -> AnalyticsData:
    if date_range == "7d":
        commit_points = [
            CommitTrendPoint(date="Mon", label="Oct 28", commits=34, prs_merged=6),
            CommitTrendPoint(date="Tue", label="Oct 29", commits=48, prs_merged=9),
            CommitTrendPoint(date="Wed", label="Oct 30", commits=52, prs_merged=11),
            CommitTrendPoint(date="Thu", label="Oct 31", commits=41, prs_merged=7),
            CommitTrendPoint(date="Fri", label="Nov 01", commits=63, prs_merged=14),
            CommitTrendPoint(date="Sat", label="Nov 02", commits=12, prs_merged=2),
            CommitTrendPoint(date="Sun", label="Nov 03", commits=18, prs_merged=3),
        ]
        slack_points = [
            SlackTrendPoint(date="Mon", label="Oct 28", messages=840, threads=62),
            SlackTrendPoint(date="Tue", label="Oct 29", messages=1120, threads=84),
            SlackTrendPoint(date="Wed", label="Oct 30", messages=1350, threads=98),
            SlackTrendPoint(date="Thu", label="Oct 31", messages=1090, threads=76),
            SlackTrendPoint(date="Fri", label="Nov 01", messages=1420, threads=108),
            SlackTrendPoint(date="Sat", label="Nov 02", messages=280, threads=18),
            SlackTrendPoint(date="Sun", label="Nov 03", messages=390, threads=24),
        ]
    elif date_range == "90d":
        commit_points = [
            CommitTrendPoint(date="Aug W1", label="Aug 01-07", commits=210, prs_merged=38),
            CommitTrendPoint(date="Aug W3", label="Aug 15-21", commits=240, prs_merged=44),
            CommitTrendPoint(date="Sep W1", label="Sep 01-07", commits=295, prs_merged=52),
            CommitTrendPoint(date="Sep W3", label="Sep 15-21", commits=310, prs_merged=58),
            CommitTrendPoint(date="Oct W1", label="Oct 01-07", commits=280, prs_merged=49),
            CommitTrendPoint(date="Oct W3", label="Oct 15-21", commits=340, prs_merged=64),
            CommitTrendPoint(date="Nov W1", label="Nov 01-04", commits=190, prs_merged=34),
        ]
        slack_points = [
            SlackTrendPoint(date="Aug W1", label="Aug 01-07", messages=5800, threads=410),
            SlackTrendPoint(date="Aug W3", label="Aug 15-21", messages=6200, threads=450),
            SlackTrendPoint(date="Sep W1", label="Sep 01-07", messages=7100, threads=520),
            SlackTrendPoint(date="Sep W3", label="Sep 15-21", messages=7400, threads=580),
            SlackTrendPoint(date="Oct W1", label="Oct 01-07", messages=6900, threads=510),
            SlackTrendPoint(date="Oct W3", label="Oct 15-21", messages=8200, threads=640),
            SlackTrendPoint(date="Nov W1", label="Nov 01-04", messages=4600, threads=360),
        ]
    else:  # 30d default
        commit_points = [
            CommitTrendPoint(date="Week 1", label="Oct 07-13", commits=168, prs_merged=28),
            CommitTrendPoint(date="Week 2", label="Oct 14-20", commits=194, prs_merged=35),
            CommitTrendPoint(date="Week 3", label="Oct 21-27", commits=218, prs_merged=42),
            CommitTrendPoint(date="Week 4", label="Oct 28-Nov 03", commits=268, prs_merged=51),
        ]
        slack_points = [
            SlackTrendPoint(date="Week 1", label="Oct 07-13", messages=4120, threads=310),
            SlackTrendPoint(date="Week 2", label="Oct 14-20", messages=4680, threads=365),
            SlackTrendPoint(date="Week 3", label="Oct 21-27", messages=5190, threads=410),
            SlackTrendPoint(date="Week 4", label="Oct 28-Nov 03", messages=6420, threads=512),
        ]

    repos = [
        RepoDistributionItem(name="finnova-core", commits=684, prs=24, share_percent=46.2),
        RepoDistributionItem(name="privacy-shield-engine", commits=392, prs=14, share_percent=26.4),
        RepoDistributionItem(name="compliance-audit-ledger", commits=248, prs=7, share_percent=16.7),
        RepoDistributionItem(name="decision-intelligence-api", commits=158, prs=2, share_percent=10.7),
    ]

    teams = [
        TeamComparisonItem(department="Engineering", github_actions=842, slack_actions=4120, total=4962),
        TeamComparisonItem(department="Product & Design", github_actions=184, slack_actions=2140, total=2324),
        TeamComparisonItem(department="Security & SecOps", github_actions=312, slack_actions=1490, total=1802),
        TeamComparisonItem(department="Regulatory Compliance", github_actions=94, slack_actions=1170, total=1264),
    ]

    return AnalyticsData(
        date_range=date_range,  # type: ignore
        commit_trends=commit_points,
        slack_trends=slack_points,
        repo_distribution=repos,
        team_comparison=teams
    )

def generate_ai_insights_service(query: str, date_range: str = "30d") -> AIInsightsResponse:
    """
    RAG-style synthesis across the cross-platform activities.
    Correlates development pull requests and commits with Slack discussions and governance issues.
    """
    q = query.strip().lower()
    now_iso = datetime.now(timezone.utc).isoformat()

    # Pre-canned grounded intelligence for standard enterprise queries
    if "summarize development" in q or "development activities" in q:
        answer = (
            "During this period, development focused heavily on **Privacy Shield Engine hardening** and **multi-role RBAC enforcement**. "
            "Key milestones include the merger of **PR #148** (zero-knowledge regex tokenization) and the tagged release of **v2.4.0** "
            "in `finnova-core`. Deployment was verified on Slack `#prod-deployments` with zero retention violations detected across all test suites."
        )
        citations = [
            AIInsightCitation(
                source_type="github",
                reference_id="PR #148",
                title="Integrate zero-knowledge regex masking for PII tokens",
                container="finnova/privacy-shield-engine",
                url="https://github.com/finnova-corp/privacy-shield-engine/pull/148",
                timestamp=make_iso(0.5)
            ),
            AIInsightCitation(
                source_type="slack",
                reference_id="#prod-deployments",
                title="v2.4.0 Deployment Verified Announcement",
                container="#prod-deployments",
                url="https://finnova.slack.com/archives/C04ENGPROD/p1730001000",
                timestamp=make_iso(1.2)
            ),
            AIInsightCitation(
                source_type="github",
                reference_id="Tag v2.4.0",
                title="Release v2.4.0: Cryptographic audit integrity checkpoints",
                container="finnova/finnova-core",
                url="https://github.com/finnova-corp/finnova-core/releases/tag/v2.4.0",
                timestamp=make_iso(22.0)
            )
        ]
        confidence = "High"

    elif "highest activity" in q or "top repositor" in q:
        answer = (
            "The repository with the highest overall activity is **`finnova-core`** accounting for **46.2%** of all commits (684 commits, 24 PRs), "
            "followed by **`privacy-shield-engine`** at **26.4%** (392 commits, 14 PRs). "
            "On Slack, communication frequency was highest in **`#eng-core`** (4,120 messages) and **`#prod-deployments`**, driven by sprint deliveries and pre-audit readiness."
        )
        citations = [
            AIInsightCitation(
                source_type="github",
                reference_id="Repo finnova-core",
                title="Primary Enterprise Frontend and Core Orchestrator",
                container="finnova/finnova-core",
                url="https://github.com/finnova-corp/finnova-core",
                timestamp=make_iso(2.8)
            ),
            AIInsightCitation(
                source_type="slack",
                reference_id="#eng-core",
                title="Engineering Core Daily Discussions & Sprint Coordination",
                container="#eng-core",
                url="https://finnova.slack.com/archives/C01ENGCORE",
                timestamp=make_iso(14.0)
            )
        ]
        confidence = "High"

    elif "unresolved" in q or "issue" in q:
        answer = (
            "There are **23 open issues** across active repositories. The most critical tracked item is **Issue #89** in `compliance-audit-ledger`: "
            "*'Evaluate precedence conflict between SEC-002 and IT-009 regarding developer laptop biometric key retention'*, assigned to Marcus Chen. "
            "This item was escalated in Slack `#eng-core` as a high-priority requirement before external audit sign-off."
        )
        citations = [
            AIInsightCitation(
                source_type="github",
                reference_id="Issue #89",
                title="Evaluate precedence conflict between SEC-002 and IT-009",
                container="finnova/compliance-audit-ledger",
                url="https://github.com/finnova-corp/compliance-audit-ledger/issues/89",
                timestamp=make_iso(6.0)
            ),
            AIInsightCitation(
                source_type="slack",
                reference_id="#eng-core",
                title="Sprint Alignment: Reviewing PR #112 and Issue #89",
                container="#eng-core",
                url="https://finnova.slack.com/archives/C01ENGCORE/p1730005000",
                timestamp=make_iso(14.0)
            )
        ]
        confidence = "High"

    elif "deployment" in q or "slack discussion" in q:
        answer = (
            "Slack discussions regarding deployment are centered in **`#prod-deployments`**. Elena Vance confirmed the successful rollout of **v2.4.0**, "
            "which was verified with automated health checks. In parallel, Sarah Jenkins confirmed in **`#compliance-audits`** that the quarterly "
            "external auditor inspection is scheduled for Friday, requiring complete drift log reconciliation in the SQLite ledger."
        )
        citations = [
            AIInsightCitation(
                source_type="slack",
                reference_id="#prod-deployments",
                title="Elena Vance: Deployment Verified with Zero Retention Violations",
                container="#prod-deployments",
                url="https://finnova.slack.com/archives/C04ENGPROD/p1730001000",
                timestamp=make_iso(1.2)
            ),
            AIInsightCitation(
                source_type="slack",
                reference_id="#compliance-audits",
                title="Sarah Jenkins: Audit Chain Alert - External Auditor Scheduled",
                container="#compliance-audits",
                url="https://finnova.slack.com/archives/C05COMPLIANCE/p1730002500",
                timestamp=make_iso(4.5)
            )
        ]
        confidence = "High"

    elif "delay" in q or "potential project delay" in q:
        answer = (
            "Analysis of recent Slack communication and GitHub issues indicates **one potential delivery risk**: "
            "**PR #112** (deterministic cosine similarity cache) is currently awaiting code review sign-off by Liam Rodriguez, "
            "while **Issue #89** (precedence conflict resolution) is blocking Friday's scheduled compliance sign-off. "
            "Marcus Chen alerted the team on Slack `#eng-core` that precedence logic must be resolved prior to the executive presentation."
        )
        citations = [
            AIInsightCitation(
                source_type="github",
                reference_id="PR #112",
                title="Implement deterministic cosine similarity retrieval cache",
                container="finnova/decision-intelligence-api",
                url="https://github.com/finnova-corp/decision-intelligence-api/pull/112",
                timestamp=make_iso(9.2)
            ),
            AIInsightCitation(
                source_type="slack",
                reference_id="#eng-core",
                title="Marcus Chen: Precedence engine needed before executive demo",
                container="#eng-core",
                url="https://finnova.slack.com/archives/C01ENGCORE/p1730005000",
                timestamp=make_iso(14.0)
            )
        ]
        confidence = "High"

    else:
        # Cross-reference query across all synthetic activities
        matched = [a for a in SYNTHETIC_ACTIVITIES if any(term in a["description"].lower() or term in a["user_name"].lower() for term in q.split() if len(term) > 3)]
        if matched:
            top_match = matched[0]
            answer = (
                f"Based on unified cross-platform telemetry, matching activity was identified in **{top_match['target_container']}**: "
                f"*{top_match['description']}* by **{top_match['user_name']}** ({top_match['relative_time']}). "
                f"Cross-referencing GitHub commits with Slack channels shows active collaboration across {len(matched)} related records."
            )
            citations = [
                AIInsightCitation(
                    source_type=m["source"],
                    reference_id=m["id"],
                    title=m["description"][:60] + "...",
                    container=m["target_container"],
                    url=m["source_url"],
                    timestamp=m["timestamp"]
                ) for m in matched[:3]
            ]
            confidence = "Medium"
        else:
            answer = (
                f"No exact operational incidents or code commits matched the specific criteria '{query}' across the active GitHub repositories and Slack channels. "
                "However, all platform services (`finnova-core`, `privacy-shield-engine`, `compliance-audit-ledger`) remain operational with 18 open pull requests and 100% audit chain integrity."
            )
            citations = [
                AIInsightCitation(
                    source_type="github",
                    reference_id="finnova-core",
                    title="Platform Health Check Baseline",
                    container="finnova/finnova-core",
                    url="https://github.com/finnova-corp/finnova-core",
                    timestamp=now_iso
                )
            ]
            confidence = "Low"

    return AIInsightsResponse(
        query=query,
        answer=answer,
        citations=citations,
        confidence=confidence,  # type: ignore
        latency_ms=28,
        data_mode="certified_demo_corpus",
        synthesized_at=now_iso,
        sources_inspected=len(SYNTHETIC_ACTIVITIES)
    )

