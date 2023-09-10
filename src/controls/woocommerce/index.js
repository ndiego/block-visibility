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
import { woocommerce as woocommerceIcon } from './../../utils/icons';
import links from './../../utils/links';

/**
 * Add the Woocommerce controls
 *
 * @since 3.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function WooCommerce( props ) {
	const {
		variables,
		enabledControls,
		controlSetAtts,
		setControlAtts,
		settings,
	} = props;
	const pluginActive = variables?.integrations?.woocommerce?.active ?? false;
	const controlActive = enabledControls.some(
		( control ) =>
			control.settingSlug === 'woocommerce' && control?.isActive
	);

	if ( ! controlActive || ! pluginActive ) {
		return null;
	}

	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;
	const woocommerce = controlSetAtts?.controls?.woocommerce ?? {};
	const hideOnRuleSets = woocommerce?.hideOnRuleSets ?? false;
	const ruleSets = woocommerce?.ruleSets ?? [];

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
			'woocommerce',
			assign( { ...woocommerce }, { ruleSets: [ ...newRuleSets ] } )
		);
	};

	const groupedFields = getGroupedFields();
	const allFields = getAllFields();

	return (
		<div className="controls-panel-item woocommerce-control">
			<h3 className="controls-panel-item__header has-icon">
				<Icon icon={ woocommerceIcon } />
				<span>{ __( 'WooCommerce', 'block-visibility' ) }</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							'The WooCommerce control allows you to configure block visibility based on various store-related rules.',
							'block-visibility'
						) }
						link={ links.editorWoocommerce }
						position="bottom center"
					/>
				) }
				<div className="controls-panel-item__header-toolbar">
					<Button
						icon={ plus }
						onClick={ () => addRuleSet() }
						label={ __( 'Add rule set', 'block-visibility' ) }
						isSmall
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
				{ ! variables?.integrations?.woocommerce?.products && (
					<Notice
						className="no-products-notice"
						status="warning"
						isDismissible={ false }
					>
						{ __(
							'It appears that your store has no published products.',
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
								controlName="woocommerce"
								controlAtts={ woocommerce }
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
								'woocommerce',
								assign(
									{ ...woocommerce },
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
