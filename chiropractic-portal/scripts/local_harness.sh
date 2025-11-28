#!/usr/bin/env bash

# Local development harness for starting/stopping/restarting individual services:
# - db (Postgres in Docker)
# - pgadmin (pgAdmin in Docker)
# - backend (Express/Knex)
# - frontend (Vite/React)
#
# Usage examples:
#   bash scripts/local_harness.sh start all
#   bash scripts/local_harness.sh start db
#   bash scripts/local_harness.sh restart backend
#   bash scripts/local_harness.sh status all
#   bash scripts/local_harness.sh stop frontend
#
# Notes:
# - Uses "docker compose" if available, falls back to "docker-compose"
# - Runs backend and frontend in the background, with PID files and logs under ./.dev

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR"
RUNTIME_DIR="$ROOT_DIR/.dev"
LOG_DIR="$RUNTIME_DIR/logs"
PID_DIR="$RUNTIME_DIR/pids"

mkdir -p "$LOG_DIR" "$PID_DIR"

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
	DOCKER_COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
	DOCKER_COMPOSE="docker-compose"
else
	echo "❌ docker compose/docker-compose not found. Please install Docker Desktop."
	exit 1
fi

log() {
	echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

is_pid_running() {
	local pid="$1"
	[[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1
}

read_pid() {
	local name="$1"
	local pid_file="$PID_DIR/$name.pid"
	if [[ -f "$pid_file" ]]; then
		cat "$pid_file"
	fi
}

write_pid() {
	local name="$1"
	local pid="$2"
	echo "$pid" > "$PID_DIR/$name.pid"
}

remove_pid() {
	local name="$1"
	rm -f "$PID_DIR/$name.pid"
}

ensure_node_modules() {
	local dir="$1"
	if [[ ! -d "$dir/node_modules" ]]; then
		log "Installing npm dependencies in $dir..."
		( cd "$dir" && npm install --silent )
	fi
}

# ------------- DB (Postgres) -------------
start_db() {
	log "Starting Postgres (db) via docker compose..."
	( cd "$ROOT_DIR" && $DOCKER_COMPOSE up -d chiro-db )
}

stop_db() {
	log "Stopping Postgres (db)..."
	( cd "$ROOT_DIR" && $DOCKER_COMPOSE stop chiro-db )
}

restart_db() {
	log "Restarting Postgres (db)..."
	( cd "$ROOT_DIR" && $DOCKER_COMPOSE restart chiro-db )
}

status_db() {
	( cd "$ROOT_DIR" && $DOCKER_COMPOSE ps chiro-db )
}

# ------------- pgAdmin -------------
start_pgadmin() {
	log "Starting pgAdmin via docker compose..."
	( cd "$ROOT_DIR" && $DOCKER_COMPOSE up -d pgadmin )
}

stop_pgadmin() {
	log "Stopping pgAdmin..."
	( cd "$ROOT_DIR" && $DOCKER_COMPOSE stop pgadmin )
}

restart_pgadmin() {
	log "Restarting pgAdmin..."
	( cd "$ROOT_DIR" && $DOCKER_COMPOSE restart pgadmin )
}

status_pgadmin() {
	( cd "$ROOT_DIR" && $DOCKER_COMPOSE ps pgadmin )
}

# ------------- Backend -------------
start_backend() {
	local name="backend"
	local log_file="$LOG_DIR/$name.log"
	local existing_pid
	existing_pid="$(read_pid "$name")"
	if is_pid_running "$existing_pid"; then
		log "Backend already running (pid $existing_pid)."
		return 0
	fi

	ensure_node_modules "$BACKEND_DIR"
	log "Starting backend (logs: $log_file)..."
	( cd "$BACKEND_DIR" && nohup npm run dev > "$log_file" 2>&1 & echo $! ) | {
		read pid
		write_pid "$name" "$pid"
		log "Backend started (pid $pid) on http://localhost:${PORT:-3131}"
	}
}

stop_backend() {
	local name="backend"
	local pid
	pid="$(read_pid "$name")"
	if is_pid_running "$pid"; then
		log "Stopping backend (pid $pid)..."
		kill "$pid" || true
		sleep 1
		if is_pid_running "$pid"; then
			log "Forcing backend stop (pid $pid)..."
			kill -9 "$pid" || true
		fi
		remove_pid "$name"
	else
		log "Backend not running."
		remove_pid "$name" || true
	fi
}

restart_backend() {
	stop_backend
	start_backend
}

status_backend() {
	local name="backend"
	local pid
	pid="$(read_pid "$name")"
	if is_pid_running "$pid"; then
		echo "backend: RUNNING (pid $pid) on http://localhost:${PORT:-3131}"
	else
		echo "backend: STOPPED"
	fi
}

# ------------- Frontend -------------
start_frontend() {
	local name="frontend"
	local log_file="$LOG_DIR/$name.log"
	local existing_pid
	existing_pid="$(read_pid "$name")"
	if is_pid_running "$existing_pid"; then
		log "Frontend already running (pid $existing_pid)."
		return 0
	fi

	ensure_node_modules "$FRONTEND_DIR"
	log "Starting frontend (logs: $log_file)..."
	( cd "$FRONTEND_DIR" && nohup npm run dev > "$log_file" 2>&1 & echo $! ) | {
		read pid
		write_pid "$name" "$pid"
		log "Frontend started (pid $pid) on http://localhost:5173"
	}
}

stop_frontend() {
	local name="frontend"
	local pid
	pid="$(read_pid "$name")"
	if is_pid_running "$pid"; then
		log "Stopping frontend (pid $pid)..."
		kill "$pid" || true
		sleep 1
		if is_pid_running "$pid"; then
			log "Forcing frontend stop (pid $pid)..."
			kill -9 "$pid" || true
		fi
		remove_pid "$name"
	else
		log "Frontend not running."
		remove_pid "$name" || true
	fi
}

restart_frontend() {
	stop_frontend
	start_frontend
}

status_frontend() {
	local name="frontend"
	local pid
	pid="$(read_pid "$name")"
	if is_pid_running "$pid"; then
		echo "frontend: RUNNING (pid $pid) on http://localhost:5173"
	else
		echo "frontend: STOPPED"
	fi
}

# ------------- Orchestration -------------
start_all() {
	start_db
	start_pgadmin
	start_backend
	start_frontend
	print_urls
}

stop_all() {
	stop_frontend
	stop_backend
	stop_pgadmin
	stop_db
}

restart_all() {
	restart_db
	restart_pgadmin
	restart_backend
	restart_frontend
	print_urls
}

status_all() {
	status_db
	status_pgadmin
	status_backend
	status_frontend
}

print_usage() {
	cat <<EOF
Usage:
  bash scripts/local_harness.sh <start|stop|restart|status> <all|db|pgadmin|backend|frontend>

Examples:
  bash scripts/local_harness.sh start all
  bash scripts/local_harness.sh start db
  bash scripts/local_harness.sh restart backend
  bash scripts/local_harness.sh status all
EOF
}

print_urls() {
	echo ""
	echo "URLs:"
	echo "- Frontend: http://localhost:5173"
	echo "- Backend:  http://localhost:${PORT:-3131}"
	echo "- pgAdmin:  http://localhost:8080"
	echo ""
}

ACTION="${1:-}"
TARGET="${2:-}"

if [[ -z "$ACTION" || -z "$TARGET" ]]; then
	print_usage
	exit 1
fi

case "$ACTION" in
	start|stop|restart|status) ;;
	*) print_usage; exit 1 ;;
esac

case "$TARGET" in
	all|db|pgadmin|backend|frontend) ;;
	*) print_usage; exit 1 ;;
esac

case "$ACTION:$TARGET" in
	start:all) start_all ;;
	start:db) start_db ;;
	start:pgadmin) start_pgadmin ;;
	start:backend) start_backend ;;
	start:frontend) start_frontend ;;

	stop:all) stop_all ;;
	stop:db) stop_db ;;
	stop:pgadmin) stop_pgadmin ;;
	stop:backend) stop_backend ;;
	stop:frontend) stop_frontend ;;

	restart:all) restart_all ;;
	restart:db) restart_db ;;
	restart:pgadmin) restart_pgadmin ;;
	restart:backend) restart_backend ;;
	restart:frontend) restart_frontend ;;

	status:all) status_all ;;
	status:db) status_db ;;
	status:pgadmin) status_pgadmin ;;
	status:backend) status_backend ;;
	status:frontend) status_frontend ;;
esac


