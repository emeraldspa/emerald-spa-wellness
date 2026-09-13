<?php
/**
 * Title: Home, intro and treatments preview
 * Slug: emerald/home-intro
 * Categories: emerald
 * Keywords: home, treatments, welcome
 * Viewport Width: 1400
 *
 * Post-hero home sections: welcome copy, the priced treatment categories as
 * cards, specials preview (server block), reviews, and the closing call to
 * action.
 *
 * @package Emerald
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:group {"tagName":"section","className":"em-section em-section--intro","align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|xxl","bottom":"var:preset|spacing|xl"}}}} -->
<section class="wp-block-group em-section em-section--intro" style="padding-top:var(--wp--preset--spacing--xxl);padding-bottom:var(--wp--preset--spacing--xl)">
	<!-- wp:group {"className":"em-shell","layout":{"type":"constrained"}} -->
	<div class="wp-block-group em-shell">
		<!-- wp:paragraph {"className":"em-eyebrow em-reveal","fontSize":"eyebrow"} -->
		<p class="em-eyebrow em-reveal has-eyebrow-font-size"><?php esc_html_e( 'The Emerald way', 'emerald' ); ?></p>
		<!-- /wp:paragraph -->
		<!-- wp:heading {"level":2,"className":"em-reveal"} -->
		<h2 class="wp-block-heading em-reveal"><?php esc_html_e( 'Quiet luxury, honest care, and a garden to breathe in.', 'emerald' ); ?></h2>
		<!-- /wp:heading -->
		<!-- wp:paragraph {"className":"em-lead em-reveal","fontSize":"large"} -->
		<p class="em-lead em-reveal has-large-font-size"><?php esc_html_e( 'Attentive therapists, complimentary refreshments, showers, lockers and towels: everything is ready before you arrive, so the moment you step inside you can simply hand over the day and settle in.', 'emerald' ); ?></p>
		<!-- /wp:paragraph -->
		<!-- wp:html -->
		<ul class="em-features em-reveal">
			<?php foreach ( emerald_content( 'features' ) as $feature ) : ?>
				<li><?php echo esc_html( $feature ); ?></li>
			<?php endforeach; ?>
		</ul>
		<!-- /wp:html -->
	</div>
	<!-- /wp:group -->
</section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","className":"em-section em-section--treatments","align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|xl","bottom":"var:preset|spacing|xl"}}}} -->
<section class="wp-block-group em-section em-section--treatments" style="padding-top:var(--wp--preset--spacing--xl);padding-bottom:var(--wp--preset--spacing--xl)">
	<!-- wp:group {"className":"em-shell","layout":{"type":"constrained"}} -->
	<div class="wp-block-group em-shell">
		<!-- wp:paragraph {"className":"em-eyebrow em-reveal","fontSize":"eyebrow"} -->
		<p class="em-eyebrow em-reveal has-eyebrow-font-size"><?php esc_html_e( 'Treatment menu', 'emerald' ); ?></p>
		<!-- /wp:paragraph -->
		<!-- wp:heading {"level":2,"className":"em-reveal"} -->
		<h2 class="wp-block-heading em-reveal"><?php esc_html_e( 'Pick the way you would like to feel.', 'emerald' ); ?></h2>
		<!-- /wp:heading -->
		<!-- wp:html -->
		<?php echo emerald_render_treatment_menu( array( 'limit' => 0 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<!-- /wp:html -->
		<!-- wp:buttons {"className":"em-reveal"} -->
		<div class="wp-block-buttons em-reveal">
			<!-- wp:button {"className":"is-style-outline"} -->
			<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'See the full menu', 'emerald' ); ?></a></div>
			<!-- /wp:button -->
		</div>
		<!-- /wp:buttons -->
	</div>
	<!-- /wp:group -->
</section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","className":"em-section em-section--specials em-section--dark","align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|xl","bottom":"var:preset|spacing|xl"}}}} -->
<section class="wp-block-group em-section em-section--specials em-section--dark" style="padding-top:var(--wp--preset--spacing--xl);padding-bottom:var(--wp--preset--spacing--xl)">
	<!-- wp:group {"className":"em-shell","layout":{"type":"constrained"}} -->
	<div class="wp-block-group em-shell">
		<!-- wp:paragraph {"className":"em-eyebrow em-reveal","fontSize":"eyebrow","textColor":"mist"} -->
		<p class="em-eyebrow em-reveal has-eyebrow-font-size has-mist-color"><?php esc_html_e( 'Running right now', 'emerald' ); ?></p>
		<!-- /wp:paragraph -->
		<!-- wp:heading {"level":2,"className":"em-reveal","textColor":"ground"} -->
		<h2 class="wp-block-heading em-reveal has-ground-color"><?php esc_html_e( 'Specials from the spa', 'emerald' ); ?></h2>
		<!-- /wp:heading -->
		<!-- wp:html -->
		<?php echo emerald_render_specials_cards(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<!-- /wp:html -->
	</div>
	<!-- /wp:group -->
</section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","className":"em-section em-section--reviews","align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|xl","bottom":"var:preset|spacing|xl"}}}} -->
<section class="wp-block-group em-section em-section--reviews" style="padding-top:var(--wp--preset--spacing--xl);padding-bottom:var(--wp--preset--spacing--xl)">
	<!-- wp:group {"className":"em-shell","layout":{"type":"constrained"}} -->
	<div class="wp-block-group em-shell">
		<!-- wp:paragraph {"className":"em-eyebrow em-reveal","fontSize":"eyebrow"} -->
		<p class="em-eyebrow em-reveal has-eyebrow-font-size"><?php esc_html_e( 'Guest words', 'emerald' ); ?></p>
		<!-- /wp:paragraph -->
		<!-- wp:heading {"level":2,"className":"em-reveal"} -->
		<h2 class="wp-block-heading em-reveal"><?php esc_html_e( '4.9 stars across 244 Google reviews.', 'emerald' ); ?></h2>
		<!-- /wp:heading -->
		<!-- wp:html -->
		<?php echo emerald_render_reviews( array( 'count' => 3 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<!-- /wp:html -->
	</div>
	<!-- /wp:group -->
</section>
<!-- /wp:group -->

<!-- wp:group {"tagName":"section","className":"em-section em-section--cta em-section--dark","align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|xl","bottom":"var:preset|spacing|xl"}}}} -->
<section class="wp-block-group em-section em-section--cta em-section--dark" style="padding-top:var(--wp--preset--spacing--xl);padding-bottom:var(--wp--preset--spacing--xl)">
	<!-- wp:group {"className":"em-shell em-cta","layout":{"type":"constrained"}} -->
	<div class="wp-block-group em-shell em-cta">
		<!-- wp:heading {"level":2,"className":"em-reveal","textAlign":"center","textColor":"ground"} -->
		<h2 class="wp-block-heading has-text-align-center em-reveal has-ground-color"><?php esc_html_e( 'Ready when you are.', 'emerald' ); ?></h2>
		<!-- /wp:heading -->
		<!-- wp:html -->
		<div class="em-hero__actions em-cta__actions em-reveal">
			<a class="em-btn em-btn--solid em-btn--lg" href="https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&amp;pId=1477270" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Book Now', 'emerald' ); ?></a>
			<a class="em-btn em-btn--ghost em-btn--lg" href="<?php echo esc_url( emerald_whatsapp_url( 'Hi Emerald Spa! I would like to book.' ) ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Message us instead', 'emerald' ); ?></a>
		</div>
		<!-- /wp:html -->
	</div>
	<!-- /wp:group -->
</section>
<!-- /wp:group -->
