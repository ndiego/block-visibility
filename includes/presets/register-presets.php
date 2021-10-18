<?php
/**
 * Register the Visibility Preset post type.
 *
 * @package block-visibility
 * @since   2.2.0
 */

namespace BlockVisibility\Presets;

defined( 'ABSPATH' ) || exit;

function register_bv_preset_post_type() {
	$labels = array(
		'name'               => __( 'Presets', 'block-visibility' ),
		'singular_name'      => __( 'Preset', 'block-visibility' ),
	);

	$args = array(
		'labels'              => $labels,
		'public'              => true,
		'publicly_queryable'  => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'query_var'           => true,
		'show_in_admin_bar'   => true,
		'show_in_rest'	      => true,
		'supports'     		  => array( 'title', 'custom-fields' ),
	);

	// Register the easy_docs post type
	register_post_type( 'bv_preset', $args );
}
add_action( 'init', __NAMESPACE__ . '\register_bv_preset_post_type' );

register_meta(
	 'post',
	 'enable',
	 array(
		 'object_subtype' => 'bv_preset',
		 'single'         => true,
		 'type'           => 'boolean',
		 'show_in_rest'   => true,
		 'default'        => true,
	 )
 );

register_meta(
	'post',
	'control_sets',
	array(
		'object_subtype' => 'bv_preset',
		'type'           => 'array',
		'show_in_rest'   => array(
			'single' => true,
			'schema' => array(
				'type' => 'array',
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id'  => array(
							'type' => 'number',
						),
						'title'  => array(
							'type' => 'string',
						),
						'enable'  => array(
							'type' => 'boolean',
						),
						'controls'  => array(
							'type' => 'object',
							'additionalProperties' => true,
							'properties' => array(),
						),
					),
				),
			),
		),
	  )
 );
