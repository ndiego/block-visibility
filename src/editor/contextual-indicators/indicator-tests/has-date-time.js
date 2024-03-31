/**
 * Determine if date time settings are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have date time settings
 */
export default function hasDateTime(
	controls,
	hasControlSets,
	enabledControls
) {
	if ( hasControlSets && ! controls.hasOwnProperty( 'dateTime' ) ) {
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
		schedules = controls.dateTime?.schedules ?? [];
		hideOnSchedules = controls.dateTime?.hideOnSchedules ?? false;
	} else {
		schedules = controls?.scheduling ? [ controls?.scheduling ] : [];
	}

	if ( schedules.length === 0 ) {
		return false;
	}

	const indicatorTestArray = [];

	schedules.forEach( ( schedule ) => {
		const enable = schedule?.enable ?? false;
		const start = schedule?.start ?? '';
		const end = schedule?.end ?? '';
		const dowEnable = schedule?.dayOfWeek?.enable ?? false;
		const todEnable = schedule?.timeOfDay?.enable ?? false;

		let scheduleTest = true;

		if ( ! enable ) {
			scheduleTest = false;
		}

		if (
			! hideOnSchedules &&
			enable &&
			! start &&
			! end &&
			! dowEnable &&
			! todEnable
		) {
			scheduleTest = false;
		}

		indicatorTestArray.push( scheduleTest );
	} );

	return indicatorTestArray.includes( true );
}
