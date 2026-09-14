#!/bin/bash
# Round 31 R2: deploy popup-free theme + branded maintenance gate, flip gates.
exec 2>&1
U=/home/u202309731
W=$U/domains/emeraldspacc.com/public_html/admin
WP="php $U/wp-cli.phar --path=$W"
TS=$(date +%s)
BASE="https://raw.githubusercontent.com/emeraldspa/emerald-spa-wellness/main"

echo "--- fetch artifacts ---"
curl -sSL "$BASE/wordpress/mu-plugins/z-emerald-maintenance.php?v=$TS" -o /tmp/z-emerald-maintenance.php
curl -sSL "$BASE/wordpress/dist/emerald.zip?v=$TS" -o /tmp/emerald.zip
ls -la /tmp/z-emerald-maintenance.php /tmp/emerald.zip
head -c 100 /tmp/z-emerald-maintenance.php; echo

echo "--- validate before install ---"
php -l /tmp/z-emerald-maintenance.php || exit 1
unzip -t /tmp/emerald.zip >/dev/null && echo "zip OK" || exit 1
unzip -l /tmp/emerald.zip | grep -c popup | grep -q '^0$' && echo "no popup files in zip" || { echo "POPUP FILES IN ZIP, ABORT"; unzip -l /tmp/emerald.zip | grep popup; exit 1; }

echo "--- install theme (overwrites existing emerald) ---"
$WP theme install /tmp/emerald.zip --force --activate || exit 1
$WP theme list --format=csv

echo "--- deploy maintenance mu-plugin ---"
cp /tmp/z-emerald-maintenance.php $W/wp-content/mu-plugins/z-emerald-maintenance.php
php -l $W/wp-content/mu-plugins/z-emerald-maintenance.php || exit 1
ls -la $W/wp-content/mu-plugins/

echo "--- flip gates: ours ON ---"
$WP option update emerald_maintenance_mode 1
echo "emerald_maintenance_mode=[$($WP option get emerald_maintenance_mode)]"

echo "--- flush caches ---"
$WP cache flush
$WP rewrite flush --hard 2>/dev/null || true
echo "R2 DONE"
