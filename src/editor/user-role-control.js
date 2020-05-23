/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	CheckboxControl,
} from '@wordpress/components';

function UserRoleControl( props ) {
    
    console.log( blockVisibilityUserRoles );
    const roles = blockVisibilityUserRoles;
    
    return (
        <div>
			{ roles.map( ( role ) => (
				<CheckboxControl
					label={ <span>{ role.title }</span> }
				/>
			) ) }
        </div>
    );
}

export default UserRoleControl;