/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Determine if Query String controls are enabled for the block.
 *
 * @since 1.7.0
 * @param {Object}  testAtts        All visibility attributes for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have user role settings
 */
export default function hasQueryString(
	testAtts,
	hasControlSets,
	enabledControls
) {
	if ( hasControlSets && ! testAtts.hasOwnProperty( 'queryString' ) ) {
		return false;
	}

	if (
		! enabledControls.some( ( control ) =>
			control.settingSlug === 'query_string'
		)
	) {
		return false;
	}

	const queryStringAny = testAtts?.queryString?.queryStringAny ?? '';
	const queryStringAll = testAtts?.queryString?.queryStringAll ?? '';
	const queryStringNot = testAtts?.queryString?.queryStringNot ?? '';

	let indicatorTest = true;

	if ( ! queryStringAny && ! queryStringAll && ! queryStringNot ) {
		indicatorTest = false;
	}

	indicatorTest = applyFilters(
		'blockVisibility.hasQueryString',
		indicatorTest
	);

	return indicatorTest;
}
