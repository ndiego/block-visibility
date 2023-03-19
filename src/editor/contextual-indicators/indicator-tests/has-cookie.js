/**
 * Determine if Cookie settings are enabled for the block.
 *
 * @since 3.0.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have Metadata settings
 */
export default function hasCookie( controls, hasControlSets, enabledControls ) {
	if ( hasControlSets && ! controls.hasOwnProperty( 'cookie' ) ) {
		return false;
	}

	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'cookie'
		)
	) {
		return false;
	}

	// Could add more robust logic in the future, but for now, show the
	// indicator is there are any Cookie settings.
	const ruleSets = controls?.cookie?.ruleSets ?? [];
	let indicatorTest = true;

	if ( ruleSets.length === 0 ) {
		indicatorTest = false;
	}

	return indicatorTest;
}
