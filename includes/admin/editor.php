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
use function BlockVisibility\Utils\get_asset_file;
use function BlockVisibility\Utils\get_user_roles;

/**
 * Enqueue plugin specific editor scripts
 *
 * @since 1.0.0
 */
function enqueue_editor_scripts() {

	// Scripts.
	$asset_file = get_asset_file( 'build/block-visibility-editor' );

	$dependencies = $asset_file['dependencies'];

	// Remove wp-edit-post if on the Widgets screen, otherwise WordPress will throw an error.
	if ( 'widgets' === get_current_screen()->id ) {
		$dependencies = array_filter(
			$dependencies,
			function ( $dep ) {
				return ( 'wp-edit-post' !== $dep );
			}
		);
	}

	wp_enqueue_script(
		'block-visibility-editor-scripts',
		BLOCK_VISIBILITY_PLUGIN_URL . 'build/block-visibility-editor.js',
		array_merge( $dependencies, array( 'wp-api', 'wp-core-data' ) ),
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
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_scripts' );

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
			$inline_style = '.block-visibility__has-visibility:not(.is-selected):not(.has-child-selected), .block-visibility__has-visibility.components-placeholder.components-placeholder:not(.is-selected):not(.has-child-selected), .block-visibility__has-visibility.components-placeholder:not(.is-selected):not(.has-child-selected) { outline-color: ' . $custom_color . ' } .block-visibility__has-visibility:not(.is-selected):not(.has-child-selected)::after { background-color: ' . $custom_color . ' }';

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
			$opacity = intval( $block_opacity ) * 0.01;

			// Not all blocks can support contextual opacity.
			$excluded_blocks = array(
				'paragraph',
				'heading',
				'verse',
			);

			$excluded_blocks = apply_filters(
				'block_visibility_exclude_blocks_from_contextual_opacity',
				$excluded_blocks
			);

			$excluded_blocks_selectors = '';

			foreach ( $excluded_blocks as $block ) {
				$excluded_blocks_selectors .= ':not(.wp-block-' . $block . ')';
			}

			$inline_style = '.block-visibility__has-visibility:not(.is-selected):not(.has-child-selected)' . $excluded_blocks_selectors . ' > *:not(.wp-block-cover__background) { opacity: ' . $opacity . ' }';

			wp_add_inline_style(
				'block-visibility-editor-styles',
				$inline_style
			);
		}
	}
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_styles' );

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
