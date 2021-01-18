/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Determine if visibility by user role settings are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  blockVisibility All visibility attributes for the block
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have user role settings
 */
export default function hasUserRoles( blockVisibility, enabledControls ) {
	const visibilityByRole = blockVisibility?.visibilityByRole ?? 'public';
	const restrictedRoles = blockVisibility?.restrictedRoles ?? [];
	const hideOnRestrictedRoles =
		blockVisibility?.hideOnRestrictedRoles ?? false;

	let indicatorTest = true;

	if (
		! enabledControls.includes( 'visibility_by_role' ) ||
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
		'blockVisibility.hasUserRoles',
		indicatorTest
	);

	return indicatorTest;
}
