/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DateTimePicker, Popover, Button, Notice } from '@wordpress/components';
import { __experimentalGetSettings, dateI18n, format } from '@wordpress/date';
import { withState } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { calendar, cancelCircleFilled, closeSmall } from '@wordpress/icons';
import { useEntityProp } from '@wordpress/core-data';


/**
 * Internal dependencies
 */
import { hideControlSection } from './../utils/hide-control-section';


function formatDateLabel( date, fallback ) {
	const dateSettings = __experimentalGetSettings();
	let label = fallback;

	if ( date ) {
		label = format(
			`${ dateSettings.formats.date } ${ dateSettings.formats.time }`,
			date
	    )
	}

	return label;
}

/**
 * Add the date/time vsibility controls
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function DateTime( props ) {
	const {
		attributes,
		setAttributes,
		enabledControls,
		settings,
	} = props;
	const [ siteFormat ] = useEntityProp( 'root', 'site', 'date_format' );

	console.log( siteFormat );
	const [ isPickerOpen, setIsPickerOpen ] = useState( false );
	const [ isEndPickerOpen, setIsEndPickerOpen ] = useState( false );

	const { blockVisibility } = attributes;
	const { startDateTime, endDateTime } = blockVisibility;

	const sectionHidden = hideControlSection(
		enabledControls,
		blockVisibility,
		'time_date'
	);

	if ( sectionHidden ) {
		return null;
	}

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
	const resolvedFormat = siteFormat || dateSettings.formats.date;
	const startDateLabel = formatDateLabel( start, __( 'Now' ) );
	const endDateLabel = formatDateLabel( end, __( 'Never' ) );

	const today = new Date( new Date().setHours( 0, 0, 0, 0 ) );

	const startAlt = end ? new Date( end ) : new Date( today );
	if ( end ) {
		startAlt.setHours( 0, 0, 0, 0 );
		startAlt.setDate( startAlt.getDate() - 1 );
	}
	const selectedStartDate = start ? start : startAlt;

	const endAlt = start ? new Date( start ) : new Date( today );
	endAlt.setHours( 0, 0, 0, 0 );
	endAlt.setDate( endAlt.getDate() + 1 );
	const selectedEndDate = end ? end : endAlt;

	let alert = false;
	if ( start && end ) {
		alert = start > end ? true : false;
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
				{ start &&
					<Button
						icon={ closeSmall }
						className="clear-date-time"
						title={ __( 'Clear start date/time', 'block-visibility' ) }
						onClick={ () =>
							setAttributes( {
								blockVisibility: assign(
									{ ...blockVisibility },
									{ startDateTime: '' }
								),
							} )
						}
					/>
	 			}
			</div>
			{ isPickerOpen && (
				<Popover
					className="block-visibility__date-time-popover"
					onClose={ setIsPickerOpen.bind( null, false ) }
				>
					<div class="date-time-header">
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
				{ end &&
					<Button
						icon={ closeSmall }
						className="clear-date-time"
						title={ __( 'Clear end date/time', 'block-visibility' ) }
						onClick={ () =>
							setAttributes( {
								blockVisibility: assign(
									{ ...blockVisibility },
									{ endDateTime: '' }
								),
							} )
						}
					/>
				}
			</div>
			{ isEndPickerOpen && (
				<Popover
					className="block-visibility__date-time-popover"
					onClose={ setIsEndPickerOpen.bind( null, false ) }
				>
					<div class="date-time-header">
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
					/>
				</Popover>
			) }
			{ alert &&
				<Notice status="warning" isDismissible={ false }>
					{ __(
						'The start time is after the stop time. Please fix for date/time settings to function properly.',
						'block-visibility'
					) }
				</Notice>
			}
		</div>
	);
}
