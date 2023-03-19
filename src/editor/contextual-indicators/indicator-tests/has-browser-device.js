/**
 * Determine if Browser & Device settings are enabled for the block.
 *
 * @since 3.0.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have Browser & Device settings
 */
export default function hasBrowserDevice(
	controls,
	hasControlSets,
	enabledControls
) {
	if ( hasControlSets && ! controls.hasOwnProperty( 'browserDevice' ) ) {
		return false;
	}

	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'browser_device'
		)
	) {
		return false;
	}

	// Could add more robust logic in the future, but for now, show the
	// indicator is there are any User Agent settings.
	const ruleSets = controls?.browserDevice?.ruleSets ?? [];
	let indicatorTest = true;

	if ( ruleSets.length === 0 ) {
		indicatorTest = false;
	}

	return indicatorTest;
}
