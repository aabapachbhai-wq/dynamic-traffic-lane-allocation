# Project Technical Specification

## 1. Project overview and problem statement

**Dynamic Traffic Lane Allocation with Emergency Vehicle Priority Control** is a planned browser-based software simulation of signal control at a four-way intersection. It is intended to model vehicle arrivals on North, South, East, and West approaches, allocate green time according to traffic demand, and provide priority to virtual emergency requests through safe signal transitions. Fixed-time and adaptive operation will be compared in simulation.

Traffic signals that allocate time without regard to current queues can leave some approaches waiting while others have little demand. A queue-aware controller offers a way to explore how demand-based approach selection and timing affect waiting and service measures. This project describes an educational software model; it does not control a real intersection.

The initial model serves one approach at a time. It provides approach-level signal priority, not physical lane reassignment. This is a simplified virtual intersection simulation: it does not represent compatible simultaneous movements, turning conflicts, pedestrian phases, lane geometry, or a certified traffic controller.

## 2. Project objectives

- Model four independent FIFO vehicle queues and their changing lengths.
- Keep a digital counter for each approach, derived from its queue.
- Classify queue density into LOW, MEDIUM, or HIGH using provisional thresholds.
- Select an approach with the maximum queue and resolve equal maxima using a rotating tie-break.
- Model emergency request latching, safe phase changes, and recovery to ordinary operation.
- Calculate adaptive green duration from queue demand using configurable limits.
- Represent signal operation with GREEN, YELLOW, and ALL-RED states and timed transitions.
- Support fixed-time and adaptive modes under a common simulation clock and service model.
- Report performance metrics suitable for comparing simulation runs.
- Deliver a browser-accessible React/TypeScript website backed by Python/FastAPI.
- Keep simulation/control logic independent from FastAPI and browser presentation.
- Present virtual digital electronics and intersection state with SVG and Plotly.js analytics.

## 3. Scope and terminology

- **Approach**: one of North, South, East, or West.
- **Queue**: the ordered set of waiting vehicles on an approach.
- **Vehicle counter**: the displayed count for an approach; queue length is its source of truth.
- **Approach-selection policy**: logic that chooses which approach should receive service.
- **Signal FSM**: logic that controls the current signal state and legal transitions.
- **Simulation time**: the model's logical clock, independent of wall-clock time.
- **Emergency request**: a latched request associated with an approach. The dispatch/multiple-request policy is TBD.

The simulation concerns one virtual four-way junction and one active green directional approach at a time. All vehicles, sensors, emergency requests, traffic movements, and digital logic exist only in software. This strictly software-based project does not include physical traffic equipment or real-world control. Signal priority is assigned to an approach; physical lane reassignment is not performed.

## 4. Functional requirements

### 4.1 Queues, arrivals, and counters

1. The simulation shall maintain four independent queues: North, South, East, and West.
2. Each queue shall be FIFO: vehicles are served in the order they arrive.
3. Each vehicle shall retain its simulation arrival timestamp for waiting-time calculations.
4. Arrivals shall be enqueued at their event time. The arrival-generation model and its parameters are TBD; users may need deterministic/manual arrivals for controlled experiments, TBD.
5. Each approach shall display a digital vehicle counter equal to the current queue length. The displayed counter shall not be stored or updated as an independent count.
6. Removing a served vehicle shall remove the queue head and therefore reduce the derived counter by one.
7. Queue capacity, overflow handling, vehicle attributes beyond arrival time, and handling arrivals at the same timestamp are TBD.

### 4.2 Density classification

Density is classified from current queue length using these provisional defaults:

| Class | Queue length |
|---|---:|
| LOW | 0–4 vehicles |
| MEDIUM | 5–9 vehicles |
| HIGH | 10 or more vehicles |

These thresholds are initial simulation defaults, not experimentally validated values or research requirements. Whether thresholds should be configurable and whether density affects timing in addition to queue length are TBD.

### 4.3 Approach selection and rotating tie-break

1. In adaptive mode, the approach-selection policy shall identify the largest current queue.
2. If one approach has a strictly largest queue, that approach shall be selected, subject to emergency policy.
3. If multiple approaches share the maximum queue length, a rotating tie-break shall choose among tied approaches according to a stable direction order and a persisted rotation position.
4. The rotation shall advance after a tie is resolved (exact advancement semantics TBD). If only one approach is tied at the maximum, it shall be selected without a tie decision (whether the rotation pointer advances in that case is TBD).
5. If there are no ordinary vehicles and no pending emergency requests at a phase-selection point, the controller shall remain ALL-RED until demand arrives.
6. This policy selects an approach; it does not itself change signal state. The FSM independently enforces safe phase sequencing.

The initial direction order for rotation is North, East, South, West, but this order is a proposed convention and requires approval (TBD).

### 4.4 Emergency request latching, transition, and recovery

1. Each emergency vehicle shall be a separate virtual entity with request ID, approach, request timestamp, and its own FIFO position. It shall never be inserted into, remove, or reorder vehicles in the ordinary approach queue.
2. Pending emergency entities shall be ordered by request timestamp; requests with the same timestamp retain stable external REST command-sequence order.
3. Emergency requests shall not interrupt the current GREEN abruptly. If the oldest pending emergency request is for the currently green approach, it is served at the next eligible service event within the existing phase; that phase's timer is not restarted or shortened. If the service event would occur at or after the green deadline, the deadline is processed first and the request remains pending. At the phase decision, if that same approach is selected again, GREEN is continuously renewed and the request waits for the next service opportunity; if a different approach is selected, the request waits through YELLOW and ALL-RED before its approach can receive GREEN.
4. If the oldest pending request is for another approach, the current GREEN completes normally and the controller passes through YELLOW and ALL-RED before granting that approach GREEN.
5. Emergency service completes at the service event that serves the emergency entity. At that timestamp, the entity is removed from the emergency FIFO and its request latch is cleared. Response time is service timestamp minus request timestamp. Each service event serves at most one entity; it serves the globally oldest emergency request if that request is for the active approach, otherwise it may serve one ordinary FIFO vehicle.
6. The emergency service event does not end or shorten the phase. The selected green retains its mode duration: adaptive duration using ordinary queue length at selection, or 10 seconds in fixed mode. Once the phase finishes, the normal YELLOW/ALL-RED sequence occurs. If emergency requests remain, the oldest is selected at the next safe phase-selection point; otherwise control recovers to ordinary adaptive selection or the stored next fixed-order approach.
7. These emergency sequencing, service, and recovery rules are provisional software-model decisions and require academic validation. They are not real-world emergency preemption guidance.

This is a simulation policy only. It does not assert compliance with real-world emergency vehicle preemption standards.

### 4.5 Adaptive green-time calculation

Adaptive mode shall calculate green duration from the ordinary vehicle queue length `Q` of the selected approach, sampled at phase selection, using:

`G = clamp(5, 30, 5 + Q)` seconds

Provisional initial values:

| Parameter | Value |
|---|---:|
| Minimum green | 5 seconds |
| Maximum green | 30 seconds |
| Seconds added per queued vehicle | 1 second |

The formula is a provisional simulation rule requiring academic validation. `Q` is a snapshot and does not change the current phase duration when vehicles arrive or are served during GREEN. A later phase selection takes a new snapshot. Since simulation time is integer milliseconds and `Q` is an integer, the calculated duration is an integer number of seconds.

### 4.6 Signal finite-state machine

The signal controller shall use these states:

- **GREEN**: the active approach is authorized for simulated vehicle service.
- **YELLOW**: transition warning interval after GREEN; no vehicle service occurs during this state.
- **ALL-RED**: clearance/idle interval with no vehicle service before another approach can receive GREEN.

Provisional durations are Yellow = 3 seconds and All-Red = 1 second. Green duration is set by the selected mode. A change from one green approach to another shall follow `GREEN → YELLOW → ALL-RED → GREEN`; direct GREEN-to-GREEN is prohibited. State transitions shall be driven by simulation time, not real-time sleeps. If a GREEN phase ends at time `T`, its service eligibility ends before service events at `T` are processed; that ending green shall not serve a vehicle at `T`.

The initial state is ALL-RED with no active approach or phase deadline. With no ordinary vehicles and no pending emergency requests, the controller remains ALL-RED indefinitely. At initial startup, an ordinary arrival or emergency request is processed before selection; because the system is already ALL-RED, the first selected GREEN may begin at that event timestamp without an additional clearance wait. A change to a different approach requires GREEN → YELLOW → ALL-RED → GREEN. If the same approach is selected at its green phase boundary, keep its indication continuously GREEN and renew its phase timer without a state transition or clearance interval. The ending phase's service deadline remains exclusive, and the next service opportunity occurs one full headway after renewal. The initial single-approach model does not represent conflicting movements within an approach.

### 4.7 Fixed-time and adaptive modes

- **Fixed-time mode** shall use the repeating North → East → South → West order with a provisional 10-second GREEN duration per approach. Once a cycle starts, an empty scheduled approach retains its full green duration and serves zero vehicles while demand remains elsewhere. Fixed mode remains ALL-RED until demand arrives. If an emergency request is pending, the oldest request receives the next safe GREEN; otherwise ordinary demand starts/rejoins the stored fixed sequence, initially at North. If all demand is gone at a phase-selection point, the controller completes any required safe transition and idles in ALL-RED rather than running empty cycles. The 10-second duration requires academic validation.
- **Adaptive mode** shall select approaches using maximum queue and rotating tie-break, with adaptive green-time calculation and emergency priority.
- Both modes shall use the same arrival stream, queue behavior, vehicle service model, simulation clock, and metric definitions in a comparison run, where feasible.
- In fixed-time mode, an emergency request overrides which approach receives the next safe phase; that priority phase uses the same 10-second duration. After it completes and transitions safely, fixed order resumes after the emergency-served approach.
- Fair comparison methodology, random seed handling, run duration, warm-up, and repeated-run policy are TBD.

### 4.8 Simulation clock and vehicle service model

1. **Version 1 clock and lifecycle:** simulation time is an integer count of milliseconds. The engine is event-driven and each `advance(1000)` call advances at most 1,000 simulated milliseconds. The Step action is accepted while PAUSED and advances exactly 1,000 ms once. Run sets lifecycle to RUNNING and repeatedly invokes the same engine advance. Pause sets lifecycle to PAUSED; per-session commands and advances are serialized, so any current quantum finishes and no later quantum starts after Pause takes effect. Step is rejected while RUNNING. Reset returns the engine to its configured initial state and PAUSED lifecycle. Repeated Run while RUNNING and Pause while PAUSED are idempotent.
2. The provisional vehicle-service headway is 2 seconds. The first service opportunity is one full headway after GREEN begins; subsequent opportunities are spaced by one headway. At most one entity is served at each opportunity. Same-approach GREEN renewal schedules the next opportunity one full headway after renewal. The 2-second value requires academic validation.
3. At a service opportunity, serve the globally oldest pending emergency entity if its approach is active GREEN; otherwise serve the head of that approach's ordinary FIFO queue if nonempty. An emergency entity is separate from the ordinary queue and does not change its FIFO order. If an emergency request arrives exactly at a service timestamp, it is processed after that timestamp's service opportunity and cannot use that slot.
4. Ordinary service removes the queue head. Service is instantaneous at the service-event timestamp; headway is the spacing between service events, not an added vehicle service duration.
5. For a completed ordinary vehicle `i`, waiting time in milliseconds is `service_time_i - arrival_time_i`; display seconds by dividing by 1,000. Per-approach and overall average waiting time are `sum(wait_i) / number_of_completed_ordinary_vehicles`; if no ordinary vehicles were completed, report no value. Elapsed waiting for an unserved vehicle may be shown at snapshot time as `snapshot_time - arrival_time`, but is excluded from completed-vehicle averages. Emergency response time is `emergency_service_time - request_time`, reported separately and displayed in seconds.
6. Throughput over `[t0, t1)` is the number of service events whose timestamps satisfy `t0 <= service_time < t1`. Report ordinary, emergency, and combined counts; normalized throughput is `count * 60,000 / (t1 - t0)` vehicles per simulated minute when `t1 > t0`. A service at exactly `t1` belongs to the next interval. Maximum ordinary wait is the maximum of completed ordinary-vehicle waits; no percentile is required for Version 1.
7. At each timestamp `T`, process events in this stable order: (a) signal phase deadlines, expiring the ending phase's service eligibility; (b) eligible vehicle-service events only if their phase remains service-eligible GREEN; (c) external arrivals and emergency requests in stable command-sequence order; (d) controller decisions including emergency priority and normal approach selection; (e) scheduling of subsequent events; (f) publication of ordered domain events and updated state. If the same approach is selected again at a phase boundary, its GREEN indication remains continuous, but no service occurs at `T` from the expired phase and the renewed phase's next opportunity is one headway later.
8. Thus, a green ending at `T` cannot serve at `T`. At an ALL-RED deadline, process the phase deadline first, then service (none during ALL-RED), then external arrivals and requests at `T`, then controller selection, so all such inputs are considered before next GREEN. Events within each processing category use stable insertion order; external inputs preserve their REST command sequence.
9. Playback speed is a frontend presentation setting for interpolation/replay between server-authoritative states. It does not control engine advancement or change logical advance size, timestamps, event order, or controller decisions. Browser animation never advances simulation time. Allowed playback-rate range/default are TBD. The command log records each accepted command in sequence with the logical timestamp/state version at which it applies; replaying that ordered log, including Run/Pause boundaries, with identical initial configuration, scenario, and seed (if stochastic arrivals are approved) shall produce identical ordered domain events and final state.

### 4.9 Performance metrics

The backend shall calculate completed-vehicle ordinary waiting time and emergency response time as defined in Section 4.8. Throughput uses half-open intervals `[t0, t1)` and reports ordinary, emergency, and combined completions plus vehicles per simulated minute. Unserved vehicle elapsed waits may be displayed separately and are excluded from completed-vehicle averages.

The simulation shall also expose queue length over time, maximum/average queue per approach, arrivals/served/remaining totals, signal time by FSM state and approach, and fixed-time versus adaptive comparisons on identical input scenarios. Sampling windows and aggregation details for these additional metrics remain TBD. Version 1 does not require percentile-wait reporting.

## 5. Non-functional requirements

- **Correctness:** queue counts, FIFO service, priority decisions, emergency latching, and FSM transitions shall be deterministic and testable for a given event stream and configuration.
- **Safety within the model:** state transitions shall never skip the required clearance path when changing active approaches; emergency requests shall not cause an abrupt GREEN interruption.
- **Separation of concerns:** simulation rules shall be usable without FastAPI or the frontend; transport and UI code shall not own domain decisions.
- **Reproducibility:** scenario inputs and configuration should be recordable; random arrival generation should support a seed if stochastic arrivals are implemented (details TBD).
- **Usability:** the React website should present approach queues/counters, signal state, mode, and metrics clearly; exact interface layout and controls are TBD.
- **Visualization:** SVG should initially visualize the virtual intersection and digital logic; Plotly.js should support interactive time-series and mode-comparison charts. Details and export requirements are TBD.
- **Maintainability:** modules should have focused responsibilities, explicit configuration, and tests for core behavior.
- **Performance:** target maximum scenario size and response-time requirement are TBD. The initial simulator is expected to prioritize clarity and correctness over real-time deployment.
- **Compatibility/accessibility:** supported Python versions, browser requirements, and accessibility targets are TBD.

## 6. Provisional initial configuration

| Setting | Initial value | Status |
|---|---:|---|
| LOW density | 0–4 vehicles | Provisional |
| MEDIUM density | 5–9 vehicles | Provisional |
| HIGH density | 10+ vehicles | Provisional |
| Minimum green | 5 seconds | Provisional |
| Maximum green | 30 seconds | Provisional |
| Adaptive green formula | `clamp(5, 30, 5 + Q)` seconds | Provisional; academic validation required |
| Fixed-time order | North → East → South → West | Version 1 decision |
| Fixed-time green | 10 seconds per approach | Provisional; academic validation required |
| Yellow | 3 seconds | Provisional |
| All-red | 1 second | Provisional |
| Vehicle service headway | 2 seconds | Provisional |

Initial signal state is ALL-RED. Adaptive `Q` is the ordinary queue length sampled at phase selection. Empty fixed-time phases retain their scheduled duration while demand remains elsewhere.

Values are simulation defaults proposed for an initial academic model, not experimentally validated values, externally imposed requirements, or physical signal timing recommendations. The configuration schema and whether users can edit these values are TBD.

## 7. Proposed modular software architecture

The proposed full-stack architecture is in [ARCHITECTURE_PROPOSAL.md](ARCHITECTURE_PROPOSAL.md). The planned repository structure is the same in both documents:

```text
project-root/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/{simulation,intersection,digital-logic,analytics}/
│   │   ├── services/{api,realtime}/
│   │   ├── types/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.*
│   ├── tsconfig.json
│   └── Dockerfile
├── backend/
│   ├── src/traffic_app/
│   │   ├── main.py
│   │   ├── api/{rest,websocket}/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── sessions/
│   │   ├── realtime/
│   │   └── simulation/{domain,engine,logic,controller,analytics}/
│   ├── tests/{unit,integration}/
│   ├── pyproject.toml
│   └── Dockerfile
├── e2e/
├── docs/
├── .github/workflows/ci.yml
├── docker-compose.yml
├── PROJECT_SPECIFICATION.md
├── ARCHITECTURE_PROPOSAL.md
├── README.md
└── LICENSE
```

The approach-selection policy decides *which approach* receives signal priority; it does not reassign physical lanes. The timing policy decides *how long* its green should last. The FSM decides *when* a state change is legal and enforces GREEN → YELLOW → ALL-RED → next GREEN. Emergency request state is coordinated with these components without bypassing the FSM. REST is the only client-to-server command channel in Version 1; WebSockets publish versioned snapshots and ordered server events. Both REST command execution and publication use the same application service and simulation engine. On reconnect, the server sends a complete current snapshot before resuming live ordered events; clients detecting a sequence gap reconnect to obtain a fresh snapshot.

## 8. Testing strategy

Pytest shall be used for automated tests. The testing plan should include:

- Queue FIFO ordering, arrival timestamp retention, and count equality to queue length after enqueue/dequeue.
- Density values at threshold boundaries and immediately around them.
- Maximum-queue selection, unique maximum, all-way tie, partial tie, and rotating tie behavior.
- Emergency request persistence, arrival during each FSM state, safe service opportunity, clearing, and recovery behavior.
- Adaptive timing at minimum, maximum, and intermediate demand; invalid configuration handling.
- FSM legal transitions, duration boundaries, no direct GREEN-to-GREEN, and service eligibility by state.
- Simulation clock monotonicity, deterministic event ordering, FIFO service, and reproducibility for a fixed scenario.
- Same-timestamp ordering: phase deadlines precede service; a green ending at T cannot serve at T; eligible service precedes external input; arrivals/requests preserve command order; controller selection follows inputs; scheduling precedes publication.
- ALL-RED deadline tests: arrivals and emergency requests at the clearance timestamp are applied before selecting the next GREEN approach.
- Run/Pause/Step lifecycle tests: Step advances exactly 1,000 ms while paused, Run repeats the same engine advance, Pause prevents later advances after the current serialized quantum, each engine advance is capped at 1,000 ms, and playback speed/browser animation do not affect engine results.
- Deterministic replay tests compare ordered domain events and final state for identical initial configuration, scenario, and REST command sequence.
- Metric calculations for empty runs, completed vehicles, waiting vehicles, and boundary events.
- Fixed/adaptive comparisons using controlled, identical input scenarios.
- Vitest component/service tests and Playwright browser workflows for the planned React website.

Core domain tests should not require launching an HTTP server or browser. Test framework plugins and coverage targets are TBD. No tests or implementation are created by this specification.

## 9. Limitations and future improvements

### Initial limitations

- The model is a simplified single-approach-at-a-time intersection abstraction.
- It does not model turning movements, conflicting streams, pedestrian/bicycle phases, lane geometry, spillback, saturation flow, vehicle classes, driver behavior, weather, or road-network interactions.
- Provisional thresholds and time values are not based on validation data and are not guidance for real signal design.
- Emergency priority is an abstract simulation policy and is not a certified preemption protocol.
- Software results cannot be treated as evidence of real-world safety or operational improvement without calibration, validation, and domain review.
- This project is strictly a virtual, browser-accessible software simulation. It does not include physical traffic equipment or real-world traffic control.

### Possible future improvements (not committed requirements)

- Model compatible simultaneous movements, turning conflicts, and phase plans.
- Add pedestrian crossings, transit priority, multiple lanes, and finite queue capacity.
- Calibrate arrival/service models and timing parameters against suitable traffic data.
- Add repeatable stochastic scenarios and statistical comparison across runs.
- Explore fairness constraints, starvation prevention, and more sophisticated control strategies.
- Export run configurations and results for analysis.
- Improve virtual intersection fidelity with compatible movements and richer software-only traffic scenarios.

## 10. Unresolved decisions (TBD)

The following decisions remain open and should be resolved before the corresponding implementation is finalized:

1. **Scenario inputs:** manual/scripted versus stochastic arrivals, distributions, default scenarios, and run horizon.
2. **Queue model:** capacity, overflow handling, vehicle fields beyond arrival time, and idempotency rules for duplicate external input.
3. **Density policy:** whether density classes affect selection/timing beyond queue length and whether provisional thresholds are configurable.
4. **Tie-break policy:** approval of the proposed North → East → South → West order and pointer advancement/reset behavior for partial and unique maxima.
5. **Fixed/adaptive comparison:** warm-up, run horizon, random seed policy, repeated trials, scenario pairing, and reporting method.
6. **Additional metric aggregation:** queue sampling/averaging windows, FSM/approach time aggregation, and chart windows. Waiting-time and throughput formulas are defined in Section 4.8.
7. **Playback/UI:** allowed playback-rate range/default, editable simulation settings, chart selection/export, and accessibility requirements.
8. **API/WebSocket contract:** final request/response fields, error envelope, idempotency/conflict behavior, protocol versioning, ping/pong timing, backpressure, event retention, and request/connection rate limits.
9. **Session/security:** authentication, per-session ownership/sharing, expiry, restart behavior, persistence, concurrent-session quotas, and multi-worker scaling.
10. **Engineering/deployment:** supported Python/Node versions, dependency policy, exact method signatures, test coverage/browser matrix, performance/resource targets, hosting, image layout, secrets, TLS, monitoring, rollback, and CI deployment policy.
11. **Academic validation:** calibration data, validation method, and acceptance criteria for interpreting results. Provisional traffic thresholds, adaptive green values, fixed 10-second phases, 3-second yellow, 1-second all-red, 2-second service headway, the instantaneous service abstraction, metric assumptions, and emergency-policy conventions require academic validation.

The Version 1 scope itself is settled: browser-based virtual simulation with approach-level signal priority only. Physical hardware, physical lane reassignment, and real traffic control are excluded. Initial ALL-RED/no-demand behavior, adaptive formula, fixed phase order/duration, emergency sequencing/clearing/recovery, same-approach GREEN renewal, clock representation, event-processing precedence, service-event waiting-time formula, throughput interval formula, 1,000 ms Step/Run quantum, per-advance cap, deterministic replay requirement, and Run/Pause lifecycle are defined above and are not TBD.

Traffic density and signal timing defaults remain provisional until approved. The Version 1 clock decisions in Section 4.8 (integer milliseconds, 1,000 ms Step/Run quantum, event ordering, and lifecycle) are fixed by the project owner. No implementation requirement should be inferred from a possible future improvement.
