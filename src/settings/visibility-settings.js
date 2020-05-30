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
import { Icon, cloud } from '@wordpress/icons';


function VisibilitySettings( props ) {
	
	const [ visibilitySettings, setVisibilitySettings ] = useState( props.visibilitySettings );
	const [ hasUpdates, setHasUpdates ] = useState( false );
    
	console.log( visibilitySettings );
	
	const { 
		handleSettingsChange,
		isAPISaving,
	} = props;
	
	function onSettingsChange() {
		handleSettingsChange( 'visibility_settings', visibilitySettings );
		setHasUpdates( false );
	}
	
	function onVisibilitySettingChange( option, subOption, newSetting ) {
		setVisibilitySettings( { 
			...visibilitySettings, 
			[option]: {
				...visibilitySettings[option],
				[subOption]: newSetting,
			}
		} )	
	}

	
	const updateButton = isAPISaving 
		? __( 'Updating...', 'block-visibility' )
		: __( 'Update', 'block-visibility' );
    
    return (
		<div className="bv-visibility-settings inner-container">
			<div className="bv-tab-panel__description">
				<h2>{ __( 'Visibility Settings', 'block-visibility' ) }</h2>
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
						//disabled={ ! hasUpdates }
						isPrimary
					>
						{ updateButton }
					</Button>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __( 'Hide Block', 'block-visibility' ) }
						checked={ visibilitySettings.hide_block.enable }
						onChange={ () => onVisibilitySettingChange( 
							'hide_block', 
							'enable', 
							! visibilitySettings.hide_block.enable 
						) }
					/>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __( 'Visibility by User Role', 'block-visibility' ) }
						checked={ visibilitySettings.visibility_by_role.enable }
						onChange={ () => onVisibilitySettingChange( 
							'visibility_by_role', 
							'enable', 
							! visibilitySettings.visibility_by_role.enable 
						) }
					/>
					<ToggleControl
						label={ __( 'Enable Restriction by User Role', 'block-visibility' ) }
						checked={ visibilitySettings.visibility_by_role.enable_user_roles }
						onChange={ () => onVisibilitySettingChange( 
							'visibility_by_role', 
							'enable_user_roles', 
							! visibilitySettings.visibility_by_role.enable_user_roles 
						) }
					/>
				</div>
			</div>
		</div>
	);
}

export default VisibilitySettings;