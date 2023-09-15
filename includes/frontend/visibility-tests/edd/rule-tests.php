<?php
/**
 * Individual rule tests for the WooCommerce control visibility tests.
 *
 * @package block-visibility
 * @since   3.1.0
 */

namespace BlockVisibility\Frontend\VisibilityTests\EDD;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\create_date_time;
use function BlockVisibility\Frontend\VisibilityTests\integer_value_compare;
use function BlockVisibility\Frontend\VisibilityTests\date_value_compare;
use function BlockVisibility\Frontend\VisibilityTests\contains_value_compare;

/**
 * Run the Easy Digital Downloads cart contents test.
 *
 * @since 3.1.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_cart_contents_test( $rule ) {

	// The cart contents test is unique in the it does not always need the operator or value.
	if ( ! isset( $rule['subField'] ) ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$sub_field       = $rule['subField'];
	$cart_products   = get_product_information_from_cart();
	$cart_categories = get_category_information_from_products( $cart_products );

	if ( 'empty' === $sub_field ) {

		$test_result = 0 === count( $cart_products ) ? 'visible' : 'hidden';

	} elseif ( 'notEmpty' === $sub_field ) {

		$test_result = 0 < count( $cart_products ) ? 'visible' : 'hidden';

	} elseif (
		isset( $rule['operator'] ) &&
		isset( $rule['value'] ) &&
		! empty( $rule['value'] ) &&
		is_array( $rule['value'] )
	) {

		if ( 'containsProducts' === $sub_field ) {
			$results = array();

			// Loop through selected products.
			foreach ( $rule['value'] as $product ) {
				$results[] = array_key_exists( $product, $cart_products ) ? 'true' : 'false';
			}

			$test_result = contains_value_compare( $rule['operator'], $results );

		} elseif ( 'containsCategories' === $sub_field ) {
			$results = array();

			// Loop through selected categories.
			foreach ( $rule['value'] as $category ) {
				$results[] = array_key_exists( $category, $cart_categories ) ? 'true' : 'false';
			}

			$test_result = contains_value_compare( $rule['operator'], $results );
		}
	}

	return $test_result;
}

/**
 * Run the Easy Digital Downloads cart total test.
 *
 * @since 3.1.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_cart_total_quantity_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// The required functions are not available, so throw error.
	if ( ! function_exists( 'edd_get_cart_quantity' ) ) {
		return 'error';
	}

	$cart_quantity = edd_get_cart_quantity();
	$test_result   = integer_value_compare( $rule['operator'], $rule['value'], $cart_quantity );

	return $test_result ? 'visible' : 'hidden';
}

/**
 * Run the Easy Digital Downloads cart total test.
 *
 * @since 3.1.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_cart_total_value_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// The required functions are not available, so throw error.
	if ( ! function_exists( 'edd_get_cart_total' ) ) {
		return 'error';
	}

	$cart_total  = edd_get_cart_total();
	$test_result = integer_value_compare( $rule['operator'], $rule['value'], $cart_total );

	return $test_result ? 'visible' : 'hidden';
}

/**
 * Run the Easy Digital Downloads quantity of product in cart test.
 *
 * @since 3.1.0
 *
 * @param array  $rule       All rule settings.
 * @param string $test_param The parameter to test, currently support: 'quantity', 'total'.
 * @return string            Returns 'visible', 'hidden', or 'error'.
 */
function run_cart_product_quantity_test( $rule, $test_param ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] ) ||
		! isset( $test_param )
	) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$sub_field = $rule['subField'];
	$products  = get_product_information_from_cart();

	if ( ! empty( $sub_field ) && is_array( $sub_field ) ) {
		$results = array();

		foreach ( $sub_field as $field ) {

			if ( $field && array_key_exists( $field, $products ) ) {
				$qty_ordered = $products[ $field ][ $test_param ];
			} else {
				$qty_ordered = 0;
			}

			$results[] =
				integer_value_compare( $rule['operator'], $rule['value'], $qty_ordered )
					? 'true'
					: 'false';
		}

		// The rule needs to pass for all selected products.
		$test_result = ! in_array( 'false', $results, true ) ? 'visible' : 'hidden';
	}

	return $test_result;
}

/**
 * Run the Easy Digital Downloads quantity of categories in cart test.
 *
 * @since 3.1.0
 *
 * @param array  $rule        All rule settings.
 * @param string $test_param The parameter to test, currently support: 'quantity', 'total'.
 * @return string            Returns 'visible', 'hidden', or 'error'.
 */
function run_cart_category_quantity_test( $rule, $test_param ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] ) ||
		! isset( $test_param )
	) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$sub_field  = $rule['subField'];
	$products   = get_product_information_from_cart();
	$categories = get_category_information_from_products( $products );

	if ( ! empty( $sub_field ) && is_array( $sub_field ) ) {
		$results = array();

		foreach ( $sub_field as $field ) {
			if ( $field && array_key_exists( $field, $categories ) ) {
				$qty_ordered = $categories[ $field ][ $test_param ];
			} else {
				$qty_ordered = 0;
			}

			$results[] =
				integer_value_compare( $rule['operator'], $rule['value'], $qty_ordered )
					? 'true'
					: 'false';
		}

		// The rule needs to pass for all selected categories.
		$test_result = ! in_array( 'false', $results, true ) ? 'visible' : 'hidden';
	}

	return $test_result;
}

/**
 * Run the Easy Digital Downloads customer total spent test.
 *
 * @since 3.1.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_total_spent_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// The required functions are not available, so throw error.
	if ( ! function_exists( 'edd_purchase_total_of_user' ) ) {
		return 'error';
	}

	// If the user is not logged-in and this rule is set, hide the block.
	if ( ! is_user_logged_in() ) {
		return 'hidden';
	}

	$total_spent = edd_purchase_total_of_user( get_current_user_id() );
	$test_result = integer_value_compare(
		$rule['operator'],
		$rule['value'],
		$total_spent
	);

	return $test_result ? 'visible' : 'hidden';
}

/**
 * Run the Easy Digital Downloads customer total orders test.
 *
 * @since 3.1.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_total_orders_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// The required functions are not available, so throw error.
	if ( ! function_exists( 'edd_count_purchases_of_customer' ) ) {
		return 'error';
	}

	// If the user is not logged-in and this rule is set, hide the block.
	if ( ! is_user_logged_in() ) {
		return 'hidden';
	}

	$orders      = edd_count_purchases_of_customer( get_current_user_id() );
	$test_result = integer_value_compare(
		$rule['operator'],
		$rule['value'],
		$orders
	);

	return $test_result ? 'visible' : 'hidden';
}

/**
 * Run the Easy Digital Downloads customer average order value test.
 *
 * @since 3.1.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_average_order_value_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// The required functions are not available, so throw error.
	if (
		! function_exists( 'edd_count_purchases_of_customer' ) ||
		! function_exists( 'edd_purchase_total_of_user' )
	) {
		return 'error';
	}

	// If the user is not logged-in and this rule is set, hide the block.
	if ( ! is_user_logged_in() ) {
		return 'hidden';
	}

	$total_spent         = edd_purchase_total_of_user( get_current_user_id() );
	$orders              = edd_count_purchases_of_customer( get_current_user_id() );
	$average_order_value = 0;

	if ( 0 < $total_spent && 0 < $orders ) {
		$average_order_value = $total_spent / $orders;
	}

	$test_result = integer_value_compare(
		$rule['operator'],
		$rule['value'],
		$average_order_value
	);

	return $test_result ? 'visible' : 'hidden';
}

/**
 * Run the Easy Digital Downloads customer average order value test.
 *
 * @since 3.1.0
 *
 * @param array  $rule       All rule settings.
 * @param string $test_param The parameter to test, currently supports: 'quantity'.
 * @return string            Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_quantity_product_ordered_test( $rule, $test_param ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] ) ||
		! isset( $test_param )
	) {
		return 'error';
	}

	// If the user is not logged-in and this rule is set, hide the block.
	if ( ! is_user_logged_in() ) {
		return 'hidden';
	}

	$sub_field = $rule['subField'];
	$products  = get_product_information_from_orders( get_current_user_id() );

	// An error has been encountered.
	if ( 'error' === $products ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	if ( ! empty( $sub_field ) && is_array( $sub_field ) ) {
		$results = array();

		foreach ( $sub_field as $field ) {

			if ( $field && array_key_exists( $field, $products ) ) {
				$qty_ordered = $products[ $field ][ $test_param ];
			} else {
				$qty_ordered = 0;
			}

			$results[] =
				integer_value_compare( $rule['operator'], $rule['value'], $qty_ordered )
					? 'true'
					: 'false';
		}

		// The rule needs to pass for all selected products.
		$test_result = ! in_array( 'false', $results, true ) ? 'visible' : 'hidden';
	}

	return $test_result;
}

/**
 * Run the Easy Digital Downloads customer quantity of product ordered test.
 *
 * @since 3.1.0
 *
 * @param array  $rule       All rule settings.
 * @param string $test_param The parameter to test, currently supports: 'quantity'.
 * @return string            Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_quantity_category_ordered_test( $rule, $test_param ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] ) ||
		! isset( $test_param )
	) {
		return 'error';
	}

	// If the user is not logged-in and this rule is set, hide the block.
	if ( ! is_user_logged_in() ) {
		return 'hidden';
	}

	$sub_field  = $rule['subField'];
	$products   = get_product_information_from_orders( get_current_user_id() );
	$categories = get_category_information_from_products( $products );

	// Assume error and try to disprove.
	$test_result = 'error';

	if ( ! empty( $sub_field ) && is_array( $sub_field ) ) {
		$results = array();

		foreach ( $sub_field as $field ) {

			if ( $field && array_key_exists( $field, $categories ) ) {
				$qty_ordered = $categories[ $field ][ $test_param ];
			} else {
				$qty_ordered = 0;
			}

			$results[] =
				integer_value_compare( $rule['operator'], $rule['value'], $qty_ordered )
					? 'true'
					: 'false';
		}

		// The rule needs to pass for all selected categories.
		$test_result = ! in_array( 'false', $results, true ) ? 'visible' : 'hidden';
	}

	return $test_result;
}

/**
 * Run the Easy Digital Downloads customer time since last order test.
 *
 * @since 1.2.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_time_since_order_test( $rule ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] )
	) {
		return 'error';
	}

	$order_type = $rule['subField'];
	$operator   = $rule['operator'];
	$rule_value = $rule['value'];

	if ( ! $operator || ! $rule_value ) {
		return 'error';
	}

	$payments = get_payments_by_date( get_current_user_id() );

	// If the user hasn't ordered products, fail the test.
	if ( empty( $payments ) ) {
		return 'hidden';
	}

	// Retrieve either the first or last payment.
	if ( 'first' === $order_type ) {
		$payment = $payments[0];
	} else {
		$payment = array_values( array_slice( $payments, -1 ) )[0];
	}

	$payment_date = create_date_time( $payment['date'], false );

	// Current time based on the date/time settings set in the WP admin.
	$current = current_datetime();

	// Calculate the number of days between the two dates, then add 1.
	$days_between = $current->diff( $payment_date, true )->d;
	$days_between = ++$days_between;

	$test_result = integer_value_compare( $operator, $rule_value, $days_between );

	return $test_result ? 'visible' : 'hidden';
}

/**
 * Run the Easy Digital Downloads customer time since product ordered test.
 *
 * @since 1.2.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_time_since_product_ordered_test( $rule ) {

	if (
		! isset( $rule['subFields']['orderType'] ) ||
		! isset( $rule['subFields']['products'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] )
	) {
		return 'error';
	}

	$order_type        = $rule['subFields']['orderType'];
	$selected_products = $rule['subFields']['products'];
	$operator          = $rule['operator'];
	$rule_value        = $rule['value'];

	// Currently only 'first' or 'last' order types are supported. Also return
	// an error if the selected product, operator and/or value are missing.
	if (
		( 'first' !== $order_type && 'last' !== $order_type ) ||
		empty( $selected_products ) ||
		! is_array( $selected_products ) ||
		! $operator ||
		! $rule_value
	) {
		return 'error';
	}

	$payments         = get_payments_by_date( get_current_user_id() );
	$ordered_products = get_products_by_payment_date( $payments, $order_type );

	// If the user hasn't ordered products, fail the test.
	if ( empty( $ordered_products ) ) {
		return 'hidden';
	}

	$results = array();

	foreach ( $selected_products as $selected_product ) {

		if ( $selected_product && array_key_exists( $selected_product, $ordered_products ) ) {
			$order_date = create_date_time( $ordered_products[ $selected_product ], false );

			// Current time based on the date/time settings set in the WP admin.
			$current = current_datetime();

			// Calculate the number of days between the two dates, then add 1.
			$days_between = $current->diff( $order_date, true )->d;
			$days_between = ++$days_between;
		} else {
			$days_between = 'not-ordered';
		}

		// If the selected product was never ordered, fail the test.
		if ( 'not-ordered' === $days_between ) {
			$results[] = 'false';
		} else {
			$results[] =
				integer_value_compare( $operator, $rule_value, $days_between )
					? 'true'
					: 'false';
		}
	}

	// The rule needs to pass for all selected products.
	$test_result = ! in_array( 'false', $results, true ) ? 'visible' : 'hidden';

	return $test_result;
}

/**
 * Run the Easy Digital Downloads customer time since category ordered test.
 *
 * @since 1.2.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_time_since_category_ordered_test( $rule ) {
	if (
		! isset( $rule['subFields']['orderType'] ) ||
		! isset( $rule['subFields']['categories'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] )
	) {
		return 'error';
	}

	$order_type    = $rule['subFields']['orderType'];
	$selected_cats = $rule['subFields']['categories'];
	$operator      = $rule['operator'];
	$rule_value    = $rule['value'];

	// Currently only 'first' or 'last' order types are supported. Also return
	// an error if the selected categories, operator and/or value are missing.
	if (
		( 'first' !== $order_type && 'last' !== $order_type ) ||
		empty( $selected_cats ) ||
		! is_array( $selected_cats ) ||
		! $operator ||
		! $rule_value
	) {
		return 'error';
	}

	$payments     = get_payments_by_date( get_current_user_id() );
	$ordered_cats = get_categories_by_payment_date( $payments, $order_type );

	// If the user hasn't ordered products with categories, fail the test.
	if ( empty( $ordered_cats ) ) {
		return 'hidden';
	}

	$results = array();

	foreach ( $selected_cats as $selected_cat ) {

		if ( $selected_cat && array_key_exists( $selected_cat, $ordered_cats ) ) {
			$order_date = create_date_time( $ordered_cats[ $selected_cat ], false );

			// Current time based on the date/time settings set in the WP admin.
			$current = current_datetime();

			// Calculate the number of days between the two dates, then add 1.
			$days_between = $current->diff( $order_date, true )->d;
			$days_between = ++$days_between;
		} else {
			$days_between = 'not-ordered';
		}

		// If the selected product was never ordered, fail the test.
		if ( 'not-ordered' === $days_between ) {
			$results[] = 'false';
		} else {
			$results[] =
				integer_value_compare( $operator, $rule_value, $days_between )
					? 'true'
					: 'false';
		}
	}

	// The rule needs to pass for all selected products.
	$test_result = ! in_array( 'false', $results, true ) ? 'visible' : 'hidden';

	return $test_result;
}

/**
 * Run the Easy Digital Downloads customer date of order test.
 *
 * @since 1.2.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_date_of_order_test( $rule ) {

	if (
		! isset( $rule['subField'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] )
	) {
		return 'error';
	}

	$order_type = $rule['subField'];
	$operator   = $rule['operator'];
	$rule_value = $rule['value'];

	if ( ! $operator || ! $rule_value ) {
		return 'error';
	}

	$payments = get_payments_by_date( get_current_user_id() );

	// If the user hasn't ordered products, fail the test.
	if ( empty( $payments ) ) {
		return 'hidden';
	}

	// Retrieve either the first or last payment.
	if ( 'first' === $order_type ) {
		$payment = $payments[0];
	} else {
		$payment = array_values( array_slice( $payments, -1 ) )[0];
	}

	// Get payment date and remove any time.
	$payment_datetime = create_date_time( $payment['date'], false );
	$payment_date     = $payment_datetime->setTime( 0, 0, 0 );

	// Get selected date and remove any time.
	$selected_datetime = create_date_time( $rule['value'], false );
	$selected_date     = $selected_datetime->setTime( 0, 0, 0 );

	$test_result = date_value_compare( $operator, $selected_date, $payment_date );

	return $test_result ? 'visible' : 'hidden';
}

/**
 * Run the Easy Digital Downloads customer date of product ordered test.
 *
 * @since 1.2.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_date_of_product_ordered_test( $rule ) {

	if (
		! isset( $rule['subFields']['orderType'] ) ||
		! isset( $rule['subFields']['products'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] )
	) {
		return 'error';
	}

	$order_type        = $rule['subFields']['orderType'];
	$selected_products = $rule['subFields']['products'];
	$operator          = $rule['operator'];
	$rule_value        = $rule['value'];

	// Currently only 'first' or 'last' order types are supported. Also return
	// an error if the selected product, operator and/or value are missing.
	if (
		( 'first' !== $order_type && 'last' !== $order_type ) ||
		empty( $selected_products ) ||
		! is_array( $selected_products ) ||
		! $operator ||
		! $rule_value
	) {
		return 'error';
	}

	$payments         = get_payments_by_date( get_current_user_id() );
	$ordered_products = get_products_by_payment_date( $payments, $order_type );

	// If the user hasn't ordered products, fail the test.
	if ( empty( $ordered_products ) ) {
		return 'hidden';
	}

	$results = array();

	foreach ( $selected_products as $selected_product ) {

		if ( $selected_product && array_key_exists( $selected_product, $ordered_products ) ) {

			// Get payment date and remove any time.
			$payment_datetime = create_date_time( $ordered_products[ $selected_product ], false );
			$payment_date     = $payment_datetime->setTime( 0, 0, 0 );

			// Get selected date and remove any time.
			$selected_datetime = create_date_time( $rule_value, false );
			$selected_date     = $selected_datetime->setTime( 0, 0, 0 );

			$results[] =
				date_value_compare( $operator, $selected_date, $payment_date )
					? 'true'
					: 'false';
		} else {
			// If the selected product was never ordered, fail the test.
			$results[] = 'false';
		}
	}

	// The rule needs to pass for all selected products.
	$test_result = ! in_array( 'false', $results, true ) ? 'visible' : 'hidden';

	return $test_result;
}

/**
 * Run the Easy Digital Downloads customer date of category ordered test.
 *
 * @since 1.2.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_customer_date_of_category_ordered_test( $rule ) {

	if (
		! isset( $rule['subFields']['orderType'] ) ||
		! isset( $rule['subFields']['categories'] ) ||
		! isset( $rule['operator'] ) ||
		! isset( $rule['value'] )
	) {
		return 'error';
	}

	$order_type    = $rule['subFields']['orderType'];
	$selected_cats = $rule['subFields']['categories'];
	$operator      = $rule['operator'];
	$rule_value    = $rule['value'];

	// Currently only 'first' or 'last' order types are supported. Also return
	// an error if the selected product, operator and/or value are missing.
	if (
		( 'first' !== $order_type && 'last' !== $order_type ) ||
		empty( $selected_cats ) ||
		! is_array( $selected_cats ) ||
		! $operator ||
		! $rule_value
	) {
		return 'error';
	}

	$payments     = get_payments_by_date( get_current_user_id() );
	$ordered_cats = get_categories_by_payment_date( $payments, $order_type );

	// If the user hasn't ordered products, fail the test.
	if ( empty( $ordered_cats ) ) {
		return 'hidden';
	}

	$results = array();

	foreach ( $selected_cats as $selected_cat ) {

		if ( $selected_cat && array_key_exists( $selected_cat, $ordered_cats ) ) {

			// Get payment date and remove any time.
			$payment_datetime = create_date_time( $ordered_cats[ $selected_cat ], false );
			$payment_date     = $payment_datetime->setTime( 0, 0, 0 );

			// Get selected date and remove any time.
			$selected_datetime = create_date_time( $rule_value, false );
			$selected_date     = $selected_datetime->setTime( 0, 0, 0 );

			$results[] =
				date_value_compare( $operator, $selected_date, $payment_date )
					? 'true'
					: 'false';
		} else {
			// If the selected product was never ordered, fail the test.
			$results[] = 'false';
		}
	}

	// The rule needs to pass for all selected products.
	$test_result = ! in_array( 'false', $results, true ) ? 'visible' : 'hidden';

	return $test_result;
}
