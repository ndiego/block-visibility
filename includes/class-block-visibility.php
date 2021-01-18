<?php
/**
 * Setup Block Visibility
 *
 * @package block-visibility
 * @since   1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Main Block Visibility Class.
 *
 * @since 1.0.0
 */
final class Block_Visibility {

	/**
	 * Block Visibility version.
	 *
	 * @since 1.4.0
	 * @var string
	 */
	public $version = '1.4.1';

	/**
	 * Return singleton instance of the Block Visibility plugin.
	 *
	 * @since 1.0.0
	 * @return Block_Visibility
	 */
	public static function instance() {
		static $instance = false;

		if ( ! $instance ) {
			$instance = new self();
		}
		return $instance;
	}

	/**
	 * Cloning instances of the class is forbidden.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __clone() {
		_doing_it_wrong(
			__FUNCTION__,
			esc_html__( 'Cloning instances of the class is forbidden.', 'block-visibility' ),
			'1.0'
		);
	}

	/**
	 * Unserializing instances of the class is forbidden.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function __wakeup() {
		_doing_it_wrong(
			__FUNCTION__,
			esc_html__( 'Unserializing instances of the class is forbidden.', 'block-visibility' ),
			'1.0'
		);
	}

	/**
	 * Initialise the plugin.
	 */
	private function __construct() {
		$this->define_constants();
		$this->includes();
		$this->actions();
	}

	/**
	 * Load required actions.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function actions() {
		add_action( 'wp_loaded', array( $this, 'add_attributes_to_registered_blocks' ), 999 );
		add_action( 'init', array( $this, 'load_textdomain' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'block_localization' ) );
	}

	/**
	 * Include required files.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function includes() {

		// Needs to be included at all times due to show_in_rest.
		include_once BLOCK_VISIBILITY_ABSPATH . 'includes/register-settings.php';
		include_once BLOCK_VISIBILITY_ABSPATH . 'includes/rest-api/register-routes.php';

		// Utility functions that are also used by register-routes.php so
		// needs to be included at all times.
		include_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/user-functions.php';

		// Only include in the admin.
		if ( is_admin() || ( defined( 'WP_CLI' ) && WP_CLI ) ) {
			include_once BLOCK_VISIBILITY_ABSPATH . 'includes/admin/editor.php';
			include_once BLOCK_VISIBILITY_ABSPATH . 'includes/admin/settings.php';
			include_once BLOCK_VISIBILITY_ABSPATH . 'includes/admin/plugin-action-links.php';

			// Utility functions.
			include_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/get-asset-file.php';
		}

		// Only include on the frontend.
		if ( ! is_admin() ) {
			include_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/render-block.php';
		}
	}

	/**
	 * Define the contants for the Block Visibility base (BVB) plugin.
	 *
	 * @since 1.4.0
	 */
	private function define_constants() {
		$this->define( 'BLOCK_VISIBILITY_ABSPATH', dirname( BLOCK_VISIBILITY_PLUGIN_FILE ) . '/' );
		$this->define( 'BLOCK_VISIBILITY_VERSION', $this->version );
		$this->define( 'BLOCK_VISIBILITY_PLUGIN_URL', plugin_dir_url( BLOCK_VISIBILITY_PLUGIN_FILE ) );
		$this->define( 'BLOCK_VISIBILITY_PLUGIN_BASENAME', plugin_basename( BLOCK_VISIBILITY_PLUGIN_FILE ) );
		$this->define( 'BLOCK_VISIBILITY_SUPPORT_URL', 'https://wordpress.org/support/plugin/block-visibility/' );
		$this->define( 'BLOCK_VISIBILITY_SETTINGS_URL', admin_url( 'options-general.php?page=block-visibility-settings' ) );
	}

	/**
	 * Define constant if not already set.
	 *
	 * @since 1.4.0
	 * @param string      $name  Constant name.
	 * @param string|bool $value Constant value.
	 */
	private function define( $name, $value ) {
		if ( ! defined( $name ) ) {
			// phpcs:ignore
			define( $name, $value );
		}
	}

	/**
	 * This is needed to resolve an issue with blocks that use the
	 * ServerSideRender component. Regustering the attributes only in js
	 * can cause an error message to appear. Registering the attributes in
	 * PHP as well, seems to resolve the issue. Ideally, this bug will be
	 * fixed in the future.
	 *
	 * Reference: https://github.com/WordPress/gutenberg/issues/16850
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function add_attributes_to_registered_blocks() {

		$registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

		$attributes = array(
			'type'       => 'object',
			'properties' => array(
				'hideBlock'             => array(
					'type' => 'boolean',
				),
				'visibilityByRole'      => array(
					'type' => 'string',
				),
				'hideOnRestrictedRoles' => array(
					'type' => 'boolean',
				),
				'restrictedRoles'       => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
				'scheduling'            => array(
					'type'       => 'object',
					'properties' => array(
						'enable' => array(
							'type' => 'boolean',
						),
						'start'  => array(
							'type' => 'string',
						),
						'end'    => array(
							'type' => 'string',
						),
					),
				),
				// Depracated attributes.
				'startDateTime'         => array(
					'type' => 'string',
				),
				'endDateTime'           => array(
					'type' => 'string',
				),
			),
		);

		$attributes = apply_filters(
			'block_visibility_attributes',
			$attributes
		);

		foreach ( $registered_blocks as $name => $block ) {
			$block->attributes['blockVisibility'] = $attributes;
		}
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'block-visibility',
			false,
			BLOCK_VISIBILITY_ABSPATH . '/languages'
		);
	}

	/**
	 * Enqueue localization data for our blocks.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function block_localization() {
		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations(
				'block-visibility-editor-scripts',
				'block-visibility',
				BLOCK_VISIBILITY_ABSPATH . '/languages'
			);

			wp_set_script_translations(
				'block-visibility-setting-scripts',
				'block-visibility',
				BLOCK_VISIBILITY_ABSPATH . '/languages'
			);
		}
	}
}
