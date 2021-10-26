<?php
/**
 * Adds a filter to the visibility test for the WP Fusion control.
 *
 * @package block-visibility
 * @since   1.7.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;

/**
 * Run test to see if block visibility should be restricted by WP Fusion tags.
 *
 * NOTE: This test is run after the User Role tests, if set, which handles the
 * majority of the logged-in vs. logged-out logic.
 *
 * @since 1.7.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not.
 */
function wp_fusion_test( $is_visible, $settings, $controls ) {

	// If the test is already false, or WP Fusion is not active, skip this test.
	if (
		! $is_visible ||
		! function_exists( 'wp_fusion' ) ||
		! function_exists( 'wpf_is_user_logged_in' ) ||
		! function_exists( 'wpf_get_current_user_id' )
	) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'wp_fusion' ) ) {
		return true;
	}

	$wp_fusion_atts =
		isset( $controls['wpFusion'] )
			? $controls['wpFusion']
			: null;
	$user_role_atts =
		isset( $controls['userRole'] )
			? $controls['userRole']
			: null;

	$visibility_by_role = isset( $user_role_atts['visibilityByRole'] )
		? $user_role_atts['visibilityByRole']
		: 'public';

	// If the block is to be shown only to logged-out users, so the WP Fusion
	// control does not apply, skip tests.
	if ( 'logged-out' === $visibility_by_role ) {
		return true;
	}

	$tags_any = isset( $wp_fusion_atts['tagsAny'] )
		? $wp_fusion_atts['tagsAny']
		: null;
	$tags_all = isset( $wp_fusion_atts['tagsAll'] )
		? $wp_fusion_atts['tagsAll']
		: null;
	$tags_not = isset( $wp_fusion_atts['tagsNot'] )
		? $wp_fusion_atts['tagsNot']
		: null;

	// There are no WP Fusion tags, so skip tests.
	if ( empty( $tags_any ) && empty( $tags_all ) && empty( $tags_not ) ) {
		return true;
	}

	$can_access = false;

	// In WP Fusion the "exclude admins" option has been selected and the current user is an admin, so skip tests.
	if ( wp_fusion()->settings->get( 'exclude_admins' ) && current_user_can( 'manage_options' ) ) {
		$can_access = true;
	}

	// Tags can only be applied to logged-in users.
	if ( wpf_is_user_logged_in() ) {

		$can_access = run_wp_fusion_tests( $tags_any, $tags_all, $tags_not, $visibility_by_role );

	} else {
		// The user is not logged-in.
		$can_access = true;
	}

	$can_access = apply_filters(
		'wpf_user_can_access_block', // phpcs:ignore
		$can_access,
		$attributes
	);

	$can_access = apply_filters(
		'wpf_user_can_access', // phpcs:ignore
		$can_access,
		wpf_get_current_user_id(),
		false
	);

	if ( $can_access ) {
		return true;
	} else {
		return false;
	}
}

// Run all integration tests at "15" priority, which is after the main controls,
// but before the final "hide block" tests.
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\wp_fusion_test', 15, 3 );

/**
 * Run individuals test on each category of tags.
 *
 * @since 2.0.0
 *
 * @param array  $tags_any           All "any" tags.
 * @param array  $tags_all           All "all" tags.
 * @param array  $tags_not           All "not" tags.
 * @param string $visibility_by_role The current user role setting.
 * @return boolean                   Return true if the block should be visible, false if not.
 */
function run_wp_fusion_tests( $tags_any, $tags_all, $tags_not, $visibility_by_role ) {

	$user_tags = wp_fusion()->user->get_tags();

	// Only check the (any) and (all) tags when visibility_by_role is set
	// to logged-in or user-role.
	if (
		'logged-in' === $visibility_by_role ||
		'user-role' === $visibility_by_role
	) {
		if ( ! empty( $tags_any ) ) {

			// Required tags (any).
			$result = array_intersect( $tags_any, $user_tags );

			// If there are none of the tags, fail test.
			if ( empty( $result ) ) {
				return false;
			}
		}

		if ( ! empty( $tags_all ) ) {

			// Required tags (all).
			$result = array_intersect( $tags_all, $user_tags );

			// The user must have all the seleted tags but could also have more.
			if ( count( $result ) !== count( $tags_all ) ) {
				return false;
			}
		}
	}

	// Check the (not) tags on all visibility_by_role settings.
	if ( ! empty( $tags_not ) ) {

		// Required tags (not).
		$result = array_intersect( $tags_not, $user_tags );

		// If any of the tags match, fail test.
		if ( ! empty( $result ) ) {
			return false;
		}
	}

	return true;
}
