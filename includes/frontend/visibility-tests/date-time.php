<?php
/**
 * Adds a filter to the visibility test for "date and time" setting.
 *
 * @package block-visibility
 * @since   1.1.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;
use DateTime;
/**
 * Run test to see if block visibility should be restricted by date and time.
 *
 * @since 1.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $block      The block info and attributes.
 * @return boolean            Return true is the block should be visible, false if not.
 */
function test_date_time( $is_visible, $settings, $block ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this functionality has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'date_time' ) ) {
		return true;
	}

	$attributes = $block['attrs']['blockVisibility'];

	$start = isset( $attributes['startDateTime'] )
		? $attributes['startDateTime']
		: null;
	$start = $start ? new DateTime( $start ) : null;

	$end = isset( $attributes['endDateTime'] )
		? $attributes['endDateTime']
		: null;
	$end = $end ? new DateTime( $end ) : null;

	if ( ! $start && ! $end ) {
		return true;
	}

	if ( ( $start && $end ) && $start > $end ) {
		return true;
	}

	$current = current_datetime();

	if ( ( $start && $start < $current ) || ( $end && $end > $current ) ) {
		return true;
	}

	// If we don't pass any of the above tests, hide the block.
	return false;
}
add_filter( 'block_visibility_visibility_test', __NAMESPACE__ . '\test_date_time', 10, 3 );
