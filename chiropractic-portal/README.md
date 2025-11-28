# Chiropractic Portal

Modern chiropractic practice portal built with React + Vite (frontend) and Node/Express + Postgres (backend), containerized with Docker Compose.

## Current Features
- Background layout shared by all app pages
  - Top bar greeting
  - Left navigation (Dashboard, Patients, Appointments, Billing)
  - Right context panel
- Dashboard
  - Five-day calendar grid (days across, time down)
  - 5:00 AM–10:00 PM in 15-minute increments
  - Alternating row background for readability
  - Light-grey grid lines, solid verticals and horizontals
  - Start-date button (calendar icon) to change the visible range
  - Clicking any time/day updates the right panel title with the selected day and time
- Auth pages
  - Login and Signup UI screens (API wiring to be added)

## Tech Stack
- Frontend: React 19 + Vite 6, UnoCSS/Tailwind utilities
- Backend: Node 18, Express, Knex
- Database: Postgres 16 (via Docker), pgAdmin
- Containerization: Docker Compose

## Local Development

Prereqs: Docker Desktop running.

1) From the project root of this app:
```
cd chiropractic-portal
```

2) Create `.env` with Postgres settings (used by compose):
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=chiro_local
```

3) Start services:
```
docker compose up -d --build
```

Services and ports:
- Frontend (Vite dev): http://localhost:5173
- Backend (Express): http://localhost:3131
- Postgres: localhost:5432 (mapped to container)
- pgAdmin web: http://localhost:8080
  - Login: configured in `docker-compose.yml` (`PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD`)
  - Add a server with:
    - Host: `chiro-db` (container name, not `localhost`)
    - Port: `5432`
    - Username: `POSTGRES_USER`
    - Password: `POSTGRES_PASSWORD`

Logs:
```
docker compose logs -f
```

Stop and remove data (dev only):
```
docker compose down -v
```

## Project Structure (selected)
```
chiropractic-portal/
  docker-compose.yml
  backend/
    index.js
    knexfile.js
    Dockerfile
  src/
    pages/
      Login.jsx
      Signup.jsx
      Background.jsx
      Dashboard.jsx
    main.jsx
```

## Next Steps
- Hook Login/Signup to backend APIs
- Build modular right-panel system (pluggable components via context/provider)
- Calendar: events rendering, drag/drop, create/edit flow
