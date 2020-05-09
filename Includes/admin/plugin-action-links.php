<?php
/**
 * Add links to plugin listing in admin.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Admin;

/**
 * Adds link to Settings page in plugin action links
 *
 * @since 1.0.0
 *
 * @param array $plugin_links  Already defined action links
 * @param string $plugin_file  Plugin file path and name being processed
 * @return array $plugin_links The new array of action links
 */
function add_plugin_action_links( $plugin_links, $plugin_file ) {
	
	// If we are not on the correct plugin, abort.
	if ( ! defined( 'BV_PLUGIN_BASE' ) ) {
		define( 'BV_PLUGIN_BASE', null );
	}
	
	if ( BV_PLUGIN_BASE === $plugin_file ) {
		$settings_link = '<a href="' . admin_url( 'options-general.php?page=block-visibility-settings' ) . '">' . __( 'Settings', 'block-visibility' ) . '</a>';
	
		array_push( $plugin_links, $settings_link );
	}

	return $plugin_links;
}
add_filter( 'plugin_action_links', __NAMESPACE__ . '\add_plugin_action_links', 10, 2 );

/**
 * Adds additional plugin row meta links
 *
 * @since 1.0.0
 *
 * @param array  $plugin_meta 	An array of the plugin's metadata.
 * @param string $plugin_file 	Path to the plugin file.
 * @return array $plugin_meta	Updated plugin metadata
 */
function add_plugin_row_meta( $plugin_meta, $plugin_file ) {

	// If we are not on the correct plugin, abort.
	if ( ! defined( 'BV_PLUGIN_BASE' ) ) {
		define( 'BV_PLUGIN_BASE', null );
	}

	if ( BV_PLUGIN_BASE === $plugin_file ) {
		$row_meta = array(
			'review' => '<a href="' . esc_url( BV_REVIEW_URL ) . '" aria-label="' . esc_attr( __( 'Review Block Visibility on WordPress.org', 'block-visibility' ) ) . '" target="_blank">' . __( 'Leave a Review', 'block-visibility' ) . '</a>',
		);

		$plugin_meta = array_merge( $plugin_meta, $row_meta );
	}

	return $plugin_meta;
}
add_filter( 'plugin_row_meta', __NAMESPACE__ . '\add_plugin_row_meta', 10, 2 );