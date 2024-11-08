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
import { InformationPopover, RuleSets } from './../../components';
import links from './../../utils/links';
import { edd as eddIcon } from './../../utils/icons';

/**
 * Add the Easy Digital Downloads (EDD) control
 *
 * @since 3.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function EDD( props ) {
	const {
		variables,
		enabledControls,
		controlSetAtts,
		setControlAtts,
		settings,
	} = props;
	const pluginActive = variables?.integrations?.edd?.active ?? false;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'edd' && control?.isActive
	);

	if ( ! controlActive || ! pluginActive ) {
		return null;
	}

	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;
	const edd = controlSetAtts?.controls?.edd ?? {};
	const hideOnRuleSets = edd?.hideOnRuleSets ?? false;
	const ruleSets = edd?.ruleSets ?? [];

	if ( ruleSets.length === 0 ) {
		ruleSets.push( {
			enable: true,
			rules: [ { field: '' } ],
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
			'edd',
			assign( { ...edd }, { ruleSets: [ ...newRuleSets ] } )
		);
	};

	const groupedFields = getGroupedFields();
	const allFields = getAllFields();

	return (
		<div className="controls-panel-item edd-control">
			<h3 className="controls-panel-item__header has-icon">
				<Icon icon={ eddIcon } />
				<span>
					{ __( 'Easy Digital Downloads', 'block-visibility' ) }
				</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							'The Easy Digital Downloads control allows you to configure block visibility based on a variety of store-related rules.',
							'block-visibility'
						) }
						link={ links.editor.edd }
						position="bottom center"
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
							'%s the block if any rule set applies.',
							'block-visibility'
						),
						hideOnRuleSets
							? __( 'Hide', 'block-visibility' )
							: __( 'Show', 'block-visibility' )
					) }
				</div>
			) }
			<div className="controls-panel-item__control-fields">
				{ ! variables?.integrations?.edd?.products && (
					<Notice status="warning" isDismissible={ false }>
						{ __(
							'It does not appear that your store contains any published downloads.',
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
								controlName="edd"
								controlAtts={ edd }
								hideOnRuleSets={ hideOnRuleSets }
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
								'edd',
								assign(
									{ ...edd },
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
