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
				<h2>{ __( 'Settings', 'block-visibility' ) }</h2>
				<p>
					{ __( 
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et condimentum libero. Etiam vel pulvinar eros, tincidunt molestie est. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
						'block-visibility'
					) }
				</p>
			</div>
			<div className="settings-panel">
				<div className="settings-panel__header">
					<span>
						{ __( 'Enabled Functionality', 'block-visibility' ) }
					</span>
					<Button
						className={ classnames(
							'bv-save-settings__button',
							{ 'is-busy': isAPISaving },
						) }
						onClick={ onSettingsChange }
						disabled={ ! hasUpdates }
						isPrimary
					>
						{ updateButton }
					</Button>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __( 'Remove plugin settings on uninstall', 'block-visibility' ) }
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
