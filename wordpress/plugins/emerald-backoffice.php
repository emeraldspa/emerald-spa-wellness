<?php
/**
 * Plugin Name: Emerald Back Office
 * Description: Branded login page and quick-actions dashboard widget for the Emerald Spa & Wellness Centre back office. Login matches the public gateway: cream and emerald, Fraunces serif, Inter body.
 * Version: 1.1.2
 * Description contains: branded login, front splash, tags on promotions, dashboard quick actions.
 * Author: Tangison Studio
 * License: GPL-2.0-or-later
 * Text Domain: emerald-backoffice
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'EMBO_URL', plugin_dir_url( __FILE__ ) );
define( 'EMBO_LOGO', 'https://emeraldspacc.com/brand/lockup-stacked-light.png' );

/* -------------------------------------------------------------------------
 * Branded login page
 * ---------------------------------------------------------------------- */

add_action( 'login_enqueue_scripts', 'embo_login_styles' );
function embo_login_styles() {
	wp_enqueue_style(
		'embo-fonts',
		'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,400&family=Inter:wght@400;500;600&display=swap',
		array(),
		null
	);

	$logo = esc_url( EMBO_LOGO );

	$css = '
		/* Warm cream backdrop with soft emerald and gold washes, like the gateway. */
		body.login {
			background:
				radial-gradient(1100px 620px at 12% -6%, rgba(26,115,87,.14), transparent 60%),
				radial-gradient(900px 560px at 96% 108%, rgba(193,154,91,.16), transparent 60%),
				linear-gradient(180deg,#faf7f1 0%, #f6f2ea 46%, #efe8da 100%);
			font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
		}
		body.login #login { padding-top: 8vh; }
		body.login #loginform, body.login .login form {
			background: rgba(255,253,248,.85);
			border: 1px solid rgba(14,75,58,.12);
			border-radius: 20px;
			box-shadow: 0 24px 60px -28px rgba(14,75,58,.30), 0 4px 14px rgba(14,75,58,.06);
			padding: 2.2rem 2rem 1.6rem;
		}
		/* Logo: the Emerald stacked lockup, sized modestly and crisp. */
		body.login h1 a {
			background-image: url(' . $logo . ');
			background-size: contain;
			background-repeat: no-repeat;
			background-position: center;
			width: 190px;
			height: 146px;
			margin: 0 auto 1.2rem;
		}
		body.login h1 { margin-bottom: 0.75rem; }
		body.login label { color: #0e4b3a; font-weight: 600; font-size: 13px; }
		body.login input[type="text"],
		body.login input[type="password"] {
			border-radius: 10px;
			border: 1px solid rgba(14,75,58,.25);
			font-size: 15px;
			padding: 10px 14px;
			transition: border-color .2s ease, box-shadow .2s ease;
		}
		body.login input[type="text"]:focus,
		body.login input[type="password"]:focus {
			border-color: #1a7357;
			box-shadow: 0 0 0 3px rgba(26,115,87,.18);
		}
		body.login .button-primary,
		body.login .wp-core-ui .button-primary {
			background: #14604a;
			border-color: #14604a;
			border-radius: 999px;
			font-weight: 600;
			letter-spacing: .04em;
			width: 100%;
			padding: 8px 12px;
			margin-top: .4rem;
			transition: background-color .2s ease, transform .15s ease;
		}
		body.login .button-primary:hover,
		body.login .wp-core-ui .button-primary:hover {
			background: #0e4b3a;
			border-color: #0e4b3a;
			transform: translateY(-1px);
		}
		body.login .button-primary:focus,
		body.login .wp-core-ui .button-primary:focus {
			box-shadow: 0 0 0 1px #fff, 0 0 0 3px rgba(26,115,87,.45);
		}
		body.login .submit { margin-top: 1rem; }
		body.login #nav a, body.login #backtoblog a {
			color: #5b6a61;
			font-size: 13px;
			transition: color .2s ease;
		}
		body.login #nav a:hover, body.login #backtoblog a:hover { color: #14604a; }
		body.login .message, body.login #login_error {
			border-radius: 12px;
			border-left-color: #14604a;
		}
		@media (max-width: 480px) {
			body.login #login { padding-top: 6vh; }
			body.login h1 a { width: 168px; height: 129px; }
		}
	';
	wp_add_inline_style( 'login', $css );
}

add_filter( 'login_headerurl', 'embo_login_logo_url' );
function embo_login_logo_url() {
	return home_url( '/' );
}

add_filter( 'login_headertitle', 'embo_login_logo_title' );
function embo_login_logo_title() {
	return get_bloginfo( 'name' );
}

/* -------------------------------------------------------------------------
 * Dashboard quick actions
 * ---------------------------------------------------------------------- */

add_action( 'wp_dashboard_setup', 'embo_dashboard_widget' );
function embo_dashboard_widget() {
	wp_add_dashboard_widget(
		'embo_quick_actions',
		'Emerald quick actions',
		'embo_render_quick_actions'
	);
}

function embo_render_quick_actions() {
	$links = array(
		'Promotions'          => admin_url( 'edit.php?post_type=promotion' ),
		'Add a promotion'     => admin_url( 'post-new.php?post_type=promotion' ),
		'Treatments'          => admin_url( 'edit.php?post_type=treatment' ),
		'Add a treatment'     => admin_url( 'post-new.php?post_type=treatment' ),
		'Guest reviews'       => admin_url( 'edit.php?post_type=testimonial' ),
		'Media library'       => admin_url( 'upload.php' ),
		'View the website'    => 'https://emeraldspacc.com',
	);
	echo '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;">';
	foreach ( $links as $label => $url ) {
		$external = strpos( $url, 'http' ) === 0 && strpos( $url, admin_url() ) !== 0;
		echo '<a href="' . esc_url( $url ) . '"'
			. ( $external ? ' target="_blank" rel="noopener noreferrer"' : '' )
			. ' style="display:block;padding:12px 10px;border:1px solid rgba(14,75,58,.18);border-radius:12px;'
			. 'background:#fbf9f4;color:#0e4b3a;font-weight:600;font-size:13px;text-decoration:none;'
			. 'transition:background-color .18s ease,border-color .18s ease;text-align:center;">'
			. esc_html( $label ) . '</a>';
	}
	echo '</div>';
	echo '<p style="margin:10px 0 2px;color:#8b968e;font-size:12px;">Everything you need is one click away. All content publishes to the public website.</p>';
}

/* -------------------------------------------------------------------------
 * Front splash - the headless landing page
 * ----------------------------------------------------------------------
 * Visitors who land on this host (the content back office) must see one
 * calm branded page, not the theme's blog index with its header and
 * footer. The splash renders itself and exits before the theme can load,
 * so no theme header or footer can ever appear here.
 */

add_action( 'template_redirect', 'embo_front_splash' );
function embo_front_splash() {
	// Only the site root, and never admin, REST, cron or feed requests.
	if ( ! is_front_page() || is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return;
	}

	$logo = esc_url( EMBO_LOGO );
	$site = 'https://emeraldspacc.com';
	header( 'Content-Type: text/html; charset=utf-8' );
	status_header( 200 );
	nocache_headers();
	?>
<!DOCTYPE html>
<html lang="en-NA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Emerald Spa &amp; Wellness Centre — Content back office</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
	* { box-sizing: border-box; margin: 0; padding: 0; }
	body {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background:
			radial-gradient(1100px 620px at 12% -6%, rgba(26,115,87,.14), transparent 60%),
			radial-gradient(900px 560px at 96% 108%, rgba(193,154,91,.16), transparent 60%),
			linear-gradient(180deg,#faf7f1 0%, #f6f2ea 46%, #efe8da 100%);
		font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
		color: #123b2f;
	}
	.card {
		position: relative;
		width: 100%;
		max-width: 560px;
		text-align: center;
		background: rgba(255,253,248,.88);
		border-radius: 26px;
		padding: 56px 40px 48px;
		box-shadow: 0 30px 80px -32px rgba(14,75,58,.35), 0 4px 14px rgba(14,75,58,.05);
	}
	/* Fading border: a gradient hairline that dissolves towards the bottom. */
	.card::after {
		content: "";
		position: absolute;
		inset: 0;
		border-radius: 26px;
		padding: 1px;
		background: linear-gradient(to bottom, rgba(14,75,58,.35), rgba(14,75,58,.10) 42%, transparent 80%);
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		        mask-composite: exclude;
		pointer-events: none;
	}
	.card img { width: 168px; height: auto; margin: 0 auto 22px; display: block; }
	.eyebrow {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: .28em;
		text-transform: uppercase;
		color: #1a7357;
		margin-bottom: 14px;
	}
	h1 {
		font-family: "Fraunces", Georgia, serif;
		font-weight: 400;
		font-size: clamp(26px, 5vw, 34px);
		line-height: 1.18;
		color: #0c2e24;
		margin-bottom: 14px;
	}
	p.lead { font-size: 15px; line-height: 1.65; color: #3f5c52; max-width: 42ch; margin: 0 auto 30px; }
	.actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 48px;
		padding: 0 26px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: .14em;
		text-transform: uppercase;
		text-decoration: none;
		transition: transform .25s ease, background-color .2s ease, border-color .2s ease;
	}
	.btn-solid { background: #14604a; color: #fdfcf9; }
	.btn-solid:hover { background: #0e4b3a; transform: translateY(-1px); }
	.btn-ghost { border: 1px solid rgba(14,75,58,.35); color: #0e4b3a; }
	.btn-ghost:hover { border-color: #14604a; background: rgba(26,115,87,.06); }
	.footnote { margin-top: 26px; font-size: 12px; color: #8b968e; }
</style>
</head>
<body>
	<main class="card">
		<img src="<?php echo $logo; ?>" alt="Emerald Spa &amp; Wellness Centre" width="168" height="204">
		<p class="eyebrow">Content back office</p>
		<h1>The calm behind the website.</h1>
		<p class="lead">This is the private content hub of Emerald Spa &amp; Wellness Centre. The public website lives at emeraldspacc.com - specials published here appear there automatically.</p>
		<div class="actions">
			<a class="btn btn-ghost" href="<?php echo esc_url( wp_login_url() ); ?>">Sign in</a>
			<a class="btn btn-solid" href="<?php echo esc_url( $site ); ?>" rel="noopener noreferrer">Visit the website</a>
		</div>
		<p class="footnote">Emerald Spa &amp; Wellness Centre · 7 Blackett Street, Windhoek North</p>
	</main>
</body>
</html>
	<?php
	exit;
}

/* -------------------------------------------------------------------------
 * Tags on promotions
 * ----------------------------------------------------------------------
 * Each special carries its own tags (season, audience) so the public site
 * can file them and the team can filter the grid. REST exposes them with
 * the rest of the promotion fields.
 */

add_action( 'init', function () {
	register_taxonomy_for_object_type( 'post_tag', 'promotion' );
}, 99 );

/* -------------------------------------------------------------------------
 * One-time ops: retire the old superadmin mailbox as the site email
 * ----------------------------------------------------------------------
 * WordPress deliberately surrounds the site admin email with a
 * confirmation flow. The client's instruction is explicit, so the change
 * is made once, here, when this plugin activates. If the option is ever
 * changed again by hand, this hook leaves it alone.
 */

register_activation_hook( __FILE__, 'embo_set_admin_email' );
function embo_set_admin_email() {
	if ( get_option( 'admin_email' ) === 'tangi@tangison.com' ) {
		update_option( 'admin_email', 'admin@emeraldspacc.com' );
	}
}
