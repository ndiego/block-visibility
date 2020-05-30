<?php
/**
 * Adds a filter to the visibility test for the "hide block" setting.
 *
 * @package block-visibility
 * @since   1.0.0
 */
 
namespace BlockVisibility\Frontend\VisibilityTests;

use function BlockVisibility\Utils\get_disabled_functionality as get_disabled_functionality;

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
