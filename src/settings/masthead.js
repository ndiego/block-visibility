/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Animate } from '@wordpress/components';
import { Icon, starFilled, starEmpty, search } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './../icons';

/**
 * Renders the masthead of the Block Visibility settings pages
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Masthead( props ) {
    
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
                </div>
                <div className="bv-masthead__meta">
                    <div className="plugin-version">
                        <span>
                            { 'v' + blockVisibilityVariables.version }
                        </span>
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
