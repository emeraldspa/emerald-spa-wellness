<?php
/**
 * Emerald theme functions.
 *
 * Full-WordPress conversion of emeraldspacc.com. Design tokens come from
 * BRAND.md via theme.json. Dynamic sections (specials dropdown, promo popup,
 * ambience player) are small server-rendered blocks so an editor's change in
 * WordPress is live on the next page load with no build step and no external
 * fetch that can fail.
 *
 * @package Emerald
 * @since 1.0.0
 */

defined( 'ABSPATH' ) || exit;

define( 'EMERALD_VERSION', '1.0.0' );
define( 'EMERALD_DIR', get_template_directory() );
define( 'EMERALD_URI', get_template_directory_uri() );

/* -------------------------------------------------------------------------
 * 1. THEME SETUP
 * ---------------------------------------------------------------------- */

add_action( 'after_setup_theme', 'emerald_setup' );
/**
 * Register theme supports.
 */
function emerald_setup() {
	load_theme_textdomain( 'emerald', EMERALD_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/main.css' );

	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' )
	);

	add_theme_support(
		'custom-logo',
		array(
			'height'      => 204,
			'width'       => 168,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	add_image_size( 'emerald-card', 640, 480, true );
	add_image_size( 'emerald-wide', 1600, 900, true );

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'emerald' ),
			'footer'  => __( 'Footer Menu', 'emerald' ),
		)
	);
}

add_action( 'after_setup_theme', 'emerald_content_width', 0 );
/**
 * Content width.
 */
function emerald_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'emerald_content_width', 1200 );
}

/* -------------------------------------------------------------------------
 * 2. ASSETS
 * ---------------------------------------------------------------------- */

add_action( 'wp_enqueue_scripts', 'emerald_enqueue_assets' );
/**
 * Front-end assets. One stylesheet, one deferred script, preloaded fonts.
 */
function emerald_enqueue_assets() {
	wp_enqueue_style( 'emerald-main', EMERALD_URI . '/assets/css/main.css', array(), EMERALD_VERSION );
	wp_style_add_data( 'emerald-main', 'rtl', 'replace' );

	wp_enqueue_script( 'emerald-main', EMERALD_URI . '/assets/js/main.js', array(), EMERALD_VERSION, true );
	wp_script_add_data( 'emerald-main', 'defer', true );

	wp_localize_script(
		'emerald-main',
		'EmeraldData',
		array(
			'youtubeId'   => 'Q5u2Ddbvocc',
			'reduced'     => (bool) apply_filters( 'emerald_reduced_motion_default', false ),
			'bookingUrl'  => 'https://www.fresha.com/book-now/emerald-spa-wellness-centre-qnp9ba1m/all-offer?share=true&pId=1477270',
		)
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}

add_action( 'wp_head', 'emerald_preload_assets', 1 );
/**
 * Preload the two fonts that paint the hero, before CSS arrives.
 */
function emerald_preload_assets() {
	$fonts = array(
		EMERALD_URI . '/assets/fonts/radley-400.woff2'  => 'font/woff2',
		EMERALD_URI . '/assets/fonts/poppins-400.woff2' => 'font/woff2',
	);
	foreach ( $fonts as $url => $type ) {
		printf(
			'<link rel="preload" href="%s" as="font" type="%s" crossorigin>' . "\n",
			esc_url( $url ),
			esc_attr( $type )
		);
	}
}

add_filter( 'body_class', 'emerald_body_class' );
/**
 * Page slug body classes for per-section styling.
 *
 * @param array $classes Body classes.
 */
function emerald_body_class( $classes ) {
	if ( is_front_page() ) {
		$classes[] = 'emerald-home';
	}
	if ( is_page( array( 'services', 'specials', 'venues' ) ) ) {
		$classes[] = 'emerald-menu-page';
	}
	return $classes;
}

/* -------------------------------------------------------------------------
 * 3. CONTENT HELPERS
 * ---------------------------------------------------------------------- */

/**
 * Read a section of the bundled content JSON (the parity snapshot of the
 * headless era: treatment menu, team, reviews, hours, contact). Used as the
 * deterministic fallback wherever a matching WordPress content type has no
 * published rows yet.
 *
 * @param string $key Top-level key in emerald-content.json.
 * @return mixed
 */
function emerald_content( $key ) {
	static $data = null;
	if ( null === $data ) {
		$file = EMERALD_DIR . '/assets/data/emerald-content.json';
		$data = file_exists( $file ) ? json_decode( (string) file_get_contents( $file ), true ) : array();
		if ( ! is_array( $data ) ) {
			$data = array();
		}
	}
	return isset( $data[ $key ] ) ? $data[ $key ] : array();
}

/**
 * Every published promotion running today, newest first.
 *
 * Mirrors the headless contract: a promotion with no dates is always on;
 * slugs starting with demo- never reach the site; the ACF fields price_nad,
 * duration, starts_on / valid_until (or ends_on) and show_as_popup carry the
 * card details. Fail-open: an empty result is a valid result.
 *
 * @return array[] Each item: id, slug, title, excerpt, permalink, image, image_alt, price_nad, duration, show_as_popup.
 */
function emerald_get_active_promotions() {
	$query = new WP_Query(
		array(
			'post_type'           => 'promotion',
			'post_status'         => 'publish',
			'posts_per_page'      => 20,
			'orderby'             => 'date',
			'order'               => 'DESC',
			'no_found_rows'       => true,
			'ignore_sticky_posts' => true,
			'update_post_term_cache' => false,
		)
	);

	$today = gmdate( 'Y-m-d' );
	$items = array();

	if ( $query->have_posts() ) {
		foreach ( $query->posts as $post ) {
			if ( 0 === strpos( (string) $post->post_name, 'demo-' ) ) {
				continue;
			}

			$starts_on = (string) get_post_meta( $post->ID, 'starts_on', true );
			$ends_on   = (string) get_post_meta( $post->ID, 'valid_until', true );
			if ( '' === $ends_on ) {
				$ends_on = (string) get_post_meta( $post->ID, 'ends_on', true );
			}
			if ( '' !== $starts_on && $starts_on > $today ) {
				continue;
			}
			if ( '' !== $ends_on && $ends_on < $today ) {
				continue;
			}

			$price = get_post_meta( $post->ID, 'price_nad', true );
			$image = get_the_post_thumbnail_url( $post, 'emerald-card' );

			$items[] = array(
				'id'            => $post->ID,
				'slug'          => $post->post_name,
				'title'         => get_the_title( $post ),
				'excerpt'       => wp_strip_all_tags( (string) $post->post_excerpt ),
				'permalink'     => get_permalink( $post ),
				'image'         => $image ? $image : '',
				'image_alt'     => get_post_meta( get_post_thumbnail_id( $post ), '_wp_attachment_image_alt', true ),
				'price_nad'     => ( '' !== $price && is_numeric( $price ) ) ? (int) $price : null,
				'duration'      => (string) get_post_meta( $post->ID, 'duration', true ),
				'show_as_popup' => (bool) get_post_meta( $post->ID, 'show_as_popup', true ),
			);
		}
	}
	wp_reset_postdata();

	return $items;
}

/**
 * The one promotion, if any, flagged to interrupt the visitor.
 *
 * @return array|null
 */
function emerald_get_popup_promotion() {
	foreach ( emerald_get_active_promotions() as $item ) {
		if ( ! empty( $item['show_as_popup'] ) ) {
			return $item;
		}
	}
	return null;
}

/* -------------------------------------------------------------------------
 * 4. SERVER-RENDERED BLOCKS
 * ---------------------------------------------------------------------- */

require_once EMERALD_DIR . '/inc/blocks.php';

/* -------------------------------------------------------------------------
 * 5. EDITOR-FRIENDLY DEFAULTS
 * ---------------------------------------------------------------------- */

add_filter( 'excerpt_length', fn() => 24 );
add_filter( 'excerpt_more', fn() => '&hellip;' );
