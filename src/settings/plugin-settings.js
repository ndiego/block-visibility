/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	Button,
	ExternalLink,
	PanelBody,
	PanelRow,
	Placeholder,
	ToggleControl
} from '@wordpress/components';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import SaveSettings from './save-settings';
import InformationPopover from './information-popover';

/**
 * Renders the plugin Settings tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function PluginSettings( props ) {
    const [ pluginSettings, setPluginSettings ] = useState( props.pluginSettings );
    const [ hasUpdates, setHasUpdates ] = useState( false );
    
    const { 
        handleSettingsChange,
        isAPISaving,
    } = props;
    
    function onSettingsChange() {
        handleSettingsChange( 'plugin_settings', pluginSettings );
        setHasUpdates( false );
    }
	
	function onPluginSettingChange( option, newSetting ) {
		setPluginSettings( { 
			...pluginSettings, 
			[option]: newSetting,
		} );
		setHasUpdates( true );
	}
	
	const updateButton = isAPISaving 
		? __( 'Updating...', 'block-visibility' )
		: __( 'Update', 'block-visibility' );
		
	// Manually set defaults, this ensures the main settings function properly
	const removeOnUninstall = pluginSettings?.remove_on_uninstall ?? false;
    
    return (
		<div className="bv-plugin-settings inner-container">
			<div className="bv-tab-panel__description">
				<div className="bv-tab-panel__description-header">
					<h2>{ __( 'Settings', 'block-visibility' ) }</h2>
					<span>
						<InformationPopover
							message={ __( 'NEED TO WRITE!!!!', 'block-visibility' ) }
						/>
					</span>
				</div>
				<p>
					{ __( 
						'This page allows you to confiure settings that effect the general functionality of the Block Visibility plugin. As development continues, addtional settings will be added, giving you even more control over how the plugin operates.',
						'block-visibility'
					) }
				</p>
			</div>
			<div className="bv-setting-controls">
				<span className="bv-setting-controls__title">
					{ __( 'Configure Settings', 'block-visibility' ) }
				</span>
				<SaveSettings 
					isAPISaving={ isAPISaving }
					hasUpdates={ hasUpdates }
					onSettingsChange={ onSettingsChange }
				/>
			</div>
			<div className="settings-panel">
				<div className="settings-panel__header">
					<span className="settings-panel__header-title">
						{ __( 'Uninstall', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __( 'Settings that impact what happens when the Block Visibility plugin is uninstalled.', 'block-visibility' ) }
					/>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __( 'Remove all plugin settings when it is uninstalled', 'block-visibility' ) }
						checked={ removeOnUninstall }
						onChange={ () => onPluginSettingChange( 
							'remove_on_uninstall', 
							! removeOnUninstall 
						) }
					/>
				</div>
			</div>
		</div>
    );
}
