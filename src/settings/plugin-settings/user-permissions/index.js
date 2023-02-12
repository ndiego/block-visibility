/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import EnabledUserRoles from './enabled-user-roles';
import { InformationPopover } from './../../../components';

/**
 * Renders the permission settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
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
		<div className="settings-panel">
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
							'By default, all users that can edit blocks will be able to use the visibility controls provided by Block Visibility.',
							'block-visibility'
						) }
					/>
				</div>
				{ userRolesElement }
			</div>
		</div>
	);
}
