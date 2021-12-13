/**
 * External dependencies
 */
import { assign } from 'lodash';
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl, Notice } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import UserRoles from './user-roles';
import Users from './users';
import AdvancedUserRules from './advanced-user-rules';
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
	const enableAdvanced = isControlSettingEnabled(
		settings,
		'visibility_by_role',
		'enable_advanced'
	);

	let options = [
		{
			label: __( 'Public', 'block-visibility' ),
			value: 'public',
		},
		{
			label: __( 'Logged-out', 'block-visibility' ),
			value: 'logged-out',
		},
		{
			label: __( 'Logged-in', 'block-visibility' ),
			value: 'logged-in',
		},
		{
			label: __( 'User roles', 'block-visibility' ),
			value: 'user-role',
		},
		{
			label: __( 'Users', 'block-visibility' ),
			value: 'users',
		},
		{
			label: __( 'Advanced user rules', 'block-visibility' ),
			value: 'advanced',
		},
	];

	const optionsHelp = [
		{
			label: __( 'Block is visible to everyone.', 'block-visibility' ),
			value: 'public',
		},
		{
			label: __(
				'Block is only visible to logged-out users.',
				'block-visibility'
			),
			value: 'logged-out',
		},
		{
			label: __(
				'Block is only visible to logged-in users.',
				'block-visibility'
			),
			value: 'logged-in',
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

	// If the Advanced option is not enabled in plugin settings, remove it.
	if ( ! enableAdvanced ) {
		options = options.filter( ( option ) => option.value !== 'advanced' );
	}
console.log( visibilityByRole );
	return (
		<>
			<div className="visibility-control__group user-role-control">
				<h3 className="visibility-control__group-heading">
					{ __( 'User Role', 'block-visibility' ) }
				</h3>
				<div className="visibility-control__group-fields">
					<div className="visibility-control visibility-by-role">
						<SelectControl
							value={ visibilityByRole }
							options={ options }
							help={
								optionsHelp.filter(
									( option ) =>
										option.value === visibilityByRole
								)[ 0 ]?.label ?? ''
							}
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
					{ visibilityByRole === 'advanced' && enableAdvanced && (
						<AdvancedUserRules
							variables={ variables }
							userRole={ userRole }
							setControlAtts={ setControlAtts }
							{ ...props }
						/>
					) }
				</div>
				{ ! options.some(
					( option ) => option.value === visibilityByRole
				) && (
					<Notice status="warning" isDismissible={ false }>
						{ createInterpolateElement(
							__(
								'The User Role option that was previously selected has been disabled. Choose another option or update the <a>Visibility Control</a> settings.',
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
