/**
 * External dependencies
 */
import { has } from 'lodash';

/**
 * WordPress dependencies
 */
import { useEntityProp } from '@wordpress/core-data';

export function hasVisibilityControls( blockType, attributes ) {
    const [
        blockVisibilitySettings,
        setBlockVisibilitySettings // eslint-disable-line
    ] = useEntityProp( 'root', 'site', 'block_visibility_settings' );

    // Make sure the visibility settings have been retreived, otherwise abort.
    if ( ! blockVisibilitySettings) {
        return false;
    }

    const disabledBlocks = blockVisibilitySettings.disabled_blocks;
    const blockDisabled = disabledBlocks.includes( blockType );
    const isAllowed = has( attributes, 'blockVisibility' );

    // If the visibility settings have been disabled for the block type or the
    // block type does not have the blockVisibility attribute registered, abort.
    if ( blockDisabled || ! isAllowed ) {
        return false;
    }

    return true;
}
