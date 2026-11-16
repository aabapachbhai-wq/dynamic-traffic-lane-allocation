"""Health check endpoint."""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    """Response returned when the API is running."""

    status: str


@router.get("/health", response_model=HealthResponse, status_code=200)
def health_check() -> HealthResponse:
    """Report that the backend is responding."""

    return HealthResponse(status="ok")
