/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Get all available field groups.
 *
 * @since 3.0.0
 * @return {string} All field groups
 */
export function getFieldGroups() {
	const groups = [
		{
			value: 'type',
			label: __( 'Metadata Type', 'block-visibility' ),
		},
	];

	return groups;
}

/**
 * Get all available fields.
 *
 * @since 3.0.0
 * @return {string} All fields
 */
export function getAllFields() {
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

	const operatorPlaceholder = __( 'Select Condition…', 'block-visibility' );

	const fields = [
		{
			value: 'postMetadata',
			label: __( 'Post Metadata', 'block-visibility' ),
			group: 'type',
			fields: [
				{
					type: 'subField',
					valueType: 'text',
					placeholder: __(
						'Enter Meta Key (Name)…',
						'block-visibility'
					),
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'text',
					placeholder: __( 'Enter Meta Value…', 'block-visibility' ),
					displayConditions: [
						{
							dependencyType: 'operatorField',
							dependencyValues: [
								'equal',
								'notEqual',
								'contains',
								'notContain',
							],
						},
					],
				},
			],
		},
		{
			value: 'userMetadata',
			label: __( 'User Metadata', 'block-visibility' ),
			group: 'type',
			fields: [
				{
					type: 'subField',
					valueType: 'text',
					placeholder: __(
						'Enter Meta Key (Name)…',
						'block-visibility'
					),
				},
				{
					type: 'operatorField',
					valueType: 'select',
					options: valueOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'text',
					placeholder: __( 'Enter Meta Value…', 'block-visibility' ),
					displayConditions: [
						{
							dependencyType: 'operatorField',
							dependencyValues: [
								'equal',
								'notEqual',
								'contains',
								'notContain',
							],
						},
					],
				},
			],
		},
	];

	return fields;
}

/**
 * Get all perpared fields. This takes the available fields and puts them in the
 * proper field groups.
 *
 * @since 1.1.0
 * @return {string} All fields perpared in their respective field groups
 */
export function getGroupedFields() {
	const groups = getFieldGroups();
	const fields = getAllFields();
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
