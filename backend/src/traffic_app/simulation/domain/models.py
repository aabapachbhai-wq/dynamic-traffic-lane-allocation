"""Core types for virtual intersection approaches and vehicles."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class Approach(str, Enum):
    """One of the four directional approaches to the intersection."""

    NORTH = "NORTH"
    SOUTH = "SOUTH"
    EAST = "EAST"
    WEST = "WEST"


@dataclass(frozen=True, slots=True)
class Vehicle:
    """An ordinary virtual vehicle and its simulation arrival timestamp."""

    vehicle_id: str
    arrival_time_ms: int

    def __post_init__(self) -> None:
        if not isinstance(self.vehicle_id, str) or not self.vehicle_id.strip():
            raise ValueError("vehicle_id must be a non-empty string.")
        if type(self.arrival_time_ms) is not int:
            raise TypeError("arrival_time_ms must be an integer.")
        if self.arrival_time_ms < 0:
            raise ValueError("arrival_time_ms must be non-negative.")
