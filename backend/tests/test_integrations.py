import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_get_integrations_status():
    resp = client.get("/api/integrations/status")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    platforms = [card["id"] for card in data]
    assert "github" in platforms
    assert "slack" in platforms
    assert "jira" in platforms
    assert "gdrive" in platforms
    assert "notion" in platforms

def test_get_kpis():
    resp = client.get("/api/integrations/kpis?date_range=30d")
    assert resp.status_code == 200
    kpis = resp.json()
    assert kpis["connected_sources"] >= 2
    assert kpis["total_commits"] > 0
    assert kpis["open_prs"] > 0
    assert kpis["slack_messages"] > 0
    assert kpis["active_contributors"] > 0

def test_get_activities_filter():
    # All activities
    resp = client.get("/api/integrations/activities?date_range=30d")
    assert resp.status_code == 200
    activities = resp.json()
    assert len(activities) > 0
    
    # Filter by source GitHub
    resp_gh = client.get("/api/integrations/activities?source=github")
    assert resp_gh.status_code == 200
    gh_acts = resp_gh.json()
    assert all(a["source"] == "github" for a in gh_acts)
    
    # Filter by source Slack
    resp_sl = client.get("/api/integrations/activities?source=slack")
    assert resp_sl.status_code == 200
    sl_acts = resp_sl.json()
    assert all(a["source"] == "slack" for a in sl_acts)

    # Search filter
    resp_search = client.get("/api/integrations/activities?search=v2.4.0")
    assert resp_search.status_code == 200
    search_acts = resp_search.json()
    assert len(search_acts) > 0

def test_get_analytics():
    resp = client.get("/api/integrations/analytics?date_range=30d")
    assert resp.status_code == 200
    analytics = resp.json()
    assert len(analytics["commit_trends"]) > 0
    assert len(analytics["slack_trends"]) > 0
    assert len(analytics["repo_distribution"]) > 0
    assert len(analytics["team_comparison"]) > 0

def test_ai_insights():
    resp = client.post("/api/integrations/ai-insights", json={
        "query": "Summarize development activities this week",
        "date_range": "30d"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "Privacy Shield" in data["answer"] or "v2.4.0" in data["answer"]
    assert len(data["citations"]) > 0
    assert data["confidence"] in ["High", "Medium", "Low"]

def test_connect_and_disconnect():
    # Connect in demo mode
    resp = client.post("/api/integrations/connect", json={
        "platform": "github",
        "mode": "demo"
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "demo_mode"

    # Sync
    sync_resp = client.post("/api/integrations/sync")
    assert sync_resp.status_code == 200
    assert sync_resp.json()["status"] == "success"

    # Disconnect
    disc_resp = client.post("/api/integrations/disconnect", json={
        "platform": "github"
    })
    assert disc_resp.status_code == 200
    assert disc_resp.json()["status"] == "disconnected"

    # Reconnect in demo mode to restore baseline
    reconnect_resp = client.post("/api/integrations/connect", json={
        "platform": "github",
        "mode": "demo"
    })
    assert reconnect_resp.status_code == 200

