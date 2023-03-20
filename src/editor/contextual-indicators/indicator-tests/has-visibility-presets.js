/**
 * Determine if Visibility Presets are enabled for the block.
 *
 * @since 3.0.0
 * @param {Object} blockVisibility Object of all block visibility attributes
 * @param {Array}  enabledControls Array of all enabled visibility controls
 * @return {boolean}		       Does the block have Visibility Presets
 */
export default function hasVisibilityPresets(
	blockVisibility,
	enabledControls
) {
	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'visibility_presets'
		)
	) {
		return false;
	}

	const visibilityPresets = blockVisibility?.visibilityPresets?.presets ?? [];

	if ( visibilityPresets.length === 0 ) {
		return false;
	}
	return true;
}
