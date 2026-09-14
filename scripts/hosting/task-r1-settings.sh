#!/bin/bash
# Round 31 R1: static front page, popup flag cleanup, recon for R2 (no file changes).
exec 2>&1
U=/home/u202309731
D=$U/cron-out/r1.done
[ -f "$D" ] && { echo "r1 already done, skip"; exit 0; }
mkdir -p "$U/cron-out"
W=$U/domains/emeraldspacc.com/public_html/admin
WP="php $U/wp-cli.phar --path=$W"

echo "--- ASE options dump (find maintenance key) ---"
$WP option get admin_site_enhancements --format=json | head -c 4000
echo
echo "--- active plugins ---"
$WP plugin list --status=active --format=csv
echo "--- current gate options ---"
echo "emerald_maintenance_mode=[$($WP option get emerald_maintenance_mode 2>&1)]"
echo "--- media candidates for header logo ---"
$WP media list --fields=ID,post_title,post_name --format=csv | head -40
echo "--- static front page ---"
HP=$($WP post list --post_type=page --post_name=home --post_status=publish --field=ID 2>/dev/null)
echo "existing Home page id: [$HP]"
if [ -z "$HP" ]; then
        HP=$($WP post create --post_type=page --post_title=Home --post_name=home --post_status=publish --porcelain)
        echo "created Home page id=$HP"
fi
$WP option update show_on_front page
$WP option update page_on_front "$HP"
echo "front page: show_on_front=[$($WP option get show_on_front)] page_on_front=[$($WP option get page_on_front)]"
echo "--- promotions and popup flag ---"
$WP post list --post_type=promotion --post_status=publish --fields=ID,post_title,post_name --format=csv
for PID in $($WP post list --post_type=promotion --post_status=publish --field=ID); do
        echo "promo $PID show_as_popup=[$($WP post meta get $PID show_as_popup 2>&1)]"
        $WP post meta delete $PID show_as_popup 2>&1
done
echo "--- theme status before update ---"
$WP theme list --format=csv
touch "$D"
echo "R1 DONE"
