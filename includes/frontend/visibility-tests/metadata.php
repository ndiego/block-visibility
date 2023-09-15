<?php
/**
 * Adds a filter to the visibility test for the Metadata control.
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
 * Run test to see if block visibility should be restricted by Metadata field rules.
 *
 * @since 3.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not.
 */
function metadata_test( $is_visible, $settings, $controls ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'metadata' ) ) {
		return true;
	}

	$control_atts = isset( $controls['metadata'] )
		? $controls['metadata']
		: null;

	// There are no control settings, so skip tests.
	if ( ! $control_atts ) {
		return true;
	}

	$rule_sets = isset( $control_atts['ruleSets'] )
		? $control_atts['ruleSets']
		: array();

	$hide_on_rule_sets = isset( $control_atts['hideOnRuleSets'] )
		? $control_atts['hideOnRuleSets']
		: false;

	// There are no rule sets, skip tests.
	if ( ! is_array( $rule_sets ) || 0 === count( $rule_sets ) ) {
		return true;
	}

	// Array of results for each rule set.
	$rule_sets_test_results = array();

	foreach ( $rule_sets as $rule_set ) {
		$enable = isset( $rule_set['enable'] ) ? $rule_set['enable'] : true;
		$rules  =
			isset( $rule_set['rules'] ) ? $rule_set['rules'] : array();

		if ( $enable && 0 < count( $rules ) ) {

			// Array of results for each rule within the current rule set.
			$rule_set_test_results = array();

			foreach ( $rules as $rule ) {
				$test_result = run_metadata_rule_tests( $rule );

				if ( 'error' !== $test_result ) {
					$test_result = $test_result ? 'visible' : 'hidden';
				}

				// If there is an error, default to showing the block.
				$test_result =
					'error' === $test_result ? 'visible' : $test_result;

				$rule_set_test_results[] = $test_result;
			}

			// Within a rule set, all tests have to pass.
			$rule_set_result = in_array( 'hidden', $rule_set_test_results, true )
				? 'hidden'
				: 'visible';

			// Reverse the rule set result if hide_on_rules setting is active.
			if ( $hide_on_rule_sets ) {
				$rule_set_result =
					'visible' === $rule_set_result ? 'hidden' : 'visible';
			}

			// Pass the rule set result to the rule *sets* test results array.
			$rule_sets_test_results[] = $rule_set_result;
		}
	}

	// If there are no enabled rule sets, or if the rule sets have no set rules,
	// there will be no results. Default to showing the block.
	if ( empty( $rule_sets_test_results ) ) {
		return true;
	}

	// Under normal circumstances, need no "visible" results to hide the block.
	// When hide_on_rule_sets is enabled, we need at least one "hidden" to hide.
	if (
		! $hide_on_rule_sets &&
		! in_array( 'visible', $rule_sets_test_results, true )
	) {
		return false;
	} elseif (
		$hide_on_rule_sets &&
		in_array( 'hidden', $rule_sets_test_results, true )
	) {
		return false;
	} else {
		return true;
	}
}

// Run all integration tests at "15" priority, which is after the main controls,
// but before the final "hide block" tests.
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\metadata_test', 15, 3 );

/**
 * Run the individual rule tests.
 *
 * @since 3.0.0
 *
 * @param array $rule    All rule settings.
 * @return string        Returns 'visible', 'hidden', or 'error'.
 */
function run_metadata_rule_tests( $rule ) {

	$field = isset( $rule['field'] ) ? $rule['field'] : null;

	// No field is set, so return an error.
	if ( ! $field ) {
		return 'error';
	}

	switch ( $field ) {

		case 'postMetadata':
			$test_result = run_metadata_post_test( $rule );
			break;

		case 'userMetadata':
			$test_result = run_metadata_user_test( $rule );
			break;

		default:
			$test_result = 'error';
			break;
	}

	return $test_result;
}

/**
 * Run the metadata post meta test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return boolean    Return true if the test passes.
 */
function run_metadata_post_test( $rule ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] )
	) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$key       = $rule['subField'];
	$operator  = $rule['operator'];
	$key_value = isset( $rule['value'] ) ? $rule['value'] : null;

	if ( $key && $operator ) {
		$post_meta   = get_post_meta( get_the_ID(), $key, true );
		$test_result = meta_value_compare( $post_meta, $operator, $key_value );
	}

	return $test_result;
}

/**
 * Run the metadata user meta test.
 *
 * @since 3.0.0
 *
 * @param array $rule All rule settings.
 * @return boolean    Return true if the test passes.
 */
function run_metadata_user_test( $rule ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] )
	) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$key       = $rule['subField'];
	$operator  = $rule['operator'];
	$key_value = isset( $rule['value'] ) ? $rule['value'] : null;

	if ( $key && $operator ) {
		$post_meta   = get_user_meta( get_current_user_id(), $key, true );
		$test_result = meta_value_compare( $post_meta, $operator, $key_value );
	}

	return $test_result;
}

/**
 * Helper function for comparing the meta value to the set key value based on
 * the rule operators.
 *
 * @since 3.0.0
 *
 * @param string $post_meta The post meta key value.
 * @param string $operator  The rule operator.
 * @param string $key_value The user provided meta key value to test.
 * @return boolean          Returns boolean based on the value and operator.
 */
function meta_value_compare( $post_meta, $operator, $key_value ) {

	if ( 'notEmpty' === $operator ) {
		$result = ! empty( $post_meta );
	} elseif ( 'empty' === $operator ) {
		$result = empty( $post_meta );
	} elseif ( isset( $key_value ) ) {

		// Allow for type juggling here since array can include strings or numbers.
		if ( is_array( $post_meta ) ) {
			switch ( $operator ) {
				case 'equal':
					$result = in_array( $key_value, $post_meta ) && count( $post_meta ) === 1; // phpcs:ignore
					break;

				case 'notEqual':
					$result = ! in_array( $key_value, $post_meta ); // phpcs:ignore
					break;

				case 'contains':
					$result = in_array( $key_value, $post_meta ); // phpcs:ignore
					break;

				case 'notContain':
					$result = ! in_array( $key_value, $post_meta ); // phpcs:ignore
					break;

				default:
					$result = 'error';  // We don't have a valid operator, so throw error.
					break;
			}
		} else {

			// Convert to json if $post_meta happens to be an object.
			$post_meta = is_object( $post_meta ) ? json_encode( $post_meta ) : $post_meta;

			// Use "equal" instead of "identical" to allow for type juggling.
			switch ( $operator ) {
				case 'equal':
					$result = $post_meta == $key_value ? true : false;
					break;

				case 'notEqual':
					$result = $post_meta != $key_value ? true : false;
					break;

				case 'contains':
					$result = strpos( $post_meta, $key_value ) !== false;
					break;

				case 'notContain':
					$result = strpos( $post_meta, $key_value ) === false;
					break;

				default:
					$result = 'error';  // We don't have a valid operator, so throw error.
					break;
			}
		}
	}

	return $result;
}
