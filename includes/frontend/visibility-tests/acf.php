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
 * Run the individual rule tests.
 *
 * @since 1.8.0
 *
 * @param string $rule_operator The rule operator.
 * @param string $rule_value    The rule value.
 * @param array  $acf_field     The ACF filed array.
 * @return boolean              Return true if the test passes.
 */
function run_rule_tests( $rule_operator, $rule_value, $acf_field ) {

	if ( ! isset( $acf_field['value'] ) ) {
		return false;
	}

	switch ( $rule_operator ) {
		case '!=empty' :
			$test_result = ! empty( $acf_field['value'] ) ? true : false;
			break;

		case '==empty' :
			$test_result = empty( $acf_field['value'] ) ? true : false;
			break;

		case '==' :
			$test_result = $acf_field['value'] === $rule_value ? true : false;
			break;

		case '!=' :
			$test_result = $acf_field['value'] !== $rule_value ? true : false;
			break;

		case '==contains' :
			if ( strpos( $acf_field['value'], $rule_value ) !== false ) {
				$test_result = true;
			} else {
				$test_result = false;
			}
			break;

		case '!=contains' :
			if ( strpos( $acf_field['value'], $rule_value ) === false ) {
				$test_result = true;
			} else {
				$test_result = false;
			}
			break;

		default:
			$test_result = false;
			break;
	}

	return $test_result;
}

/**
 * Run test to see if block visibility should be restricted by ACF field rules.
 *
 * @since 1.8.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $attributes The block visibility attributes.
 * @return boolean            Return true if the block should be visible, false if not.
 */
function acf_test( $is_visible, $settings, $attributes ) {

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

	$has_control_sets = isset( $attributes['controlSets'] );

	if ( $has_control_sets ) {
		// Just retrieve the first set, need to update in future.
		$acf_atts =
			isset( $attributes['controlSets'][0]['controls']['acf'] )
				? $attributes['controlSets'][0]['controls']['acf']
				: null;
	} else {
		// There are no control sets, so skip tests.
		return true;
	}

	// There are no ACF settings, so skip tests.
	if ( ! $acf_atts ) {
		return true;
	}

	$rule_sets = isset( $acf_atts['ruleSets'] ) ? $acf_atts['ruleSets'] : null;

	// There are no ACF rule sets, so skip tests.
	if ( ! $rule_sets || ! is_array( $rule_sets ) ) {
		return true;
	}

	$rule_sets_test = array();

	foreach ( $rule_sets as $rule_set ) {
		$rule_set_test = array();

		foreach ( $rule_set as $rule ) {
			$rule_field    = isset( $rule['field'] ) ? $rule['field'] : null;
			$rule_operator = isset( $rule['operator'] ) ? $rule['operator'] : '!=empty';
			$rule_value    = isset( $rule['value'] ) ? $rule['value'] : '';

			$test_result = false;

			if ( $rule_field ) {
				$acf_field = get_field_object( $rule_field );

				if ( $acf_field && is_array( $acf_field ) ) {
					$test_result = run_rule_tests( $rule_operator, $rule_value, $acf_field );
				}
			}

			$rule_set_test[] = $test_result ? 'pass' : 'fail';
		}

		// Within a rule set, all tests have to pass.
		$rule_sets_test[] =
			in_array( 'fail', $rule_set_test, true ) ? 'fail' : 'pass';
	}

	// Within a rule sets, we just need one to pass.
	$test_result = in_array( 'pass', $rule_sets_test, true );

	$hide_on_rule_sets =
		isset( $acf_atts['hideOnRuleSets'] ) ?
		$acf_atts['hideOnRuleSets'] :
		false;

	// Flip the test result based on the "hide on rule set" setting.
	if ( $hide_on_rule_sets ) {
		return ! $test_result;
	} else {
		return $test_result;
	}
}

// Run all integration tests at "15" priority, which is after the main controls,
// but before the final "hide block" tests.
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\acf_test', 15, 3 );
