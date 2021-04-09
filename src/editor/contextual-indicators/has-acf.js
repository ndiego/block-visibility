/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Determine if ACF controls are enabled for the block.
 *
 * @since 1.8.0
 * @param {Object}  testAtts        All visibility attributes for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @param {Object}  variables       All available plugin variables
 * @return {boolean}		        Does the block have user role settings
 */
export default function hasACF(
	testAtts,
	hasControlSets,
	enabledControls,
	variables
) {
	const pluginActive = variables?.integrations?.acf?.active ?? false;

	// WP Fusion is not active so return false even if saved controls exist.
	if (
		! pluginActive ||
		! enabledControls.some(
			( control ) => control.settingSlug === 'acf'
		)
	) {
		return false;
	}

	if ( hasControlSets && ! testAtts.hasOwnProperty( 'acf' ) ) {
		return false;
	}

	const ruleSets = testAtts?.acf?.ruleSets ?? [];
	let indicatorTest = true;

	if ( ruleSets.length === 0 ) {
		indicatorTest = false;
	}

	indicatorTest = applyFilters(
		'blockVisibility.hasACF',
		indicatorTest
	);

	return indicatorTest;
}
