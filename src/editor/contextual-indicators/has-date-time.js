/**
 * Determine if date time settings are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  blockVisibility All visibility attributes for the block
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have date time settings
 */
export default function hasDateTime( blockVisibility, enabledControls ) {
	const { startDateTime, endDateTime } = blockVisibility;

	if (
		! enabledControls.includes( 'date_time' ) ||
		( ! startDateTime && ! endDateTime )
	) {
		return false;
	}

	// If the restriction is set to user-roles, but no user roles are selected.
	if ( startDateTime && endDateTime && startDateTime >= endDateTime ) {
		return false;
	}

	return true;
}
