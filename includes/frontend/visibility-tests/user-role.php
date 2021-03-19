<?php
/**
 * Adds a filter to the visibility test for "visibility by user role" setting.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;

/**
 * Run test to see if block visibility should be restricted by user role.
 *
 * @since 1.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $attributes The block visibility attributes.
 * @return boolean            Return true is the block should be visible, false if not.
 */
function user_role_test( $is_visible, $settings, $attributes ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this functionality has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'visibility_by_role' ) ) {
		return true;
	}

	$has_control_sets = isset( $attributes['controlSets'] );

	if ( $has_control_sets ) {
		// Just retrieve the first set and schedule, need to update in future.
		$user_role_atts =
			isset( $attributes['controlSets'][0]['controls']['userRole'] )
				? $attributes['controlSets'][0]['controls']['userRole']
				: null;
	} else {
		$user_role_atts = $attributes;
	}

	// There are no user role settings, skip tests.
	if ( ! $user_role_atts ) {
		return true;
	}

	$visibility_by_role = isset( $user_role_atts['visibilityByRole'] )
		? $user_role_atts['visibilityByRole']
		: null;

	// Run through our visibility by role tests.
	if (
		! $visibility_by_role
		|| 'public' === $visibility_by_role
		|| 'all' === $visibility_by_role // Depractated option, but check regardless.
	) {
		return true;
	} elseif ( 'logged-out' === $visibility_by_role && ! is_user_logged_in() ) {
		return true;
	} elseif ( 'logged-in' === $visibility_by_role && is_user_logged_in() ) {
		return true;
	} elseif ( 'user-role' === $visibility_by_role ) {

		// If this functionality has been disabled, skip test.
		if ( ! is_control_enabled( $settings, 'visibility_by_role', 'enable_user_roles' ) ) {
			return true;
		}

		$restricted_roles = isset( $user_role_atts['restrictedRoles'] )
			? $user_role_atts['restrictedRoles']
			: array();

		$hide_on_resticted_roles =
			isset( $user_role_atts['hideOnRestrictedRoles'] )
				? $user_role_atts['hideOnRestrictedRoles']
				: false;

		// Make sure there are restricted roles set, if not the block should be
		// hidden, unless "hide on restricted" has been set.
		if ( ! empty( $restricted_roles ) ) {

			// If user is logged out.
			if ( ! is_user_logged_in() ) {
				$in_restricted_roles =
					in_array( 'logged-out', $restricted_roles, true ) ||
					in_array( 'public', $restricted_roles, true ); // Depractated role option, but check regardless.

				if ( ! $hide_on_resticted_roles && $in_restricted_roles ) {
					return true;
				} elseif (
					$hide_on_resticted_roles &&
					! $in_restricted_roles
				) {
					return true;
				}
			}

			// If user is logged in.
			if ( is_user_logged_in() ) {

				// Get the roles of the current user since they are logged-in.
				$current_user       = wp_get_current_user();
				$user_roles         = $current_user->roles;
				$num_selected_roles = count(
					array_intersect( $restricted_roles, $user_roles )
				);

				// If one of the user's roles is also a restricted role, show
				// the block, but only if "hide on restricted" is not set.
				if ( $num_selected_roles > 0 && ! $hide_on_resticted_roles ) {
					return true;
				}

				// If the user's roles are not any of the restricted roles, show
				// the block, but only if "hide on restricted" is set.
				if ( 0 === $num_selected_roles && $hide_on_resticted_roles ) {
					return true;
				}
			}
		} elseif ( empty( $restricted_roles ) && $hide_on_resticted_roles ) {
			return true;
		}
	}

	// If we don't pass any of the above tests, hide the block.
	return false;
}
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\user_role_test', 10, 3 );
