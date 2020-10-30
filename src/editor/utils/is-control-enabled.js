/**
 * External dependencies
 */
import { has } from 'lodash';

/**
 * WordPress dependencies
 */


export function isControlEnabled( settings, control, setting ) {

    // Make sure the visibility settings have been retreived, otherwise abort.
    if ( ! settings ) {
        return false;
    }

    const visibilityControls = settings.visibility_controls;
    const hasControl = has( visibilityControls, control );

    // Assume true if there is no control.
    if ( ! hasControl ) {
        return true;
    }

    const hasControlSetting = has( visibilityControls[ control ], setting );

    // Assume true if there is no control.
    if ( ! hasControlSetting ) {
        return true;
    }

    return visibilityControls[ control ][ setting ];
}
