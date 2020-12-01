/**
 * External dependencies
 */
import { has, includes } from 'lodash';

/**
 * Helper function for determining if a block type has visibility controls.
 *
 * @since 1.1.0
 * @param {Object} settings   All plugin settings
 * @param {string} blockType  The type of the block selected
 * @param {Object} attributes All the attributes of selected block
 * @return {boolean}		  Whether the block has visibility controls or not
 */
export function hasVisibilityControls( settings, blockType, attributes ) {
	// Make sure we have visibility settings, otherwise abort.
	if ( ! settings || 0 === settings.length ) {
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
