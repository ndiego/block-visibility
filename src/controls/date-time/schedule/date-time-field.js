/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

/**
 * Renders the date/time field (buttons)
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 */
export default function DateTimeField( props ) {
	const {
		dateType,
		label,
		title,
		hasDateTime,
		isSeasonal,
		setAttribute,
		setPickerOpen,
		setPickerType,
	} = props;

	return (
		<div className="date-time-item__field">
			<Button
				title={ title }
				onClick={ () => {
					setPickerType( dateType );
					setPickerOpen( true );
				} }
			>
				<span
					className={
						isSeasonal && ! hasDateTime && 'seasonal-label'
					}
				>
					{ label }
				</span>
			</Button>
			{ hasDateTime && (
				<Button
					icon={ closeSmall }
					className="clear-date-time"
					title={ __( 'Clear date/time', 'block-visibility' ) }
					onClick={ () => setAttribute( dateType, false, '' ) }
					isSmall
				/>
			) }
		</div>
	);
}
