<?php
/**
 * REST API Variables Controller
 *
 * Handles requests to block-visibility/v1/variables
 *
 * @package block-visibility
 * @since   1.4.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\get_user_roles as get_user_roles;
use function BlockVisibility\Utils\get_current_user_role as get_current_user_role;

/**
 * REST API Settings Controller Class.
 *
 * @package WooCommerce\RestApi
 * @extends WC_REST_Controller
 */
class Block_Visibility_REST_Variables_Controller extends WP_REST_Controller {

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
	protected $rest_base = 'variables';

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
					'callback'            => array( $this, 'get_variables' ),
					'permission_callback' => '__return_true', // Read only, so anyone can view.
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
	public function get_variables() {

		$settings = get_option( 'block_visibility_settings' );

		if ( isset( $settings['plugin_settings']['enable_full_control_mode'] ) ) {
			$is_full_control_mode = $settings['plugin_settings']['enable_full_control_mode'];
		} else {
			$is_full_control_mode = false;
		}

		$plugin_variables = array(
			'version'     => BLOCK_VISIBILITY_VERSION,
			'settingsUrl' => BLOCK_VISIBILITY_SETTINGS_URL,
			'supportUrl'  => BLOCK_VISIBILITY_SUPPORT_URL,
		);

		$variables = array(
			'currentUsersRoles' => get_current_user_role(),
			'userRoles'         => get_user_roles(),
			'pluginVariables'   => $plugin_variables,
			'isFullControlMode' => $is_full_control_mode,
			'isPro'             => defined( 'BVP_VERSION' ), // If the Pro version constant is set, then Block Visibility Pro is active.
			'integrations'      => array(
				'wpFusion' => array(
					'active' => function_exists( 'wp_fusion' ),
					'tags'   => self::get_wp_fusion_tags(),
				),
			),
		);

		$variables = apply_filters(
			'block_visibility_rest_variables',
			$variables
		);

		return new WP_REST_Response( $variables, 200 );
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
			'title'      => 'variables',
			'type'       => 'object',
			'properties' => array(
				'currentUsersRoles' => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
				'userRoles'         => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
				'pluginVariables'   => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
				'isFullControlMode' => array(
					'type' => 'boolean',
				),
				'isPro'             => array(
					'type' => 'boolean',
				),
				'integrations'      => array(
					'type'       => 'object',
					'properties' => array(
						'wpFusion' => array(
							'type'       => 'object',
							'properties' => array(
								'active' => array(
									'type' => 'boolean',
								),
								'tags'   => array(
									'type'  => 'array',
									'items' => array(
										'type' => 'string',
									),
								),
							),
						),
					),
				),
			),
		);

		$this->schema = apply_filters(
			'block_visibility_rest_variables_schema',
			$schema
		);

		return $this->schema;
	}

	/**
	 * Fetch all available tags in WP Fusion.
	 *
	 * @return array
	 */
	public static function get_wp_fusion_tags() {

		$tags_for_select = array();

		if ( ! function_exists( 'wp_fusion' ) ) {
			return $tags_for_select;
		}

		$available_tags  = wp_fusion()->settings->get( 'available_tags', array() );

		foreach ( $available_tags as $tag_id => $tag ) {
			if ( is_array( $tag ) ) {
				$tags_for_select[] = array(
					'value' => $tag_id,
					'label' => $tag['label'],
				);
			} else {
				$tags_for_select[] = array(
					'value' => $tag_id,
					'label' => $tag,
				);
			}
		}

		return $tags_for_select;
	}
}
