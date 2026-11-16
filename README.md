# Dynamic Traffic Lane Allocation with Emergency Vehicle Priority Control

A planned, browser-accessible full-stack website for simulating intelligent traffic management at a four-way intersection. All vehicles, sensors, emergency requests, signal behavior, and digital logic are simulated virtually. This project will not connect to or control real traffic signals or physical hardware.

## Planned technology stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, SVG intersection visualization
- **Backend:** Python, FastAPI, Pydantic, WebSockets
- **Simulation:** independent deterministic traffic simulation engine
- **Analytics:** Plotly.js
- **Testing:** Pytest, Vitest, Playwright
- **Development and deployment:** Git, GitHub, Docker, GitHub Actions

The application is at the planning stage; the traffic simulation and frontend are not implemented. See [PROJECT_SPECIFICATION.md](PROJECT_SPECIFICATION.md) and [ARCHITECTURE_PROPOSAL.md](ARCHITECTURE_PROPOSAL.md) for requirements and the architecture proposal.

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

The initial frontend foundation lives in `frontend/` and uses React, TypeScript, Vite, and Tailwind CSS. It provides a responsive project dashboard with planned capability cards, a simulation workspace placeholder, and development status. The frontend runs independently and does not connect to the backend. No traffic simulation is implemented.

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
