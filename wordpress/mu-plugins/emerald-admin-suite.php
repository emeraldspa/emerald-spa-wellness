<?php
/**
 * Plugin Name: Emerald Admin Suite
 * Plugin URI:  https://emeraldspacc.com
 * Description: Custom dashboard, bot discouragement, login hardening and content-editor scoping for emeraldspacc.com. Free custom code only - no paid plugins.
 * Version:     1.0.0
 * Author:      Emerald Webmaster
 * License:     GPL-2.0-or-later
 */

defined( 'ABSPATH' ) || exit;

/* ---------------------------------------------------------
 * 0. GUARDRAILS
 * ------------------------------------------------------ */

// Block the plugin/theme file editor in wp-admin (code changes belong to the repo / webmaster only).
if ( ! defined( 'DISALLOW_FILE_EDIT' ) ) {
        define( 'DISALLOW_FILE_EDIT', true );
}

// Hide the WordPress version number from the public site.
add_filter( 'the_generator', '__return_empty_string' );

/* ---------------------------------------------------------
 * 1. CUSTOM DASHBOARD - calm, branded, client-friendly
 * ------------------------------------------------------ */

// Remove every default dashboard widget (clean slate for everyone).
add_action( 'wp_dashboard_setup', function () {
        remove_action( 'welcome_panel', 'wp_welcome_panel' );
        $defaults = array(
                'dashboard_site_health', 'dashboard_right_now', 'dashboard_activity',
                'dashboard_quick_press', 'dashboard_primary', 'dashboard_incoming_links',
                'dashboard_plugins',
        );
        foreach ( $defaults as $id ) {
                foreach ( array( 'normal', 'side', 'column3', 'column4' ) as $ctx ) {
                        remove_meta_box( $id, 'dashboard', $ctx );
                }
        }
}, 999 );

// One friendly Emerald widget with the only links the client needs.
add_action( 'wp_dashboard_setup', function () {
        wp_add_dashboard_widget(
                'emerald_welcome',
                'Emerald Spa & Wellness Centre',
                function () {
                        ?>
                        <p style="font-size:14px;margin-top:0"><strong>Welcome to your control room.</strong></p>
                        <p>Update your website in three places - each one saves straight to the live site:</p>
                        <p>
                                <a class="button button-primary" href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>">Edit Pages</a>
                                <a class="button" href="<?php echo esc_url( admin_url( 'edit.php' ) ); ?>">Journal Posts</a>
                                <a class="button" href="<?php echo esc_url( admin_url( 'upload.php' ) ); ?>">Media &amp; Gallery</a>
                                <a class="button" href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank">View Site</a>
                        </p>
                        <p style="color:#5f6f6a">Anything else (bookings, vouchers, prices) is handled by your web team - just message us.</p>
                        <?php
                }
        );
} );

// Gentle Emerald branding in the admin footer.
add_filter( 'admin_footer_text', function () {
        return 'Emerald Spa & Wellness Centre - content managed with care in Windhoek.';
} );
add_filter( 'update_footer', '__return_empty_string', 99 );

// Light, safe styling: soft background only, nothing structural (cannot break the admin UI).
add_action( 'admin_head', function () {
        echo '<style>body.wp-admin{background:#f5f8f7}</style>';
} );

/* ---------------------------------------------------------
 * 2. BOT DISCOURAGEMENT - admin surfaces only
 *    (the public site stays fully crawlable for SEO)
 * ------------------------------------------------------ */

// 2a. robots.txt: never crawl admin or login.
add_filter( 'robots_txt', function ( $output ) {
        $lines = array(
                'User-agent: *',
                'Disallow: /wp-admin/',
                'Disallow: /wp-login.php',
                'Disallow: /admin',
                'Disallow: /admin/',
        );
        // Preserve any sitemap lines WordPress or the SEO plugin added.
        if ( preg_match_all( '/^Sitemap:.*$/mi', $output, $m ) ) {
                foreach ( $m[0] as $line ) {
                        $lines[] = trim( $line );
                }
        }
        return implode( "\n", $lines ) . "\n";
} );

// 2b. X-Robots-Tag: noindex on every wp-admin / wp-login HTTP response.
//      Hooked to init because send_headers only fires on front-end main queries,
//      not on wp-login.php or wp-admin requests.
add_action( 'init', function () {
        $is_login = isset( $GLOBALS['pagenow'] ) && ( 'wp-login.php' === $GLOBALS['pagenow'] );
        if ( is_admin() || $is_login ) {
                header( 'X-Robots-Tag: noindex, nofollow', true );
        }
}, 1 );

// 2c. Turn XML-RPC off entirely (bots hammer it; nothing on this site uses it).
add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'xmlrpc_methods', '__return_empty_array' );

// 2d. Stop username enumeration: hide REST /wp/v2/users from logged-out traffic.
//     The headless frontend reads content via WPGraphQL, not this endpoint.
add_filter( 'rest_endpoints', function ( $endpoints ) {
        if ( is_user_logged_in() ) {
                return $endpoints;
        }
        foreach ( array_keys( $endpoints ) as $route ) {
                if ( false !== strpos( $route, '/wp/v2/users' ) ) {
                        unset( $endpoints[ $route ] );
                }
        }
        return $endpoints;
} );

// 2e. No author archives to scrape: point author links home.
add_filter( 'author_link', function () {
        return home_url( '/' );
} );

// 2f. Generic login errors (no "this username exists" hints) + small delay on failure.
add_filter( 'login_errors', function () {
        return 'Incorrect username or password.';
} );
add_action( 'wp_login_failed', function () {
        usleep( 900000 );
} );

// 2g. Keep the noisiest SEO-scanner bots out of wp-admin and wp-login only.
function emerald_block_scanner_bots() {
        if ( empty( $_SERVER['HTTP_USER_AGENT'] ) ) {
                return;
        }
        $ua   = strtolower( $_SERVER['HTTP_USER_AGENT'] );
        $bots = array( 'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'petalbot', 'serpstatbot', 'megaindex' );
        foreach ( $bots as $bot ) {
                if ( false !== strpos( $ua, $bot ) ) {
                        wp_die(
                                'Automated access to this area is not allowed.',
                                'Blocked',
                                array( 'response' => 403 )
                        );
                }
        }
}
add_action( 'admin_init', 'emerald_block_scanner_bots', 1 );
add_action( 'login_init', 'emerald_block_scanner_bots', 1 );

/* ---------------------------------------------------------
 * 3. CONTENT-EDITOR SCOPE
 *    Administrators keep everything; everyone else sees
 *    content tools only (menu hygiene - core capabilities
 *    already deny direct access to these screens).
 * ------------------------------------------------------ */

add_action( 'admin_menu', function () {
        if ( current_user_can( 'manage_options' ) ) {
                return;
        }
        $hide = array(
                'plugins.php',
                'tools.php',
                'options-general.php',
                'themes.php',
                'users.php',
                'edit-comments.php',
                'edit.php?post_type=acf-field-group',
        );
        foreach ( $hide as $menu ) {
                remove_menu_page( $menu );
        }
}, 999 );

// Content editors land straight on Pages after login.
add_filter( 'login_redirect', function ( $redirect_to, $requested_redirect_to, $user ) {
        if ( $user && ! is_wp_error( $user ) && $user->has_cap( 'edit_pages' ) && ! $user->has_cap( 'manage_options' ) ) {
                return admin_url( 'edit.php?post_type=page' );
        }
        return $redirect_to;
}, 10, 3 );

/* ---------------------------------------------------------
 * 4. LOGIN SCREEN BRANDING
 * ------------------------------------------------------ */

add_action( 'login_head', function () {
        echo '<style>body.login{background:#f5f8f7}</style>';
} );
add_filter( 'login_headertext', function () {
        return 'Emerald Spa & Wellness Centre';
} );
add_filter( 'login_headerurl', function () {
        return home_url( '/' );
} );
