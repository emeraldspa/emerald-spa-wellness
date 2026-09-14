#!/bin/bash
# Task 31 recon - live install state (secret-free; runs via cron curl|bash)
exec 2>&1
U=/home/u202309731
W=$U/domains/emeraldspacc.com/public_html/admin
C="php $U/wp-cli.phar --path=$W"
echo "== mu-plugins =="
ls -la $W/wp-content/mu-plugins/ 2>/dev/null
echo "== 503 sources =="
grep -rln "503" $W/wp-content/mu-plugins/ $W/wp-content/themes/emerald/functions.php 2>/dev/null
echo "== active plugins =="
$C plugin list --fields=name,status,version 2>&1
echo "== popup flag promo 51 =="
$C post meta get 51 show_as_popup 2>&1
echo "== promotions list =="
$C post list --post_type=promotion --fields=ID,post_title,post_status 2>&1
echo "== pdf files in uploads =="
find $W/wp-content/uploads -name "*.pdf" 2>/dev/null
echo "(end pdf find)"
echo "== popup refs in live theme =="
grep -rln "popup" $W/wp-content/themes/emerald/inc/ $W/wp-content/themes/emerald/patterns/ $W/wp-content/themes/emerald/templates/ $W/wp-content/themes/emerald/assets/js/ 2>/dev/null
echo "(end popup refs)"
echo "== front-page + footer popup lines =="
grep -n "popup" $W/wp-content/themes/emerald/templates/front-page.html $W/wp-content/themes/emerald/patterns/footer.php $W/wp-content/themes/emerald/patterns/home-sections.php 2>/dev/null | head -8
echo "(end popup lines)"
echo "== auto update plugins =="
$C option get auto_update_plugins 2>&1 | tr '\n' ' ' | head -c 300
echo
echo "== auto update themes =="
$C option get auto_update_themes 2>&1 | tr '\n' ' '
echo
echo "== core const =="
$C eval 'echo (defined("WP_AUTO_UPDATE_CORE") && WP_AUTO_UPDATE_CORE) ? "core-true" : "core-not-const";' 2>&1
echo "== journal in htaccess =="
grep -n "journal" $U/domains/emeraldspacc.com/public_html/.htaccess $W/.htaccess 2>/dev/null
echo "(end htaccess)"
echo "== siteurl/home =="
$C option get siteurl
$C option get home
echo "== crontab =="
crontab -l 2>/dev/null | grep -v "^#" | head -5
echo "(end crontab)"
echo "== RECON DONE =="
