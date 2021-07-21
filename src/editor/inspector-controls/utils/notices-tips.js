/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Notice, ExternalLink } from '@wordpress/components';
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
 * @return {string} Return the rendered JSX
 */
export function NoticeBlockControlsDisabled() {
	return (
		<Notice status="warning" isDismissible={ false }>
			{ __(
				'All visibility controls have been disabled for this block. Add controls using the three dots icon above.',
				'block-visibility'
			) }
		</Notice>
	);
}

/**
 * Helper function for printing a notice when an incompatible block is selected.
 *
 * @since 2.0.0
 * @param {string} name The name of the current block
 * @return {string}          Return the rendered JSX
 */
export function NoticeIncompatibleBlock( name ) {
	// Currently only Legacy Widget block is incompatible, improve in future.
	const blockName =
		name.name === 'core/legacy-widget'
			? __( 'Legacy Widget', 'block-visibility' )
			: __( 'Current', 'block-visibility' );

	return (
		<Notice status="warning" isDismissible={ false }>
			{ sprintf(
				// Translators: The current block name.
				__(
					'The %1$s block does not support custom attributes and therefore is incompatible with Block Visibility. As a workaround, wrap the %1$s block in a Group block. Then apply the desired visibility settings to the Group block.',
					'block-visibility'
				),
				blockName
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
export function TipsControlSet( props ) {
	const { settings, variables } = props;
	const settingsUrl = variables?.plugin_variables.settings_url ?? '';
	const userRoles = variables?.current_users_roles ?? [];
	const isAdmin = userRoles.includes( 'administrator' );
	const enableEditorNotices = isPluginSettingEnabled(
		settings,
		'enable_editor_notices'
	);

	return (
		<>
			<ol>
				<li className="tip">
					{ __(
						'Block Visibility provides various controls that allow you to restrict the visibility of the selected block. Click the three dots icon on the right to toggle the controls that you would like to use. A few controls have been added for you by default.',
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
										'https://www.blockvisibilitywp.com/knowledge-base/?bv_query=learn_more&utm_source=plugin&utm_medium=editor&utm_campaign=plugin_referrals'
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
