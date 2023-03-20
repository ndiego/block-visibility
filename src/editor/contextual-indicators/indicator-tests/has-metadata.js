/**
 * Determine if Metadata settings are enabled for the block.
 *
 * @since 3.0.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have Metadata settings
 */
export default function hasMetadata(
	controls,
	hasControlSets,
	enabledControls
) {
	if ( hasControlSets && ! controls.hasOwnProperty( 'metadata' ) ) {
		return false;
	}

	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'metadata'
		)
	) {
		return false;
	}

	// Could add more robust logic in the future, but for now, show the
	// indicator is there are any Metadata settings.
	const ruleSets = controls?.metadata?.ruleSets ?? [];
	let indicatorTest = true;

	if ( ruleSets.length === 0 ) {
		indicatorTest = false;
	}

	return indicatorTest;
}
