<?php
/**
 * REST API Settings Controller
 *
 * Handles requests to block-visibility/v1/settings
 *
 * @package block-visibility
 * @since   1.4.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * REST API Settings Controller Class.
 *
 * @package WooCommerce\RestApi
 * @extends WC_REST_Controller
 */
class Block_Visibility_REST_Settings_Controller extends WP_REST_Controller {

	/**
	 * Endpoint namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'block-visibility/v1';

	/**
	 * Route base.
	 *
	 * @var string
	 */
	protected $rest_base = 'settings';

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
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
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);
	}

	/**
	 * Get a collection of items
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_settings() {

		$settings = get_option( 'block_visibility_settings' );

		if ( $settings ) {
			// @TODO Possibly add a prepare_settings_for_response function here
			// in the future.
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

		// @TODO Possibly add a prepare_settings_for_database function here
		// in the future. The schema does take care of data validation to a
		// large degree, but more could be added.
		$settings = $request->get_params();

		if ( get_option( 'block_visibility_settings' ) ) {
			update_option( 'block_visibility_settings', $settings );

			$new_settings = get_option( 'block_visibility_settings' );

			if ( $new_settings ) {
				return new WP_REST_Response( $new_settings, 200 );
			} else {
				return new WP_Error( '404', __( 'Something went wrong, the settings could not be updated.', 'block-visibility' ), array( 'status' => 404 ) );
			}
		}

		return new WP_Error( '500', __( 'Something went wrong, the settings could not be updated.', 'block-visibility' ), array( 'status' => 500 ) );
	}

	/**
	 * Check if a given request has access to update settings.
	 *
	 * @return WP_Error|bool
	 */
	public function update_settings_permissions_check() {

		// Any admin level capacity will do, just needs to be an admin user.
		return current_user_can( 'activate_plugins' );
	}

	/**
	 * Get the Settings schema, conforming to JSON Schema.
	 *
	 * @return array
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			// Since WordPress 5.3, the schema can be cached in the $schema property.
			return $this->schema;
		}

		$schema = array(
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
								'enable' => array(
									'type' => 'boolean',
								),
							),
						),
						'screen_size'        => array(
							'type'       => 'object',
							'properties' => array(
								'enable'              => array(
									'type' => 'boolean',
								),
								'breakpoints'         => array(
									'type'       => 'object',
									'properties' => array(
										'extra_large' => array(
											'type'       => 'object',
											'properties' => array(
												'enable' => array(
													'type' => 'boolean',
												),
												'value'  => array(
													'type' => 'number',
												),
											),
										),
										'large' => array(
											'type'       => 'object',
											'properties' => array(
												'enable' => array(
													'type' => 'boolean',
												),
												'value'  => array(
													'type' => 'number',
												),
											),
										),
										'medium'  => array(
											'type'       => 'object',
											'properties' => array(
												'enable' => array(
													'type' => 'boolean',
												),
												'value'  => array(
													'type' => 'number',
												),
											),
										),
										'small'  => array(
											'type'       => 'object',
											'properties' => array(
												'enable' => array(
													'type' => 'boolean',
												),
												'value'  => array(
													'type' => 'number',
												),
											),
										),
									),
								),
								'enable_frontend_css' => array(
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

						// Additional Settings.
						'enable_visibility_notes'       => array(
							'type' => 'boolean',
						),
					),
				),
			),
		);

		$this->schema = apply_filters(
			'block_visibility_rest_settings_schema',
			$schema
		);

		return $this->schema;
	}
}
