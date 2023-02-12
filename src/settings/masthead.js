/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, lifesaver, institution, starFilled } from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import links from './../utils/links';
import { logo } from './../utils/icons';

/**
 * Renders the masthead of the Block Visibility settings pages.
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 */
export default function Masthead( props ) {
	const { variables } = props;

	// Default header links.
	const displayLinks = {
		review: {
			title: __( 'Review', 'block-visibility' ),
			url: links.blockVisibilityOrgReviews,
			icon: starFilled,
		},
		support: {
			title: __( 'Support', 'block-visibility' ),
			url: links.blockVisibilityOrgSupport,
			icon: lifesaver,
		},
		knowledgeBase: {
			title: __( 'Knowledge Base', 'block-visibility' ),
			url: links.settingsKnowledgeBase,
			icon: institution,
		},
	};

	applyFilters( 'blockVisibility.MastheadLinks', displayLinks );

	const linkMarkup = Object.keys( displayLinks ).map( ( link ) => {
		const rel = displayLinks[ link ].rel ?? 'noreferrer';

		return (
			<a // eslint-disable-line
				key={ link }
				href={ displayLinks[ link ].url }
				className={ 'plugin-links__' + link }
				target="_blank"
				rel={ rel }
			>
				<Icon icon={ displayLinks[ link ].icon } />
				<span>{ displayLinks[ link ].title }</span>
			</a>
		);
	} );

	return (
		<div className="masthead">
			<div className="inner-container">
				<div className="masthead__branding">
					<h1>
						{ logo }
						<span>
							{ __( 'Block Visibility', 'block-visibility' ) }
						</span>
						{ variables?.is_pro && (
							<span className="pro-badge">Pro</span>
						) }
					</h1>
				</div>
				<div className="masthead__plugin-links">{ linkMarkup }</div>
			</div>
		</div>
	);
}
