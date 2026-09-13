<?php
/**
 * Title: Visit, hours and location
 * Slug: emerald/visit
 * Categories: emerald
 * Keywords: hours, map, directions, contact
 * Viewport Width: 1400
 *
 * @package Emerald
 */

defined( 'ABSPATH' ) || exit;

$address = emerald_content( 'address' );
?>
<!-- wp:group {"tagName":"section","className":"em-section em-section--visit","align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|l","bottom":"var:preset|spacing|xl"}}}} -->
<section class="wp-block-group em-section em-section--visit" style="padding-top:var(--wp--preset--spacing--l);padding-bottom:var(--wp--preset--spacing--xl)">
	<!-- wp:group {"className":"em-shell em-visit","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
	<div class="wp-block-group em-shell em-visit">

		<!-- wp:group {"className":"em-visit__col","layout":{"type":"constrained"}} -->
		<div class="wp-block-group em-visit__col">
			<!-- wp:paragraph {"className":"em-eyebrow","fontSize":"eyebrow"} -->
			<p class="em-eyebrow has-eyebrow-font-size"><?php esc_html_e( 'Find us', 'emerald' ); ?></p>
			<!-- /wp:paragraph -->
			<!-- wp:html -->
			<address class="em-visit__address">
				7 Blackett Street<br />
				Windhoek North, Windhoek<br />
				Khomas Region, Namibia
			</address>
			<div class="em-visit__actions">
				<a class="em-btn em-btn--solid" href="<?php echo esc_url( $address['directionsUrl'] ?? 'https://maps.google.com/?daddr=7%20Blackett%20Street,%20Windhoek,%20Khomas%20Region' ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Get directions', 'emerald' ); ?></a>
				<a class="em-btn em-btn--ghost" href="<?php echo esc_url( emerald_whatsapp_url( 'Hi Emerald Spa! I need help finding you.' ) ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Ask on WhatsApp', 'emerald' ); ?></a>
			</div>
			<!-- /wp:html -->
		</div>
		<!-- /wp:group -->

		<!-- wp:group {"className":"em-visit__col","layout":{"type":"constrained"}} -->
		<div class="wp-block-group em-visit__col">
			<!-- wp:paragraph {"className":"em-eyebrow","fontSize":"eyebrow"} -->
			<p class="em-eyebrow has-eyebrow-font-size"><?php esc_html_e( 'Hours', 'emerald' ); ?></p>
			<!-- /wp:paragraph -->
			<!-- wp:html -->
			<?php echo emerald_render_hours(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<!-- /wp:html -->
		</div>
		<!-- /wp:group -->

		<!-- wp:group {"className":"em-visit__col em-visit__col--map","layout":{"type":"constrained"}} -->
		<div class="wp-block-group em-visit__col em-visit__col--map">
			<!-- wp:html -->
			<iframe class="em-visit__map" title="<?php esc_attr_e( 'Map to Emerald Spa and Wellness Centre', 'emerald' ); ?>" src="https://maps.google.com/maps?cid=7086159021214099544&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
			<!-- /wp:html -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</section>
<!-- /wp:group -->
