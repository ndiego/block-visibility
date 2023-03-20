/**
 * Determine if Url Path settings are enabled for the block.
 *
 * @since 3.0.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have Url Path settings
 */
export default function hasUrlPath(
	controls,
	hasControlSets,
	enabledControls
) {
	if ( hasControlSets && ! controls.hasOwnProperty( 'urlPath' ) ) {
		return false;
	}

	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'url_path'
		)
	) {
		return false;
	}

	const contains = controls?.urlPath?.contains ?? '';
	const doesNotContain = controls?.urlPath?.doesNotContain ?? '';

	let indicatorTest = true;

	if ( ! contains && ! doesNotContain ) {
		indicatorTest = false;
	}

	return indicatorTest;
}
