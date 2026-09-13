<?php
/**
 * Plugin Name: Emerald Admin Suite
 * Plugin URI:  https://emeraldspacc.com
 * Description: Premium login, polished admin dashboard, bot discouragement, login throttling and content-editor scoping for emeraldspacc.com. Pairs with Admin Site Enhancements (ASE) - free custom code only, no paid plugins, no Wordfence.
 * Version:     2.0.0
 * Author:      Emerald Webmaster
 * License:     GPL-2.0-or-later
 */

defined( 'ABSPATH' ) || exit;

/* ---------------------------------------------------------
 * 0. GUARDRAILS
 * ------------------------------------------------------ */

if ( ! defined( 'DISALLOW_FILE_EDIT' ) ) {
        define( 'DISALLOW_FILE_EDIT', true );
}

add_filter( 'the_generator', '__return_empty_string' );

/* ---------------------------------------------------------
 * 1. PREMIUM LOGIN - the first impression of the back office
 *    Ink ground, emerald glow, glass card, the real lockup.
 * ------------------------------------------------------ */

add_action( 'login_enqueue_scripts', 'emerald_login_assets' );
/**
 * Login screen assets. The stylesheet is self-contained: fonts already
 * ship in the theme, so the login page never reaches out to Google.
 */
function emerald_login_assets() {
        $css = '
                body.login {
                        background:
                                radial-gradient(1200px 640px at 14% -8%, rgba(8, 116, 82, 0.55), transparent 62%),
                                radial-gradient(900px 520px at 98% 112%, rgba(199, 123, 54, 0.28), transparent 60%),
                                linear-gradient(168deg, #0A2B22 0%, #07211A 52%, #051712 100%);
                        font-family: "Poppins", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
                        color: #EAF6F1;
                        min-height: 100vh;
                }
                body.login a { color: #9CC8B6; }
                body.login a:hover { color: #EAF6F1; }
                body.login #login { padding-top: 9vh; width: 340px; }
                body.login h1 a {
                        background-image: none !important;
                        width: auto;
                        height: auto;
                        margin: 0 0 1.4rem;
                        text-indent: 0;
                        display: flex;
                        justify-content: center;
                }
                body.login h1 a::before {
                        content: "";
                        width: 148px;
                        height: 181px;
                        background-image: url("' . esc_url( emerald_login_logo_url() ) . '");
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: center;
                        display: block;
                }
                body.login form,
                body.login #loginform {
                        background: rgba(234, 246, 241, 0.06);
                        border: 1px solid rgba(199, 233, 218, 0.16);
                        border-radius: 20px;
                        box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(234, 246, 241, 0.08);
                        -webkit-backdrop-filter: blur(14px);
                        backdrop-filter: blur(14px);
                        padding: 1.9rem 1.75rem 1.5rem;
                }
                body.login form .input,
                body.login input[type="text"],
                body.login input[type="password"] {
                        background: rgba(7, 33, 26, 0.55);
                        border: 1px solid rgba(199, 233, 218, 0.28);
                        border-radius: 12px;
                        color: #F7F5F1;
                        font-size: 15px;
                        padding: 11px 14px;
                        margin-top: 6px;
                        transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }
                body.login input:focus {
                        border-color: #75E0BA;
                        box-shadow: 0 0 0 3px rgba(117, 224, 186, 0.22);
                        outline: none;
                }
                body.login label { color: #C7E9DA; font-weight: 500; font-size: 12.5px; letter-spacing: 0.02em; }
                body.login .forgetmenot label { font-size: 12px; }
                body.login .button-primary,
                body.login .wp-core-ui .button-primary {
                        background: linear-gradient(180deg, #0A5A45, #087452);
                        border: 1px solid rgba(117, 224, 186, 0.35);
                        border-radius: 999px;
                        width: 100%;
                        min-height: 46px;
                        font-weight: 600;
                        font-size: 13px;
                        letter-spacing: 0.12em;
                        text-transform: uppercase;
                        margin-top: 0.6rem;
                        text-shadow: none;
                        transition: filter 0.2s ease, transform 0.15s ease;
                }
                body.login .button-primary:hover,
                body.login .button-primary:focus {
                        background: linear-gradient(180deg, #063F31, #0A5A45);
                        border-color: #75E0BA;
                        filter: brightness(1.06);
                        transform: translateY(-1px);
                }
                body.login input.button-primary:focus { box-shadow: 0 0 0 3px rgba(117, 224, 186, 0.3); }
                body.login #nav, body.login #backtoblog { text-align: center; margin-top: 0.8rem; }
                body.login #nav a, body.login #backtoblog a { font-size: 12.5px; }
                body.login .message,
                body.login #login_error,
                body.login .login .message {
                        background: rgba(234, 246, 241, 0.08);
                        border: 1px solid rgba(199, 233, 218, 0.2);
                        border-left: 4px solid #75E0BA;
                        border-radius: 12px;
                        color: #EAF6F1;
                        box-shadow: none;
                }
                body.login #login_error { border-left-color: #F2C35E; }
                body.login .language-switcher { display: none; }
                body.login .privacy-login-page { display: none; }
                body.login em-demo-note { display: none; }
                body.login #login .custom-note {
                        text-align: center;
                        color: rgba(199, 233, 218, 0.55);
                        font-size: 11.5px;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                        margin-top: 1.1rem;
                }
                @media (max-width: 480px) {
                        body.login #login { padding-top: 6vh; width: 300px; }
                        body.login h1 a::before { width: 124px; height: 152px; }
                }
        ';
        wp_register_style( 'emerald-login', false, array(), '2.0.0' );
        wp_enqueue_style( 'emerald-login' );
        wp_add_inline_style( 'emerald-login', $css );
}

/**
 * The light stacked lockup ships with the theme; get_theme_file_uri resolves
 * it wherever the theme lives.
 */
function emerald_login_logo_url() {
        return get_theme_file_uri( 'assets/img/lockup-stacked-light.png' );
}

add_filter( 'login_headertext', function () {
        return '&nbsp;';
} );
add_filter( 'login_headerurl', function () {
        return home_url( '/' );
} );

add_action( 'login_footer', function () {
        echo '<p class="custom-note">' . esc_html__( 'Emerald Spa & Wellness Centre, Windhoek', 'emerald' ) . '</p>';
} );

/* ---------------------------------------------------------
 * 2. LOGIN THROTTLING - the Wordfence replacement core
 *    5 failed attempts per IP+username pair, 15 minute lockout.
 *    Transient-based: works on any host, nothing to configure.
 * ------------------------------------------------------ */

add_filter( 'authenticate', 'emerald_login_throttle', 20, 3 );
/**
 * Refuse authentication attempts while an IP is locked out.
 *
 * @param WP_User|WP_Error|null $user     User object or error.
 * @param string                $username Attempted username.
 */
function emerald_login_throttle( $user, $username ) {
        if ( empty( $username ) || ! isset( $_SERVER['REMOTE_ADDR'] ) ) {
                return $user;
        }
        $attempts = (int) get_transient( emerald_throttle_key( $username ) );
        if ( $attempts >= 5 ) {
                return new WP_Error(
                        'emerald_locked_out',
                        sprintf(
                                /* translators: %d: minutes until the next attempt is allowed. */
                                __( 'Too many failed attempts. Please try again in %d minutes.', 'emerald' ),
                                15
                        )
                );
        }
        return $user;
}

add_action( 'wp_login_failed', 'emerald_login_failed' );
/**
 * Count a failed attempt against the IP+username pair.
 *
 * @param string $username Attempted username.
 */
function emerald_login_failed( $username ) {
        $key      = emerald_throttle_key( $username );
        $attempts = (int) get_transient( $key );
        set_transient( $key, $attempts + 1, 15 * MINUTE_IN_SECONDS );
        usleep( 900000 );
}

add_action( 'wp_login', 'emerald_login_success', 10, 1 );
/**
 * Clear the counter on success.
 *
 * @param string $username Logged-in username.
 */
function emerald_login_success( $username ) {
        delete_transient( emerald_throttle_key( $username ) );
}

/**
 * Throttle transient key (privacy-safe hash).
 *
 * @param string $username Attempted username.
 */
function emerald_throttle_key( $username ) {
        $ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
        return 'emerald_login_' . md5( $ip . '|' . strtolower( (string) $username ) );
}

add_filter( 'login_errors', function () {
        return __( 'Incorrect username or password.', 'emerald' );
} );

/* ---------------------------------------------------------
 * 3. BOT DISCOURAGEMENT - admin surfaces only
 * ------------------------------------------------------ */

add_filter( 'robots_txt', function ( $output ) {
        $lines = array(
                'User-agent: *',
                'Disallow: /wp-admin/',
                'Disallow: /wp-login.php',
                'Disallow: /admin',
                'Disallow: /admin/',
        );
        if ( preg_match_all( '/^Sitemap:.*$/mi', $output, $m ) ) {
                foreach ( $m[0] as $line ) {
                        $lines[] = trim( $line );
                }
        }
        return implode( "\n", $lines ) . "\n";
} );

add_action( 'init', function () {
        $is_login = isset( $GLOBALS['pagenow'] ) && ( 'wp-login.php' === $GLOBALS['pagenow'] );
        if ( is_admin() || $is_login ) {
                header( 'X-Robots-Tag: noindex, nofollow', true );
        }
}, 1 );

add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'xmlrpc_methods', '__return_empty_array' );

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

add_filter( 'author_link', function () {
        return home_url( '/' );
} );

/**
 * Keep the noisiest SEO scanners away from wp-admin and wp-login.
 */
function emerald_block_scanner_bots() {
        if ( empty( $_SERVER['HTTP_USER_AGENT'] ) ) {
                return;
        }
        $ua   = strtolower( sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) );
        $bots = array( 'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'petalbot', 'serpstatbot', 'megaindex' );
        foreach ( $bots as $bot ) {
                if ( false !== strpos( $ua, $bot ) ) {
                        wp_die(
                                esc_html__( 'Automated access to this area is not allowed.', 'emerald' ),
                                esc_html__( 'Blocked', 'emerald' ),
                                array( 'response' => 403 )
                        );
                }
        }
}
add_action( 'admin_init', 'emerald_block_scanner_bots', 1 );
add_action( 'login_init', 'emerald_block_scanner_bots', 1 );

/* ---------------------------------------------------------
 * 4. SECURITY HEADERS - quiet, frontend-safe
 * ------------------------------------------------------ */

add_action( 'send_headers', function () {
        if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || wp_doing_cron() || wp_doing_ajax() ) {
                return;
        }
        header( 'X-Frame-Options: SAMEORIGIN' );
        header( 'X-Content-Type-Options: nosniff' );
        header( 'Referrer-Policy: strict-origin-when-cross-origin' );
        header( 'Permissions-Policy: geolocation=(), microphone=(), camera=()' );
} );

/* ---------------------------------------------------------
 * 5. POLISHED DASHBOARD - calm, branded, client-friendly
 * ------------------------------------------------------ */

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

add_action( 'wp_dashboard_setup', function () {
        wp_add_dashboard_widget(
                'emerald_welcome',
                'Emerald Spa & Wellness Centre',
                function () {
                        ?>
                        <p style="font-size:14px;margin-top:0"><strong>Welcome to your control room.</strong></p>
                        <p>Update your website in these places - each one saves straight to the live site:</p>
                        <p>
                                <a class="button button-primary" href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>">Edit Pages</a>
                                <a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=promotion' ) ); ?>">Specials</a>
                                <a class="button" href="<?php echo esc_url( admin_url( 'upload.php' ) ); ?>">Media &amp; Gallery</a>
                                <a class="button" href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank">View Site</a>
                        </p>
                        <p style="color:#5f6f6a">Anything else (bookings, vouchers, prices) is handled by your web team - just message us.</p>
                        <?php
                }
        );
} );

add_filter( 'admin_footer_text', function () {
        return 'Emerald Spa & Wellness Centre - content managed with care in Windhoek.';
} );
add_filter( 'update_footer', '__return_empty_string', 99 );

add_action( 'admin_head', function () {
        echo '<style>:root{--wp-admin-theme-color:#087452;--wp-admin-theme-color--rgb:8,116,82;--wp-admin-theme-color-darker-10:#0A5A45;--wp-admin-theme-color-darker-20:#063F31;--wp-admin-theme-color-lighter-10:#0874521a;}body.wp-admin{background:#f5f8f7}</style>';
} );

/* ---------------------------------------------------------
 * 6. CONTENT-EDITOR SCOPE
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

add_filter( 'login_redirect', function ( $redirect_to, $requested_redirect_to, $user ) {
        if ( $user && ! is_wp_error( $user ) && $user->has_cap( 'edit_pages' ) && ! $user->has_cap( 'manage_options' ) ) {
                return admin_url( 'edit.php?post_type=page' );
        }
        return $redirect_to;
}, 10, 3 );
