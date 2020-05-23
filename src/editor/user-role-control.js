/**
 * External dependencies
 */
import { map, assign, includes } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	CheckboxControl,
} from '@wordpress/components';

function UserRoleControl( props ) {
	
	const { name, attributes, setAttributes, blockTypes } = props;
	const { blockVisibility } = attributes;
    
    console.log( blockVisibility );
    const roles = blockVisibilityUserRoles;
	
	
	const {
		hideBlock,
		visibilityByRole,
		restrictedRoles,
	} = blockVisibility;
    
    return (
        <div>
			{ roles.map( ( role ) => {
				
				const isChecked = restrictedRoles ? restrictedRoles.includes( role.name ) : false;
				
				let newRestrictedRoles = restrictedRoles ? restrictedRoles : [];
				
				// Not working 100%
				if ( isChecked ) {
					const index = newRestrictedRoles.indexOf( role.name );
					if (index > -1) {
					  newRestrictedRoles.splice(index, 1);
					}
				} else {
					newRestrictedRoles.indexOf( role.name ) === -1 && newRestrictedRoles.push( role.name );
				}
				
				return (
					<CheckboxControl
						checked={ isChecked }
						label={ <span>{ role.title }</span> }
						onChange={ () => setAttributes( {
								blockVisibility: assign( 
									{ ...blockVisibility }, 
									{ restrictedRoles: newRestrictedRoles } 
								)
							} )
						}
					/>
				)
			} ) }
        </div>
    );
}

export default UserRoleControl;