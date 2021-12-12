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
	const { visibilityControls, setVisibilityControls } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.visibility_by_role?.enable ?? true; // eslint-disable-line
	const enableUserRoles = visibilityControls?.visibility_by_role?.enable_user_roles ?? true; // eslint-disable-line
	const enableUsers = visibilityControls?.visibility_by_role?.enable_users ?? true; // eslint-disable-line
	const enableAdvanced = visibilityControls?.visibility_by_role?.enable_advanced ?? true; // eslint-disable-line

	let enableUserRolesElement = (
		<ToggleControl
			label={ __(
				'Enable individual user role restrictions (Administrator, Editor, Subscriber, etc.)',
				'block-visibility'
			) }
			checked={ enableUserRoles }
			onChange={ () => {
				setVisibilityControls( {
					...visibilityControls,
					visibility_by_role: {
						...visibilityControls.visibility_by_role,
						enable_user_roles: ! enableUserRoles,
					},
				} );
			} }
		/>
	);

	let enableUsersElement = (
		<ToggleControl
			label={ __(
				'Enable individual user restrictions.',
				'block-visibility'
			) }
			checked={ enableUsers }
			onChange={ () => {
				setVisibilityControls( {
					...visibilityControls,
					visibility_by_role: {
						...visibilityControls.visibility_by_role,
						enable_users: ! enableUsers,
					},
				} );
			} }
		/>
	);

	let enableAdvancedElement = (
		<ToggleControl
			label={ __(
				'Enable advanced user role restrictions (Rule sets).',
				'block-visibility'
			) }
			checked={ enableAdvanced }
			onChange={ () => {
				setVisibilityControls( {
					...visibilityControls,
					visibility_by_role: {
						...visibilityControls.visibility_by_role,
						enable_advanced: ! enableAdvanced,
					},
				} );
			} }
		/>
	);

	if ( ! enable ) {
		enableUserRolesElement = (
			<Disabled>{ enableUserRolesElement }</Disabled>
		);
		enableUsersElement = <Disabled>{ enableUsersElement }</Disabled>;
		enableAdvancedElement = <Disabled>{ enableAdvancedElement }</Disabled>;
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
							setVisibilityControls( {
								...visibilityControls,
								visibility_by_role: {
									...visibilityControls.visibility_by_role,
									enable: ! enable,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'The User Role control allows you to conditionally display blocks based on whether a user is logged-in, logged-out, and more. Visit the plugin Knowledge Base for more information.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-user-role-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<hr />
				<div className="settings-type__toggle first has-info-popover subsetting">
					{ enableUserRolesElement }
					<InformationPopover
						message={ __(
							'Restrict visibility by any user role (Administrator, Editor, Subscriber, etc.). Roles that are added by third-party plugins will also be available to choose from.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-user-role-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<div className="settings-type__toggle has-info-popover subsetting">
					{ enableUsersElement }
					<InformationPopover
						message={ __(
							'Restrict visibility to specific individual users on your website based on user ID. Multiple users can be selected at once.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-user-role-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<div className="settings-type__toggle has-info-popover subsetting">
					{ enableAdvancedElement }
					<InformationPopover
						message={ __(
							'The advanced option allows you to create user-based rule sets, which provide extensive configuration options and great flexibilty.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-user-role-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<Slot name="VisibilityByRoleControls" />
			</div>
		</div>
	);
}
