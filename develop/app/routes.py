from flask import Blueprint, request, jsonify
import os
import json
import re
import sqlite3
from datetime import datetime

main = Blueprint("main", __name__)

app_path = None

# Shared project history used by both develop and serve.
# Default: ~/.pergola/projects.json (user-level, survives repo moves/reclones).
# Override with PERGOLA_PROJECTS_FILE env var (used in Docker).
PROJECTS_FILE = os.environ.get(
    "PERGOLA_PROJECTS_FILE",
    os.path.expanduser("~/.pergola/projects.json"),
)

# ── Type mapping: pergola → SQLite ────────────────────────────────────────────

SQL_TYPES = {
    "text":      "TEXT",
    "integer":   "INTEGER",
    "float":     "REAL",
    "boolean":   "INTEGER",
    "timestamp": "INTEGER",
    "json":      "TEXT",
}

VALID_TYPES = set(SQL_TYPES.keys())


def _safe_id(name):
    """Only allow identifiers that are safe to use in SQL."""
    return bool(re.match(r'^[a-z][a-z0-9_]*$', name))


# ── Project registry helpers ──────────────────────────────────────────────────

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


# ── Database registry helpers ─────────────────────────────────────────────────
#
# Schema lives entirely inside database/database.json.
# Each entry: { name, file, created_at, version, tables: { <name>: { fields: [...] } } }
# The .sqlite file is the actual database; database.json is its schema mirror.

def _db_dir():
    return os.path.join(app_path, "database")


def _registry_path():
    return os.path.join(_db_dir(), "database.json")


def _read_registry():
    try:
        with open(_registry_path()) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"databases": []}


def _write_registry(reg):
    with open(_registry_path(), "w") as f:
        json.dump(reg, f, indent=2)


def _sqlite_path(db_name):
    return os.path.join(_db_dir(), db_name + ".sqlite")


def _get_entry(db_name):
    """Return (entry, reg) or (None, reg)."""
    reg = _read_registry()
    for db in reg.get("databases", []):
        if db["name"] == db_name:
            return db, reg
    return None, reg


def _save_entry(reg, entry):
    for i, db in enumerate(reg.get("databases", [])):
        if db["name"] == entry["name"]:
            reg["databases"][i] = entry
            _write_registry(reg)
            return


def _check_sync(entry):
    """Compare schema in database.json against the actual SQLite file."""
    path = _sqlite_path(entry["name"])
    if not os.path.exists(path):
        return "missing"
    try:
        conn = sqlite3.connect(path)
        for tname, tdef in entry.get("tables", {}).items():
            cur    = conn.execute(f'PRAGMA table_info("{tname}")')
            actual = {row[1] for row in cur.fetchall()}
            schema = {f["name"] for f in tdef.get("fields", [])}
            if actual != schema:
                conn.close()
                return "out_of_sync"
        conn.close()
        return "ok"
    except Exception:
        return "error"


def _now():
    return int(datetime.utcnow().timestamp())


# ── App routes ────────────────────────────────────────────────────────────────

@main.route("/api/app-status")
def app_status():
    if not app_path:
        return jsonify({"open": False})
    meta = _read_meta(app_path)
    return jsonify({"open": True, "path": app_path, "meta": meta})


@main.route("/api/close-app", methods=["POST"])
def close_app():
    global app_path
    app_path = None
    return jsonify({"success": True})


# ── File browser ──────────────────────────────────────────────────────────────

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


# ── Project open / create ─────────────────────────────────────────────────────

@main.route("/api/set-path", methods=["POST"])
def set_path():
    global app_path
    data = request.get_json()
    path = data.get("path", "")
    if path and os.path.isdir(path):
        app_path = path
        return jsonify({"success": True, "path": app_path})
    return jsonify({"error": "Invalid path"}), 400


@main.route("/api/create-app", methods=["POST"])
def create_app_route():
    global app_path
    data        = request.get_json()
    name        = data.get("name", "").strip()
    description = data.get("description", "").strip()
    parent_path = data.get("parent_path", "").strip()

    if not name or not parent_path:
        return jsonify({"error": "name and parent_path required"}), 400
    if not os.path.isdir(parent_path):
        return jsonify({"error": "parent folder does not exist"}), 400

    folder_name = name.replace(" ", "_")
    app_dir     = os.path.join(parent_path, folder_name)

    if os.path.exists(app_dir):
        return jsonify({"error": f"'{folder_name}' already exists in that folder"}), 409

    try:
        os.makedirs(os.path.join(app_dir, "database"))
        os.makedirs(os.path.join(app_dir, "scripts"))
        os.makedirs(os.path.join(app_dir, "layouts"))

        with open(os.path.join(app_dir, "pergola.json"), "w") as f:
            json.dump({"name": name, "version": "0.1.0", "description": description}, f, indent=2)

        with open(os.path.join(app_dir, "database", "database.json"), "w") as f:
            json.dump({"databases": []}, f, indent=2)

        app_path = app_dir

        projects = _read_projects()
        projects = [p for p in projects if p["path"] != app_dir]
        projects.insert(0, {"name": name, "path": app_dir, "opened_at": datetime.utcnow().isoformat()})
        _write_projects(projects[:20])

        return jsonify({"success": True, "path": app_dir})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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


# ── Database API ──────────────────────────────────────────────────────────────

@main.route("/api/databases")
def list_databases():
    if not app_path:
        return jsonify({"error": "no app open"}), 400
    reg    = _read_registry()
    result = []
    for entry in reg.get("databases", []):
        info = {
            "name":        entry["name"],
            "file":        entry.get("file"),
            "created_at":  entry.get("created_at"),
            "table_count": len(entry.get("tables", {})),
            "status":      _check_sync(entry),
        }
        result.append(info)
    return jsonify(result)


@main.route("/api/databases", methods=["POST"])
def create_database():
    if not app_path:
        return jsonify({"error": "no app open"}), 400
    data = request.get_json()
    name = data.get("name", "").strip().lower().replace(" ", "_")

    if not name:
        return jsonify({"error": "name required"}), 400
    if not _safe_id(name):
        return jsonify({"error": "name must start with a letter and contain only letters, numbers, underscores"}), 400

    reg = _read_registry()
    if any(d["name"] == name for d in reg.get("databases", [])):
        return jsonify({"error": f"'{name}' already exists"}), 409

    # Create the SQLite file (empty — tables come later)
    conn = sqlite3.connect(_sqlite_path(name))
    conn.close()

    now   = _now()
    entry = {
        "name":       name,
        "file":       name + ".sqlite",
        "created_at": now,
        "version":    1,
        "tables":     {},
    }
    reg.setdefault("databases", []).append(entry)
    _write_registry(reg)

    return jsonify({"success": True, "name": name})


@main.route("/api/databases/<db_name>")
def get_database(db_name):
    if not app_path:
        return jsonify({"error": "no app open"}), 400
    entry, _ = _get_entry(db_name)
    if entry is None:
        return jsonify({"error": "database not found"}), 404
    return jsonify(entry)


@main.route("/api/databases/<db_name>/tables", methods=["POST"])
def create_table(db_name):
    if not app_path:
        return jsonify({"error": "no app open"}), 400
    data       = request.get_json()
    table_name = data.get("name", "").strip().lower().replace(" ", "_")

    if not table_name:
        return jsonify({"error": "name required"}), 400
    if not _safe_id(table_name):
        return jsonify({"error": "invalid table name"}), 400

    entry, reg = _get_entry(db_name)
    if entry is None:
        return jsonify({"error": "database not found"}), 404
    if table_name in entry.get("tables", {}):
        return jsonify({"error": f"table '{table_name}' already exists"}), 409

    # Create table in SQLite with system columns
    conn = sqlite3.connect(_sqlite_path(db_name))
    conn.execute(f"""
        CREATE TABLE "{table_name}" (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at INTEGER,
            updated_at INTEGER
        )
    """)
    conn.commit()
    conn.close()

    # Mirror in schema
    entry.setdefault("tables", {})[table_name] = {
        "created_at": _now(),
        "fields": [
            {"name": "id",         "type": "integer", "primary_key": True, "auto_increment": True, "system": True},
            {"name": "created_at", "type": "integer", "system": True},
            {"name": "updated_at", "type": "integer", "system": True},
        ],
    }
    _save_entry(reg, entry)
    return jsonify({"success": True, "table": table_name})


@main.route("/api/databases/<db_name>/tables/<table_name>/fields", methods=["POST"])
def add_field(db_name, table_name):
    if not app_path:
        return jsonify({"error": "no app open"}), 400
    data       = request.get_json()
    field_name = data.get("name", "").strip().lower().replace(" ", "_")
    field_type = data.get("type", "text")

    if not field_name:
        return jsonify({"error": "field name required"}), 400
    if not _safe_id(field_name):
        return jsonify({"error": "invalid field name"}), 400
    if field_type not in VALID_TYPES:
        return jsonify({"error": "invalid type"}), 400

    entry, reg = _get_entry(db_name)
    if entry is None:
        return jsonify({"error": "database not found"}), 404
    if table_name not in entry.get("tables", {}):
        return jsonify({"error": "table not found"}), 404

    table = entry["tables"][table_name]
    if any(f["name"] == field_name for f in table.get("fields", [])):
        return jsonify({"error": f"field '{field_name}' already exists"}), 409

    # Add column to SQLite
    sql_type = SQL_TYPES[field_type]
    conn = sqlite3.connect(_sqlite_path(db_name))
    conn.execute(f'ALTER TABLE "{table_name}" ADD COLUMN "{field_name}" {sql_type}')
    conn.commit()
    conn.close()

    # Mirror in schema
    table.setdefault("fields", []).append({"name": field_name, "type": field_type})
    _save_entry(reg, entry)
    return jsonify({"success": True})


@main.route("/api/databases/<db_name>/tables/<table_name>/fields/<field_name>", methods=["DELETE"])
def delete_field(db_name, table_name, field_name):
    if not app_path:
        return jsonify({"error": "no app open"}), 400

    entry, reg = _get_entry(db_name)
    if entry is None:
        return jsonify({"error": "database not found"}), 404
    if table_name not in entry.get("tables", {}):
        return jsonify({"error": "table not found"}), 404

    table  = entry["tables"][table_name]
    before = table.get("fields", [])
    target = next((f for f in before if f["name"] == field_name), None)

    if target is None:
        return jsonify({"error": "field not found"}), 404
    if target.get("system"):
        return jsonify({"error": "cannot delete system field"}), 400

    # Drop column from SQLite (requires SQLite ≥ 3.35)
    try:
        conn = sqlite3.connect(_sqlite_path(db_name))
        conn.execute(f'ALTER TABLE "{table_name}" DROP COLUMN "{field_name}"')
        conn.commit()
        conn.close()
    except sqlite3.OperationalError as e:
        return jsonify({"error": str(e)}), 500

    table["fields"] = [f for f in before if f["name"] != field_name]
    _save_entry(reg, entry)
    return jsonify({"success": True})


# ── Layout API ────────────────────────────────────────────────────────────────

def _layouts_dir():
    return os.path.join(app_path, "layouts")


@main.route("/api/layouts")
def list_layouts():
    if not app_path:
        return jsonify([])
    d = _layouts_dir()
    if not os.path.isdir(d):
        return jsonify([])
    result = []
    for f in sorted(os.listdir(d)):
        if f.endswith(".json"):
            result.append({"name": f[:-5], "file": f})
    return jsonify(result)


@main.route("/api/layouts", methods=["POST"])
def create_layout():
    if not app_path:
        return jsonify({"error": "no app open"}), 400
    data = request.get_json()
    name = data.get("name", "").strip()
    if not name:
        return jsonify({"error": "name required"}), 400

    filename = re.sub(r"[^a-z0-9_]", "_", name.lower()) + ".json"
    d = _layouts_dir()
    os.makedirs(d, exist_ok=True)
    filepath = os.path.join(d, filename)

    if os.path.exists(filepath):
        return jsonify({"error": "layout already exists"}), 409

    layout = {
        "name": name,
        "version": "0.1.0",
        "root": {
            "id": "root",
            "type": "Stack",
            "props": {"direction": "col", "gap": 16, "padding": 24, "minHeight": "100vh", "bg": "var(--bg)"},
            "children": [],
        },
    }
    with open(filepath, "w") as f:
        json.dump(layout, f, indent=2)

    return jsonify({"success": True, "name": name, "file": filename})


@main.route("/api/layouts/<name>")
def get_layout(name):
    if not app_path:
        return jsonify({"error": "no app open"}), 400
    filepath = os.path.join(_layouts_dir(), name + ".json")
    try:
        with open(filepath) as f:
            return jsonify(json.load(f))
    except FileNotFoundError:
        return jsonify({"error": "not found"}), 404


@main.route("/api/layouts/<name>", methods=["PUT"])
def save_layout(name):
    if not app_path:
        return jsonify({"error": "no app open"}), 400
    data = request.get_json()
    filepath = os.path.join(_layouts_dir(), name + ".json")
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
    return jsonify({"success": True})
