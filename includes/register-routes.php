<?php
/**
 * Register custom REST API routes.
 *
 * @package block-visibility
 * @since   1.3.0
 */

namespace BlockVisibility\RestRoutes;

/**
 * WordPress dependencies
 */
use WP_REST_Server;
use WP_REST_Response;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\get_user_roles as get_user_roles;

function register_routes() {
	$namespace = 'block-visibility/v1';

	register_rest_route( $namespace, '/settings', array(
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => __NAMESPACE__ . '\get_settings',
			'permission_callback' => '__return_true', // Read only, so anyone can view.
			'args'                => array(),
		),

		/* @TODO build out settings updater.
		array(
			'methods'             => WP_REST_Server::EDITABLE,
			'callback'            => __NAMESPACE__ . '\update_settings',
			'permission_callback' => __NAMESPACE__ . '\permission_check',
			'args'                => array(),
		),
		*/
	) );

	register_rest_route( $namespace, '/variables', array(
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => __NAMESPACE__ . '\get_variables',
			'permission_callback' => '__return_true', // Read only, so anyone can view.
			'args'                => array(),
		),
	) );
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_routes' );

/**
 * Check if a given request has the appropriate permission
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|bool
 */
function permission_check( $request ) {
	// Enables routes for all users at the Contributer role and above.
	return current_user_can( 'edit_posts' );
}

/**
 * Get the Block Visibility plugin settings.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function get_settings( $request ) {
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
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function get_variables( $request ) {
	$settings = get_option( 'block_visibility_settings' );

	if ( isset( $settings['plugin_settings']['enable_full_control_mode'] ) ) {
		$is_full_control_mode = $settings['plugin_settings']['enable_full_control_mode'];
	} else {
		$is_full_control_mode = false;
	}

	$plugin_variables = array(
		'version'     => BLOCK_VISIBILITY_VERSION,
		'settingsUrl' => BLOCK_VISIBILITY_SETTINGS_URL,
		'reviewUrl'   => BLOCK_VISIBILITY_REVIEW_URL,
		'supportUrl'  => BLOCK_VISIBILITY_SUPPORT_URL,
	);

	$variables = array(
		'currentUsersRoles' => display_user_roles(),
		'userRoles' 		=> get_user_roles(),
		'pluginVariables' 	=> $plugin_variables,
		'isFullControlMode' => $is_full_control_mode,
	);

	return new WP_REST_Response( $variables, 200 );
}

function display_user_roles(){
    $user_id = get_current_user_id();
    $user_info = get_userdata( $user_id );
    return $user_info->roles;
}
