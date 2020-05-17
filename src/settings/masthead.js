/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { Animate } from '@wordpress/components';
import { Icon, starFilled, starEmpty, search } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './../icons';


class Masthead extends Component {
    
    render() {
        
        const { isAPISaving } = this.props;
        
        return (
            <div className="bv-masthead">
                <div className="inner-container">
                    <div className="bv-masthead__branding">
                        <h1>
                            { __( 'Block Visibility', 'block-visibility' ) }
                        </h1>
                        <p>
                            { __( 
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et condimentum libero. Etiam vel pulvinar eros, tincidunt molestie est. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                                'block-visibility'
                            ) }
                        </p>
                        <span className="plugin-version">{ 'v' + blockVisibilityVariables.version }</span>
                    </div>
                    <div className="bv-masthead__meta">
                        <div className="saving-notices">
                            <Icon icon={ search } />
                            { isAPISaving && (
                                <Animate type="loading">
                                    { ( { className: animateClassName } ) => (
                                        <span className={ animateClassName }>
                                            <Icon icon={ icons.cloud } />
                                            { __( 'Saving', 'block-visibility' ) }
                                        </span>
                                    ) }
                                </Animate>
                            ) }
                        </div>
                        <div className="plugin-links">
                            <a
                                src={ blockVisibilityVariables.reviewUrl }
                                className="plugin-review"
                                target="_blank"
                            >
                                <Icon icon={ starFilled } />
                                { __( 'Review', 'block-visibility' ) }
                            </a>
                            <a
                                src={ blockVisibilityVariables.supportUrl }
                                className="plugin-support"
                                target="_blank"
                            >
                                <Icon icon={ icons.help } />
                                { __( 'Support', 'block-visibility' ) }
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Masthead;