/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Determine if user role controls are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have user role settings
 */
export default function hasUserRole(
	controls,
	hasControlSets,
	enabledControls
) {
	if ( hasControlSets && ! controls.hasOwnProperty( 'userRole' ) ) {
		return false;
	}

	const controlAtts = hasControlSets ? controls.userRole : controls;

	const visibilityByRole = controlAtts?.visibilityByRole ?? 'public';
	const restrictedRoles = controlAtts?.restrictedRoles ?? [];
	const hideOnRestrictedRoles = controlAtts?.hideOnRestrictedRoles ?? false;

	let indicatorTest = true;

	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'visibility_by_role'
		) ||
		! visibilityByRole ||
		visibilityByRole === 'public' ||
		visibilityByRole === 'all' // Depractated option, but check regardless.
	) {
		indicatorTest = false;
	}

	// If the restriction is set to user-roles, but no user roles are selected,
	// and "hide on restricted" has been set. In this case the block actually
	// does not have any role-based visibility restrictions.
	if (
		visibilityByRole === 'user-role' &&
		restrictedRoles.length === 0 &&
		hideOnRestrictedRoles
	) {
		indicatorTest = false;
	}

	indicatorTest = applyFilters(
		'blockVisibility.hasUserRoleIndicator',
		indicatorTest,
		controls,
		hasControlSets,
		enabledControls
	);

	return indicatorTest;
}
