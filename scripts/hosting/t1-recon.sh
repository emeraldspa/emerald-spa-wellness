#!/bin/bash
# Task 1: environment recon on the Emerald hosting account
U=/home/u202309731
echo "--- identity ---"; id; hostname
echo "--- php ---"; php -v 2>&1 | head -2; which php php-cli 2>&1
echo "--- tools ---"; for t in curl wget unzip tar git; do which $t >/dev/null 2>&1 && echo "$t OK" || echo "$t MISSING"; done
echo "--- wp-cli ---"; ls -la $U/wp-cli.phar 2>&1; which wp 2>&1
echo "--- outbound test ---"; curl -sIL --max-time 20 https://raw.githubusercontent.com/emeraldspa/emerald-spa-wellness/main/README.md 2>&1 | head -3
echo "--- apex docroot ---"; ls -la $U/domains/emeraldspacc.com/public_html/ 2>&1
echo "--- wp dir ---"; ls $U/domains/emeraldspacc.com/public_html/admin/ 2>&1 | head -20
echo "--- mu-plugins ---"; ls -la $U/domains/emeraldspacc.com/public_html/admin/wp-content/mu-plugins/ 2>&1
echo "--- plugins ---"; ls $U/domains/emeraldspacc.com/public_html/admin/wp-content/plugins/ 2>&1
echo "--- themes ---"; ls $U/domains/emeraldspacc.com/public_html/admin/wp-content/themes/ 2>&1
echo "--- docroot .htaccess ---"; cat $U/domains/emeraldspacc.com/public_html/.htaccess 2>&1 | head -10
echo "--- admin .htaccess ---"; cat $U/domains/emeraldspacc.com/public_html/admin/.htaccess 2>&1 | head -20
echo "--- physical robots.txt ---"; ls -la $U/domains/emeraldspacc.com/public_html/robots.txt $U/domains/emeraldspacc.com/public_html/admin/robots.txt 2>&1; cat $U/domains/emeraldspacc.com/public_html/robots.txt 2>&1 | head -5
echo "--- wp-config constants ---"; grep -E "WP_AUTO_UPDATE|AUTOSAVE|FS_METHOD|DISALLOW" $U/domains/emeraldspacc.com/public_html/admin/wp-config.php 2>&1
