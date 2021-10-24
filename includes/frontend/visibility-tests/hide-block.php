<?php
/**
 * Adds a filter to the visibility test for the Hide Block control.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled as is_control_enabled;

/**
 * Run test to see if the hide block setting is enabled for the block.
 *
 * This test is applied at a priority of 20 to try and ensure it goes last.
 * This should generally be the last test that is run and should override all
 * other tests.
 *
 * @since 1.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $attributes The block visibility attributes.
 * @return boolean            Return true if the block should be visible, false if not
 */
function hide_block_test( $is_visible, $settings, $attributes ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

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
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\hide_block_test', 20, 3 );
