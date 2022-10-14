/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalGetSettings, format } from '@wordpress/date'; // eslint-disable-line

/**
 * Format the given date.
 *
 * @since 1.1.0
 * @param {Object} date     The date object to format
 * @param {string} fallback If there is no date, a fallback string is returned
 * @return {string}		    The formatted date as a string or the fallback
 */
export default function formatDateLabel(
	date,
	fallback = __( 'No time selected', 'block-visibility' )
) {
	const dateSettings = __experimentalGetSettings();
	let label = fallback;
	console.log( dateSettings.formats.time );
	if ( date ) {
		// label = format(
		// 	`${ dateSettings.formats.date } ${ dateSettings.formats.time }`,
		// 	date
		// );
		label = format( 'Y-m-d g:i a', date );
	}

	return label;
}
