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
 * Helper function for getting the visibilityByRole value. Function checks if
 * the depracated "all" value is set and changes this to 'public'.
 *
 * @since 1.4.1
 * @param {Object} blockVisibility All the block attributes
 * @param {Function} setAttributes Sets the block attributes
 * @return {string}		           Returns the start date
 */
function getVisibilityByRole( blockVisibility, setAttributes ) {
	const visibilityByRole = blockVisibility?.visibilityByRole ?? 'public';

	if ( visibilityByRole === 'all' ) {
		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{ visibilityByRole: 'public' }
			),
		} );

		return 'public';
	}

	return visibilityByRole;
}

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

	const sectionHidden = hideControlSection(
		enabledControls,
		blockVisibility,
		'visibility_by_role'
	);

	if ( sectionHidden ) {
		return null;
	}

	// Run the get function to clean up depracated visibilityByRole values
	const visibilityByRole = getVisibilityByRole(
		blockVisibility,
		setAttributes
	);

	const settingsUrl = variables?.pluginVariables.settingsUrl ?? ''; // eslint-disable-line
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
				__( 'User Role', 'block-visibility' ),
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
		<div className="visibility-control__group visibility-by-user-role">
			<h3 className="visibility-control__group-heading">
				{ __( 'Visibility by User Role', 'block-visibility' ) }
			</h3>
			<div className="visibility-control visibility-by-role">
				<RadioControl
					className="compound-radio-control"
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
			{ visibilityByRole === 'user-role' && enableUserRoles && (
				<UserRoles variables={ variables } { ...props } />
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
	);
}
