/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const acfFields = [
	{
		type: 'text',
		label: __( 'Text', 'block-visibility' ),
	},
	{
		type: 'textarea',
		label: __( 'Text Area', 'block-visibility' ),
	},
	{
		type: 'number',
		label: __( 'Number', 'block-visibility' ),
		options: 'numeric',
	},
	{
		type: 'range',
		label: __( 'Range', 'block-visibility' ),
		options: 'numeric',
	},
	{
		type: 'email',
		label: __( 'Email', 'block-visibility' ),
	},
	{
		type: 'url',
		label: __( 'Url', 'block-visibility' ),
	},
	{
		type: 'password',
		label: __( 'Password', 'block-visibility' ),
	},
	{
		type: 'image',
		label: __( 'Image', 'block-visibility' ),
	},
	{
		type: 'file',
		label: __( 'File', 'block-visibility' ),
	},
	{
		type: 'wysiwyg',
		label: __( 'Wysiwyg Editor', 'block-visibility' ),
	},
	{
		type: 'oembed',
		label: __( 'oEmbed', 'block-visibility' ),
	},
	{
		type: 'select',
		label: __( 'Select', 'block-visibility' ),
	},
	{
		type: 'checkbox',
		label: __( 'Checkbox', 'block-visibility' ),
	},
	{
		type: 'radio',
		label: __( 'Radio Button', 'block-visibility' ),
	},
	{
		type: 'button_group',
		label: __( 'Button Group', 'block-visibility' ),
	},
	{
		type: 'true_false',
		label: __( 'True / False', 'block-visibility' ),
		options: 'boolean',
	},
	{
		type: 'link',
		label: __( 'Link', 'block-visibility' ),
	},
	{
		type: 'post_object',
		label: __( 'Post Object', 'block-visibility' ),
	},
	{
		type: 'page_link',
		label: __( 'Page Link', 'block-visibility' ),
	},
	{
		type: 'relationship',
		label: __( 'Relationship', 'block-visibility' ),
	},
	{
		type: 'taxonomy',
		label: __( 'Taxonomy', 'block-visibility' ),
	},
	{
		type: 'user',
		label: __( 'User', 'block-visibility' ),
	},
	{
		type: 'google_map',
		label: __( 'Google Map', 'block-visibility' ),
	},
	{
		type: 'date_picker',
		label: __( 'Date Picker', 'block-visibility' ),
		options: 'dateTime',
	},
	{
		type: 'date_time_picker',
		label: __( 'Date Time Picker', 'block-visibility' ),
		options: 'dateTime',
	},
	{
		type: 'time_picker',
		label: __( 'Time Picker', 'block-visibility' ),
		options: 'dateTime',
	},
	{
		type: 'color_picker',
		label: __( 'Color Picker', 'block-visibility' ),
	},
	{
		type: 'message',
		label: __( 'Message', 'block-visibility' ),
	},
	{
		type: 'accordion',
		label: __( 'Accordion', 'block-visibility' ),
	},
	{
		type: 'tab',
		label: __( 'Tab', 'block-visibility' ),
	},
	{
		type: 'group',
		label: __( 'Group', 'block-visibility' ),
	},
	{
		type: 'repeater',
		label: __( 'Repeater', 'block-visibility' ),
	},
	{
		type: 'flexible_content',
		label: __( 'Flexible Content', 'block-visibility' ),
	},
	{
		type: 'clone',
		label: __( 'Clone', 'block-visibility' ),
	},
];

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
						help:
							'Field type: ' +
							acfFields.filter(
								( acfField ) => acfField?.type === field?.type
							)[ 0 ]?.label,
						helpPosition: 'top',
						fields: [
							{
								type: 'operatorField',
								valueType: 'select',
								options: getFieldTypeOperators( field ),
								placeholder: __(
									'Select Condition…',
									'block-visibility'
								),
							},
							{
								type: 'valueField',
								valueType: 'text',
								placeholder: __(
									'Enter Value…',
									'block-visibility'
								),
								displayConditions: [
									{
										dependencyType: 'operatorField',
										dependencyValues: [
											'equal',
											'notEqual',
											'greaterThan',
											'greaterThanEqual',
											'lessThan',
											'lessThanEqual',
											'contains',
											'notContain',
										],
									},
								],
							},
							{
								type: 'subField',
								name: 'fieldLocation',
								valueType: 'select',
								options: [
									{
										value: 'post',
										label: __(
											'The current post',
											'block-visibility'
										),
										disableValue: true,
									},
									{
										value: 'user',
										label: __(
											'The current user',
											'block-visibility'
										),
										disableValue: true,
									},
									{
										value: 'option',
										label: __(
											'An options page',
											'block-visibility'
										),
									},
								],
								label: __(
									'This field is associated with',
									'block-visibility'
								),
								placeholder: __(
									'Select…',
									'block-visibility'
								),
							},
						],
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

/**
 * Get the options accociated with the selected ACF field.
 *
 * @since 2.6.0
 * @param {Object} field The selected field
 * @return {Object} The options for the selected field
 */
function getFieldTypeOperators( field ) {
	const fieldOperators = acfFields.filter(
		( acfField ) => acfField?.type === field?.type
	)[ 0 ]?.options;

	const booleanOperators = [
		{
			value: 'notEmpty',
			label: __( 'True', 'block-visibility' ),
			disableValue: true,
		},
		{
			value: 'empty',
			label: __( 'False', 'block-visibility' ),
			disableValue: true,
		},
	];

	const numericDateTimeOperators = [
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
			value: 'greaterThan',
			label: __( 'Value is greater than', 'block-visibility' ),
		},
		{
			value: 'greaterThanEqual',
			label: __( 'Value is greater or equal to', 'block-visibility' ),
		},
		{
			value: 'lessThan',
			label: __( 'Value is less than', 'block-visibility' ),
		},
		{
			value: 'lessThanEqual',
			label: __( 'Value is less than or equal to', 'block-visibility' ),
		},
	];

	const defaultOperators = [
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

	if ( fieldOperators === 'boolean' ) {
		return booleanOperators;
	} else if (
		fieldOperators === 'dateTime' ||
		fieldOperators === 'numeric'
	) {
		return numericDateTimeOperators;
	}

	return defaultOperators;
}
