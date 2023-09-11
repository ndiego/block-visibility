<?php
/**
 * Adds a filter to the visibility test for the Query String control.
 *
 * @package block-visibility
 * @since   1.7.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled;

/**
 * Run test to see if block visibility should be restricted by query string.
 *
 * @since 1.7.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not
 */
function query_string_test( $is_visible, $settings, $controls ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'query_string' ) ) {
		return true;
	}

	$control_atts = isset( $controls['queryString'] )
		? $controls['queryString']
		: null;

	$query_string_any = isset( $control_atts['queryStringAny'] )
		? prepare_queries( $control_atts['queryStringAny'] )
		: null;
	$query_string_all = isset( $control_atts['queryStringAll'] )
		? prepare_queries( $control_atts['queryStringAll'] )
		: null;
	$query_string_not = isset( $control_atts['queryStringNot'] )
		? prepare_queries( $control_atts['queryStringNot'] )
		: null;

	// If there is "any" query strings, need to find at least one match to pass.
	if ( ! empty( $query_string_any ) ) {
		$any_matches = 0;

		foreach ( $query_string_any as $string ) {
			$param = key( $string );
			$value = $string[ $param ];

			if ( isset( $_REQUEST[ $param ] ) ) { // phpcs:ignore
				if ( ! $value || '*' === $value ) {
					$any_matches++;
				} elseif ( $value === $_REQUEST[ $param ] ) { // phpcs:ignore
					$any_matches++;
				}
			}
		}

		if ( 0 === $any_matches ) {
			return false;
		}
	}

	// If there is "all" query strings, need to match all to pass.
	if ( ! empty( $query_string_all ) ) {
		$all_matches = 0;

		foreach ( $query_string_all as $string ) {
			$param = key( $string );
			$value = $string[ $param ];

			if ( isset( $_REQUEST[ $param ] ) ) { // phpcs:ignore
				if ( is_null( $value ) || '*' === $value ) {
					$all_matches++;
				} elseif ( $value === $_REQUEST[ $param ] ) { // phpcs:ignore
					$all_matches++;
				}
			}
		}

		if ( count( $query_string_all ) !== $all_matches ) {
			return false;
		}
	}

	// If there is "not" query strings, need to not match any to pass.
	if ( ! empty( $query_string_not ) ) {
		foreach ( $query_string_not as $string ) {
			$param = key( $string );
			$value = $string[ $param ];

			if ( isset( $_REQUEST[ $param ] ) ) { // phpcs:ignore
				if ( ! $value || '*' === $value ) {
					return false;
				} elseif ( $value === $_REQUEST[ $param ] ) { // phpcs:ignore
					return false;
				}
			}
		}
	}

	return true;
}
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\query_string_test', 10, 3 );

/**
 * Turn a query string into an array.
 *
 * @since 1.7.0
 *
 * @param string $queries         A string of queries.
 * @return array $ordered_queries An array of queries.
 */
function prepare_queries( $queries ) {
	if ( empty( $queries ) ) {
		return null;
	}

	$query_array     = explode( "\n", $queries );
	$ordered_queries = array();

	foreach ( $query_array as $query ) {
		parse_str( $query, $result );
		$ordered_queries[] = $result;
	}

	return $ordered_queries;
}
