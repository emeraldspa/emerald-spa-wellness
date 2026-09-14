<?php
/**
 * Plugin Name: Emerald Maintenance Gate
 * Version:     1.0.0
 * Description: Branded 503 maintenance page for emeraldspacc.com. Toggled by
 *              the emerald_maintenance_mode option ("1" = on, "" = off).
 *              Logged-in users, wp-login.php, wp-admin, admin-ajax.php,
 *              wp-cron.php and WP-CLI always pass through. Visitors receive a
 *              branded page that keeps Fresha booking and WhatsApp reachable
 *              while the site is being worked on. Created after the client
 *              found the default maintenance screen embarrassing.
 *
 * @package Emerald
 */

if ( get_option( 'emerald_maintenance_mode' ) !== '1' ) {
	return;
}

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	return;
}

$is_admin_area = is_admin()
	|| ( isset( $_SERVER['PHP_SELF'] ) && false !== strpos( (string) $_SERVER['PHP_SELF'], 'wp-admin' ) )
	|| ( isset( $_SERVER['SCRIPT_NAME'] ) && preg_match( '#(wp-login\.php|wp-cron\.php|admin-ajax\.php|async-upload\.php)$#', (string) $_SERVER['SCRIPT_NAME'] ) );

if ( $is_admin_area || is_user_logged_in() ) {
	return;
}

status_header( 503 );
nocache_headers();
header( 'Retry-After: 3600' );
header( 'X-Robots-Tag: noindex, noarchive', true );

$fresha   = 'https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&pId=1477270';
$whatsapp = 'https://wa.me/264856077143?text=' . rawurlencode( 'Hi Emerald Spa! I would like to make a booking.' );
$lockup   = WP_CONTENT_URL . '/plugins/emerald-core/assets/img/lockup-stacked-light.png';

?><!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, noarchive">
<title>Back shortly | Emerald Spa &amp; Wellness Centre</title>
<style>
	:root { color-scheme: dark; }
	* { box-sizing: border-box; margin: 0; padding: 0; }
	body {
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #07211A;
		background-image: radial-gradient(60rem 40rem at 50% -10rem, rgba(8, 116, 82, 0.35), transparent 65%);
		color: #F7F5F1;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		padding: 2rem 1.25rem;
		text-align: center;
	}
	.gate { max-width: 34rem; }
	.gate img { width: 118px; height: auto; margin: 0 auto 1.4rem; display: block; }
	.eyebrow {
		font-size: 0.72rem;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: #9DC4B4;
		margin-bottom: 1.1rem;
	}
	h1 {
		font-family: Georgia, "Times New Roman", serif;
		font-weight: 400;
		font-size: clamp(2.1rem, 6vw, 3.1rem);
		line-height: 1.12;
		margin-bottom: 1rem;
	}
	p.lead { color: #C7E9DA; line-height: 1.65; font-size: 1rem; margin-bottom: 2rem; }
	p.lead strong { color: #F7F5F1; font-weight: 600; }
	.actions { display: flex; flex-wrap: wrap; gap: 0.8rem; justify-content: center; margin-bottom: 2.2rem; }
	.actions a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 48px;
		padding: 0.85rem 1.7rem;
		border-radius: 999px;
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		text-decoration: none;
		transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	}
	.actions a.solid { background: #0A9E6E; color: #07211A; }
	.actions a.solid:hover, .actions a.solid:focus-visible { background: #0BB87F; }
	.actions a.ghost { border: 1px solid rgba(199, 233, 218, 0.45); color: #F7F5F1; }
	.actions a.ghost:hover, .actions a.ghost:focus-visible { border-color: #F7F5F1; }
	.address { font-size: 0.85rem; color: #9DC4B4; line-height: 1.7; }
	.address a { color: #C7E9DA; text-decoration: none; }
	.address a:hover, .address a:focus-visible { text-decoration: underline; }
	@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
</head>
<body>
<main class="gate">
	<img src="<?php echo esc_url( $lockup ); ?>" alt="Emerald Spa and Wellness Centre" width="118" height="144" decoding="async">
	<p class="eyebrow">Windhoek North, Namibia</p>
	<h1>We are giving the site a polish.</h1>
	<p class="lead">
		<strong>The spa is open as usual.</strong> Bookings are confirmed as always,
		and the website will be back shortly. Thank you for your patience.
	</p>
	<div class="actions">
		<a class="solid" href="<?php echo esc_url( $fresha ); ?>" target="_blank" rel="noopener noreferrer">Book on Fresha</a>
		<a class="ghost" href="<?php echo esc_url( $whatsapp ); ?>" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
	</div>
	<p class="address">
		7 Blackett Street, Windhoek North, Windhoek<br>
		<a href="tel:+264856077143">+264 85 607 7143</a>
	</p>
</main>
</body>
</html>
<?php
exit;
