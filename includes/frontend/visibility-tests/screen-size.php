<?php
/**
 * Adds a filter to the visibility test for the Query String control.
 *
 * @package block-visibility
 * @since   1.7.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled;
use function BlockVisibility\Utils\get_setting;

/**
 * Run test to see if block visibility should be restricted by screen size.
 *
 * @since 1.9.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not
 */
function screen_size_test( $is_visible, $settings, $controls ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'screen_size' ) ) {
		return true;
	}

	$control_atts = isset( $controls['screenSize'] )
		? $controls['screenSize']
		: null;

	// If we have screen size settings, register the required CSS. Also make
	// sure the styles have not already been enqueued.
	if (
		! empty( $control_atts ) &&
		is_control_enabled( $settings, 'screen_size', 'enable_frontend_css' ) &&
		! wp_script_is( 'block-visibility-screen-size-styles' )
	) {

		// Register an alias screen-size styles file. This is needed for wp_add_inline_style.
		wp_register_style( 'block-visibility-screen-size-styles', false, array(), '1.0.0' );
		wp_enqueue_style( 'block-visibility-screen-size-styles' );
	}

	// Always return true because the screen size controls are handled with CSS.
	return true;
}
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\screen_size_test', 10, 3 );

/**
 * Add the screen size classes on render.
 *
 * @since 2.4.1
 *
 * @param array $custom_classes Existing custom classes to be added to the block.
 * @param array $settings       The plugin settings.
 * @param array $controls       The control set controls.
 * @return array                Updated array of classes.
 */
function add_screen_size_classes( $custom_classes, $settings, $controls ) {

	$control_atts = isset( $controls['screenSize'] )
		? $controls['screenSize']
		: null;

	$has_advanced_controls = get_setting(
		$settings,
		'visibility_controls',
		'screen_size',
		'enable_advanced_controls',
		null,
		false
	);

	$sizes = array( 'extra_large', 'large', 'medium', 'small', 'extra_small' );

	foreach ( $sizes as $size ) {
		$enabled = get_setting(
			$settings,
			'visibility_controls',
			'screen_size',
			'controls',
			$size,
			true
		);
		$is_set  = isset( $control_atts['hideOnScreenSize'][ snake_to_camel_case( $size ) ] )
			? $control_atts['hideOnScreenSize'][ snake_to_camel_case( $size ) ]
			: false;

		// If advanced controls are not enabled, don't print the corresponding
		// classes.
		if (
			! $has_advanced_controls &&
			( 'extra_large' === $size || 'extra_small' === $size )
		) {
			continue;
		}

		if ( $enabled && $is_set ) {
			array_push(
				$custom_classes,
				'block-visibility-hide-' . str_replace( '_', '-', $size ) . '-screen'
			);
		}
	}

	return $custom_classes;
}
add_filter( 'block_visibility_control_set_add_custom_classes', __NAMESPACE__ . '\add_screen_size_classes', 10, 3 );

/**
 * Only add inline styles if a block with Screen Size controls is present.
 *
 * @since 2.4.1
 */
function add_inline_styles() {

	// Get the plugin core settings.
	$settings = get_option( 'block_visibility_settings' );

	// We do not want to have to do this, but needed for classic themes. This
	// will enqueue the screen size inline styles on all pages, but does fix
	// the multiple printing of styles issue.
	// @TODO explore alternative approaches.
	if (
		is_control_enabled( $settings, 'screen_size' ) &&
		is_control_enabled( $settings, 'screen_size', 'enable_frontend_css' ) &&
		! wp_script_is( 'block-visibility-screen-size-styles' )
	) {
		wp_register_style( 'block-visibility-screen-size-styles', false, array(), '1.0.0' );
		wp_enqueue_style( 'block-visibility-screen-size-styles' );
	}

	if ( wp_style_is( 'block-visibility-screen-size-styles' ) ) {
		$styles = get_screen_size_styles( $settings );

		wp_add_inline_style( 'block-visibility-screen-size-styles', $styles );
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\add_inline_styles', 1000 );

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
	$large  = check_width( get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'large', '992px' ), '992px' );
	$medium = check_width( get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'medium', '768px' ), '768px' );

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
		$styles      = $prev_styles . "/* Medium screens (tablets, between {$medium} and {$large}) */
@media ( min-width: {$medium} ) and ( max-width: " . set_max_width( $large ) . ' ) {
	.block-visibility-hide-medium-screen {
		display: none !important;
	}
}';
	}

	if ( $small_enabled && set_max_width( $medium ) ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . "/* Small screens (mobile devices, less than {$medium}) */
@media ( max-width: " . set_max_width( $medium ) . ' ) {
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
	$extra_large = check_width( get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'extra_large', '1200px' ), '1200px' );
	$large       = check_width( get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'large', '992px' ), '992px' );
	$medium      = check_width( get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'medium', '768px' ), '768px' );
	$small       = check_width( get_setting( $settings, 'visibility_controls', 'screen_size', 'breakpoints', 'small', '576px' ), '576px' );

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
		$styles = "/* Extra large screens (large desktops, {$extra_large} and up) */
@media ( min-width: {$extra_large} ) {
	.block-visibility-hide-extra-large-screen {
		display: none !important;
	}
}";
	}

	if ( $large_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . "/* Large screens (desktops, between {$large} and {$extra_large}) */
@media ( min-width: {$large} ) and (max-width: " . set_max_width( $extra_large ) . ' ) {
	.block-visibility-hide-large-screen {
		display: none !important;
	}
}';
	}

	if ( $medium_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . "/* Medium screens (tablets, between {$medium} and {$large}) */
@media ( min-width: {$medium} ) and ( max-width: " . set_max_width( $large ) . ' ) {
.block-visibility-hide-medium-screen {
	display: none !important;
}
}';
	}

	if ( $small_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . "/* Small screens (landscape mobile devices, between {$small} and {$medium}) */
@media ( min-width: {$small} ) and ( max-width: " . set_max_width( $medium ) . ' ) {
	.block-visibility-hide-small-screen {
		display: none !important;
	}
}';
	}

	if ( $extra_small_enabled ) {
		$prev_styles = $styles ? $styles . $spacer : $styles;
		$styles      = $prev_styles . "/* Extra small screens (portrait mobile devices, less than {$small}) */
@media ( max-width: " . set_max_width( $small ) . ' ) {
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
 * Validates and returns a width value or a default value.
 *
 * This function checks whether a given width is set, is of the string type,
 * and is not an empty string. If the width does not meet these criteria,
 * the function returns a default value. If it does, the original width value
 * is returned.
 *
 * @since 3.3.0
 *
 * @param string $width   The width value to be validated. This should be a
 *                        non-empty string to be considered valid.
 * @param mixed  $default The default value to return if the width is invalid.
 *                        This can be of any type.
 *
 * @return mixed Returns the original width if valid; otherwise, returns
 *               the default value.
 */
function check_width( $width, $default ) {
	if ( ! isset( $width ) || ! is_string( $width ) || ! $width ) {
		return $default;
	}

	return $width;
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

	// Remove 'px' and check if the remaining is numeric.
	$numeric_width = trim( $width, 'px' );
	if ( ! is_numeric( $numeric_width ) ) {
		return null;
	}

	// Subtract 0.02 from the numeric value.
	$max_width = $numeric_width - 0.02;

	// Return the new width with 'px' appended.
	return (string) $max_width . 'px';
}

/**
 * A simple utlity that transforms a snake case string to camel case.
 *
 * @since 2.4.1
 *
 * @param string $string A snake case string.
 * @return string        The string in camel case.
 */
function snake_to_camel_case( $string ) {
	return lcfirst(
		str_replace( ' ', '', ucwords( str_replace( '_', ' ', $string ) ) )
	);
}
