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
import { hideControlSection } from './../utils/hide-control-section';
import { isControlSettingEnabled } from './../../utils/setting-utilities';

/**
 * Add the Visibility By User Role control
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function VisibilityByRole( props ) {
	const {
		attributes,
		setAttributes,
		enabledControls,
		settings,
		variables,
	} = props;
	const { blockVisibility } = attributes;
	const { visibilityByRole } = blockVisibility;

	const sectionHidden = hideControlSection(
		enabledControls,
		blockVisibility,
		'visibility_by_role'
	);

	if ( sectionHidden ) {
		return null;
	}

	const settingsUrl = variables?.pluginVariables.settingsUrl ?? ''; // eslint-disable-line
	const visibilityByRoleEnableUseRoles = isControlSettingEnabled(
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
				__( 'All', 'block-visibility' ),
				__( 'Visible to everyone', 'block-visibility' )
			),
			value: 'all',
		},
		{
			label: optionLabel(
				__( 'Public', 'block-visibility' ),
				__( 'Visible to all logged-out users', 'block-visibility' )
			),
			value: 'logged-out',
		},
		{
			label: optionLabel(
				__( 'Private', 'block-visibility' ),
				__( 'Visible to all logged-in users', 'block-visibility' )
			),
			value: 'logged-in',
		},
		{
			label: optionLabel(
				__( 'User Role', 'block-visibility' ),
				__(
					'Restrict visibility to specific user roles',
					'block-visibility'
				)
			),
			value: 'user-role',
		},
	];

	// If the User Roles option is not enabled in plugin settings, remove it.
	if ( ! visibilityByRoleEnableUseRoles ) {
		options.pop();
	}

	return (
		<div className="visibility-control__group visibility-by-user-role">
			<div className="visibility-control visibility-by-role">
				<RadioControl
					className="compound-radio-control"
					label={ __(
						'Visibility by User Role',
						'block-visibility'
					) }
					selected={ visibilityByRole }
					options={ options }
					onChange={ ( value ) =>
						setAttributes( {
							blockVisibility: assign(
								{ ...blockVisibility },
								{ visibilityByRole: value }
							),
						} )
					}
				/>
			</div>
			{ visibilityByRole === 'user-role' &&
				visibilityByRoleEnableUseRoles && (
					<UserRoles variables={ variables } { ...props } />
				) }
			{ visibilityByRole === 'user-role' &&
				! visibilityByRoleEnableUseRoles && (
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
	);
}
