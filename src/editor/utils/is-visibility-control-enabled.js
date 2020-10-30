/**
 * External dependencies
 */
import { has } from 'lodash';

/**
 * WordPress dependencies
 */


export function isSettingEnabled( settings, control, setting ) {

    // Make sure the visibility settings have been retreived, otherwise abort.
    if ( ! settings ) {
        return false;
    }

    const disabledBlocks = settings.disabled_blocks;
    const blockDisabled = disabledBlocks.includes( blockType );
    const isAllowed = has( attributes, 'blockVisibility' );

    // If the visibility settings have been disabled for the block type or the
    // block type does not have the blockVisibility attribute registered, abort.
    if ( blockDisabled || ! isAllowed ) {
        return false;
    }

    return true;
}
