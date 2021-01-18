/**
 * External dependencies
 */
import { map, assign, includes } from 'lodash'; // eslint-disable-line

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
	const { attributes, setAttributes, variables } = props;
	const { blockVisibility } = attributes;
	const restrictedRoles = blockVisibility?.restrictedRoles ?? [];
	const hideOnRestrictedRoles =
		blockVisibility?.hideOnRestrictedRoles ?? false;

	const roles = variables?.userRoles ?? []; // eslint-disable-line
	const label = hideOnRestrictedRoles
		? __( 'hidden', 'block-visibility' )
		: __( 'visible', 'block-visibility' );

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
				<div className="user-roles__container">
					{ roles.map( ( role ) => {
						const newRestrictedRoles = [ ...restrictedRoles ];
						const isChecked = restrictedRoles.includes( role.name );

						if ( isChecked ) {
							const index = newRestrictedRoles.indexOf( role.name ); // eslint-disable-line
							index > -1 && newRestrictedRoles.splice( index, 1 ); // eslint-disable-line
						} else {
							newRestrictedRoles.indexOf( role.name ) === -1 && // eslint-disable-line
								newRestrictedRoles.push( role.name );
						}

						return (
							<CheckboxControl
								key={ role }
								className="user-role"
								checked={ isChecked }
								label={ role.title }
								onChange={ () =>
									setAttributes( {
										blockVisibility: assign(
											{ ...blockVisibility },
											{
												restrictedRoles: newRestrictedRoles,
											}
										),
									} )
								}
							/>
						);
					} ) }
				</div>
			</div>
			<div className="visibility-control hide-on-restricted-roles">
				<ToggleControl
					label={ __( 'Hide on selected roles', 'block-visibility' ) }
					checked={ hideOnRestrictedRoles }
					onChange={ () =>
						setAttributes( {
							blockVisibility: assign(
								{ ...blockVisibility },
								{
									hideOnRestrictedRoles: ! hideOnRestrictedRoles,
								}
							),
						} )
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
