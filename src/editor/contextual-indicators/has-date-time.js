/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Determine if date time settings are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  testAtts        All visibility attributes for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have date time settings
 */
export default function hasDateTime(
	testAtts,
	hasControlSets,
	enabledControls
) {
	if ( hasControlSets && ! testAtts.hasOwnProperty( 'dateTime' ) ) {
		return false;
	}

	let controlAtts = {};

	if ( hasControlSets ) {
		const schedules = testAtts.dateTime?.schedules ?? [];
		controlAtts = schedules[ 0 ] ?? {};
	} else {
		controlAtts = testAtts?.scheduling ?? {};
	}

	const enable = controlAtts?.enable ?? false;
	const start = controlAtts?.start ?? '';
	const end = controlAtts?.end ?? '';

	// Check to see if there are any deprecated settings.
	const deprecatedStart = testAtts?.startDateTime ?? '';
	const deprecatedEnd = testAtts?.endDateTime ?? '';

	let indicatorTest = true;

	if (
		! enabledControls.some( ( control ) =>
			control.settingSlug === 'date_time'
		) ||
		( ! enable && ! deprecatedStart && ! deprecatedEnd ) ||
		( enable && ! start && ! end )
	) {
		indicatorTest = false;
	}

	if ( ! enable ) {
		if (
			deprecatedStart &&
			deprecatedEnd &&
			deprecatedStart >= deprecatedEnd
		) {
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
