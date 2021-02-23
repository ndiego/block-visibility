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
	$is_full_control_mode = 'const blockVisibilityFullControlMode = ' . is_full_control_mode() . ';';

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
 * Dequeue our editor assets on pages without the Block Editor.
 *
 * Since we are forced to use admin_init to enqueue our editor assets, this
 * causes the files to be loaded on admin pages without the Block Editor, which
 * can cause conflicts with other plugins, notably ACF. This fixes that.
 *
 * We have to do this at admin_enqueue_scripts because get_current_screen() is
 * not available yet at admin_init.
 *
 * @since 1.4.2
 */
function dequeue_editor_assets_on_pages_without_block_editor() {

	$current_screen = get_current_screen();

	if (
		! method_exists( $current_screen, 'is_block_editor' ) ||
		! $current_screen->is_block_editor()
	) {
		wp_dequeue_script( 'block-visibility-editor-scripts' );
		wp_dequeue_style( 'block-visibility-editor-styles' );
	}
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\dequeue_editor_assets_on_pages_without_block_editor' );

/**
 * See if we are in full control mode.
 *
 * @since 1.0.0
 *
 * @return bool Returns true or false.
 */
function is_full_control_mode() {
	$settings = get_option( 'block_visibility_settings' );
	$enabled  = false;

	if ( isset( $settings['plugin_settings']['enable_full_control_mode'] ) ) {
		if ( $settings['plugin_settings']['enable_full_control_mode'] ) {
			$enabled = true;
		}
	}

	return wp_json_encode( $enabled );
}
