/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RadioControl, Notice, Slot } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import UserRoles from './user-roles';
import ControlSeparator from './../utils/control-separator';
import { isControlSettingEnabled } from './../../utils/setting-utilities';

/**
 * Add the User Role control
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UserRole( props ) {
	const {
		settings,
		variables,
		enabledControls,
		setControlAtts,
		controlSetAtts,
	} = props;
	const controlEnabled = enabledControls.some(
		( control ) => control.settingSlug === 'visibility_by_role'
	);
	const controlToggledOn =
		controlSetAtts?.controls.hasOwnProperty( 'userRole' ) ?? false;

	if ( ! controlEnabled || ! controlToggledOn ) {
		return null;
	}

	const userRole = controlSetAtts?.controls?.userRole ?? {};
	const visibilityByRole = userRole?.visibilityByRole ?? 'public';

	const settingsUrl = variables?.plugin_variables.settings_url ?? ''; // eslint-disable-line
	const enableUserRoles = isControlSettingEnabled(
		settings,
		'visibility_by_role',
		'enable_user_roles'
	);

	const optionLabel = ( title, description ) => {
		return (
			<div className="compound-radio-label">
				{ title }
				<span>{ description }</span>
			</div>
		);
	};

	const options = [
		{
			label: optionLabel(
				__( 'Public', 'block-visibility' ),
				__( 'Visible to everyone.', 'block-visibility' )
			),
			value: 'public',
		},
		{
			label: optionLabel(
				__( 'Logged-out', 'block-visibility' ),
				__( 'Only visible to logged-out users.', 'block-visibility' )
			),
			value: 'logged-out',
		},
		{
			label: optionLabel(
				__( 'Logged-in', 'block-visibility' ),
				__( 'Only visible to logged-in users.', 'block-visibility' )
			),
			value: 'logged-in',
		},
		{
			label: optionLabel(
				__( 'User Roles', 'block-visibility' ),
				__( 'Only visible to specific user roles.', 'block-visibility' )
			),
			value: 'user-role',
		},
	];

	// If the User Roles option is not enabled in plugin settings, remove it.
	if ( ! enableUserRoles ) {
		options.pop();
	}

	return (
		<>
			<div className="visibility-control__group user-role-control">
				<h3 className="visibility-control__group-heading">
					{ __( 'User Role', 'block-visibility' ) }
				</h3>
				<div className="visibility-control visibility-by-role">
					<RadioControl
						className="compound-radio-control"
						selected={ visibilityByRole }
						options={ options }
						onChange={ ( value ) =>
							setControlAtts(
								'userRole',
								assign(
									{ ...userRole },
									{ visibilityByRole: value }
								)
							)
						}
					/>
				</div>
				{ visibilityByRole === 'user-role' && enableUserRoles && (
					<UserRoles
						variables={ variables }
						userRole={ userRole }
						setControlAtts={ setControlAtts }
						{ ...props }
					/>
				) }
				{ visibilityByRole === 'user-role' && ! enableUserRoles && (
					<Notice status="warning" isDismissible={ false }>
						{ createInterpolateElement(
							__(
								'The User Role option was previously selected, but is now disabled. Choose another option or update the <a>Visibility Control</a> settings.',
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
				) }
				<Slot name="VisibilityByRoleControls" />
			</div>
			<ControlSeparator control="userRole" { ...props } />
		</>
	);
}
