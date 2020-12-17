<?php
/**
 * Register custom REST API routes.
 *
 * @package block-visibility
 * @since   1.3.0
 */

namespace BlockVisibility\RestRoutes;

/**
 * Exit if accessed directly
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * WordPress dependencies
 */
use WP_REST_Server;
use WP_REST_Response;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\get_user_roles as get_user_roles;
use function BlockVisibility\Utils\get_current_user_role as get_current_user_role;

/**
 * Register our custom REST API routes.
 *
 * @since 1.3.0
 */
function register_routes() {
	$namespace = 'block-visibility/v1';

	register_rest_route(
		$namespace,
		'/settings',
		array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => __NAMESPACE__ . '\get_settings',
				'permission_callback' => '__return_true', // Read only, so anyone can view.
				'args'                => array(),
			),
		)
	);

	register_rest_route(
		$namespace,
		'/variables',
		array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => __NAMESPACE__ . '\get_variables',
				'permission_callback' => '__return_true', // Read only, so anyone can view.
				'args'                => array(),
			),
		)
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_routes' );

/**
 * Get the Block Visibility plugin settings.
 *
 * @since 1.3.0
 *
 * @return WP_Error|WP_REST_Response
 */
function get_settings() {
	$settings = get_option( 'block_visibility_settings' );

	if ( $settings ) {
		return new WP_REST_Response( $settings, 200 );
	} else {
		return new WP_Error( '404', __( 'Something went wrong, the visibility settings could not be found.', 'block-visibility' ) );
	}
}

/**
 * Get plugin variables.
 *
 * @since 1.3.0
 *
 * @return WP_REST_Response
 */
function get_variables() {
	$settings = get_option( 'block_visibility_settings' );

	if ( isset( $settings['plugin_settings']['enable_full_control_mode'] ) ) {
		$is_full_control_mode = $settings['plugin_settings']['enable_full_control_mode'];
	} else {
		$is_full_control_mode = false;
	}

	$plugin_variables = array(
		'version'     => BV_VERSION,
		'settingsUrl' => BV_SETTINGS_URL,
		'supportUrl'  => BV_SUPPORT_URL,
	);

	$variables = array(
		'currentUsersRoles' => get_current_user_role(),
		'userRoles'         => get_user_roles(),
		'pluginVariables'   => $plugin_variables,
		'isFullControlMode' => $is_full_control_mode,
		'isPro'		        => defined( 'BVP_VERSION' ), // If the Pro version constant is set, then Block Visibility Pro is active.
	);

	return new WP_REST_Response( $variables, 200 );
}
