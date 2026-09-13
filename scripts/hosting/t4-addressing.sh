#!/bin/bash
# Task 4: addressing cutover - siteurl/home -> emeraldspacc.com, search-replace, flushes
U=/home/u202309731
WP=$U/domains/emeraldspacc.com/public_html/admin
C="php $U/wp-cli.phar --path=$WP"

echo "=== search-replace DRY RUN ==="
$C search-replace 'https://admin.emeraldspacc.com' 'https://emeraldspacc.com/admin' --all-tables --dry-run --report 2>&1 | tail -8

echo "=== search-replace REAL ==="
$C search-replace 'https://admin.emeraldspacc.com' 'https://emeraldspacc.com/admin' --all-tables 2>&1 | tail -4

echo "=== home -> apex (site address) ==="
$C option update home 'https://emeraldspacc.com' 2>&1 | tail -1

echo "=== verify ==="
echo -n "siteurl: "; $C option get siteurl
echo -n "home:    "; $C option get home

echo "=== flush ==="
$C cache flush 2>&1 | tail -1
$C rewrite flush --hard 2>&1 | tail -2
$C litespeed-purge all 2>&1 | tail -1

echo "=== content counts after ==="
for t in page promotion treatment staff testimonial; do echo -n "$t: "; $C post list --post_type=$t --post_status=any --format=count 2>/dev/null; done

echo "=== host checks from inside ==="
echo "-- admin.* must now 301 to apex:"; curl -sk -o /dev/null -w "%{http_code} -> %{redirect_url}\n" -H "Host: admin.emeraldspacc.com" https://127.0.0.1/ --resolve admin.emeraldspacc.com:443:127.0.0.1
echo "-- apex home:"; curl -sk -o /dev/null -w "%{http_code}\n" https://emeraldspacc.com/ --resolve emeraldspacc.com:443:127.0.0.1
echo "-- apex /services/:"; curl -sk -o /dev/null -w "%{http_code}\n" https://emeraldspacc.com/services/ --resolve emeraldspacc.com:443:127.0.0.1
echo "-- apex REST:"; curl -sk https://emeraldspacc.com/wp-json/ --resolve emeraldspacc.com:443:127.0.0.1 2>/dev/null | head -c 200; echo
