/**
 * External dependencies
 */
import { assign } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Notice, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import CalendarPopover from './calendar-popover';
import DateTimeField from './date-time-field';
import formatDateLabel from './format-date-label';

/**
 * Helper function for getting the start date. Function checks if the depracated
 * startDateTime attribute is set and handle accordingly.
 *
 * @since 1.4.1
 * @param {Object} blockVisibility All the block attributes
 * @param {Function} setAttributes Sets the block attributes
 * @return {string}		           Returns the start date
 */
function getStartDate( blockVisibility, setAttributes ) {
	const depracatedStart = blockVisibility?.startDateTime ?? null;
	const newStart = blockVisibility?.scheduling?.start ?? null;

	if ( depracatedStart ) {
		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{ startDateTime: null },
				{
					scheduling: assign(
						{ ...blockVisibility.scheduling },
						{ enable: true },
						{ start: depracatedStart }
					),
				}
			),
		} );

		return depracatedStart;
	}

	return newStart;
}

/**
 * Helper function for getting the end date. Function checks if the depracated
 * endDateTime attribute is set and handle accordingly.
 *
 * @since 1.4.1
 * @param {Object} blockVisibility All the block attributes
 * @param {Function} setAttributes Sets the block attributes
 * @return {string}		           Returns the end date
 */
function getEndDate( blockVisibility, setAttributes ) {
	const depracatedEnd = blockVisibility?.endDateTime ?? null;
	const newEnd = blockVisibility?.scheduling?.end ?? null;

	if ( depracatedEnd ) {
		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{ endDateTime: null },
				{
					scheduling: assign(
						{ ...blockVisibility.scheduling },
						{ enable: true },
						{ end: depracatedEnd }
					),
				}
			),
		} );

		return depracatedEnd;
	}

	return newEnd;
}

/**
 * Add the block Scheduling control
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Scheduling( props ) {
	const { attributes, setAttributes } = props;
	const { blockVisibility } = attributes;
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ isEndPickerOpen, setIsEndPickerOpen ] = useState( false );

	const enable = blockVisibility?.scheduling?.enable ?? false;
	const today = new Date( new Date().setHours( 0, 0, 0, 0 ) );

	// Run get functions to clean up depracated attributes
	const start = getStartDate( blockVisibility, setAttributes );
	const end = getEndDate( blockVisibility, setAttributes );

	const startDateLabel = formatDateLabel(
		start,
		__( 'Now', 'block-visibility' )
	);
	const endDateLabel = formatDateLabel(
		end,
		__( 'Never', 'block-visibility' )
	);

	// If there is no start date/time selected, but there is an end, default the
	// starting selection in the calendar to the day prior.
	const selectedStart = ( _start, _end, _today ) => {
		if ( _start ) {
			return _start;
		}

		const startAlt = _end ? new Date( _end ) : new Date( _today );

		if ( _end ) {
			startAlt.setHours( 0, 0, 0, 0 );
			startAlt.setDate( startAlt.getDate() - 1 );
		}

		return startAlt;
	};

	// If there is no end date/time selected, but there is a start, default the
	// starting selection in the calendar to the next day.
	const selectedEnd = ( _start, _end, _today ) => {
		if ( _end ) {
			return _end;
		}

		const endAlt = _start ? new Date( _start ) : new Date( _today );
		endAlt.setHours( 0, 0, 0, 0 );
		endAlt.setDate( endAlt.getDate() + 1 );

		return endAlt;
	};

	// If the start time is greater or equal to the end time, display a warning.
	let alert = false;
	if ( start && end ) {
		alert = start >= end ? true : false;
	}

	const setAttribute = ( attribute, value ) =>
		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{
					scheduling: assign(
						{ ...blockVisibility.scheduling },
						{ [ attribute ]: value }
					),
				}
			),
		} );

	return (
		<div
			className={ classnames(
				'visibility-control',
				'scheduling',
				enable && 'is-open'
			) }
		>
			<ToggleControl
				label={ __( 'Enable block scheduling', 'block-visibility' ) }
				checked={ enable }
				onChange={ () => setAttribute( 'enable', ! enable ) }
				help={
					enable &&
					__(
						'Schedule the block to only be visible between a start and end date/time.',
						'block-visibility'
					)
				}
			/>
			{ enable && (
				<div className="scheduling__date-time-fields">
					<div className="visibility-control__label">
						{ __( 'Start showing', 'block-visibility' ) }
					</div>
					<DateTimeField
						label={ startDateLabel }
						title={ __(
							'Choose a start date/time',
							'block-visibility'
						) }
						hasDateTime={ start }
						onOpenPopover={ setIsPickerOpen }
						onClearDateTime={ () => setAttribute( 'start', '' ) }
					/>
					{ isPickerOpen && (
						<CalendarPopover
							label={ __(
								'Start Date/Time',
								'block-visibility'
							) }
							currentDate={ selectedStart( start, end, today ) }
							onDateChange={ ( date ) =>
								setAttribute( 'start', date )
							}
							isOpen={ setIsPickerOpen }
							highlightedDate={ end }
						/>
					) }
					<div className="visibility-control__label">
						{ __( 'Stop showing', 'block-visibility' ) }
					</div>
					<DateTimeField
						label={ endDateLabel }
						title={ __(
							'Choose an end date/time',
							'block-visibility'
						) }
						hasDateTime={ end }
						onOpenPopover={ setIsEndPickerOpen }
						onClearDateTime={ () => setAttribute( 'end', '' ) }
					/>
					{ isEndPickerOpen && (
						<CalendarPopover
							label={ __( 'End Date/Time', 'block-visibility' ) }
							currentDate={ selectedEnd( start, end, today ) }
							onDateChange={ ( date ) =>
								setAttribute( 'end', date )
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
	);
}
