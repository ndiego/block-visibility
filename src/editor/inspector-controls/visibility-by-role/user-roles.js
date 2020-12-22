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
	const { restrictedRoles, hideOnRestrictedRoles } = blockVisibility;

	const roles = variables?.userRoles ?? []; // eslint-disable-line
	const label = hideOnRestrictedRoles
		? __( 'hidden', 'block-visibility' )
		: __( 'visible', 'block-visibility' );

	return (
		<>
			<label
				htmlFor="block-visibility-control__user-roles"
				className="user-roles__label"
			>
				{ __( 'Restrict by User Role', 'block-visibility' ) }
			</label>
			<p className="user-roles__help">
				{ sprintf(
					// Translators: Whether the block is hidden or visible.
					__(
						'The block will be %s to all users with one of the selected roles.',
						'block-visibility'
					),
					label
				) }
			</p>
			<div
				id="block-visibility-control__user-roles"
				className="user-roles__control"
			>
				{ roles.map( ( role ) => {
					const newRestrictedRoles = [ ...restrictedRoles ];
					const isChecked = restrictedRoles.includes( role.name );

					if ( isChecked ) {
						const index = newRestrictedRoles.indexOf( role.name );
						index > -1 && newRestrictedRoles.splice( index, 1 ); // eslint-disable-line
					} else {
						newRestrictedRoles.indexOf( role.name ) === -1 && // eslint-disable-line
							newRestrictedRoles.push( role.name );
					}

					return (
						<CheckboxControl
							key={ role }
							checked={ isChecked }
							label={ <span>{ role.title }</span> }
							onChange={ () =>
								setAttributes( {
									blockVisibility: assign(
										{ ...blockVisibility },
										{ restrictedRoles: newRestrictedRoles }
									),
								} )
							}
						/>
					);
				} ) }
			</div>
			<ToggleControl
				label={ __( 'Hide on selected roles', 'block-visibility' ) }
				checked={ hideOnRestrictedRoles }
				onChange={ () =>
					setAttributes( {
						blockVisibility: assign(
							{ ...blockVisibility },
							{ hideOnRestrictedRoles: ! hideOnRestrictedRoles }
						),
					} )
				}
				help={ __(
					'Alternatively, hide the block to all users with one of the selected roles.',
					'block-visibility'
				) }
			/>
			<Slot name="userRolesEnd" />
		</>
	);
}
