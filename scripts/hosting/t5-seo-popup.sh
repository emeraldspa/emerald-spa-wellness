#!/bin/bash
# Task 5: deploy SEO core v1.1.0, popup in footer part, plugin share images
U=/home/u202309731
WP=$U/domains/emeraldspacc.com/public_html/admin
C="php $U/wp-cli.phar --path=$WP"
R=https://raw.githubusercontent.com/emeraldspa/emerald-spa-wellness/main

echo "=== core plugin v1.1.0 ==="
curl -sL $R/wordpress/plugins/emerald-core.php -o $WP/wp-content/plugins/emerald-core/emerald-core.php
php -l $WP/wp-content/plugins/emerald-core/emerald-core.php

echo "=== core plugin share images ==="
mkdir -p $WP/wp-content/plugins/emerald-core/assets/img
curl -sL $R/public/og-image.jpg -o $WP/wp-content/plugins/emerald-core/assets/img/og-image.jpg
curl -sL $R/public/brand/lockup-stacked-light.png -o $WP/wp-content/plugins/emerald-core/assets/img/lockup-stacked-light.png
ls -la $WP/wp-content/plugins/emerald-core/assets/img/

echo "=== theme footer part with popup ==="
curl -sL $R/wordpress/theme/emerald/parts/footer.html -o $WP/wp-content/themes/emerald/parts/footer.html
head -2 $WP/wp-content/themes/emerald/parts/footer.html

echo "=== plugin file verify (head) ==="
grep -m2 "Version:\|Description:" $WP/wp-content/plugins/emerald-core/emerald-core.php

echo "=== popup promotion check ==="
$C db query "SELECT post_id, meta_value FROM wp_postmeta WHERE meta_key='show_as_popup' AND meta_value='1' LIMIT 5" --skip-column-names 2>/dev/null | head -5

echo "=== flush + purge ==="
$C cache flush 2>&1 | tail -1
$C litespeed-purge all 2>&1 | tail -1
