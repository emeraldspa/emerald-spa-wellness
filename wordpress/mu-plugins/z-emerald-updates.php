<?php
/**
 * Plugin Name: Emerald Native Updates
 * Description: Restores native WordPress auto-updates (core major+minor, plugins, themes, translations) on the Emerald install. Hostinger's Smart Auto Updates mu-plugin disables them at load time; because mu-plugins load alphabetically, this file loads after it and re-enables what the client ordered. Hostinger's WordPress.org download proxy filters are kept untouched.
 * Version:     1.0.0
 * Author:      Emerald Webmaster
 * License:     GPL-2.0-or-later
 * Text Domain: emerald-updates
 */

defined( 'ABSPATH' ) || exit;

// Undo the disable filters registered by hostinger-auto-updates.php (loads earlier alphabetically).
remove_filter( 'automatic_updater_disabled', '__return_true' );
remove_filter( 'auto_update_theme', '__return_false' );
remove_filter( 'auto_update_plugin', '__return_false' );

// Native WordPress update policy: everything updates automatically from wordpress.org.
add_filter( 'auto_update_plugin', '__return_true', 9999 );
add_filter( 'auto_update_theme', '__return_true', 9999 );
add_filter( 'auto_update_translation', '__return_true', 9999 );
