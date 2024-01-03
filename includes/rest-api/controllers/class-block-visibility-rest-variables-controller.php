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
use function BlockVisibility\Utils\get_user_roles;
use function BlockVisibility\Utils\get_current_user_role;

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
					'args'                => array(
						'integration'  => array(
							'type'        => 'string',
							'description' => __( 'The integration to search.' ),
							'required'    => false,
						),
						'search_term'  => array(
							'type'        => 'string',
							'description' => __( 'Search term.' ),
							'required'    => false,
						),
						'saved_values' => array(
							'type'        => 'string',
							'description' => __( 'Saved values.' ),
							'required'    => false,
						),
					),
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

		// Get args.
		$integration  = sanitize_text_field( $request['integration'] );
		$search_term  = sanitize_text_field( $request['search_term'] );
		$saved_values = sanitize_text_field( $request['saved_values'] );

		if ( isset( $settings['plugin_settings']['enable_full_control_mode'] ) ) {
			$is_full_control_mode = $settings['plugin_settings']['enable_full_control_mode'];
		} else {
			$is_full_control_mode = false;
		}

		$plugin_variables = array(
			'version'      => BLOCK_VISIBILITY_VERSION,
			'settings_url' => BLOCK_VISIBILITY_SETTINGS_URL,
		);

		$variables = array(
			'plugin_variables'     => $plugin_variables,
			'is_full_control_mode' => $is_full_control_mode,
			'is_pro'               => defined( 'BVP_VERSION' ), // If the Pro version constant is set, then Block Visibility Pro is active.
			'current_users_roles'  => get_current_user_role(),
			'integrations'         => array(
				'acf'         => array(
					'active' => function_exists( 'acf' ),
					'fields' => self::get_acf_fields(
						$request_type,
						$settings,
						$integration
					),
				),
				'edd'         => array(
					'active'   => class_exists( 'Easy_Digital_Downloads' ),
					'products' => self::get_edd_products(
						$request_type,
						$settings,
						$integration,
						$search_term,
						$saved_values
					),
				),
				'woocommerce' => array(
					'active'   => class_exists( 'woocommerce' ),
					'products' => self::get_woocommerce_products(
						$request_type,
						$settings,
						$integration,
						$search_term,
						$saved_values
					),
				),
				'wp_fusion'   => array(
					'active'         => function_exists( 'wp_fusion' ),
					'tags'           => self::get_wp_fusion_tags(
						$request_type,
						$settings,
						$integration
					),
					'exclude_admins' => self::get_wp_fusion_exclude_admins(),
				),
			),
		);

		if (
			'simplified' !== $request_type &&
			! $integration
		) {
			$variables['user_roles'] = get_user_roles();
		}

		$variables = apply_filters(
			'block_visibility_rest_variables',
			$variables,
			$request_type
		);

		return new WP_REST_Response( $variables, 200 );
	}

	/**
	 * Fetch all available tags in ACF field groups and fields.
	 *
	 * @param string $request_type  The request type.
	 * @param array  $settings      All plugin settings.
	 * @param string $integration   The specific intregration variables being fetched, if any.
	 *
	 * @return array
	 */
	public static function get_acf_fields( $request_type, $settings, $integration ) {

		if (
			'simplified' === $request_type ||
			! self::is_integration_enabled( 'acf', $settings ) ||
			$integration // ACF does not support search (yet).
		) {
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
	 * @param string $request_type  The request type.
	 * @param array  $settings      All plugin settings.
	 * @param string $integration   The specific intregration variables being fetched, if any.
	 *
	 * @return array
	 */
	public static function get_wp_fusion_tags( $request_type, $settings, $integration ) {
		if (
			'simplified' === $request_type ||
			! self::is_integration_enabled( 'wp_fusion', $settings ) ||
			$integration
		) {
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

	/**
	 * WooCommerce: Fetch the available published products.
	 *
	 * @since 3.1.0
	 *
	 * @param string $request_type  The request type.
	 * @param array  $settings      All plugin settings.
	 * @param string $integration   The specific intregration variables being fetched, if any.
	 * @param string $search_term   The term being searched for.
	 * @param string $saved_values  Any currently saved values.
	 *
	 * @return array                All published products or those returned from search.
	 */
	public static function get_woocommerce_products( $request_type, $settings, $integration, $search_term, $saved_values ) {

		if (
			'simplified' === $request_type ||
			! class_exists( 'woocommerce' ) ||
			! function_exists( 'wc_get_products' ) ||
			! self::is_integration_enabled( 'woocommerce', $settings ) ||
			( $integration && 'woocommerce' !== $integration )
		) {
			return array();
		}

		$settings = get_option( 'block_visibility_settings' );

		// Check to see if variable pricing is enabled.
		if ( isset( $settings['visibility_controls']['woocommerce']['enable_variable_pricing'] ) ) {
			$enable_variable_pricing = $settings['visibility_controls']['woocommerce']['enable_variable_pricing'];
		} else {
			$enable_variable_pricing = true;
		}

		$fetch_limit = 25;

		$args = array(
			'status'  => 'publish',
			'limit'   => $fetch_limit,
			'orderby' => 'name',
			'order'   => 'ASC',
		);

		if ( $search_term && 'false' !== $search_term ) {
			$args['s'] = $search_term;
		}

		// If there are saved values, make sure to return them.
		if ( $saved_values ) {
			$values = explode( ',', $saved_values );

			// This modifies the original array.
			foreach ( $values as &$product ) {
				if ( is_string( $product ) && strpos( $product, '_' ) !== false ) {
					$product = explode( '_', $product )[0];
				}
			}

			$args['include'] = $values;

			if ( count( $values ) > $fetch_limit ) {
				$args['limit'] = count( $values );
			}
		}

		$products_raw = wc_get_products( $args );
		$products     = array();

		foreach ( $products_raw as $product ) {
			$data       = $product->get_data();
			$products[] = array(
				'value' => $data['id'],
				'label' => $data['name'],
			);

			// If variable pricing is enabled and the product has variable prices,
			// add those as well.
			if ( $enable_variable_pricing & $product->is_type( 'variable' ) ) {
				$variations = $product->get_children();

				if ( ! empty( $variations ) ) {
					foreach ( $variations as $variation ) {
						$var_price_id     = $data['id'] . '_' . $variation;
						$variation_object = wc_get_product( $variation );
						$variation_data   = $variation_object->get_data();
						$products[]       = array(
							'value' => $var_price_id,
							'label' => $variation_data['name'],
						);
					}
				}
			}
		}

		return $products;
	}

	/**
	 * Easy Digital Downloads: Fetch the available published downloads.
	 *
	 * @since 3.1.0
	 *
	 * @param string $request_type  The request type.
	 * @param array  $settings      All plugin settings.
	 * @param string $integration   The specific intregration variables being fetched, if any.
	 * @param string $search_term   The term being searched for.
	 * @param string $saved_values  Any currently saved values.
	 *
	 * @return array                All published downloads.
	 */
	public static function get_edd_products( $request_type, $settings, $integration, $search_term, $saved_values ) {
		if (
			'simplified' === $request_type ||
			! class_exists( 'Easy_Digital_Downloads' ) ||
			! self::is_integration_enabled( 'edd', $settings ) ||
			( $integration && 'edd' !== $integration )
		) {
			return array();
		}

		$settings = get_option( 'block_visibility_settings' );

		// Check to see if variable pricing is enabled.
		if ( isset( $settings['visibility_controls']['edd']['enable_variable_pricing'] ) ) {
			$enable_variable_pricing = $settings['visibility_controls']['edd']['enable_variable_pricing'];
		} else {
			$enable_variable_pricing = true;
		}

		$fetch_limit = 25;

		$args = array(
			'post_type'      => 'download',
			'post_status'    => 'publish',
			'posts_per_page' => $fetch_limit,
			'orderby'        => 'name',
			'order'          => 'ASC',
			'no_found_rows'  => true,
		);

		if ( $search_term && 'false' !== $search_term ) {
			$args['s'] = $search_term;
		}

		// If there are saved values, make sure to return them.
		if ( $saved_values ) {
			$values = explode( ',', $saved_values );

			// This modifies the original array.
			foreach ( $values as &$product ) {
				if ( is_string( $product ) && strpos( $product, '_' ) !== false ) {
					$product = explode( '_', $product )[0];
				}
			}

			$args['include'] = $values;

			if ( count( $values ) > $fetch_limit ) {
				$args['posts_per_page'] = count( $values );
			}
		}

		$downloads_raw = get_posts( $args );
		$downloads     = array();

		foreach ( $downloads_raw as $download ) {

			$downloads[] = array(
				'value' => $download->ID,
				'label' => $download->post_title,
			);

			$has_variable_pricing = edd_has_variable_prices( $download->ID );

			// If variable pricing is enabled and the product has variable prices,
			// add those as well.
			if ( $enable_variable_pricing && $has_variable_pricing ) {
				$prices = edd_get_variable_prices( $download->ID );

				foreach ( $prices as $key => $price ) {
					$downloads[] = array(
						'value' => $download->ID . '_' . $key,
						'label' => $download->post_title . ' - ' . esc_html( $price['name'] ),
					);
				}
			}
		}

		return $downloads;
	}

	/**
	 * Check if a specific integration is enabled based on settings.
	 *
	 * @since 3.1.0
	 *
	 * @param string $integration The name or identifier of the integration to check.
	 * @param array  $settings    An array of plugin settings.
	 *
	 * @return bool Whether the integration is enabled (true) or disabled (false).
	 */
	public static function is_integration_enabled( $integration, $settings ) {
		return isset( $settings['visibility_controls'][ $integration ]['enable'] )
			? $settings['visibility_controls'][ $integration ]['enable']
			: true;
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
					'description' => __( 'The roles assigned to the current user.', 'block-visibility' ),
					'type'        => 'array',
					'readonly'    => true,
				),
				'user_roles'           => array(
					'description' => __( 'The available user roles on the site.', 'block-visibility' ),
					'type'        => 'array',
					'readonly'    => true,
				),
				'plugin_variables'     => array(
					'description' => __( 'An array of plugin variables, such as version number.', 'block-visibility' ),
					'type'        => 'array',
					'readonly'    => true,
				),
				'is_full_control_mode' => array(
					'description' => __( 'An indicator to determine if full control mode is enabled.', 'block-visibility' ),
					'type'        => 'boolean',
					'readonly'    => true,
				),
				'is_pro'               => array(
					'description' => __( 'An indicator to determine if Block Visibility Pro is enabled.', 'block-visibility' ),
					'type'        => 'boolean',
					'readonly'    => true,
				),
				'integrations'         => array(
					'description' => __( 'All integration related information.', 'block-visibility' ),
					'type'        => 'object',
					'properties'  => array(
						'acf'         => array(
							'type'       => 'object',
							'properties' => array(
								'active' => array(
									'type' => 'boolean',
								),
								'fields' => array(
									'type' => 'array',
								),
							),
						),
						'edd'         => array(
							'type'       => 'object',
							'properties' => array(
								'active'   => array(
									'type' => 'boolean',
								),
								'products' => array(
									'type' => 'array',
								),
							),
						),
						'woocommerce' => array(
							'type'       => 'object',
							'properties' => array(
								'active'   => array(
									'type' => 'boolean',
								),
								'products' => array(
									'type' => 'array',
								),
							),
						),
						'wp_fusion'   => array(
							'type'       => 'object',
							'properties' => array(
								'active'         => array(
									'type' => 'boolean',
								),
								'tags'           => array(
									'type' => 'array',
								),
								'exclude_admins' => array(
									'type' => 'boolean',
								),
							),
						),
					),
					'readonly'    => true,
				),
			),
		);

		$this->schema = apply_filters(
			'block_visibility_rest_variables_schema',
			$schema
		);

		return $this->schema;
	}
}
