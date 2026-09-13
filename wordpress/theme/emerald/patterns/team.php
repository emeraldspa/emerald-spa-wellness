<?php
/**
 * Title: Team section
 * Slug: emerald/team
 * Categories: emerald
 * Keywords: team, staff
 * Viewport Width: 1400
 *
 * @package Emerald
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:group {"tagName":"section","className":"em-section em-section--team","align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|l","bottom":"var:preset|spacing|xl"}}}} -->
<section class="wp-block-group em-section em-section--team" style="padding-top:var(--wp--preset--spacing--l);padding-bottom:var(--wp--preset--spacing--xl)">
	<!-- wp:group {"className":"em-shell","layout":{"type":"constrained"}} -->
	<div class="wp-block-group em-shell">
		<!-- wp:paragraph {"className":"em-eyebrow em-reveal","fontSize":"eyebrow"} -->
		<p class="em-eyebrow em-reveal has-eyebrow-font-size"><?php esc_html_e( 'The people', 'emerald' ); ?></p>
		<!-- /wp:paragraph -->
		<!-- wp:heading {"level":2,"className":"em-reveal"} -->
		<h2 class="wp-block-heading em-reveal"><?php esc_html_e( 'Hands you will be glad to meet.', 'emerald' ); ?></h2>
		<!-- /wp:heading -->
		<!-- wp:html -->
		<?php echo emerald_render_team_grid(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<!-- /wp:html -->
	</div>
	<!-- /wp:group -->
</section>
<!-- /wp:group -->
