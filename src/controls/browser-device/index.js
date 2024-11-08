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
import links from './../../utils/links';
import { InformationPopover, RuleSets } from './../../components';

/**
 * Add the Browser & Device controls
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function BrowserDevice( props ) {
	const { enabledControls, controlSetAtts, setControlAtts, settings } = props;
	const controlActive = enabledControls.some(
		( control ) =>
			control.settingSlug === 'browser_device' && control?.isActive
	);

	if ( ! controlActive ) {
		return null;
	}

	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;
	const browserDevice = controlSetAtts?.controls?.browserDevice ?? {};
	const hideOnRuleSets = browserDevice?.hideOnRuleSets ?? false;
	const ruleSets = browserDevice?.ruleSets ?? [];

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
			'browserDevice',
			assign( { ...browserDevice }, { ruleSets: [ ...newRuleSets ] } )
		);
	};

	const groupedFields = getGroupedFields();
	const allFields = getAllFields();

	return (
		<div className="controls-panel-item browser-device-control">
			<h3 className="controls-panel-item__header has-icon">
				<span>{ __( 'Browser & Device', 'block-visibility' ) }</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							"The Browser & Device control allows you to configure block visibility based on the current user's browser or device.",
							'block-visibility'
						) }
						link={ links.editor.browserDevice }
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
								controlName="browserDevice"
								controlAtts={ browserDevice }
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
								'browserDevice',
								assign(
									{ ...browserDevice },
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
