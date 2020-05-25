<?php
/**
 * Conditionally renders each block based on its visibility settings
 *
 * @package block-visibility
 * @since   1.0.0
 */
 
namespace BlockVisibility\Admin;

/**
 * Check if the given block is disabled via the visibility settings
 *
 * @since   1.0.0
 *
 * @param array    $block The block info and attributes
 * @return boolean Is the block disabled or not
 */
function is_block_disabled( $block ) {
    $disabled_blocks = get_option( 'bv_disabled_blocks' );
    
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
    
    //echo print_r( $block );
    if ( ! is_block_disabled( $block ) && has_visibility_settings( $block ) ) {
        return $block[ 'blockName' ] . $block_content;
    }
    
    return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_with_visibility', 10, 2 );
