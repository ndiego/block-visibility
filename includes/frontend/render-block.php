<?php
/**
 * Conditionally renders each block based on its visibility settings
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Frontend;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Frontend\VisibilityTests\hide_block_test as hide_block_test;
use function BlockVisibility\Frontend\VisibilityTests\visibility_presets_test as visibility_presets_test;
use function BlockVisibility\Frontend\VisibilityTests\control_sets_test as control_sets_test;

/**
 * Check if the given block type is disabled via the visibility settings
 *
 * @since 1.0.0
 *
 * @param array $settings The plugin settings.
 * @param array $block The block info and attributes.
 * @return boolean Is the block disabled or not
 */
function is_block_type_disabled( $settings, $block ) {
	$disabled_blocks = isset( $settings['disabled_blocks'] )
		? $settings['disabled_blocks']
		: false;

	if ( ! $disabled_blocks ) {
		return false;
	}

	if ( in_array( $block['blockName'], $disabled_blocks, true ) ) {
		return true;
	}

	return false;
}

/**
 * Check if the given block has visibility settings
 *
 * @since 1.0.0
 *
 * @param array $block The block info and attributes.
 * @return boolean Are there visibility settings or not
 */
function has_visibility_settings( $block ) {
	if ( isset( $block['attrs']['blockVisibility'] ) ) {
		return true;
	}

	return false;
}

/**
 * Check if the given block has visibility settings
 *
 * @since 1.0.0
 *
 * @param string $block_content The block frontend output.
 * @param array  $block The block info and attributes.
 * @return mixed Return either the $block_content or nothing depending on visibility settings.
 */
function render_with_visibility( $block_content, $block ) {

	// Get the plugin core settings.
	$settings   = get_option( 'block_visibility_settings' );
	$attributes = isset( $block['attrs']['blockVisibility'] )
		? $block['attrs']['blockVisibility']
		: null;

	// Make sure we are allowed to control visibility for this block type and
	// ensure the block actually has visibility settings set. Otherwise, return
	// the block content.
	if (
		is_block_type_disabled( $settings, $block ) ||
		! isset( $attributes )
	) {
		return $block_content;
	}

	// Start with the hide block test. If it doesn't pass, the block is hidden.
	if ( ! hide_block_test( $settings, $attributes ) ) {
		return '';
	}

	$is_visible = apply_filters(
		'block_visibility_is_block_visible',
		true,
		$settings,
		$attributes
	);

	// If Pro is active, allow local controls to be disabled in Pro.
	$enable_local_controls =
		isset( $settings['visibility_controls']['general']['enable_local_controls'] ) && class_exists( 'Block_Visibility_Pro' )
			? $settings['visibility_controls']['general']['enable_local_controls']
			: true;

	// If the block is not already hidden and there are "local" control sets
	// applied to the block, run the control sets test.
	if ( $is_visible && $enable_local_controls && isset( $attributes['controlSets'] ) ) {
		$is_visible = control_sets_test(
			$is_visible,
			$settings,
			$attributes['controlSets'],
			'local'
		);
	}

	if ( $is_visible ) {
		return $block_content;
	} else {
		return '';
	}
}
add_filter( 'render_block', __NAMESPACE__ . '\render_with_visibility', 10, 2 );

// Run our core tests.
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/control-sets.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/hide-block.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/date-time.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/screen-size.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/user-role.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/query-string.php';

// Run our integration tests.
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/acf.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/wp-fusion.php';

// Require utlity functions for tests.
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/create-date-time.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/is-control-enabled.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/get-setting.php';
