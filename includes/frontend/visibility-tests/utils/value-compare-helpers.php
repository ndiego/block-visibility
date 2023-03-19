<?php
/**
 * Helper functions for comparing values, primarily in rule sets.
 *
 * @package block-visibility
 * @since   3.0.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Helper function for comparing two numbers based on the rule operators.
 *
 * @since 3.0.0
 *
 * @param string $operator     The rule operator.
 * @param string $rule_value   The rule value.
 * @param string $system_value The system value to compare the rule value to.
 * @return boolean             Returns boolean based on the value and operator.
 */
function integer_value_compare( $operator, $rule_value, $system_value ) {

	// Make sure our values are non-negative integers for tests.
	$rule_value   = absint( $rule_value );
	$system_value = absint( $system_value );

	switch ( $operator ) {

		case 'equal':
			$result = $system_value === $rule_value ? true : false;
			break;

		case 'notEqual':
			$result = $system_value !== $rule_value ? true : false;
			break;

		case 'greaterThan':
			$result = $system_value > $rule_value ? true : false;
			break;

		case 'lessThan':
			$result = $system_value < $rule_value ? true : false;
			break;

		case 'greaterThanEqual':
			$result = $system_value >= $rule_value ? true : false;
			break;

		case 'lessThanEqual':
			$result = $system_value <= $rule_value ? true : false;
			break;

		default:
			$result = true; // We don't have a valid operator, so default to true.
			break;
	}

	return $result;
}

/**
 * Helper function for comparing two dates based on the rule operators.
 *
 * @since 3.0.0
 *
 * @param string $operator     The rule operator.
 * @param string $rule_value   The rule value.
 * @param string $system_value The system value to compare the rule value to.
 * @return boolean             Returns boolean based on the value and operator.
 */
function date_value_compare( $operator, $rule_value, $system_value ) {

	switch ( $operator ) {

		case 'equal':
			$result = $system_value == $rule_value ? true : false; // phpcs:ignore
			break;

		case 'notEqual':
			$result = $system_value != $rule_value ? true : false; // phpcs:ignore
			break;

		case 'greaterThan':
			$result = $system_value > $rule_value ? true : false;
			break;

		case 'lessThan':
			$result = $system_value < $rule_value ? true : false;
			break;

		default:
			$result = true; // We don't have a valid operator, so default to true.
			break;
	}

	return $result;
}

/**
 * Helper function for determining if an array contains all 'true's, at least
 * one 'true' or no 'true's.
 *
 * @since 3.0.0
 *
 * @param string $operator The rule operator.
 * @param string $results  An array of 'true' and 'false' to compare agains the operator.
 * @return string          Returns 'visible', 'hidden', or 'error'.
 */
function contains_value_compare( $operator, $results ) {

	if ( empty( $results ) || ! is_array( $results ) ) {
		return 'error';
	}

	$test_result = 'error';

	if ( 'atLeastOne' === $operator ) {
		$test_result = in_array( 'true', $results, true ) ? 'visible' : 'hidden';
	} elseif ( 'all' === $operator ) {
		$test_result = ! in_array( 'false', $results, true ) ? 'visible' : 'hidden';
	} elseif ( 'none' === $operator ) {
		$test_result = ! in_array( 'true', $results, true ) ? 'visible' : 'hidden';
	}

	return $test_result;
}

/**
 * Helper function for determining if an array contains at least
 * one 'true' or no 'true's.
 *
 * @since 3.0.0
 *
 * @param string $operator The rule operator.
 * @param string $results  An array of 'true' and 'false' to compare agains the operator.
 * @return string          Returns 'visible', 'hidden', or 'error'.
 */
function any_value_compare( $operator, $results ) {

	if ( empty( $results ) || ! is_array( $results ) ) {
		return 'error';
	}

	$test_result = 'error';

	if ( 'any' === $operator ) {
		$test_result = in_array( 'true', $results, true ) ? 'visible' : 'hidden';
	} elseif ( 'none' === $operator ) {
		$test_result = ! in_array( 'true', $results, true ) ? 'visible' : 'hidden';
	}

	return $test_result;
}

/**
 * Helper function for determining if an array contains at least
 * one 'true' or no 'true's. Same as the "any_value_compare".
 *
 * @since 3.0.0
 *
 * @param string $operator The rule operator.
 * @param string $results  An array of 'true' and 'false' to compare agains the operator.
 * @return string          Returns 'visible', 'hidden', or 'error'.
 */
function boolean_value_compare( $operator, $results ) {

	if ( empty( $results ) || ! is_array( $results ) ) {
		return 'error';
	}

	$test_result = 'error';

	if ( 'equal' === $operator ) {
		$test_result = in_array( 'true', $results, true ) ? 'visible' : 'hidden';
	} elseif ( 'notEqual' === $operator ) {
		$test_result = ! in_array( 'true', $results, true ) ? 'visible' : 'hidden';
	}

	return $test_result;
}
