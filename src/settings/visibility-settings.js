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


class VisibilitySettings extends Component {
    
    render() {
        
        const { isAPISaving } = this.props;
        
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
			</div>
        );
    }
}

export default VisibilitySettings;