<?php
/**
 * Helper function for turning a string into a DateTime object.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Utils;

defined( 'ABSPATH' ) || exit;

/**
 * WordPress dependencies
 */
use DateTime;
use DateTimeZone;

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

		// Fix to ajust timezone for locals that are offset by 30 or 45 minutes.
		if ( strpos( $tz_offset, '.5' ) ) {
			$tz_offset = str_replace( '.5', ':30', $tz_offset );
		} elseif ( strpos( $tz_offset, '.75' ) ) {
			$tz_offset = str_replace( '.75', ':45', $tz_offset );
		}

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
