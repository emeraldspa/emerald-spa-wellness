#!/bin/bash
# Emerald hosting runner - fetched by a one-minute cron job, runs the current task.
exec 2>&1
cd /home/u202309731
mkdir -p cron-out
echo "=== cron.sh $(date -u +%FT%TZ) ==="
bash /home/u202309731/cron-task.sh | tee /home/u202309731/cron-out/last.txt
echo "=== exit: $? ==="
