/**
 * External dependencies
 */
import { assign, isEmpty } from 'lodash';
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Disabled, TextControl } from '@wordpress/components';

/**
 * Handles the ACF rule sets.
 *
 * @since 1.8.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function RuleSets( props ) {
	const { acf, variables, setControlAtts } = props;
	const retrievedFields = variables?.integrations?.acf?.fields ?? [];
	const availableFields = [];

	if ( retrievedFields.length !== 0 ) {
		retrievedFields.forEach( ( group ) => {
			const groupKey = group?.key ?? '';
			const groupTitle = group?.title ?? '';
			const groupFields = group?.fields ?? {};

			availableFields.push( {
				value: groupKey,
				label: groupTitle,
				type: 'group',
				isDisabled: true,
			} );

			if ( ! isEmpty( groupFields ) ) {
				group.fields.forEach( ( field ) => {
					const fieldKey = field?.key ?? '';
					const fieldLabel = field?.label ?? '';
					const fieldType = field?.type ?? '';

					availableFields.push( {
						value: fieldKey,
						label: fieldLabel,
						type: fieldType,
						group: groupKey,
					} );
				} );
			}
		} );
	}

	const ruleSets = acf?.ruleSets ?? [
		[
			{
				field: '',
				operator: '!=empty',
				value: '',
			},
		],
	];

	const operators = [
		{
			value: '!=empty',
			label: __( 'Has any value', 'block-visibility' ),
		},
		{
			value: '==empty',
			label: __( 'Has no value', 'block-visibility' ),
		},
		{
			value: '==',
			label: __( 'Value is equal to', 'block-visibility' ),
		},
		{
			value: '!=',
			label: __( 'Value is not equal to', 'block-visibility' ),
		},
		{
			value: '==contains',
			label: __( 'Value contains', 'block-visibility' ),
		},
		{
			value: '!=contains',
			label: __( 'Value does not contain', 'block-visibility' ),
		},
	];

	const addRule = ( ruleSet, ruleSetIndex ) => {
		ruleSet.push( {
			field: '',
			operator: '!=empty',
			value: '',
		} );

		ruleSets[ ruleSetIndex ] = ruleSet;

		setControlAtts( 'acf', assign( { ...acf }, { ruleSets } ) );
	};

	const removeRule = ( ruleSet, ruleSetIndex, ruleIndex ) => {
		ruleSets[ ruleSetIndex ] = ruleSet.filter(
			( value, index ) => index !== ruleIndex
		);

		setControlAtts( 'acf', assign( { ...acf }, { ruleSets } ) );
	};

	const handleRuleChange = (
		type,
		value,
		ruleParam,
		ruleSet,
		ruleSetIndex,
		ruleIndex
	) => {
		let newValue = type === 'select' ? value?.value : value;
		newValue = newValue === null ? '' : newValue;

		ruleSet[ ruleIndex ][ ruleParam ] = newValue;
		ruleSets[ ruleSetIndex ] = ruleSet;

		setControlAtts( 'acf', assign( { ...acf }, { ruleSets } ) );
	};

	return (
		<div className="acf-control__rule-sets">
			{ ruleSets.map( ( ruleSet, ruleSetIndex ) => {
				return (
					<div key={ ruleSetIndex } className="acf-control__rule-set">
						{ ruleSet.map( ( rule, ruleIndex ) => {
							const selectedField = availableFields.filter(
								( field ) => field.value === rule.field
							);
							const selectedOperator = operators.filter(
								( operator ) => operator.value === rule.operator
							);

							let valueField = (
								<TextControl
									placeholder={ __(
										'Field Value…',
										'block-visibility'
									) }
									value={ rule.value }
									onChange={ ( value ) =>
										handleRuleChange(
											'text',
											value,
											'value',
											ruleSet,
											ruleSetIndex,
											ruleIndex
										)
									}
								/>
							);

							if (
								'!=empty' === rule.operator ||
								'==empty' === rule.operator
							) {
								valueField = (
									<Disabled>{ valueField }</Disabled>
								);
							}

							return (
								<div
									key={ ruleIndex }
									className="acf-control__rule"
								>
									<Select
										className="block-visibility__react-select"
										classNamePrefix="react-select"
										options={ availableFields }
										placeholder={ __(
											'Select Field…',
											'block-visibility'
										) }
										value={ selectedField }
										onChange={ ( value ) =>
											handleRuleChange(
												'select',
												value,
												'field',
												ruleSet,
												ruleSetIndex,
												ruleIndex
											)
										}
										isClearable={ true }
									/>
									<Select
										className="block-visibility__react-select"
										classNamePrefix="react-select"
										options={ operators }
										value={ selectedOperator }
										onChange={ ( value ) =>
											handleRuleChange(
												'select',
												value,
												'operator',
												ruleSet,
												ruleSetIndex,
												ruleIndex
											)
										}
									/>
									{ valueField }
									<div className="acf-control__rule--controls">
										<Button
											onClick={ () =>
												addRule( ruleSet, ruleSetIndex )
											}
											isSecondary
										>
											AND
										</Button>
										{ ruleIndex !== 0 && (
											<Button
												onClick={ () =>
													removeRule(
														ruleSet,
														ruleSetIndex,
														ruleIndex
													)
												}
												isTertiary
												isDestructive
											>
												Remove
											</Button>
										) }
									</div>
								</div>
							);
						} ) }
					</div>
				);
			} ) }
		</div>
	);
}
