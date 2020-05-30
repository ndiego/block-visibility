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
						label={ __( 'Hide Block', 'block-visibility' ) }
						checked={ hideBlockEnable }
						onChange={ () => onVisibilityControlChange( 
							'hide_block', 
							'enable', 
							! hideBlockEnable 
						) }
					/>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __( 'Visibility by User Role', 'block-visibility' ) }
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