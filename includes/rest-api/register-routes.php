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
use BV_REST_Settings_Controller;
use BV_REST_Variables_Controller;

/**
 * Function to register our new routes from the controller.
 */
function register_routes() {
	$settings_controller = new BV_REST_Settings_Controller();
	$settings_controller->register_routes();
	$variables_controller = new BV_REST_Variables_Controller();
	$variables_controller->register_routes();
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_routes' );

/**
 * Include our custom REST API controllers.
 */
require_once BV_PLUGIN_DIR . 'includes/rest-api/class-bv-rest-settings-controller.php';
require_once BV_PLUGIN_DIR . 'includes/rest-api/class-bv-rest-variables-controller.php';
