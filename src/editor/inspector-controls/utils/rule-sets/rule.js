/**
 * External dependencies
 */
import { assign } from 'lodash';
import Select from 'react-select';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

/**
 * Handles the individual rules.
 *
 * @since 1.9.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Rule( props ) {
	const {
		rule,
		ruleIndex,
		ruleSet,
		ruleSetIndex,
		ruleSets,
		hideOnRuleSets,
		controlName,
		controlAtts,
		setControlAtts,
		groupedFields,
		allFields,
	} = props;

	let selectedField = allFields.filter(
		( field ) => field.value === rule.field
	);

	if ( selectedField.length !== 0 ) {
		selectedField = selectedField[ 0 ];
	}

	const fieldHasSubField = selectedField?.subField ?? false;
	const fieldHasHelp = selectedField?.help ?? false;

	const removeRule = () => {
		ruleSets[ ruleSetIndex ].rules = ruleSet.rules.filter(
			( value, index ) => index !== ruleIndex
		);

		setControlAtts(
			controlName,
			assign( { ...controlAtts }, { ruleSets } )
		);
	};

	const handleRuleChange = ( type, value, ruleParam ) => {
		let newValue;

		if ( type === 'select' || type === 'selectGroup' ) {
			newValue = value.value;
		} else if ( type === 'multiSelect' ) {
			newValue = [];

			if ( value.length !== 0 ) {
				value.forEach( ( v ) => {
					newValue.push( v.value );
				} );
			}
		} else {
			newValue = value;
		}

		if ( ruleParam === 'field' ) {
			ruleSet.rules[ ruleIndex ] = { field: newValue };
		} else if ( ruleParam === 'subField' && type === 'select' ) {
			// If a select field is changed, reset the corresponding operator
			// and value. Not needed for multi-select
			ruleSet.rules[ ruleIndex ][ ruleParam ] = newValue;
			delete ruleSet.rules[ ruleIndex ].operator;
			delete ruleSet.rules[ ruleIndex ].value;
		} else {
			ruleSet.rules[ ruleIndex ][ ruleParam ] = newValue;
		}

		ruleSets[ ruleSetIndex ] = ruleSet;

		setControlAtts(
			controlName,
			assign( { ...controlAtts }, { ruleSets } )
		);
	};

	const ruleLabel = () => {
		if ( ruleIndex === 0 ) {
			return sprintf(
				// Translators: Whether the block is hidden or visible.
				__( '%s the block if', 'block-visibility' ),
				hideOnRuleSets
					? __( 'Hide', 'block-visibility' )
					: __( 'Show', 'block-visibility' )
			);
		}

		return __( 'And if', 'block-visibility' );
	};

	const deleteRuleButton = (
		<Button
			label={
				ruleSet.rules.length <= 1
					? __( 'Clear Rule', 'block-visibility' )
					: __( 'Delete Rule', 'block-visibility' )
			}
			icon={ closeSmall }
			className="toolbar__delete"
			onClick={ () => removeRule() }
		/>
	);

	return (
		<div key={ ruleIndex } className="rule-sets__rule">
			<div className="rule-sets__rule--header">
				<span>{ ruleLabel( ruleIndex ) }</span>
				{ deleteRuleButton }
			</div>
			<div className="rule-sets__rule--fields">
				<div
					className={ classnames( 'fields__main-and-sub', {
						'has-sub': fieldHasSubField,
					} ) }
				>
					<Select
						className="block-visibility__react-select"
						classNamePrefix="react-select"
						options={ groupedFields }
						placeholder={ __( 'Select Rule…', 'block-visibility' ) }
						value={ selectedField }
						onChange={ ( value ) =>
							handleRuleChange( 'select', value, 'field' )
						}
					/>
					<FieldValue
						rule={ rule }
						selectedField={ selectedField }
						handleRuleChange={ handleRuleChange }
						isSubField={ true }
					/>
				</div>
				<FieldValue
					rule={ rule }
					selectedField={ selectedField }
					handleRuleChange={ handleRuleChange }
					isSubField={ false }
				/>
				{ fieldHasHelp && (
					<div className="visibility-control__help">
						{ selectedField.help }
					</div>
				) }
			</div>
		</div>
	);
}

/**
 * Renders the operator input.
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function FieldOperator( props ) {
	const { ruleOperator, selectedField, handleRuleChange } = props;
	const operators = selectedField?.operators ?? null;

	// If the selected field type does not have operators, bail.
	if ( ! operators ) {
		return null;
	}

	const selectedOperator = operators.filter(
		( operator ) => operator.value === ruleOperator
	);

	return (
		<Select
			className="block-visibility__react-select"
			classNamePrefix="react-select"
			options={ operators }
			placeholder={ __( 'Select Condition…', 'block-visibility' ) }
			value={ selectedOperator }
			onChange={ ( value ) =>
				handleRuleChange( 'select', value, 'operator' )
			}
		/>
	);
}

/**
 * Renders the sub-field and value inputs.
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function FieldValue( props ) {
	const { rule, selectedField, handleRuleChange, isSubField } = props;
	const fieldHasSubField = selectedField?.subField ? true : false;

	// The user has not selected a primary field yet, or the component displays
	// a sub-field but the given primary field does not have a sub-field.
	if ( selectedField.length === 0 || ( isSubField && ! fieldHasSubField ) ) {
		return null;
	}

	const ruleValue = rule?.value ?? '';
	const ruleSubField = rule?.subField ?? null;
	const ruleOperator = rule?.operator ?? null;
	const isConditional = selectedField?.valueType === 'conditional';

	let isDisabled = false;
	let valueType;
	let valueOptions;
	let valuePlaceholder;

	if ( isSubField ) {
		valueType = selectedField?.subField?.valueType ?? 'text';
		valueOptions = selectedField?.subField?.valueOptions ?? [];
		valuePlaceholder = selectedField?.subField?.valuePlaceholder ?? null;
	} else if ( ! isSubField && isConditional ) {
		const conditionalValues = selectedField?.conditionalValueOptions ?? [];
		const conditionalValue = conditionalValues.filter(
			( option ) => option.subFieldValue === ruleSubField
		);

		// If there is no subField set, should the value field be displayed?
		if ( ! ruleSubField ) {
			isDisabled = true;
		} else {
			isDisabled = conditionalValue[ 0 ]?.disabled;
			valueType = conditionalValue[ 0 ]?.valueType ?? 'text';
			valueOptions = conditionalValue[ 0 ]?.valueOptions ?? [];
			valuePlaceholder = conditionalValue[ 0 ]?.valuePlaceholder ?? null;
		}
	} else {
		valueType = selectedField?.valueType ?? 'text';
		valueOptions = selectedField?.valueOptions ?? [];
		valuePlaceholder = selectedField?.valuePlaceholder ?? '';
	}

	if ( ! valuePlaceholder ) {
		valuePlaceholder =
			valueType === 'number' ? '' : __( 'Select…', 'block-visibility' );
	}

	// The value field should not be displayed, so hide.
	if ( isDisabled === true ) {
		return null;
	}

	let valueField = '';

	if (
		valueType === 'select' ||
		valueType === 'selectGroup' ||
		valueType === 'multiSelect'
	) {
		let theValue = isSubField ? ruleSubField : ruleValue;
		theValue = theValue === null ? [] : theValue;

		let theSelectedValue;

		if ( valueType === 'multiSelect' ) {
			theSelectedValue = valueOptions.filter( ( field ) =>
				theValue.includes( field.value )
			);
		} else if ( valueType === 'selectGroup' ) {
			const options = [];

			valueOptions.forEach( ( group ) => {
				options.push( ...group.options );
			} );

			theSelectedValue = options.filter(
				( field ) => field.value === theValue
			);
		} else {
			theSelectedValue = valueOptions.filter(
				( field ) => field.value === theValue
			);

			if ( theSelectedValue.length !== 0 ) {
				theSelectedValue = theSelectedValue[ 0 ];
			}
		}

		valueField = (
			<Select
				className="block-visibility__react-select"
				classNamePrefix="react-select"
				options={ valueOptions }
				placeholder={ valuePlaceholder }
				value={ theSelectedValue }
				onChange={ ( value ) =>
					handleRuleChange(
						valueType,
						value,
						isSubField ? 'subField' : 'value'
					)
				}
				isMulti={ valueType === 'multiSelect' }
			/>
		);
	} else {
		valueField = (
			<TextControl
				type={ valueType }
				min={ 0 }
				value={ isSubField ? ruleSubField : ruleValue }
				placeholder={ valuePlaceholder }
				onChange={ ( value ) =>
					handleRuleChange(
						'text',
						value,
						isSubField ? 'subField' : 'value'
					)
				}
			/>
		);
	}

	// If we are rendering a sub-field, we don't need the operator field.
	if ( isSubField ) {
		return valueField;
	}

	let disableValue = false;

	// If the selected operator does not need a value, hide the field.
	if ( selectedField?.operators && ruleOperator ) {
		const selectedOperator = selectedField.operators.filter(
			( operator ) => operator.value === ruleOperator
		);
		disableValue = selectedOperator[ 0 ]?.disableValue ?? false;
	}

	return (
		<div
			className={ classnames( 'fields__operator-and-value', {
				'is-number': valueType === 'number',
			} ) }
		>
			<FieldOperator
				ruleOperator={ ruleOperator }
				selectedField={ selectedField }
				handleRuleChange={ handleRuleChange }
			/>
			{ ! disableValue && valueField }
		</div>
	);
}
