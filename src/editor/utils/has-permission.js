/**
 * Helper function for determining if the current user has permission to use
 * visibility settings.
 *
 * @since 1.3.0
 * @param {Object} settings  All plugin settings
 * @param {Object} variables All plugin variables
 * @return {boolean}		 Whether the current user has permission or not
 */
export default function hasPermission( settings, variables ) {
	let isPermitted = true;
	const enabled = settings?.plugin_settings?.enable_user_role_restrictions ?? false; // eslint-disable-line

	// Restrictions are not enabled so user has permission.
	if ( ! enabled ) {
		return isPermitted;
	}

	const permittedRoles = settings?.plugin_settings?.enabled_user_roles ?? [];

	if ( permittedRoles.indexOf( 'administrator' ) === -1 ) {
		permittedRoles.push( 'administrator' ); // Admins are always permitted.
	}

	const userRoles = variables?.current_users_roles ?? [];

	if ( userRoles.length === 0 ) {
		isPermitted = false;
	} else {
		isPermitted = userRoles.every( ( role ) => {
			return permittedRoles.indexOf( role ) !== -1;
		} );
	}

	return isPermitted;
}
