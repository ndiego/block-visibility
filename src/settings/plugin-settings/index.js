/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withFilters, Slot } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SaveSettings from './../utils/save-settings';
import InformationPopover from './../utils/information-popover';
import BlockEditor from './block-editor';
import UserPermissions from './user-permissions';
import FullControlMode from './full-control-mode';
import Uninstall from './uninstall';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalSettings = withFilters(
	'blockVisibility.PluginSettings'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Renders the plugin Settings tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function PluginSettings( props ) {
	const [ pluginSettings, setPluginSettings ] = useState(
		props.settings.plugin_settings
	);
	const [ hasUpdates, setHasUpdates ] = useState( false );

	const {
		handleSettingsChange,
		isAPISaving,
		hasSaveError,
		saveStatus,
	} = props;

	function onSettingsChange() {
		handleSettingsChange( 'plugin_settings', pluginSettings );
		setHasUpdates( false );
	}

	return (
		<div className="settings-tab__plugin-settings inner-container">
			<div className="setting-tabs__setting-controls">
				<div className="setting-controls__title">
					<span>
						{ __( 'General Settings', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __(
							'The settings below allow you to configure general functionality of the Block Visibility plugin. To learn more about General Settings, review the plugin documentation using the link below.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-configure-the-general-settings/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<SaveSettings
					isAPISaving={ isAPISaving }
					hasSaveError={ hasSaveError }
					saveStatus={ saveStatus }
					hasUpdates={ hasUpdates }
					onSettingsChange={ onSettingsChange }
				/>
			</div>
			<Slot name="PluginSettingsTop" />
			<BlockEditor
				pluginSettings={ pluginSettings }
				setPluginSettings={ setPluginSettings }
				setHasUpdates={ setHasUpdates }
				{ ...props }
			/>
			<UserPermissions
				pluginSettings={ pluginSettings }
				setPluginSettings={ setPluginSettings }
				setHasUpdates={ setHasUpdates }
				{ ...props }
			/>
			<Slot name="PluginSettingsMiddle" />
			<FullControlMode
				pluginSettings={ pluginSettings }
				setPluginSettings={ setPluginSettings }
				setHasUpdates={ setHasUpdates }
				{ ...props }
			/>
			<Uninstall
				pluginSettings={ pluginSettings }
				setPluginSettings={ setPluginSettings }
				setHasUpdates={ setHasUpdates }
				{ ...props }
			/>
			<Slot name="PluginSettingsBottom" />
			<AdditionalSettings
				pluginSettings={ pluginSettings }
				setPluginSettings={ setPluginSettings }
				setHasUpdates={ setHasUpdates }
				{ ...props }
			/>
		</div>
	);
}
