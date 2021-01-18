/**
 * WordPress dependencies
 */
import { DateTimePicker, Popover } from '@wordpress/components';
import { __experimentalGetSettings } from '@wordpress/date';

/**
 * Renders the popover for the date/time calender input
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function CalendarPopover( props ) {
	const { label, currentDate, onDateChange, isOpen, highlightedDate } = props;
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

	return (
		<Popover
			className="block-visibility__date-time-popover"
			onClose={ isOpen.bind( null, false ) }
		>
			<div className="date-time-header">
				<span>{ label }</span>
			</div>
			<DateTimePicker
				currentDate={ currentDate }
				onChange={ ( date ) => onDateChange( date ) }
				is12Hour={ is12Hour }
				// isDayHighlighted does not appear to work, but this does.
				events={ [ { date: highlightedDate } ] }
			/>
		</Popover>
	);
}
