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
function create_datetime( $timestamp = null, $localize = true ) {

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
 * Helper function for getting the start date. Function checks if the depracated
 * startDateTime attribute is set and handles accordingly.
 *
 * @since 1.4.1
 *
 * @param array   $attributes The block visibility attributes.
 * @param boolean $enable     Is scheduling enabled.
 * @return string             Return the correct start date.
 */
function get_start( $attributes, $enable ) {
	$depracated_start = isset( $attributes['startDateTime'] )
		? $attributes['startDateTime']
		: null;
	$new_start        = isset( $attributes['scheduling']['start'] )
		? $attributes['scheduling']['start']
		: null;

	if ( isset( $enable ) ) {
		return $new_start;
	}

	return $depracated_start;
}

/**
 * Helper function for getting the end date. Function checks if the depracated
 * endDateTime attribute is set and handles accordingly.
 *
 * @since 1.4.1
 *
 * @param array   $attributes The block visibility attributes.
 * @param boolean $enable     Is scheduling enabled.
 * @return string             Return the correct end date.
 */
function get_end( $attributes, $enable ) {
	$depracated_end = isset( $attributes['endDateTime'] )
		? $attributes['endDateTime']
		: null;
	$new_end        = isset( $attributes['scheduling']['end'] )
		? $attributes['scheduling']['end']
		: null;

	// If the enable setting exists then use the new start attribute.
	if ( isset( $enable ) ) {
		return $new_end;
	}

	return $depracated_end;
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
function scheduling_test( $is_visible, $settings, $attributes ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this functionality has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'date_time' ) ) {
		return true;
	}

	$enable = isset( $attributes['scheduling']['enable'] )
		? $attributes['scheduling']['enable']
		: null;
	$start  = get_start( $attributes, $enable );
	$end    = get_end( $attributes, $enable );

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

	$start = $start ? create_datetime( $start, false ) : null;
	$end   = $end ? create_datetime( $end, false ) : null;

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
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\scheduling_test', 10, 3 );
