<?php
/**
 * Title: Footer
 * Slug: emerald/footer
 * Categories: emerald
 * Block Types: core/template-part/footer
 * Viewport Width: 1400
 *
 * Footer: contact and hours, banking block, socials and the ambience player.
 * The popup block was removed on client order: no popups anywhere on the
 * site. The banking details are exact and may not drift.
 *
 * @package Emerald
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:group {"tagName":"footer","className":"em-footer","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|xl","bottom":"var:preset|spacing|l"}}}} -->
<footer class="wp-block-group em-footer">
        <!-- wp:group {"className":"em-shell em-footer__grid","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
        <div class="wp-block-group em-shell em-footer__grid">

                <!-- wp:group {"className":"em-footer__col em-footer__col--brand","layout":{"type":"constrained"}} -->
                <div class="wp-block-group em-footer__col em-footer__col--brand">
                        <!-- wp:html -->
                        <img class="em-footer__mark" src="<?php echo esc_url( EMERALD_URI . '/assets/img/lockup-stacked-light.png' ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" width="132" height="161" loading="lazy" decoding="async" />
                        <p class="em-footer__tagline"><?php echo esc_html( emerald_content( 'tagline' ) ?: 'Relax the body, Renew the mind, Rejuvenate the soul' ); ?></p>
                        <p class="em-footer__contact">
                                <a href="<?php echo esc_url( emerald_whatsapp_url( 'Hi Emerald Spa!' ) ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'WhatsApp the spa', 'emerald' ); ?></a>
                                <br />
                                7 Blackett Street, Windhoek North, Windhoek
                        </p>
                        <p class="em-footer__social">
                                <a href="<?php echo esc_url( emerald_content( 'social' )['facebook'] ?? 'https://www.facebook.com/p/Emerald-Spa-and-Wellness-Center-61571981360103/' ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Facebook', 'emerald' ); ?></a>
                                <span aria-hidden="true">&middot;</span>
                                <a href="<?php echo esc_url( emerald_content( 'social' )['instagram'] ?? 'https://www.instagram.com/emerald_spa_and_wellness/' ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Instagram', 'emerald' ); ?></a>
                        </p>
                        <!-- /wp:html -->
                </div>
                <!-- /wp:group -->

                <!-- wp:group {"className":"em-footer__col em-footer__col--hours","layout":{"type":"constrained"}} -->
                <div class="wp-block-group em-footer__col em-footer__col--hours">
                        <!-- wp:html -->
                        <p class="em-eyebrow"><?php esc_html_e( 'Open today', 'emerald' ); ?></p>
                        <?php echo emerald_render_hours(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                        <!-- /wp:html -->
                </div>
                <!-- /wp:group -->

                <!-- wp:group {"className":"em-footer__col em-footer__col--bank","layout":{"type":"constrained"}} -->
                <div class="wp-block-group em-footer__col em-footer__col--bank">
                        <!-- wp:html -->
                        <?php echo emerald_render_banking(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                        <!-- /wp:html -->
                </div>
                <!-- /wp:group -->
        </div>
        <!-- /wp:group -->

        <!-- wp:group {"className":"em-shell em-footer__legal","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
        <div class="wp-block-group em-shell em-footer__legal">
                <!-- wp:paragraph {"fontSize":"small"} -->
                <p class="has-small-font-size">&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?> &middot; <?php esc_html_e( 'Windhoek, Namibia', 'emerald' ); ?></p>
                <!-- /wp:paragraph -->
                <!-- wp:html -->
                <p class="em-footer__links has-small-font-size">
                        <a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>"><?php esc_html_e( 'Privacy', 'emerald' ); ?></a>
                        <span aria-hidden="true">&middot;</span>
                        <a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>"><?php esc_html_e( 'Terms', 'emerald' ); ?></a>
                        <span aria-hidden="true">&middot;</span>
                        <span class="em-footer__credit"><?php esc_html_e( 'Ambient track: Healing by Kevin MacLeod, incompetech.com, CC BY 4.0', 'emerald' ); ?></span>
                        <span aria-hidden="true">&middot;</span>
                        <span class="em-footer__madeby"><?php esc_html_e( 'Made by ', 'emerald' ); ?><a href="https://studio.tangison.com" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Tangison Studio', 'emerald' ); ?></a></span>
                </p>
                <!-- /wp:html -->
        </div>
        <!-- /wp:group -->

        <!-- wp:html -->
        <?php echo emerald_render_ambience(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
        <!-- /wp:html -->
</footer>
<!-- /wp:group -->
