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
import icons from './../icons';


function VisibilityControls( props ) {
	
	const [ visibilityControls, setVisibilityControls ] = useState( props.visibilityControls );
	const [ hasUpdates, setHasUpdates ] = useState( false );
    
	console.log( visibilityControls );
	
	const { 
		handleSettingsChange,
		isAPISaving,
	} = props;
	
	function onSettingsChange() {
		handleSettingsChange( 'visibility_controls', visibilityControls );
		setHasUpdates( false );
	}
	
	function onVisibilityControlChange( option, subOption, newSetting ) {
		setVisibilityControls( { 
			...visibilityControls, 
			[option]: {
				...visibilityControls[option],
				[subOption]: newSetting,
			}
		} );
		setHasUpdates( true );
	}

	const updateButton = isAPISaving 
		? __( 'Updating...', 'block-visibility' )
		: __( 'Update', 'block-visibility' );
		
	// Manually set defaults, this ensures the main settings function properly
	const hideBlockEnable = visibilityControls?.hide_block?.enable ?? true;
	const visibilityByRoleEnable = visibilityControls?.visibility_by_role?.enable ?? true;
	const visibilityByRoleEnableUseRoles = visibilityControls?.visibility_by_role?.enable_user_roles ?? true;
    
    return (
		<div className="bv-visibility-controls inner-container">
			<div className="bv-tab-panel__description">
				<h2>{ __( 'Visibility Controls', 'block-visibility' ) }</h2>
				<p>
					{ __( 
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et condimentum libero. Etiam vel pulvinar eros, tincidunt molestie est. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
						'block-visibility'
					) }
				</p>
			</div>
			<div className="bv-setting-controls">
				<span>
					{ __( 'Enabled Functionality', 'block-visibility' ) }
				</span>
				<SaveSettings 
					isAPISaving={ isAPISaving }
					hasUpdates={ hasUpdates }
					onSettingsChange={ onSettingsChange }
				/>
			</div>
			<div className="settings-panel">
				<div className="settings-panel__header">
					<span>
						{ __( 'Hide Block', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __( 'This is a popover test', 'block-visibility' ) }
					/>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __( 'Enable the option to hide blocks completely from the frontend of your website', 'block-visibility' ) }
						checked={ hideBlockEnable }
						onChange={ () => onVisibilityControlChange( 
							'hide_block', 
							'enable', 
							! hideBlockEnable 
						) }
					/>
				</div>
				<div className="settings-panel__header">
					<span>
						{ __( 'Visibility by User Role', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __( 'This is a popover test for visibility by role', 'block-visibility' ) }
					/>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __( 'Enable to option to restrict block visibility by whether a user is logged-in or logged-out', 'block-visibility' ) }
						checked={ visibilityByRoleEnable }
						onChange={ () => onVisibilityControlChange( 
							'visibility_by_role', 
							'enable', 
							! visibilityByRoleEnable 
						) }
					/>
					<ToggleControl
						label={ __( 'Enable Restriction by User Role', 'block-visibility' ) }
						checked={ visibilityByRoleEnableUseRoles }
						onChange={ () => onVisibilityControlChange( 
							'visibility_by_role', 
							'enable_user_roles', 
							! visibilityByRoleEnableUseRoles
						) }
					/>
				</div>
			</div>
		</div>
	);
}

export default VisibilityControls;