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
 * WordPress dependencies
 */
use DateTime;
use DateTimeZone;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;

/**
 * This function takes a date string and converts it into a DateTime object.
 * By default it will localize the date string to the WordPress site's timezone.
 * Alternatively it can respect the date string and just add the correct
 * timezone without actually changing the time itself.
 *
 * If no timestamp is given, it returns the current time.
 *
 * @since 1.1.0
 *
 * @param string  $timestamp The time string.
 * @param boolean $localize  Should we localize the time string, or just append the timezone.
 * @return Object            Return the DateTime object for the timestamp and timezone.
 */
function create_date_time( $timestamp = null, $localize = true ) {

	// The timezone settings from the WordPress general settings.
	$tz_string = get_option( 'timezone_string' );
	$tz_offset = get_option( 'gmt_offset', 0 );

	if ( ! empty( $tz_string ) ) {
		// If site timezone option string exists, use it.
		$timezone = $tz_string;

	} elseif ( 0 === $tz_offset ) {
		// Get UTC offset, if it isn’t set then return UTC.
		$timezone = 'UTC';

	} else {
		$timezone = $tz_offset;

		if (
			substr( $tz_offset, 0, 1 ) !== '-'
			&& substr( $tz_offset, 0, 1 ) !== '+'
			&& substr( $tz_offset, 0, 1 ) !== 'U'
		) {
			$timezone = '+' . $tz_offset;
		}
	}

	if ( null === $timestamp ) {
		$timestamp = time();
	}

	if ( $localize ) {
		$datetime = new DateTime( $timestamp );
		$datetime->setTimezone( new DateTimeZone( $timezone ) );
	} else {
		$datetime = new DateTime( $timestamp, new DateTimeZone( $timezone ) );
	}
	return $datetime;
}

/**
 * Run test to see if block visibility should be restricted by date and time.
 *
 * @since 1.1.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $attributes The block visibility attributes.
 * @return boolean            Return true if the block should be visible, false if not.
 */
function date_time_test( $is_visible, $settings, $attributes ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this functionality has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'date_time' ) ) {
		return true;
	}

	$has_control_sets = isset( $attributes['controlSets'] );

	if ( $has_control_sets ) {
		// Just retrieve the first set and schedule, need to update in future.
		$schedules =
			isset( $attributes['controlSets'][0]['controls']['dateTime']['schedules'] )
				? $attributes['controlSets'][0]['controls']['dateTime']['schedules']
				: array();

		$hide_on_schedules =
			isset( $attributes['controlSets'][0]['controls']['dateTime']['hideOnSchedules'] )
				? $attributes['controlSets'][0]['controls']['dateTime']['hideOnSchedules']
				: false;
	} else {
		$schedules = isset( $attributes['scheduling'] )
			? array( $attributes['scheduling'] )
			: array();

		$hide_on_schedules = false;
	}

	$depracated_start = isset( $attributes['startDateTime'] )
		? $attributes['startDateTime']
		: null;
	$depracated_end   = isset( $attributes['endDateTime'] )
		? $attributes['endDateTime']
		: null;

	// There are no date time settings, skip tests.
	if (
		0 === count( $schedules ) &&
		! $depracated_start &&
		! $depracated_end
	) {
		return true;
	}

	$test_results = array();

	if ( 0 < count( $schedules ) ) {
		foreach ( $schedules as $schedule ) {
			$enable = isset( $schedule['enable'] ) ? $schedule['enable'] : true;

			if ( ! $enable ) {

				// If the schedule is not enabled, skip the tests.
				$test_results[] = 'visible';

			} else {
				$start = isset( $schedule['start'] ) ? $schedule['start'] : null;
				$end   = isset( $schedule['end'] ) ? $schedule['end'] : null;

				$test_result =
					run_schedule_test( $start, $end, $hide_on_schedules );

				$test_result = apply_filters(
					'block_visibility_frontend_test_date_time_schedule',
					$test_result,
					$schedule,
					$settings
				);

				// Reverse the test result if hide_on_schedules is active.
				if ( $hide_on_schedules && $test_result !== 'error' ) {
					$test_result = $test_result === 'visible' ? 'hidden' : 'visible';
				}

				// If there is an error, default to showing the block.
				$test_result =
					$test_result === 'error' ? 'visible' : $test_result;

				$test_results[] = $test_result;
			}
		}
	} elseif ( $depracated_start || $depracated_end ) {
		$test_result =
			run_schedule_test( $depracated_start, $depracated_end, false );

		$test_results[] = $test_result;
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
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\date_time_test', 10, 3 );

/**
 * Run individual date/time test for each schedule.
 *
 * @since 1.8.0
 *
 * @param array   $schedule          Array of all schedule settings.
 * @param boolean $hide_on_schedules Is hide_one_schedules enabled or not.
 * @return boolean                   Return pass if should be visible, fail if not.
 */
function run_schedule_test( $start, $end, $hide_on_schedules ) {

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
	$current   = current_datetime();

	if ( ( $start && $start > $current ) || ( $end && $end < $current ) ) {
		return 'hidden';
	}

	return 'visible';
}
