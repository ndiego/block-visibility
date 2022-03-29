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
 * Enqueue plugin specific editor scripts
 *
 * @since 1.0.0
 */
function enqueue_editor_scripts() {

	// Scripts.
	$asset_file = get_asset_file( 'build/block-visibility-editor' );

	wp_enqueue_script(
		'block-visibility-editor-scripts',
		BLOCK_VISIBILITY_PLUGIN_URL . 'build/block-visibility-editor.js',
		array_merge( $asset_file['dependencies'], array( 'wp-api' ) ),
		$asset_file['version'],
		false // Need false to ensure our filters can target third-party plugins.
	);

	// Create a global variable to indicate whether we are in full control mode
	// or not. This is needed for the Block Visibility attribute filter since
	// it will not allow us to fetch this data directly.
	$is_full_control_mode = 'const blockVisibilityFullControlMode = ' . wp_json_encode( get_plugin_setting( 'enable_full_control_mode', true ) ) . ';';

	wp_add_inline_script(
		'block-visibility-editor-scripts',
		$is_full_control_mode,
		'before'
	);
}
/**
 * Need to add at admin_init instead of the normal enqueue_block_editor_assets
 * so that our attributes load for third-party blocks. Hopefully this will be
 * resolved in future releases of WP. Using enqueue_block_editor_assets is the
 * ideal implementation. The primary culprit is Jetpack blocks.
 */
add_action( 'admin_init', __NAMESPACE__ . '\enqueue_editor_scripts', 10000 );

/**
 * Enqueue plugin specific editor styles
 *
 * @TODO Move the contextual styles to add_editor_style when fixed in core.
 *
 * @since 2.0.0
 */
function enqueue_editor_styles() {

	// Styles.
	$asset_file = get_asset_file( 'build/block-visibility-editor-styles' );

	wp_enqueue_style(
		'block-visibility-editor-styles',
		BLOCK_VISIBILITY_PLUGIN_URL . 'build/block-visibility-editor-styles.css',
		array(),
		$asset_file['version']
	);

	// Load the contextual indicator styles if enabled.
	if ( get_plugin_setting( 'enable_contextual_indicators', true ) ) {

		$asset_file = get_asset_file( 'build/block-visibility-contextual-indicator-styles' );

		wp_enqueue_style(
			'block-visibility-contextual-indicator-styles',
			BLOCK_VISIBILITY_PLUGIN_URL . 'build/block-visibility-contextual-indicator-styles.css',
			array(),
			$asset_file['version']
		);

		// Allow users to customize the color of the contextual indicators.
		$custom_color = get_plugin_setting( 'contextual_indicator_color' );

		if ( $custom_color ) {
			$inline_style = '.block-visibility__has-visibility, .block-visibility__has-visibility.components-placeholder.components-placeholder, .block-visibility__has-visibility.components-placeholder { outline-color: ' . $custom_color . ' } .block-visibility__has-visibility::after { background-color: ' . $custom_color . ' }';

			wp_add_inline_style(
				'block-visibility-contextual-indicator-styles',
				$inline_style
			);
		}
	}

	if ( get_plugin_setting( 'enable_block_opacity', true ) ) {

		// Allow users to set contextual block opacity.
		$block_opacity = get_plugin_setting( 'block_opacity' );

		if ( $block_opacity ) {
			$opacity      = intval( $block_opacity ) * 0.01;
			$inline_style = '.block-visibility__has-visibility:not(.is-selected):not(.has-child-selected) > * { opacity: ' . $opacity . ' }';

			wp_add_inline_style(
				'block-visibility-editor-styles',
				$inline_style
			);
		}
	}
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_styles' );

/**
 * Enqueue editor scripts in the customizer to work with new block based Widgets
 * panel in Gutenberg and in WordPress v5.8.
 *
 * Note that this implementation is not ideal since it does not work for some
 * blocks, notably Jetpack blocks. We hope for a more permanent solution in the
 * future which will also resolve the need to use admin_init above.
 *
 * @since 1.9.1
 */
function enqueue_customizer_assets() {

	// Scripts.
	$asset_file = get_asset_file( 'build/block-visibility-editor' );

	wp_enqueue_script(
		'block-visibility-editor-scripts',
		BLOCK_VISIBILITY_PLUGIN_URL . 'build/block-visibility-editor.js',
		array_merge( $asset_file['dependencies'], array( 'wp-api' ) ),
		$asset_file['version'],
		false // Need false to ensure our filters can target third-party plugins.
	);
}
add_action( 'customize_controls_enqueue_scripts', __NAMESPACE__ . '\enqueue_customizer_assets' );

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

	$should_dequeue = true;

	if ( is_callable( 'get_current_screen' ) ) {

		if (
			get_current_screen()->is_block_editor ||
			'appearance_page_gutenberg-widgets' === get_current_screen()->base || // The block-based widgets screen added by Gutenberg.
			'gutenberg_page_gutenberg-navigation' === get_current_screen()->base || // The block-based navigation screen added by Gutenberg.
			'customize' === get_current_screen()->base // The customizer, which includes block-based widgets.
		) {
			$should_dequeue = false;
		}
	}

	if ( $should_dequeue ) {
		wp_dequeue_script( 'block-visibility-editor-scripts' );
	}
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\dequeue_editor_assets_on_pages_without_block_editor' );

/**
 * Fetch the value of the given plugin setting.
 *
 * @since 2.4.0
 *
 * @param string $setting    The setting name.
 * @param string $is_boolean Is the setting value boolean.
 * @return mixed Returns boolean or the setting value.
 */
function get_plugin_setting( $setting, $is_boolean = false ) {
	$settings = get_option( 'block_visibility_settings' );

	if ( isset( $settings['plugin_settings'][ $setting ] ) ) {
		if ( $settings['plugin_settings'][ $setting ] ) {
			return $is_boolean ? true : $settings['plugin_settings'][ $setting ];
		}
	}

	return false;
}
