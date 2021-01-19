<?php
/**
 * Uninstall Block Visibility
 *
 * Deletes all plugin settings. Does not currently remove block attributes.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility;

// Exit if accessed directly.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Load main plugin file.
require_once 'block-visibility.php';

global $wpdb;

$blockvisibility_settings = get_option( 'block_visibility_settings' );

// Delete all Block Visibility settings.
if ( $blockvisibility_settings['plugin_settings']['remove_on_uninstall'] ) {
	delete_option( 'block_visibility_settings' );
}
