#!/bin/bash
U=/home/u202309731
WP=$U/domains/emeraldspacc.com/public_html/admin
C="php $U/wp-cli.phar --path=$WP"
echo "--- cache dirs ---"
ls -d $U/.lscache* $U/domains/emeraldspacc.com/public_html/admin/wp-content/cache/* 2>/dev/null
rm -rf $U/.lscache_priv/* $U/.lscache/* $WP/wp-content/cache/* 2>/dev/null
echo "--- object cache + lscache purge attempt ---"
$C cache flush 2>&1 | tail -1
$C litespeed-purge all 2>&1 | tail -1
echo "--- show_as_popup meta on promo 51 ---"
$C post meta get 51 show_as_popup 2>&1
echo "--- done $(date -u +%FT%TZ) ---"
