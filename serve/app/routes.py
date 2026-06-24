from flask import Blueprint, request, jsonify
import os
import json
from datetime import datetime

main = Blueprint("main", __name__)

app_path = None

# Same shared file as develop — one history across all pergola tools.
PROJECTS_FILE = os.environ.get(
    "PERGOLA_PROJECTS_FILE",
    os.path.expanduser("~/.pergola/projects.json"),
)


# ── Project history helpers ───────────────────────────────────────────────────

def _read_projects():
    try:
        with open(PROJECTS_FILE) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def _write_projects(projects):
    os.makedirs(os.path.dirname(PROJECTS_FILE), exist_ok=True)
    with open(PROJECTS_FILE, "w") as f:
        json.dump(projects, f, indent=2)


def _read_meta(path):
    try:
        with open(os.path.join(path, "pergola.json")) as f:
            return json.load(f)
    except Exception:
        return {"name": os.path.basename(path), "version": "0.1.0", "description": ""}


# ── Status ────────────────────────────────────────────────────────────────────

@main.route("/api/app-status")
def app_status():
    if not app_path:
        return jsonify({"open": False})
    meta = _read_meta(app_path)
    return jsonify({"open": True, "path": app_path, "meta": meta})


# ── Project history ───────────────────────────────────────────────────────────

@main.route("/api/projects")
def get_projects():
    return jsonify(_read_projects())


@main.route("/api/projects", methods=["POST"])
def add_project():
    data = request.get_json()
    name = data.get("name", "").strip()
    path = data.get("path", "").strip()
    if not name or not path:
        return jsonify({"error": "name and path required"}), 400
    projects = _read_projects()
    projects = [p for p in projects if p["path"] != path]
    projects.insert(0, {"name": name, "path": path, "opened_at": datetime.utcnow().isoformat()})
    _write_projects(projects[:20])
    return jsonify({"success": True})


# ── Path selection ────────────────────────────────────────────────────────────

@main.route("/api/set-path", methods=["POST"])
def set_path():
    global app_path
    data = request.get_json()
    path = data.get("path", "")
    if path and os.path.isdir(path):
        app_path = path
        return jsonify({"success": True, "path": app_path})
    return jsonify({"error": "Invalid path"}), 400


@main.route("/api/close-app", methods=["POST"])
def close_app():
    global app_path
    app_path = None
    return jsonify({"success": True})


# ── Filesystem browser ────────────────────────────────────────────────────────

@main.route("/api/browse")
def browse():
    raw  = request.args.get("path", "~")
    path = os.path.abspath(os.path.expanduser(raw))
    try:
        names = sorted(os.listdir(path))
    except PermissionError:
        return jsonify({"error": "Permission denied"}), 403
    dirs   = [{"name": n, "path": os.path.join(path, n)}
              for n in names
              if os.path.isdir(os.path.join(path, n)) and not n.startswith(".")]
    crumbs = [{"name": "/", "path": "/"}]
    acc    = ""
    for part in path.split(os.sep)[1:]:
        acc += "/" + part
        crumbs.append({"name": part, "path": acc})
    return jsonify({"path": path, "breadcrumbs": crumbs, "dirs": dirs})
