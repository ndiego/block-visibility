/**
 * WordPress dependencies
 */
import { DatePicker, DateTimePicker, Popover } from '@wordpress/components';
import { __experimentalGetSettings } from '@wordpress/date'; // eslint-disable-line

/**
 * Renders the popover for the date/time calender input
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function CalendarPopover( props ) {
	const { value, onDateChange, setPopoverOpen, includeTime } = props;
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
			onClose={ setPopoverOpen.bind( null, false ) }
		>
			{ [
				includeTime && (
					<DateTimePicker
						currentDate={ value }
						onChange={ ( date ) => {
							onDateChange( date );
							setPopoverOpen( false );
						} }
						is12Hour={ is12Hour }
					/>
				),
				! includeTime && (
					<DatePicker
						currentDate={ value }
						onChange={ ( date ) => {
							onDateChange( date );
							setPopoverOpen( false );
						} }
						is12Hour={ is12Hour }
					/>
				),
			] }
		</Popover>
	);
}
