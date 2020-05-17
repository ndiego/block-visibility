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


class GettingStarted extends Component {
    
    render() {
        
        const { isAPISaving } = this.props;
        
        return (
            <div className="bv-getting-started">
                Getting Started Content
                <div className="bv-getting-started-container">
                    <PanelBody
                        title="Getting Started"
                    >
                        <PanelRow>
                            Getting Started...
                        </PanelRow>
                    </PanelBody>
                </div>
            </div>
        );
    }
}

export default GettingStarted;