<?php
/**
 * Title: Header
 * Slug: emerald/header
 * Categories: emerald
 * Block Types: core/template-part/header
 * Viewport Width: 1400
 *
 * The site header: brand, primary navigation with the server-rendered
 * Specials dropdown, and Book Now to Fresha in a new tab so the site is
 * never disturbed.
 *
 * @package Emerald
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:group {"tagName":"header","className":"em-header","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|s","bottom":"var:preset|spacing|s"}}}} -->
<header class="wp-block-group em-header">
        <a class="em-skip-link" href="#em-main"><?php echo esc_html__( 'Skip to content', 'emerald' ); ?></a>
        <!-- wp:group {"className":"em-header__inner em-shell","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"},"style":{"spacing":{"blockGap":"var:preset|spacing|m"}}} -->
        <div class="wp-block-group em-header__inner em-shell">
                <!-- wp:group {"className":"em-header__brand","layout":{"type":"flex","flexWrap":"nowrap"}} -->
                <div class="wp-block-group em-header__brand">
                        <!-- wp:site-logo {"width":44} /-->
                        <!-- wp:site-title {"level":0} /-->
                </div>
                <!-- /wp:group -->

                <!-- wp:html -->
                <nav class="em-nav" aria-label="<?php echo esc_attr__( 'Primary', 'emerald' ); ?>">
                        <button type="button" class="em-nav__burger" data-nav-toggle aria-expanded="false" aria-controls="em-primary-menu">
                                <span class="em-nav__burger-line" aria-hidden="true"></span>
                                <span class="screen-reader-text"><?php esc_html_e( 'Menu', 'emerald' ); ?></span>
                        </button>
                        <ul class="em-nav__list" id="em-primary-menu">
                                <li class="em-nav-item"><a class="em-nav-link" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'emerald' ); ?></a></li>
                                <li class="em-nav-item"><a class="em-nav-link" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'Services', 'emerald' ); ?></a></li>
                                <li class="em-nav-item"><a class="em-nav-link" href="<?php echo esc_url( home_url( '/venues/' ) ); ?>"><?php esc_html_e( 'Venues', 'emerald' ); ?></a></li>
                                <?php echo emerald_render_specials_nav(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                                <li class="em-nav-item"><a class="em-nav-link" href="<?php echo esc_url( home_url( '/gallery/' ) ); ?>"><?php esc_html_e( 'Gallery', 'emerald' ); ?></a></li>
                                <li class="em-nav-item"><a class="em-nav-link" href="<?php echo esc_url( home_url( '/team/' ) ); ?>"><?php esc_html_e( 'Team', 'emerald' ); ?></a></li>
                                <li class="em-nav-item"><a class="em-nav-link" href="<?php echo esc_url( home_url( '/visit/' ) ); ?>"><?php esc_html_e( 'Visit', 'emerald' ); ?></a></li>
                                <li class="em-nav-item em-nav-item--book">
                                        <a class="em-btn em-btn--solid em-nav-book" href="<?php echo esc_url( EMERALD_FRESHA_URL ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Book Now', 'emerald' ); ?></a>
                                </li>
                        </ul>
                </nav>
                <!-- /wp:html -->
        </div>
        <!-- /wp:group -->
</header>
<!-- /wp:group -->
