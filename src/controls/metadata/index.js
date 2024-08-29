/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, ToggleControl } from '@wordpress/components';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { getGroupedFields, getAllFields } from './fields';
import { InformationPopover, RuleSets } from './../../components';
import links from './../../utils/links';

/**
 * Add the Metadata controls
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function Metadata( props ) {
	const { enabledControls, controlSetAtts, setControlAtts, settings } = props;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'metadata' && control?.isActive
	);

	if ( ! controlActive ) {
		return null;
	}

	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;
	const metadata = controlSetAtts?.controls?.metadata ?? {};
	const hideOnRuleSets = metadata?.hideOnRuleSets ?? false;
	const ruleSets = metadata?.ruleSets ?? [];

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
			'metadata',
			assign( { ...metadata }, { ruleSets: [ ...newRuleSets ] } )
		);
	};

	const groupedFields = getGroupedFields();
	const allFields = getAllFields();

	return (
		<div className="controls-panel-item metadata-control">
			<h3 className="controls-panel-item__header has-icon">
				<span>{ __( 'Metadata', 'block-visibility' ) }</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							'The Metadata control allows you to configure block visibility based on post or user metadata.',
							'block-visibility'
						) }
						link={ links.editorMetadata }
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
							'%s the block if at least one rule set applies. Rules targeting user metadata will fail if the current user is not logged in.',
							'block-visibility'
						),
						hideOnRuleSets
							? __( 'Hide', 'block-visibility' )
							: __( 'Show', 'block-visibility' )
					) }
				</div>
			) }
			<div className="controls-panel-item__control-fields">
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
								controlName="metadata"
								controlAtts={ metadata }
								hideOnRuleSets={ hideOnRuleSets }
								rulePlaceholder={ __(
									'Select Metadata Type…',
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
								'metadata',
								assign(
									{ ...metadata },
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
