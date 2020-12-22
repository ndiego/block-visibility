<?php
/**
 * Plugin Name:         Block Visibility
 * Plugin URI:          https://www.blockvisibilitywp.com/
 * Description:         Block Visibility provides visibility controls and scheduling functionality to all WordPress blocks.
 * Version:             1.4.0
 * Requires at least:   5.5
 * Requires PHP:        5.6
 * Author:              Nick Diego
 * Author URI:          https://www.nickdiego.com
 * License:             GPLv2
 * License URI:         https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain:         block-visibility
 * Domain Path:         /languages
 *
 * @package block-visibility
 */

defined( 'ABSPATH' ) || exit;

// Plugin version.
if ( ! defined( 'BLOCK_VISIBILITY_VERSION' ) ) {
	define( 'BLOCK_VISIBILITY_VERSION', '1.4.0' );
}

// Plugin folder path.
if ( ! defined( 'BLOCK_VISIBILITY_PLUGIN_DIR' ) ) {
	define( 'BLOCK_VISIBILITY_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

// Plugin folder url.
if ( ! defined( 'BLOCK_VISIBILITY_PLUGIN_URL' ) ) {
	define( 'BLOCK_VISIBILITY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

// Plugin Base File.
if ( ! defined( 'BLOCK_VISIBILITY_PLUGIN_BASE' ) ) {
	define( 'BLOCK_VISIBILITY_PLUGIN_BASE', plugin_basename( __FILE__ ) );
}

// Plugin settings page url.
if ( ! defined( 'BLOCK_VISIBILITY_SUPPORT_URL' ) ) {
	define( 'BLOCK_VISIBILITY_SUPPORT_URL', 'https://wordpress.org/support/plugin/block-visibility/' );
}

// Plugin settings page url.
if ( ! defined( 'BLOCK_VISIBILITY_SETTINGS_URL' ) ) {
	define( 'BLOCK_VISIBILITY_SETTINGS_URL', admin_url( 'options-general.php?page=block-visibility-settings' ) );
}

if ( ! class_exists( 'Block_Visibility' ) ) {

	/**
	 * Main Block Visibility Class.
	 *
	 * @since 1.0.0
	 */
	final class Block_Visibility {

		/**
		 * Initialise the plugin.
		 */
		private function __construct() {

			// Load the rest of the plugin.
			$this->includes();
			$this->actions();
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
				esc_html__( 'Something went wrong.', 'block-visibility' ),
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
				esc_html__( 'Something went wrong.', 'block-visibility' ),
				'1.0'
			);
		}

		/**
		 * Include required files.
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public function includes() {

			// Needs to be included at all times due to show_in_rest.
			require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/register-settings.php';
			require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/rest-api/register-routes.php';

			// Utility functions that are also used by register-routes.php so
			// needs to be included at all times.
			require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/utils/user-functions.php';

			// Only include in the admin.
			if ( is_admin() || ( defined( 'WP_CLI' ) && WP_CLI ) ) {
				require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/admin/editor.php';
				require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/admin/settings.php';
				require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/admin/plugin-action-links.php';

				// Utility functions.
				require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/utils/get-asset-file.php';
			}

			// Only include on the frontend.
			if ( ! is_admin() ) {
				require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/frontend/render-block.php';
			}
		}

		/**
		 * Load required actions.
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public function actions() {
			add_action( 'wp_loaded', array( $this, 'add_attributes_to_registered_blocks' ), 100 );
			add_action( 'plugins_loaded', array( $this, 'load_textdomain' ), 99 );
			add_action( 'enqueue_block_editor_assets', array( $this, 'block_localization' ) );
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

			foreach ( $registered_blocks as $name => $block ) {
				$block->attributes['blockVisibility'] = array(
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
						'startDateTime'         => array(
							'type' => 'string',
						),
						'endDateTime'           => array(
							'type' => 'string',
						),
					),
					'default'    => array(
						'hideBlock'        => false,
						'visibilityByRole' => 'all',
						'restrictedRoles'  => array(),
						'startDateTime'    => '',
						'endDateTime'      => '',
					),
				);
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
				basename( BLOCK_VISIBILITY_PLUGIN_DIR ) . '/languages'
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
					BLOCK_VISIBILITY_PLUGIN_DIR . '/languages'
				);

				wp_set_script_translations(
					'block-visibility-setting-scripts',
					'block-visibility',
					BLOCK_VISIBILITY_PLUGIN_DIR . '/languages'
				);
			}
		}

		/**
		 * Return singleton instance of the Block Visibility plugin.
		 *
		 * @since 1.0.0
		 * @return self
		 */
		public static function instance() {
			static $instance = false;

			if ( ! $instance ) {
				$instance = new self();
			}
			return $instance;
		}
	}
}

/**
 * The main function that returns the Block Visibility class
 *
 * @since 1.0.0
 * @return object|Block_Visibility
 */
function block_visibility_load_plugin() {
	return Block_Visibility::instance();
}

// Get the plugin running.
add_action( 'plugins_loaded', 'block_visibility_load_plugin' );
