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
                        <span class="bv-logo">
                            { icons.logo }
                        </span>
                        <span class="screen-reader-text">
                            { __( 'Block Visibility', 'block-visibility' ) }
                        </span>
                    </h1>
                    <p>
                        { __( 
                            'Block-based visibility control for the WordPress editor. Allows you to dynamically control which blocks are visible on your website and who can see them. Compatible with all blocks.',
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
                            href={ blockVisibilityVariables.reviewUrl }
                            className="plugin-review"
                            target="_blank"
                        >
                            <Icon icon={ starFilled } />
                            { __( 'Review', 'block-visibility' ) }
                        </a>
                        <a
                            href={ blockVisibilityVariables.supportUrl }
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
