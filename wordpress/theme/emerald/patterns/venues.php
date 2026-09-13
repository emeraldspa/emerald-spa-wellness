<?php
/**
 * Title: Venue packages
 * Slug: emerald/venues
 * Categories: emerald
 * Keywords: venues, groups, garden
 * Viewport Width: 1400
 *
 * @package Emerald
 */

defined( 'ABSPATH' ) || exit;

$venue_packages = array(
	array(
		'title'    => __( 'The Garden Experience', 'emerald' ),
		'duration' => __( '2 hours', 'emerald' ),
		'price'    => 1700,
		'text'     => __( 'A private garden setup for your group: welcome drinks, snacks, and the calm of the serenity garden.', 'emerald' ),
	),
	array(
		'title'    => __( 'The Ultimate Experience', 'emerald' ),
		'duration' => __( '2 hours', 'emerald' ),
		'price'    => 4500,
		'text'     => __( 'The full venue, dressed for your occasion, with drinks and refreshments flowing for the whole group.', 'emerald' ),
	),
);
?>
<!-- wp:group {"tagName":"section","className":"em-section em-section--venues","align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|l","bottom":"var:preset|spacing|xl"}}}} -->
<section class="wp-block-group em-section em-section--venues" style="padding-top:var(--wp--preset--spacing--l);padding-bottom:var(--wp--preset--spacing--xl)">
	<!-- wp:group {"className":"em-shell","layout":{"type":"constrained"}} -->
	<div class="wp-block-group em-shell">
		<!-- wp:paragraph {"className":"em-eyebrow","fontSize":"eyebrow"} -->
		<p class="em-eyebrow has-eyebrow-font-size"><?php esc_html_e( 'Private hire', 'emerald' ); ?></p>
		<!-- /wp:paragraph -->
		<!-- wp:heading {"level":2} -->
		<h2 class="wp-block-heading"><?php esc_html_e( 'The venue, yours for the afternoon.', 'emerald' ); ?></h2>
		<!-- /wp:heading -->
		<!-- wp:html -->
		<div class="em-venueboxes">
			<?php foreach ( $venue_packages as $package ) : ?>
				<article class="em-card em-card--venue">
					<div class="em-card__body">
						<h3 class="em-card__title"><?php echo esc_html( $package['title'] ); ?></h3>
						<p class="em-card__meta"><span><?php echo esc_html( $package['duration'] ); ?></span><strong><?php echo esc_html( emerald_format_nad( $package['price'] ) ); ?></strong></p>
						<p class="em-card__text"><?php echo esc_html( $package['text'] ); ?></p>
						<div class="em-card__actions">
							<a class="em-btn em-btn--solid" href="<?php echo esc_url( emerald_whatsapp_url( 'Hi Emerald Spa! I would like to enquire about the ' . $package['title'] . ' for my group.' ) ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Enquire on WhatsApp', 'emerald' ); ?></a>
						</div>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
		<!-- /wp:html -->
	</div>
	<!-- /wp:group -->
</section>
<!-- /wp:group -->
