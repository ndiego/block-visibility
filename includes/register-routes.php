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
use WP_REST_Controller;
use WP_Error;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\get_user_roles as get_user_roles;
use function BlockVisibility\Utils\get_current_user_role as get_current_user_role;

class BV_Routes extends WP_REST_Controller {

	/**
	 * Endpoint namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'block-visibility/v1';

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		register_rest_route( $this->namespace, '/settings', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_settings' ),
				'permission_callback' => '__return_true', // Read only, so anyone can view.
			),
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_settings' ),
				'permission_callback' => array( $this, 'update_settings_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema( true ),
			),
		) );
		/*
		register_rest_route( $namespace, '/' . $base . '/(?P<id>[\d]+)', array(
		  array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => array( $this, 'get_item' ),
			'permission_callback' => array( $this, 'get_item_permissions_check' ),
			'args'                => array(
			  'context' => array(
				'default' => 'view',
			  ),
			),
		  ),
		  array(
			'methods'             => WP_REST_Server::EDITABLE,
			'callback'            => array( $this, 'update_item' ),
			'permission_callback' => array( $this, 'update_item_permissions_check' ),
			'args'                => $this->get_endpoint_args_for_item_schema( false ),
		  ),
		) );
		*/

		register_rest_route( $this->namespace, '/settings/schema', array(
			'methods'  => WP_REST_Server::READABLE,
			'callback' => array( $this, 'get_public_item_schema' ),
		) );
	}

	/**
	 * Get our sample schema for a post.
	 *
	 * @param WP_REST_Request $request Current request.
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			// Since WordPress 5.3, the schema can be cached in the $schema property.
			return $this->schema;
		}

		$this->schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'settings',
			'type'       => 'object',
			'properties' => array(
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
								'enable' => array(
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
								'enable' => array(
									'type' => 'boolean',
								),
							),
						),

						// Legacy Controls, remove in future version.
						'time_date'          => array(
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
						'enable_contextual_indicators' => array(
							'type' => 'boolean',
						),
						'enable_toolbar_controls'  => array(
							'type' => 'boolean',
						),
						'enable_user_role_restrictions' => array(
							'type' => 'boolean',
						),
						'enabled_user_roles'       => array(
							'type'  => 'array',
							'items' => array(
								'type' => 'string',
							),
						),
						'enable_full_control_mode' => array(
							'type' => 'boolean',
						),
						'remove_on_uninstall'      => array(
							'type' => 'boolean',
						),

						// Additional Settings.
						'enable_visibility_notes'  => array(
							'type' => 'boolean',
						),
					),
				),
			),
		);

		return $this->schema;
	}

	/**
	 * Get a collection of items
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_settings( $request ) {

		$settings = get_option( 'block_visibility_settings' );

		if ( $settings ) {
			return new WP_REST_Response( $settings, 200 );
		} else {
			return new WP_Error( '404', __( 'Something went wrong, the visibility settings could not be found.', 'block-visibility' ), array( 'status' => 404 ) );
		}
	}

	/**
	 * Create one item from the collection
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function update_settings( $request ) {
		//$settings = $this->prepare_item_for_database( $request );
		$settings = $request->get_params();

		if ( get_option( 'block_visibility_settings' ) ) {
			update_option( 'block_visibility_settings', $settings );

			$new_settings = get_option( 'block_visibility_settings' );

			if ( $new_settings ) {
				return new WP_REST_Response( $new_settings, 200 );
			} else {
				return new WP_Error( '404', __( 'Something went wrong, the settings could not be updated.', 'block-visibility' ) );
			}
		}

		return new WP_Error( 'cant-create', __( 'Something went wrong, the settings could not be updated.', 'block-visibility' ), array( 'status' => 500 ) );
	}

  /**
   * Get one item from the collection
   *
   * @param WP_REST_Request $request Full data about the request.
   * @return WP_Error|WP_REST_Response
   */
  public function get_item( $request ) {
	//get parameters from request
	$params = $request->get_params();
	$item = array();//do a query, call another class, etc
	$data = $this->prepare_item_for_response( $item, $request );

	//return a response or error based on some conditional
	if ( 1 == 1 ) {
	  return new WP_REST_Response( $data, 200 );
	} else {
	  return new WP_Error( 'code', __( 'message', 'text-domain' ) );
	}
  }



  /**
   * Update one item from the collection
   *
   * @param WP_REST_Request $request Full data about the request.
   * @return WP_Error|WP_REST_Response
   */
  public function update_item( $request ) {
	$item = $this->prepare_item_for_database( $request );

	if ( function_exists( 'slug_some_function_to_update_item' ) ) {
	  $data = slug_some_function_to_update_item( $item );
	  if ( is_array( $data ) ) {
		return new WP_REST_Response( $data, 200 );
	  }
	}

	return new WP_Error( 'cant-update', __( 'message', 'text-domain' ), array( 'status' => 500 ) );
  }


	/**
	 * Check if a given request has access to update settings.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function update_settings_permissions_check( $request ) {

		// Any admin level capacity will do, just needs to be an admin user.
		return current_user_can( 'activate_plugins' );
	}

  	/**
	 * Prepare the item for create or update operation
   	 *
     * @param WP_REST_Request $request Request object
   	 * @return WP_Error|object $prepared_item
   	 */
  	protected function prepare_item_for_database( $request ) {
		return array();
	}

  	/**
   	 * Prepare the item for the REST response
   	 *
   	 * @param mixed $item WordPress representation of the item.
   	 * @param WP_REST_Request $request Request object.
   	 * @return mixed
   	 */
  	public function prepare_item_for_response( $item, $request ) {
		return array();
  	}

  	/**
   	 * Get the query params for collections
   	 *
   	 * @return array
     */
  	public function get_collection_params() {
		return array(
		  	'page'     => array(
				'description'       => 'Current page of the collection.',
				'type'              => 'integer',
				'default'           => 1,
				'sanitize_callback' => 'absint',
			),
			  'per_page' => array(
				'description'       => 'Maximum number of items to be returned in result set.',
				'type'              => 'integer',
				'default'           => 10,
				'sanitize_callback' => 'absint',
			),
			  'search'   => array(
				'description'       => 'Limit results to those matching a string.',
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			),
		);
	}

}


// Function to register our new routes from the controller.
function register_route() {
	$controller = new BV_Routes();
	$controller->register_routes();
}

add_action( 'rest_api_init', __NAMESPACE__ . '\register_route' );


/**
 * Register our custom REST API routes.
 *
 * @since 1.3.0
 */
function register_routes() {
	$namespace = 'block-visibility/v1';
/*
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
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => __NAMESPACE__ . '\update_settings',
				'permission_callback' => __NAMESPACE__ . '\update_settings_permissions_check',
				'args'                => $this->get_endpoint_args_for_item_schema( false ),
			),
		)
	);
*/
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
