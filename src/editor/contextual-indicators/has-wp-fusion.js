/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Determine if Wp Fusion controls are enabled for the block.
 *
 * @since 1.7.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @param {Object}  variables       All available plugin variables
 * @return {boolean}		        Does the block have user role settings
 */
export default function hasWPFusion(
	controls,
	hasControlSets,
	enabledControls,
	variables
) {
	const pluginActive = variables?.integrations?.wp_fusion?.active ?? false;

	// WP Fusion is not active so return false even if saved controls exist.
	if (
		! pluginActive ||
		! enabledControls.some(
			( control ) => control.settingSlug === 'wp_fusion'
		)
	) {
		return false;
	}

	if ( hasControlSets && ! controls.hasOwnProperty( 'wpFusion' ) ) {
		return false;
	}

	const hasUserRoles = controls.hasOwnProperty( 'userRole' ) ?? false;
	const userRoles = controls?.userRole?.visibilityByRole ?? 'public';
	const hideAnyAll = userRoles === 'public' || userRoles === 'logged-out';

	const tagsAny = controls?.wpFusion?.tagsAny ?? [];
	const tagsAll = controls?.wpFusion?.tagsAll ?? [];
	const tagsNot = controls?.wpFusion?.tagsNot ?? [];

	let indicatorTest = true;

	if (
		( ! hasUserRoles && tagsNot.length === 0 ) || // No users roles and no not tags
		( userRoles === 'public' && tagsNot.length === 0 ) || // Only public and no not tags
		userRoles === 'logged-out' // WP fusion does not apply if only logged-out
	) {
		indicatorTest = false;
	}

	if (
		! hideAnyAll &&
		tagsAny.length === 0 &&
		tagsAll.length === 0 &&
		tagsNot.length === 0
	) {
		indicatorTest = false;
	}

	indicatorTest = applyFilters(
		'blockVisibility.hasWPFusionIndicator',
		indicatorTest,
		controls,
		hasControlSets,
		enabledControls,
		variables
	);

	return indicatorTest;
}
