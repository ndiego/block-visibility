/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DotTip } from '@wordpress/nux';
import { Icon } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import icons from './../utils/icons';

/**
 * Renders the masthead of the Block Visibility settings pages.
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Masthead( props ) {
	const { isPro, pluginVariables } = props.variables;

	// Default header links.
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
				key={ link }
				href={ links[ link ].url }
				className={ 'plugin-links__' + link }
				target="_blank" // eslint-disable-line
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
						{ icons.logo }
						<span>
							{ __( 'Block Visibility', 'block-visibility' ) }
						</span>
						{ isPro && <span className="pro-badge">Pro</span> }
					</h1>
				</div>
				<div className="masthead__plugin-links">
					{ linkMarkup }
					<DotTip
						tipId="block-visibility/leave-review"
						position="bottom left"
					>
						<div className="masthead__notice">
							<h3>
								{ __(
									'Thank you for using Block Visibility.',
									'block-visibility'
								) }
							</h3>
							<p>
								{ createInterpolateElement(
									__(
										'Should you need any assistance, simply open a ticket in the <a>support forum</a> on WordPress.org and you will recieve a followup within one business day.',
										'block-visibility'
									),
									{
										a: (
											<a // eslint-disable-line
												href={
													pluginVariables.supportUrl
												}
												target="_blank"
												rel="noreferrer"
											/>
										),
									}
								) }
							</p>
							<p>
								{ createInterpolateElement(
									__(
										'User reviews are very important for open source projects, and Block Visibility is no different. If you enjoy the plugin, please consider leaving a <a>review ★★★★★</a> on WordPress.org. Your feedback is greatly appreciated.',
										'block-visibility'
									),
									{
										a: (
											<a // eslint-disable-line
												href={
													pluginVariables.supportUrl +
													'reviews/?filter=5'
												}
												target="_blank"
												rel="noreferrer"
											/>
										),
									}
								) }
							</p>
						</div>
					</DotTip>
				</div>
			</div>
		</div>
	);
}
