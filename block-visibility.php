<?php
/**
 * Plugin Name:         Block Visibility
 * Plugin URI:          https://www.blockvisibilitywp.com/
 * Description:         Provides visibility controls and scheduling functionality to all WordPress blocks.
 * Version:             2.4.0
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

if ( ! defined( 'BLOCK_VISIBILITY_PLUGIN_FILE' ) ) {
	define( 'BLOCK_VISIBILITY_PLUGIN_FILE', __FILE__ );
}

if ( ! class_exists( 'Block_Visibility' ) ) {
	include_once dirname( BLOCK_VISIBILITY_PLUGIN_FILE ) . '/includes/class-block-visibility.php';
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
