/**
 * External dependencies
 */
import { assign, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Rule from './rule';

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

	return (
		<div className="acf-control__rule-sets">
			{ ruleSets.map( ( ruleSet, ruleSetIndex ) => {
				return (
					<div key={ ruleSetIndex } className="acf-control__rule-set">
						{ ruleSet.map( ( rule, ruleIndex ) => {
							return (
								<Rule
									key={ ruleIndex }
									rule={ rule }
									ruleIndex={ ruleIndex }
									ruleSet={ ruleSet }
									ruleSetIndex={ ruleSetIndex }
									ruleSets={ ruleSets }
									availableFields={ availableFields }
									operators={ operators }
									{ ...props }
								/>
							);
						} ) }
						<div className="acf-control__rule-set--add">
							<Button
								onClick={ () =>
									addRule( ruleSet, ruleSetIndex )
								}
								isSecondary
							>
								{ __( 'Add rule', 'block-visibility' ) }
							</Button>
						</div>
					</div>
				);
			} ) }
		</div>
	);
}
