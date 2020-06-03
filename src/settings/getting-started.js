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
import { Icon, cloud } from '@wordpress/icons';

/**
 * Renders the Getting Started tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function GettingStarted( props ) {
    const { isAPISaving } = props;
    
    return (
		<div className="bv-getting-started inner-container">
			<div className="bv-tab-panel__description">
				<h2>{ __( 'Getting Started', 'block-visibility' ) }</h2>
				<p>
					{ __( 
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et condimentum libero. Etiam vel pulvinar eros, tincidunt molestie est. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
						'block-visibility'
					) }
				</p>
			</div>
			<div>
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
