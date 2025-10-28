#!/bin/sh
set -e

echo "Running database migrations..."
cd /app/packages/prisma
./node_modules/.bin/prisma migrate deploy

if [ "${RUN_SEED:-true}" = "true" ]; then
  echo "Running database seed..."
  node dist/scripts/seed.js
else
  echo "Skipping database seed (RUN_SEED=false)"
fi

echo "Starting application..."
cd /app/apps/backend
exec node dist/main.js