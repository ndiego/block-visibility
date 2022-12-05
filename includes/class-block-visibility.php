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
	 */
	public function actions() {
		add_action( 'init', array( $this, 'load_textdomain' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'block_localization' ) );

		// Specific fixes/work arounds for server-side blocks.
		add_action( 'wp_loaded', array( $this, 'add_attributes_to_registered_blocks' ), 999 );
		add_filter( 'rest_pre_dispatch', array( $this, 'conditionally_remove_attributes' ), 10, 3 );

		// Display Pro compatibility message if needed.
		add_action( 'admin_notices', array( $this, 'pro_compatibility_message' ) );
	}

	/**
	 * Include required files.
	 *
	 * @since 1.0.0
	 */
	public function includes() {

		// Needs to be included at all times due to show_in_rest.
		include_once BLOCK_VISIBILITY_ABSPATH . 'includes/register-settings.php';
		include_once BLOCK_VISIBILITY_ABSPATH . 'includes/rest-api/register-routes.php';

		// Utility functions that are also used by register-routes.php so
		// needs to be included at all times.
		include_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/user-functions.php';

		// Only include in the admin.
		if ( is_admin() && ! ( defined( 'DOING_AJAX' ) && DOING_AJAX ) ) {
			include_once BLOCK_VISIBILITY_ABSPATH . 'includes/admin/editor.php';
			include_once BLOCK_VISIBILITY_ABSPATH . 'includes/admin/settings.php';
			include_once BLOCK_VISIBILITY_ABSPATH . 'includes/admin/plugin-action-links.php';

			// General utility functions.
			include_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/get-asset-file.php';
		}

		// Only include on the frontend.
		if ( ! is_admin() ) {
			include_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/render-block.php';
		}
	}

	/**
	 * Define the contants for the Block Visibility plugin.
	 *
	 * @since 1.4.0
	 */
	private function define_constants() {
		$this->define( 'BLOCK_VISIBILITY_ABSPATH', dirname( BLOCK_VISIBILITY_PLUGIN_FILE ) . '/' );
		$this->define( 'BLOCK_VISIBILITY_VERSION', get_file_data( BLOCK_VISIBILITY_PLUGIN_FILE, [ 'Version' ] )[0] ); // phpcs:ignore
		$this->define( 'BLOCK_VISIBILITY_PLUGIN_URL', plugin_dir_url( BLOCK_VISIBILITY_PLUGIN_FILE ) );
		$this->define( 'BLOCK_VISIBILITY_PLUGIN_BASENAME', plugin_basename( BLOCK_VISIBILITY_PLUGIN_FILE ) );
		$this->define( 'BLOCK_VISIBILITY_SETTINGS_URL', admin_url( 'options-general.php?page=block-visibility-settings' ) );
	}

	/**
	 * Define constant if not already set.
	 *
	 * @since 1.4.0
	 *
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
	 * ServerSideRender component. Registering the attributes only in js
	 * can cause an error message to appear. Registering the attributes in
	 * PHP as well, seems to resolve the issue. Ideally, this bug will be
	 * fixed in the future.
	 *
	 * Reference: https://github.com/WordPress/gutenberg/issues/16850
	 *
	 * @since 1.0.0
	 */
	public function add_attributes_to_registered_blocks() {

		$registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

		foreach ( $registered_blocks as $name => $block ) {
			$block->attributes['blockVisibility'] = array( 'type' => 'object' );
		}
	}

	/**
	 * Fix REST API issue with blocks rendered server-side. Without this,
	 * server-side blocks will not load in the block editor when visibility
	 * controls have been added.
	 *
	 * Reference: https://github.com/phpbits/block-options/blob/f741344033a2c9455828d039881616f77ef109fe/includes/class-editorskit-post-meta.php#L82-L112
	 *
	 * @since 1.7.0
	 *
	 * @param mixed  $result  Response to replace the requested version with.
	 * @param object $server  Server instance.
	 * @param object $request Request used to generate the response.
	 *
	 * @return array Returns updated results.
	 */
	public function conditionally_remove_attributes( $result, $server, $request ) { // phpcs:ignore

		if ( strpos( $request->get_route(), '/wp/v2/block-renderer' ) !== false ) {

			if ( isset( $request['attributes'] ) && isset( $request['attributes']['blockVisibility'] ) ) {

				$attributes = $request['attributes'];
				unset( $attributes['blockVisibility'] );
				$request['attributes'] = $attributes;
			}
		}

		return $result;
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @since 1.0.0
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

	/**
	 * Display a Pro compatibility warning message if needed.
	 *
	 * @since 2.6.0
	 */
	public function pro_compatibility_message() {

		if ( ! defined( 'BVP_VERSION' ) ) {
			return;
		}

		$required_pro_version = '1.6.0';

		// If the current version is at or above the required version, bail.
		if ( BVP_VERSION >= $required_pro_version ) {
			return;
		}

		$message = sprintf(
			// Translators: The required version of Block Visibility Pro and the current version of Block Visibility.
			__(
				'Version Error: Please upgrade Block Visibility Pro to version %1$s or greater. The current active version (%2$s) is not compatible with Block Visibility %3$s.',
				'block-visibility-pro'
			),
			$required_pro_version,
			BVP_VERSION,
			BLOCK_VISIBILITY_VERSION
		);
		
		?>
		<div class="notice notice-error">
			<p><?php echo esc_html( $message ); ?></p>
		</div>
		<?php
	}
}
