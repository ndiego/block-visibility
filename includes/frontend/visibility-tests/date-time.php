<?php
/**
 * Adds a filter to the visibility test for "date and time" setting.
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
 * Helper function for getting the end date. Function checks if the depracated
 * endDateTime attribute is set and handles accordingly.
 *
 * @since 1.6.0
 *
 * @param array   $attributes    The block visibility attributes.
 * @param array   $schedule_atts The schedule specific attributes.
 * @param boolean $enable        Is scheduling enabled.
 * @param string  $old           The old date time attribute.
 * @param string  $new           The new date time attribute.
 * @return string                Return the correct end date.
 */
function get_date_time( $attributes, $schedule_atts, $enable, $old, $new ) {
	$depracated_date_time = isset( $attributes[ $old ] )
		? $attributes[ $old ]
		: null;
	$new_date_time        = isset( $schedule_atts[ $new ] )
		? $schedule_atts[ $new ]
		: null;

	// If the enable setting exists then use the new start attribute.
	if ( isset( $schedule_atts[ 'enable' ] ) ) {
		return $new_date_time;
	}

	return $depracated_date_time;
}

/**
 * Run test to see if block visibility should be restricted by date and time.
 *
 * @since 1.1.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $attributes The block visibility attributes.
 * @return boolean            Return true is the block should be visible, false if not.
 */
function date_time_test( $is_visible, $settings, $attributes ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this functionality has been disabled, skip test.
	if (
		! is_control_enabled( $settings, 'date_time' ) ||
		! is_control_enabled( $settings, 'date_time', 'enable_scheduling' )
	) {
		return true;
	}

	$has_control_sets = isset( $attributes['controlSets'] );

	if ( $has_control_sets ) {
		// Just retrieve the first set and schedule, need to update in future.
		$schedule_atts =
			isset( $attributes['controlSets'][0]['controls']['dateTime']['schedules'][0] )
				? $attributes['controlSets'][0]['controls']['dateTime']['schedules'][0]
				: null;
	} else {
		$schedule_atts = isset( $attributes['scheduling'] )
			? $attributes['scheduling']
			: null;
	}

	// There are no date time settings, skip tests.
	if (
		! $schedule_atts &&
		! isset( $attributes['startDateTime'] ) &&
		! isset( $attributes['endDateTime'] )
	) {
		return true;
	}

	$enable = isset( $schedule_atts['enable'] )
		? $schedule_atts['enable']
		: true;
	$start  = get_date_time(
		$attributes,
		$schedule_atts,
		$enable,
		'startDateTime',
		'start'
	);
	$end    = get_date_time(
		$attributes,
		$schedule_atts,
		$enable,
		'endDateTime',
		'end'
	);

	// The new enable setting does not exist and there are no depracated
	// scheduling settings, so skip the est.
	if ( ! isset( $enable ) && ! $start && ! $end ) {
		return true;
	}

	// Enable setting exists and is not enabled, so skip the test.
	if ( isset( $enable ) && ! $enable ) {
		return true;
	}

	// Enable setting exists and is enabled, but there is no saved start or end
	// date, skip the test.
	if ( isset( $enable ) && $enable && ! $start && ! $end ) {
		return true;
	}

	$start = $start ? create_date_time( $start, false ) : null;
	$end   = $end ? create_date_time( $end, false ) : null;

	// If the start date is before the end date, skip test.
	if ( ( $start && $end ) && $start > $end ) {
		return true;
	}

	// Current time based on the date/time settings set in the WP admin.
	$current = current_datetime();

	if ( ( $start && $start > $current ) || ( $end && $end < $current ) ) {
		return false;
	}

	// Block has passed the date & time test.
	return true;
}
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\date_time_test', 10, 3 );
