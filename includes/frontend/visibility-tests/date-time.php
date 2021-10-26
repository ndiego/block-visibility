<?php
/**
 * Adds a filter to the visibility test for Date & Time control.
 *
 * @package block-visibility
 * @since   1.1.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;
use function BlockVisibility\Utils\create_date_time as create_date_time;

/**
 * Run test to see if block visibility should be restricted by date and time.
 *
 * @since 1.1.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not.
 */
function date_time_test( $is_visible, $settings, $controls ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this functionality has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'date_time' ) ) {
		return true;
	}

	$schedules =
		isset( $controls['dateTime']['schedules'] )
			? $controls['dateTime']['schedules']
			: array();

	$hide_on_schedules =
		isset( $controls['dateTime']['hideOnSchedules'] )
			? $controls['dateTime']['hideOnSchedules']
			: false;

	// There are no date time settings, skip tests.
	if ( 0 === count( $schedules ) ) {
		return true;
	}

	$test_results = array();

	if ( 0 < count( $schedules ) ) {
		foreach ( $schedules as $schedule ) {
			$enable = isset( $schedule['enable'] ) ? $schedule['enable'] : true;

			if ( $enable ) {
				$start = isset( $schedule['start'] ) ? $schedule['start'] : null;
				$end   = isset( $schedule['end'] ) ? $schedule['end'] : null;

				$test_result =
					run_schedule_test( $start, $end );

				$test_result = apply_filters(
					'block_visibility_frontend_test_date_time_schedule',
					$test_result,
					$schedule,
					$settings
				);

				// Reverse the test result if hide_on_schedules is active.
				if ( $hide_on_schedules && 'error' !== $test_result ) {
					$test_result = 'visible' === $test_result ? 'hidden' : 'visible';
				}

				// If there is an error, default to showing the block.
				$test_result =
					'error' === $test_result ? 'visible' : $test_result;

				$test_results[] = $test_result;
			}
		}
	}

	// If there are no enabled schedules,there will be no results. Default to
	// showing the block.
	if ( empty( $test_results ) ) {
		return true;
	}

	// Under normal circumstances, need no "visible" results to hide the block.
	// When hide_on_schedules is enabled, we need at least one "hidden" to hide.
	if ( ! $hide_on_schedules && ! in_array( 'visible', $test_results, true ) ) {
		return false;
	} elseif ( $hide_on_schedules && in_array( 'hidden', $test_results, true ) ) {
		return false;
	} else {
		return true;
	}
}
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\date_time_test', 10, 3 );

/**
 * Run individual date/time test for each schedule.
 *
 * @since 1.8.0
 *
 * @param string $start The start date/time string.
 * @param string $end   The end date/time string.
 * @return boolean      Return pass if should be visible, fail if not.
 */
function run_schedule_test( $start, $end ) {

	// If there is no saved start or end date, skip the test unless
	// hide_on_schedules is set to true.
	if ( ! $start && ! $end ) {
		return 'visible';
	}

	$start = $start ? create_date_time( $start, false ) : null;
	$end   = $end ? create_date_time( $end, false ) : null;

	// If the start date is after the end date, skip test and throw error.
	if ( ( $start && $end ) && $start > $end ) {
		return 'error';
	}

	// Current time based on the date/time settings set in the WP admin.
	$current = current_datetime();

	if ( ( $start && $start > $current ) || ( $end && $end < $current ) ) {
		return 'hidden';
	}

	return 'visible';
}
