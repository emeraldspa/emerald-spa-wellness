<?php
/**
 * Plugin Name: Emerald Core
 * Description: Content types plus the SEO head module for emeraldspacc.com: canonical, Open Graph, Twitter cards, meta description and the DaySpa JSON-LD schema (values ported from the audited headless build). Free custom code only.
 * Version:     1.1.0
 * Author:      Emerald Webmaster
 * License:     GPL-2.0-or-later
 * Text Domain: emerald-core
 */

defined( 'ABSPATH' ) || exit;

define( 'EMERALD_CORE_URL', plugin_dir_url( __FILE__ ) );

add_action( 'init', 'emerald_core_register_post_types', 5 );
/**
 * Register the Emerald content types, guarded: a type that already exists
 * (registered by another plugin on the live install) is left untouched so
 * ACF field groups and REST exposure stay exactly as they are.
 */
function emerald_core_register_post_types() {

	if ( ! post_type_exists( 'promotion' ) ) {
		register_post_type(
			'promotion',
			array(
				'labels'          => array(
					'name'          => __( 'Specials', 'emerald-core' ),
					'singular_name' => __( 'Special', 'emerald-core' ),
					'add_new_item'  => __( 'Add a special', 'emerald-core' ),
					'edit_item'     => __( 'Edit special', 'emerald-core' ),
					'menu_name'     => __( 'Specials', 'emerald-core' ),
				),
				'public'          => true,
				'menu_icon'       => 'dashicons-megaphone',
				'menu_position'   => 21,
				'supports'        => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ),
				'has_archive'     => false,
				'show_in_rest'    => true,
				'rewrite'         => array( 'slug' => 'special' ),
			)
		);
	}

	if ( ! post_type_exists( 'treatment' ) ) {
		register_post_type(
			'treatment',
			array(
				'labels'          => array(
					'name'          => __( 'Treatments', 'emerald-core' ),
					'singular_name' => __( 'Treatment', 'emerald-core' ),
					'menu_name'     => __( 'Treatments', 'emerald-core' ),
				),
				'public'          => true,
				'menu_icon'       => 'dashicons-awards',
				'menu_position'   => 22,
				'supports'        => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'custom-fields' ),
				'has_archive'     => false,
				'show_in_rest'    => true,
				'rewrite'         => array( 'slug' => 'treatment' ),
			)
		);
		register_taxonomy(
			'treatment_category',
			'treatment',
			array(
				'labels'       => array(
					'name'          => __( 'Treatment categories', 'emerald-core' ),
					'singular_name' => __( 'Treatment category', 'emerald-core' ),
				),
				'hierarchical' => true,
				'show_in_rest' => true,
				'rewrite'      => array( 'slug' => 'treatments' ),
			)
		);
	}

	if ( ! post_type_exists( 'testimonial' ) ) {
		register_post_type(
			'testimonial',
			array(
				'labels'          => array(
					'name'          => __( 'Guest reviews', 'emerald-core' ),
					'singular_name' => __( 'Guest review', 'emerald-core' ),
				),
				'public'          => false,
				'show_ui'         => true,
				'menu_icon'       => 'dashicons-format-quote',
				'menu_position'   => 23,
				'supports'        => array( 'title', 'editor', 'page-attributes' ),
				'show_in_rest'    => true,
			)
		);
	}

	if ( ! post_type_exists( 'staff' ) ) {
		register_post_type(
			'staff',
			array(
				'labels'          => array(
					'name'          => __( 'Team', 'emerald-core' ),
					'singular_name' => __( 'Team member', 'emerald-core' ),
					'add_new_item'  => __( 'Add a team member', 'emerald-core' ),
				),
				'public'          => false,
				'show_ui'         => true,
				'menu_icon'       => 'dashicons-groups',
				'menu_position'   => 24,
				'supports'        => array( 'title', 'editor', 'thumbnail', 'page-attributes', 'custom-fields' ),
				'show_in_rest'    => true,
			)
		);
	}
}

add_action( 'init', 'emerald_core_promo_tags', 99 );
/**
 * Specials keep their own tags (season, audience) as on the live install.
 */
function emerald_core_promo_tags() {
	if ( post_type_exists( 'promotion' ) ) {
		register_taxonomy_for_object_type( 'post_tag', 'promotion' );
	}
}

add_action( 'wp_head', 'emerald_core_seo_head', 1 );
/**
 * SEO head output: canonical, meta description, Open Graph, Twitter cards and
 * the DaySpa JSON-LD schema. Every schema value is ported from the audited
 * headless build (business.json, verified against the live Fresha record).
 */
function emerald_core_seo_head() {

	$is_front  = is_front_page();
	$is_single = is_singular();

	// Title and description.
	$title = wp_get_document_title();
	if ( $is_front ) {
		$desc = "At Emerald Spa & Wellness Centre, we've shaped a refined retreat where calm, balance, and quiet luxury set the tone. Every detail is designed to help you slow down, feel cared for, and reconnect, from the moment you step through the door.";
	} elseif ( $is_single ) {
		$desc = get_the_excerpt();
	} else {
		$desc = get_bloginfo( 'description' );
	}
	$desc = wp_strip_all_tags( (string) $desc );
	if ( function_exists( 'mb_substr' ) && mb_strlen( $desc ) > 165 ) {
		$desc = trim( mb_substr( $desc, 0, 162 ) ) . '...';
	}

	// Canonical URL.
	if ( $is_front ) {
		$canonical = home_url( '/' );
	} elseif ( $is_single ) {
		$canonical = (string) wp_get_canonical_url();
	} else {
		$canonical = home_url( add_query_arg( array() ) );
	}

	// Image: featured image when set, default share card otherwise.
	$image = EMERALD_CORE_URL . 'assets/img/og-image.jpg';
	if ( $is_single && ( $thumb = get_the_post_thumbnail_url( get_queried_object_id(), 'full' ) ) ) {
		$image = $thumb;
	}

	echo "\n<!-- Emerald SEO -->\n";
	printf( "<meta name=\"description\" content=\"%s\" />\n", esc_attr( $desc ) );
	if ( $canonical ) {
		printf( "<link rel=\"canonical\" href=\"%s\" />\n", esc_url( $canonical ) );
	}
	printf( "<meta property=\"og:site_name\" content=\"%s\" />\n", esc_attr( get_bloginfo( 'name' ) ) );
	printf( "<meta property=\"og:type\" content=\"%s\" />\n", $is_front ? 'website' : 'article' );
	printf( "<meta property=\"og:title\" content=\"%s\" />\n", esc_attr( $title ) );
	printf( "<meta property=\"og:description\" content=\"%s\" />\n", esc_attr( $desc ) );
	printf( "<meta property=\"og:url\" content=\"%s\" />\n", esc_url( $canonical ? $canonical : home_url( '/' ) ) );
	printf( "<meta property=\"og:image\" content=\"%s\" />\n", esc_url( $image ) );
	echo '<meta property="og:locale" content="en_US" />' . "\n";
	echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
	printf( "<meta name=\"twitter:title\" content=\"%s\" />\n", esc_attr( $title ) );
	printf( "<meta name=\"twitter:description\" content=\"%s\" />\n", esc_attr( $desc ) );
	printf( "<meta name=\"twitter:image\" content=\"%s\" />\n", esc_url( $image ) );

	$hours = array(
		'Mo 09:00-18:00',
		'Tu 09:00-18:00',
		'We 09:00-18:00',
		'Th 09:00-18:00',
		'Fr 09:00-18:00',
		'Sa 09:00-18:00',
		'Su 10:00-16:00',
	);
	$schema = array(
		'@context'    => 'https://schema.org',
		'@type'       => 'DaySpa',
		'@id'         => home_url( '/#business' ),
		'name'        => 'Emerald Spa & Wellness Centre',
		'description' => $desc,
		'url'         => home_url( '/' ),
		'telephone'   => '+264856077143',
		'image'       => EMERALD_CORE_URL . 'assets/img/og-image.jpg',
		'logo'        => EMERALD_CORE_URL . 'assets/img/lockup-stacked-light.png',
		'priceRange'  => 'NAD 10 - NAD 4500',
		'currenciesAccepted' => 'NAD',
		'address'     => array(
			'@type'          => 'PostalAddress',
			'streetAddress'  => '7 Blackett Street',
			'addressLocality' => 'Windhoek',
			'addressRegion'  => 'Khomas Region',
			'addressCountry' => 'NA',
		),
		'geo'         => array(
			'@type'       => 'GeoCoordinates',
			'latitude'    => -22.5540581,
			'longitude'   => 17.0755901,
		),
		'openingHours' => $hours,
		'aggregateRating' => array(
			'@type'       => 'AggregateRating',
			'ratingValue' => 4.9,
			'reviewCount' => 244,
			'bestRating'  => 5,
			'worstRating' => 1,
		),
		'sameAs' => array(
			'https://www.instagram.com/emerald_spa_and_wellness/',
			'https://www.facebook.com/p/Emerald-Spa-and-Wellness-Center-61571981360103/',
		),
		'hasMap' => 'https://www.google.com/maps/search/?api=1&query=7%20Blackett%20Street,%20Windhoek,%20Khomas%20Region',
		'amenityFeature' => array_map(
			static function ( $name ) {
				return array(
					'@type' => 'LocationFeatureSpecification',
					'name'  => $name,
					'value' => true,
				);
			},
			array( 'Kid-friendly', 'Parking available', 'Near public transport', 'Showers', 'Lockers', 'Bath towels', 'Environmentally friendly', 'Proudly Namibian' )
		),
	);
	echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
	echo "<!-- /Emerald SEO -->\n";
}
