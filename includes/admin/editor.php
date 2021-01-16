<?php
/**
 * Add assets for the block editor
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Admin;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\get_asset_file as get_asset_file;
use function BlockVisibility\Utils\get_user_roles as get_user_roles;

/**
 * Enqueue plugin specific editor scripts and styles
 *
 * @since 1.0.0
 */
function enqueue_editor_assets() {

	/**
	 * Since we are using admin_init, we need to make sure the js is only loaded
	 * on pages with the Block Editor, this includes FSE pagess.
	 */
	if ( ! is_block_editor_page() ) {
		return;
	}

	// Scripts.
	$asset_file = get_asset_file( 'dist/block-visibility-editor' );

	wp_enqueue_script(
		'block-visibility-editor-scripts',
		BLOCK_VISIBILITY_PLUGIN_URL . 'dist/block-visibility-editor.js',
		array_merge( $asset_file['dependencies'], array( 'wp-api' ) ),
		$asset_file['version'],
		false // Need false to ensure our filters can target third-party plugins.
	);

	// Create a global variable to indicate whether we are in full control mode
	// or not. This is needed for the Block Visibility attribute filter since
	// it will not allow us to fetch this data directly.
	$is_full_control_mode .= 'const blockVisibilityFullControlMode = ' . wp_json_encode( is_full_control_mode() ) . ';';

	wp_add_inline_script(
		'block-visibility-editor-scripts',
		$is_full_control_mode,
		'before'
	);

	// Styles.
	$asset_file = get_asset_file( 'dist/block-visibility-editor-styles' );

	wp_enqueue_style(
		'block-visibility-editor-styles',
		BLOCK_VISIBILITY_PLUGIN_URL . 'dist/block-visibility-editor-styles.css',
		array(),
		$asset_file['version']
	);
}

/**
 * Need to add at admin_init instead of the normal enqueue_block_editor_assets
 * so that our attributes load for third-party blocks. Hopefully this will be
 * resolved in future releases of WP. Using enqueue_block_editor_assets is the
 * ideal implementation. The primary culprit is Jetpack blocks.
 */
add_action( 'admin_init', __NAMESPACE__ . '\enqueue_editor_assets', 10000 );

/**
 * Make sure we are on a page with the Block Editor, this include FSE pages.
 *
 * @since 1.0.0
 *
 * @return bool Returns true or false.
 */
function is_block_editor_page() {
	global $pagenow;

	return (
		is_admin() &&
		( 'post.php' === $pagenow || 'post-new.php' === $pagenow || 'admin.php' === $pagenow )
	);
}

/**
 * See if we are in full control mode.
 *
 * @since 1.0.0
 *
 * @return bool Returns true or false.
 */
function is_full_control_mode() {
	$settings = get_option( 'block_visibility_settings' );

	if ( isset( $settings['plugin_settings']['enable_full_control_mode'] ) ) {
		return $settings['plugin_settings']['enable_full_control_mode'];
	} else {
		return false;
	}
}
