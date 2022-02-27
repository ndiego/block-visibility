<?php
/**
 * Adds a filter to the visibility test for control sets.
 *
 * @package block-visibility
 * @since   2.2.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Run the control sets test.
 *
 * @since 2.2.0
 *
 * @param boolean $is_visible   The current value of the visibility test.
 * @param array   $settings     The core plugin settings.
 * @param array   $control_sets All local control sets on the block.
 * @param string  $type         Is the control set "local" or part of a "preset".
 * @return boolean              Return true if the block should be visible, false if not.
 */
function control_sets_test( $is_visible, $settings, $control_sets, $type = 'local' ) { // phpcs:ignore

	// There are no control sets, skip tests.
	if ( ! is_array( $control_sets ) || 0 === count( $control_sets ) ) {
		return true;
	}

	// Array of results for each control set.
	$control_sets_test_results = array();

	foreach ( $control_sets as $control_set ) {

		$enable = isset( $control_set['enable'] )
			? $control_set['enable']
			: true;

		$controls = isset( $control_set['controls'] )
			? $control_set['controls']
			: array();

		if ( $enable && 0 < count( $controls ) ) {

			$is_set_visible = true;

			// All our visibility tests are run through this filter and this also
			// gives third-party developers access to override a block's visibility.
			$is_set_visible = apply_filters(
				'block_visibility_control_set_is_block_visible',
				$is_set_visible,
				$settings,
				$controls
			);

			$control_sets_test_results[] = $is_set_visible ? 'visible' : 'hidden';
		}
	}

	// If there are no enabled control sets, or if the control sets have no set
	// controls, there will be no results. Default to showing the block.
	if ( empty( $control_sets_test_results ) ) {
		return true;
	}

	// As long as one control set returns 'visible', show the block. Therefore,
	// need no "visible" results to hide the block.
	if ( ! in_array( 'visible', $control_sets_test_results, true ) ) {
		return false;
	} else {
		return true;
	}
}
