import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status

from backend.app.integrations.schemas import (
    IntegrationCardInfo,
    ActivityEvent,
    KPISummary,
    AnalyticsData,
    AIInsightsRequest,
    AIInsightsResponse,
    ConnectIntegrationRequest,
    DisconnectIntegrationRequest,
    SyncResponse
)
from backend.app.integrations.service import (
    get_integrations_status_service,
    connect_integration_service,
    disconnect_integration_service,
    sync_integrations_service,
    get_activities_service,
    get_kpis_service,
    get_analytics_service,
    generate_ai_insights_service
)

logger = logging.getLogger("finnova.integrations.routes")
router = APIRouter(prefix="/api/integrations", tags=["Unified Enterprise Intelligence"])

@router.get("/status", response_model=List[IntegrationCardInfo])
def get_integrations_status():
    """Retrieve connection status, telemetry counts, and capabilities for all platforms."""
    return get_integrations_status_service()

@router.post("/connect")
def connect_integration(request: ConnectIntegrationRequest):
    """Connect or reconfigure an integration platform (Live OAuth or Certified Demo mode)."""
    return connect_integration_service(
        platform=request.platform,
        token=request.token,
        org_or_workspace=request.org_or_workspace,
        mode=request.mode or "demo"
    )

@router.post("/disconnect")
def disconnect_integration(request: DisconnectIntegrationRequest):
    """Disconnect an integration platform."""
    return disconnect_integration_service(request.platform)

@router.post("/sync", response_model=SyncResponse)
def sync_integrations():
    """Trigger on-demand synchronization of GitHub and Slack activity telemetry."""
    return sync_integrations_service()

@router.get("/activities", response_model=List[ActivityEvent])
def get_activities(
    category: Optional[str] = Query(None, description="Category filter (code, pull_request, issue, chat, announcement)"),
    source: Optional[str] = Query(None, description="Platform source filter (github, slack)"),
    search: Optional[str] = Query(None, description="Search term for descriptions, users, repos, or channels"),
    date_range: Optional[str] = Query("30d", description="Date window (7d, 30d, 90d)")
):
    """Retrieve normalized chronological activity feed across GitHub and Slack."""
    return get_activities_service(
        category=category,
        source=source,
        search=search,
        date_range=date_range
    )

@router.get("/kpis", response_model=KPISummary)
def get_kpis(date_range: Optional[str] = Query("30d")):
    """Get high-level operational KPIs for connected sources, commits, PRs, issues, messages, and contributors."""
    return get_kpis_service(date_range=date_range or "30d")

@router.get("/analytics", response_model=AnalyticsData)
def get_analytics(date_range: Optional[str] = Query("30d")):
    """Get chart data for commit volume, Slack communication velocity, repo shares, and departmental comparisons."""
    return get_analytics_service(date_range=date_range or "30d")

@router.post("/ai-insights", response_model=AIInsightsResponse)
def get_ai_insights(request: AIInsightsRequest):
    """Synthesize cross-platform intelligence using FinNova RAG to correlate development and communication."""
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query string cannot be empty.")
    return generate_ai_insights_service(request.query, request.date_range or "30d")

