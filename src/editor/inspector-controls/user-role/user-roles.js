/**
 * External dependencies
 */
import { map, assign, includes } from 'lodash'; // eslint-disable-line
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { CheckboxControl, ToggleControl, Slot } from '@wordpress/components';

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
	const roles = variables?.userRoles ?? [];
	const label = hideOnRestrictedRoles
		? __( 'hidden', 'block-visibility' )
		: __( 'visible', 'block-visibility' );

		const options = [
	  { value: 'chocolate', label: 'Chocolate' },
	  { value: 'strawberry', label: 'Strawberry' },
	  { value: 'vanilla', label: 'Vanilla' }
	]

	const selectedRoles = roles.filter(
		( role ) => restrictedRoles.includes( role.value )
	);

	// A very loose test to see if some previously saved restricted roles are no longer "available" roles on the website.
	const missingRoles = restrictedRoles.length > selectedRoles.length;

	const handleOnChange = ( roles ) => {
		let newRoles = [];

		if ( roles.length != 0 ) {
			roles.forEach( ( role ) => {
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
		)
	}

	return (
		<>
			<div className="visibility-control restricted-roles">
				<div className="visibility-control__label">
					{ __( 'Restricted User Roles', 'block-visibility' ) }
				</div>
				<div className="visibility-control__help">
					{ sprintf(
						// Translators: Whether the block is hidden or visible.
						__(
							'The block will be %s to all users with one of the selected roles.',
							'block-visibility'
						),
						label
					) }
				</div>
				 <Select
				 	className="block-visibility__react-select"
					classNamePrefix="react-select"
				 	options={ roles }
					value={ selectedRoles }
					onChange={ ( value ) => handleOnChange( value ) }
					isMulti
				/>
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
