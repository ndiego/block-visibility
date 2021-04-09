/**
 * External dependencies
 */
import { map, assign, includes } from 'lodash'; // eslint-disable-line
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { ToggleControl, Slot } from '@wordpress/components';

/**
 * Add the User Roles control to the main Visibility By User Role control
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UserRoles( props ) {
	const { variables, userRole, setControlAtts } = props;
	const restrictedRoles = userRole?.restrictedRoles ?? [];
	const hideOnRestrictedRoles = userRole?.hideOnRestrictedRoles ?? false;
	const roles = variables?.user_roles ?? [];
	const label = hideOnRestrictedRoles
		? __( 'Hide from all', 'block-visibility' )
		: __( 'Only visible to', 'block-visibility' );
	const selectedRoles = roles.filter( ( role ) =>
		restrictedRoles.includes( role.value )
	);

	const handleOnChange = ( _roles ) => {
		const newRoles = [];

		if ( _roles.length !== 0 ) {
			_roles.forEach( ( role ) => {
				newRoles.push( role.value );
			} );
		}

		setControlAtts(
			'userRole',
			assign(
				{ ...userRole },
				{
					restrictedRoles: newRoles,
				}
			)
		);
	};

	return (
		<>
			<div className="visibility-control restricted-roles">
				<div className="visibility-control__label">
					{ __( 'Restricted User Roles', 'block-visibility' ) }
				</div>
				<Select
					className="block-visibility__react-select"
					classNamePrefix="react-select"
					options={ roles }
					value={ selectedRoles }
					placeholder={ __( 'Select Role…', 'block-visibility' ) }
					onChange={ ( value ) => handleOnChange( value ) }
					isMulti
				/>
				<div className="visibility-control__help">
					{ sprintf(
						// Translators: Whether the block is hidden or visible.
						__(
							'%s users with at least one of the selected roles.',
							'block-visibility'
						),
						label
					) }
				</div>
			</div>
			<div className="visibility-control hide-on-restricted-roles">
				<ToggleControl
					label={ __( 'Hide on selected roles', 'block-visibility' ) }
					checked={ hideOnRestrictedRoles }
					onChange={ () =>
						setControlAtts(
							'userRole',
							assign(
								{ ...userRole },
								{
									hideOnRestrictedRoles: ! hideOnRestrictedRoles,
								}
							)
						)
					}
					help={ __(
						'Alternatively, hide the block to all users with one of the selected roles.',
						'block-visibility'
					) }
				/>
				<Slot name="userRolesEnd" />
			</div>
		</>
	);
}
