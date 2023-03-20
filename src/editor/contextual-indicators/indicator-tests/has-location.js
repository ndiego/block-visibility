/**
 * Determine if Location settings are enabled for the block.
 *
 * @since 3.0.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have Location settings
 */
export default function hasLocation(
	controls,
	hasControlSets,
	enabledControls
) {
	if ( hasControlSets && ! controls.hasOwnProperty( 'location' ) ) {
		return false;
	}

	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'location'
		)
	) {
		return false;
	}

	// Could add more robust logic in the future, but for now, show the
	// indicator is there are any Location settings.
	const ruleSets = controls?.location?.ruleSets ?? [];
	let indicatorTest = true;

	if ( ruleSets.length === 0 ) {
		indicatorTest = false;
	}

	return indicatorTest;
}
