/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';

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
	const { variables } = props;

	const isPro = variables?.is_pro ?? false;
	const pluginVariables = variables?.plugin_variables ?? [];

	// Default header links.
	const links = {
		review: {
			title: __( 'Review', 'block-visibility' ),
			url: pluginVariables.support_url + 'reviews/?filter=5',
			icon: 'star',
		},
		support: {
			title: __( 'Support', 'block-visibility' ),
			url: pluginVariables.support_url,
			icon: 'support',
		},
		knowledgeBase: {
			title: __( 'Knowledge Base', 'block-visibility' ),
			url:
				'https://www.blockvisibilitywp.com/knowledge-base/?bv_query=knowledge_base&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals',
			icon: 'school',
		},
	};

	applyFilters( 'blockVisibility.MastheadLinks', links );

	const linkMarkup = Object.keys( links ).map( ( link ) => {
		const rel = links[ link ].rel ?? 'noreferrer';

		return (
			<a // eslint-disable-line
				key={ link }
				href={ links[ link ].url }
				className={ 'plugin-links__' + link }
				target="_blank"
				rel={ rel }
			>
				<Icon icon={ icons[ links[ link ].icon ] } />
				<span>{ links[ link ].title }</span>
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
				<div className="masthead__plugin-links">{ linkMarkup }</div>
			</div>
		</div>
	);
}
