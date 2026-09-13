<?php
/**
 * Server-rendered blocks for the Emerald theme.
 *
 * Each block renders real WordPress content (promotions, treatments, team,
 * testimonials) and falls back to the bundled parity snapshot when a content
 * type has no published rows. Everything is escaped on output and fails
 * open: an empty WordPress section renders an empty section, never an error.
 *
 * @package Emerald
 */

defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * Registration
 * ---------------------------------------------------------------------- */

add_action( 'init', 'emerald_register_blocks' );
/**
 * Register the server-rendered blocks used by templates and patterns.
 */
function emerald_register_blocks() {
        $blocks = array(
                'emerald/specials-nav'   => array(
                        'render_callback' => 'emerald_render_specials_nav',
                ),
                'emerald/specials-cards' => array(
                        'render_callback' => 'emerald_render_specials_cards',
                ),
                'emerald/popup'          => array(
                        'render_callback' => 'emerald_render_popup',
                ),
                'emerald/ambience'       => array(
                        'render_callback' => 'emerald_render_ambience',
                ),
                'emerald/treatment-menu' => array(
                        'render_callback' => 'emerald_render_treatment_menu',
                        'attributes'      => array(
                                'limit' => array( 'type' => 'number', 'default' => 0 ),
                        ),
                ),
                'emerald/team-grid'      => array(
                        'render_callback' => 'emerald_render_team_grid',
                ),
                'emerald/reviews'        => array(
                        'render_callback' => 'emerald_render_reviews',
                        'attributes'      => array(
                                'count' => array( 'type' => 'number', 'default' => 3 ),
                        ),
                ),
                'emerald/hours'          => array(
                        'render_callback' => 'emerald_render_hours',
                ),
                'emerald/banking'        => array(
                        'render_callback' => 'emerald_render_banking',
                ),
        );

        foreach ( $blocks as $name => $args ) {
                if ( ! isset( $args['attributes'] ) ) {
                        $args['attributes'] = array();
                }
                register_block_type( $name, $args );
        }
}

/* -------------------------------------------------------------------------
 * Shared card markup
 * ---------------------------------------------------------------------- */

/**
 * One promotion card.
 *
 * @param array $item Promotion item from emerald_get_active_promotions().
 */
function emerald_promo_card( $item ) {
        ?>
        <article class="em-card em-card--promo" id="special-<?php echo esc_attr( $item['slug'] ); ?>">
                <?php if ( ! empty( $item['image'] ) ) : ?>
                        <figure class="em-card__media">
                                <img src="<?php echo esc_url( $item['image'] ); ?>" alt="<?php echo esc_attr( $item['image_alt'] ); ?>" width="640" height="480" loading="lazy" decoding="async" />
                        </figure>
                <?php endif; ?>
                <div class="em-card__body">
                        <h3 class="em-card__title"><?php echo esc_html( $item['title'] ); ?></h3>
                        <?php if ( '' !== (string) $item['duration'] || null !== $item['price_nad'] ) : ?>
                                <p class="em-card__meta">
                                        <?php if ( '' !== (string) $item['duration'] ) : ?>
                                                <span><?php echo esc_html( $item['duration'] ); ?></span>
                                        <?php endif; ?>
                                        <?php if ( null !== $item['price_nad'] ) : ?>
                                                <strong><?php echo esc_html( emerald_format_nad( (int) $item['price_nad'] ) ); ?></strong>
                                        <?php endif; ?>
                                </p>
                        <?php endif; ?>
                        <?php if ( '' !== (string) $item['excerpt'] ) : ?>
                                <p class="em-card__text"><?php echo esc_html( wp_trim_words( $item['excerpt'], 28 ) ); ?></p>
                        <?php endif; ?>
                        <div class="em-card__actions">
                                <a class="em-btn em-btn--solid" href="<?php echo esc_url( 'https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&pId=1477270' ); ?>" target="_blank" rel="noopener noreferrer">Book Now</a>
                                <a class="em-btn em-btn--ghost em-wa-enquire"
                                        href="<?php echo esc_url( emerald_whatsapp_url( 'Hi Emerald Spa! I am interested in the special: ' . $item['title'] . '.' ) ); ?>"
                                        target="_blank" rel="noopener noreferrer">Enquire on WhatsApp</a>
                        </div>
                </div>
        </article>
        <?php
}

/**
 * NAD price formatter matching the headless site (NAD 1,700).
 *
 * @param int $value Price.
 */
function emerald_format_nad( $value ) {
        return 'NAD ' . number_format_i18n( (int) $value );
}

/**
 * WhatsApp deep link with a prefilled message.
 *
 * @param string $message Message text.
 */
function emerald_whatsapp_url( $message = '' ) {
        $number = '264856077143';
        $url    = 'https://wa.me/' . $number;
        if ( '' !== $message ) {
                $url .= '?text=' . rawurlencode( $message );
        }
        return $url;
}

/* -------------------------------------------------------------------------
 * 1. Header specials dropdown
 * ---------------------------------------------------------------------- */

/**
 * The Specials dropdown for the header. Server-rendered so the items exist
 * in the HTML on first paint - there is no fetch to fail, which was the
 * headless era's weak point.
 */
function emerald_render_specials_nav() {
        $items  = emerald_get_active_promotions();
        $anchor = is_page( 'specials' ) ? '#special-' : home_url( '/specials#special-' );
        ob_start();
        ?>
        <div class="em-nav-item em-dropdown" data-dropdown>
                <button type="button" class="em-nav-link em-dropdown__toggle" aria-expanded="false" aria-haspopup="true">
                        <?php esc_html_e( 'Specials', 'emerald' ); ?>
                        <svg class="em-dropdown__caret" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true" focusable="false"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                </button>
                <div class="em-dropdown__panel" role="menu" hidden>
                        <?php if ( ! empty( $items ) ) : ?>
                                <?php foreach ( $items as $item ) : ?>
                                        <a role="menuitem" href="<?php echo esc_url( $anchor . $item['slug'] ); ?>">
                                                <span class="em-dropdown__label"><?php echo esc_html( $item['title'] ); ?></span>
                                                <?php if ( null !== $item['price_nad'] ) : ?>
                                                        <span class="em-dropdown__price"><?php echo esc_html( emerald_format_nad( (int) $item['price_nad'] ) ); ?></span>
                                                <?php endif; ?>
                                        </a>
                                <?php endforeach; ?>
                        <?php endif; ?>
                        <a role="menuitem" href="<?php echo esc_url( home_url( '/specials/' ) ); ?>" class="em-dropdown__all">
                                <?php esc_html_e( 'See all specials', 'emerald' ); ?>
                        </a>
                </div>
        </div>
        <?php
        return trim( ob_get_clean() );
}

/* -------------------------------------------------------------------------
 * 2. Specials page card grid
 * ---------------------------------------------------------------------- */

/**
 * All running specials as cards.
 */
function emerald_render_specials_cards() {
        $items = emerald_get_active_promotions();
        if ( empty( $items ) ) {
                return '<p class="em-empty">' . esc_html__( 'New specials are being prepared. Please check back soon, or ask us on WhatsApp.', 'emerald' ) . '</p>';
        }
        ob_start();
        echo '<div class="em-cards em-cards--specials">';
        foreach ( $items as $item ) {
                emerald_promo_card( $item );
        }
        echo '</div>';
        return trim( ob_get_clean() );
}

/* -------------------------------------------------------------------------
 * 3. Promo popup
 * ---------------------------------------------------------------------- */

/**
 * The interrupting popup for a promotion flagged show_as_popup. Markup only;
 * main.js handles the focus trap, Escape and the once-per-day dismissal.
 */
function emerald_render_popup() {
        $promo = emerald_get_popup_promotion();
        if ( ! $promo ) {
                return '';
        }
        ob_start();
        ?>
        <div class="em-popup" id="emerald-popup" role="dialog" aria-modal="true" aria-labelledby="emerald-popup-title" hidden data-popup>
                <div class="em-popup__backdrop" data-popup-close></div>
                <div class="em-popup__card" role="document">
                        <button type="button" class="em-popup__close" data-popup-close aria-label="<?php esc_attr_e( 'Close special offer', 'emerald' ); ?>">&times;</button>
                        <?php if ( ! empty( $promo['image'] ) ) : ?>
                                <img class="em-popup__image" src="<?php echo esc_url( $promo['image'] ); ?>" alt="<?php echo esc_attr( $promo['image_alt'] ); ?>" width="640" height="480" decoding="async" />
                        <?php endif; ?>
                        <p class="em-eyebrow"><?php esc_html_e( 'Current special', 'emerald' ); ?></p>
                        <h2 id="emerald-popup-title" class="em-popup__title"><?php echo esc_html( $promo['title'] ); ?></h2>
                        <?php if ( '' !== (string) $promo['duration'] || null !== $promo['price_nad'] ) : ?>
                                <p class="em-popup__meta">
                                        <?php if ( '' !== (string) $promo['duration'] ) : ?>
                                                <span><?php echo esc_html( $promo['duration'] ); ?></span>
                                        <?php endif; ?>
                                        <?php if ( null !== $promo['price_nad'] ) : ?>
                                                <strong><?php echo esc_html( emerald_format_nad( (int) $promo['price_nad'] ) ); ?></strong>
                                        <?php endif; ?>
                                </p>
                        <?php endif; ?>
                        <?php if ( '' !== (string) $promo['excerpt'] ) : ?>
                                <p class="em-popup__text"><?php echo esc_html( wp_trim_words( $promo['excerpt'], 36 ) ); ?></p>
                        <?php endif; ?>
                        <div class="em-popup__actions">
                                <a class="em-btn em-btn--solid" href="<?php echo esc_url( 'https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&pId=1477270' ); ?>" target="_blank" rel="noopener noreferrer">Book Now</a>
                                <a class="em-btn em-btn--ghost" href="<?php echo esc_url( $promo['permalink'] ); ?>"><?php esc_html_e( 'View details', 'emerald' ); ?></a>
                        </div>
                </div>
        </div>
        <?php
        return trim( ob_get_clean() );
}

/* -------------------------------------------------------------------------
 * 4. Ambience player
 * ---------------------------------------------------------------------- */

/**
 * The site-wide ambience widget. The player is a facade: nothing loads from
 * YouTube until a visitor opts in, then the track starts muted with a
 * always-visible mute control (48px minimum touch target).
 */
function emerald_render_ambience() {
        ob_start();
        ?>
        <div class="em-ambience" data-ambience data-video-id="Q5u2Ddbvocc">
                <div class="em-ambience__panel" hidden>
                        <div class="em-ambience__frame" data-ambience-frame></div>
                        <p class="em-ambience__note"><?php esc_html_e( 'Ambient music, playing softly', 'emerald' ); ?></p>
                </div>
                <button type="button" class="em-ambience__toggle" data-ambience-toggle aria-pressed="false" aria-label="<?php esc_attr_e( 'Turn ambient music on or off', 'emerald' ); ?>">
                        <span class="em-ambience__icon" aria-hidden="true">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                        </span>
                        <span class="em-ambience__state" data-ambience-state><?php esc_html_e( 'Music', 'emerald' ); ?></span>
                </button>
        </div>
        <?php
        return trim( ob_get_clean() );
}

/* -------------------------------------------------------------------------
 * 5. Treatment menu
 * ---------------------------------------------------------------------- */

/**
 * The priced treatment menu. Source of truth is the `treatment` content
 * type when it has published rows (category term = section); otherwise the
 * bundled parity snapshot keeps the page identical to today.
 *
 * @param array $attributes Block attributes.
 */
function emerald_render_treatment_menu( $attributes ) {
        $limit = isset( $attributes['limit'] ) ? absint( $attributes['limit'] ) : 0;

        $sections = array();

        $wp_sections = emerald_treatment_sections_from_wp();
        if ( ! empty( $wp_sections ) ) {
                $sections = $wp_sections;
        } else {
                foreach ( emerald_content( 'categories' ) as $category ) {
                        $sections[] = array(
                                'name'  => (string) ( $category['name'] ?? '' ),
                                'blurb' => '',
                                'items' => (array) ( $category['items'] ?? array() ),
                        );
                }
        }

        if ( $limit > 0 && count( $sections ) > $limit ) {
                $sections = array_slice( $sections, 0, $limit );
        }

        ob_start();
        echo '<div class="em-menu">';
        foreach ( $sections as $section ) {
                if ( empty( $section['items'] ) ) {
                        continue;
                }
                printf( '<h3 class="em-menu__cat" id="%s">%s</h3>', esc_attr( sanitize_title( $section['name'] ) ), esc_html( $section['name'] ) );
                if ( '' !== (string) ( $section['blurb'] ?? '' ) ) {
                        echo '<p class="em-menu__blurb">' . esc_html( $section['blurb'] ) . '</p>';
                }
                echo '<ul class="em-menu__list">';
                foreach ( $section['items'] as $item ) {
                        ?>
                        <li class="em-menu__item">
                                <div class="em-menu__head">
                                        <span class="em-menu__name"><?php echo esc_html( $item['name'] ); ?></span>
                                        <span class="em-menu__dots" aria-hidden="true"></span>
                                        <span class="em-menu__price"><?php echo esc_html( $item['price'] ); ?></span>
                                </div>
                                <p class="em-menu__meta"><?php echo esc_html( $item['duration'] ); ?></p>
                                <?php if ( ! empty( $item['description'] ) ) : ?>
                                        <p class="em-menu__desc"><?php echo esc_html( wp_trim_words( (string) $item['description'], 40 ) ); ?></p>
                                <?php endif; ?>
                                <?php if ( ! empty( $item['variants'] ) && count( $item['variants'] ) > 1 ) : ?>
                                        <ul class="em-menu__variants">
                                                <?php foreach ( $item['variants'] as $variant ) : ?>
                                                        <li><span><?php echo esc_html( $variant['name'] ); ?></span><span><?php echo esc_html( $variant['duration'] ); ?></span><strong><?php echo esc_html( $variant['price'] ); ?></strong></li>
                                                <?php endforeach; ?>
                                        </ul>
                                <?php endif; ?>
                        </li>
                        <?php
                }
                echo '</ul>';
        }
        echo '<div class="em-menu__cta"><a class="em-btn em-btn--solid" href="https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&pId=1477270" target="_blank" rel="noopener noreferrer">Book Now</a></div>';
        echo '</div>';
        return trim( ob_get_clean() );
}

/**
 * Treatment sections straight from the `treatment` content type, if any.
 *
 * @return array[] Empty when the content type has no published rows.
 */
function emerald_treatment_sections_from_wp() {
        if ( ! post_type_exists( 'treatment' ) ) {
                return array();
        }
        $query = new WP_Query(
                array(
                        'post_type'           => 'treatment',
                        'post_status'         => 'publish',
                        'posts_per_page'      => 200,
                        'orderby'             => 'menu_order title',
                        'order'               => 'ASC',
                        'no_found_rows'       => true,
                        'ignore_sticky_posts' => true,
                )
        );
        if ( ! $query->have_posts() ) {
                return array();
        }

        $sections = array();
        foreach ( $query->posts as $post ) {
                $terms = get_the_terms( $post, 'treatment_category' );
                $cat   = ( $terms && ! is_wp_error( $terms ) ) ? $terms[0]->name : __( 'Treatments', 'emerald' );
                $price = get_post_meta( $post->ID, 'price_nad', true );
                $dur   = get_post_meta( $post->ID, 'duration', true );
                $sections[ $cat ]        = isset( $sections[ $cat ] ) ? $sections[ $cat ] : array(
                        'name'  => $cat,
                        'blurb' => '',
                        'items' => array(),
                );
                $sections[ $cat ]['items'][] = array(
                        'name'        => get_the_title( $post ),
                        'duration'    => $dur ? $dur : '',
                        'price'       => $price ? emerald_format_nad( (int) $price ) : '',
                        'description' => wp_strip_all_tags( (string) $post->post_excerpt ),
                        'variants'    => array(),
                );
        }
        wp_reset_postdata();

        return array_values( $sections );
}

/* -------------------------------------------------------------------------
 * 6. Team grid
 * ---------------------------------------------------------------------- */

/**
 * The team. Uses the bundled snapshot (roles verified 10 Sep 2026:
 * Laurensia Post = Spa Manager, Merie-Ann (Lulu) = Spa Therapist) until
 * staff entries are published in WordPress.
 */
function emerald_render_team_grid() {
        $members = emerald_content( 'team' );
        ob_start();
        echo '<div class="em-team">';
        foreach ( $members as $member ) {
                ?>
                <article class="em-team__card">
                        <div class="em-team__photo">
                                <?php echo wp_kses_post( emerald_team_photo( $member['name'] ?? '' ) ); ?>
                        </div>
                        <h3 class="em-team__name"><?php echo esc_html( $member['name'] ?? '' ); ?></h3>
                        <p class="em-team__role"><?php echo esc_html( $member['role'] ?? '' ); ?></p>
                        <?php if ( ! empty( $member['bio'] ) ) : ?>
                                <p class="em-team__bio"><?php echo esc_html( wp_trim_words( (string) $member['bio'], 34 ) ); ?></p>
                        <?php endif; ?>
                </article>
                <?php
        }
        echo '</div>';
        return trim( ob_get_clean() );
}

/**
 * Photo markup for a team member from the bundled image map.
 *
 * @param string $name Member name.
 */
function emerald_team_photo( $name ) {
        $map = array(
                'Laurensia Post'    => array( 'file' => 'team-laurensia-640.webp', 'w' => 320, 'h' => 240 ),
                'Merie-Ann (Lulu)'  => array( 'file' => 'team-merie-ann-lulu-640.webp', 'w' => 320, 'h' => 240 ),
                'Daivienn'          => array( 'file' => 'team-daivienn-640.webp', 'w' => 320, 'h' => 240 ),
                'Diana'             => array( 'file' => 'team-diana-640.webp', 'w' => 320, 'h' => 240 ),
                'Evelyne Mulilo'    => array( 'file' => 'ceo-evelyne-mulilo-1440.webp', 'w' => 320, 'h' => 240 ),
                'Olakunle Jolaiya'  => array( 'file' => 'team-emerald-spa-320.webp', 'w' => 320, 'h' => 240 ),
        );
        if ( ! isset( $map[ $name ] ) ) {
                $initials = mb_strtoupper( mb_substr( preg_replace( '/[^A-Za-z ]/', '', (string) $name ), 0, 1 ) );
                return '<span class="em-team__initials" aria-hidden="true">' . esc_html( $initials ) . '</span>';
        }
        $file = $map[ $name ];
        $src  = EMERALD_URI . '/assets/img/team/' . $file['file'];
        return sprintf(
                '<img src="%s" alt="%s" width="%d" height="%d" loading="lazy" decoding="async" />',
                esc_url( $src ),
                esc_attr( $name . ', Emerald Spa team member' ),
                (int) $file['w'],
                (int) $file['h']
        );
}

/* -------------------------------------------------------------------------
 * 7. Guest reviews
 * ---------------------------------------------------------------------- */

/**
 * Guest reviews. Testimonial content type first, bundled snapshot second.
 *
 * @param array $attributes Block attributes.
 */
function emerald_render_reviews( $attributes ) {
        $count = isset( $attributes['count'] ) ? max( 1, absint( $attributes['count'] ) ) : 3;
        $items = array();

        if ( post_type_exists( 'testimonial' ) ) {
                $query = new WP_Query(
                        array(
                                'post_type'           => 'testimonial',
                                'post_status'         => 'publish',
                                'posts_per_page'      => $count,
                                'no_found_rows'       => true,
                                'ignore_sticky_posts' => true,
                        )
                );
                foreach ( $query->posts as $post ) {
                        $items[] = array(
                                'text'   => wp_strip_all_tags( (string) $post->post_content ),
                                'author' => get_the_title( $post ),
                        );
                }
                wp_reset_postdata();
        }

        if ( empty( $items ) ) {
                $items = array_slice( emerald_content( 'reviews' ), 0, $count );
        }

        ob_start();
        echo '<div class="em-reviews">';
        foreach ( $items as $review ) {
                ?>
                <figure class="em-review">
                        <blockquote class="em-review__text"><?php echo esc_html( wp_trim_words( (string) $review['text'], 44 ) ); ?></blockquote>
                        <figcaption class="em-review__author"><?php echo esc_html( $review['author'] ?? '' ); ?></figcaption>
                </figure>
                <?php
        }
        echo '</div>';
        return trim( ob_get_clean() );
}

/* -------------------------------------------------------------------------
 * 8. Opening hours
 * ---------------------------------------------------------------------- */

/**
 * Opening hours list, today's row highlighted.
 */
function emerald_render_hours() {
        $hours = emerald_content( 'hours' );
        $today = gmdate( 'l' );
        ob_start();
        echo '<ul class="em-hours">';
        foreach ( $hours as $row ) {
                $is_today = ( 0 === strcasecmp( (string) $row['day'], $today ) );
                printf(
                        '<li class="em-hours__row%1$s"><span class="em-hours__day">%2$s</span><span class="em-hours__dots" aria-hidden="true"></span><span class="em-hours__time">%3$s</span></li>',
                        $is_today ? ' is-today' : '',
                        esc_html( $row['day'] ),
                        esc_html( $row['value'] )
                );
        }
        echo '</ul>';
        return trim( ob_get_clean() );
}

/* -------------------------------------------------------------------------
 * 9. Banking block
 * ---------------------------------------------------------------------- */

/**
 * The banking block (footer / pay page). Exact account details, unchanged.
 */
function emerald_render_banking() {
        $wa = emerald_whatsapp_url( 'Hi Emerald Spa! Here is my proof of payment.' );
        ob_start();
        ?>
        <div class="em-bank">
                <p class="em-eyebrow"><?php esc_html_e( 'Banking details', 'emerald' ); ?></p>
                <dl class="em-bank__list">
                        <div><dt><?php esc_html_e( 'Account name', 'emerald' ); ?></dt><dd><?php esc_html_e( 'Emerald Spa Gold Business', 'emerald' ); ?></dd></div>
                        <div><dt><?php esc_html_e( 'Bank', 'emerald' ); ?></dt><dd><?php esc_html_e( 'FNB (First National Bank)', 'emerald' ); ?></dd></div>
                        <div><dt><?php esc_html_e( 'Account number', 'emerald' ); ?></dt><dd><?php esc_html_e( '64287404716', 'emerald' ); ?></dd></div>
                        <div><dt><?php esc_html_e( 'Branch', 'emerald' ); ?></dt><dd><?php esc_html_e( 'Maerua Mall, 282273', 'emerald' ); ?></dd></div>
                        <div><dt><?php esc_html_e( 'Reference', 'emerald' ); ?></dt><dd><?php esc_html_e( 'Please use your full name as the payment reference.', 'emerald' ); ?></dd></div>
                        <div><dt><?php esc_html_e( 'Mobile wallet', 'emerald' ); ?></dt><dd><?php esc_html_e( '081 607 7143', 'emerald' ); ?></dd></div>
                </dl>
                <p class="em-bank__note">
                        <?php esc_html_e( 'Send your proof of payment to us on WhatsApp', 'emerald' ); ?>
                        <a href="<?php echo esc_url( $wa ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'via WhatsApp', 'emerald' ); ?></a>.
                </p>
        </div>
        <?php
        return trim( ob_get_clean() );
}
