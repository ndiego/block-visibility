/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, ExternalLink } from '@wordpress/components';

export default function Ads( props ) {
	const { variables } = props;

	if ( variables?.is_pro ) {
		return null;
	}

	return (
		<div className="ads-container">
			<div className="ads-container__pro">
				<span className="ads-container__header">
					{ __( 'Upgrade to Pro', 'block-visibility' ) }
				</span>
				<p>
					{ __(
						'Enhance the power of Block Visibility with the Pro add-on.',
						'block-visibility'
					) }
				</p>
				<ul>
					<li>{ __( 'Location control', 'block-visibility' ) }</li>
					<li>{ __( 'Advanced scheduling', 'block-visibility' ) }</li>
					<li>
						{ __( 'Referral Source control', 'block-visibility' ) }
					</li>
					<li>
						{ __( 'eCommerce integrations', 'block-visibility' ) }
					</li>
					<li>
						{ __( 'Premium email support', 'block-visibility' ) }
					</li>
					<li>{ __( 'No ads!', 'block-visibility' ) }</li>
				</ul>
				<Button
					href={
						'https://www.blockvisibilitywp.com/pro/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals'
					}
					target="__blank"
					isPrimary
				>
					{ __( 'Get Block Visibility Pro', 'block-visibility' ) } →
				</Button>
			</div>
			<div className="ads-container__support">
				<span className="ads-container__header">
					{ __( 'Need Support?', 'block-visibility' ) }
				</span>
				<p>
					{ __(
						'Whether you need help or have a new feature request, please create a topic in the support forum on WordPress.org.',
						'block-visibility'
					) }
					<ExternalLink // eslint-disable-line
						href="https://wordpress.org/support/plugin/block-visibility/"
						target="_blank"
						rel="noreferrer"
					>
						{ __( 'Support Forum', 'block-visibility' ) }
					</ExternalLink>
				</p>
				<p>
					{ __(
						'Detailed documentation is also available on the plugin website.',
						'block-visibility'
					) }
					<ExternalLink // eslint-disable-line
						href="https://www.blockvisibilitywp.com/knowledge-base/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
						target="_blank"
					>
						{ __( 'View Knowledge Base', 'block-visibility' ) }
					</ExternalLink>
				</p>
			</div>
			<div className="ads-container__reviews">
				<span className="ads-container__header">
					{ __( 'Share Your Feedback', 'block-visibility' ) }
				</span>
				<p>
					{ __(
						'If you are enjoying Block Visibility and find it useful, please consider leaving a ★★★★★ review on WordPress.org. Your feedback is greatly appreciated and helps others discover the plugin.',
						'block-visibility'
					) }
					<ExternalLink // eslint-disable-line
						href="https://wordpress.org/support/plugin/block-visibility/reviews/?filter=5"
						target="_blank"
						rel="noreferrer"
					>
						{ __( 'Submit a Review', 'block-visibility' ) }
					</ExternalLink>
				</p>
			</div>
		</div>
	);
}
