/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import links from './../utils/links';

/**
 * Renders the footer of the Block Visibility settings pages.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 */
export default function Footer( props ) {
	const { variables } = props;
	const pluginVariables = variables?.plugin_variables ?? [];

	// Default footer links.
	const displayLinks = {
		plugin: {
			title: __( 'Block Visibility', 'block-visibility' ) + ' ' + pluginVariables.version, // eslint-disable-line
			url: links.settingsHome,
			rel: 'external',
		},
		docs: {
			title: __( 'Knowledge Base', 'block-visibility' ),
			url: links.settingsKnowledgeBase,
			rel: 'external',
		},
		support: {
			title: __( 'Support', 'block-visibility' ),
			url: links.blockVisibilityOrgSupport,
		},
		repo: {
			title: __( 'GitHub', 'block-visibility' ),
			url: links.gitHub,
		},
		twitter: {
			title: __( 'Twitter', 'block-visibility' ),
			url: links.twitter,
		},
	};

	applyFilters( 'blockVisibility.FooterLinks', displayLinks );

	const linkMarkup = Object.keys( displayLinks ).map( ( link ) => {
		const rel = displayLinks[ link ].rel ?? 'noreferrer';

		return (
			<a // eslint-disable-line
				key={ link }
				href={ displayLinks[ link ].url }
				className={ 'footer-links__' + link }
				target="_blank"
				rel={ rel }
			>
				{ displayLinks[ link ].title }
			</a>
		);
	} );

	return (
		<div className="footer">
			<div className="inner-container">{ linkMarkup }</div>
		</div>
	);
}
