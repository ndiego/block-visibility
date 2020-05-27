<?php
/**
 * Helper function for retrieving disabled functionality.
 *
 * @package block-visibility
 * @since   1.0.0
 */
 
namespace BlockVisibility\Utils;

/**
 * Helper function for retrieving disabled functionality.
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