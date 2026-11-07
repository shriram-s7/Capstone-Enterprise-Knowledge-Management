from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field

class IntegrationCardInfo(BaseModel):
    id: str
    name: str
    platform: str
    status: Literal["connected", "demo_mode", "disconnected", "coming_soon"]
    mode: Literal["live", "demo", "unconfigured"]
    account_name: Optional[str] = None
    connected_at: Optional[str] = None
    last_sync: Optional[str] = None
    # Metrics
    repos_count: Optional[int] = None
    commits_count: Optional[int] = None
    prs_count: Optional[int] = None
    issues_count: Optional[int] = None
    channels_count: Optional[int] = None
    messages_count: Optional[int] = None
    members_count: Optional[int] = None
    # Capabilities / tags
    capabilities: List[str] = []

class ActivityEvent(BaseModel):
    id: str
    source: Literal["github", "slack"]
    event_type: Literal[
        "commit_pushed",
        "pr_opened",
        "pr_merged",
        "issue_created",
        "repo_updated",
        "slack_message",
        "channel_discussion",
        "announcement",
        "team_collab"
    ]
    user_name: str
    user_email: str
    user_role: str
    user_avatar: Optional[str] = None
    target_container: str  # repo or channel name
    description: str
    timestamp: str  # ISO string
    relative_time: str
    source_url: str
    category: Literal["all", "code", "pull_request", "issue", "chat", "announcement"]
    metadata: Dict[str, Any] = Field(default_factory=dict)

class KPISummary(BaseModel):
    connected_sources: int
    total_commits: int
    commits_trend: str
    open_prs: int
    prs_trend: str
    open_issues: int
    issues_trend: str
    slack_messages: int
    messages_trend: str
    active_contributors: int
    contributors_trend: str
    last_synced: str

class CommitTrendPoint(BaseModel):
    date: str
    label: str
    commits: int
    prs_merged: int

class SlackTrendPoint(BaseModel):
    date: str
    label: str
    messages: int
    threads: int

class RepoDistributionItem(BaseModel):
    name: str
    commits: int
    prs: int
    share_percent: float

class TeamComparisonItem(BaseModel):
    department: str
    github_actions: int
    slack_actions: int
    total: int

class AnalyticsData(BaseModel):
    date_range: Literal["7d", "30d", "90d"]
    commit_trends: List[CommitTrendPoint]
    slack_trends: List[SlackTrendPoint]
    repo_distribution: List[RepoDistributionItem]
    team_comparison: List[TeamComparisonItem]

class AIInsightCitation(BaseModel):
    source_type: Literal["github", "slack"]
    reference_id: str
    title: str
    container: str  # repo name or channel
    url: str
    timestamp: str

class AIInsightsRequest(BaseModel):
    query: str
    date_range: Optional[Literal["7d", "30d", "90d"]] = "30d"

class AIInsightsResponse(BaseModel):
    query: str
    answer: str
    citations: List[AIInsightCitation]
    confidence: Literal["High", "Medium", "Low", "Insufficient Evidence"]
    latency_ms: int
    data_mode: Literal["live_integration", "certified_demo_corpus"]
    synthesized_at: str
    sources_inspected: int

class ConnectIntegrationRequest(BaseModel):
    platform: Literal["github", "slack"]
    token: Optional[str] = None
    org_or_workspace: Optional[str] = None
    mode: Optional[Literal["live", "demo"]] = "demo"

class DisconnectIntegrationRequest(BaseModel):
    platform: Literal["github", "slack"]

class SyncResponse(BaseModel):
    status: str
    synchronized_at: str
    items_synced: int
    message: str

