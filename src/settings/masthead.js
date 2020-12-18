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
 * Renders the masthead of the Block Visibility settings pages
 *
 * @since 1.0.0
 * @return {string}		 Return the rendered JSX
 */
export default function Masthead() {
	// This is a global variable added to the page via PHP
	//const pluginVariables = blockVisibilityVariables; // eslint-disable-line

	const variables = useFetch( 'variables' );

	if ( variables.status != 'fetched' ) {
		return null;
	}

	const { isPro, pluginVariables } = variables.data;

	console.log( variables );

	const links = {
		review: {
			title: __( 'Review', 'block-visibility' ),
			url: pluginVariables.supportUrl + 'reviews/?filter=5',
			icon: 'star',
		},
		support: {
			title: __( 'Support', 'block-visibility' ),
			url: pluginVariables.supportUrl,
			icon: 'help',
		},
	};

	applyFilters( 'blockVisibility.MastheadLinks', links );

	const linkMarkup = Object.keys( links ).map( ( link ) => {
		const rel = links[ link ].rel ?? 'noreferrer';

		return (
			<a
				href={ links[ link ].url }
				className={ 'plugin-links__' + link }
				target="_blank"
				rel={ rel }
			>
				<Icon icon={ icons[ links[ link ].icon ] } />
				{ links[ link ].title }
			</a>
		);
	} );

	return (
		<div className="masthead">
			<div className="inner-container">
				<div className="masthead__branding">
					<h1>
						<span className="branding__logo">{ icons.logo }</span>
						<span className="screen-reader-text">
							{ __( 'Block Visibility', 'block-visibility' ) }
						</span>
						{ isPro && (
							<span>Pro</span>
						) }
					</h1>
				</div>
				<div className="masthead__plugin-meta">
					<div className="plugin-meta__plugin-links">
						{ linkMarkup }
					</div>
				</div>
			</div>
		</div>
	);
}
