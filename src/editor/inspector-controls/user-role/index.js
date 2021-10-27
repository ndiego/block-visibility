/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RadioControl, Notice } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import UserRoles from './user-roles';
import Users from './users';
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
	const enableUsers = isControlSettingEnabled(
		settings,
		'visibility_by_role',
		'enable_users'
	);

	const optionLabel = ( title, description ) => {
		return (
			<div className="compound-radio-label">
				{ title }
				<span>{ description }</span>
			</div>
		);
	};

	let options = [
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
				__( 'User roles', 'block-visibility' ),
				__( 'Only visible to specific user roles.', 'block-visibility' )
			),
			value: 'user-role',
		},
		{
			label: optionLabel(
				__( 'Users', 'block-visibility' ),
				__( 'Only visible to specific users.', 'block-visibility' )
			),
			value: 'users',
		},
	];

	// If the User Roles option is not enabled in plugin settings, remove it.
	if ( ! enableUserRoles ) {
		options = options.filter( ( option ) => option.value !== 'user-role' );
	}

	// If the Users option is not enabled in plugin settings, remove it.
	if ( ! enableUsers ) {
		options = options.filter( ( option ) => option.value !== 'users' );
	}

	return (
		<>
			<div className="visibility-control__group user-role-control">
				<h3 className="visibility-control__group-heading">
					{ __( 'User Role', 'block-visibility' ) }
				</h3>
				<div className="visibility-control__group-fields">
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
					{ visibilityByRole === 'users' && enableUsers && (
						<Users
							variables={ variables }
							userRole={ userRole }
							setControlAtts={ setControlAtts }
							{ ...props }
						/>
					) }
				</div>
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
					</Notice>
				) }
				{ visibilityByRole === 'users' && ! enableUsers && (
					<Notice status="warning" isDismissible={ false }>
						{ createInterpolateElement(
							__(
								'The Users option was previously selected, but is now disabled. Choose another option or update the <a>Visibility Control</a> settings.',
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
					</Notice>
				) }
			</div>
			<div className="control-separator">
				<span>{ __( 'AND', 'block-visibility' ) }</span>
			</div>
		</>
	);
}
