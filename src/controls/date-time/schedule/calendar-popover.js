/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, DateTimePicker, Popover } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';
import { getSettings } from '@wordpress/date'; // eslint-disable-line

/**
 * Renders the popover for the date/time calender input
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 */
export default function CalendarPopover( props ) {
	const {
		currentDate,
		label,
		setAttribute,
		setPickerOpen,
		pickerType,
		isSeasonal,
		isPreset,
	} = props;
	const dateSettings = getSettings();

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
			className={ classnames( 'block-visibility__date-time-popover', {
				'is-seasonal': isSeasonal,
			} ) }
			focusOnMount={ true }
			onClose={ () => setPickerOpen( false ) }
			placement={ ! isPreset ? 'left-start' : undefined }
			offset={ ! isPreset ? 36 : undefined }
		>
			<div className="date-time-popover__header">
				<h2>{ label }</h2>
				<Button
					label={ __( 'Close', 'block-visibility' ) }
					onClick={ () => setPickerOpen( false ) }
					icon={ closeSmall }
					size="small"
				/>
			</div>
			<DateTimePicker
				currentDate={ currentDate }
				onChange={ ( date ) => {
					setAttribute( pickerType, false, date );
				} }
				is12Hour={ is12Hour }
				__nextRemoveHelpButton={ true }
				__nextRemoveResetButton={ true }
			/>
		</Popover>
	);
}
