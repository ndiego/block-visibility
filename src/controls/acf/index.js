/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, Notice, ToggleControl } from '@wordpress/components';
import { Icon, plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { getGroupedFields, getAllFields } from './fields';
import links from './../../utils/links';
import { acf as acfIcon } from './../../utils/icons';
import { InformationPopover, RuleSets } from './../../components';

/**
 * Add the ACF controls
 *
 * @since 1.8.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ACF( props ) {
	const { variables, enabledControls, controlSetAtts, setControlAtts } =
		props;
	const pluginActive = variables?.integrations?.acf?.active ?? false;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'acf' && control?.isActive
	);

	if ( ! controlActive || ! pluginActive ) {
		return null;
	}

	const fields = variables?.integrations?.acf?.fields ?? [];
	const acf = controlSetAtts?.controls?.acf ?? {};
	const hideOnRuleSets = acf?.hideOnRuleSets ?? false;
	let ruleSets = acf?.ruleSets ?? [];

	// Hande the deprecated ruleSet structue in v1.8 and lower.
	if ( ruleSets.length === 0 ) {
		ruleSets.push( {
			enable: true,
			rules: [ { field: '' } ],
		} );
	} else if ( ruleSets.length === 1 && ! ruleSets[ 0 ]?.rules ) {
		const rules = ruleSets[ 0 ];

		if ( rules.length !== 0 ) {
			rules.forEach( ( rule ) => {
				const operator = rule?.operator ?? '';

				if ( operator === '!=empty' ) {
					rule.operator = 'notEmpty';
				} else if ( operator === '==empty' ) {
					rule.operator = 'empty';
				} else if ( operator === '==' ) {
					rule.operator = 'equal';
				} else if ( operator === '!=' ) {
					rule.operator = 'notEqual';
				} else if ( operator === '==contains' ) {
					rule.operator = 'contains';
				} else if ( operator === '!=contains' ) {
					rule.operator = 'notContain';
				} else {
					rule.operator = '';
				}
			} );
		}

		ruleSets = [ { enable: true, rules } ];
	}

	const addRuleSet = () => {
		const newRuleSets = [
			...ruleSets,
			{
				enable: true,
				rules: [ { field: '' } ],
			},
		];

		setControlAtts(
			'acf',
			assign( { ...acf }, { ruleSets: [ ...newRuleSets ] } )
		);
	};

	const groupedFields = getGroupedFields( variables );
	const allFields = getAllFields( variables );

	return (
		<div className="controls-panel-item acf-control">
			<h3 className="controls-panel-item__header has-icon">
				<Icon icon={ acfIcon } />
				<span>
					{ __( 'Advanced Custom Fields', 'block-visibility' ) }
				</span>
				<InformationPopover
					message={ __(
						'The Advanced Custom Fields (ACF) control allows you to configure block visibility based on a variety of field-related rules, which form rule sets.',
						'block-visibility'
					) }
					link={ links.editorACF }
					position="bottom center"
				/>
				<div className="controls-panel-item__header-toolbar">
					<Button
						icon={ plus }
						onClick={ () => addRuleSet() }
						label={ __( 'Add rule set', 'block-visibility' ) }
						isSmall
					/>
				</div>
			</h3>
			<div className="controls-panel-item__description">
				{ sprintf(
					// Translators: Whether the block is hidden or visible.
					__(
						'%s the block if at least one rule set applies. Rules targeting user fields will fail if the current user is not logged in.',
						'block-visibility'
					),
					hideOnRuleSets
						? __( 'Hide', 'block-visibility' )
						: __( 'Show', 'block-visibility' )
				) }
			</div>
			<div className="controls-panel-item__control-fields">
				{ fields.length === 0 && (
					<Notice status="warning" isDismissible={ false }>
						{ __(
							'It does not appear that your website contains any published fields yet.',
							'block-visibility'
						) }
					</Notice>
				) }
				<div className="rule-sets">
					{ ruleSets.map( ( ruleSet, ruleSetIndex ) => {
						return (
							<RuleSets
								key={ ruleSetIndex }
								ruleSet={ ruleSet }
								ruleSetIndex={ ruleSetIndex }
								ruleSets={ ruleSets }
								groupedFields={ groupedFields }
								allFields={ allFields }
								controlName="acf"
								controlAtts={ acf }
								hideOnRuleSets={ hideOnRuleSets }
								rulePlaceholder={ __(
									'Select Field…',
									'block-visibility'
								) }
								{ ...props }
							/>
						);
					} ) }
				</div>
				<div className="control-fields-item__hide-when">
					<ToggleControl
						label={ __(
							'Hide when rules apply',
							'block-visibility'
						) }
						checked={ hideOnRuleSets }
						onChange={ () =>
							setControlAtts(
								'acf',
								assign(
									{ ...acf },
									{ hideOnRuleSets: ! hideOnRuleSets }
								)
							)
						}
					/>
				</div>
			</div>
		</div>
	);
}
