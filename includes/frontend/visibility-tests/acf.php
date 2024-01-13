<?php
/**
 * Adds a filter to the visibility test for the ACF control.
 *
 * @package block-visibility
 * @since   1.8.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled;

/**
 * Run test to see if block visibility should be restricted by ACF field rules.
 *
 * @since 1.8.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not.
 */
function acf_test( $is_visible, $settings, $controls ) {

	// If the test is already false, or ACF is not active, skip this test.
	if (
		! $is_visible ||
		! function_exists( 'acf' ) ||
		! function_exists( 'get_field_object' ) // Main ACF function for retrieving fields.
	) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'acf' ) ) {
		return true;
	}

	$control_atts = isset( $controls['acf'] ) ? $controls['acf'] : null;

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

	// If the current user is logged in, fetch their ID, otherwise 0.
	$current_user_id = get_current_user_id();

	// Array of results for each rule set.
	$rule_sets_test_results = array();

	foreach ( $rule_sets as $rule_set ) {
		$enable = isset( $rule_set['enable'] ) ? $rule_set['enable'] : true;

		if ( 1 === count( $rule_sets ) ) {

			// This handles ACF rule sets in v1.8 and lower.
			$rules =
				isset( $rule_set['rules'] ) ? $rule_set['rules'] : $rule_set;
		} else {
			$rules = isset( $rule_set['rules'] ) ? $rule_set['rules'] : array();
		}

		if ( $enable && 0 < count( $rules ) ) {

			// Array of results for each rule within the current rule set.
			$rule_set_test_results = array();

			foreach ( $rules as $rule ) {
				$field           = isset( $rule['field'] ) ? $rule['field'] : null;
				$sub_field       = isset( $rule['subField'] ) ? $rule['subField'] : '';
				$operator        = isset( $rule['operator'] ) ? $rule['operator'] : null;
				$value           = isset( $rule['value'] ) ? $rule['value'] : null;
				$is_user_field   = in_array( $sub_field, array( 'true', 'user' ), true );
				$is_option_field = 'option' === $sub_field;

				// Assume error and try to disprove.
				$test_result = 'error';

				if ( $field && $operator ) {

					$acf_field = null;

					if ( $is_user_field ) {
						if ( ! $current_user_id ) {
							// User field is being evaluated but no current user is logged in.
							$test_result = 'hidden';
						} else {
							$acf_field = get_field_object( $field, 'user_' . $current_user_id );
						}
					} elseif ( $is_option_field ) {
						// Get the ACF field for options pages.
						$acf_field = get_field_object( $field, 'option' );
					} else {
						// Get the ACF field for the current post.
						$acf_field = get_field_object( $field );
					}

					if ( $acf_field && is_array( $acf_field ) ) {
						$result = run_acf_rule_tests(
							$operator,
							$value,
							$acf_field
						);

						if ( 'error' !== $result ) {
							$test_result = $result ? 'visible' : 'hidden';
						}
					}
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
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\acf_test', 15, 3 );

/**
 * Run the individual rule tests.
 *
 * @since 1.8.0
 *
 * @param string $operator  The rule operator.
 * @param string $value     The rule value.
 * @param array  $acf_field The ACF fielded array.
 * @return boolean          Return true if the test passes.
 */
function run_acf_rule_tests( $operator, $value, $acf_field ) {

	if ( ! isset( $acf_field['value'] ) ) {
		return false;
	}

	$field_value = $acf_field['value'];

	// Used to detect "choice" field type values.
	$is_array = is_array( $field_value );

	// Assume error and try to disprove.
	$test_result = 'error';

	if ( 'notEmpty' === $operator ) {
		$test_result = ! empty( $field_value );
	} elseif ( 'empty' === $operator ) {
		$test_result = empty( $field_value );
	} elseif ( isset( $value ) ) {

		// Choice values are generally arrays and need to be treated differently.
		// Allow for type juggling here since array can include strings or numbers.
		if ( is_array( $field_value ) ) {
			switch ( $operator ) {
				case 'equal':
					$test_result = in_array( $value, $field_value ) && count( $field_value ) === 1; // phpcs:ignore
					break;

				case 'notEqual':
					$test_result = ! in_array( $value, $field_value ); // phpcs:ignore
					break;

				case 'contains':
					$test_result = in_array( $value, $field_value ); // phpcs:ignore
					break;

				case 'notContain':
					$test_result = ! in_array( $value, $field_value ); // phpcs:ignore
					break;

				default:
					$test_result = 'error';  // We don't have a valid operator, so throw error.
					break;
			}
		} else {

			// Use "equal" instead of "identical" to allow for type juggling.
			switch ( $operator ) {
				case 'equal':
					$test_result = $field_value == $value; // phpcs:ignore
					break;

				case 'notEqual':
					$test_result = $field_value != $value; // phpcs:ignore
					break;

				case 'greaterThan':
					$test_result = $field_value > $value;
					break;

				case 'greaterThanEqual':
					$test_result = $field_value >= $value;
					break;

				case 'lessThan':
					$test_result = $field_value < $value;
					break;

				case 'lessThanEqual':
					$test_result = $field_value <= $value;
					break;

				case 'contains':
					$test_result = strpos( $field_value, $value ) !== false;
					break;

				case 'notContain':
					$test_result = strpos( $field_value, $value ) === false;
					break;
			}
		}
	} else {
		$test_result = 'error';  // We don't have a valid operator, so throw error.
	}

	return $test_result;
}
