<?php
/**
 * Register the plugin settings
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility;

/**
 * Register plugin settings.
 *
 * @TODO Add filter here for developers can preset a list of setting defaults
 *
 * @since 1.0.0
 */
function register_settings() {
    register_setting(
        'block_visibility',
        'block_visibility_settings',
        array(
            'type' => 'object',
            'show_in_rest' => array(
                'schema' => array(
                    'type'  => 'object',
                    'properties' => array(
                        'visibility_controls' => array(
                            'type'  => 'object',
                            'properties' => array(
                                'hide_block' => array(
                                    'type'  => 'object',
                                    'properties' => array(
                                        'enable' => array(
                                            'type'  => 'boolean',
                                        ),
                                    ),
                                ),
                                'visibility_by_role' => array(
                                    'type'  => 'object',
                                    'properties' => array(
                                        'enable' => array(
                                            'type'  => 'boolean',
                                        ),
                                        'enable_user_roles' => array(
                                            'type'  => 'boolean',
                                        ),
                                    ),
                                ),
                            ),
                        ),
                        'disabled_blocks' => array(
                            'type'  => 'array',
                            'items' => array(
                                'type'  => 'string',
                            ),
                        ),
                        'plugin_settings' => array(
                            'type'  => 'object',
                            'properties' => array(
                                'enable_full_control_mode' => array(
                                    'type'  => 'boolean',
                                ),
                                'remove_on_uninstall' => array(
                                    'type'  => 'boolean',
                                ),
                            ),
                        ),
                    )
                ),
            ),
            'default' => [
                'visibility_controls' => [
                    'hide_block' => [
                        'enable' => true,
                    ],
                    'visibility_by_role' => [
                        'enable' => true,
                        'enable_user_roles' => true,
                    ],
                ],
                'disabled_blocks' => [],
                'plugin_settings' => [
                    'enable_full_control_mode' => false,
                    'remove_on_uninstall' => false,
                ],
            ],
        )
    );
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_settings' );
add_action( 'admin_init', __NAMESPACE__ . '\register_settings' );

/* TODO: remove eventually, use to reset plugin settings */
//delete_option( 'block_visibility_settings' );
