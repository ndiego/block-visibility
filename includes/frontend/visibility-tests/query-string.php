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
use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;

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

	$query_array = explode( "\n", $queries );

	$ordered_queries = array();

	foreach ( $query_array as $query ) {
		parse_str( $query, $result );
		$ordered_queries = array_merge( $ordered_queries, $result );
	}
	return $ordered_queries;
}

/**
 * Run test to see if block visibility should be restricted by query string.
 *
 * @since 1.7.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $attributes The block visibility attributes.
 * @return boolean            Return true if the block should be visible, false if not
 */
function query_string_test( $is_visible, $settings, $attributes ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'query_string' ) ) {
		return true;
	}

	$has_control_sets = isset( $attributes['controlSets'] );

	if ( $has_control_sets ) {
		// Just retrieve the first set, need to update in future.
		$query_string_atts =
			isset( $attributes['controlSets'][0]['controls']['queryString'] )
				? $attributes['controlSets'][0]['controls']['queryString']
				: null;
	} else {
		// There are no Query String settings, so skip tests.
		return true;
	}

	$query_string_any = isset( $query_string_atts['queryStringAny'] )
		? prepare_queries( $query_string_atts['queryStringAny'] )
		: null;
	$query_string_all = isset( $query_string_atts['queryStringAll'] )
		? prepare_queries( $query_string_atts['queryStringAll'] )
		: null;
	$query_string_not = isset( $query_string_atts['queryStringNot'] )
		? prepare_queries( $query_string_atts['queryStringNot'] )
		: null;

	// If there is "any" query strings, need to find at lease one match to pass.
	if ( ! empty( $query_string_any ) ) {
		$any_matches = 0;

		foreach ( $query_string_any as $param => $value ) {
			if ( isset( $_REQUEST[ $param ] ) ) {
				if ( ! $value || '*' === $value ) {
					$any_matches++;
				} elseif ( $value === $_REQUEST[ $param ] ) {
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

		foreach ( $query_string_all as $param => $value ) {
			if ( isset( $_REQUEST[ $param ] ) ) {
				if ( ! $value || '*' === $value ) {
					$all_matches++;
				} elseif ( $value === $_REQUEST[ $param ] ) {
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
		foreach ( $query_string_not as $param => $value ) {
			if ( isset( $_REQUEST[ $param ] ) ) {
				if ( ! $value || '*' === $value ) {
					return false;
				} elseif ( $value === $_REQUEST[ $param ] ) {
					return false;
				}
			}
		}
	}

	return true;
}
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\query_string_test', 10, 3 );
