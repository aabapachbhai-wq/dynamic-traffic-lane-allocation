"""FastAPI application entry point."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from traffic_app.api.v1.routes.health import router as health_router

app = FastAPI(
    title="Dynamic Traffic Lane Allocation API",
    description="Initial backend foundation for the project.",
    version="0.1.0",
)

configured_origins = os.getenv("TRAFFIC_APP_CORS_ORIGINS")
allowed_origins = (
    [origin.strip() for origin in configured_origins.split(",") if origin.strip()]
    if configured_origins
    else ["http://localhost:5173", "http://127.0.0.1:5173"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Accept", "Content-Type"],
)

app.include_router(health_router, prefix="/api/v1")
