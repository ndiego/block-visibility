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
import ProductsSelect from './async-rule-fields/products-select';

/**
 * Render the individual rule fields.
 *
 * @since 1.2.0
 * @param {Object} props All the props passed to this function
 */
export default function RuleField( props ) {
	const {
		rule,
		fieldId,
		fieldType,
		fieldName,
		valueType,
		valueTypeVariant,
		options,
		label,
		placeholder,
		help,
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
			<>
				{ label && (
					<label
						id={ `${ fieldId }_label` }
						htmlFor={ `${ fieldId }_select` }
						className="field__label"
					>
						{ label }
					</label>
				) }
				<Select
					aria-labelledby={ `${ fieldId }_label` }
					inputId={ `${ fieldId }_select` }
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
				{ help && (
					<div className="control-fields-item__help for-select-component">
						{ help }
					</div>
				) }
			</>
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
				help={ help }
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
				help={ help }
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
	} else if ( valueType === 'termsSelect' || valueType === 'termSelect' ) {
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
				isMulti={ valueType === 'termsSelect' }
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
		valueType === 'productsSelect' ||
		valueType === 'productSelect'
	) {
		if ( valueType === 'productSelect' ) {
			const isDynamic = 'dynamicProduct' === value;
			return (
				<>
					<ToggleControl
						className={ className }
						label={ __(
							'Detect current product',
							'block-visibility'
						) }
						checked={ isDynamic }
						onChange={ () =>
							handleRuleChange(
								isDynamic ? '' : 'dynamicProduct',
								valueType,
								fieldType,
								fieldName,
								triggerReset
							)
						}
						help={ help }
					/>
					{ ! isDynamic && (
						<ProductsSelect
							controlName={ props.controlName }
							className={ className }
							value={ value }
							valueType={ valueType }
							isMulti={ false }
							{ ...props }
						/>
					) }
				</>
			);
		}

		return (
			<ProductsSelect
				controlName={ props.controlName }
				className={ className }
				value={ value }
				valueType={ valueType }
				isMulti={ true }
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
			label={ label }
			placeholder={ placeholder }
			help={ help }
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
