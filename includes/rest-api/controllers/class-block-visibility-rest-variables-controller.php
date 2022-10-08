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
 * @package WordPress\REST_API
 * @extends WP_REST_Controller
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
	 * Get a collection of variables.
	 *
	 * @param string $request The request.
	 * @return WP_Error|WP_REST_Response
	 */
	public function get_variables( $request ) {

		$request_type = $request->get_param( 'type' );
		$settings     = get_option( 'block_visibility_settings' );

		if ( isset( $settings['plugin_settings']['enable_full_control_mode'] ) ) {
			$is_full_control_mode = $settings['plugin_settings']['enable_full_control_mode'];
		} else {
			$is_full_control_mode = false;
		}

		$plugin_variables = array(
			'version'      => BLOCK_VISIBILITY_VERSION,
			'settings_url' => BLOCK_VISIBILITY_SETTINGS_URL,
			'support_url'  => BLOCK_VISIBILITY_SUPPORT_URL,
		);

		$variables = array(
			'plugin_variables'     => $plugin_variables,
			'is_full_control_mode' => $is_full_control_mode,
			'is_pro'               => defined( 'BVP_VERSION' ), // If the Pro version constant is set, then Block Visibility Pro is active.
			'integrations'         => array(
				'acf'       => array(
					'active' => function_exists( 'acf' ),
					'fields' => self::get_acf_fields( $request_type ),
				),
				'wp_fusion' => array(
					'active'         => function_exists( 'wp_fusion' ),
					'tags'           => self::get_wp_fusion_tags( $request_type ),
					'exclude_admins' => self::get_wp_fusion_exclude_admins(),
				),
			),
		);

		if ( 'simplified' !== $request_type ) {
			$variables['current_users_roles'] = get_current_user_role();
			$variables['user_roles']          = get_user_roles();
		}

		$variables = apply_filters(
			'block_visibility_rest_variables',
			$variables,
			$request_type
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
				'current_users_roles'  => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
				'user_roles'           => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
				'plugin_variables'     => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
				'is_full_control_mode' => array(
					'type' => 'boolean',
				),
				'is_pro'               => array(
					'type' => 'boolean',
				),
				'integrations'         => array(
					'type'       => 'object',
					'properties' => array(
						'acf'       => array(
							'type'       => 'object',
							'properties' => array(
								'active' => array(
									'type' => 'boolean',
								),
								'fields' => array(
									'type'  => 'array',
									'items' => array(
										'type' => 'string',
									),
								),
							),
						),
						'wp_fusion' => array(
							'type'       => 'object',
							'properties' => array(
								'active'         => array(
									'type' => 'boolean',
								),
								'tags'           => array(
									'type'  => 'array',
									'items' => array(
										'type' => 'string',
									),
								),
								'exclude_admins' => array(
									'type' => 'boolean',
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
	 * Fetch all available tags in ACF field groups and fields.
	 *
	 * @param string $request_type The request type.
	 * @return array
	 */
	public static function get_acf_fields( $request_type ) {
		if ( 'simplified' === $request_type ) {
			return array();
		}

		$all_groups_and_fields = array();

		if (
			function_exists( 'acf' ) &&
			function_exists( 'acf_get_field_groups' )
		) {
			$groups = acf_get_field_groups();

			if ( is_array( $groups ) ) {

				foreach ( $groups as $group ) {
					$group_fields = acf_get_fields( $group );

					if ( ! empty( $group_fields ) ) {

						$group_fields_simplified = array();

						foreach ( $group_fields as $key => $fields ) {
							$group_fields_simplified[] = $fields;
						}

						$all_groups_and_fields[] = array(
							'key'    => $group['key'],
							'title'  => $group['title'],
							'active' => $group['active'],
							'fields' => $group_fields_simplified,
						);
					}
				}
			}
		} else {
			$groups = apply_filters( 'acf/get_field_groups', array() ); // phpcs:ignore

			if ( is_array( $groups ) ) {

				foreach ( $groups as $group ) {
					$group_fields = apply_filters( 'acf/field_group/get_fields', array(), $group['id'] ); // phpcs:ignore

					if ( ! empty( $group_fields ) ) {

						$group_fields_simplified = array();

						foreach ( $group_fields as $key => $fields ) {
							$group_fields_simplified[] = $fields;
						}

						$all_groups_and_fields[] = array(
							'key'    => $group['key'],
							'title'  => $group['title'],
							'active' => $group['active'],
							'fields' => $group_fields_simplified,
						);
					}
				}
			}
		}

		return array_reverse( $all_groups_and_fields );
	}

	/**
	 * Fetch all available tags in WP Fusion.
	 *
	 * @param string $request_type The request type.
	 * @return array
	 */
	public static function get_wp_fusion_tags( $request_type ) {
		if ( 'simplified' === $request_type ) {
			return array();
		}

		$tags_for_select = array();

		if ( ! function_exists( 'wp_fusion' ) ) {
			return $tags_for_select;
		}

		$available_tags = wp_fusion()->settings->get( 'available_tags', array() );

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

	/**
	 * Fetch the exclude admin setting in WP Fusion
	 *
	 * @return boolean $exclude_admins Whether admins should be excluded or not.
	 */
	public static function get_wp_fusion_exclude_admins() {

		if ( ! function_exists( 'wp_fusion' ) ) {
			return false;
		}

		$exclude_admins = wp_fusion()->settings->get( 'exclude_admins' );

		return $exclude_admins;
	}
}
