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
use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;

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
				$field         = isset( $rule['field'] ) ? $rule['field'] : null;
				$is_user_field = isset( $rule['subField'] ) ? $rule['subField'] : null;
				$operator      = isset( $rule['operator'] ) ? $rule['operator'] : null;
				$value         = isset( $rule['value'] ) ? $rule['value'] : null;

				// Assume error and try to disprove.
				$test_result = 'error';

				if ( $field && $operator ) {

					$acf_field = null;

					if ( $is_user_field && ! $current_user_id ) {

						// We are evaluating a user field, but the current user
						// is not logged in, so the test fails.
						$test_result = 'hidden';

					} elseif ( $is_user_field && $current_user_id ) {
						$acf_field = get_field_object( $field, 'user_' . $current_user_id );
					} else {
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

	// Assume error and try to disprove.
	$test_result = 'error';

	switch ( $operator ) {
		case 'notEmpty':
			$test_result = ! empty( $acf_field['value'] ) ? true : false;
			break;

		case 'empty':
			$test_result = empty( $acf_field['value'] ) ? true : false;
			break;

		case 'equal':
			if ( isset( $value ) ) {
				// Don't use === here, otherwise numeric ACF field values will return false.
				$test_result = $acf_field['value'] == $value ? true : false;
			}
			break;

		case 'notEqual':
			if ( isset( $value ) ) {
				$test_result = $acf_field['value'] !== $value ? true : false;
			}
			break;

		case 'contains':
			if ( isset( $value ) ) {
				if ( strpos( $acf_field['value'], $value ) !== false ) {
					$test_result = true;
				} else {
					$test_result = false;
				}
			}
			break;

		case 'notContain':
			if ( isset( $value ) ) {
				if ( strpos( $acf_field['value'], $value ) === false ) {
					$test_result = true;
				} else {
					$test_result = false;
				}
			}
			break;

		// Deprecated values.
		case '!=empty':
			$test_result = ! empty( $acf_field['value'] ) ? true : false;
			break;

		case '==empty':
			$test_result = empty( $acf_field['value'] ) ? true : false;
			break;

		case '==':
			if ( isset( $value ) ) {
				// Don't use === here, otherwise numeric field values will not return true.
				$test_result = $acf_field['value'] == $value ? true : false;
			}
			break;

		case '!=':
			if ( isset( $value ) ) {
				$test_result = $acf_field['value'] !== $value ? true : false;
			}
			break;

		case '==contains':
			if ( isset( $value ) ) {
				if ( strpos( $acf_field['value'], $value ) !== false ) {
					$test_result = true;
				} else {
					$test_result = false;
				}
			}
			break;

		case '!=contains':
			if ( isset( $value ) ) {
				if ( strpos( $acf_field['value'], $value ) === false ) {
					$test_result = true;
				} else {
					$test_result = false;
				}
			}
			break;

		default:
			$test_result = 'error';  // We don't have a valid operator, so throw error.
			break;
	}

	return $test_result;
}
