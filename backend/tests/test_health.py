"""Tests for the health endpoint."""

from fastapi.testclient import TestClient

from traffic_app.main import app

client = TestClient(app)


def test_health_returns_http_200() -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200


def test_health_returns_expected_body() -> None:
    response = client.get("/api/v1/health")

    assert response.json() == {"status": "ok"}
