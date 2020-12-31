<?php
/**
 * Register custom REST API routes.
 *
 * @package block-visibility
 * @since   1.3.0
 */

namespace BlockVisibility\RestApi;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use Block_Visibility_REST_Settings_Controller;
use Block_Visibility_REST_Variables_Controller;

/**
 * Function to register our new routes from the controller.
 */
function register_routes() {
	$settings_controller = new Block_Visibility_REST_Settings_Controller();
	$settings_controller->register_routes();
	$variables_controller = new Block_Visibility_REST_Variables_Controller();
	$variables_controller->register_routes();
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_routes' );

/**
 * Include our custom REST API controllers.
 */
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/rest-api/controllers/class-block-visibility-rest-settings-controller.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/rest-api/controllers/class-block-visibility-rest-variables-controller.php';
