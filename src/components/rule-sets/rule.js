/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import RuleField from './rule-field';

/**
 * Render the UI for each rule.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function Rule( props ) {
	const {
		rule,
		ruleIndex,
		ruleSet,
		ruleSetIndex,
		ruleSets,
		hideOnRuleSets,
		rulePlaceholder,
		ruleLabel,
		controlName,
		controlAtts,
		setControlAtts,
		groupedFields,
		allFields,
	} = props;

	let selectedRule = allFields.filter( ( v ) => v.value === rule.field );

	// If we do not have grouped fields, then the ruleField should be
	// automatically selected.
	if ( ! groupedFields ) {
		selectedRule = allFields.filter( ( v ) => v.type === 'ruleField' );
	}

	if ( selectedRule.length !== 0 ) {
		selectedRule = selectedRule[ 0 ];
	}

	const ruleFields = groupedFields ? selectedRule?.fields ?? [] : allFields;

	const hasHelp = selectedRule?.help ?? false;
	const helpPosition = selectedRule?.helpPosition ?? 'bottom';
	const hasMultipleSubFields = selectedRule?.hasMultipleSubFields ?? false;
	const hasSimplifiedLayout = selectedRule?.hasSimplifiedLayout ?? false;

	let defaultRuleLabel = ruleLabel;

	if ( ! defaultRuleLabel ) {
		defaultRuleLabel = () => {
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
	}

	const removeRule = () => {
		// Clone the current rule sets and remove the rule at the specified index.
		const updatedRuleSets = [ ...ruleSets ];

		// Filter out the rule at the given index.
		const updatedRules = ruleSet.rules.filter(
			( _value, index ) => index !== ruleIndex
		);

		// Update the rules in the specific rule set.
		updatedRuleSets[ ruleSetIndex ] = {
			...ruleSet,
			rules: updatedRules,
		};

		// Update the control attributes with the new rule sets.
		setControlAtts( controlName, {
			...controlAtts,
			ruleSets: updatedRuleSets,
		} );
	};

	const handleRuleChange = (
		value,
		valueType,
		fieldType,
		fieldName = '',
		reset = false
	) => {
		let newValue;

		if ( valueType === 'select' ) {
			newValue = value.value;
		} else if ( valueType === 'multiSelect' ) {
			newValue = value.length ? value.map( ( v ) => v.value ) : [];
		} else {
			newValue = value;
		}

		// Clone current rule sets and rules for modification.
		const updatedRuleSets = [ ...ruleSets ];
		const updatedRules = [ ...ruleSet.rules ];
		const currentRule = { ...updatedRules[ ruleIndex ] };

		// Update rule based on field type.
		if ( 'ruleField' === fieldType ) {
			updatedRules[ ruleIndex ] = groupedFields
				? { field: newValue }
				: { ...currentRule, field: newValue };
		} else if ( 'subField' === fieldType ) {
			if ( hasMultipleSubFields ) {
				updatedRules[ ruleIndex ] = {
					...currentRule,
					subFields: {
						...currentRule.subFields,
						[ fieldName ]: newValue,
					},
				};
			} else {
				updatedRules[ ruleIndex ] = {
					...currentRule,
					subField: newValue,
				};
			}

			// If a select field is changed, reset the corresponding operator and value.
			if ( reset ) {
				delete updatedRules[ ruleIndex ].value;
			}
		} else {
			// Convert field type to actual field parameter.
			const fieldParam =
				'operatorField' === fieldType ? 'operator' : 'value';
			updatedRules[ ruleIndex ] = {
				...currentRule,
				[ fieldParam ]: newValue,
			};
		}

		// Update the rule set with the modified rules.
		updatedRuleSets[ ruleSetIndex ] = { ...ruleSet, rules: updatedRules };

		// Update control attributes.
		setControlAtts( controlName, {
			...controlAtts,
			ruleSets: updatedRuleSets,
		} );
	};

	return (
		<div key={ ruleIndex } className="rule">
			<div className="rule__header">
				<span>{ defaultRuleLabel( ruleIndex ) }</span>
				{ ruleSet.rules.length > 1 && (
					<Button
						label={ __( 'Delete Rule', 'block-visibility' ) }
						icon={ closeSmall }
						onClick={ () => removeRule() }
					/>
				) }
			</div>
			<div className="rule__fields">
				<div
					className={ classnames( 'fields-container', {
						'is-simplified': hasSimplifiedLayout,
					} ) }
				>
					{ groupedFields && (
						<RuleField
							controlName={ controlName }
							rule={ rule }
							fieldId={ ruleIndex + '_ruleField_select' }
							fieldType="ruleField"
							valueType="select"
							options={ groupedFields }
							placeholder={
								rulePlaceholder ??
								__( 'Select Rule…', 'block-visibility' )
							}
							handleRuleChange={ handleRuleChange }
							hasGroupedOptions={ true }
							{ ...props }
						/>
					) }
					{ hasHelp && helpPosition === 'top' && (
						<div className="control-fields-item__help for-select-component">
							{ selectedRule.help }
						</div>
					) }
					{ ruleFields.map( ( field, fieldIndex ) => {
						let fieldValueType = field?.valueType;
						let fieldValueTypeVariant = field?.valueTypeVariant;
						let options = field?.options;
						let placeholder = field?.placeholder;
						let dependantFieldValue = '';
						const fieldId = `${ ruleIndex }${ fieldIndex }_${
							field?.type ?? 'valueField'
						}_${ fieldValueType }`;

						const conditionalValueTypes =
							field?.conditionalValueTypes;

						// If the field has conditional value types, check to
						// see which field value component should be rendered.
						if ( conditionalValueTypes ) {
							conditionalValueTypes.forEach( ( condition ) => {
								dependantFieldValue =
									rule[ condition.dependencyType ] ?? '';

								if (
									condition.dependencyValues.includes(
										dependantFieldValue
									)
								) {
									const valueTypes =
										condition?.valueTypes ?? [];
									const filteredTypes = valueTypes.filter(
										( type ) =>
											type.value === dependantFieldValue
									);
									const defaultType = valueTypes.filter(
										( type ) => type.value === 'default'
									);

									fieldValueType =
										filteredTypes[ 0 ]?.valueType ??
										defaultType[ 0 ]?.valueType;

									fieldValueTypeVariant =
										filteredTypes[ 0 ]?.valueTypeVariant ??
										fieldValueTypeVariant;
									options =
										filteredTypes[ 0 ]?.options ?? options;
									placeholder =
										filteredTypes[ 0 ]?.placeholder ??
										placeholder;
								}
							} );
						}

						const displayConditions = field?.displayConditions;

						// If the field has display conditions, check if it
						// should be displayed based on the set rule fields.
						if ( displayConditions ) {
							const acceptedConditions = [];

							displayConditions.forEach( ( condition ) => {
								let fieldValue;

								// Value of the set field the current field is
								// conditional on.
								if (
									hasMultipleSubFields &&
									condition.dependencyType === 'subField'
								) {
									const subFields = rule?.subFields ?? [];
									fieldValue =
										subFields[ condition.dependencyName ] ??
										'';
								} else {
									const fieldType =
										condition.dependencyType ===
										'operatorField'
											? 'operator'
											: 'subField';

									fieldValue = rule[ fieldType ] ?? '';
								}

								// If the conditional options are dynamic, this
								// means that they are based on a subField that
								// could have an indeterminate value.
								//
								// Otherwise, the subField has known values and
								// we just base the conditional option on the
								// set value directly.
								if (
									condition.dependencyValues === 'dynamic'
								) {
									const conditionOptions =
										condition?.options ?? [];
									const optionsFiltered =
										conditionOptions.filter(
											( option ) =>
												option.value === fieldValue
										);
									if ( optionsFiltered.length !== 0 ) {
										acceptedConditions.push( true );
									}
								} else if (
									condition.dependencyValues.includes(
										fieldValue
									)
								) {
									acceptedConditions.push( true );
								}
							} );

							// All display conditions need to pass for the field to be displayed.
							if (
								acceptedConditions.length !==
								displayConditions.length
							) {
								return null;
							}
						}

						const conditionalOptions = field?.conditionalOptions;

						// If the field has conditional value options, check to
						// see what options and placeholders should be displayed.
						if ( conditionalOptions ) {
							// Note this does not support multiple conditional
							// options. If two are true the last will be displayed.
							conditionalOptions.forEach( ( condition ) => {
								let fieldValue;

								// Value of the set field the current field is
								// conditional on.
								if (
									hasMultipleSubFields &&
									condition.dependencyType === 'subField'
								) {
									const subFields = rule?.subFields ?? [];
									fieldValue =
										subFields[ condition.dependencyName ] ??
										'';
								} else {
									fieldValue =
										rule[ condition.dependencyType ] ?? '';
								}

								// If the conditional options are dynamic, this
								// means that they are based on a subField that
								// could have an indeterminate value.
								//
								// Otherwise, the subField has known values and
								// we just base the conditional option on the
								// set value directly.
								if (
									condition.dependencyValues === 'dynamic'
								) {
									const conditionOptions =
										condition?.options ?? [];
									const defaultOptions =
										condition?.defaultOptions ?? [];

									const filteredOptions =
										conditionOptions.filter(
											( option ) =>
												option.value === fieldValue
										);

									options =
										filteredOptions[ 0 ]?.valueOptions ??
										defaultOptions;
									placeholder = condition?.placeholder ?? '';
								} else if (
									condition.dependencyValues.includes(
										fieldValue
									)
								) {
									options = condition?.options;
									placeholder = condition?.placeholder;
								}
							} );
						}

						return (
							<RuleField
								key={ fieldId }
								controlName={ controlName }
								rule={ rule }
								fieldId={ fieldId }
								fieldType={ field?.type ?? 'valueField' }
								fieldName={ field?.name ?? '' }
								valueType={ fieldValueType ?? 'text' }
								valueTypeVariant={ fieldValueTypeVariant ?? '' }
								dependantFieldValue={
									dependantFieldValue ?? ''
								}
								options={ options ?? [] }
								handleRuleChange={ handleRuleChange }
								hasGroupedFields={ !! groupedFields }
								hasGroupedOptions={
									field?.hasGroupedOptions ?? false
								}
								label={ field?.label ?? '' }
								placeholder={ placeholder ?? '' }
								help={ field?.help ?? '' }
								isLoading={ field?.isLoading }
								triggerReset={ field?.triggerReset ?? false }
								{ ...props }
							/>
						);
					} ) }
				</div>
				{ hasHelp && helpPosition === 'bottom' && (
					<div className="control-fields-item__help">
						{ selectedRule.help }
					</div>
				) }
			</div>
		</div>
	);
}
