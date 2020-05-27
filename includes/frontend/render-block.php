<?php
/**
 * Conditionally renders each block based on its visibility settings
 *
 * @package block-visibility
 * @since   1.0.0
 */
 
namespace BlockVisibility\Admin;

/**
 * Check if the given block type is disabled via the visibility settings
 *
 * @since   1.0.0
 *
 * @param array    $block The block info and attributes
 * @return boolean Is the block disabled or not
 */
function is_block_type_disabled( $settings, $block ) {
    $disabled_blocks = $settings['disabled_blocks'];
    
    if ( in_array( $block['blockName'], $disabled_blocks ) ) {
        return true;
    } 
    
    return false; 
}

/**
 * Check if the given block has visibility settings
 *
 * @since   1.0.0
 *
 * @param array    $block The block info and attributes
 * @return boolean Are there visibility settings or not
 */
function has_visibility_settings( $block ) {
    if ( isset( $block['attrs']['blockVisibility'] ) ) {
        return true;
    }
    
    return false; 
}

/**
 * Check if the given block has visibility settings
 *
 * @since   1.0.0
 *
 * @param string  $block_content The block frontend output
 * @param array   $block The block info and attributes
 * @return mixed  Return either the $block_content or nothing depending on visibility settings
 */
function render_with_visibility( $block_content, $block ) {
    
    // Get the plugin core settings
    $settings = get_option( 'block_visibility_settings' );
    
    // Make sure we are allowed to control visibility for this block type and 
    // ensure the block actually has visibility settings set.
    if ( 
        ! is_block_type_disabled( $settings, $block ) && 
        has_visibility_settings( $block ) 
    ) {
        
        $block_visibility_test = true;
        
        // All our visibility tests are run through this filter and this also 
        // gives third-party developers access to override the visibility test
        $block_visibility_test = apply_filters( 
            'block_visibility_test', 
            $block_visibility_test, 
            $settings, 
            $block 
        );

        if ( $block_visibility_test ) {
            return $block_content;
        } else {
            return null;
        }
    }
    
    return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_with_visibility', 10, 2 );



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
    //echo print_r( $block['attrs']['blockVisibility'] );

    // If this functionality has been disabled, skip test.
    if ( in_array( 'visibility_by_role', get_disabled_functionality( $settings ) ) ) {
        return $is_visible;
    }

    // The test is already false, so skip this test, the block should be hidden.
    if ( ! $is_visible ) {
        return $is_visible;
    }
    
    $visibility_by_role = isset( $block['attrs']['blockVisibility']['visibilityByRole'] ) 
        ? $block['attrs']['blockVisibility']['visibilityByRole'] 
        : null;
    
    // If there is no setting set, or visibility is set to all, return true.
    if ( ! $visibility_by_role || $visibility_by_role === 'all' ){
        return true;
    }
    
    if ( $visibility_by_role === 'logged-out' && ! is_user_logged_in() ) {
        return true;
    } else if ( $visibility_by_role === 'logged-in' && is_user_logged_in() ) {
        return true;
    } else if ( $visibility_by_role === 'user-role' && is_user_logged_in() ) {
        
        $restricted_roles = isset( $block['attrs']['blockVisibility']['restrictedRoles'] ) 
            ? $block['attrs']['blockVisibility']['restrictedRoles'] 
            : null;
        

        // The user is logged in, so now we check what restrictions there are and if the user
        // has the permissions to view the content. Note: if no restrictions are set, don't show at all
        if ( ! empty( $restricted_roles ) ) {
            // Get info about the current user and bail if it's not an instance 
            // of WP_User
            $current_user = wp_get_current_user();
        
            // THIS IS NOT WORKING>>>>>>>>
            if ( ! ( $current_user instanceof WP_User ) ) {
                    echo print_r($current_user);
               return false;
            }

            // Get the user's role
            $user_roles = $current_user->roles;
            
            echo print_r($user_roles );

            // See if user's role is one of the restricted ones. If so it will return an array
            // of matched roles. Count to make sure array length > 0. If so, show the block
            if ( count( array_intersect( $restricted_roles, $user_roles ) ) > 0 ) {
                return true;
            }
        }
    }
    
    // If we don't pass any of the above tests, hide the block.
    return false;
}
add_filter( 'block_visibility_test', __NAMESPACE__ . '\test_visibility_by_role', 10, 3 ); 

/**
 * Run test to see if the hide block setting is enabled for the block.
 *
 * This test is applied at a priotity of 20 to try and ensure it goes last. 
 * This should generally be the last test that is run and should override all
 * other tests. 
 *
 * @since   1.0.0
 *
 * @param boolean   $is_visible The current value of the visibility test
 * @param array     $settings   The core plugin settings
 * @param array     $block      The block info and attributes
 * @return boolean  Return true is the block should be visible, false if not
 */
function test_hide_block( $is_visible, $settings, $block ) {
        
    // If this functionality has been disabled, skip test.
    if ( in_array( 'hide_block', get_disabled_functionality( $settings ) ) ) {
        return $is_visible;
    }

    // The test is already false, so skip this test, the block should be hidden.
    if ( ! $is_visible ) {
        return $is_visible;
    }
    
    if ( $block['attrs']['blockVisibility']['hideBlock'] ) {
        return false;
    }
        
    return true;
}
add_filter( 'block_visibility_test', __NAMESPACE__ . '\test_hide_block', 20, 3 );

/**
 * Helper function for retrieving disabled functionality
 *
 * @since   1.0.0
 *
 * @param array   $settings               The core plugin settings
 * @return array  $disabled_functionality All functionality that is disabled
 */
function get_disabled_functionality( $settings ) {
    $disabled_functionality = isset( $settings['disabled_functionality'] )
        ? $settings['disabled_functionality'] 
        : array();
    
    return $disabled_functionality;
}
