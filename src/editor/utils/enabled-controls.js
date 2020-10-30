/**
 * External dependencies
 */
import { has, filter } from 'lodash';

export function enabledControls( settings ) {

    // Make sure we have visibility settings, otherwise abort.
    if ( ! settings ) {
        return null;
    }

    const controls = [
        'hide_block',
        'visibility_by_role',
        'time_date',
        // Add additional controls here.
    ];

    const visibilityControls = settings.visibility_controls;

    const enabledControls = [];

    controls.forEach( function( control ) {
        const hasControl = has( visibilityControls, control );

        // If the control does not exist, assume true.
        if ( ! hasControl ) {
            enabledControls.push( control );
        }

        if ( visibilityControls[ control ]?.enable ?? true ) {
            enabledControls.push( control );
        }
    } )

    return enabledControls;
}
