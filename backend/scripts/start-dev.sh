#!/bin/bash

# Kill any process using port 3000
echo "🔍 Looking for processes on port 3000..."

# Get PIDs using port 3000
PIDS=$(netstat -ano | findstr :3000 | awk '{print $5}' | sort -u)

if [ -z "$PIDS" ]; then
  echo "✅ No processes found on port 3000"
else
  echo "🛑 Killing processes: $PIDS"
  for PID in $PIDS; do
    taskkill //F //PID $PID 2>/dev/null && echo "✅ Killed process $PID" || echo "⚠️  Could not kill process $PID"
  done
fi

echo ""
echo "🚀 Starting server..."
npm run dev
