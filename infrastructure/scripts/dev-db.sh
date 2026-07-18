#!/usr/bin/env bash
# Start only the local PostgreSQL container for development.
# Usage: ./infrastructure/scripts/dev-db.sh
set -euo pipefail

cd "$(dirname "$0")/../.."
docker compose -f docker-compose.dev.yml up -d postgres
echo "PostgreSQL is starting on localhost:5432 (db: careernext)."
