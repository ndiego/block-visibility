/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	ExternalLink,
	Disabled,
	withFilters,
} from '@wordpress/components';
import {
	useState,
	__experimentalCreateInterpolateElement,
	createInterpolateElement,
} from '@wordpress/element';

/**
 * Temporary solution until WP 5.5 is released with createInterpolateElement
 */
const interpolateElement =
	typeof createInterpolateElement === 'function'
		? createInterpolateElement
		: __experimentalCreateInterpolateElement;

/**
 * Internal dependencies
 */
import SaveSettings from './../utils/save-settings';
import InformationPopover from './../utils/information-popover';
import EnabledUserRoles from './enabled-user-roles';

/**
 * Renders the plugin Settings tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function PluginSettings( props ) {
	const [ pluginSettings, setPluginSettings ] = useState(
		props.pluginSettings
	);
	const [ hasUpdates, setHasUpdates ] = useState( false );
	const { handleSettingsChange, isAPISaving, hasSaveError } = props;

	function onSettingsChange() {
		handleSettingsChange( 'plugin_settings', pluginSettings );
		setHasUpdates( false );
	}

	function onPluginSettingChange( option, newSetting ) {
		setPluginSettings( {
			...pluginSettings,
			[ option ]: newSetting,
		} );
		setHasUpdates( true );
	}

	// Manually set defaults, this ensures the main settings function properly
	const enableContextualIndicators = pluginSettings?.enable_contextual_indicators ?? true; // eslint-disable-line
	const enableToolbarControls = pluginSettings?.enable_toolbar_controls ?? true; // eslint-disable-line
	const enableUserRoleRestrictions = pluginSettings?.enable_user_role_restrictions ?? false; // eslint-disable-line
	const enabledUserRoles = pluginSettings?.enabled_user_roles ?? []; // eslint-disable-line
	const removeOnUninstall = pluginSettings?.remove_on_uninstall ?? false; // eslint-disable-line
	const enableFullControlMode = pluginSettings?.enable_full_control_mode ?? false; // eslint-disable-line

	const roles = [ 'editor', 'author', 'contributor' ];

	// TODO perhaps move this logic to its own component.
	let userRolesElement = (
		<EnabledUserRoles
			roles={ roles }
			enabledUserRoles={ enabledUserRoles }
			onPluginSettingChange={ onPluginSettingChange }
		/>
	);

	if ( ! enableUserRoleRestrictions ) {
		userRolesElement = <Disabled>{ userRolesElement }</Disabled>;
	}

	return (
		<div className="settings-tab__plugin-settings inner-container">
			<div className="setting-tabs__tab-description">
				<div className="tab-description__header">
					<h2>{ __( 'General Settings', 'block-visibility' ) }</h2>
					<span>
						<InformationPopover
							message={ __(
								'To learn more about General Settings, review the plugin documentation using the link below.',
								'block-visibility'
							) }
							link="https://www.blockvisibilitywp.com/documentation/general-settings/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
						/>
					</span>
				</div>
				<p>
					{ __(
						'This page allows you to confiure settings that affect the general functionality of the Block Visibility plugin. As development continues, addtional settings will be added, giving you even more control over how the plugin operates.',
						'block-visibility'
					) }
				</p>
			</div>
			<div className="setting-tabs__setting-controls">
				<span className="setting-controls__title">
					{ __( 'Configure Settings', 'block-visibility' ) }
				</span>
				<SaveSettings
					isAPISaving={ isAPISaving }
					hasSaveError={ hasSaveError }
					hasUpdates={ hasUpdates }
					onSettingsChange={ onSettingsChange }
				/>
			</div>
			<div className="setting-tabs__settings-panel">
				<div className="settings-panel__header">
					<span className="settings-panel__header-title">
						{ __( 'Block Editor', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __(
							'Settings that impact the Block Editor, such as contextual indicators for when a block has visibility controls, as well as additional toolbar options. Click the link below for complete details.',
							'block-visibility'
						) }
						link={
							'https://www.blockvisibilitywp.com/documentation/general-settings/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals'
						}
					/>
				</div>
				<div className="settings-panel__container">
					<div className="settings-type__toggle">
						<ToggleControl
							label={ __(
								'Enable contextual indicators when visibility settings are applied to a block.',
								'block-visibility'
							) }
							checked={ enableContextualIndicators }
							onChange={ () =>
								onPluginSettingChange(
									'enable_contextual_indicators',
									! enableContextualIndicators
								)
							}
						/>
					</div>
					<div className="settings-type__toggle">
						<ToggleControl
							label={ __(
								'Enable block toolbar controls for visibility settings.',
								'block-visibility'
							) }
							checked={ enableToolbarControls }
							onChange={ () =>
								onPluginSettingChange(
									'enable_toolbar_controls',
									! enableToolbarControls
								)
							}
						/>
					</div>
				</div>
			</div>
			<div className="setting-tabs__settings-panel">
				<div className="settings-panel__header">
					<span className="settings-panel__header-title">
						{ __( 'User Permissions', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __(
							'By default, all users that can edit blocks in Block Editor will be able to use the visibility settings provided by Block Visibility. You can limit permissions by user role with these settings.',
							'block-visibility'
						) }
						link={
							'https://www.blockvisibilitywp.com/documentation/general-settings/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals'
						}
					/>
				</div>
				<div className="settings-panel__container">
					<div className="settings-type__toggle">
						<ToggleControl
							label={ __(
								'Restrict block visibility controls to selected user roles.',
								'block-visibility'
							) }
							checked={ enableUserRoleRestrictions }
							onChange={ () =>
								onPluginSettingChange(
									'enable_user_role_restrictions',
									! enableUserRoleRestrictions
								)
							}
						/>
					</div>
					{ userRolesElement }
				</div>
			</div>
			<div className="setting-tabs__settings-panel">
				<div className="settings-panel__header">
					<span className="settings-panel__header-title">
						{ __( 'Full Control Mode', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __(
							"By default, not all blocks are provided with visibility controls. These include child blocks and blocks that may exist in WordPress, but cannot actually be added directly to the editor. Most of the time, you will not need Full Control Mode, but it's there in case you do. Use with caution. Click the link below for complete details.",
							'block-visibility'
						) }
						link={
							'https://www.blockvisibilitywp.com/documentation/general-settings/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals'
						}
					/>
				</div>
				<div className="settings-panel__container">
					<div className="settings-type__toggle">
						<ToggleControl
							label={ interpolateElement(
								__(
									'Enable Full Control Mode to add visibility controls to <strong>every</strong> block. <a>Use with caution</a>.',
									'block-visibility'
								),
								{
									strong: <strong />,
									a: (
										<ExternalLink // eslint-disable-line
											href="https://www.blockvisibilitywp.com/documentation/general-settings/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
											target="_blank"
											rel="noreferrer"
										/>
									),
								}
							) }
							checked={ enableFullControlMode }
							onChange={ () =>
								onPluginSettingChange(
									'enable_full_control_mode',
									! enableFullControlMode
								)
							}
						/>
					</div>
				</div>
			</div>
			<div className="setting-tabs__settings-panel">
				<div className="settings-panel__header">
					<span className="settings-panel__header-title">
						{ __( 'Uninstall', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __(
							'Settings that impact what happens when the Block Visibility plugin is uninstalled.',
							'block-visibility'
						) }
					/>
				</div>
				<div className="settings-panel__container">
					<div className="settings-type__toggle">
						<ToggleControl
							label={ __(
								'Remove all plugin settings when Block Visibility is uninstalled.',
								'block-visibility'
							) }
							checked={ removeOnUninstall }
							onChange={ () =>
								onPluginSettingChange(
									'remove_on_uninstall',
									! removeOnUninstall
								)
							}
						/>
					</div>
				</div>
			</div>
			<AdditionalPluginSettings
				pluginSettings={ pluginSettings }
				setPluginSettings={ setPluginSettings }
				setHasUpdates={ setHasUpdates }
				{ ...props }
			/>
		</div>
	);
}

let AdditionalPluginSettings = ( props ) => <></>; // eslint-disable-line
AdditionalPluginSettings = withFilters(
	'blockVisibility.AdditionalPluginSettings'
)( AdditionalPluginSettings );