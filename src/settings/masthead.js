/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, starFilled } from '@wordpress/icons';

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
		<div className="bv-masthead">
			<div className="inner-container">
				<div className="bv-masthead__branding">
					<h1>
						<span className="bv-logo">{ icons.logo }</span>
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
				<div className="bv-masthead__meta">
					<div className="plugin-version">
						<span>{ 'v' + pluginVariables.version }</span>
					</div>
					<div className="plugin-links">
						<a
							href={ pluginVariables.reviewUrl }
							className="plugin-review"
							target="_blank"
							rel="noreferrer"
						>
							<Icon icon={ starFilled } />
							{ __( 'Review', 'block-visibility' ) }
						</a>
						<a
							href={ pluginVariables.supportUrl }
							className="plugin-support"
							target="_blank"
							rel="noreferrer"
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
