<?php
/**
 * Adds a filter to the visibility test for the User Role control.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled;

/**
 * Run test to see if block visibility should be restricted by user role.
 *
 * @since 1.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not.
 */
function user_role_test( $is_visible, $settings, $controls ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this functionality has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'visibility_by_role' ) ) {
		return true;
	}

	$control_atts = isset( $controls['userRole'] )
		? $controls['userRole']
		: null;

	// There are no user role settings, skip tests.
	if ( ! $control_atts ) {
		return true;
	}

	$visibility_by_role = isset( $control_atts['visibilityByRole'] )
		? $control_atts['visibilityByRole']
		: null;

	// Run through our visibility by role tests.
	if (
		! $visibility_by_role
		|| 'public' === $visibility_by_role
		|| 'all' === $visibility_by_role // Deprecated option, but check regardless.
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

		$restricted_roles = isset( $control_atts['restrictedRoles'] )
			? $control_atts['restrictedRoles']
			: array();

		$hide_on_restricted_roles =
			isset( $control_atts['hideOnRestrictedRoles'] )
				? $control_atts['hideOnRestrictedRoles']
				: false;

		// Make sure there are restricted roles set, if not the block should be
		// hidden, unless "hide on restricted" has been set.
		if ( ! empty( $restricted_roles ) ) {

			// If user is logged out.
			if ( ! is_user_logged_in() ) {
				$in_restricted_roles =
					in_array( 'logged-out', $restricted_roles, true ) ||
					in_array( 'public', $restricted_roles, true ); // Depractated role option, but check regardless.

				if ( ! $hide_on_restricted_roles && $in_restricted_roles ) {
					return true;
				} elseif (
					$hide_on_restricted_roles &&
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
				if ( $num_selected_roles > 0 && ! $hide_on_restricted_roles ) {
					return true;
				}

				// If the user's roles are not any of the restricted roles, show
				// the block, but only if "hide on restricted" is set.
				if ( 0 === $num_selected_roles && $hide_on_restricted_roles ) {
					return true;
				}
			}
		} elseif ( empty( $restricted_roles ) && $hide_on_restricted_roles ) {
			return true;
		}
	} elseif ( 'users' === $visibility_by_role ) {

		// If this functionality has been disabled, skip test.
		if ( ! is_control_enabled( $settings, 'visibility_by_role', 'enable_users' ) ) {
			return true;
		}

		$restricted_users = isset( $control_atts['restrictedUsers'] )
			? $control_atts['restrictedUsers']
			: array();

		$hide_on_restricted_users =
			isset( $control_atts['hideOnRestrictedUsers'] )
				? $control_atts['hideOnRestrictedUsers']
				: false;

		// Make sure there are restricted users set, if not the block should be
		// hidden, unless "hide on restricted" has been set.
		if ( ! empty( $restricted_users ) ) {

			// If user is logged out.
			if ( ! is_user_logged_in() && $hide_on_restricted_users ) {
				return true;
			}

			// If user is logged in.
			if ( is_user_logged_in() ) {

				// Get the roles of the current user since they are logged-in.
				$current_user_id = get_current_user_id();
				$is_restricted   =
					in_array( $current_user_id, $restricted_users, true );

				// If the current user is restricted, show the block, but only
				// if "hide on restricted" is not set.
				if ( $is_restricted && ! $hide_on_restricted_users ) {
					return true;
				}

				// If the current user is not restricted, show the block, but
				// only if "hide on restricted" is set.
				if ( ! $is_restricted && $hide_on_restricted_users ) {
					return true;
				}
			}
		} elseif ( empty( $restricted_users ) && $hide_on_restricted_users ) {
			return true;
		}
	} elseif ( 'user-rule-sets' === $visibility_by_role ) {

		// If this functionality has been disabled, skip test.
		if ( ! is_control_enabled( $settings, 'visibility_by_role', 'enable_user_rule_sets' ) ) {
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

					$test_result = run_user_rule_tests( $rule );

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

	// If we don't pass any of the above tests, hide the block.
	return false;
}
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\user_role_test', 10, 3 );

/**
 * Run the individual rule tests.
 *
 * @since 2.3.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_user_rule_tests( $rule ) {

	$field = isset( $rule['field'] ) ? $rule['field'] : null;

	// No field is set, so return an error.
	if ( ! $field ) {
		return 'error';
	}

	switch ( $field ) {
		case 'logged-out':
			$test_result = ! is_user_logged_in() ? 'visible' : 'hidden';
			break;

		case 'logged-in':
			$test_result = is_user_logged_in() ? 'visible' : 'hidden';
			break;

		case 'user-role':
			$test_result = run_user_role_test( $rule );
			break;

		case 'users':
			$test_result = run_users_test( $rule );
			break;

		default:
			$test_result = 'error';
			break;
	}

	return $test_result;
}

/**
 * Run the user role test.
 *
 * @since 2.3.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_user_role_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// Only proceed if the user is logged in.
	if ( ! is_user_logged_in() ) {
		return 'hidden';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	// Get the roles of the current user.
	$current_user = wp_get_current_user();
	$user_roles   = $current_user->roles;
	$operator     = $rule['operator'];
	$roles        = $rule['value'];

	if ( ! empty( $roles ) && is_array( $roles ) ) {
		$results = array();

		foreach ( $roles as $role ) {
			$results[] = in_array( $role, $user_roles, true ) ? 'true' : 'false';
		}

		$test_result = contains_value_compare( $operator, $results );
	}

	return $test_result;
}


/**
 * Run the users test.
 *
 * @since 2.3.0
 *
 * @param array $rule All rule settings.
 * @return string     Returns 'visible', 'hidden', or 'error'.
 */
function run_users_test( $rule ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// Only proceed if the user is logged in.
	if ( ! is_user_logged_in() ) {
		return 'hidden';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	// Get the id of the current user.
	$current_user_id = get_current_user_id();
	$operator        = $rule['operator'];
	$users           = $rule['value'];

	$is_restricted = in_array( $current_user_id, $users, true );

	if (
		( 'any' === $operator && $is_restricted ) ||
		( 'none' === $operator && ! $is_restricted )
	) {
		$test_result = 'visible';
	} else {
		$test_result = 'hidden';
	}

	return $test_result;
}
