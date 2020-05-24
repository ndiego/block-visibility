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

function UserRoles( props ) {
	
	const { attributes, setAttributes } = props;
	const { blockVisibility } = attributes;
    
    console.log( blockVisibility );
	
	// This is a global variable added to the page via PHP
    const roles = blockVisibilityUserRoles;
	const {	restrictedRoles } = blockVisibility;
    
    return (
        <div>
			{ roles.map( ( role ) => {
				
				let newRestrictedRoles = [ ...restrictedRoles ];
				const isChecked = restrictedRoles.includes( role.name );
								
				if ( isChecked ) {
					const index = newRestrictedRoles.indexOf( role.name );
					index > -1 && newRestrictedRoles.splice(index, 1);
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

export default UserRoles;