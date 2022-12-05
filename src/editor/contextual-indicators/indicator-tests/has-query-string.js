/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Determine if Query String controls are enabled for the block.
 *
 * @since 1.7.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have user role settings
 */
export default function hasQueryString(
	controls,
	hasControlSets,
	enabledControls
) {
	if ( hasControlSets && ! controls.hasOwnProperty( 'queryString' ) ) {
		return false;
	}

	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'query_string'
		)
	) {
		return false;
	}

	const queryStringAny = controls?.queryString?.queryStringAny ?? '';
	const queryStringAll = controls?.queryString?.queryStringAll ?? '';
	const queryStringNot = controls?.queryString?.queryStringNot ?? '';

	let indicatorTest = true;

	if ( ! queryStringAny && ! queryStringAll && ! queryStringNot ) {
		indicatorTest = false;
	}

	indicatorTest = applyFilters(
		'blockVisibility.hasQueryStringIndicator',
		indicatorTest,
		controls,
		hasControlSets,
		enabledControls
	);

	return indicatorTest;
}
