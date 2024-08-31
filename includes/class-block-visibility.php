<?php
/**
 * Main Block Visibility Class.
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
class Block_Visibility {

	/**
	 * Initialize the plugin.
	 *
	 * @since 3.6.0
	 */
	public function init() {
		$this->includes();
		$this->init_hooks();
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

		// Visibility presets.
		include_once BLOCK_VISIBILITY_ABSPATH . 'includes/presets/register-presets.php';

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
	 * Initialize hooks.
	 *
	 * @since 1.0.0
	 */
	public function init_hooks() {
		add_action( 'init', array( $this, 'load_textdomain' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'editor_scripts_localization' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'setting_scripts_localization' ) );
		add_action( 'wp_loaded', array( $this, 'add_attributes_to_registered_blocks' ), 999 );
		add_filter( 'rest_pre_dispatch', array( $this, 'conditionally_remove_attributes' ), 10, 3 );
		add_action( 'admin_notices', array( $this, 'pro_deprecation_message' ) );
	}

	/**
	 * Add the blockVisibility attribute to all registered blocks.
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
	 * Fix REST API issue with blocks rendered server-side.
	 *
	 * Without this, server-side blocks will not load in the block editor when visibility
	 * controls have been added.
	 *
	 * @see https://github.com/phpbits/block-options/blob/f741344033a2c9455828d039881616f77ef109fe/includes/class-editorskit-post-meta.php#L82-L112
	 *
	 * @since 1.7.0
	 *
	 * @param mixed  $result  Response to replace the requested version with.
	 * @param object $server  Server instance.
	 * @param object $request Request used to generate the response.
	 * @return mixed Returns updated results.
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
	 * Load the plugin text domain for translation.
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
	 * Enqueue localization data for editor scripts.
	 *
	 * @since 1.0.0
	 */
	public function editor_scripts_localization() {
		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations(
				'block-visibility-editor-scripts',
				'block-visibility',
				BLOCK_VISIBILITY_ABSPATH . '/languages'
			);
		}
	}

	/**
	 * Enqueue localization data for setting page scripts.
	 *
	 * @since 2.6.0
	 */
	public function setting_scripts_localization() {
		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations(
				'block-visibility-setting-scripts',
				'block-visibility',
				BLOCK_VISIBILITY_ABSPATH . '/languages'
			);
		}
	}

	/**
	 * Display a notice that Block Visibility Pro is no longer needed.
	 *
	 * @since 3.1.0
	 */
	public function pro_deprecation_message() {
		if ( ! defined( 'BVP_VERSION' ) ) {
			return;
		}

		$message = __(
			'Block Visibility Pro is no longer required. All functionality has been moved to Block Visibility, and future enhancements will only be added to the base plugin. It is now safe to deactivate and delete Pro.			',
			'block-visibility'
		);

		?>
		<div class="notice notice-warning">
			<p><?php echo esc_html( $message ); ?></p>
		</div>
		<?php
	}
}
