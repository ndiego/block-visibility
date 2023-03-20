<?php
/**
 * Register the Visibility Preset post type.
 *
 * @package block-visibility
 * @since   3.0.0
 */

namespace BlockVisibility\Presets;

defined( 'ABSPATH' ) || exit;

/**
 * Register the visibility_preset post type.
 */
function register_visibility_preset_post_type() {
	$labels = array(
		'name'          => __( 'Presets', 'block-visibility' ),
		'singular_name' => __( 'Preset', 'block-visibility' ),
	);

	$args = array(
		'labels'       => $labels,
		'public'       => false,
		'query_var'    => false,
		'show_in_rest' => true,
		'supports'     => array( 'title', 'custom-fields' ),
	);

	register_post_type( 'visibility_preset', $args );
}
add_action( 'init', __NAMESPACE__ . '\register_visibility_preset_post_type' );

register_meta(
	'post',
	'enable',
	array(
		'object_subtype' => 'visibility_preset',
		'single'         => true,
		'type'           => 'boolean',
		'show_in_rest'   => true,
		'default'        => true,
	)
);

register_meta(
	'post',
	'layout',
	array(
		'object_subtype' => 'visibility_preset',
		'single'         => true,
		'type'           => 'string',
		'show_in_rest'   => true,
		'default'        => 'columns',
	)
);

register_meta(
	'post',
	'hide_block',
	array(
		'object_subtype' => 'visibility_preset',
		'single'         => true,
		'type'           => 'boolean',
		'show_in_rest'   => true,
		'default'        => false,
	)
);

register_meta(
	'post',
	'control_sets',
	array(
		'object_subtype' => 'visibility_preset',
		'type'           => 'array',
		'show_in_rest'   => array(
			'single' => true,
			'schema' => array(
				'type'  => 'array',
				'items' => array(
					'type'       => 'object',
					'properties' => array(
						'id'       => array(
							'type' => 'number',
						),
						'title'    => array(
							'type' => 'string',
						),
						'enable'   => array(
							'type' => 'boolean',
						),
						'controls' => array(
							'type'                 => 'object',
							'additionalProperties' => true,
							'properties'           => array(),
						),
					),
				),
			),
		),
	)
);
