<?php
/**
 * Adds a filter to the visibility test for the "URL path" settings.
 *
 * @package block-visibility
 * @since   3.0.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled;

/**
 * Run test to see if block visibility should be restricted by URL path.
 *
 * @since 3.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not
 */
function url_path_test( $is_visible, $settings, $controls ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'url_path' ) ) {
		return true;
	}

	$control_atts = isset( $controls['urlPath'] ) ? $controls['urlPath'] : null;

	$contains = isset( $control_atts['contains'] )
		? prepare_url_paths( $control_atts['contains'] )
		: null;

	$does_not_contain = isset( $control_atts['doesNotContain'] )
		? prepare_url_paths( $control_atts['doesNotContain'] )
		: null;

	$paths = isset( $_SERVER['REQUEST_URI'] ) ? $_SERVER['REQUEST_URI'] : '';

	// If there are "contains" URL paths, need to find at least one match to pass.
	if ( ! empty( $contains ) && $paths ) {
		$any_matches = 0;

		foreach ( $contains as $path ) {
			if ( false !== strpos( $paths, $path ) ) {
				$any_matches++;
			}
		}

		if ( 0 === $any_matches ) {
			return false;
		}
	} elseif ( ! empty( $contains ) && ! $paths ) {
		return false;
	}

	// If there are "does not contain" URL values, need to not match any to pass.
	if ( ! empty( $does_not_contain ) ) {
		foreach ( $does_not_contain as $path ) {
			if ( false !== strpos( $paths, $path ) ) {
				return false;
			}
		}
	}

	// Tests have passed.
	return true;
}
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\url_path_test', 10, 3 );

/**
 * Turn a URL paths string into an array.
 *
 * @since 3.0.0
 *
 * @param string $paths       A string of URL paths.
 * @return array $paths_array An array of URL paths.
 */
function prepare_url_paths( $paths ) {
	if ( empty( $paths ) ) {
		return null;
	}

	$paths_array = explode( "\n", $paths );

	return $paths_array;
}
