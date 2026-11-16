"""CORS policy tests for the local Vite frontend."""

from fastapi.testclient import TestClient

from traffic_app.main import app

client = TestClient(app)


def test_vite_localhost_origin_can_read_health_response() -> None:
    response = client.get(
        "/api/v1/health",
        headers={"Origin": "http://localhost:5173"},
    )

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_vite_loopback_origin_is_allowed_for_preflight() -> None:
    response = client.options(
        "/api/v1/health",
        headers={
            "Origin": "http://127.0.0.1:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "accept",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:5173"
