from flask import Flask, send_from_directory
import os

def create_app():
    static_dir = os.path.join(os.path.dirname(__file__), 'static')

    # static_folder=None disables Flask's built-in /static route so our
    # catch-all can serve the Vite build without conflicts.
    app = Flask(__name__, static_folder=None)
    app.config.from_object('app.config.Config')

    from .routes import main
    app.register_blueprint(main)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_spa(path: str):
        # Serve any real file that exists in the build output
        if path:
            full = os.path.join(static_dir, path)
            if os.path.exists(full) and os.path.isfile(full):
                return send_from_directory(static_dir, path)
        # Fall back to index.html for SPA routing
        index = os.path.join(static_dir, 'index.html')
        if os.path.exists(index):
            return send_from_directory(static_dir, 'index.html')
        return 'Run `pnpm dev` in develop/frontend/ to start the dev server.', 200

    return app
