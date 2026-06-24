# ── Stage 1: build the Vite frontend ─────────────────────────────────────────
FROM node:22-alpine AS frontend

RUN npm install -g pnpm@11 --silent

WORKDIR /workspace

# Copy workspace manifests first (better layer caching)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/engine/package.json         packages/engine/
COPY develop/frontend/package.json        develop/frontend/
COPY serve/frontend/package.json          serve/frontend/

RUN pnpm install --frozen-lockfile

# Copy source and build
COPY packages/         packages/
COPY develop/frontend/ develop/frontend/

WORKDIR /workspace/develop/frontend
RUN pnpm build
# Output: /workspace/develop/app/static/


# ── Stage 2: Python runtime ───────────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

COPY develop/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY develop/app/   ./app/
COPY develop/run.py .

# Pull the built frontend from stage 1
COPY --from=frontend /workspace/develop/app/static/ ./app/static/

EXPOSE 5000
CMD ["python", "-m", "flask", "--app", "run:app", "run", \
     "--host", "0.0.0.0", "--port", "5000"]
