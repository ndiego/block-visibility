<?php
/**
 * Plugin Name:         Block Visibility
 * Plugin URI:          http://www.outermost.co/
 * Description:         Block-based visibility control for WordPress
 * Version:             0.1.0
 * Requires at least:   5.4
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

namespace BlockVisibility;

if ( ! defined( 'ABSPATH' ) ) {
   exit; // Exit if accessed directly.
}

define( 'BV_VERSION', '0.1.0' );
define( 'BV_PLUGIN_FILE', __FILE__ );
define( 'BV_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'BV_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'BV_PLUGIN_BASE', plugin_basename( __FILE__ ) );
define( 'BV_REVIEW_URL', 'https://wordpress.org/support/plugin/block-visibility/reviews/?filter=5' );
define( 'BV_SUPPORT_URL', 'https://wordpress.org/support/plugin/block-visibility/' );
define( 'BV_SETTINGS_URL', admin_url( 'options-general.php?page=block-visibility-settings' ) );


if ( ! class_exists( 'BlockVisibility' ) ) {
	/**
	 * Main Block Visibility Class.
	 *
	 * @since 1.0.0
	 */
	final class BlockVisibility {
		/**
		 * Return singleton instance of the Block Visibility plugin.
		 *
		 * @since 1.0.0
		 * @return self
		 */
		public static function factory() {
            static $instance = false;

			if ( ! $instance ) {
				$instance = new self();
				$instance->init();
				$instance->includes();
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
            
            // Needs to be included at all times due to show_in_rest
            require_once BV_PLUGIN_DIR . 'includes/register-settings.php';
            
            // Only include in the admin
			if ( is_admin() || ( defined( 'WP_CLI' ) && WP_CLI ) ) {
                require_once BV_PLUGIN_DIR . 'includes/admin/editor.php';
                require_once BV_PLUGIN_DIR . 'includes/admin/settings.php';
				require_once BV_PLUGIN_DIR . 'includes/admin/plugin-action-links.php';
                
                // Utility functions
                require_once BV_PLUGIN_DIR . 'includes/utils/get-asset-file.php';
                require_once BV_PLUGIN_DIR . 'includes/utils/get-user-roles.php';
			}
            
            // Only include on the frontend
            if ( ! is_admin() ){
                require_once BV_PLUGIN_DIR . 'includes/frontend/render-block.php';
            }
		}

		/**
		 * Load required actions.
		 *
         * @since 1.0.0
		 * @return void
		 */
		public function init() {
			add_action( 'plugins_loaded', array( $this, 'load_textdomain' ), 99 );
			add_action( 'enqueue_block_editor_assets', array( $this, 'block_localization' ) );
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
                basename( BV_PLUGIN_DIR ) . '/languages'
            );
		}

		/**
         * Enqueue localization data for our blocks.
         * @// TODO: fix script identifier
         * @// TODO: figure out how to load translators for the settings js
		 *
		 * @since 2.0.0
         * @return void
		 */
		public function block_localization() {
			if ( function_exists( 'wp_set_script_translations' ) ) {
				wp_set_script_translations(
                    'bv-editor-scripts',
                    'block-visibility',
                    BV_PLUGIN_DIR . '/languages'
                );
                
                wp_set_script_translations(
                    'bv-setting-scripts',
                    'block-visibility',
                    BV_PLUGIN_DIR . '/languages'
                );
			}
		}

	}
}

/**
 * The main function for that returns the Block Visibility class
 *
 * @since 1.0.0
 * @return object|BlockVisibility
 */
function load_plugin() {
	return BlockVisibility::factory();
}

// Get the plugin running. Load on plugins_loaded action to avoid issue on multisite.
if ( function_exists( 'is_multisite' ) && is_multisite() ) {
	add_action( 'plugins_loaded', __NAMESPACE__ . 'load_plugin', 90 );
} else {
	load_plugin();
}
