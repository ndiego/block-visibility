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

	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'date_time'
		)
	) {
		return false;
	}

	let schedules = [];
	let hideOnSchedules = false;

	if ( hasControlSets ) {
		schedules = testAtts.dateTime?.schedules ?? [];
		hideOnSchedules = testAtts.dateTime?.hideOnSchedules ?? false;
	} else {
		schedules = testAtts?.scheduling ? [ testAtts?.scheduling ] : [];
	}

	if ( schedules.length === 0 ) {
		return false;
	}

	const indicatorTestArray = [];

	schedules.forEach( ( schedule ) => {
		const enable = schedule?.enable ?? false;
		const start = schedule?.start ?? '';
		const end = schedule?.end ?? '';
		let test = true;

		if ( ! enable ) {
			test = false;
		}

		if ( ! hideOnSchedules && enable && ! start && ! end ) {
			test = false;
		}

		if ( enable ) {
			if ( start && end && start >= end ) {
				test = false;
			}
		}

		indicatorTestArray.push( test );
	} );

	let indicatorTest = indicatorTestArray.includes( true );

	indicatorTest = applyFilters(
		'blockVisibility.hasDateTime',
		indicatorTest
	);

	return indicatorTest;
}
