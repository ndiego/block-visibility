<?php
/**
 * Plugin Name:         Block Visibility
 * Plugin URI:          http://www.outermost.co/
 * Description:         Control the visibility of any block.
 * Version:             0.1.0
 * Requires at least:   5.2
 * Requires PHP:        5.6
 * Author:              Nick Diego
 * Author URI:          https://www.nickdiego.com
 * License:             GPLv2
 * License URI:         https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain:         block-visibility
 * Domain Path:         /languages/
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
			//require_once BV_PLUGIN_DIR . 'includes/class-gfpa-block-assets.php';
            //require_once BV_PLUGIN_DIR . 'includes/get-dynamic-blocks.php';

			if ( is_admin() || ( defined( 'WP_CLI' ) && WP_CLI ) ) {
				require_once BV_PLUGIN_DIR . 'includes/admin/plugin-action-links.php';
                require_once BV_PLUGIN_DIR . 'includes/admin/settings.php';
                //require_once BV_PLUGIN_DIR . 'includes/admin/class-gfpa-install.php';
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
         * @TODO Figure this out
		 * If debug is on, serve unminified source assets.
		 *
		 * @since 1.0.0
		 * @param string|string $type The type of resource.
		 * @param string|string $directory Any extra directories needed.
		 */
		/*public function asset_source( $type = 'js', $directory = null ) {

			if ( 'js' === $type ) {
				return GFPA_PLUGIN_URL . 'dist/' . $type . '/' . $directory;
			} else {
				return GFPA_PLUGIN_URL . 'dist/css/' . $directory;
			}
		}*/

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
		 *
		 * @since 2.0.0
         * @return void
		 */
		public function block_localization() {
			if ( function_exists( 'wp_set_script_translations' ) ) {
				wp_set_script_translations( 
                    'EDIT-genesis-featured-page-advanced-editor-js', 
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

