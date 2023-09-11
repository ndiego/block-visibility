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
				'browser_device'     => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
					),
				),
				'cookie'             => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
					),
				),
				'date_time'          => array(
					'type'       => 'object',
					'properties' => array(
						'enable'             => array(
							'type' => 'boolean',
						),
						'enable_day_of_week' => array(
							'type' => 'boolean',
						),
						'enable_time_of_day' => array(
							'type' => 'boolean',
						),
						// Deprecated in 1.8.0.
						'enable_scheduling'  => array(
							'type' => 'boolean',
						),
					),
				),
				'hide_block'         => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
					),
				),
				'location'           => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
					),
				),
				'metadata'           => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
					),
				),
				'query_string'       => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
					),
				),
				'referral_source'    => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
					),
				),
				'screen_size'        => array(
					'type'       => 'object',
					'properties' => array(
						'enable'                   => array(
							'type' => 'boolean',
						),
						'breakpoints'              => array(
							'type'       => 'object',
							'properties' => array(
								'extra_large' => array(
									'type' => 'string',
								),
								'large'       => array(
									'type' => 'string',
								),
								'medium'      => array(
									'type' => 'string',
								),
								'small'       => array(
									'type' => 'string',
								),
							),
						),
						'controls'                 => array(
							'type'       => 'object',
							'properties' => array(
								'extra_large' => array(
									'type' => 'boolean',
								),
								'large'       => array(
									'type' => 'boolean',
								),
								'medium'      => array(
									'type' => 'boolean',
								),
								'small'       => array(
									'type' => 'boolean',
								),
								'extra_small' => array(
									'type' => 'boolean',
								),
							),
						),
						'enable_advanced_controls' => array(
							'type' => 'boolean',
						),
						'enable_frontend_css'      => array(
							'type' => 'boolean',
						),
					),
				),
				'url_path'           => array(
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
						'enable'                => array(
							'type' => 'boolean',
						),
						'enable_user_roles'     => array(
							'type' => 'boolean',
						),
						'enable_users'          => array(
							'type' => 'boolean',
						),
						'enable_user_rule_sets' => array(
							'type' => 'boolean',
						),
					),
				),
				'visibility_presets' => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
					),
				),
				// Third-party Integrations.
				'acf'                => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
					),
				),
				'edd'                => array(
					'type'       => 'object',
					'properties' => array(
						'enable'                  => array(
							'type' => 'boolean',
						),
						'enable_variable_pricing' => array(
							'type' => 'boolean',
						),
					),
				),
				'woocommerce'        => array(
					'type'       => 'object',
					'properties' => array(
						'enable'                  => array(
							'type' => 'boolean',
						),
						'enable_variable_pricing' => array(
							'type' => 'boolean',
						),
					),
				),
				'wp_fusion'          => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
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
				'default_controls'              => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
				'enable_contextual_indicators'  => array(
					'type' => 'boolean',
				),
				'contextual_indicator_color'    => array(
					'type' => 'string',
				),
				'enable_block_opacity'          => array(
					'type' => 'boolean',
				),
				'block_opacity'                 => array(
					'type' => 'number',
				),
				'enable_toolbar_controls'       => array(
					'type' => 'boolean',
				),
				'enable_editor_notices'         => array(
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
				'enable_control_set_utilities'  => array(
					'type' => 'boolean',
				),
			),
		),
	);

	$settings = apply_filters( 'block_visibility_settings', $settings );

	$defaults = array(
		'visibility_controls' => array(
			'browser_device'     => array(
				'enable' => true,
			),
			'cookie'             => array(
				'enable' => true,
			),
			'date_time'          => array(
				'enable'             => true,
				'enable_day_of_week' => true,
				'enable_time_of_day' => true,
				// Deprecated in 1.8.0.
				'enable_scheduling'  => true,
			),
			'hide_block'         => array(
				'enable' => true,
			),
			'location'           => array(
				'enable' => true,
			),
			'metadata'           => array(
				'enable' => true,
			),
			'query_string'       => array(
				'enable' => true,
			),
			'referral_source'    => array(
				'enable' => true,
			),
			'screen_size'        => array(
				'enable'                   => true,
				'breakpoints'              => array(
					'extra_large' => '1200px',
					'large'       => '992px',
					'medium'      => '768px',
					'small'       => '576px',
				),
				'controls'                 => array(
					'extra_large' => true,
					'large'       => true,
					'medium'      => true,
					'small'       => true,
					'extra_small' => true,
				),
				'enable_advanced_controls' => false,
				'enable_frontend_css'      => true,
			),
			'url_path'           => array(
				'enable' => true,
			),
			'visibility_by_role' => array(
				'enable'                => true,
				'enable_user_roles'     => true,
				'enable_users'          => true,
				'enable_user_rule_sets' => true,
			),
			'visibility_presets' => array(
				'enable' => true,
			),
			// Third-party Integrations.
			'acf'                => array(
				'enable' => true,
			),
			'woocommerce'        => array(
				'enable'                  => true,
				'enable_variable_pricing' => true,
			),
			'edd'                => array(
				'enable'                  => true,
				'enable_variable_pricing' => true,
			),
			'wp_fusion'          => array(
				'enable' => true,
			),
		),
		'disabled_blocks'     => array(),
		'plugin_settings'     => array(
			'default_controls'              => array(),
			'enable_contextual_indicators'  => true,
			'contextual_indicator_color'    => '',
			'enable_block_opacity'          => false,
			'block_opacity'                 => 100,
			'enable_toolbar_controls'       => true,
			'enable_editor_notices'         => true,
			'enable_user_role_restrictions' => false,
			'enabled_user_roles'            => array(),
			'enable_full_control_mode'      => false,
			'remove_on_uninstall'           => false,
			'enable_control_set_utilities'  => true,
		),
	);

	$defaults = apply_filters( 'block_visibility_settings_defaults', $defaults );

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
