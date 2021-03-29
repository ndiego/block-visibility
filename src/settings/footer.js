/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

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
			title: __( 'Block Visibility', 'block-visibility' ) + ' ' + pluginVariables.version, // eslint-disable-line
			url: 'https://www.blockvisibilitywp.com/?bv_query=settings&utm_source=block_visibility&utm_medium=plugin&utm_campaign=settings_page', // eslint-disable-line
			rel: 'external',
		},
		docs: {
			title: __( 'Knowledge Base', 'block-visibility' ),
			url: 'https://www.blockvisibilitywp.com/knowledge-base/?bv_query=settings&utm_source=block_visibility&utm_medium=plugin&utm_campaign=settings_page', // eslint-disable-line
			rel: 'external',
		},
		support: {
			title: __( 'Support', 'block-visibility' ),
			url: pluginVariables.supportUrl,
		},
		repo: {
			title: __( 'GitHub', 'block-visibility' ),
			url: 'https://github.com/ndiego/block-visibility',
		},
		twitter: {
			title: __( 'Twitter', 'block-visibility' ),
			url: 'https://twitter.com/BlockVisibility',
		},
	};

	applyFilters( 'blockVisibility.FooterLinks', links );

	const linkMarkup = Object.keys( links ).map( ( link ) => {
		const rel = links[ link ].rel ?? 'noreferrer';

		return (
			<a // eslint-disable-line
				key={ link }
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
			<div className="inner-container">{ linkMarkup }</div>
		</div>
	);
}
