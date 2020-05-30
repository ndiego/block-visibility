<?php
/**
 * Helper function for retrieving the visibility control settings.
 *
 * @package block-visibility
 * @since   1.0.0
 */
 
namespace BlockVisibility\Utils;

/**
 * Helper function for retrieving the visibility control settings.
 *
 * @since   1.0.0
 *
 * @param array   $settings               The core plugin settings
 * @return array  $visibility_controls    All visibility controls
 */
function get_visibility_controls( $settings ) {
    $visibility_controls = isset( $settings['visibility_controls'] )
        ? $settings['visibility_controls'] 
        : array();
    
    return $visibility_controls;
}