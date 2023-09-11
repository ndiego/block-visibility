<?php
/**
 * Helper functions for the Easy Digital Downloads control visibility tests.
 *
 * @package block-visibility
 * @since   3.1.0
 */

namespace BlockVisibility\Frontend\VisibilityTests\EDD;

defined( 'ABSPATH' ) || exit;

/**
 * External dependencies
 */
use EDD_Payments_Query;
use EDD_Customer;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\create_date_time;

/**
 * Helper function to retrieve payment information for each category based on
 * either the first or last time products from the category were ordered.
 *
 * @since 3.1.0
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
 * Helper function to retrieve payment information for each product based on
 * either the first or last time the product was ordered.
 *
 * @since 3.1.0
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
		$products = $payment['downloads'];

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
 * Helper function to retrieve past orders by date.
 * TODO: Could use refactoring in the future.
 *
 * @since 3.1.0
 *
 * @param string $user_id The id of the current user.
 * @return array          Returns array of payment information.
 */
function get_payments_by_date( $user_id ) {

	// The required functions are not available, so throw error.
	if (
		! class_exists( 'EDD_Customer' ) ||
		! class_exists( 'EDD_Payments_Query' )
	) {
		return 'error';
	}

	$payments = get_payments( $user_id );

	// If there are no payments return an empty array.
	if ( empty( $payments ) ) {
		return array();
	}

	$payment_dates = array();

	// Only retrieve purchase with completed payments.
	foreach ( $payments as $payment ) {

		if ( 'complete' === $payment->status ) {

			$downloads           = $payment->downloads;
			$purchased_downloads = array();
			$purchased_cats      = array();

			if ( ! empty( $downloads ) ) {

				foreach ( $downloads as $download ) {

					$purchased_downloads[] = $download['id'];

					// Check if this product has a variable price.
					$variable_price_id =
						isset( $download['options']['price_id'] )
							? $download['options']['price_id']
							: '';

					// If there is a variable price, add that as well.
					if ( $variable_price_id ) {

						// Append the variable price id to the product id.
						$variable_price_id = $download['id'] . '_' . $variable_price_id;

						$purchased_downloads[] = $variable_price_id;
					}

					$cats = wp_get_object_terms( $download['id'], 'download_category' );

					if ( ! empty( $cats ) && is_array( $cats ) ) {
						foreach ( $cats as $cat ) {
							$purchased_cats[] = $cat->term_id;
						}
					}
				}

				// We don't care about duplicates, only that the download and
				// category was purchased as part of this payment.
				$purchased_downloads = array_unique( $purchased_downloads );
				$purchased_cats      = array_unique( $purchased_cats );
			}

			$payment_dates[] = array(
				'id'         => $payment->ID,
				'date'       => $payment->date, // Note we don't want to use completed_date. If a user modifies the payment date, it will not be reflected in completed_date.
				'downloads'  => $purchased_downloads,
				'categories' => $purchased_cats,
			);
		};
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
 * Helper function to retrieve product information from past orders.
 * TODO: Could use refactoring in the future.
 *
 * Currently only retrieves quantity. Need to be expanded in the future to
 * include value as well as all metrics for product price variations.
 *
 * Adapted from core EDD function: https://github.com/awesomemotive/easy-digital-downloads/blob/main/includes/user-functions.php
 *
 * @since 3.1.0
 *
 * @param string $user_id The id of the current user.
 * @return array          Returns array of product information.
 */
function get_product_information_from_orders( $user_id ) {

	// The required functions are not available, so throw error.
	if (
		! class_exists( 'EDD_Customer' ) ||
		! class_exists( 'EDD_Payments_Query' )
	) {
		return 'error';
	}

	$payments = get_payments( $user_id );

	// If there are no payments return an empty array.
	if ( empty( $payments ) ) {
		return array();
	}

	$products_by_payment = array();

	// Only retrieve purchase with completed payments.
	foreach ( $payments as $payment ) {
		if ( 'complete' === $payment->status ) {
			$products_by_payment[] = $payment->downloads;
		};
	}

	if ( empty( $products_by_payment ) ) {
		return array();
	}

	$products_purchased_raw = array();

	foreach ( $products_by_payment as $products ) {
		$products_purchased_raw = array_merge( $products, $products_purchased_raw );
	}

	$products_purchased = array();

	foreach ( $products_purchased_raw as $products ) {
		$id = isset( $products['id'] ) ? $products['id'] : '';

		if ( $id ) {
			$qty  = isset( $products['quantity'] ) ? $products['quantity'] : 0;
			$cats = wp_get_object_terms( $id, 'download_category' );

			$product_cats = array();

			if ( ! empty( $cats ) && is_array( $cats ) ) {
				foreach ( $cats as $cat ) {
					$product_cats[] = $cat->term_id;
				}
			}

			if ( isset( $products_purchased[ $id ] ) ) {
				$products_purchased[ $id ]['quantity'] = $products_purchased[ $id ]['quantity'] + $qty;
			} else {
				$products_purchased[ $id ]['quantity'] = $qty;
			}

			$products_purchased[ $id ]['categories'] = $product_cats;

			// Check if this product has a variable price.
			$variable_price_id =
				isset( $products['options']['price_id'] )
					? $products['options']['price_id']
					: '';

			// Add an entry for the variable price, if it exists.
			if ( $variable_price_id ) {

				// Append the variable price id to the product id.
				$variable_price_id = $id . '_' . $variable_price_id;

				if ( isset( $products_purchased[ $variable_price_id ] ) ) {
					$products_purchased[ $variable_price_id ]['quantity'] = $products_purchased[ $variable_price_id ]['quantity'] + $qty;
				} else {
					$products_purchased[ $variable_price_id ]['quantity'] = $qty;
				}

				$products_purchased[ $variable_price_id ]['categories'] = $product_cats;
			}
		}
	}

	return $products_purchased;
}

/**
 * Helper function to retrieve product information from the shopping cart.
 * TODO: Could use refactoring in the future.
 *
 * @since 3.1.0
 *
 * @return array Returns array of product information.
 */
function get_product_information_from_cart() {

	if ( ! function_exists( 'edd_get_cart_content_details' ) ) {
		return array();
	}

	$cart          = edd_get_cart_content_details();
	$cart_products = array();

	if ( ! empty( $cart ) && is_array( $cart ) ) {

		foreach ( $cart as $product ) {
			$id = isset( $product['id'] ) ? $product['id'] : '';

			if ( $id ) {
				$quantity = isset( $product['quantity'] ) ? (int) $product['quantity'] : 0;
				$total    = isset( $product['price'] ) ? (float) $product['price'] : 0;
				$cats     = wp_get_object_terms( $id, 'download_category' );

				$product_cats = array();

				if ( ! empty( $cats ) && is_array( $cats ) ) {
					foreach ( $cats as $cat ) {
						$product_cats[] = $cat->term_id;
					}
				}

				// If the product id already exists, that means we have multiple
				// price variations present in the cart. Add them together.
				if ( isset( $cart_products[ $id ] ) ) {
					$cart_products[ $id ]['quantity'] = $cart_products[ $id ]['quantity'] + $quantity;
					$cart_products[ $id ]['total']    = $cart_products[ $id ]['total'] + $total;
				} else {
					$cart_products[ $id ] = array(
						'quantity'   => $quantity,
						'total'      => $total,
						'categories' => $product_cats,
					);
				}

				// Check if this product has a variable price.
				$variable_price_id =
					isset( $product['item_number']['options']['price_id'] )
						? $product['item_number']['options']['price_id']
						: '';

				// Add an entry for the variable price, if it exists.
				if ( $variable_price_id ) {

					// Append the variable price id to the product id.
					$variable_price_id = $id . '_' . $variable_price_id;

					// If the product id already exists, that means we have multiple
					// price variations present in the cart. Add them together.
					if ( isset( $cart_products[ $variable_price_id ] ) ) {
						$cart_products[ $variable_price_id ]['quantity'] = $cart_products[ $variable_price_id ]['quantity'] + $quantity;
						$cart_products[ $variable_price_id ]['total']    = $cart_products[ $variable_price_id ]['total'] + $total;
					} else {
						$cart_products[ $variable_price_id ] = array(
							'quantity'   => $quantity,
							'total'      => $total,
							'categories' => $product_cats,
						);
					}
				}
			}
		}
	}

	return $cart_products;
}

/**
 * Helper function to retrieve category information from an array of products.
 *
 * Currently only retrieves quantity. Need to be expanded in the future to
 * include value as well as all metrics for product price variations.
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
			$qty  = isset( $product['quantity'] ) ? (int) $product['quantity'] : 0;
			$cats = isset( $product['categories'] ) ? $product['categories'] : null;

			if ( ! empty( $cats ) && is_array( $cats ) ) {
				foreach ( $cats as $cat ) {

					if ( array_key_exists( $cat, $categories ) ) {
						$categories[ $cat ]['quantity'] = $categories[ $cat ]['quantity'] + $qty;
					} else {
						$categories[ $cat ] = array( 'quantity' => $qty );
					}
				}
			}
		}
	}

	return $categories;
}

/**
 * Helper function to retrieve payments made by the current user.
 *
 * @since 1.6.3
 *
 * @param string $user_id The current user's id.
 * @return array          Returns array of payments.
 */
function get_payments( $user_id ) {
	// If there is no user id return.
	if ( ! $user_id ) {
		return;
	}

	$customer  = edd_get_customer_by( 'user_id', $user_id );
	$order_ids = array();

	if ( $customer ) {
		$order_ids = edd_get_orders(
			array(
				'customer_id' => $customer->id,
				'fields'      => 'ids',
				'status'      => 'complete',
				'number'      => 9999,
			)
		);
	}

	// If the customer has made no payments return an empty array.
	if ( empty( $order_ids ) ) {
		return;
	}

	// Get all the items purchased.
	$payment_args = array(
		'output'   => 'payments',
		'post__in' => $order_ids,
		'status'   => 'complete', // Even though we set the status here, all payment types seem to be returned.
		'number'   => 9999,
	);

	$payments_query = new EDD_Payments_Query( $payment_args );
	$payments       = $payments_query->get_payments();

	return $payments;
}
