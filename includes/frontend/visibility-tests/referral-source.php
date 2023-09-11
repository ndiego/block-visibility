<?php
/**
 * Adds a filter to the visibility test for the "referral source" settings.
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
 * Run test to see if block visibility should be restricted by referral source.
 *
 * @since 3.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not
 */
function referral_source_test( $is_visible, $settings, $controls ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'referral_source' ) ) {
		return true;
	}

	$control_atts = isset( $controls['referralSource'] )
		? $controls['referralSource']
		: null;

	$contains = isset( $control_atts['contains'] )
		? prepare_url_values( $control_atts['contains'] )
		: null;

	$does_not_contain = isset( $control_atts['doesNotContain'] )
		? prepare_url_values( $control_atts['doesNotContain'] )
		: null;

	$show_if_no_referral = isset( $control_atts['showIfNoReferral'] )
		? $control_atts['showIfNoReferral']
		: false;

	$referrer =
		isset( $_SERVER['HTTP_REFERER'] ) ? $_SERVER['HTTP_REFERER'] : '';

	// Optionally show the block is there is no referrer.
	if ( $show_if_no_referral && ! $referrer ) {
		return true;
	}

	// If there are "contains" URL values, need to find at least one match to pass.
	if ( ! empty( $contains ) && $referrer ) {
		$any_matches = 0;

		foreach ( $contains as $value ) {
			if ( false !== strpos( $referrer, $value ) ) {
				$any_matches++;
			}
		}

		if ( 0 === $any_matches ) {
			return false;
		}
	} elseif ( ! empty( $contains ) && ! $referrer ) {
		return false;
	}

	// If there are "does not contain" URL values, need to not match any to pass.
	if ( ! empty( $does_not_contain ) ) {
		foreach ( $does_not_contain as $value ) {
			if ( false !== strpos( $referrer, $value ) ) {
				return false;
			}
		}
	}

	// Tests have passed.
	return true;
}
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\referral_source_test', 10, 3 );

/**
 * Turn a referral URL values string into an array.
 *
 * @since 3.0.0
 *
 * @param string $values      A string of URL values.
 * @return array $value_array An array of URL values.
 */
function prepare_url_values( $values ) {
	if ( empty( $values ) ) {
		return null;
	}

	$value_array = explode( "\n", $values );

	return $value_array;
}
