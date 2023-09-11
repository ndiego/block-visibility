<?php
/**
 * Adds a filter to the visibility test for the Cookie control.
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
 * Run test to see if block visibility should be restricted by Cookie field rules.
 *
 * @since 3.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not.
 */
function cookie_test( $is_visible, $settings, $controls ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'cookie' ) ) {
		return true;
	}

	$control_atts = isset( $controls['cookie'] )
		? $controls['cookie']
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
				$test_result = run_cookie_rule_tests( $rule );

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
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\cookie_test', 15, 3 );

/**
 * Run the individual rule tests.
 *
 * @since 3.0.0
 *
 * @param array $rule    All rule settings.
 * @return string        Returns 'visible', 'hidden', or 'error'.
 */
function run_cookie_rule_tests( $rule ) {

	if (
		! isset( $rule['field'] ) ||
		! isset( $rule['operator'] )
	) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$cookie_name  = $rule['field'];
	$operator     = $rule['operator'];
	$cookie_value = isset( $rule['value'] ) ? $rule['value'] : null;

	$cookie =
		isset( $_COOKIE[ $cookie_name ] ) ? $_COOKIE[ $cookie_name ] : null;

	if ( $cookie_name && $operator ) {
		$test_result = cookie_value_compare( $cookie, $operator, $cookie_value ) ? true : false;
	}

	return $test_result;
}

/**
 * Helper function for comparing the cookie value to the set cookie value based
 * on the rule operators.
 *
 * @since 3.0.0
 *
 * @param string $cookie       The fetched cookie value.
 * @param string $operator     The rule operator.
 * @param string $cookie_value The user provided cookie value to test.
 * @return boolean             Returns boolean based on the value and operator.
 */
function cookie_value_compare( $cookie, $operator, $cookie_value ) {

	switch ( $operator ) {
		case 'notEmpty':
			$result = ! empty( $cookie ) ? true : false;
			break;

		case 'empty':
			$result = empty( $cookie ) ? true : false;
			break;

		case 'equal':
			if ( $cookie_value ) {
				$result = $cookie === $cookie_value ? true : false;
			}
			break;

		case 'notEqual':
			if ( $cookie_value ) {
				$result = $cookie !== $cookie_value ? true : false;
			}
			break;

		case 'contains':
			if ( $cookie_value ) {
				if ( strpos( $cookie, $cookie_value ) !== false ) {
					$result = true;
				} else {
					$result = false;
				}
			}
			break;

		case 'notContain':
			if ( $cookie_value ) {
				if ( strpos( $cookie, $cookie_value ) === false ) {
					$result = true;
				} else {
					$result = false;
				}
			}
			break;

		default:
			$result = true; // We don't have a valid operator, so default to true.
			break;
	}

	return $result;
}
