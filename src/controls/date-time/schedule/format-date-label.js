/**
 * WordPress dependencies
 */
import { __experimentalGetSettings, format } from '@wordpress/date'; // eslint-disable-line

/**
 * Format the given date.
 *
 * @since 1.1.0
 * @param {Object} date  The date object to format
 * @param {string} label The label when no date is selected
 * @return {string}		 The formatted date as a string or the fallback
 */
export default function formatDateLabel( date, label ) {
	const dateSettings = __experimentalGetSettings();
	let printedlabel = label;

	if ( date ) {
		printedlabel = format( `M j, Y ${ dateSettings.formats.time }`, date );
	}

	return printedlabel;
}
