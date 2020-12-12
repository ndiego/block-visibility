/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, Disabled, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InformationPopover from './../../utils/information-popover';
import EnabledUserRoles from './enabled-user-roles';

/**
 * Renders the permission settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UserPermissions( props ) {
    const { settings, setSettings, setHasUpdates } = props;

    // Manually set defaults, this ensures the main settings function properly
    const enable = settings?.enable_user_role_restrictions ?? false; // eslint-disable-line

	let userRolesElement = (
		<EnabledUserRoles
            settings={ settings }
            setSettings={ setSettings }
            setHasUpdates={ setHasUpdates }
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
                        checked={ enable }
                        onChange={ () => {
                            setSettings( {
                                ...settings,
                                [ 'enable_user_role_restrictions' ]: ! enable,
                            } );
                            setHasUpdates( true );
                        } }
                    />
                </div>
                { userRolesElement }
                <Slot name="UserPermissionSettings"/>
            </div>
        </div>
    )
}
