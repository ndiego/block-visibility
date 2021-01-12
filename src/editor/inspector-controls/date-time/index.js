/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	DateTimePicker,
	Popover,
	Button,
	Notice,
	Slot,
	ToggleControl,
} from '@wordpress/components';
import { __experimentalGetSettings, format } from '@wordpress/date';
import { useState } from '@wordpress/element';
import { calendar, closeSmall } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { isControlSettingEnabled } from './../../utils/setting-utilities';
import { hideControlSection } from './../utils/hide-control-section';
import CalendarPopover from './calendar-popover';
import DateTimeField from './date-time-field';

/**
 * Format the given date.
 *
 * @since 1.1.0
 * @param {Object} date     The date object to format
 * @param {string} fallback If there is no date, a fallback string is returned
 * @return {string}		    The formatted date as a string or the fallback
 */
function formatDateLabel(
	date,
	fallback = __( 'No time selected', 'block-visibility' )
) {
	const dateSettings = __experimentalGetSettings();
	let label = fallback;

	if ( date ) {
		label = format(
			`${ dateSettings.formats.date } ${ dateSettings.formats.time }`,
			date
		);
	}

	return label;
}

/**
 * Add the date/time vsibility controls
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function DateTime( props ) {
	const { settings, attributes, setAttributes, enabledControls } = props;
	const { blockVisibility } = attributes;
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ isEndPickerOpen, setIsEndPickerOpen ] = useState( false );

	console.log(  blockVisibility );

	const sectionHidden = hideControlSection(
		enabledControls,
		blockVisibility,
		'date_time'
	);

	if ( sectionHidden ) {
		return null;
	}

	const enableScheduling = isControlSettingEnabled(
		settings,
		'date_time',
		'enable_scheduling'
	);

	// Run get functions to clean up depracated attributes
	const start = getStart( blockVisibility, setAttributes );
	const end = getEnd( blockVisibility, setAttributes );
	const enable = blockVisibility?.scheduling?.enable ?? false;

	const startDateLabel = formatDateLabel(
		start,
		__( 'Now', 'block-visibility' )
	);
	const endDateLabel = formatDateLabel(
		end,
		__( 'Never', 'block-visibility' )
	);
	const today = new Date( new Date().setHours( 0, 0, 0, 0 ) );

	// If there is no start date/time selected, but there is an end, default the
	// starting selection in the calendar to the day prior.
	const startAlt = end ? new Date( end ) : new Date( today );
	if ( end ) {
		startAlt.setHours( 0, 0, 0, 0 );
		startAlt.setDate( startAlt.getDate() - 1 );
	}
	const selectedStartDate = start ? start : startAlt;

	// If there is no end date/time selected, but there is a start, default the
	// starting selection in the calendar to the next day.
	const endAlt = start ? new Date( start ) : new Date( today );
	endAlt.setHours( 0, 0, 0, 0 );
	endAlt.setDate( endAlt.getDate() + 1 );
	const selectedEndDate = end ? end : endAlt;

	// If the start time is greater or equal to the end time, display a warning.
	let alert = false;
	if ( start && end ) {
		alert = start >= end ? true : false;
	}

	return (
		<div className="visibility-control__group date-time">
			{ enableScheduling && (
				<div className="visibility-control scheduling">
				<ToggleControl
					className="toggle-with-subsettings"
					label={ __( 'Enable block scheduling', 'block-visibility' ) }
					checked={ enable }
					onChange={ () =>
						setAttributes( {
							blockVisibility: assign(
								{ ...blockVisibility },
								{ scheduling: assign(
									{ ...blockVisibility.scheduling },
									{ enable: ! enable }
								) },
							),
						} )
					}
					help={ enable && __(
						'Schedule the block to only display between a start and end date/time.',
						'block-visibility-pro'
					) }
				/>
				{ enable && (
					<div className="scheduling__date-time-fields">
						<DateTimeField
							label={ startDateLabel }
							title={ __(
								'Choose a start date/time',
								'block-visibility'
							) }
							hasDateTime={ start }
							onOpenPopover={ setIsPickerOpen }
							onClearDateTime={ () =>
								setAttributes( {
									blockVisibility: assign(
										{ ...blockVisibility },
										{ startDateTime: '' }
									),
								} )
							}
							help={ __( 'Starting date/time', 'block-visibility' ) }
						/>
						{ isPickerOpen && (
							<CalendarPopover
								label={ __(
									'Start Date/Time',
									'block-visibility'
								) }
								currentDate={ selectedStartDate }
								onDateChange={ ( date ) =>
									setAttributes( {
										blockVisibility: assign(
											{ ...blockVisibility },
											{ startDateTime: date }
										),
									} )
								}
								isOpen={ setIsPickerOpen }
								highlightedDate={ end }
							/>
						) }
						<DateTimeField
							label={ endDateLabel }
							title={ __(
								'Choose an end date/time',
								'block-visibility'
							) }
							hasDateTime={ end }
							onOpenPopover={ setIsEndPickerOpen }
							onClearDateTime={ () =>
								setAttributes( {
									blockVisibility: assign(
										{ ...blockVisibility },
										{ endDateTime: '' }
									),
								} )
							}
							help={ __( 'Ending date/time', 'block-visibility' ) }
						/>
						{ isEndPickerOpen && (
							<CalendarPopover
								label={ __( 'End Date/Time', 'block-visibility' ) }
								currentDate={ selectedEndDate }
								onDateChange={ ( date ) =>
									setAttributes( {
										blockVisibility: assign(
											{ ...blockVisibility },
											{ endDateTime: date }
										),
									} )
								}
								isOpen={ setIsEndPickerOpen }
								highlightedDate={ start }
							/>
						) }
						{ alert && (
							<Notice status="warning" isDismissible={ false }>
								{ __(
									'The start time is after the stop time. Please fix for date/time settings to function properly.',
									'block-visibility'
								) }
							</Notice>
						) }
					</div>
				) }
				</div>
			) }
			<Slot name="DateTimeControls" />
		</div>
	);
}

function getStart( blockVisibility, setAttributes ) {
	const depStart = blockVisibility?.startDateTime ?? null;
	const newStart = blockVisibility?.scheduling?.start ?? null;

	if ( depStart ) {
		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{ startDateTime: null },
				{ scheduling: assign(
	                { ...blockVisibility.scheduling },
					{ enable: true },
	                { start: depStart },
	            ) },
			),
		} );

		return depStart;
	} else {
		return newStart;
	}
}

function getEnd( blockVisibility, setAttributes ) {
	const depEnd = blockVisibility?.endDateTime ?? null;
	const newEnd = blockVisibility?.scheduling?.end ?? null;

	if ( depEnd ) {
		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{ endDateTime: null },
				{ scheduling: assign(
	                { ...blockVisibility.scheduling },
					{ enable: true },
	                { end: depEnd },
	            ) },
			),
		} );

		return depEnd;
	} else {
		return newEnd;
	}
}
