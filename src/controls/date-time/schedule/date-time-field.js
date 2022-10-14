/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { calendar, closeSmall } from '@wordpress/icons';

/**
 * Renders the date/time field (buttons)
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function DateTimeField( props ) {
	const { type, label, title, hasDateTime, onOpenPopover, onClearDateTime, setPickerType, setPickerOpen, setAttribute } = props;

	return (
		<div className="schedule__date-time-field">
			<Button
				title={ title }
				onClick={ () => {
					setPickerType( type );
					setPickerOpen( true );
				} }
				isLink
			>
				<span>{ label }</span>
			</Button>
			{ hasDateTime && (
				<Button
					icon={ closeSmall }
					className="clear-date-time"
					title={ __( 'Clear date/time', 'block-visibility' ) }
					onClick={ () => setAttribute( type, '' ) }
					isSmall
				/>
			) }
		</div>
	);
}
