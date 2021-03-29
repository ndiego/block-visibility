/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Notice,
	ExternalLink,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isPluginSettingEnabled } from './../../utils/setting-utilities';

/**
 * Helper function for printing a notice when all controls have been disabled
 * in the plugin settings.
 *
 * @since 1.6.0
 * @param {string} settingsUrl The url to the plugin settings
 * @return {string}		 Return the rendered JSX
 */
export function NoticeControlsDisabled( settingsUrl ) {
	return (
		<Notice status="warning" isDismissible={ false }>
			{ createInterpolateElement(
				__(
					'Looks like all Visibility Controls have been disabled. To control block visibility again, re-enable some <a>Visibility Controls</a>.',
					'block-visibility'
				),
				{
					a: (
						<a // eslint-disable-line
							href={ settingsUrl }
							target="_blank"
							rel="noreferrer"
						/>
					),
				}
			) }
		</Notice>
	);
}

/**
 * Helper function for printing a notice when all controls have been disabled
 * at the block level.
 *
 * @since 1.6.0
 * @return {string}		 Return the rendered JSX
 */
export function NoticeBlockControlsDisabled() {
	return (
		<Notice status="warning" isDismissible={ false }>
			{ __(
				'All visibility controls have been disabled for this block. Add controls using the ellipsis icon above.',
				'block-visibility'
			) }
		</Notice>
	);
}

/**
 * Helper function for printing control set tips.
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export function TipControlSet( props ) {
	const { settings, variables } = props;
	const settingsUrl = variables?.pluginVariables.settingsUrl ?? '';
	const isAdmin = variables.currentUsersRoles.includes( 'administrator' );
	const enableEditorNotices = isPluginSettingEnabled(
		settings,
		'enable_editor_notices'
	);

	return (
		<>
			<h3>{ __( 'Quick Tips', 'block-visibility' ) }</h3>
			<ol>
				<li className="tip">
					{ __(
						'Block Visibility provides various controls that allow you to restrict the visibility of the selected block. Click the ellipsis icon on the right to toggle the controls that you would like to use. A few controls have been added for you by default.',
						'block-visibility'
					) }
				</li>
				<li className="tip">
					{ __(
						"In order for the selected block to be visible, all enabled control conditions must be satisfied. Don't need a specific control? Simply toggle it off.",
						'block-visibility'
					) }
				</li>
				<li className="tip">
					{ __(
						"If a visibility control is toggled off and then re-enabled, the control's conditions will reset to their default values.",
						'block-visibility'
					) }
				</li>
				{ isAdmin && enableEditorNotices && (
					<li className="tip">
						{ createInterpolateElement(
							__(
								'As a website administrator, you can customize and restrict the available visibility controls in the <a>plugins settings</a>.',
								'block-visibility'
							),
							{
								a: (
									<a // eslint-disable-line
										href={
											settingsUrl +
											'&tab=visibility-controls'
										}
										target="_blank"
										rel="noreferrer"
									/>
								),
							}
						) }
					</li>
				) }
			</ol>
		</>
	);
}

/**
 * Helper function for printing the Query String control tips.
 *
 * @since 1.7.0
 * @return {string}		 Return the rendered JSX
 */
export function TipQueryString() {
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

/**
 * Helper function for printing the WP Fusion control tips.
 *
 * @since 1.7.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export function TipWPFusion( props ) {
	const { variables } = props;
	const isAdmin = variables.currentUsersRoles.includes( 'administrator' );
	const excludeAdmins = variables?.integrations?.wpFusion?.excludeAdmins ?? false;

	return (
		<>
			<h3>{ __( 'WP Fusion', 'block-visibility' ) }</h3>
			<p>
				{ __(
					'Configure block visibility based on WP Fusion tags. Note that the available fields depend on the User Role control settings. If the User Role control is disabled, only the Required Tags (Not) field will be available.',
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
									'https://www.blockvisibilitywp.com/knowledge-base/visibility-controls/wp-fusion/?bv_query=learn_more'
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
