/**
 * External dependencies
 */
import { assign } from 'lodash';
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, Disabled, TextControl } from '@wordpress/components';
import { closeSmall } from '@wordpress/icons';

export default function Rule( props ) {
	const {
		acf,
		rule,
		ruleIndex,
		ruleSet,
		ruleSetIndex,
		ruleSets,
		availableFields,
		operators,
		hideOnRuleSets,
		setControlAtts,
	} = props;

	const selectedField = availableFields.filter(
		( field ) => field.value === rule.field
	);
	const selectedOperator = operators.filter(
		( operator ) => operator.value === rule.operator
	);

	const removeRule = () => {
		ruleSets[ ruleSetIndex ] = ruleSet.filter(
			( value, index ) => index !== ruleIndex
		);

		setControlAtts( 'acf', assign( { ...acf }, { ruleSets } ) );
	};

	const handleRuleChange = ( type, value, ruleParam ) => {
		let newValue = type === 'select' ? value?.value : value;
		newValue = newValue === null ? '' : newValue;

		ruleSet[ ruleIndex ][ ruleParam ] = newValue;
		ruleSets[ ruleSetIndex ] = ruleSet;

		setControlAtts( 'acf', assign( { ...acf }, { ruleSets } ) );
	};

	let valueField = (
		<TextControl
			placeholder={ __( 'Field Value…', 'block-visibility' ) }
			value={ rule.value }
			onChange={ ( value ) => handleRuleChange( 'text', value, 'value' ) }
		/>
	);

	if ( '!=empty' === rule.operator || '==empty' === rule.operator ) {
		valueField = <Disabled>{ valueField }</Disabled>;
	}

	const ruleLabel = ( _ruleIndex ) => {
		if ( _ruleIndex === 0 ) {
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
				ruleSet.length <= 1
					? __( 'Clear Rule', 'block-visibility' )
					: __( 'Delete Rule', 'block-visibility' )
			}
			icon={ closeSmall }
			className="schedule--heading__toolbar--delete"
			onClick={ () => removeRule() }
		/>
	);

	return (
		<div key={ ruleIndex } className="acf-control__rule">
			<div className="acf-control__rule--header">
				<span>{ ruleLabel( ruleIndex ) }</span>
				{ deleteRuleButton }
			</div>
			<Select
				className="block-visibility__react-select"
				classNamePrefix="react-select"
				options={ availableFields }
				placeholder={ __( 'Select Field…', 'block-visibility' ) }
				value={ selectedField }
				onChange={ ( value ) =>
					handleRuleChange( 'select', value, 'field' )
				}
				isClearable={ true }
			/>
			<Select
				className="block-visibility__react-select"
				classNamePrefix="react-select"
				options={ operators }
				value={ selectedOperator }
				onChange={ ( value ) =>
					handleRuleChange( 'select', value, 'operator' )
				}
			/>
			{ valueField }
		</div>
	);
}
