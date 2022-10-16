/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, Disabled, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { InformationPopover } from './../../../components';
import EnabledUserRoles from './enabled-user-roles';

/**
 * Renders the permission settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UserPermissions( props ) {
	const { pluginSettings, setPluginSettings } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = pluginSettings?.enable_user_role_restrictions ?? false; // eslint-disable-line

	let userRolesElement = (
		<EnabledUserRoles
			pluginSettings={ pluginSettings }
			setPluginSettings={ setPluginSettings }
		/>
	);

	if ( ! enable ) {
		userRolesElement = <Disabled>{ userRolesElement }</Disabled>;
	}

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'User Permissions', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Restrict block visibility controls to selected user roles.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setPluginSettings( {
								...pluginSettings,
								enable_user_role_restrictions: ! enable,
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'By default, all users that can edit blocks in Block Editor will be able to use the visibility settings provided by Block Visibility. You can limit permissions by user role with these settings.',
							'block-visibility'
						) }
						link={
							'https://www.blockvisibilitywp.com/knowledge-base/how-to-configure-the-general-settings/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals'
						}
					/>
				</div>
				{ userRolesElement }
				<Slot name="UserPermissionSettings" />
			</div>
		</div>
	);
}
