<?php
/**
 * Register the plugin settings
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility;

defined( 'ABSPATH' ) || exit;

/**
 * Register plugin settings.
 *
 * @since 1.0.0
 */
function register_settings() {

	$settings = array(
		'visibility_controls' => array(
			'type'       => 'object',
			'properties' => array(
				'hide_block'         => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
					),
				),
				'visibility_by_role' => array(
					'type'       => 'object',
					'properties' => array(
						'enable'            => array(
							'type' => 'boolean',
						),
						'enable_user_roles' => array(
							'type' => 'boolean',
						),
					),
				),
				'date_time'          => array(
					'type'       => 'object',
					'properties' => array(
						'enable'            => array(
							'type' => 'boolean',
						),
						'enable_scheduling' => array(
							'type' => 'boolean',
						),
					),
				),
			),
		),
		'disabled_blocks'     => array(
			'type'  => 'array',
			'items' => array(
				'type' => 'string',
			),
		),
		'plugin_settings'     => array(
			'type'       => 'object',
			'properties' => array(
				'enable_contextual_indicators'  => array(
					'type' => 'boolean',
				),
				'enable_toolbar_controls'       => array(
					'type' => 'boolean',
				),
				'enable_user_role_restrictions' => array(
					'type' => 'boolean',
				),
				'enabled_user_roles'            => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
				'enable_full_control_mode'      => array(
					'type' => 'boolean',
				),
				'remove_on_uninstall'           => array(
					'type' => 'boolean',
				),
			),
		),
	);

	apply_filters( 'block_visibility_settings', $settings );

	$defaults = array(
		'visibility_controls' => array(
			'hide_block'         => array(
				'enable' => true,
			),
			'visibility_by_role' => array(
				'enable'            => true,
				'enable_user_roles' => true,
			),
			'date_time'          => array(
				'enable'            => true,
				'enable_scheduling' => true,
			),
		),
		'disabled_blocks'     => array(),
		'plugin_settings'     => array(
			'enable_contextual_indicators'  => true,
			'enable_toolbar_controls'       => true,
			'enable_user_role_restrictions' => false,
			'enabled_user_roles'            => array(),
			'enable_full_control_mode'      => false,
			'remove_on_uninstall'           => false,
		),
	);

	apply_filters( 'block_visibility_setting_defaults', $defaults );

	register_setting(
		'block_visibility',
		'block_visibility_settings',
		array(
			'description'  => __(
				'Settings for the Block Visibility plugin.',
				'block-visibility'
			),
			'type'         => 'object',
			'show_in_rest' => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => $settings,
				),
			),
			'default'      => $defaults,
		)
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_settings' );
add_action( 'admin_init', __NAMESPACE__ . '\register_settings' );
