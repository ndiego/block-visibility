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
import { getGroupedFields, GetAllFields } from './fields';
import { InformationPopover, RuleSets } from './../../components';
import links from './../../utils/links';

/**
 * Add the Location controls
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function Location( props ) {
	const { controlSetAtts, enabledControls, setControlAtts, settings } = props;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'location' && control?.isActive
	);

	if ( ! controlActive ) {
		return null;
	}

	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;
	const location = controlSetAtts?.controls?.location ?? {};
	const hideOnRuleSets = location?.hideOnRuleSets ?? false;
	const ruleSets = location?.ruleSets ?? [];

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
			'location',
			assign( { ...location }, { ruleSets: [ ...newRuleSets ] } )
		);
	};

	const allFields = GetAllFields();
	const groupedFields = getGroupedFields();

	return (
		<div className="controls-panel-item location-control">
			<h3 className="controls-panel-item__header has-icon">
				<span>{ __( 'Location', 'block-visibility' ) }</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							'The Location control allows you to configure block visibility based on where the block is located on your website using various rules.',
							'block-visibility'
						) }
						link={ links.editorLocation }
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
							'%s the block if at least one rule set applies.',
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
								controlName="location"
								controlAtts={ location }
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
								'location',
								assign(
									{ ...location },
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
