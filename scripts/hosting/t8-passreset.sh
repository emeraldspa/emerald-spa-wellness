#!/bin/bash
# Task 8: restore the superadmin password to the client's documented credential.
# The password itself is staged at ~/.wp-pass-new by a one-time cron command and
# shredded immediately after use - it never appears in this repository.
U=/home/u202309731
WP=$U/domains/emeraldspacc.com/public_html/admin
C="php $U/wp-cli.phar --path=$WP"
if [ ! -f $U/.wp-pass-new ]; then echo "NO STAGED PASSWORD"; exit 1; fi
$C user update 1 --user_pass="$(cat $U/.wp-pass-new)" 2>&1 | tail -1
$C user get 1 --fields=ID,user_login,user_email,roles 2>&1
shred -u $U/.wp-pass-new
echo "password restored to client records; staged file shredded"
