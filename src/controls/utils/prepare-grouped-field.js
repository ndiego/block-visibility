/**
 * Get all perpared fields. This takes the available fields and puts them in the
 * proper field groups.
 *
 * @since 3.6.0
 * @param {Object} groups All field groups.
 * @param {Object} fields All ungrouped fields.
 * @return {string} All fields perpared in their respective field groups
 */
export default function prepareGroupedFields( groups, fields ) {
	const preparedFields = [];

	groups.forEach( ( group ) => {
		const groupValue = group?.value ?? '';
		const groupLabel = group?.label ?? '';

		const groupOptions = fields.filter(
			( field ) => field.group === groupValue
		);

		preparedFields.push( {
			value: groupValue,
			label: groupLabel,
			options: groupOptions,
		} );
	} );

	return preparedFields;
}
