<?php
/**
 * Add links to plugin listing in admin.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Admin;

defined( 'ABSPATH' ) || exit;

/**
 * Adds link to Settings page in plugin action links.
 *
 * @since 1.0.0
 *
 * @param array  $plugin_links Already defined action links.
 * @param string $plugin_file Plugin file path and name being processed.
 * @return array $plugin_links The new array of action links.
 */
function add_plugin_action_links( $plugin_links, $plugin_file ) {

	// If we are not on the correct plugin, abort.
	if ( BLOCK_VISIBILITY_PLUGIN_BASENAME !== $plugin_file ) {
		return $plugin_links;
	}

	$pro_link = '<a href="https://blockvisibilitywp.com/pro/" aria-label="' . esc_attr( __( 'Upgrade to Block Visibility Pro.', 'block-visibility' ) ) . '" style="font-weight:bold" target="_blank">';
	$pro_link .= __( 'Get Pro', 'block-visibility' );
	$pro_link .= '</a>';

	$settings_link  = '<a href="' . BLOCK_VISIBILITY_SETTINGS_URL . '" aria-label="' . esc_attr( __( 'Navigate to the Block Visibility settings.', 'block-visibility' ) ) . '">';
	$settings_link .= __( 'Settings', 'block-visibility' );
	$settings_link .= '</a>';

	array_unshift( $plugin_links, $settings_link );

	// Only display the Pro upsell link if the plugin is not active.
	if ( ! defined( 'BVP_VERSION' ) ) {
		array_unshift( $plugin_links, $pro_link );
	}

	return $plugin_links;
}
add_filter( 'plugin_action_links', __NAMESPACE__ . '\add_plugin_action_links', 10, 2 );

/**
 * Adds additional plugin row meta links.
 *
 * @since 1.0.0
 *
 * @param array  $plugin_meta An array of the plugin's metadata.
 * @param string $plugin_file Path to the plugin file.
 * @return array $plugin_meta Updated plugin metadata.
 */
function add_plugin_row_meta( $plugin_meta, $plugin_file ) {

	// If we are not on the correct plugin, abort.
	if ( BLOCK_VISIBILITY_PLUGIN_BASENAME !== $plugin_file ) {
		return $plugin_meta;
	}

	$getting_started  = '<a href="https://www.blockvisibilitywp.com/knowledge-base/guide-to-getting-started-with-block-visibility/" aria-label="' . esc_attr( __( 'Navigate to the Block Visibility Getting Started page.', 'block-visibility' ) ) . '" target="_blank">';
	$getting_started .= __( 'Getting Started', 'block-visibility' );
	$getting_started .= '</a>';

	$review_link  = '<a href="https://wordpress.org/support/plugin/block-visibility/reviews/?filter=5" aria-label="' . esc_attr( __( 'Review Block Visibility on WordPress.org', 'block-visibility' ) ) . '" target="_blank">';
	$review_link .= __( 'Leave a Review', 'block-visibility' );
	$review_link .= '</a>';

	$row_meta = array(
		'getting_started' => $getting_started,
		'review'          => $review_link,
	);

	$plugin_meta = array_merge( $plugin_meta, $row_meta );

	return $plugin_meta;
}
add_filter( 'plugin_row_meta', __NAMESPACE__ . '\add_plugin_row_meta', 10, 2 );
