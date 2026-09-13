<?php
/**
 * Plugin Name: Emerald Core
 * Description: Content types for emeraldspacc.com: promotion (specials), treatment (menu), testimonial (guest words), staff (team). Registers a type only when nothing else already provides it, so the plugin is safe beside any existing setup. Free custom code only.
 * Version:     1.0.0
 * Author:      Emerald Webmaster
 * License:     GPL-2.0-or-later
 * Text Domain: emerald-core
 */

defined( 'ABSPATH' ) || exit;

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
