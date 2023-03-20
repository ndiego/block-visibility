/**
 * Determine if referral source settings are enabled for the block.
 *
 * @since 3.0.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have Referral Source settings
 */
export default function hasReferralSource(
	controls,
	hasControlSets,
	enabledControls
) {
	if ( hasControlSets && ! controls.hasOwnProperty( 'referralSource' ) ) {
		return false;
	}

	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'referral_source'
		)
	) {
		return false;
	}

	const contains = controls?.referralSource?.contains ?? '';
	const doesNotContain = controls?.referralSource?.doesNotContain ?? '';

	let indicatorTest = true;

	if ( ! contains && ! doesNotContain ) {
		indicatorTest = false;
	}

	return indicatorTest;
}
