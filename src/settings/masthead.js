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
							<span className="pro-badge">Pro</span>
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
