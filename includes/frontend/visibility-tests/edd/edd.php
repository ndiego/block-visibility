<?php
/**
 * Adds a filter to the visibility test for the Easy Digital Download control.
 *
 * @package block-visibility
 * @since   3.1.0
 */

namespace BlockVisibility\Frontend\VisibilityTests\EDD;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled;
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/edd/rule-tests.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/edd/helper-functions.php';

/**
 * Run test to see if block visibility should be restricted by Easy Digital Downloads rules.
 *
 * @since 3.1.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not.
 */
function edd_test( $is_visible, $settings, $controls ) {

	// If the test is already false, or WooCommerce is not active, skip this test.
	if ( ! $is_visible || ! class_exists( 'Easy_Digital_Downloads' ) ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'edd' ) ) {
		return true;
	}

	$control_atts = isset( $controls['edd'] ) ? $controls['edd'] : null;

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

				$test_result = run_rule_tests( $rule );

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
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\edd_test', 15, 3 );

/**
 * Run the individual rule tests.
 *
 * @since 3.1.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_rule_tests( $rule ) {

	$field = isset( $rule['field'] ) ? $rule['field'] : null;

	// No field is set, so return an error.
	if ( ! $field ) {
		return 'error';
	}

	switch ( $field ) {

		// Cart rule tests.
		case 'cartContents':
			$test_result = run_cart_contents_test( $rule );
			break;

		case 'cartTotalQuantity':
			$test_result = run_cart_total_quantity_test( $rule );
			break;

		case 'cartTotalValue':
			$test_result = run_cart_total_value_test( $rule );
			break;

		case 'cartProductQuantity':
			$test_result = run_cart_product_quantity_test( $rule, 'quantity' );
			break;

		case 'cartCategoryQuantity':
			$test_result = run_cart_category_quantity_test( $rule, 'quantity' );
			break;

		// Customer rule tests.
		case 'customerTotalSpent':
			$test_result = run_customer_total_spent_test( $rule );
			break;

		case 'customerTotalOrders':
			$test_result = run_customer_total_orders_test( $rule );
			break;

		case 'customerAverageOrderValue':
			$test_result = run_customer_average_order_value_test( $rule );
			break;

		case 'customerQuantityProductOrdered':
			$test_result = run_customer_quantity_product_ordered_test( $rule, 'quantity' );
			break;

		case 'customerQuantityCategoryOrdered':
			$test_result = run_customer_quantity_category_ordered_test( $rule, 'quantity' );
			break;

		case 'customerTimeSinceOrder':
			$test_result = run_customer_time_since_order_test( $rule );
			break;

		case 'customerTimeSinceProductOrdered':
			$test_result = run_customer_time_since_product_ordered_test( $rule );
			break;

		case 'customerTimeSinceCategoryOrdered':
			$test_result = run_customer_time_since_category_ordered_test( $rule );
			break;

		case 'customerDateOfOrder':
			$test_result = run_customer_date_of_order_test( $rule );
			break;

		case 'customerDateOfProductOrdered':
			$test_result = run_customer_date_of_product_ordered_test( $rule );
			break;

		case 'customerDateOfCategoryOrdered':
			$test_result = run_customer_date_of_category_ordered_test( $rule );
			break;

		default:
			$test_result = 'error';
			break;
	}

	return $test_result;
}
