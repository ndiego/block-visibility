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
 * @param array    $settings   The core plugin settings
 * @param array    $control    The main control we are testing
 * @param array    $subcontrol (Optional) The subcontrol we are testing
 * @return boolean             Is the control (or subcontrol) enabled?
 */
function is_control_enabled( $settings, $control, $subcontrol = 'enable' ) {
    
    if ( isset( $settings['visibility_controls'] ) ) {
        $visibility_controls = $settings['visibility_controls'];
    } else {
        // We want controls to be enabled by default, so if the visibility 
        // control settings are missing for some reason just return "true".
        return true;
    }
    
    // If the settings don't exist, again, we want to default to "true".
    if ( isset( $visibility_controls[$control][$subcontrol] ) ) {
        return $visibility_controls[$control][$subcontrol];
    } else {
        return true;
    }

}