# Dynamic Traffic Lane Allocation with Emergency Vehicle Priority Control

A planned, browser-accessible full-stack website for simulating intelligent traffic management at a four-way intersection. All vehicles, sensors, emergency requests, signal behavior, and digital logic are simulated virtually. This project will not connect to or control real traffic signals or physical hardware.

## Planned technology stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, SVG intersection visualization
- **Backend:** Python, FastAPI, Pydantic, WebSockets
- **Simulation:** independent deterministic traffic simulation engine
- **Analytics:** Plotly.js
- **Testing:** Pytest, Vitest, Playwright
- **Development and deployment:** Git, GitHub, Docker, GitHub Actions

The frontend and backend foundations are implemented. The traffic simulation is not implemented. See [PROJECT_SPECIFICATION.md](PROJECT_SPECIFICATION.md) and [ARCHITECTURE_PROPOSAL.md](ARCHITECTURE_PROPOSAL.md) for requirements and the architecture proposal.

## Initial backend foundation

The initial backend foundation is implemented in `backend/` using Python 3, FastAPI, Pydantic, and Uvicorn. It currently provides only `GET /api/v1/health`; the traffic simulation is not implemented.

### Install and run

Enter the backend directory:

```bash
cd backend
```

Create and activate a virtual environment on Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

On Linux or macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install runtime and development dependencies:

```bash
pip install -e ".[dev]"
```

Start the backend:

```bash
python -m uvicorn traffic_app.main:app --reload --app-dir src
```

Run backend tests from `backend/`:

```bash
python -m pytest
```

Health endpoint: <http://127.0.0.1:8000/api/v1/health>

Interactive API documentation: <http://127.0.0.1:8000/docs>

## Initial frontend foundation

The initial frontend foundation lives in `frontend/` and uses React, TypeScript, Vite, and Tailwind CSS. It provides a responsive project dashboard with planned capability cards, a simulation workspace placeholder, and development status. No traffic simulation is implemented.

### Frontend structure

```text
frontend/
├── public/
├── src/
│   ├── components/  # Header, feature card, and status badge
│   ├── test/        # Vitest setup
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

### Install and run

```bash
cd frontend
npm install
npm run dev
```

Run frontend tests:

```bash
npm run test
```

Check TypeScript:

```bash
npm run typecheck
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Frontend and backend integration

The frontend and backend remain separate applications. The dashboard checks the backend's existing health endpoint using the browser Fetch API. It reports Connected only when the endpoint returns HTTP success and the JSON body contains `{"status":"ok"}`. A failed request, non-success response, or unexpected body displays Disconnected. Use Retry to issue a fresh health check. The frontend does not yet call any simulation APIs.

### Configure the frontend

From `frontend/`, create a local environment file from the example and adjust the URL if the backend uses a different host or port:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

The example configures `VITE_API_BASE_URL=http://localhost:8000`. Vite environment values are public in the browser bundle; do not put secrets in them. Restart the Vite server after changing `.env.local`.

### Run both applications

Start the backend in one terminal:

```bash
cd backend
python -m uvicorn traffic_app.main:app --reload --app-dir src
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The frontend checks `GET http://localhost:8000/api/v1/health`. A healthy backend responds with:

```json
{"status":"ok"}
```

The default backend CORS allowlist includes Vite's `http://localhost:5173` and `http://127.0.0.1:5173` origins. To use another frontend origin, set `TRAFFIC_APP_CORS_ORIGINS` on the backend to a comma-separated list of exact trusted origins. For a production frontend, configure its deployed origin explicitly; do not use a wildcard.

### Integration checks

Run frontend checks from `frontend/`:

```bash
npm run test
npm run typecheck
npm run build
```

Run backend tests from `backend/`:

```bash
python -m pytest
```

If the dashboard shows Disconnected, confirm the backend is running on the configured base URL and that `/api/v1/health` returns `{"status":"ok"}`. If the endpoint works directly but the browser reports a CORS error, confirm the page origin exactly matches one of the backend's allowed origins. Changing the frontend URL requires restarting Vite; changing `TRAFFIC_APP_CORS_ORIGINS` requires restarting Uvicorn.
