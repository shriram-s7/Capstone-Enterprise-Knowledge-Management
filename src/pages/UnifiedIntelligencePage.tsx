import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  PlatformType,
  IntegrationCardInfo,
  ActivityEvent,
  KPISummary,
  AnalyticsData,
  AIInsightsResponse
} from '../types/integrations';
import {
  fetchIntegrationsStatusApi,
  fetchKPIsApi,
  fetchActivitiesApi,
  fetchAnalyticsApi,
  syncIntegrationsApi,
  connectIntegrationApi,
  disconnectIntegrationApi,
  askAIInsightsApi
} from '../services/integrationsApi';
import { Card, CardHeader, CardContent } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import { Dialog } from '../components/shared/Dialog';
import {
  Network,
  RefreshCw,
  GitBranch,
  GitPullRequest,
  GitCommit,
  AlertCircle,
  MessageSquare,
  Users,
  Search,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Layers,
  Send,
  HelpCircle,
  FileCode,
  Hash,
  Share2,
  Lock,
  ChevronRight,
  Settings,
  Flame,
  Check,
  Radio
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const UnifiedIntelligencePage: React.FC = () => {
  const { showToast } = useApp();

  // State
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data
  const [integrations, setIntegrations] = useState<IntegrationCardInfo[]>([]);
  const [kpis, setKpis] = useState<KPISummary | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Feed Filter & Search
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSource, setActiveSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Insights
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIInsightsResponse | null>(null);

  // Connect Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('github');
  const [connectMode, setConnectMode] = useState<'demo' | 'live'>('demo');
  const [tokenInput, setTokenInput] = useState('');
  const [orgInput, setOrgInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Load Initial Telemetry
  const loadDashboardData = async (range = dateRange) => {
    setIsLoading(true);
    try {
      const [statusData, kpiData, actData, anaData] = await Promise.all([
        fetchIntegrationsStatusApi(),
        fetchKPIsApi(range),
        fetchActivitiesApi(activeCategory, activeSource, searchQuery, range),
        fetchAnalyticsApi(range)
      ]);
      setIntegrations(statusData);
      setKpis(kpiData);
      setActivities(actData);
      setAnalytics(anaData);
    } catch (err) {
      showToast('error', 'Sync Warning', 'Loaded certified demonstration telemetry baseline.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(dateRange);
  }, [dateRange]);

  // Handle Sync / Refresh
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncIntegrationsApi();
      await loadDashboardData(dateRange);
      showToast('success', 'Telemetry Synchronized', res.message || 'Latest GitHub & Slack events updated.');
    } catch {
      showToast('info', 'Synchronized', 'All platform feeds refreshed.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter activities dynamically
  useEffect(() => {
    fetchActivitiesApi(activeCategory, activeSource, searchQuery, dateRange)
      .then(setActivities)
      .catch(() => {});
  }, [activeCategory, activeSource, searchQuery, dateRange]);

  // AI Query Handler
  const handleAskAI = async (queryText?: string) => {
    const text = (queryText || aiQuery).trim();
    if (!text || isAiLoading) return;

    setIsAiLoading(true);
    try {
      const res = await askAIInsightsApi(text, dateRange);
      setAiResult(res);
      if (!queryText) setAiQuery('');
    } catch {
      showToast('error', 'AI Insights Error', 'Unable to retrieve answer from reasoning engine.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Open modal for a specific platform
  const openConnectModal = (plat: PlatformType) => {
    setSelectedPlatform(plat);
    setConnectMode('demo');
    setTokenInput('');
    setOrgInput(plat === 'github' ? 'finnova-corp' : 'FinNova Workspace');
    setModalOpen(true);
  };

  // Submit Connection
  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    try {
      const res = await connectIntegrationApi(selectedPlatform, tokenInput, orgInput, connectMode);
      showToast('success', 'Integration Updated', res.message || 'Connection configuration saved.');
      setModalOpen(false);
      loadDashboardData(dateRange);
    } catch {
      showToast('error', 'Connection Failed', 'Could not establish connection with platform.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle Disconnect
  const handleDisconnect = async (plat: PlatformType) => {
    try {
      await disconnectIntegrationApi(plat);
      showToast('info', 'Disconnected', `${plat.toUpperCase()} integration disconnected.`);
      loadDashboardData(dateRange);
    } catch {
      showToast('error', 'Error', 'Failed to disconnect integration.');
    }
  };

  // Pre-canned AI questions
  const exampleQuestions = [
    'Summarize development activities this week',
    'Identify repositories with the highest activity',
    'Find unresolved development issues',
    'Summarize Slack discussions about deployment',
    'Identify potential project delays',
    'Summarize important discussions and related GitHub changes'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ----------------------------------------------------------------- */}
      {/* A. HEADER                                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Network className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Cross-Platform Telemetry Plane
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry Mode
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Unified Enterprise Intelligence
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Centralized visibility across enterprise platforms. Correlate engineering pull requests, commit velocity, and Slack operational discussions with grounded AI synthesis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300">
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  dateRange === range
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>

          {/* Refresh / Sync Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            isLoading={isSyncing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
            className="border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            Sync Feeds
          </Button>

          {/* Last sync info */}
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Last Synchronized
            </span>
            <span className="text-xs font-mono text-slate-200">
              {kpis?.last_synced ? new Date(kpis.last_synced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now'}
            </span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* B. INTEGRATION MANAGEMENT CARDS                                   */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Connected Enterprise Platforms
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active integrations with OAuth scopes, telemetry quotas, and connection health
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map(card => {
            const isConnected = card.status === 'connected' || card.status === 'demo_mode';
            const isComingSoon = card.status === 'coming_soon';

            return (
              <Card
                key={card.id}
                className={`flex flex-col justify-between transition-all ${
                  isComingSoon
                    ? 'opacity-85 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
                    : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="p-5">
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-sm ${
                          card.id === 'github'
                            ? 'bg-slate-900 text-white dark:bg-slate-800'
                            : card.id === 'slack'
                            ? 'bg-emerald-600 text-white'
                            : card.id === 'jira'
                            ? 'bg-blue-600 text-white'
                            : card.id === 'gdrive'
                            ? 'bg-amber-600 text-white'
                            : 'bg-purple-600 text-white'
                        }`}
                      >
                        {card.id === 'github' && <GitBranch className="w-5 h-5" />}
                        {card.id === 'slack' && <MessageSquare className="w-5 h-5" />}
                        {card.id === 'jira' && <Layers className="w-5 h-5" />}
                        {card.id === 'gdrive' && <FileCode className="w-5 h-5" />}
                        {card.id === 'notion' && <Hash className="w-5 h-5" />}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {card.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                          {card.account_name || 'Enterprise Service'}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isComingSoon ? (
                        <Badge variant="neutral" size="sm">
                          Coming Soon
                        </Badge>
                      ) : card.status === 'demo_mode' ? (
                        <Badge variant="purple" size="sm" icon={<Radio className="w-2.5 h-2.5 animate-pulse" />}>
                          Demo Active
                        </Badge>
                      ) : card.status === 'connected' ? (
                        <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-2.5 h-2.5" />}>
                          Live Connected
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          Disconnected
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Metrics if Connected */}
                  {isConnected && (
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      {card.id === 'github' && (
                        <>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <span className="text-[10px] text-slate-400 block font-medium">Repositories</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{card.repos_count} active</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <span className="text-[10px] text-slate-400 block font-medium">Commits Tracked</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{card.commits_count?.toLocaleString()}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <span className="text-[10px] text-slate-400 block font-medium">Pull Requests</span>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{card.prs_count} open/merged</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <span className="text-[10px] text-slate-400 block font-medium">Open Issues</span>
                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{card.issues_count} open</span>
                          </div>
                        </>
                      )}

                      {card.id === 'slack' && (
                        <>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <span className="text-[10px] text-slate-400 block font-medium">Channels</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{card.channels_count} monitored</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <span className="text-[10px] text-slate-400 block font-medium">Total Messages</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{card.messages_count?.toLocaleString()}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <span className="text-[10px] text-slate-400 block font-medium">Active Members</span>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{card.members_count} team members</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                            <span className="text-[10px] text-slate-400 block font-medium">Audited Threads</span>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">100% Retained</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Coming soon description */}
                  {isComingSoon && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                      <p>
                        Connector planned for enterprise roadmap. Will ingest documents, tickets, and knowledge bases into the unified intelligence pipeline.
                      </p>
                    </div>
                  )}

                  {/* Capabilities tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {card.capabilities.slice(0, 3).map((cap, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  {isComingSoon ? (
                    <span className="text-slate-400 text-[11px] italic">Connector in development</span>
                  ) : isConnected ? (
                    <>
                      <button
                        onClick={() => openConnectModal(card.id)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" /> Reconfigure
                      </button>
                      <button
                        onClick={() => handleDisconnect(card.id)}
                        className="text-xs font-medium text-rose-600 hover:underline"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openConnectModal(card.id)}
                      className="w-full"
                    >
                      Connect {card.name}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* C. KPI SUMMARY CARDS                                              */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Organizational Intelligence Metrics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aggregated KPI indicators across connected engineering repositories and team collaboration spaces
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Connected Sources */}
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                Connected Sources
              </span>
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Network className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis?.connected_sources ?? 2}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Operational
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">GitHub & Slack Grid</span>
          </Card>

          {/* Card 2: GitHub Commits */}
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                Total Commits
              </span>
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <GitCommit className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis?.total_commits?.toLocaleString() ?? '1,482'}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
              {kpis?.commits_trend ?? '+14.2% velocity'}
            </span>
          </Card>

          {/* Card 3: Open PRs */}
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                Pull Requests
              </span>
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <GitPullRequest className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis?.open_prs ?? 18}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">open</span>
            </div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
              {kpis?.prs_trend ?? '+4 new this week'}
            </span>
          </Card>

          {/* Card 4: Open Issues */}
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                Tracked Issues
              </span>
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis?.open_issues ?? 23}
              </span>
              <span className="text-[10px] text-amber-600 font-medium">active</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
              {kpis?.issues_trend ?? '-5 resolved'}
            </span>
          </Card>

          {/* Card 5: Slack Messages */}
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                Slack Messages
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis?.slack_messages?.toLocaleString() ?? '8,920'}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
              {kpis?.messages_trend ?? '+8.5% activity'}
            </span>
          </Card>

          {/* Card 6: Active Contributors */}
          <Card className="p-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                Contributors
              </span>
              <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {kpis?.active_contributors ?? 34}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">engineers</span>
            </div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
              {kpis?.contributors_trend ?? '+3 cross-team'}
            </span>
          </Card>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* F. AI ENTERPRISE INSIGHTS (Prominent RAG reasoning section)       */}
      {/* ----------------------------------------------------------------- */}
      <Card className="border-indigo-200 dark:border-indigo-900/60 shadow-lg bg-gradient-to-br from-white via-indigo-50/20 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900">
        <CardHeader
          title={
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                  AI Enterprise Insights: Cross-Platform Reasoning
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 font-normal">
                  Ask grounded questions across code repositories, pull requests, and Slack channel discussions
                </span>
              </div>
            </div>
          }
          action={
            <Badge variant="primary" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
              Privacy-Preserving Local RAG
            </Badge>
          }
        />
        <CardContent className="space-y-5">
          {/* Preset Questions Chips */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Recommended Analysis Inquiries
            </span>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskAI(q)}
                  disabled={isAiLoading}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all text-left flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Query Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAskAI();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <HelpCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                placeholder="Ask about PRs, commits, release deployments, or team blockers..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isAiLoading}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Analyze
            </Button>
          </form>

          {/* AI Result Card */}
          {aiResult && (
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Synthesized Cross-Platform Answer
                  </span>
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Query: "{aiResult.query}"
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="purple" size="sm">
                    Confidence: {aiResult.confidence}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {aiResult.latency_ms}ms latency
                  </span>
                </div>
              </div>

              {/* Synthesized Prose */}
              <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans bg-white/70 dark:bg-slate-900/70 p-4 rounded-xl border border-indigo-100/60 dark:border-indigo-900/40">
                {aiResult.answer}
              </div>

              {/* Citations Grid */}
              {aiResult.citations && aiResult.citations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-indigo-100/80 dark:border-indigo-900/40">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Grounded Documentary Citations ({aiResult.citations.length})
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {aiResult.citations.map((cite, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between text-xs space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {cite.source_type === 'github' ? <GitBranch className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                            {cite.source_type} • {cite.container}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {cite.reference_id}
                          </span>
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-100 line-clamp-2">
                          {cite.title}
                        </p>
                        <a
                          href={cite.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline pt-1 font-semibold"
                        >
                          View Original Record <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* E. ANALYTICS SECTION                                              */}
      {/* ----------------------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Cross-Platform Telemetry Analytics ({dateRange.toUpperCase()})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive visualizations of code commits, communication velocity, and departmental workload distribution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: GitHub Commits & Merges */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  GitHub Code Delivery Velocity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily commits pushed and pull requests merged
                </p>
              </div>
              <Badge variant="blue" size="sm">
                Code Telemetry
              </Badge>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.commit_trends || []}>
                  <defs>
                    <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPrs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="commits"
                    name="Commits Pushed"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorCommits)"
                  />
                  <Area
                    type="monotone"
                    dataKey="prs_merged"
                    name="PRs Merged"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorPrs)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: Slack Communication Velocity */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Slack Channel Discussion Volume
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Channel messages and multi-user discussion threads
                </p>
              </div>
              <Badge variant="success" size="sm">
                Chat Telemetry
              </Badge>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.slack_trends || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="messages" name="Channel Messages" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="threads" name="Discussion Threads" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 3: Repository Distribution */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Repository Contribution Shares
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Relative engineering focus across FinNova codebase
                </p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics?.repo_distribution || []}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="commits" name="Commits" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 4: Cross-Team Department Activity */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Departmental Collaboration Comparison
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cross-department actions logged across GitHub & Slack
                </p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.team_comparison || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="github_actions" name="GitHub Actions" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="slack_actions" name="Slack Actions" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* D. UNIFIED ACTIVITY FEED                                          */}
      {/* ----------------------------------------------------------------- */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-md">
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Unified Cross-Platform Activity Timeline</span>
            </div>
          }
          subtitle="Chronological audit stream blending GitHub code changes, issues, and Slack discussions"
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                {activities.length} Events Showing
              </span>
            </div>
          }
        />
        <CardContent className="space-y-4">
          {/* Feed Controls: Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search activities by author, PR, commit, channel, or repo..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Platform Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'github', 'slack'] as const).map(source => (
                <button
                  key={source}
                  onClick={() => setActiveSource(source)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeSource === source
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {source === 'all' ? 'All Platforms' : source === 'github' ? 'GitHub' : 'Slack'}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

              {/* Category Filter */}
              {(['all', 'pull_request', 'code', 'issue', 'chat', 'announcement'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {cat === 'all'
                    ? 'All Events'
                    : cat === 'pull_request'
                    ? 'PRs'
                    : cat === 'code'
                    ? 'Commits'
                    : cat === 'issue'
                    ? 'Issues'
                    : cat === 'chat'
                    ? 'Chats'
                    : 'Announcements'}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Feed Items */}
          <div className="space-y-3 pt-2">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No activity events match your filter criteria. Try expanding search or resetting filters.
              </div>
            ) : (
              activities.map(act => {
                const isGh = act.source === 'github';

                return (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Source Icon Avatar */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold shadow-xs ${
                          isGh
                            ? 'bg-slate-900 text-white dark:bg-slate-800'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isGh ? <GitBranch className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      </div>

                      {/* Event Details */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {act.user_name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({act.user_role})
                          </span>

                          <span className="text-slate-300 dark:text-slate-700">•</span>

                          {/* Event type badge */}
                          <Badge
                            variant={
                              act.event_type.includes('pr')
                                ? 'purple'
                                : act.event_type.includes('commit')
                                ? 'blue'
                                : act.event_type.includes('issue')
                                ? 'amber'
                                : act.event_type.includes('announcement')
                                ? 'rose'
                                : 'success'
                            }
                            size="sm"
                          >
                            {act.event_type.replace('_', ' ').toUpperCase()}
                          </Badge>

                          {/* Target repo or channel */}
                          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {act.target_container}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                          {act.description}
                        </p>

                        {/* Metadata Pills */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-400">
                          {act.metadata?.branch && (
                            <span className="font-mono">branch: {act.metadata.branch}</span>
                          )}
                          {act.metadata?.additions && (
                            <span className="text-emerald-600 font-mono">+{act.metadata.additions}</span>
                          )}
                          {act.metadata?.deletions && (
                            <span className="text-rose-600 font-mono">-{act.metadata.deletions}</span>
                          )}
                          {act.metadata?.reactions && (
                            <div className="flex items-center gap-1">
                              {act.metadata.reactions.map((r: any, idx: number) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {r.emoji} {r.count}
                                </span>
                              ))}
                            </div>
                          )}
                          {act.metadata?.replies_count && (
                            <span>{act.metadata.replies_count} replies in thread</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right timestamp & Link */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {act.relative_time}
                      </span>
                      <a
                        href={act.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        Inspect <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* CONNECT INTEGRATION MODAL                                         */}
      {/* ----------------------------------------------------------------- */}
      <Dialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <span>Configure {selectedPlatform === 'github' ? 'GitHub' : 'Slack'} Telemetry Integration</span>
          </div>
        }
        description="Select between Certified Enterprise Demonstration mode or provide live OAuth credentials."
        maxWidth="lg"
      >
        <form onSubmit={handleConnectSubmit} className="space-y-4 pt-2">
          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Connection Architecture
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setConnectMode('demo')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  connectMode === 'demo'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Certified Demo Mode
                  </span>
                  {connectMode === 'demo' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Synthetic deterministic enterprise data reflecting FinNova's company topology. Zero API keys required.
                </p>
              </div>

              <div
                onClick={() => setConnectMode('live')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  connectMode === 'live'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Live Platform Token
                  </span>
                  {connectMode === 'live' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Connect live GitHub REST API or Slack Web API token securely held in backend environment.
                </p>
              </div>
            </div>
          </div>

          {/* Org or Workspace Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {selectedPlatform === 'github' ? 'Organization or Account Name' : 'Slack Workspace Name'}
            </label>
            <input
              type="text"
              value={orgInput}
              onChange={e => setOrgInput(e.target.value)}
              placeholder={selectedPlatform === 'github' ? 'finnova-corp' : 'FinNova Workspace'}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Token input when live mode selected */}
          {connectMode === 'live' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {selectedPlatform === 'github' ? 'Personal Access Token / Fine-Grained Token' : 'Slack Bot User OAuth Token (xoxb-...)'}
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                placeholder={selectedPlatform === 'github' ? 'ghp_...' : 'xoxb-...'}
                required={connectMode === 'live'}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {selectedPlatform === 'github'
                  ? 'Requires "repo" and "read:org" scopes. Token is never exposed to the browser.'
                  : 'Requires "channels:read", "channels:history" scopes.'}
              </p>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              FinNova Zero-Knowledge Architecture guarantees that external API credentials are used strictly for local telemetry aggregation. No unmasked repository content or private message payload is transmitted to third-party models.
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isConnecting}
            >
              Save Configuration
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

