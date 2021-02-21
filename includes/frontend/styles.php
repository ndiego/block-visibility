<?php
/**
 * Enqueue frontend styles.
 *
 * @package block-visibility
 * @since   1.5.0
 */

namespace BlockVisibility\Frontend;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\get_asset_file as get_asset_file;
use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;
use function BlockVisibility\Utils\get_setting as get_setting;

/**
 * Enqueue plugin specific frontend styles
 *
 * @since 1.5.0
 */
function enqueue_frontend_styles() {

	// Get the plugin core settings.
	$settings = get_option( 'block_visibility_settings' );

	// Bail early if screen size controls are disabled, or the user has chosen
	// not to enable frontend CSS.
	if (
		! is_control_enabled( $settings, 'screen_size' ) ||
		! is_control_enabled( $settings, 'screen_size', 'enable_frontend_css' )
	) {
		return;
	}

	// Styles.
	$asset_file = get_asset_file( 'dist/block-visibility-frontend-styles' );

	// Currently this is a "dummy" file, but is needed for wp_add_inline_style.
	wp_enqueue_style(
		'block-visibility-frontend-styles',
		BLOCK_VISIBILITY_PLUGIN_URL . 'dist/block-visibility-frontend-styles.css',
		array(),
		$asset_file['version']
	);

	$styles = get_screen_size_styles( $settings );

	if ( $styles ) {
		wp_add_inline_style( 'block-visibility-frontend-styles', $styles );
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_frontend_styles' );

/**
 * Get the screen size styles.
 *
 * @since 1.5.0
 *
 * @param array $settings The plugin settings.
 * @return string         The screen size styles.
 */
function get_screen_size_styles( $settings ) {

	$has_advanced_controls = get_setting(
		$settings,
		'visibility_controls',
		'screen_size',
		'enable_advanced_controls',
		null,
		false
	);

	$styles = $has_advanced_controls ?
		get_advanced_styles( $settings ) :
		get_default_styles( $settings );

	return $styles;
}

/**
 * Generate the default styles
 *
 * @since 1.5.0
 *
 * @param array $settings The plugin settings.
 * @return string         The default screen size styles.
 */
function get_default_styles( $settings ) {

	// Breakpoints.
	$large  = get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'large', '992px' );
	$medium = get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'medium', '768px' );

	// Screen size controls.
	$large_enabled  = get_setting( $settings, 'visibility_controls', 'screen_size', 'controls', 'large', true );
	$medium_enabled = get_setting( $settings, 'visibility_controls', 'screen_size', 'controls', 'medium', true );
	$small_enabled  = get_setting( $settings, 'visibility_controls', 'screen_size', 'controls', 'small', true );

	// Render styles.
	$spacer = '

';
	$styles = '';

	if ( $large_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . "/* Large screens (desktops, {$large} and up) */
@media ( min-width: {$large} ) {
	.block-visibility-hide-large-screen {
		display: none !important;
	}
}";
	}

	if ( $medium_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . '/* Medium screens (tablets, between {$medium} and {$large}) */
@media ( min-width: {$medium} ) and ( max-width: ' . set_max_width( $large ) . ' ) {
	.block-visibility-hide-medium-screen {
		display: none !important;
	}
}';
	}

	if ( $small_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . '/* Small screens (mobile devices, less than {$medium}) */
@media ( max-width: ' . set_max_width( $medium ) . ' ) {
	.block-visibility-hide-small-screen {
		display: none !important;
	}
}';
	}

	if ( ! $styles ) {
		$styles = '/* All screen size controls have been disabled. */';
	}

	return $styles;
}

/**
 * Generate the advanced styles
 *
 * @since 1.5.0
 *
 * @param array $settings The plugin settings.
 * @return string         The advanced screen size styles.
 */
function get_advanced_styles( $settings ) {

	// Breakpoints.
	$extra_large = get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'extra_large', '1200px' );
	$large       = get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'large', '992px' );
	$medium      = get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'medium', '768px' );
	$small       = get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'small', '576px' );

	// Screen size controls.
	$extra_large_enabled = get_setting( $settings, 'visibility_controls', 'screen_size', 'controls', 'extra_large', true );
	$large_enabled       = get_setting( $settings, 'visibility_controls', 'screen_size', 'controls', 'large', true );
	$medium_enabled      = get_setting( $settings, 'visibility_controls', 'screen_size', 'controls', 'medium', true );
	$small_enabled       = get_setting( $settings, 'visibility_controls', 'screen_size', 'controls', 'small', true );
	$extra_small_enabled = get_setting( $settings, 'visibility_controls', 'screen_size', 'controls', 'extra_small', true );

	// Render styles.
	$spacer = '

';
	$styles = '';

	if ( $extra_large_enabled ) {
		$styles = '/* Extra large screens (large desktops, {$extra_large} and up) */
@media ( min-width: {$extra_large} ) {
	.block-visibility-hide-extra-large-screen {
		display: none !important;
	}
}';
	}

	if ( $large_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . '/* Large screens (desktops, between {$large} and {$extra_large}) */
@media ( min-width: {$large} ) and (max-width: ' . set_max_width( $extra_large ) . ' ) {
	.block-visibility-hide-large-screen {
		display: none !important;
	}
}';
	}

	if ( $medium_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . '/* Medium screens (tablets, between {$medium} and {$large}) */
@media ( min-width: {$medium} ) and ( max-width: ' . set_max_width( $large ) . ' ) {
.block-visibility-hide-medium-screen {
	display: none !important;
}
}';
	}

	if ( $small_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . '/* Small screens (landscape mobile devices, between {$small} and {$medium}) */
@media ( min-width: {$small} ) and ( max-width: ' . set_max_width( $medium ) . ' ) {
	.block-visibility-hide-small-screen {
		display: none !important;
	}
}';
	}

	if ( $extra_small_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . '/* Extra small screens (portrait mobile devices, less than {$small}) */
@media ( max-width: ' . set_max_width( $small ) . ' ) {
	.block-visibility-hide-extra-small-screen {
		display: none !important;
	}
}';
	}

	if ( ! $styles ) {
		$styles = '/* All screen size controls have been disabled. */';
	}

	return $styles;
}

/**
 * Takes a given width string and subracts 0.02. The width string includes 'px'
 * so need to remove that first to do calculation, then add it back.
 *
 * @since 1.5.0
 *
 * @param string $width A given width string.
 * @return string       The width string minus 0.02.
 */
function set_max_width( $width ) {
	$max_width = trim( $width, 'px' ) - 0.02;
	return (string) $max_width . 'px';
}

// Require utlity functions for tests.
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/is-control-enabled.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/get-setting.php';
