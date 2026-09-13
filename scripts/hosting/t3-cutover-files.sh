#!/bin/bash
# Task 3: native-updates mu-plugin + docroot cutover files + permalink state
U=/home/u202309731
ROOT=$U/domains/emeraldspacc.com/public_html
WP=$ROOT/admin
C="php $U/wp-cli.phar --path=$WP"

echo "=== mu-plugin: z-emerald-updates ==="
curl -sL https://raw.githubusercontent.com/emeraldspa/emerald-spa-wellness/main/wordpress/mu-plugins/z-emerald-updates.php -o $WP/wp-content/mu-plugins/z-emerald-updates.php
php -l $WP/wp-content/mu-plugins/z-emerald-updates.php
ls -la $WP/wp-content/mu-plugins/

echo "=== docroot cutover: index.php ==="
cat > $ROOT/index.php <<'PHP'
<?php
// Emerald cutover: WordPress lives in /admin, visitors see emeraldspacc.com.
define( 'WP_USE_THEMES', true );
require __DIR__ . '/admin/wp-blog-header.php';
PHP
php -l $ROOT/index.php

echo "=== docroot cutover: .htaccess ==="
cat > $ROOT/.htaccess <<'HTA'
# Emerald cutover: WordPress lives in /admin, served at the domain root.
DirectoryIndex index.php index.html

# BEGIN Emerald
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# Permalinks: hand non-file requests to the WordPress front controller.
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_URI} !^/admin/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END Emerald
HTA
cat $ROOT/.htaccess

echo "=== admin .htaccess: prepend legacy-host 301 ==="
cp $WP/.htaccess $WP/.htaccess.emerald-backup
cat > $WP/.htaccess.emerald-new <<'HTA'
# BEGIN Emerald legacy host
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{HTTP_HOST} ^admin\.emeraldspacc\.com$ [NC]
RewriteCond %{REQUEST_URI} !^/cron-out/
RewriteRule ^(.*)$ https://emeraldspacc.com/$1 [R=301,L]
</IfModule>
# END Emerald legacy host

HTA
cat $WP/.htaccess >> $WP/.htaccess.emerald-new
mv $WP/.htaccess.emerald-new $WP/.htaccess
head -14 $WP/.htaccess

echo "=== wp-config: any WP_HOME/WP_SITEURL constants? ==="
grep -nE "WP_HOME|WP_SITEURL" $WP/wp-config.php || echo "none (options rule)"

echo "=== permalink state ==="
$C option get permalink_structure
$C option get siteurl; $C option get home

echo "=== emulation check: docroot index renders? ==="
php -r "putenv('SERVER_SOFTWARE=LiteSpeed'); " 2>/dev/null
curl -sk --resolve emeraldspacc.com:443:127.0.0.1 https://emeraldspacc.com/ -o /dev/null -w "local https: %{http_code}\n" 2>&1 | head -1
