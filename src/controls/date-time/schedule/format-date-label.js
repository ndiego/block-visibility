/**
 * WordPress dependencies
 */
import { getSettings, format } from '@wordpress/date'; // eslint-disable-line

/**
 * Format the given date.
 *
 * @since 1.1.0
 * @param {Object}  date       The date object to format
 * @param {string}  label      The label when no date is selected
 * @param {boolean} isSeasonal Is the date seasonal (year agnostic)
 * @return {string}		       The formatted date as a string or the fallback
 */
export default function formatDateLabel( date, label, isSeasonal ) {
	const dateSettings = getSettings();
	let printedlabel = label;

	if ( date ) {
		printedlabel = isSeasonal
			? format( `F j ${ dateSettings.formats.time }`, date )
			: format( `M j, Y ${ dateSettings.formats.time }`, date );
	}

	return printedlabel;
}
