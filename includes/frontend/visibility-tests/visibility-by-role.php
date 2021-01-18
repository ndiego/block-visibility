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
function visibility_by_role_test( $is_visible, $settings, $attributes ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this functionality has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'visibility_by_role' ) ) {
		return true;
	}

	$visibility_by_role = isset( $attributes['visibilityByRole'] )
		? $attributes['visibilityByRole']
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

		$restricted_roles = isset( $attributes['restrictedRoles'] )
			? $attributes['restrictedRoles']
			: array();

		$hide_on_resticted_roles = isset( $attributes['hideOnRestrictedRoles'] )
			? $attributes['hideOnRestrictedRoles']
			: false;

		// Make sure there are restricted roles set, if not the block should be
		// hidden, unless "hide on restricted" has been set.
		if ( ! empty( $restricted_roles ) ) {

			if (
				(
					in_array( 'logged-out', $restricted_roles, true )
					|| in_array( 'public', $restricted_roles, true ) // Depractated role option, but check regardless.
				)
				&& ! is_user_logged_in()
				&& ! $hide_on_resticted_roles
			) {
				return true;
			}

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
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\visibility_by_role_test', 10, 3 );
