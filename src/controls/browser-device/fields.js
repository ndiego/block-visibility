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
			value: 'browser',
			label: __( 'Browser', 'block-visibility' ),
		},
		{
			value: 'device',
			label: __( 'Device', 'block-visibility' ),
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
	const anyOperators = [
		{
			value: 'any',
			label: __( 'Is any of the selected', 'block-visibility' ),
		},
		{
			value: 'none',
			label: __( 'Is none of the selected', 'block-visibility' ),
		},
	];

	const operatorPlaceholder = __( 'Select Condition…', 'block-visibility' );

	const fields = [
		{
			value: 'browserType',
			label: __( 'Browser', 'block-visibility' ),
			group: 'browser',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: anyOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'multiSelect',
					options: [
						{
							value: 'chrome',
							label: __( 'Chrome', 'block-visibility' ),
						},
						{
							value: 'firefox',
							label: __( 'Firefox', 'block-visibility' ),
						},
						{
							value: 'edge',
							label: __( 'Microsoft Edge', 'block-visibility' ),
						},
						{
							value: 'ie',
							label: __(
								'Internet Explorer',
								'block-visibility'
							),
						},
						{
							value: 'opera',
							label: __( 'Opera', 'block-visibility' ),
						},
						{
							value: 'safari',
							label: __( 'Safari', 'block-visibility' ),
						},
						{
							value: 'samsung',
							label: __( 'Samsung Internet', 'block-visibility' ),
						},
					],
					placeholder: __( 'Select Browser…', 'block-visibility' ),
				},
			],
		},
		{
			value: 'devicePlatform',
			label: __( 'Platform', 'block-visibility' ),
			group: 'device',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: anyOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'multiSelect',
					options: [
						{
							value: 'android',
							label: __( 'Android', 'block-visibility' ),
						},
						{
							value: 'ios',
							label: __(
								'iOS (iPhone and iPad)',
								'block-visibility'
							),
						},
						{
							value: 'linux',
							label: __( 'Linux', 'block-visibility' ),
						},
						{
							value: 'macintosh',
							label: __( 'Macintosh', 'block-visibility' ),
						},
						{
							value: 'windows',
							label: __( 'Windows', 'block-visibility' ),
						},
					],
					placeholder: __( 'Select Platform…', 'block-visibility' ),
				},
			],
		},
		{
			value: 'deviceType',
			label: __( 'Device Type', 'block-visibility' ),
			group: 'device',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: anyOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'multiSelect',
					options: [
						{
							value: 'mobile',
							label: __( 'Is Mobile', 'block-visibility' ),
						},
						{
							value: 'robot',
							label: __( 'Is Robot', 'block-visibility' ),
						},
						{
							value: 'other',
							label: __(
								'Is Desktop (Other)',
								'block-visibility'
							),
						},
					],
					placeholder: __( 'Select Type…', 'block-visibility' ),
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
 * @since 3.0.0
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
