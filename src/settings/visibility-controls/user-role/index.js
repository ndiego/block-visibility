/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, Disabled, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InformationPopover from './../../utils/information-popover';

/**
 * Renders the visibility control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UserRole( props ) {
	const { settings, setSettings, setHasUpdates } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = settings?.visibility_by_role?.enable ?? true; // eslint-disable-line
	const enableUserRoles = settings?.visibility_by_role?.enable_user_roles ?? true; // eslint-disable-line

	let enableUserRolesElement = (
		<ToggleControl
			label={ __(
				'Enable individual user role restrictions (Administrator, Editor, Subscriber, etc.)',
				'block-visibility'
			) }
			checked={ enableUserRoles }
			onChange={ () => {
				setSettings( {
					...settings,
					visibility_by_role: {
						...settings.visibility_by_role,
						enable_user_roles: ! enableUserRoles,
					},
				} );
				setHasUpdates( true );
			} }
		/>
	);

	if ( ! enable ) {
		enableUserRolesElement = (
			<Disabled>{ enableUserRolesElement }</Disabled>
		);
	}

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'User Role', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the User Role controls.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setSettings( {
								...settings,
								visibility_by_role: {
									...settings.visibility_by_role,
									enable: ! enable,
								},
							} );
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'User Role controls allow you to hide blocks based on whether a user is logged-in, logged-out, and more.',
							'block-visibility'
						) }
						subMessage={ __(
							'To learn more about User Role controls, review the plugin documentation using the link below.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<hr />
				<div className="settings-type__toggle first has-info-popover subsetting">
					{ enableUserRolesElement }
					<InformationPopover
						message={ __(
							'Restrict visibility by any user role, not just users that are logged-in or logged-out. This includes roles that are added by third-party plugins.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<Slot name="VisibilityByRoleControls" />
			</div>
		</div>
	);
}
