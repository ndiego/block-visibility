<?php
/**
 * Plugin Name:         Block Visibility
 * Plugin URI:          https://www.blockvisibilitywp.com/
 * Description:         Provides visibility controls and scheduling functionality to all WordPress blocks.
 * Version:             3.7.1
 * Requires at least:   6.5
 * Requires PHP:        7.4
 * Author:              Nick Diego
 * Author URI:          https://www.nickdiego.com
 * License:             GPL-2.0-or-later
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:         block-visibility
 * Domain Path:         /languages
 *
 * @package block-visibility
 */

namespace BlockVisibility;

defined( 'ABSPATH' ) || exit;

define( 'BLOCK_VISIBILITY_VERSION', '3.7.1' );
define( 'BLOCK_VISIBILITY_PLUGIN_FILE', __FILE__ );
define( 'BLOCK_VISIBILITY_ABSPATH', dirname( BLOCK_VISIBILITY_PLUGIN_FILE ) . '/' );
define( 'BLOCK_VISIBILITY_PLUGIN_URL', plugin_dir_url( BLOCK_VISIBILITY_PLUGIN_FILE ) );
define( 'BLOCK_VISIBILITY_PLUGIN_BASENAME', plugin_basename( BLOCK_VISIBILITY_PLUGIN_FILE ) );
define( 'BLOCK_VISIBILITY_SETTINGS_URL', admin_url( 'options-general.php?page=block-visibility-settings' ) );

// Include the main Block_Visibility class.
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/class-block-visibility.php';

/**
 * Initialize the Block Visibility plugin.
 *
 * @since 3.6.0
 *
 * @return void
 */
function init() {
	$plugin = new \Block_Visibility();
	$plugin->init();
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\init' );
