#!/bin/bash
# Emerald hosting runner - fetched by a one-minute cron job, runs the current task.
# Output is teed so it can be read via the Hostinger files API.
exec 2>&1
cd /home/u202309731
mkdir -p cron-out
echo "=== cron.sh $(date -u +%FT%TZ) task: $1 ==="
bash /home/u202309731/cron-task.sh
echo "=== exit: $? ==="
