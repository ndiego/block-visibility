/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ExternalLink, Flex, FlexBlock, FlexItem } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Helper function for printing the Query String control tips.
 *
 * @since 1.7.0
 * @return {string}		 Return the rendered JSX
 */
export default function TipsQueryString() {
	return (
		<>
			<div className="usage">
				<p>
					{ __(
						'The Query String control allows you to configure block visibility based on URL query strings. In order for this control to work properly, only add one query string per line in each textbox. The following three formats are accepted.',
						'block-visibility'
					) }
				</p>
				<div className="flex-table">
					<Flex>
						<FlexItem>
							<code>param=value</code>
						</FlexItem>
						<FlexBlock>
							{ __(
								'Query parameter with a specific value.',
								'block-visibility'
							) }
						</FlexBlock>
					</Flex>
					<Flex>
						<FlexItem>
							<code>param=*</code>
						</FlexItem>
						<FlexBlock>
							{ __(
								'Query parameter with a wildcard value. (i.e. the value could be anything)',
								'block-visibility'
							) }
						</FlexBlock>
					</Flex>
					<Flex>
						<FlexItem>
							<code>param</code>
						</FlexItem>
						<FlexBlock>
							{ __(
								'Query parameter with no value. Operates the same as a wildcard value.',
								'block-visibility'
							) }
						</FlexBlock>
					</Flex>
				</div>
			</div>
			<h4>{ __( 'Required Queries (Any)', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'The block will only be shown if the URL has at least one of the provided query strings.',
					'block-visibility'
				) }
			</p>
			<h4>{ __( 'Required Queries (All)', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'The block will only be shown if the URL, at a minimum, has all of the provided query strings. It could have more.',
					'block-visibility'
				) }
			</p>
			<h4>{ __( 'Required Queries (Not)', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'The block will be hidden whenever at least one of the provided query strings is present in the URL. The "Not" queries take precedent over all other queries.',
					'block-visibility'
				) }
			</p>
			<div className="learn-more">
				<span>
					{ createInterpolateElement(
						__(
							'To learn more, visit the plugin <a>Knowledge Base</a>',
							'block-visibility'
						),
						{
							a: (
								<ExternalLink // eslint-disable-line
									href={
										'https://www.blockvisibilitywp.com/knowledge-base/visibility-controls/query-string/?bv_query=learn_more'
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
