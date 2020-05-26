/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
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
        
    const { isAPISaving } = props;
    
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
						{ __( 'Hide Block', 'block-visibility' ) }
					</span>
					<Button
						className={ classnames(
							'bv-save-settings__button',
							{ 'is-busy': isAPISaving },
						) }
						//onClick={ this.onSettingsChange }
						//disabled={ ! this.state.hasUpdates }
						isPrimary
					>
						{ __( 'Save Settings', 'block-visibility' ) }
					</Button>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __( 'Hide Block', 'block-visibility' ) }
						// checked=
						// onChange=
					/>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __( 'Visibility by User Role', 'block-visibility' ) }
						// checked=
						// onChange=
					/>
				</div>
			</div>
		</div>
	);
}

export default VisibilitySettings;