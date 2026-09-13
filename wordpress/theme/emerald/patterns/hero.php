<?php
/**
 * Title: Hero with deferred reel
 * Slug: emerald/hero
 * Categories: emerald
 * Keywords: hero, video, welcome
 * Viewport Width: 1400
 *
 * Full-bleed hero. The poster paints instantly; the 22.4s VP9/WebM reel is
 * attached by main.js after window load and skipped entirely under reduced
 * motion or Data Saver, so the LCP element is always the poster or the text.
 *
 * @package Emerald
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:group {"tagName":"section","className":"em-hero","align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"0","bottom":"0"}}}} -->
<section class="wp-block-group em-hero">
        <!-- wp:html -->
        <div class="em-hero__media" data-hero data-poster="<?php echo esc_url( EMERALD_URI . '/assets/img/hero-poster-1600.jpg' ); ?>" data-video-desktop="<?php echo esc_url( EMERALD_URI . '/assets/video/hero-desktop.webm' ); ?>" data-video-mobile="<?php echo esc_url( EMERALD_URI . '/assets/video/hero-mobile.webm' ); ?>">
                <img class="em-hero__poster" src="<?php echo esc_url( EMERALD_URI . '/assets/img/hero-poster-1600.jpg' ); ?>" alt="<?php esc_attr_e( 'The treatment suite at Emerald Spa and Wellness Centre', 'emerald' ); ?>" width="1600" height="900" fetchpriority="high" decoding="async" />
                <span class="em-hero__veil" aria-hidden="true"></span>
        </div>
        <!-- /wp:html -->

        <!-- wp:group {"className":"em-shell em-hero__inner","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|xxl","bottom":"var:preset|spacing|xxl"}}}} -->
        <div class="wp-block-group em-shell em-hero__inner" style="padding-top:var(--wp--preset--spacing--xxl);padding-bottom:var(--wp--preset--spacing--xxl)">
                <!-- wp:paragraph {"className":"em-eyebrow em-reveal","fontSize":"eyebrow","textColor":"mist"} -->
                <p class="em-eyebrow em-reveal has-eyebrow-font-size has-mist-color"><?php esc_html_e( 'Windhoek North, Namibia', 'emerald' ); ?></p>
                <!-- /wp:paragraph -->

                <!-- wp:heading {"level":1,"className":"em-hero__title em-reveal","textColor":"ground","fontSize":"display"} -->
                <h1 class="wp-block-heading em-hero__title em-reveal has-ground-color has-display-font-size"><?php esc_html_e( 'A refined retreat where calm sets the tone.', 'emerald' ); ?></h1>
                <!-- /wp:heading -->

                <!-- wp:paragraph {"className":"em-hero__lead em-reveal","align":"left","textColor":"mist","fontSize":"large"} -->
                <p class="em-hero__lead em-reveal has-text-align-left has-large-font-size has-mist-color"><?php esc_html_e( 'Every detail is designed to help you slow down, feel cared for, and reconnect. From serene indoor suites to our peaceful garden escape, this is a place to exhale, restore, and leave feeling renewed in both body and mind.', 'emerald' ); ?></p>
                <!-- /wp:paragraph -->

                <!-- wp:html -->
                <div class="em-hero__actions em-reveal">
                        <a class="em-btn em-btn--solid em-btn--lg" href="https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&amp;pId=1477270" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Book Now', 'emerald' ); ?></a>
                        <a class="em-btn em-btn--ghost em-btn--lg" href="<?php echo esc_url( emerald_whatsapp_url( 'Hi Emerald Spa! I would like to plan a visit.' ) ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Ask on WhatsApp', 'emerald' ); ?></a>
                </div>
                <!-- /wp:html -->

                <!-- wp:html -->
                <dl class="em-hero__stats em-reveal">
                        <div><dt>4.9</dt><dd><?php esc_html_e( 'Google rating', 'emerald' ); ?></dd></div>
                        <div><dt>90+</dt><dd><?php esc_html_e( 'listed treatments', 'emerald' ); ?></dd></div>
                        <div><dt>6</dt><dd><?php esc_html_e( 'days a week, and Sunday mornings', 'emerald' ); ?></dd></div>
                </dl>
                <!-- /wp:html -->
        </div>
        <!-- /wp:group -->
</section>
<!-- /wp:group -->
