export type PlatformType = 'github' | 'slack' | 'jira' | 'gdrive' | 'notion';

export type IntegrationStatus = 'connected' | 'demo_mode' | 'disconnected' | 'coming_soon';

export type IntegrationMode = 'live' | 'demo' | 'unconfigured';

export type ActivityEventType =
  | 'commit_pushed'
  | 'pr_opened'
  | 'pr_merged'
  | 'issue_created'
  | 'repo_updated'
  | 'slack_message'
  | 'channel_discussion'
  | 'announcement'
  | 'team_collab';

export type ActivityCategory = 'all' | 'code' | 'pull_request' | 'issue' | 'chat' | 'announcement';

export interface IntegrationCardInfo {
  id: PlatformType;
  name: string;
  platform: string;
  status: IntegrationStatus;
  mode: IntegrationMode;
  account_name?: string;
  connected_at?: string;
  last_sync?: string;
  repos_count?: number;
  commits_count?: number;
  prs_count?: number;
  issues_count?: number;
  channels_count?: number;
  messages_count?: number;
  members_count?: number;
  capabilities: string[];
}

export interface ActivityEvent {
  id: string;
  source: 'github' | 'slack';
  event_type: ActivityEventType;
  user_name: string;
  user_email: string;
  user_role: string;
  user_avatar?: string;
  target_container: string; // repo name or channel
  description: string;
  timestamp: string;
  relative_time: string;
  source_url: string;
  category: ActivityCategory;
  metadata: Record<string, any>;
}

export interface KPISummary {
  connected_sources: number;
  total_commits: number;
  commits_trend: string;
  open_prs: number;
  prs_trend: string;
  open_issues: number;
  issues_trend: string;
  slack_messages: number;
  messages_trend: string;
  active_contributors: number;
  contributors_trend: string;
  last_synced: string;
}

export interface CommitTrendPoint {
  date: string;
  label: string;
  commits: number;
  prs_merged: number;
}

export interface SlackTrendPoint {
  date: string;
  label: string;
  messages: number;
  threads: number;
}

export interface RepoDistributionItem {
  name: string;
  commits: number;
  prs: number;
  share_percent: number;
}

export interface TeamComparisonItem {
  department: string;
  github_actions: number;
  slack_actions: number;
  total: number;
}

export interface AnalyticsData {
  date_range: '7d' | '30d' | '90d';
  commit_trends: CommitTrendPoint[];
  slack_trends: SlackTrendPoint[];
  repo_distribution: RepoDistributionItem[];
  team_comparison: TeamComparisonItem[];
}

export interface AIInsightCitation {
  source_type: 'github' | 'slack';
  reference_id: string;
  title: string;
  container: string;
  url: string;
  timestamp: string;
}

export interface AIInsightsResponse {
  query: string;
  answer: string;
  citations: AIInsightCitation[];
  confidence: 'High' | 'Medium' | 'Low' | 'Insufficient Evidence';
  latency_ms: number;
  data_mode: 'live_integration' | 'certified_demo_corpus';
  synthesized_at: string;
  sources_inspected: number;
}

