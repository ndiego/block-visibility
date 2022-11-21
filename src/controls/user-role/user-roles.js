/**
 * External dependencies
 */
import { map, assign, includes } from 'lodash'; // eslint-disable-line
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

/**
 * Add the User Roles control to the main Visibility By User Role control
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function UserRoles( props ) {
	const { variables, userRole, setControlAtts, enableNotices } = props;
	const restrictedRoles = userRole?.restrictedRoles ?? [];
	const hideOnRestrictedRoles = userRole?.hideOnRestrictedRoles ?? false;
	const roles = variables?.user_roles ?? [];
	const label = hideOnRestrictedRoles
		? __( 'Hide the block from', 'block-visibility' )
		: __( 'Show the block to', 'block-visibility' );
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
		<div className="control-fields-item">
			{ enableNotices && (
				<div className="components-base-control__help">
					{ sprintf(
						// Translators: Whether the block is hidden or visible.
						__(
							'%s users with at least one of the selected roles.',
							'block-visibility'
						),
						label
					) }
				</div>
			) }
			<Select
				className="block-visibility__react-select"
				classNamePrefix="react-select"
				options={ roles }
				value={ selectedRoles }
				placeholder={ __( 'Select Role…', 'block-visibility' ) }
				onChange={ ( value ) => handleOnChange( value ) }
				isMulti
			/>
			<div className="control-fields-item__hide-when">
				<ToggleControl
					label={ __(
						'Hide from selected roles',
						'block-visibility'
					) }
					checked={ hideOnRestrictedRoles }
					onChange={ () =>
						setControlAtts(
							'userRole',
							assign(
								{ ...userRole },
								{
									hideOnRestrictedRoles:
										! hideOnRestrictedRoles,
								}
							)
						)
					}
				/>
			</div>
		</div>
	);
}
