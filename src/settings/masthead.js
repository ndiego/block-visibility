/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './../icons';

/**
 * Renders the masthead of the Block Visibility settings pages
 *
 * @since 1.0.0
 * @return {string}		 Return the rendered JSX
 */
export default function Masthead() {
	// This is a global variable added to the page via PHP
	const pluginVariables = blockVisibilityVariables; // eslint-disable-line

	return (
		<div className="masthead">
			<div className="inner-container">
				<div className="masthead__branding">
					<h1>
						<span className="branding__logo">{ icons.logo }</span>
						<span className="screen-reader-text">
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
				<div className="masthead__plugin-meta">
					<div className="plugin-meta__version">
						<span>{ pluginVariables.version }</span>
					</div>
					<div className="plugin-meta__plugin-links">
						<a
							href={ pluginVariables.reviewUrl }
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
							{ __( 'Plugin Support', 'block-visibility' ) }
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
