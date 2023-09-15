<?php
/**
 * Helper functions for the WooCommerce control visibility tests.
 *
 * @package block-visibility
 * @since   3.1.0
 */

namespace BlockVisibility\Frontend\VisibilityTests\WooCommerce;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\create_date_time;

/**
 * Helper function to retrieve product information from past orders.
 *
 * @since 3.1.0
 *
 * @param array $orders An array of WooCommerce order objects.
 * @return array        Returns array of product information.
 */
function get_product_information_from_orders( $orders ) {

	if ( empty( $orders ) && ! is_array( $orders ) ) {
		return array();
	}

	$products = array();

	foreach ( $orders as $order ) {
		$order_id    = $order->get_id();
		$order_items = $order->get_items();

		if (
			$order_id &&
			! empty( $order_items ) &&
			is_array( $order_items )
		) {
			foreach ( $order_items as $item ) {
				$id       = $item->get_product_id();
				$var_id   = $item->get_variation_id();
				$quantity = (int) $item->get_quantity();
				$total    = (float) $item->get_total();
				$cats     = wc_get_product_term_ids( $id, 'product_cat' );

				$products = process_product_data( $products, $id, $var_id, $quantity, $total, $cats );
			}
		}
	}

	return $products;
}

/**
 * Helper function to retrieve product information from the shopping cart.
 *
 * @since 3.1.0
 *
 * @return array Returns array of product information.
 */
function get_product_information_from_cart() {

	if ( ! function_exists( 'WC' ) || ! class_exists( 'woocommerce' ) || ! isset( WC()->cart ) ) {
		return array();
	}

	$cart = WC()->cart->get_cart();

	$products = array();

	if ( ! empty( $cart ) && is_array( $cart ) ) {

		foreach ( $cart as $item ) {
			$id       = isset( $item['product_id'] ) ? $item['product_id'] : '';
			$var_id   = isset( $item['variation_id'] ) ? $item['variation_id'] : '';
			$quantity = isset( $item['quantity'] ) ? (int) $item['quantity'] : 0;
			$total    = isset( $item['line_total'] ) ? (float) $item['line_total'] : 0;
			$cats     = wc_get_product_term_ids( $id, 'product_cat' );

			$products = process_product_data( $products, $id, $var_id, $quantity, $total, $cats );
		}
	}

	return $products;
}

/**
 * Helper function to retrieve category information from an array of products.
 *
 * @since 3.1.0
 *
 * @param array $products An pre-formatted array of products.
 * @return array          Returns array of category information.
 */
function get_category_information_from_products( $products ) {

	$categories = array();

	if ( ! empty( $products ) && is_array( $products ) ) {
		foreach ( $products as $product ) {
			$qty   = isset( $product['quantity'] ) ? (int) $product['quantity'] : 0;
			$total = isset( $product['total'] ) ? (float) $product['total'] : 0;
			$cats  = isset( $product['categories'] ) ? $product['categories'] : null;

			if ( ! empty( $cats ) && is_array( $cats ) ) {
				foreach ( $cats as $cat ) {

					if ( array_key_exists( $cat, $categories ) ) {
						$categories[ $cat ]['quantity'] = $categories[ $cat ]['quantity'] + $qty;
						$categories[ $cat ]['total']    = $categories[ $cat ]['total'] + $total;
					} else {
						$categories[ $cat ] = array(
							'quantity' => $qty,
							'total'    => $total,
						);
					}
				}
			}
		}
	}

	return $categories;
}

/**
 * Helper function to reformat product data into a usable array.
 *
 * @since 1.2.0
 *
 * @param array  $products Array of products.
 * @param string $id       The product id.
 * @param string $var_id   The product variation id if it exits.
 * @param int    $quantity The qualtity of the product.
 * @param int    $total    The total value of the product.
 * @param array  $cats     The categories assigned to the product.
 * @return array           Returns array of product information.
 */
function process_product_data( $products, $id, $var_id, $quantity, $total, $cats ) {

	if ( $id ) {
		if ( $id && array_key_exists( $id, $products ) ) {
			$products[ $id ]['quantity'] = $products[ $id ]['quantity'] + $quantity;
			$products[ $id ]['total']    = $products[ $id ]['total'] + $total;
		} else {
			$products[ $id ] = array(
				'quantity' => $quantity,
				'total'    => $total,
			);
		}

		$products[ $id ]['categories'] = $cats;

		// Add an entry for the variable price, if it exists.
		if ( $var_id ) {

			// Append the variable price id to the product id.
			$var_price_id = $id . '_' . $var_id;

			if ( array_key_exists( $var_price_id, $products ) ) {
				$products[ $var_price_id ]['quantity'] = $products[ $var_price_id ]['quantity'] + $quantity;
				$products[ $var_price_id ]['total']    = $products[ $var_price_id ]['total'] + $total;
			} else {
				$products[ $var_price_id ] = array(
					'quantity' => $quantity,
					'total'    => $total,
				);
			}

			$products[ $var_price_id ]['categories'] = $cats;
		}
	}

	return $products;
}

/**
 * Helper function to retrieve past orders by date.
 *
 * @since 1.2.0
 *
 * @return array Returns array of payment information.
 */
function get_payments_by_date() {

	$orders =
		wc_get_orders(
			array(
				'customer_id' => get_current_user_id(),
				'status'      => array( 'wc-completed' ),
			)
		);

	if ( empty( $orders ) && ! is_array( $orders ) ) {
		return array();
	}

	$payment_dates = array();

	foreach ( $orders as $order ) {
		$order_id    = $order->get_id();
		$order_items = $order->get_items();
		$order_date  = $order->get_date_created(); // Note we don't want to use get_date_completed. If a user modifies the order date, it will not be reflected in get_date_completed.

		if (
			$order_id &&
			! empty( $order_items ) &&
			is_array( $order_items )
		) {
			$purchased_products = array();
			$purchased_cats     = array();

			foreach ( $order_items as $item ) {
				$id       = $item->get_product_id();
				$var_id   = $item->get_variation_id();
				$quantity = (int) $item->get_quantity();
				$total    = (float) $item->get_total();
				$cats     = wc_get_product_term_ids( $id, 'product_cat' );

				$purchased_products[] = $id;

				// If there is a variable price, add that as well.
				if ( $var_id ) {

					// Append the variable price id to the product id.
					$var_price_id = $id . '_' . $var_id;

					$purchased_products[] = $var_price_id;
				}

				if ( ! empty( $cats ) && is_array( $cats ) ) {
					foreach ( $cats as $cat ) {
						$purchased_cats[] = $cat;
					}
				}
			}

			$payment_dates[] = array(
				'id'         => $order_id,
				'date'       => $order_date,
				'products'   => $purchased_products,
				'categories' => $purchased_cats,
			);
		}
	}

	if ( ! empty( $payment_dates ) ) {

		// Ensure the payments are ordered from the oldest to the newest.
		usort(
			$payment_dates,
			function ( $a, $b ) {
				return strtotime( $a['date'] ) - strtotime( $b['date'] );
			}
		);
	}

	return $payment_dates;
}

/**
 * Helper function to retrieve payment information for each product based on
 * either the first or last time the product was ordered.
 *
 * @since 1.2.0
 *
 * @param array  $payments All payments made by the current user.
 * @param string $order    The order of the payment, either 'first' or 'last'.
 * @return array           Returns array of product information.
 */
function get_products_by_payment_date( $payments, $order = 'first' ) {

	// If the customer has made no payments return an empty array.
	if ( empty( $payments ) ) {
		return array();
	}

	$products_by_date = array();

	foreach ( $payments as $payment ) {
		$products = $payment['products'];

		foreach ( $products as $product ) {

			if ( isset( $products_by_date[ $product ] ) ) {

				// If there already is a product entry, the product was
				// purchased before.
				$previous = create_date_time( $products_by_date[ $product ], false );
				$current  = create_date_time( $payment['date'], false );

				// Depending on the order, replace the saved payment date with
				// the new one. Otherwise, do nothing.
				if (
					( 'first' === $order && $current < $previous ) ||
					( 'last' === $order && $current > $previous )
				) {
					$products_by_date[ $product ] = $payment['date'];
				}
			} else {

				// There is no entry for this product, so add one.
				$products_by_date[ $product ] = $payment['date'];
			}
		}
	}

	return $products_by_date;
}

/**
 * Helper function to retrieve payment information for each category based on
 * either the first or last time products from the category were ordered.
 *
 * @since 1.2.0
 *
 * @param array  $payments All payments made by the current user.
 * @param string $order    The order of the payment, either 'first' or 'last'.
 * @return array           Returns array of product information.
 */
function get_categories_by_payment_date( $payments, $order = 'first' ) {

	// If the customer has made no payments return an empty array.
	if ( empty( $payments ) ) {
		return array();
	}

	$cats_by_date = array();

	foreach ( $payments as $payment ) {
		$cats = $payment['categories'];

		foreach ( $cats as $cat ) {

			if ( isset( $cats_by_date[ $cat ] ) ) {

				// If there already is a product entry, the product was
				// purchased before.
				$previous = create_date_time( $cats_by_date[ $cat ], false );
				$current  = create_date_time( $payment['date'], false );

				// Depending on the order, replace the saved payment date with
				// the new one. Otherwise, do nothing.
				if (
					( 'first' === $order && $current < $previous ) ||
					( 'last' === $order && $current > $previous )
				) {
					$cats_by_date[ $cat ] = $payment['date'];
				}
			} else {

				// There is no entry for this product, so add one.
				$cats_by_date[ $cat ] = $payment['date'];
			}
		}
	}

	return $cats_by_date;
}

/**
 * Get the product ID based on a rule.
 *
 * @since 3.1.0
 *
 * @param mixed $rule The rule used to determine the product ID.
 *                    If 'dynamicProduct' is provided as the rule's 'subField',
 *                    the current post's ID will be returned. Otherwise, an
 *                    integer representing the 'subField' will be returned.
 *
 * @return int The product ID.
 */
function get_product_id( $rule ) {
	$product_id =
		'dynamicProduct' === $rule['subField']
			? get_the_ID()
			: (int) $rule['subField'];

	return $product_id;
}
