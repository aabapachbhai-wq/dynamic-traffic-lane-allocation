"""Independent FIFO vehicle queues for each intersection approach."""

from __future__ import annotations

from collections import deque

from traffic_app.simulation.domain.models import Approach, Vehicle


class VehicleQueueManager:
    """Manage one FIFO queue per approach without storing duplicate counts."""

    def __init__(self) -> None:
        self._queues: dict[Approach, deque[Vehicle]] = {
            approach: deque() for approach in Approach
        }

    def enqueue(self, approach: Approach, vehicle: Vehicle) -> None:
        """Add a vehicle to the rear of its approach queue.

        Raises:
            TypeError: If the approach or vehicle has the wrong type.
            ValueError: If this vehicle ID is already active in any queue.
        """
        self._validate_approach(approach)
        if not isinstance(vehicle, Vehicle):
            raise TypeError("vehicle must be a Vehicle instance.")
        if any(
            queued_vehicle.vehicle_id == vehicle.vehicle_id
            for queue in self._queues.values()
            for queued_vehicle in queue
        ):
            raise ValueError(f"vehicle_id {vehicle.vehicle_id!r} is already queued.")

        self._queues[approach].append(vehicle)

    def dequeue(self, approach: Approach) -> Vehicle | None:
        """Remove and return the oldest vehicle, or None if the queue is empty."""
        self._validate_approach(approach)
        queue = self._queues[approach]
        return queue.popleft() if queue else None

    def get_queue_count(self, approach: Approach) -> int:
        """Return the current queue length for an approach."""
        self._validate_approach(approach)
        return len(self._queues[approach])

    def is_empty(self, approach: Approach) -> bool:
        """Return whether the selected approach has no waiting vehicles."""
        self._validate_approach(approach)
        return not self._queues[approach]

    def get_all_counts(self) -> dict[Approach, int]:
        """Return current queue lengths for every approach."""
        return {
            approach: len(queue)
            for approach, queue in self._queues.items()
        }

    def inspect_queue(self, approach: Approach) -> tuple[Vehicle, ...]:
        """Return an immutable FIFO snapshot of an approach queue."""
        self._validate_approach(approach)
        return tuple(self._queues[approach])

    @staticmethod
    def _validate_approach(approach: Approach) -> None:
        if not isinstance(approach, Approach):
            raise TypeError("approach must be an Approach enum member.")
