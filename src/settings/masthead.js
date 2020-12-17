/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { withFilters, Slot } from '@wordpress/components';
import { doAction } from '@wordpress/hooks';
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

	// Provides an entry point to slot in additional settings.
	const Links = withFilters(
		'blockVisibility.MastheadLinks'
	)( ( props ) =>
		<>
			<a
				href={ pluginVariables.supportUrl + 'reviews/?filter=5' }
				className="plugin-links__review"
				target="_blank"
				rel="noreferrer"
			>
				<Icon icon={ icons.star } />
				{ __( 'Review', 'block-visibility' ) }
			</a>
			<a
				href={ pluginVariables.supportUrl }
				className="plugin-links__support"
				target="_blank"
				rel="noreferrer"
			>
				<Icon icon={ icons.help } />
				{ __( 'Support', 'block-visibility' ) }
			</a>
		</>
	 );

	return (
		<div className="masthead">
			<div className="inner-container">
				<div className="masthead__branding">
					<h1>
						<span className="branding__logo">{ icons.logo }</span>
						<span className="screen-reader-text">
							{ __( 'Block Visibility', 'block-visibility' ) }
						</span>
						<span className="plugin-meta__version">
							{ variables.data.pluginVariables.version }
						</span>
						{ isPro && (
							<span>Pro</span>
						) }
					</h1>
				</div>
				<div className="masthead__plugin-meta">
					<div className="plugin-meta__plugin-links">
						<Links/>						
					</div>
				</div>
			</div>
		</div>
	);
}
