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

	/**
	 * Needed for server side rendered blocks since they are rendered via REST
	 * API endpoint. This endpoint calls the render function in the admin, whereas
	 * the render function is called directly on the frontend. The function
	 * is_admin() checks if a backend page was requested. In a REST API Request
	 * is no backend page, so the function returns false on REST API requests.
	 *
	 * Reference: wp-includes/rest-api.php line 302
	 */
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return $block_content;
	}

	// Get the plugin core settings.
	$settings = get_option( 'block_visibility_settings' );

	// Make sure we are allowed to control visibility for this block type and
	// ensure the block actually has visibility settings set.
	if (
		! is_block_type_disabled( $settings, $block ) &&
		has_visibility_settings( $block )
	) {
		$visibility_test = true;

		// All our visibility tests are run through this filter and this also
		// gives third-party developers access to override the visibility test.
		$visibility_test = apply_filters(
			'block_visibility_visibility_test',
			$visibility_test,
			$settings,
			$block
		);

		if ( $visibility_test ) {
			return $block_content;
		} else {
			return null;
		}
	}

	return $block_content;
}
add_filter( 'render_block', __NAMESPACE__ . '\render_with_visibility', 10, 2 );

// Run our tests.
require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/frontend/visibility-tests/hide-block.php';
require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/frontend/visibility-tests/visibility-by-role.php';
require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/frontend/visibility-tests/date-time.php';

// Require utlity functions for tests.
require_once BLOCK_VISIBILITY_PLUGIN_DIR . 'includes/utils/is-control-enabled.php';
