<?php
/**
* Plugin Name: 		Block Visibility
* Plugin URI: 		http://www.outermost.co/
* Description: 		Control the visibility of any block.
* Author: 			Nick Diego
* Author URI: 		https://www.nickdiego.com
* Version: 			0.1.0
* Text Domain: 		block-visibility
* Domain Path: 		/languages
* Tested up to: 	5.4
* License: 			GPLv2
*
* Block Visibility is free software: you can redistribute it and/or
* modify it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 2 of the License, or
* any later version.
*
* You should have received a copy of the GNU General Public License
* along with Block Visibility. If not, see <http://www.gnu.org/licenses/>.
*
* @package BlockVisibility
*/

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
   exit;
}

define( 'BLOCK_VISIBILITY_VERSION', '0.1.0' );
define( 'BLOCK_VISIBILITY_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'BLOCK_VISIBILITY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'BLOCK_VISIBILITY_PLUGIN_FILE', __FILE__ );
define( 'BLOCK_VISIBILITY_PLUGIN_BASE', plugin_basename( __FILE__ ) );
define( 'BLOCK_VISIBILITY_REVIEW_URL', 'https://wordpress.org/support/plugin/block-visibility/reviews/?filter=5' );


if ( ! class_exists( 'BlockVisibility' ) ) :
	/**
	 * Main Block Visibility Class.
	 *
	 * @since 1.0.0
	 */
	final class BlockVisibility {
		/**
		 * This plugin's instance.
		 *
		 * @var BlockVisibility
		 * @since 1.0.0
		 */
		private static $instance;

		/**
		 * Main Block Visibility Instance.
		 *
		 * Insures that only one instance of Block Visibility exists in memory at any one
		 * time. Also prevents needing to define globals all over the place.
		 *
		 * @since 1.0.0
		 * @return object|BlockVisibility 
		 */
		public static function instance() {
			if ( ! isset( self::$instance ) && ! ( self::$instance instanceof BlockVisibility ) ) {
				self::$instance = new BlockVisibility();
				self::$instance->init();
				self::$instance->includes();
			}
			return self::$instance;
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
		private function includes() {
			require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/class-gfpa-block-assets.php';
            require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/get-dynamic-blocks.php';
            
            require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/class-gfpa-widget.php';

			if ( is_admin() || ( defined( 'WP_CLI' ) && WP_CLI ) ) {
				require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/admin/class-gfpa-action-links.php';
                require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/admin/class-gfpa-install.php';
			}
		}

		/**
		 * Load required actions.
		 *
         * @since 1.0.0
		 * @return void
		 */
		private function init() {
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
                basename( BLOCK_VISIBILITY_PLUGIN_DIR ) . '/languages' 
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
                    BLOCK_VISIBILITY_PLUGIN_DIR . '/languages' 
                );
			}
		}
                
	}
endif;

/**
 * The main function for that returns the Block Visibility class
 *
 * @since 1.0.0
 * @return object|BlockVisibility 
 */
function load_block_visibility() {
	return BlockVisibility::instance();
}

// Get the plugin running. Load on plugins_loaded action to avoid issue on multisite.
if ( function_exists( 'is_multisite' ) && is_multisite() ) {
	add_action( 'plugins_loaded', 'load_block_visibility', 90 );
} else {
	load_block_visibility();
}

