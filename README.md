# pergola
Pergola is an app builder. It consists of three parts:

## pergola-develop
Pergola develop lets you create pergola-apps. From within the browser you can create full frontend + backend + database apps using sqlite and bundling it all in a single folder. Once you finish developing your pergola-app, you can deploy it via pergola-serve.

## pergola-serve
Pergola serve lets you run a pergola-app. It detects an app, and loads it, hosting it either locally, privately or publicly.

## pergola-app
A pergola app is just a folder that contains all the components of a pegola app in a structure that can be understood by a pergola engine (develop or serve). This includes the pergola.json file at the root folder of the app project, it also includes several folders




How it works:
  - develop/Dockerfile has two stages: Node 22 builds the Vite assets (pnpm build), then Python 3.12 picks up those built
  files and runs Flask
  - Nginx sits on port 8080 and proxies everything to Flask — /api/ routes to the API, everything else serves the React app
  - ${HOME} is bind-mounted into the container at the same path, so the file picker browses your actual filesystem and created
  apps land in real directories
  - projects.json lives in a named Docker volume (pergola-data) so your recent projects persist across docker compose down/up

  To use:
  # First time (or after code changes)
  docker compose build
  
  # Start
  docker compose up -d

  # Access at http://localhost:8080

  # Change the port
  PERGOLA_PORT=3000 docker compose up -d

  # Stop
  docker compose down