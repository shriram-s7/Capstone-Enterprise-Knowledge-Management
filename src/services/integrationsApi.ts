/**
 * Centralized API client for FinNova Unified Enterprise Intelligence.
 * Connects to the FastAPI /api/integrations endpoints with deterministic local fallbacks.
 */

import {
  IntegrationCardInfo,
  ActivityEvent,
  KPISummary,
  AnalyticsData,
  AIInsightsResponse,
  PlatformType
} from '../types/integrations';

const BACKEND_BASE = 'http://127.0.0.1:8000';

async function fetchWithFallback<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // First try relative /api (via Vite proxy)
  try {
    const res = await fetch(`/api/integrations${endpoint}`, options);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Vite proxy failed, try direct BACKEND_BASE
  }

  try {
    const res = await fetch(`${BACKEND_BASE}/api/integrations${endpoint}`, options);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Network error
  }

  throw new Error(`Integrations API unavailable for ${endpoint}`);
}

// ---------------------------------------------------------------------------
// Fallback Datasets (ensuring resilient UI in all environments)
// ---------------------------------------------------------------------------

const FALLBACK_INTEGRATIONS: IntegrationCardInfo[] = [
  {
    id: 'github',
    name: 'GitHub Enterprise',
    platform: 'github',
    status: 'demo_mode',
    mode: 'demo',
    account_name: 'finnova-corp (Demonstration)',
    connected_at: new Date().toISOString(),
    last_sync: new Date().toISOString(),
    repos_count: 4,
    commits_count: 1482,
    prs_count: 47,
    issues_count: 23,
    capabilities: ['Repositories', 'Commits', 'Pull Requests', 'Code Reviews', 'Issues', 'Branch Audits']
  },
  {
    id: 'slack',
    name: 'Slack Enterprise Grid',
    platform: 'slack',
    status: 'demo_mode',
    mode: 'demo',
    account_name: 'FinNova Global Workspace',
    connected_at: new Date().toISOString(),
    last_sync: new Date().toISOString(),
    channels_count: 18,
    messages_count: 8920,
    members_count: 142,
    capabilities: ['Public Channels', 'Deployment Alerts', 'Compliance Announcements', 'Thread Discussions']
  },
  {
    id: 'jira',
    name: 'Jira Software',
    platform: 'jira',
    status: 'coming_soon',
    mode: 'unconfigured',
    account_name: 'Not connected',
    capabilities: ['Sprint Velocity', 'Epic Tracking', 'Bug Backlog']
  },
  {
    id: 'gdrive',
    name: 'Google Workspace Drive',
    platform: 'gdrive',
    status: 'coming_soon',
    mode: 'unconfigured',
    account_name: 'Not connected',
    capabilities: ['Policy Documents', 'Compliance Evidence', 'Architecture RFCs']
  },
  {
    id: 'notion',
    name: 'Notion Enterprise',
    platform: 'notion',
    status: 'coming_soon',
    mode: 'unconfigured',
    account_name: 'Not connected',
    capabilities: ['Knowledge Wikis', 'Runbooks', 'Meeting Notes']
  }
];

const FALLBACK_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-gh-001',
    source: 'github',
    event_type: 'pr_merged',
    user_name: 'Liam Rodriguez',
    user_email: 'liam.rodriguez@finnova.internal',
    user_role: 'Lead Platform Engineer',
    user_avatar: 'LR',
    target_container: 'finnova/privacy-shield-engine',
    description: 'PR #148: Integrate zero-knowledge regex masking for PII tokens in Question Shield',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    relative_time: '30m ago',
    source_url: 'https://github.com/finnova-corp/privacy-shield-engine/pull/148',
    category: 'pull_request',
    metadata: {
      pr_number: 148,
      branch: 'main',
      additions: 342,
      deletions: 28,
      reviewers: ['Sarah Jenkins', 'Elena Vance'],
      status: 'merged'
    }
  },
  {
    id: 'act-sl-001',
    source: 'slack',
    event_type: 'announcement',
    user_name: 'Elena Vance',
    user_email: 'elena.vance@finnova.internal',
    user_role: 'Chief Technology Officer',
    user_avatar: 'EV',
    target_container: '#prod-deployments',
    description: '🚀 v2.4.0 Deployment Verified: Privacy Shield Engine upgraded with client-side SHA-256 verifiable receipts. Zero unmasked retention guaranteed.',
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    relative_time: '1h ago',
    source_url: 'https://finnova.slack.com/archives/C04ENGPROD/p1730001000',
    category: 'announcement',
    metadata: {
      channel_id: 'C04ENGPROD',
      reactions: [{ emoji: '🚀', count: 14 }, { emoji: '🛡️', count: 9 }],
      replies_count: 5
    }
  },
  {
    id: 'act-gh-002',
    source: 'github',
    event_type: 'commit_pushed',
    user_name: 'Alex Rivera',
    user_email: 'alex.rivera@finnova.internal',
    user_role: 'Frontend Architect',
    user_avatar: 'AR',
    target_container: 'finnova/finnova-core',
    description: 'commit 8f3a12d: Add Unified Enterprise Intelligence dashboard with live telemetry feeds',
    timestamp: new Date(Date.now() - 170 * 60 * 1000).toISOString(),
    relative_time: '3h ago',
    source_url: 'https://github.com/finnova-corp/finnova-core/commit/8f3a12d',
    category: 'code',
    metadata: {
      commit_hash: '8f3a12d',
      branch: 'feature/unified-intel',
      files_changed: 12,
      verified: true
    }
  },
  {
    id: 'act-sl-002',
    source: 'slack',
    event_type: 'channel_discussion',
    user_name: 'Sarah Jenkins',
    user_email: 'sarah.jenkins@finnova.internal',
    user_role: 'Principal SecOps Engineer',
    user_avatar: 'SJ',
    target_container: '#compliance-audits',
    description: 'Audit Chain Alert: Quarterly external auditor verification scheduled for Friday. Please ensure all policy drift logs are committed to SQLite ledger.',
    timestamp: new Date(Date.now() - 270 * 60 * 1000).toISOString(),
    relative_time: '5h ago',
    source_url: 'https://finnova.slack.com/archives/C05COMPLIANCE/p1730002500',
    category: 'chat',
    metadata: {
      channel_id: 'C05COMPLIANCE',
      reactions: [{ emoji: '👀', count: 8 }, { emoji: '✅', count: 12 }],
      replies_count: 11
    }
  },
  {
    id: 'act-gh-003',
    source: 'github',
    event_type: 'issue_created',
    user_name: 'Priya Sharma',
    user_email: 'priya.sharma@finnova.internal',
    user_role: 'Head of Regulatory Compliance',
    user_avatar: 'PS',
    target_container: 'finnova/compliance-audit-ledger',
    description: 'Issue #89: High Priority - Evaluate precedence conflict between SEC-002 and IT-009 regarding developer laptop biometric key retention',
    timestamp: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    relative_time: '6h ago',
    source_url: 'https://github.com/finnova-corp/compliance-audit-ledger/issues/89',
    category: 'issue',
    metadata: {
      issue_number: 89,
      labels: ['compliance', 'precedence-check', 'high-priority'],
      status: 'open',
      assignee: 'Marcus Chen'
    }
  },
  {
    id: 'act-gh-004',
    source: 'github',
    event_type: 'pr_opened',
    user_name: 'David Kim',
    user_email: 'david.kim@finnova.internal',
    user_role: 'Backend Systems Engineer',
    user_avatar: 'DK',
    target_container: 'finnova/decision-intelligence-api',
    description: 'PR #112: Implement deterministic cosine similarity retrieval cache for synthetic policy index',
    timestamp: new Date(Date.now() - 550 * 60 * 1000).toISOString(),
    relative_time: '9h ago',
    source_url: 'https://github.com/finnova-corp/decision-intelligence-api/pull/112',
    category: 'pull_request',
    metadata: {
      pr_number: 112,
      branch: 'perf/retrieval-cache',
      additions: 184,
      deletions: 42,
      reviewers: ['Liam Rodriguez'],
      status: 'open'
    }
  },
  {
    id: 'act-sl-003',
    source: 'slack',
    event_type: 'team_collab',
    user_name: 'Marcus Chen',
    user_email: 'marcus.chen@finnova.internal',
    user_role: 'VP Product',
    user_avatar: 'MC',
    target_container: '#eng-core',
    description: 'Sprint Alignment: Reviewing PR #112 and Issue #89. We need the precedence engine updated before the executive board demo tomorrow morning.',
    timestamp: new Date(Date.now() - 840 * 60 * 1000).toISOString(),
    relative_time: '14h ago',
    source_url: 'https://finnova.slack.com/archives/C01ENGCORE/p1730005000',
    category: 'chat',
    metadata: {
      channel_id: 'C01ENGCORE',
      reactions: [{ emoji: '🔥', count: 6 }, { emoji: '👍', count: 10 }],
      replies_count: 8
    }
  },
  {
    id: 'act-gh-005',
    source: 'github',
    event_type: 'repo_updated',
    user_name: 'Liam Rodriguez',
    user_email: 'liam.rodriguez@finnova.internal',
    user_role: 'Lead Platform Engineer',
    user_avatar: 'LR',
    target_container: 'finnova/finnova-core',
    description: 'Released v2.4.0 tag: Cryptographic audit integrity checkpoints and multi-role RBAC enforcement',
    timestamp: new Date(Date.now() - 1320 * 60 * 1000).toISOString(),
    relative_time: '22h ago',
    source_url: 'https://github.com/finnova-corp/finnova-core/releases/tag/v2.4.0',
    category: 'code',
    metadata: {
      tag: 'v2.4.0',
      commit_hash: 'c490a1f',
      downloads: 128
    }
  }
];

// ---------------------------------------------------------------------------
// Exported API Functions
// ---------------------------------------------------------------------------

export async function fetchIntegrationsStatusApi(): Promise<IntegrationCardInfo[]> {
  try {
    return await fetchWithFallback<IntegrationCardInfo[]>('/status');
  } catch {
    return FALLBACK_INTEGRATIONS;
  }
}

export async function fetchKPIsApi(dateRange: string = '30d'): Promise<KPISummary> {
  try {
    return await fetchWithFallback<KPISummary>(`/kpis?date_range=${dateRange}`);
  } catch {
    const mult = dateRange === '7d' ? 0.28 : dateRange === '90d' ? 2.85 : 1.0;
    return {
      connected_sources: 2,
      total_commits: Math.round(1482 * mult),
      commits_trend: '+14.2% vs prev period',
      open_prs: dateRange === '7d' ? 6 : 18,
      prs_trend: '+4 new this week',
      open_issues: dateRange === '7d' ? 9 : 23,
      issues_trend: '-5 resolved recently',
      slack_messages: Math.round(8920 * mult),
      messages_trend: '+8.5% activity increase',
      active_contributors: dateRange === '7d' ? 21 : 34,
      contributors_trend: '+3 cross-functional',
      last_synced: new Date().toISOString()
    };
  }
}

export async function fetchActivitiesApi(
  category?: string,
  source?: string,
  search?: string,
  dateRange: string = '30d'
): Promise<ActivityEvent[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (source && source !== 'all') params.append('source', source);
    if (search && search.trim()) params.append('search', search.trim());
    params.append('date_range', dateRange);

    return await fetchWithFallback<ActivityEvent[]>(`/activities?${params.toString()}`);
  } catch {
    let list = [...FALLBACK_ACTIVITIES];
    if (source && source !== 'all') {
      list = list.filter(a => a.source === source);
    }
    if (category && category !== 'all') {
      list = list.filter(a => a.category === category);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        a =>
          a.description.toLowerCase().includes(q) ||
          a.user_name.toLowerCase().includes(q) ||
          a.target_container.toLowerCase().includes(q)
      );
    }
    return list;
  }
}

export async function fetchAnalyticsApi(dateRange: string = '30d'): Promise<AnalyticsData> {
  try {
    return await fetchWithFallback<AnalyticsData>(`/analytics?date_range=${dateRange}`);
  } catch {
    return {
      date_range: dateRange as any,
      commit_trends: [
        { date: 'Week 1', label: 'Oct 07-13', commits: 168, prs_merged: 28 },
        { date: 'Week 2', label: 'Oct 14-20', commits: 194, prs_merged: 35 },
        { date: 'Week 3', label: 'Oct 21-27', commits: 218, prs_merged: 42 },
        { date: 'Week 4', label: 'Oct 28-Nov 03', commits: 268, prs_merged: 51 }
      ],
      slack_trends: [
        { date: 'Week 1', label: 'Oct 07-13', messages: 4120, threads: 310 },
        { date: 'Week 2', label: 'Oct 14-20', messages: 4680, threads: 365 },
        { date: 'Week 3', label: 'Oct 21-27', messages: 5190, threads: 410 },
        { date: 'Week 4', label: 'Oct 28-Nov 03', messages: 6420, threads: 512 }
      ],
      repo_distribution: [
        { name: 'finnova-core', commits: 684, prs: 24, share_percent: 46.2 },
        { name: 'privacy-shield-engine', commits: 392, prs: 14, share_percent: 26.4 },
        { name: 'compliance-audit-ledger', commits: 248, prs: 7, share_percent: 16.7 },
        { name: 'decision-intelligence-api', commits: 158, prs: 2, share_percent: 10.7 }
      ],
      team_comparison: [
        { department: 'Engineering', github_actions: 842, slack_actions: 4120, total: 4962 },
        { department: 'Product & Design', github_actions: 184, slack_actions: 2140, total: 2324 },
        { department: 'Security & SecOps', github_actions: 312, slack_actions: 1490, total: 1802 },
        { department: 'Regulatory Compliance', github_actions: 94, slack_actions: 1170, total: 1264 }
      ]
    };
  }
}

export async function syncIntegrationsApi(): Promise<{ status: string; synchronized_at: string; items_synced: number; message: string }> {
  try {
    return await fetchWithFallback('/sync', { method: 'POST' });
  } catch {
    return {
      status: 'success',
      synchronized_at: new Date().toISOString(),
      items_synced: FALLBACK_ACTIVITIES.length,
      message: 'Telemetry refreshed (client simulation).'
    };
  }
}

export async function connectIntegrationApi(platform: PlatformType, token?: string, orgOrWorkspace?: string, mode: 'live' | 'demo' = 'demo'): Promise<any> {
  try {
    return await fetchWithFallback('/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, token, org_or_workspace: orgOrWorkspace, mode })
    });
  } catch {
    return { status: 'demo_mode', mode: 'demo', message: `Connected ${platform} in demonstration mode.` };
  }
}

export async function disconnectIntegrationApi(platform: PlatformType): Promise<any> {
  try {
    return await fetchWithFallback('/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform })
    });
  } catch {
    return { status: 'disconnected', platform, message: `${platform} disconnected.` };
  }
}

export async function askAIInsightsApi(query: string, dateRange: string = '30d'): Promise<AIInsightsResponse> {
  try {
    return await fetchWithFallback<AIInsightsResponse>('/ai-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, date_range: dateRange })
    });
  } catch {
    return {
      query,
      answer:
        'Development focused on Privacy Shield Engine hardening and zero-knowledge regex tokenization (PR #148). Deployment verified on Slack #prod-deployments with zero unmasked retention violations.',
      citations: [
        {
          source_type: 'github',
          reference_id: 'PR #148',
          title: 'Integrate zero-knowledge regex masking for PII tokens',
          container: 'finnova/privacy-shield-engine',
          url: 'https://github.com/finnova-corp/privacy-shield-engine/pull/148',
          timestamp: new Date().toISOString()
        },
        {
          source_type: 'slack',
          reference_id: '#prod-deployments',
          title: 'v2.4.0 Deployment Verified Announcement',
          container: '#prod-deployments',
          url: 'https://finnova.slack.com/archives/C04ENGPROD/p1730001000',
          timestamp: new Date().toISOString()
        }
      ],
      confidence: 'High',
      latency_ms: 32,
      data_mode: 'certified_demo_corpus',
      synthesized_at: new Date().toISOString(),
      sources_inspected: FALLBACK_ACTIVITIES.length
    };
  }
}

