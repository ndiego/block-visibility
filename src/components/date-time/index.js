/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import CalendarPopover from './calendar-popover';
import DateTimeField from './date-time-field';

/**
 * Add the block Schedule component.
 *
 * @since 1.8.0
 * @param {Object} props All the props passed to this function
 */
export default function DateTimeControl( props ) {
	const { value, onChange, includeTime } = props;
	const [ pickerOpen, setPopoverOpen ] = useState( false );

	return (
		<div className="date-time">
			<DateTimeField
				value={ value }
				setPopoverOpen={ setPopoverOpen }
				onClearDateTime={ () => onChange( '' ) }
				includeTime={ includeTime }
			/>
			{ pickerOpen && (
				<CalendarPopover
					value={ value }
					onDateChange={ ( date ) => onChange( date ) }
					setPopoverOpen={ setPopoverOpen }
					includeTime={ includeTime }
				/>
			) }
		</div>
	);
}
