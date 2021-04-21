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
export default function TipQueryString() {
	return (
		<>
			<h3>{ __( 'Query String', 'block-visibility' ) }</h3>
			<p>
				{ __(
					'Configure block visibility based on URL query strings.',
					'block-visibility'
				) }
			</p>
			<div className="usage">
				<h4>{ __( 'Usage', 'block-visibility' ) }</h4>
				<p>
					{ __(
						'In order for the Query String control to work properly, only add one query string per line in each textbox. The following three formats are accepted.',
						'block-visibility'
					) }
				</p>
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
			<h4>{ __( 'Required Queries (Any)', 'block-visibility' ) }</h4>
			<p>
				{ __(
					'The block will only be shown if if the URL has at least one of the provided query strings.',
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
			<p className="learn-more">
				{ createInterpolateElement(
					__(
						'To learn more, visit the plugin <a>Knowledge Base</a>.',
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
			</p>
		</>
	);
}
