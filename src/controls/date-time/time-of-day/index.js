/**
 * WordPress dependencies
 */
import { __, _n } from '@wordpress/i18n';
import { Button, Notice } from '@wordpress/components';
 import { __experimentalGetSettings } from '@wordpress/date'; // eslint-disable-line
import { closeSmall } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import TimePicker from './time-picker';

/**
 * Add the restrict by Intraday Time block control
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function TimeOfDay( props ) {
	const { scheduleAtts, setAttribute } = props;
	const dateSettings = __experimentalGetSettings();

	// To know if the current time format is a 12 hour time, look for "a".
	// Also make sure this "a" is not escaped by a "/".
	const is12Hour = /a(?!\\)/i.test(
		dateSettings.formats.time
			.toLowerCase() // Test only for the lower case "a".
			.replace( /\\\\/g, '' ) // Replace "//" with empty strings.
			.split( '' )
			.reverse()
			.join( '' ) // Reverse the string and test for "a" not followed by a slash.
	);

	const timeOfDay = scheduleAtts?.timeOfDay ?? {};
	const defaultInterval = { start: '00:00:00', end: '00:00:00' };
	let intervals = timeOfDay?.intervals ?? [];

	if ( intervals.length === 0 ) {
		timeOfDay.intervals = [ defaultInterval ];
		intervals = timeOfDay.intervals;
	}

	const removeInterval = ( intervalIndex ) => {
		const newIntervals = intervals.filter(
			( value, index ) => index !== intervalIndex
		);

		setAttribute( 'timeOfDay', 'intervals', newIntervals );
	};

	const addInterval = () => {
		const newIntervals = [ ...intervals ];
		newIntervals.push( defaultInterval );

		setAttribute( 'timeOfDay', 'intervals', newIntervals );
	};

	const setIntervalValue = ( attribute, value, intervalIndex ) => {
		const newIntervals = [ ...intervals ];
		const intervalAtts = { ...intervals[ intervalIndex ] };

		intervalAtts[ attribute ] = value;
		newIntervals[ intervalIndex ] = intervalAtts;

		setAttribute( 'timeOfDay', 'intervals', newIntervals );
	};

	return (
		<div className="schedules-item__fields__time-of-day">
			<div className="control-fields-item__label">
				{ _n(
					'During this time interval',
					'During these time intervals',
					intervals.length,
					'block-visibility'
				) }
			</div>
			<div className="time-of-day__intervals">
				{ intervals.map( ( interval, intervalIndex ) => {
					return (
						<div
							key={ `timepicker-${ intervalIndex }` }
							className="time-of-day__interval-control"
						>
							<div className="time-of-day__interval-control__wrapper">
								<TimePicker
									label={ __( 'From', 'block-visibility' ) }
									currentTime={ interval.start }
									is12Hour={ is12Hour }
									onChange={ ( value ) =>
										setIntervalValue(
											'start',
											value,
											intervalIndex
										)
									}
									intervalIndex={ intervalIndex }
								/>
								<TimePicker
									label={ __( 'To', 'block-visibility' ) }
									currentTime={ interval.end }
									is12Hour={ is12Hour }
									onChange={ ( value ) =>
										setIntervalValue(
											'end',
											value,
											intervalIndex
										)
									}
								/>
							</div>
							{ intervals.length > 1 && (
								<div className="time-of-day__interval-control__remove">
									<Button
										label={ __(
											'Clear time interval',
											'block-visibility'
										) }
										onClick={ () =>
											removeInterval( intervalIndex )
										}
										icon={ closeSmall }
									/>
								</div>
							) }
							{ interval.end < interval.start && (
								<Notice
									status="warning"
									isDismissible={ false }
								>
									{ __(
										'There is a time error. Please fix for date/time settings to function correctly.',
										'block-visibility'
									) }
								</Notice>
							) }
						</div>
					);
				} ) }
			</div>
			<div className="time-of-day__add-interval">
				<Button onClick={ () => addInterval() } isLink>
					{ __( 'Add interval', 'block-visibility' ) }
				</Button>
			</div>
		</div>
	);
}
