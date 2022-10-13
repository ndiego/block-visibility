/**
 * External dependencies
 */
import Select from 'react-select';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { TextControl, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import DateTime from './../date-time';

/**
 * Render the individual rule fields.
 *
 * @since 2.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function RuleField( props ) {
	const {
		rule,
		fieldType,
		fieldName,
		valueType,
		options,
		placeholder,
		handleRuleChange,
		triggerReset,
		hasGroupedOptions,
	} = props;

	// The user has not selected a rule yet. Still display the rule field.
	if ( ! rule.field && fieldType !== 'ruleField' ) {
		return null;
	}

	let value = '';

	// Retrieve the set field value from the rule object.
	if ( fieldType === 'ruleField' ) {
		value = rule?.field ?? '';
	} else if ( fieldType === 'subField' ) {
		if ( rule?.subFields ) {
			value = rule.subFields[ fieldName ] ?? '';
		} else {
			value = rule?.subField ?? '';
		}
	} else {
		// Convert field type to actual field parameter.
		const field = fieldType === 'operatorField' ? 'operator' : 'value';

		value = rule[ field ] ?? '';
	}

	// For select and multiselect values, we need to get the actual value from
	// the array of available value options.
	if ( valueType === 'select' || valueType === 'multiSelect' ) {
		let theSelectedValue = '';
		let valueOptions = options;

		// The value options are grouped and need to be handled differently.
		if ( hasGroupedOptions ) {
			const groupedOptions = [];

			options.forEach( ( group ) => {
				groupedOptions.push( ...group.options );
			} );

			valueOptions = groupedOptions;
		}

		if ( valueType === 'multiSelect' ) {
			theSelectedValue = valueOptions.filter( ( field ) =>
				value.includes( field.value )
			);
		} else {
			theSelectedValue = valueOptions.filter(
				( field ) => field.value === value
			);

			// If value found with filter, it returns an array with a single
			// item. So convert to string.
			if ( theSelectedValue.length !== 0 ) {
				theSelectedValue = theSelectedValue[ 0 ];
			}
		}

		value = theSelectedValue;
	}

	const className = 'field__' + fieldType;

	if ( valueType === 'select' || valueType === 'multiSelect' ) {
		const selectPlaceholder = placeholder
			? placeholder
			: __( 'Select…', 'block-visibility' );

		return (
			<Select
				className={ classnames(
					'block-visibility__react-select',
					className
				) }
				classNamePrefix="react-select"
				value={ value }
				options={ options }
				placeholder={ selectPlaceholder }
				onChange={ ( v ) =>
					handleRuleChange(
						v,
						valueType,
						fieldType,
						fieldName,
						triggerReset
					)
				}
				isMulti={ valueType === 'multiSelect' }
			/>
		);
	} else if ( valueType === 'date' || valueType === 'dateTime' ) {
		return (
			<DateTime
				className={ className }
				value={ value }
				onChange={ ( v ) =>
					handleRuleChange(
						v,
						valueType,
						fieldType,
						fieldName,
						triggerReset
					)
				}
				includeTime={ valueType === 'dateTime' ? true : false }
			/>
		);
	} else if ( valueType === 'toggle' ) {
		return (
			<ToggleControl
				className={ className }
				label={ placeholder }
				checked={ value }
				onChange={ () =>
					handleRuleChange(
						! value,
						valueType,
						fieldType,
						fieldName,
						triggerReset
					)
				}
			/>
		);
	}

	return (
		<TextControl
			className={ className }
			type={ valueType }
			min={ valueType === 'number' ? 0 : '' }
			value={ value }
			placeholder={ placeholder }
			onChange={ ( v ) =>
				handleRuleChange(
					v,
					'text',
					fieldType,
					fieldName,
					triggerReset
				)
			}
		/>
	);
}
