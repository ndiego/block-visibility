/**
 * External dependencies
 */
import { assign } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	DateTimePicker,
	Popover,
	Button,
	Notice,
	ToggleControl,
} from '@wordpress/components';
import { __experimentalGetSettings, format } from '@wordpress/date';
import { useState } from '@wordpress/element';
import { calendar, closeSmall } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import CalendarPopover from './calendar-popover';
import DateTimeField from './date-time-field';



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
 * Add the block Scheduling control
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Scheduling( props ) {
    const { attributes, setAttributes, enabledControls } = props;
    const { blockVisibility } = attributes;
    const [ isPickerOpen, setIsPickerOpen ] = useState( false );
    const [ isEndPickerOpen, setIsEndPickerOpen ] = useState( false );

    const enable = blockVisibility?.scheduling?.enable ?? false;
	const today = new Date( new Date().setHours( 0, 0, 0, 0 ) );

    // Run get functions to clean up depracated attributes
	const start = getStart( blockVisibility, setAttributes );
	const end = getEnd( blockVisibility, setAttributes );

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
    const selectedStart = ( start, end, today ) => {
        if ( start ) {
            return start;
        }

        const startAlt = end ? new Date( end ) : new Date( today );

    	if ( end ) {
    		startAlt.setHours( 0, 0, 0, 0 );
    		startAlt.setDate( startAlt.getDate() - 1 );
    	}

        return startAlt;
    }

	// If there is no end date/time selected, but there is a start, default the
	// starting selection in the calendar to the next day.
    const selectedEnd = ( start, end, today ) => {
        if ( end ) {
            return end;
        }

        const endAlt = start ? new Date( start ) : new Date( today );
    	endAlt.setHours( 0, 0, 0, 0 );
    	endAlt.setDate( endAlt.getDate() + 1 );

    	return endAlt;
    }

	// If the start time is greater or equal to the end time, display a warning.
	let alert = false;
	if ( start && end ) {
		alert = start >= end ? true : false;
	}

    const setAttribute = ( attribute, value ) => {
        setAttributes( {
            blockVisibility: assign(
                { ...blockVisibility },
                { scheduling: assign(
                    { ...blockVisibility.scheduling },
                    { [ attribute ]: value }
                ) },
            ),
        } )
    }

    return (
        <div className={ classnames(
            'visibility-control',
            'scheduling',
            enable && 'is-open'
        ) }>
        <ToggleControl
            label={ __( 'Enable block scheduling', 'block-visibility' ) }
            checked={ enable }
            onChange={ () => setAttribute( 'enable', ! enable ) }
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
                    onClearDateTime={ () => setAttribute( 'start', '' ) }
                    help={ __( 'Starting date/time', 'block-visibility' ) }
                />
                { isPickerOpen && (
                    <CalendarPopover
                        label={ __(
                            'Start Date/Time',
                            'block-visibility'
                        ) }
                        currentDate={ selectedStart( start, end, today ) }
                        onDateChange={ ( date ) => setAttribute( 'start', date ) }
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
                    onClearDateTime={ () => setAttribute( 'end', '' ) }
                    help={ __( 'Ending date/time', 'block-visibility' ) }
                />
                { isEndPickerOpen && (
                    <CalendarPopover
                        label={ __( 'End Date/Time', 'block-visibility' ) }
                        currentDate={ selectedEnd( start, end, today ) }
                        onDateChange={ ( date ) => setAttribute( 'end', date ) }
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
