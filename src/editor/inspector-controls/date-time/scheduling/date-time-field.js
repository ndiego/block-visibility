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
	const { label, title, hasDateTime, onOpenPopover, onClearDateTime } = props;

	return (
		<div className="date-time-field">
			<Button
				icon={ calendar }
				title={ title }
				onClick={ () => onOpenPopover( ( _isOpen ) => ! _isOpen ) }
				isLink
			>
				{ label }
			</Button>
			{ hasDateTime && (
				<Button
					icon={ closeSmall }
					className="clear-date-time"
					title={ __( 'Clear date/time', 'block-visibility' ) }
					onClick={ () => onClearDateTime() }
				/>
			) }
		</div>
	);
}
