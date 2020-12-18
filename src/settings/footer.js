/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { Slot } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
/**
 * Internal dependencies
 */
import icons from './../utils/icons';
import { useFetch } from './../utils/data';

/**
 * Renders the footer of the Block Visibility settings pages.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Footer( props ) {
    const { pluginVariables } = props.variables;

    // Default footer links.
    const links = {
        plugin: {
            title: __( 'Block Visibility', 'block-visibility' ) + ' ' + pluginVariables.version,
            url: 'https://www.blockvisibilitywp.com/?utm_source=block_visibility&utm_medium=plugin&utm_campaign=settings_page',
            rel: 'external'
        },
        repo: {
            title: __( 'GitHub', 'block-visibility' ),
            url: 'https://github.com/ndiego/block-visibility',
        },
        review: {
            title: __( 'Review', 'block-visibility' ),
            url: pluginVariables.supportUrl + 'reviews/?filter=5',
        },
        docs: {
            title: __( 'Documentation', 'block-visibility' ),
            url: 'https://www.blockvisibilitywp.com/documentation/?utm_source=block_visibility&utm_medium=plugin&utm_campaign=settings_page',
            rel: 'external'
        },
        support: {
            title: __( 'Support', 'block-visibility' ),
            url: pluginVariables.supportUrl,
        },
    };

    applyFilters( 'blockVisibility.FooterLinks', links );

    const linkMarkup = Object.keys( links ).map( ( link ) => {
        const rel = links[ link ].rel ?? 'noreferrer';

        return (
            <a
                href={ links[ link ].url }
                className={ 'footer-links__' + link }
                target="_blank"
                rel={ rel }
            >
                { links[ link ].title }
            </a>
        );
    } );

    return (
        <div className="footer">
            <div className="inner-container">
                { linkMarkup }
            </div>
        </div>
    );
}
