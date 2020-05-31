<?php
/**
 * Adds a filter to the visibility test for "visibility by user role" setting.
 *
 * @package block-visibility
 * @since   1.0.0
 */
 
namespace BlockVisibility\Frontend\VisibilityTests;

use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;

/**
 * Run test to see if block visibility should be restricted by user role.
 *
 * @since   1.0.0
 *
 * @param boolean   $is_visible The current value of the visibility test
 * @param array     $settings   The core plugin settings
 * @param array     $block      The block info and attributes
 * @return boolean  Return true is the block should be visible, false if not
 */
function test_visibility_by_role( $is_visible, $settings, $block ) {

    // The test is already false, so skip this test, the block should be hidden.
    if ( ! $is_visible ) {
        return $is_visible;
    }

    // If this functionality has been disabled, skip test.
    if ( ! is_control_enabled( $settings, 'visibility_by_role' ) ) {
        return true;
    }
    
    $visibility_by_role = isset( $block['attrs']['blockVisibility']['visibilityByRole'] ) 
        ? $block['attrs']['blockVisibility']['visibilityByRole'] 
        : null;
    
    // Run through our visibility by role tests.
    if ( ! $visibility_by_role || $visibility_by_role === 'all' ){
        return true;
    } else if ( $visibility_by_role === 'logged-out' && ! is_user_logged_in() ) {
        return true;
    } else if ( $visibility_by_role === 'logged-in' && is_user_logged_in() ) {
        return true;
    } else if ( $visibility_by_role === 'user-role' ) {
        
        // If this functionality has been disabled, skip test.
        if ( ! is_control_enabled( $settings, 'visibility_by_role', 'enable_user_roles' ) ) {
            return true;
        }
        
        $restricted_roles = isset( $block['attrs']['blockVisibility']['restrictedRoles'] ) 
            ? $block['attrs']['blockVisibility']['restrictedRoles'] 
            : array();
        
        // Make sure there are restricted roles set, if not the block should be
        // hidden.
        if ( ! empty( $restricted_roles ) ) {
            
            if ( in_array( 'public', $restricted_roles ) && ! is_user_logged_in() ){
                return true;
            }
            
            if ( is_user_logged_in() ) {
                
                // Get the roles of the current user since they are logged-in.
                $current_user = wp_get_current_user();
                $user_roles   = $current_user->roles;

                // If one of the user's roles is also a restricted role, show
                // the block.
                if ( count( array_intersect( $restricted_roles, $user_roles ) ) > 0 ) {
                    return true;
                }
            }
        }
    }
    
    // If we don't pass any of the above tests, hide the block.
    return false;
}
add_filter( 'block_visibility_test', __NAMESPACE__ . '\test_visibility_by_role', 10, 3 ); 
