"""Unit tests for per-approach FIFO vehicle queues."""

import pytest

from traffic_app.simulation.domain.models import Approach, Vehicle
from traffic_app.simulation.engine.queues import VehicleQueueManager


def make_vehicle(vehicle_id: str, arrival_time_ms: int = 0) -> Vehicle:
    return Vehicle(vehicle_id=vehicle_id, arrival_time_ms=arrival_time_ms)


def test_all_four_queues_start_empty_with_zero_counts() -> None:
    queues = VehicleQueueManager()

    assert queues.get_all_counts() == {approach: 0 for approach in Approach}
    assert all(queues.is_empty(approach) for approach in Approach)


@pytest.mark.parametrize(
    ("approach", "vehicle_count"),
    [(Approach.NORTH, 3), (Approach.EAST, 5)],
)
def test_enqueue_updates_only_the_selected_approach_count(
    approach: Approach,
    vehicle_count: int,
) -> None:
    queues = VehicleQueueManager()
    for index in range(vehicle_count):
        queues.enqueue(approach, make_vehicle(f"{approach.value.lower()}-{index}"))

    counts = queues.get_all_counts()
    assert counts[approach] == vehicle_count
    assert all(count == 0 for direction, count in counts.items() if direction != approach)


def test_dequeue_reduces_only_the_selected_approach_count() -> None:
    queues = VehicleQueueManager()
    queues.enqueue(Approach.NORTH, make_vehicle("north-1"))
    queues.enqueue(Approach.EAST, make_vehicle("east-1"))

    removed = queues.dequeue(Approach.NORTH)

    assert removed == make_vehicle("north-1")
    assert queues.get_queue_count(Approach.NORTH) == 0
    assert queues.get_queue_count(Approach.EAST) == 1


def test_dequeue_preserves_fifo_order() -> None:
    queues = VehicleQueueManager()
    vehicles = [make_vehicle(f"north-{index}", index * 100) for index in range(3)]
    for vehicle in vehicles:
        queues.enqueue(Approach.NORTH, vehicle)

    assert [queues.dequeue(Approach.NORTH) for _ in vehicles] == vehicles
    assert queues.get_queue_count(Approach.NORTH) == 0


def test_dequeue_from_empty_queue_returns_none_and_never_goes_negative() -> None:
    queues = VehicleQueueManager()

    assert queues.dequeue(Approach.WEST) is None
    assert queues.get_queue_count(Approach.WEST) == 0
    assert queues.dequeue(Approach.WEST) is None
    assert queues.get_queue_count(Approach.WEST) == 0


def test_get_all_counts_includes_each_approach() -> None:
    queues = VehicleQueueManager()
    queues.enqueue(Approach.NORTH, make_vehicle("north-1"))
    queues.enqueue(Approach.NORTH, make_vehicle("north-2"))
    queues.enqueue(Approach.SOUTH, make_vehicle("south-1"))
    queues.enqueue(Approach.WEST, make_vehicle("west-1"))

    assert queues.get_all_counts() == {
        Approach.NORTH: 2,
        Approach.SOUTH: 1,
        Approach.EAST: 0,
        Approach.WEST: 1,
    }


def test_queue_inspection_returns_fifo_snapshot_with_original_timestamps() -> None:
    queues = VehicleQueueManager()
    vehicles = [make_vehicle("first", 125), make_vehicle("second", 275)]
    for vehicle in vehicles:
        queues.enqueue(Approach.SOUTH, vehicle)

    snapshot = queues.inspect_queue(Approach.SOUTH)

    assert snapshot == tuple(vehicles)
    assert [vehicle.arrival_time_ms for vehicle in snapshot] == [125, 275]


def test_queue_snapshot_cannot_be_used_to_modify_internal_queue() -> None:
    queues = VehicleQueueManager()
    original = make_vehicle("north-1")
    queues.enqueue(Approach.NORTH, original)
    snapshot = queues.inspect_queue(Approach.NORTH)

    with pytest.raises(AttributeError):
        snapshot.append(make_vehicle("north-2"))  # type: ignore[attr-defined]
    with pytest.raises(TypeError):
        snapshot[0] = make_vehicle("north-2")  # type: ignore[index]

    assert queues.inspect_queue(Approach.NORTH) == (original,)


def test_duplicate_vehicle_id_is_rejected_across_active_queues() -> None:
    queues = VehicleQueueManager()
    queues.enqueue(Approach.NORTH, make_vehicle("shared-id"))

    with pytest.raises(ValueError, match="already queued"):
        queues.enqueue(Approach.EAST, make_vehicle("shared-id", 50))

    assert queues.get_all_counts() == {
        Approach.NORTH: 1,
        Approach.SOUTH: 0,
        Approach.EAST: 0,
        Approach.WEST: 0,
    }


def test_vehicle_id_can_be_reused_after_previous_vehicle_is_removed() -> None:
    queues = VehicleQueueManager()
    queues.enqueue(Approach.NORTH, make_vehicle("reusable"))
    queues.dequeue(Approach.NORTH)

    queues.enqueue(Approach.WEST, make_vehicle("reusable", 100))

    assert queues.inspect_queue(Approach.WEST) == (make_vehicle("reusable", 100),)


@pytest.mark.parametrize("invalid_approach", ["NORTH", "north", None, 1])
def test_invalid_approach_is_rejected(invalid_approach: object) -> None:
    queues = VehicleQueueManager()

    with pytest.raises(TypeError, match="Approach"):
        queues.get_queue_count(invalid_approach)  # type: ignore[arg-type]


def test_invalid_vehicle_object_is_rejected() -> None:
    queues = VehicleQueueManager()

    with pytest.raises(TypeError, match="Vehicle"):
        queues.enqueue(Approach.NORTH, object())  # type: ignore[arg-type]
