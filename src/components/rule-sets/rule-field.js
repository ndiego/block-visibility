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
import DateTime from '../date-time';
import AuthorsSelect from './async-rule-fields/authors-select';
import TermsSelect from './async-rule-fields/terms-select';
import PostsSelect from './async-rule-fields/posts-select';
import WooProductsSelect from './async-rule-fields/woo-products-select';

/**
 * Render the individual rule fields.
 *
 * @since 1.2.0
 * @param {Object} props All the props passed to this function
 */
export default function RuleField( props ) {
	const {
		rule,
		fieldType,
		fieldName,
		valueType,
		valueTypeVariant,
		options,
		placeholder,
		handleRuleChange,
		triggerReset,
		isLoading,
		hasGroupedFields,
		hasGroupedOptions,
		dependantFieldValue,
	} = props;

	// The user has not selected a rule yet. Still display the ruleField.
	// If we do not have grouped fields, always display the fields.
	if ( hasGroupedFields && ! rule.field && fieldType !== 'ruleField' ) {
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
				isLoading={ isLoading }
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
	} else if ( valueType === 'authorsSelect' ) {
		return (
			<AuthorsSelect
				className={ className }
				value={ value }
				{ ...props }
			/>
		);
	} else if ( valueType === 'termsSelect' ) {
		let taxonomySlug;

		// A defined variant will take precedent.
		if ( dependantFieldValue && ! valueTypeVariant ) {
			taxonomySlug = dependantFieldValue;
		} else if ( valueTypeVariant ) {
			taxonomySlug = valueTypeVariant;
		}

		return (
			<TermsSelect
				key={ taxonomySlug }
				taxonomySlug={ taxonomySlug }
				className={ className }
				value={ value }
				{ ...props }
			/>
		);
	} else if ( valueType === 'postsSelect' || valueType === 'postSelect' ) {
		let postType;

		// A defined variant will take precedent.
		if ( dependantFieldValue && ! valueTypeVariant ) {
			postType = dependantFieldValue;
		} else if ( valueTypeVariant ) {
			postType = valueTypeVariant;
		}

		return (
			<PostsSelect
				key={ postType }
				postType={ postType }
				className={ className }
				value={ value }
				valueType={ valueType }
				isMulti={ valueType === 'postsSelect' }
				{ ...props }
			/>
		);
	} else if (
		valueType === 'wooProductsSelect' ||
		valueType === 'wooProductSelect'
	) {
		return (
			<WooProductsSelect
				className={ className }
				value={ value }
				valueType={ valueType }
				isMulti={ valueType === 'wooProductsSelect' }
				{ ...props }
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
			autocomplete="off"
		/>
	);
}
