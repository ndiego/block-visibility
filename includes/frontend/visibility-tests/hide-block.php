<?php
/**
 * Tests if the Hide Block control is enabled.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled;

/**
 * Run test to see if the hide block setting is enabled for the block.
 *
 * This test is run before everything else.
 *
 * @since 1.0.0
 *
 * @param array $settings   The core plugin settings.
 * @param array $attributes The block visibility attributes.
 * @return boolean          Return true if the block should be visible, false if not
 */
function hide_block_test( $settings, $attributes ) {

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'hide_block' ) ) {
		return true;
	}

	if ( isset( $attributes['hideBlock'] ) && $attributes['hideBlock'] ) {
		return false;
	} else {
		return true;
	}
}
