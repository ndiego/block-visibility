<?php
/**
 * Conditionally renders each block based on its visibility settings
 *
 * @package block-visibility
 * @since   1.0.0
 */
 
namespace BlockVisibility\Frontend;

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


// Run our tests
require_once BV_PLUGIN_DIR . 'includes/frontend/visibility-tests/hide-block.php';
require_once BV_PLUGIN_DIR . 'includes/frontend/visibility-tests/visibility-by-role.php';

// Require utlity functions for tests
require_once BV_PLUGIN_DIR . 'includes/utils/get-visibility-controls.php';



