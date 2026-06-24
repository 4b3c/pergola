# ── Stage 1: build the Vite frontend ─────────────────────────────────────────
FROM node:22-alpine AS frontend

RUN npm install -g pnpm@11 --silent

WORKDIR /workspace

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/engine/package.json        packages/engine/
COPY develop/frontend/package.json       develop/frontend/
COPY serve/frontend/package.json         serve/frontend/

RUN pnpm install --frozen-lockfile

COPY packages/        packages/
COPY serve/frontend/  serve/frontend/

WORKDIR /workspace/serve/frontend
RUN pnpm build
# Output: /workspace/serve/app/static/


# ── Stage 2: Python runtime ───────────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

COPY serve/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY serve/app/   ./app/
COPY serve/run.py .

COPY --from=frontend /workspace/serve/app/static/ ./app/static/

EXPOSE 5001
CMD ["python", "-m", "flask", "--app", "run:app", "run", \
     "--host", "0.0.0.0", "--port", "5001"]
