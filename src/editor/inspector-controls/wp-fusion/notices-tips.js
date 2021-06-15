/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Notice, ExternalLink } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Helper function for printing the WP Fusion control tips.
 *
 * @since 1.7.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function TipsWPFusion( props ) {
	const { variables } = props;
	const userRoles = variables?.current_users_roles ?? [];
	const isAdmin = userRoles.includes( 'administrator' );
	const excludeAdmins =
		variables?.integrations?.wp_fusion?.exclude_admins ?? false;

	return (
		<>
			<div className="usage">
				<p>
					{ __(
						'The WP Fusion control allows you to configure block visibility based on WP Fusion tags. Note that the available fields depend on the User Role control settings. If the User Role control is disabled, only the Required Tags (Not) field will be available.',
						'block-visibility'
					) }
				</p>
				{ isAdmin && excludeAdmins && (
					<Notice status="warning" isDismissible={ false }>
						{ __(
							'It looks like the "Exclude Administrators" setting has been enabled in the WP Fusion plugin settings. Therefore, when you preview this block while logged-in as an Administrator, the content will remain visible regardless of the WP Fusion visibility control settings.',
							'block-visibility'
						) }
					</Notice>
				) }
			</div>
			<h4>{ __( 'Required Tags (Any)', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'The block will only be shown if the user is logged-in and has at least one of the selected tags. This field is disabled if the User Role control is set to Public, Logged-out, or is disabled.',
					'block-visibility'
				) }
			</p>
			<h4>{ __( 'Required Tags (All)', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'The block will only be shown if the user is logged-in and, at a minimum, has all of the selected tags. They could have more. This field is disabled if the User Role control is set to Public, Logged-out, or is disabled.',
					'block-visibility'
				) }
			</p>
			<h4>{ __( 'Required Tags (Not)', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'The block will be hidden from logged-in users if they have at least-one of the selected tags. If the User Role control is set to Public, or is disabled, the block will still display to logged-out users. This field is disabled if the User Role control is set to Logged-out.',
					'block-visibility'
				) }
			</p>
			<div className="learn-more">
				<span>
					{ createInterpolateElement(
						__(
							'To learn more, visit the plugin <a>Knowledge Base</a>.',
							'block-visibility'
						),
						{
							a: (
								<ExternalLink // eslint-disable-line
									href={
										'https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-wp-fusion-control/?bv_query=learn_more&utm_source=plugin&utm_medium=editor&utm_campaign=plugin_referrals'
									}
									target="_blank"
									rel="noreferrer"
								/>
							),
						}
					) }
				</span>
			</div>
		</>
	);
}
