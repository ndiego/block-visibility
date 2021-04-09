<?php
/**
 * Adds a filter to the visibility test for the ACF control.
 *
 * @package block-visibility
 * @since   1.8.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;

/**
 * Run test to see if block visibility should be restricted by ACF field rules.
 *
 * @since 1.8.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $attributes The block visibility attributes.
 * @return boolean            Return true is the block should be visible, false if not.
 */
function acf_test( $is_visible, $settings, $attributes ) {

	// If the test is already false, or ACF is not active, skip this test.
	if ( ! $is_visible || ! function_exists( 'acf' ) ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'acf' ) ) {
		return true;
	}

	$has_control_sets = isset( $attributes['controlSets'] );

	if ( $has_control_sets ) {
		// Just retrieve the first set, need to update in future.
		$acf_atts =
			isset( $attributes['controlSets'][0]['controls']['acf'] )
				? $attributes['controlSets'][0]['controls']['acf']
				: null;
	} else {
		// There are no ACF settings, so skip tests.
		return true;
	}


	$can_access = false;

	if ( $can_access ) {
		return true;
	} else {
		return false;
	}
}

// Run all integration tests at "15" priority, which is after the main controls,
// but before the final "hide block" tests.
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\acf_test', 15, 3 );
