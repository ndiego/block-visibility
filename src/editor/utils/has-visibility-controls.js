/**
 * WordPress dependencies
 */
import { getBlockSupport } from '@wordpress/blocks';

/**
 * Helper function for determining if a block type has visibility controls.
 *
 * @since 1.1.0
 * @param {Object} settings  All plugin settings
 * @param {string} blockType The type of the block selected
 * @return {boolean}		 Whether the block has visibility controls or not
 */
export default function hasVisibilityControls( settings, blockType ) {
	// Make sure we have visibility settings, otherwise abort.
	if ( ! settings || 0 === settings.length ) {
		return false;
	}

	const disabledBlocks = settings.disabled_blocks;
	const blockDisabled = disabledBlocks.includes( blockType );
	const blockSupported = getBlockSupport(
		blockType,
		'blockVisibility',
		false
	);

	// If the visibility settings have been disabled for the block type or the
	// block type does not support blockVisibility, abort.
	if ( blockDisabled || ! blockSupported ) {
		return false;
	}

	return true;
}
