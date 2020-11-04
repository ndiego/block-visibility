/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DateTimePicker, Popover, Button, Notice } from '@wordpress/components';
import { __experimentalGetSettings, format } from '@wordpress/date';
import { useState } from '@wordpress/element';
import { calendar, closeSmall } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { hideControlSection } from './../utils/hide-control-section';

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
	const { attributes, setAttributes, enabledControls } = props;
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ isEndPickerOpen, setIsEndPickerOpen ] = useState( false );

	const { blockVisibility } = attributes;
	const { startDateTime, endDateTime } = blockVisibility;

	const sectionHidden = hideControlSection(
		enabledControls,
		blockVisibility,
		'date_time'
	);

	if ( sectionHidden ) {
		return null;
	}

	// Force to null if variables don't exist due to quirk with DateTimePicker
	const start = startDateTime ? startDateTime : null;
	const end = endDateTime ? endDateTime : null;

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
		<div className="visibility-controls__date-time">
			<div>{ __( 'Start Showing', 'block-visibility' ) }</div>
			<div className="date-time-field">
				<Button
					icon={ calendar }
					title={ __( 'Set a start date/time', 'block-visibility' ) }
					onClick={ () =>
						setIsPickerOpen( ( _isOpen ) => ! _isOpen )
					}
					isLink
				>
					{ startDateLabel }
				</Button>
				{ start && (
					<Button
						icon={ closeSmall }
						className="clear-date-time"
						title={ __(
							'Clear start date/time',
							'block-visibility'
						) }
						onClick={ () =>
							setAttributes( {
								blockVisibility: assign(
									{ ...blockVisibility },
									{ startDateTime: '' }
								),
							} )
						}
					/>
				) }
			</div>
			{ isPickerOpen && (
				<Popover
					className="block-visibility__date-time-popover"
					onClose={ setIsPickerOpen.bind( null, false ) }
				>
					<div className="date-time-header">
						<span>
							{ __( 'Start Date/Time', 'block-visibility' ) }
						</span>
					</div>
					<DateTimePicker
						currentDate={ selectedStartDate }
						onChange={ ( date ) =>
							setAttributes( {
								blockVisibility: assign(
									{ ...blockVisibility },
									{ startDateTime: date }
								),
							} )
						}
						is12Hour={ is12Hour }
						// isDayHighlighted does not appear to work, but this does.
						events={ [ { date: end } ] }
					/>
				</Popover>
			) }
			<div>{ __( 'Stop Showing', 'block-visibility' ) }</div>
			<div className="date-time-field">
				<Button
					icon={ calendar }
					title={ __( 'Set an end date/time', 'block-visibility' ) }
					onClick={ () =>
						setIsEndPickerOpen( ( _isOpen ) => ! _isOpen )
					}
					isLink
				>
					{ endDateLabel }
				</Button>
				{ end && (
					<Button
						icon={ closeSmall }
						className="clear-date-time"
						title={ __(
							'Clear end date/time',
							'block-visibility'
						) }
						onClick={ () =>
							setAttributes( {
								blockVisibility: assign(
									{ ...blockVisibility },
									{ endDateTime: '' }
								),
							} )
						}
					/>
				) }
			</div>
			{ isEndPickerOpen && (
				<Popover
					className="block-visibility__date-time-popover"
					onClose={ setIsEndPickerOpen.bind( null, false ) }
				>
					<div className="date-time-header">
						<span>
							{ __( 'End Date/Time', 'block-visibility' ) }
						</span>
					</div>
					<DateTimePicker
						currentDate={ selectedEndDate }
						onChange={ ( date ) =>
							setAttributes( {
								blockVisibility: assign(
									{ ...blockVisibility },
									{ endDateTime: date }
								),
							} )
						}
						is12Hour={ is12Hour }
						// isDayHighlighted does not appear to work, but this does.
						events={ [ { date: start } ] }
					/>
				</Popover>
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
	);
}
