/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useAllUsers from './utils/use-all-users';

/**
 * Get all available field groups.
 *
 * @since 2.3.0
 * @return {string} All field groups
 */
export function getFieldGroups() {
	const groups = [
		{
			value: 'type',
			label: __( 'User Rule Type', 'block-visibility' ),
		},
	];

	return groups;
}

/**
 * Get all available fields.
 *
 * @since 2.3.0
 * @param {Object} variables All plugin variables available via the REST API
 * @return {string}          All fields
 */
export function GetAllFields( variables ) {
	const users = useAllUsers();
	let roles = variables?.user_roles ?? [];

	// We don't need the 'logged-out in this context.
	roles = roles.filter( ( role ) => role.value !== 'logged-out' );

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

	const containsOperators = [
		{
			value: 'atLeastOne',
			label: __( 'Is at least one of the selected', 'block-visibility' ),
		},
		{
			value: 'all',
			label: __( 'Is all of the selected', 'block-visibility' ),
		},
		{
			value: 'none',
			label: __( 'Is none of the selected', 'block-visibility' ),
		},
	];

	const operatorPlaceholder = __( 'Select Condition…', 'block-visibility' );

	const fields = [
		{
			value: 'logged-out',
			label: __( 'User is logged-out', 'block-visibility' ),
			group: 'type',
		},
		{
			value: 'logged-in',
			label: __( 'User is logged-in', 'block-visibility' ),
			group: 'type',
		},
		{
			value: 'user-role',
			label: __( "User's role", 'block-visibility' ),
			group: 'type',
			fields: [
				{
					type: 'operatorField',
					valueType: 'select',
					options: containsOperators,
					placeholder: operatorPlaceholder,
				},
				{
					type: 'valueField',
					valueType: 'multiSelect',
					options: roles,
					placeholder: __( 'Select User Roles…', 'block-visibility' ),
					isMulti: true,
				},
			],
		},
		{
			value: 'users',
			label: __( 'User', 'block-visibility' ),
			group: 'type',
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
					options: users,
					placeholder: __( 'Select Users…', 'block-visibility' ),
					isMulti: true,
				},
			],
		},
	];

	return fields;
}

/**
 * Get all grouped fields. This takes the available fields and puts them in the
 * proper field groups.
 *
 * @since 2.3.0
 * @param {Object} variables All plugin variables available via the REST API
 * @return {string} All fields perpared in their respective field groups
 */
export function getGroupedFields( variables ) {
	const groups = getFieldGroups( variables );
	const fields = GetAllFields( variables );
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
