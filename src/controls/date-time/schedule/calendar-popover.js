/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, DateTimePicker, Popover } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';
import { __experimentalGetSettings } from '@wordpress/date'; // eslint-disable-line

/**
 * Renders the popover for the date/time calender input
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 */
export default function CalendarPopover( props ) {
	const { currentDate, label, setAttribute, setPickerOpen, pickerType } =
		props;
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
			focusOnMount={ true }
			onClose={ () => setPickerOpen( false ) }
			placement="left-start"
			offset={ 8 }
		>
			<div className="date-time-popover__header">
				<h2>{ label }</h2>
				<Button
					label={ __( 'Close', 'block-visibility' ) }
					onClick={ () => setPickerOpen( false ) }
					icon={ closeSmall }
					isSmall
				/>
			</div>
			<DateTimePicker
				currentDate={ currentDate }
				onChange={ ( date ) => {
					setAttribute( pickerType, date );
				} }
				is12Hour={ is12Hour }
				__nextRemoveHelpButton={ true }
				__nextRemoveResetButton={ true }
			/>
		</Popover>
	);
}
