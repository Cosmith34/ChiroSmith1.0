#!/bin/bash

set -e  # Exit on error

# Load environment variables from .env in chiropractic-portal if it exists
if [ -f "$(dirname "$0")/../../.env" ]; then
  set -a
  . "$(dirname "$0")/../../.env"
  set +a
fi

PG_DUMP="/Applications/Postgres.app/Contents/Versions/16/bin/pg_dump"
PSQL="/Applications/Postgres.app/Contents/Versions/16/bin/psql"
SCHEMA_PATH="$(dirname "$0")/../../db/schema_dump.sql"

# Dump schema from Supabase (development)
echo "🔄 Dumping schema from Supabase..."
PGPASSWORD=$SUPABASE_PASSWORD "$PG_DUMP" \
  --host=$SUPABASE_HOST \
  --port=$SUPABASE_PORT \
  --username=$SUPABASE_USER \
  --schema-only \
  --no-owner \
  --file="$SCHEMA_PATH"
 \
  $SUPABASE_DB

echo "✅ Schema dumped to schema_dump.sql"

# Restore schema to local Docker Postgres
echo "🚀 Restoring schema to local Docker Postgres..."
PGPASSWORD=$LOCAL_DB_PASSWORD "$PSQL" \
  --host=$LOCAL_DB_HOST \
  --port=$LOCAL_DB_PORT \
  --username=$LOCAL_DB_USER \
  --dbname=$LOCAL_DB_NAME \
  -f "$SCHEMA_PATH"

echo "✅ Schema synced from Supabase to local Postgres." 