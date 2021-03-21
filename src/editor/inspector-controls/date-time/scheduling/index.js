/**
 * Internal dependencies
 */
import Schedule from './schedule';

/**
 * Add the block Scheduling control
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Scheduling( props ) {
	const { dateTime } = props;
	let schedules = dateTime?.schedules ?? [];

	if ( schedules.length === 0 ) {
		const defaultSchedule = {
			id: 0,
			enable: true,
			start: '',
			end: '',
		};

		dateTime.schedules = [ defaultSchedule ];
		schedules = dateTime.schedules;
	}

	return (
		<div className="block-visibility__schedules">
			{ schedules.map( ( schedule ) => {
				return (
					<Schedule
						key={ schedule.id }
						scheduleAtts={ schedule }
						{ ...props }
					/>
				);
			} ) }
		</div>
	);
}
