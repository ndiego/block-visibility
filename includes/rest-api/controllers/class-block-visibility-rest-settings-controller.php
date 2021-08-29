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
 * @package WordPress\REST_API
 * @extends WP_REST_Controller
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
				'schema' => array( $this, 'get_item_schema' ),
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

		$error_message = __( 'Something went wrong, the settings could not be updated.', 'block-visibility' );

		if ( ! get_option( 'block_visibility_settings' ) ) {
			return new WP_Error( '500', $error_message, array( 'status' => 500 ) );
		}

		if ( isset( $settings['reset'] ) ) {
			if ( 'all' === $settings['reset'] ) {

				// Delete the currently saved settings and pull the defaults.
				delete_option( 'block_visibility_settings' );
				$new_settings = get_option( 'block_visibility_settings' );
			} else {

				// Remove the settings we want to reset from the currently saved
				// settings.
				$old_settings = get_option( 'block_visibility_settings' );
				unset( $old_settings[ $settings['reset'] ] );

				delete_option( 'block_visibility_settings' );

				// Merge the default settings with the previously saved settings
				// minus the settings that was wanted to reset.
				$default_settings = get_option( 'block_visibility_settings' );
				$new_settings     = array_merge( $default_settings, $old_settings );
			}
		} else {

			// We are not resettings, so just update the settings and return
			// the updated settings.
			update_option( 'block_visibility_settings', $settings );
			$new_settings = get_option( 'block_visibility_settings' );
		}

		if ( $new_settings ) {
			return new WP_REST_Response( $new_settings, 200 );
		} else {
			return new WP_Error( '404', $error_message, array( 'status' => 404 ) );
		}

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
