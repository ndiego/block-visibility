/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	ExternalLink,
	PanelBody,
	PanelRow,
	Placeholder,
	ToggleControl
} from '@wordpress/components';
import { Icon } from '@wordpress/icons';
import { 
	useState, 
	useEffect,
	__experimentalCreateInterpolateElement,
	createInterpolateElement 
} from '@wordpress/element';

/**
 * Temporary solution until WP 5.5 is released with createInterpolateElement
 */
const interpolateElement = ( typeof createInterpolateElement === 'function' )
    ? createInterpolateElement 
    : __experimentalCreateInterpolateElement;

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
		hasSaveError,
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
	const enabledFullControlMode = pluginSettings?.enable_full_control_mode ?? false;
    
    return (
		<div className="bv-plugin-settings inner-container">
			<div className="bv-tab-panel__description">
				<div className="bv-tab-panel__description-header">
					<h2>{ __( 'General Settings', 'block-visibility' ) }</h2>
					<span>
						<InformationPopover
							message={ __( 'To learn more about General Settings, review the settings documentation via the link below.', 'block-visibility' ) }
							link="https://www.blockvisibilitywp.com/documentation/general-settings/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
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
					hasSaveError={ hasSaveError }
					hasUpdates={ hasUpdates }
					onSettingsChange={ onSettingsChange }
				/>
			</div>
			<div className="settings-panel">
				<div className="settings-panel__header">
					<span className="settings-panel__header-title">
						{ __( 'Full Control Mode', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __( 'By default, not all blocks are provided with visibility controls. These include child blocks and blocks that may exist in WordPress, but cannot actually be added directly to the editor. Most of the time, you will not need Full Control Mode, but it\'s there in case you do. Use with caution. Click the link below for complete details.', 'block-visibility' ) }
						link={ 'https://www.blockvisibilitywp.com/documentation/general-settings/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals' }
					/>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ interpolateElement( 
							__( 'Enable Full Control Mode to add visibility controls to <strong>every</strong> block. <a>Use with caution</a>.', 'block-visibility' ), 
							{
								strong: <strong/>,
								a: <a href='https://www.blockvisibilitywp.com/documentation/general-settings/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals' target='_blank' />,
							}
						) }
						checked={ enabledFullControlMode }
						onChange={ () => onPluginSettingChange( 
							'enable_full_control_mode', 
							! enabledFullControlMode 
						) }
					/>
				</div>
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
						label={ __( 'Remove all plugin settings when Block Visibility is uninstalled.', 'block-visibility' ) }
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
