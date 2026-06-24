# Pergola

Pergola is a self-hosted, browser-based app builder. You design your app in **develop**, deploy it with **serve**, and the output is a portable folder that either tool can understand.

---

## Architecture

```
pergola/
├── packages/
│   └── engine/          @pergola/engine — shared React component library
├── develop/             the app builder (what you use to create apps)
│   ├── frontend/        Vite + React
│   └── app/             Flask API
├── serve/               the runtime (what runs finished apps)
│   ├── frontend/        Vite + React
│   └── app/             Flask API
├── app/                 example pergola app (used for testing)
├── nginx/               reverse proxy configs
└── docker-compose.yml
```

### @pergola/engine

A shared pnpm workspace package imported by both develop and serve. It contains:

- **25 React components** — `Text`, `Button`, `Card`, `Input`, `Modal`, `Sidebar`, `Table`, `Toggle`, and more. Every component accepts a `PergolaStyle` prop set (bg, color, font, fontSize, border, borderRadius, shadow, padding, gap, …) for full runtime customization.
- **`FilePicker`** — a browser-based folder navigator that talks to the server-side filesystem API. Used by both develop and serve to select a project.
- **`renderLayout(node)`** — a JSON-to-React renderer. Takes a layout tree like `{ type: "Card", props: {…}, children: […] }` and renders it using the component library. Develop wraps this in an editor context; serve renders it bare.
- **Design system** — a single CSS file with design tokens (colors, radii, shadows, typography) shared across both apps.

Because both apps import from `@pergola/engine`, tree-shaking at build time ensures serve never ships editor-only code.

### pergola-develop

The app builder. Runs at `localhost:8080` by default.

**Stack:** React (Vite) → Nginx → Flask

- The React SPA handles all routing client-side. Flask serves the built assets via a catch-all route and handles `/api/*` requests.
- Lets you create and manage **databases** (real SQLite files), **layouts** (drag-and-drop UI builder, coming soon), and **scripts** (server-side logic, coming soon).
- When you create a database, develop writes two things: the actual `.sqlite` file and a schema mirror in `database/database.json`. On load it checks they match.

### pergola-serve

The runtime. Runs at `localhost:8081` by default.

**Stack:** React (Vite) → Nginx → Flask

- Reads a pergola app folder and runs it — rendering layouts, executing scripts, and serving data from the SQLite databases.
- Uses the same `@pergola/engine` components as develop, so what you see in the editor is exactly what serve renders.
- No editor code is shipped in the serve bundle.

### pergola app

A pergola app is just a folder with a defined structure. Any folder containing a `pergola.json` is a pergola app.

```
my-app/
├── pergola.json          name, version, description
├── database/
│   ├── database.json     registry + schema for all databases
│   └── *.sqlite          actual SQLite database files
├── layouts/              UI layout definitions (JSON)
└── scripts/              server-side scripts
```

### Shared project history

Both develop and serve read and write `~/.pergola/projects.json`. Open a project in develop, switch to serve — your history is already there. In Docker, `${HOME}` is bind-mounted at the same path so the same file is used whether you're running locally or containerised.

---

## Running

### Docker (recommended)

```bash
# Build images (first time, or after code changes)
docker compose build

# Start develop (localhost:8080) and serve (localhost:8081)
docker compose up -d

# Start only develop
docker compose up -d develop-api develop-nginx

# Change ports
DEVELOP_PORT=3000 SERVE_PORT=3001 docker compose up -d

# Stop
docker compose down
```

### Local development (with hot reload)

**Terminal 1 — Flask API:**
```bash
cd develop
python -m flask --app run:app run --port 5000
```

**Terminal 2 — Vite dev server:**
```bash
cd develop/frontend
pnpm dev
# → http://localhost:5173 (proxies /api/* to Flask)
```

### Prerequisites

- Python 3.12+ with a virtualenv (`develop/.venv`)
- Node 22+ and pnpm (`npm install -g pnpm`)
- Docker + Docker Compose (for the containerised setup)

Install Python deps:
```bash
cd develop && python -m venv .venv && .venv/bin/pip install -r requirements.txt
cd ../serve && python -m venv .venv && .venv/bin/pip install -r requirements.txt
```

Install Node deps (from repo root):
```bash
pnpm install
```
