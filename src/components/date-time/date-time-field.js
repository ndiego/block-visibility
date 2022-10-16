/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { calendar, closeSmall } from '@wordpress/icons';
import { __experimentalGetSettings, format } from '@wordpress/date'; // eslint-disable-line

/**
 * Renders the date/time field (buttons)
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function DateTimeField( props ) {
	const { value, setPopoverOpen, onClearDateTime, includeTime } = props;

	let label = includeTime
		? __( 'Select Date and Time…', 'block-visibility' )
		: __( 'Select Date…', 'block-visibility' );

	const dateSettings = __experimentalGetSettings();

	if ( value ) {
		// Format the date time sting to match the WP admin display settings.
		const dateTimeFormat = includeTime
			? `${ dateSettings.formats.date } ${ dateSettings.formats.time }`
			: `${ dateSettings.formats.date }`;

		label = format( dateTimeFormat, value );
	}

	return (
		<div
			className={ classnames( 'date-time__date-time-field', {
				'has-value': value,
			} ) }
		>
			<Button
				icon={ calendar }
				title={ __( 'Select date/time', 'block-visibility' ) }
				onClick={ () => setPopoverOpen( ( v ) => ! v ) }
				isLink
			>
				<span>{ label }</span>
			</Button>
			{ value && (
				<Button
					icon={ closeSmall }
					className="clear-date-time"
					title={ __( 'Clear date/time', 'block-visibility' ) }
					onClick={ () => onClearDateTime( '' ) }
				/>
			) }
		</div>
	);
}
