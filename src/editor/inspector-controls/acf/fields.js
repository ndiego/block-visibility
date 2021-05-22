/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Get all available field groups.
 *
 * @since 1.9.0
 * @param {Object} variables All plugin variables available via the REST API
 * @return {string} All field groups
 */
export function getFieldGroups( variables ) {
	const fields = variables?.integrations?.acf?.fields ?? [];
	const groups = [];

	if ( fields.length !== 0 ) {
		fields.forEach( ( group ) => {
			const groupKey = group?.key ?? '';
			const groupTitle = group?.title ?? '';

			groups.push( {
				value: groupKey,
				label: groupTitle,
			} );
		} );
	}

	return groups;
}

/**
 * Get all available fields.
 *
 * @since 1.9.0
 * @param {Object} variables All plugin variables available via the REST API
 * @return {string}          All fields
 */
export function getAllFields( variables ) {
	const fields = variables?.integrations?.acf?.fields ?? [];
	const allFields = [];

	const valueOperators = [
		{
			value: 'notEmpty',
			label: __( 'Has any value', 'block-visibility' ),
			disableValue: true,
		},
		{
			value: 'empty',
			label: __( 'Has no value', 'block-visibility' ),
			disableValue: true,
		},
		{
			value: 'equal',
			label: __( 'Value is equal to', 'block-visibility' ),
		},
		{
			value: 'notEqual',
			label: __( 'Value is not equal to', 'block-visibility' ),
		},
		{
			value: 'contains',
			label: __( 'Value contains', 'block-visibility' ),
		},
		{
			value: 'notContain',
			label: __( 'Value does not contain', 'block-visibility' ),
		},
	];

	if ( fields.length !== 0 ) {
		fields.forEach( ( group ) => {
			const groupKey = group?.key ?? '';
			const groupFields = group?.fields ?? [];

			if ( groupFields.length !== 0 ) {
				groupFields.forEach( ( field ) => {
					const fieldKey = field?.key ?? '';
					const fieldLabel = field?.label ?? '';

					allFields.push( {
						value: fieldKey,
						label: fieldLabel,
						group: groupKey,
						operators: valueOperators,
						valueType: 'text',
						valuePlaceholder: __(
							'Enter Value…',
							'block-visibility'
						),
					} );
				} );
			}
		} );
	}

	return allFields;
}

/**
 * Get all grouped fields. This takes the available fields and puts them in the
 * proper field groups.
 *
 * @since 1.9.0
 * @param {Object} variables All plugin variables available via the REST API
 * @return {string} All fields perpared in their respective field groups
 */
export function getGroupedFields( variables ) {
	const groups = getFieldGroups( variables );
	const fields = getAllFields( variables );
	const groupedFields = [];

	groups.forEach( ( group ) => {
		const groupValue = group?.value ?? '';
		const groupLabel = group?.label ?? '';

		const groupOptions = fields.filter(
			( field ) => field.group === groupValue
		);

		groupedFields.push( {
			value: groupValue,
			label: groupLabel,
			options: groupOptions,
		} );
	} );

	return groupedFields;
}
