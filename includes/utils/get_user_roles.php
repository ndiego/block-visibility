<?php 
/**
 * Retrieves all editable roles on the website
 *
 * @since 1.0.0
 *
 * @return array User $user_roles
 */

function get_user_roles() {
    
    if ( function_exists( 'get_editable_roles' ) ) {
        
        alert( get_editable_roles() );
        
        return null;
    }
}