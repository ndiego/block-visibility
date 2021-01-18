/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Determine if date time settings are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  blockVisibility All visibility attributes for the block
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have date time settings
 */
export default function hasDateTime( blockVisibility, enabledControls ) {
	const enable = blockVisibility?.scheduling?.enable ?? false;
	const start = blockVisibility?.scheduling?.start ?? '';
	const end = blockVisibility?.scheduling?.end ?? '';

	// Check to see if there are any deprecated settings.
	const deprecatedStart = blockVisibility?.startDateTime ?? '';
	const deprecatedEnd = blockVisibility?.endDateTime ?? '';

	let indicatorTest = true;

	if (
		! enabledControls.includes( 'date_time' ) ||
		( ! enable && ! deprecatedStart && ! deprecatedEnd ) ||
		( enable && ! start && ! end )
	) {
		indicatorTest = false;
	}

	if ( ! enable )  {
		if ( deprecatedStart && deprecatedEnd && deprecatedStart >= deprecatedEnd ) {
			indicatorTest = false;
		}
	}

	if ( enable ) {
		if ( start && end && start >= end ) {
			indicatorTest = false;
		}
	}

	indicatorTest = applyFilters(
		'blockVisibility.hasDateTime',
		indicatorTest
	);

	return indicatorTest;
}
