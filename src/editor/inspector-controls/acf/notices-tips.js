/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ExternalLink } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Helper function for printing the Advanced Custom Fields control tips.
 *
 * @since 1.0.0
 * @return {string} Return the rendered JSX
 */
export default function Tips() {
	return (
		<>
			<div className="usage">
				<p>
					{ __(
						'The Advanced Custom Fields (ACF) control allows you configure block visibility based on a variety of field-related rules, which form rule sets. A complete overview is available in the plugin Knowledge Base.',
						'block-visibility'
					) }
				</p>
			</div>
			<h4>{ __( 'Rules & Rule Sets', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'All rules within a rule set must be satisfied for the selected block to be visible. However, you can also create multiple rule sets. Only one rule set needs to apply for the block to be visible.',
					'block-visibility'
				) }
			</p>
			<h4>{ __( 'Rule Errors', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'There are instances when rule errors can occur. For example, if rule inputs are not completely filled out, or if a rule is based on an ACF field that has since been deleted from your website. In these situations, the plugin defaults to showing the block.',
					'block-visibility'
				) }
			</p>
			<h4>{ __( 'User Fields', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'By default, rules evaluate ACF fields attached to the current post, page, or custom post type. Alternatively, you can evaulate fields attached to the current logged-in user.',
					'block-visibility'
				) }
			</p>
			<h4>{ __( 'WordPress Preview', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'Blocks using the ACF control do not always display as you would expect in the WordPress “preview”. At the top of the editor, there is a preview button that will open the page/post in a new window. It is not (currently) possible to accurately fetch ACF fields on a “preview” page and therefore the ACF visibility conditions may appear to not be working. But don’t worry, if you view the actual page on the frontend of your site, all block conditions will function as you expect.',
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
										'https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-advanced-custom-fields-control/?bv_query=learn_more&utm_source=plugin&utm_medium=editor&utm_campaign=plugin_referrals'
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
