/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Notice, ExternalLink } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Helper function for printing a notice when the active block is a shortcode
 * block, which does not work with the screensize control.
 *
 * @since 1.9.0
 * @return {string}		 Return the rendered JSX
 */
export default function NoticeBlockNotCompatible() {
	return (
		<Notice status="warning" isDismissible={ false }>
			{ createInterpolateElement(
				__(
					'The Screen Size control is not compatible with the Shortcode block. For more information, and a workaround, visit the <a>Knowledge Base</a>.',
					'block-visibility'
				),
				{
					a: (
						<ExternalLink // eslint-disable-line
							href={
								'https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-screen-size-control/?bv_query=learn_more&utm_source=plugin&utm_medium=editor&utm_campaign=plugin_referrals'
							}
							target="_blank"
							rel="noreferrer"
						/>
					),
				}
			) }
		</Notice>
	);
}
