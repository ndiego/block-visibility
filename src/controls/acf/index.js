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
 */
export default function ACF( props ) {
	const {
		controlSetAtts,
		enabledControls,
		setControlAtts,
		settings,
		variables,
	} = props;
	const pluginActive = variables?.integrations?.acf?.active ?? false;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'acf' && control?.isActive
	);

	if ( ! controlActive || ! pluginActive ) {
		return null;
	}

	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;
	const fields = variables?.integrations?.acf?.fields ?? [];
	const acf = controlSetAtts?.controls?.acf ?? {};
	const hideOnRuleSets = acf?.hideOnRuleSets ?? false;
	const ruleSets = acf?.ruleSets ?? [];

	if ( ruleSets.length === 0 ) {
		ruleSets.push( {
			enable: true,
			rules: [ { field: '' } ],
		} );
	} else {
		// Handle the new functionality in v3.3 for field evaluation.
		ruleSets.forEach( function ( set ) {
			set.rules.forEach( function ( rule ) {
				if ( rule.subField === 'true' ) {
					rule.subField = 'user';
				} else if (
					! rule.hasOwnProperty( 'subField' ) ||
					rule.subField === 'false'
				) {
					rule.subField = 'post';
				}
				// If subField is neither 'true' nor 'false', its value is retained.
			} );
		} );
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
				{ enableNotices && (
					<InformationPopover
						message={ __(
							'The Advanced Custom Fields (ACF) control allows you to configure block visibility based on various field-related rules, which form rule sets.',
							'block-visibility'
						) }
						link={ links.editor.acf }
						position="bottom right"
					/>
				) }
				<div className="controls-panel-item__header-toolbar">
					<Button
						icon={ plus }
						onClick={ () => addRuleSet() }
						label={ __( 'Add rule set', 'block-visibility' ) }
						size="small"
					/>
				</div>
			</h3>
			{ enableNotices && (
				<div className="controls-panel-item__description">
					{ sprintf(
						// Translators: Whether the block is hidden or visible.
						__(
							'%s the block if at least one rule set applies. Rules associated with users will fail if the current user is not logged in.',
							'block-visibility'
						),
						hideOnRuleSets
							? __( 'Hide', 'block-visibility' )
							: __( 'Show', 'block-visibility' )
					) }
				</div>
			) }
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
