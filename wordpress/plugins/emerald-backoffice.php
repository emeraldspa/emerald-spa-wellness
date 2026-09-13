<?php
/**
 * Plugin Name:  Emerald Back Office
 * Description: Quick-actions dashboard widget, staff guidebook door, front splash for the private back office host, and tags on specials. Login styling lives in the Emerald Admin Suite (mu-plugin) so the back office always has one premium gateway. The front splash retires itself the moment this install serves the public site.
 * Version:      1.2.0
 * Author:       Emerald Webmaster
 * License:      GPL-2.0-or-later
 * Text Domain:  emerald-backoffice
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'EMBO_URL', plugin_dir_url( __FILE__ ) );

/**
 * Logo asset. v1.1 pointed at the Vercel-served public domain, which died
 * with the outage; the asset now ships with the plugin (assets/), falling
 * back to the public-domain copy only if the local file is missing.
 */
function embo_logo_url() {
	static $url = null;
	if ( null !== $url ) {
		return $url;
	}
	if ( file_exists( plugin_dir_path( __FILE__ ) . 'assets/lockup-stacked-light.png' ) ) {
		$url = EMBO_URL . 'assets/lockup-stacked-light.png';
	} else {
		$url = 'https://emeraldspacc.com/brand/lockup-stacked-light.png';
	}
	return $url;
}

/* -------------------------------------------------------------------------
 * Staff guidebook
 * ----------------------------------------------------------------------
 * The Emerald Website Handbook lives in the media library. Both doors to
 * it (the quick action below and the splash button) open it in a new
 * window, so whatever page the reader is on never moves.
 */

function embo_guidebook_url() {
	static $url = null;
	if ( null !== $url ) {
		return $url;
	}
	$found = get_posts(
		array(
			'post_type'      => 'attachment',
			'name'           => 'emerald-wordpress-guidebook',
			'posts_per_page' => 1,
			'post_status'    => 'inherit',
			'fields'         => 'ids',
		)
	);
	$url   = $found
		? wp_get_attachment_url( $found[0] )
		: 'https://admin.emeraldspacc.com/wp-content/uploads/2026/09/emerald-wordpress-guidebook.pdf';
	return $url;
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
		'Specials'         => array( admin_url( 'edit.php?post_type=promotion' ), false ),
		'Add a special'    => array( admin_url( 'post-new.php?post_type=promotion' ), false ),
		'Treatments'       => array( admin_url( 'edit.php?post_type=treatment' ), false ),
		'Guest reviews'    => array( admin_url( 'edit.php?post_type=testimonial' ), false ),
		'Media library'    => array( admin_url( 'upload.php' ), false ),
		'View the website' => array( home_url( '/' ), true ),
		'Staff guidebook'  => array( embo_guidebook_url(), true ),
	);
	echo '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;">';
	foreach ( $links as $label => $link ) {
		list( $url, $new_tab ) = $link;
		echo '<a href="' . esc_url( $url ) . '"'
						. ( $new_tab ? ' target="_blank" rel="noopener noreferrer"' : '' )
						. ' style="display:block;padding:12px 10px;border:1px solid rgba(14,75,58,.18);border-radius:12px;'
						. 'background:#fbf9f4;color:#0e4b3a;font-weight:600;font-size:13px;text-decoration:none;'
						. 'transition:background-color .18s ease,border-color .18s ease;text-align:center;">'
						. esc_html( $label ) . '</a>';
	}
	echo '</div>';
	echo '<p style="margin:10px 0 2px;color:#8b968e;font-size:12px;">Everything you need is one click away. All content publishes to the public website.</p>';
}

/* -------------------------------------------------------------------------
 * Front splash - the back office landing page
 * ----------------------------------------------------------------------
 * Visitors who land on the private content host must see one calm branded
 * page, not a blog index. The splash renders itself and exits before the
 * theme can load.
 *
 * v1.2 cutover guard: once this install is promoted to serve the public
 * site (home host no longer contains "admin."), the splash retires itself
 * and the Emerald theme homepage takes over. No manual step to forget.
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

	$host = strtolower( (string) wp_parse_url( home_url(), PHP_URL_HOST ) );
	if ( '' !== $host && false === strpos( $host, 'admin.' ) ) {
		return;
	}

	$logo = esc_url( embo_logo_url() );
	$site = home_url( '/' );
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
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<style>
	* { box-sizing: border-box; margin: 0; padding: 0; }
	body {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background:
			radial-gradient(1200px 640px at 14% -8%, rgba(8,116,82,.55), transparent 62%),
			radial-gradient(900px 520px at 98% 112%, rgba(199,123,54,.28), transparent 60%),
			linear-gradient(168deg,#0A2B22 0%, #07211A 52%, #051712 100%);
		font-family: "Poppins", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
		color: #EAF6F1;
	}
	.card {
		position: relative;
		width: 100%;
		max-width: 560px;
		text-align: center;
		background: rgba(234,246,241,.06);
		border: 1px solid rgba(199,233,218,.16);
		border-radius: 26px;
		padding: 56px 40px 48px;
		box-shadow: 0 30px 80px -32px rgba(0,0,0,.65), inset 0 1px 0 rgba(234,246,241,.08);
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
	}
	.card img { width: 150px; height: auto; margin: 0 auto 22px; display: block; }
	.eyebrow {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: .28em;
		text-transform: uppercase;
		color: #75E0BA;
		margin-bottom: 14px;
	}
	h1 {
		font-family: Georgia, "Times New Roman", serif;
		font-weight: 400;
		font-size: clamp(26px, 5vw, 34px);
		line-height: 1.18;
		color: #F7F5F1;
		margin-bottom: 14px;
	}
	p.lead { font-size: 15px; line-height: 1.65; color: #C7E9DA; max-width: 42ch; margin: 0 auto 30px; }
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
	.btn-solid { background: linear-gradient(180deg,#0A5A45,#087452); color: #FDFCF9; border: 1px solid rgba(117,224,186,.35); }
	.btn-solid:hover { filter: brightness(1.08); transform: translateY(-1px); }
	.btn-ghost { border: 1px solid rgba(199,233,218,.35); color: #EAF6F1; }
	.btn-ghost:hover { border-color: #75E0BA; background: rgba(117,224,186,.08); }
	.footnote { margin-top: 26px; font-size: 12px; color: rgba(199,233,218,.55); }
</style>
</head>
<body>
	<main class="card">
		<img src="<?php echo $logo; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>" alt="Emerald Spa &amp; Wellness Centre" width="150" height="183">
		<p class="eyebrow">Content back office</p>
		<h1>The calm behind the website.</h1>
		<p class="lead">This is the private content hub of Emerald Spa &amp; Wellness Centre. The public website lives at emeraldspacc.com - specials published here appear there automatically.</p>
		<div class="actions">
			<a class="btn btn-ghost" href="<?php echo esc_url( wp_login_url() ); ?>">Sign in</a>
			<a class="btn btn-solid" href="<?php echo esc_url( $site ); ?>" rel="noopener noreferrer">Visit the website</a>
			<a class="btn btn-ghost" href="<?php echo esc_url( embo_guidebook_url() ); ?>" target="_blank" rel="noopener noreferrer">Staff guidebook</a>
		</div>
		<p class="footnote">Emerald Spa &amp; Wellness Centre &middot; 7 Blackett Street, Windhoek North</p>
	</main>
</body>
</html>
	<?php
	exit;
}

/* -------------------------------------------------------------------------
 * Tags on specials
 * ----------------------------------------------------------------------
 * Each special carries its own tags (season, audience) so the public site
 * can file them and the team can filter the grid. REST exposes them with
 * the rest of the promotion fields.
 */

add_action( 'init', function () {
	if ( post_type_exists( 'promotion' ) ) {
		register_taxonomy_for_object_type( 'post_tag', 'promotion' );
	}
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
