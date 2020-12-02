/**
 * Determine if visibility by user role settings are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  blockVisibility All visibility attributes for the block
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have user role settings
 */
export default function hasRoles( blockVisibility, enabledControls ) {
	const {
		visibilityByRole,
		restrictedRoles,
		hideOnRestrictedRoles,
	} = blockVisibility;

	if (
		! enabledControls.includes( 'visibility_by_role' ) ||
		! visibilityByRole ||
		visibilityByRole === 'all'
	) {
		return false;
	}

	// If the restriction is set to user-roles, but no user roles are selected,
	// and "hide on restricted" has been set. In this case the block actually
	// does not have any role-based visibility restrictions.
	if (
		visibilityByRole === 'user-role' &&
		restrictedRoles.length === 0 &&
		hideOnRestrictedRoles
	) {
		return false;
	}

	return true;
}
