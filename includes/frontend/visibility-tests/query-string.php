<?php
/**
 * Adds a filter to the visibility test for the Hide Block control.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;


function prepareQueries( $queries ) {
	if ( empty( $queries ) ) {
		return null;
	}

	$query_array = explode( "\n", $queries );

	$orderedQueries =array();

	foreach( $query_array as $query ){
		parse_str( $query, $result );
		$orderedQueries = array_merge( $orderedQueries, $result );
	}
	return $orderedQueries;
}

/**
 * Run test to see if the hide block setting is enabled for the block.
 *
 * This test is applied at a priotity of 20 to try and ensure it goes last.
 * This should generally be the last test that is run and should override all
 * other tests.
 *
 * @since 1.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $attributes The block visibility attributes.
 * @return boolean            Return true is the block should be visible, false if not
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
	//echo print_r( $attributes['controlSets'] );

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
		? prepareQueries( $query_string_atts['queryStringAny'] )
		: null;
	$query_string_all = isset( $query_string_atts['queryStringAll'] )
		? prepareQueries( $query_string_atts['queryStringAll'] )
		: null;
	$query_string_not = isset( $query_string_atts['queryStringNot'] )
		? prepareQueries( $query_string_atts['queryStringNot'] )
		: null;

	// If there is "any" query strings, need to find at lease one match to pass.
	if ( ! empty( $query_string_any ) ) {
		$any_matches = 0;

		foreach ( $query_string_any as $param => $value ) {
			if ( isset( $_REQUEST[ $param ] ) ) {
				if ( ! $value || '*' === $value ) {
					$any_matches++;
				} else if ( $value === $_REQUEST[ $param ] ) {
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
				} else if ( $value === $_REQUEST[ $param ] ) {
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
				} else if ( $value === $_REQUEST[ $param ] ) {
					return false;
				}
			}
		}
	}

    return true;
}
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\query_string_test', 10, 3 );
