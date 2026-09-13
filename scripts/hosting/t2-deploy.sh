#!/bin/bash
# Task 2: mu-plugin deploy, backoffice folder rename, native auto-updates, search engines on
U=/home/u202309731
WP=$U/domains/emeraldspacc.com/public_html/admin
C="php $U/wp-cli.phar --path=$WP"

echo "=== wp-cli ensure ==="
if [ ! -f $U/wp-cli.phar ]; then
  curl -sL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o $U/wp-cli.phar
fi
$C --info 2>&1 | head -4 || { echo "WPCLI FAIL"; exit 1; }

echo "=== mu-plugin: emerald-admin-suite ==="
mkdir -p $WP/wp-content/mu-plugins
curl -sL https://raw.githubusercontent.com/emeraldspa/emerald-spa-wellness/main/wordpress/mu-plugins/emerald-admin-suite.php -o $WP/wp-content/mu-plugins/emerald-admin-suite.php
ls -la $WP/wp-content/mu-plugins/
php -l $WP/wp-content/mu-plugins/emerald-admin-suite.php

echo "=== backoffice folder rename (-1 -> clean) ==="
$C plugin deactivate emerald-backoffice-1/emerald-backoffice 2>&1 | tail -1
mv $WP/wp-content/plugins/emerald-backoffice-1 $WP/wp-content/plugins/emerald-backoffice 2>&1
$C plugin activate emerald-backoffice/emerald-backoffice 2>&1 | tail -1

echo "=== native auto-updates: core all ==="
sed -i "s/define( 'WP_AUTO_UPDATE_CORE', 'minor' );/define( 'WP_AUTO_UPDATE_CORE', true );/" $WP/wp-config.php
grep WP_AUTO_UPDATE_CORE $WP/wp-config.php

echo "=== auto-update options (plugins + themes, native site options) ==="
$C option update blog_public 1 2>&1 | tail -1
$C option update auto_update_plugins '["admin-site-enhancements/admin-site-enhancements","advanced-custom-fields/acf.php","custom-post-type-ui/custom-post-type-ui.php","emerald-backoffice/emerald-backoffice.php","emerald-core/emerald-core.php","emerald-hardening/emerald-hardening.php","emerald-headless-graphql/emerald-headless-graphql.php","enable-abilities-for-mcp/enable-abilities-for-mcp.php","litespeed-cache/litespeed-cache.php","mcp-adapter/mcp-adapter.php","wp-graphql/wp-graphql.php","wpgraphql-acf/wpgraphql-acf.php"]' --format=json 2>&1 | tail -1
$C option update auto_update_themes '["emerald"]' --format=json 2>&1 | tail -1

echo "=== verify options ==="
$C option get blog_public
$C option get auto_update_plugins --format=json | head -c 300; echo
$C option get auto_update_themes --format=json

echo "=== hostinger mu-plugin peek ==="
head -30 $WP/wp-content/mu-plugins/hostinger-auto-updates.php

echo "=== plugin list after ==="
$C plugin list 2>&1

echo "=== liteSpeed purge ==="
$C litespeed-purge all 2>&1 | tail -1

echo "=== mu-plugins final ==="
ls -la $WP/wp-content/mu-plugins/
