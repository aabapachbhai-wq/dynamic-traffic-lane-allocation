"""FastAPI application entry point."""

from fastapi import FastAPI

from traffic_app.api.v1.routes.health import router as health_router

app = FastAPI(
    title="Dynamic Traffic Lane Allocation API",
    description="Initial backend foundation for the project.",
    version="0.1.0",
)

app.include_router(health_router, prefix="/api/v1")
