"""Unit tests for simulation domain models."""

from dataclasses import FrozenInstanceError

import pytest

from traffic_app.simulation.domain.models import Approach, Vehicle


def test_approach_contains_exactly_the_four_directions() -> None:
    assert list(Approach) == [
        Approach.NORTH,
        Approach.SOUTH,
        Approach.EAST,
        Approach.WEST,
    ]


def test_vehicle_preserves_identifier_and_arrival_timestamp() -> None:
    vehicle = Vehicle(vehicle_id="car-001", arrival_time_ms=1234)

    assert vehicle.vehicle_id == "car-001"
    assert vehicle.arrival_time_ms == 1234


@pytest.mark.parametrize("vehicle_id", ["", "   "])
def test_vehicle_rejects_empty_identifier(vehicle_id: str) -> None:
    with pytest.raises(ValueError, match="vehicle_id"):
        Vehicle(vehicle_id=vehicle_id, arrival_time_ms=0)


@pytest.mark.parametrize("vehicle_id", [None, 7])
def test_vehicle_rejects_non_string_identifier(vehicle_id: object) -> None:
    with pytest.raises(ValueError, match="vehicle_id"):
        Vehicle(vehicle_id=vehicle_id, arrival_time_ms=0)  # type: ignore[arg-type]


@pytest.mark.parametrize("timestamp", [-1, -100])
def test_vehicle_rejects_negative_arrival_timestamp(timestamp: int) -> None:
    with pytest.raises(ValueError, match="non-negative"):
        Vehicle(vehicle_id="car-001", arrival_time_ms=timestamp)


@pytest.mark.parametrize("timestamp", [True, False, 1.5, "12", None])
def test_vehicle_rejects_invalid_timestamp_types(timestamp: object) -> None:
    with pytest.raises(TypeError, match="integer"):
        Vehicle(vehicle_id="car-001", arrival_time_ms=timestamp)  # type: ignore[arg-type]


def test_vehicle_fields_are_immutable() -> None:
    vehicle = Vehicle(vehicle_id="car-001", arrival_time_ms=10)

    with pytest.raises(FrozenInstanceError):
        vehicle.arrival_time_ms = 20  # type: ignore[misc]
    with pytest.raises(FrozenInstanceError):
        vehicle.vehicle_id = "car-002"  # type: ignore[misc]
