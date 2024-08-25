<?php
/**
 * Conditionally renders each block based on its visibility settings.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Frontend;

defined( 'ABSPATH' ) || exit;

/**
 * WordPress dependencies
 */
use WP_HTML_Tag_Processor;

/**
 * Internal dependencies
 */
use function BlockVisibility\Frontend\VisibilityTests\hide_block_test;
use function BlockVisibility\Frontend\VisibilityTests\visibility_presets_test;
use function BlockVisibility\Frontend\VisibilityTests\control_sets_test;
use function BlockVisibility\Frontend\VisibilityTests\control_sets_custom_classes;

/**
 * Check if the given block type is disabled via the visibility settings.
 *
 * @since 1.0.0
 *
 * @param array $settings The plugin settings.
 * @param array $block    The block info and attributes.
 * @return boolean        Is the block disabled or not.
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
 * Check if the given block has visibility settings.
 *
 * @since 1.0.0
 *
 * @param array $block The block info and attributes.
 * @return boolean     Are there visibility settings or not.
 */
function has_visibility_settings( $block ) {
	if ( isset( $block['attrs']['blockVisibility'] ) ) {
		return true;
	}

	return false;
}

/**
 * Check if the given block has visibility settings.
 *
 * @since 2.3.1
 *
 * @param array $settings   The plugin settings.
 * @param array $attributes The block attributes.
 * @return boolean          Should the block be visible or not.
 */
function is_visible( $settings, $attributes ) {

	// Apply all visibility tests.
	$is_visible = apply_filters(
		'block_visibility_is_block_visible',
		true,
		$settings,
		$attributes
	);

	// Check if local controls are enabled.
	$enable_local_controls =
		isset( $settings['visibility_controls']['general']['enable_local_controls'] )
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

	return $is_visible;
}

/**
 * Add custom block classes.
 *
 * @since 2.4.1
 *
 * @param array $settings   The plugin settings.
 * @param array $attributes The block attributes.
 * @return array            Custom classes to be added on render.
 */
function add_custom_classes( $settings, $attributes ) {

	// Apply all visibility tests.
	$custom_classes = apply_filters(
		'block_visibility_add_custom_classes',
		array(),
		$settings,
		$attributes
	);

	// Check if local controls are enabled.
	$enable_local_controls =
		isset( $settings['visibility_controls']['general']['enable_local_controls'] )
			? $settings['visibility_controls']['general']['enable_local_controls']
			: true;

	// If there are "local" control sets applied to the block, add custom classes.
	if ( $enable_local_controls && isset( $attributes['controlSets'] ) ) {
		$custom_classes = control_sets_custom_classes(
			$custom_classes,
			$settings,
			$attributes['controlSets'],
			'local'
		);
	}

	return $custom_classes;
}

/**
 * Append custom classes to the block frontend content. This is used primarily
 * by the Screen Size control.
 *
 * @since 3.6.0
 *
 * @param string $block_content   The block frontend output.
 * @param array  $content_classes Custom classes to be added in array form.
 * @return string                 Return the $block_content with the custom classes added.
 */
function append_content_classes( $block_content, $content_classes ) {

	// If there are no content classes, return the original block content.
	if ( empty( $content_classes ) ) {
		return $block_content;
	}

	// Remove duplicate classes and turn into string.
	$class_string = implode( ' ', array_unique( $content_classes ) );

	$tags = new WP_HTML_Tag_Processor( $block_content );

	if ( $tags->next_tag() ) {
		$tags->add_class( $class_string );
	}

	return $tags->get_updated_html();
}

/**
 * Check if the given block has visibility settings.
 *
 * @since 1.0.0
 *
 * @param string $block_content The block frontend output.
 * @param array  $block         The block info and attributes.
 * @return mixed                Return either the $block_content or nothing depending on visibility settings.
 */
function render_with_visibility( $block_content, $block ) {

	// Get the visibility settings.
	$attributes = $block['attrs']['blockVisibility'] ?? null;

	// Return early if the block does not have visibility settings.
	if ( ! $attributes ) {
		return $block_content;
	}

	// Get the plugin settings.
	$settings = get_option( 'block_visibility_settings' );

	// Return early if visibility control is disabled for this block type.
	if ( is_block_type_disabled( $settings, $block ) ) {
		return $block_content;
	}

	// Start with the hide block test. If it doesn't pass, the block is hidden.
	if ( ! hide_block_test( $settings, $attributes ) ) {
		return '';
	}

	// If the block is visible, add custom classes as needed.
	if ( is_visible( $settings, $attributes ) ) {

		$content_classes = add_custom_classes( $settings, $attributes );

		if ( ! empty( $content_classes ) ) {
			$block_content = append_content_classes( $block_content, $content_classes );
		}

		return $block_content;
	} else {
		return '';
	}
}
add_filter( 'render_block', __NAMESPACE__ . '\render_with_visibility', 10, 3 );

/**
 * Check if the given block-based widget has visibility settings. This needs to
 * be done separately, otherwise the widget markup will still be displayed even
 * if the block content is hidden.
 *
 * Issue Reference: https://github.com/ndiego/block-visibility/issues/26
 * Inspired by Jetpack: https://github.com/Automattic/jetpack/blob/master/projects/plugins/jetpack/modules/widget-visibility/widget-conditions.php
 *
 * @since 2.3.1
 *
 * @param array $instance The widget instance.
 * @return mixed          Return either the widget $instance or nothing depending on visibility settings.
 */
function render_block_widget_with_visibility( $instance ) {

	// Don't filter widgets from the REST API when it's called via the widgets admin page - otherwise they could get
	// filtered out and become impossible to edit.
	if ( strpos( wp_get_raw_referer(), '/wp-admin/widgets.php' ) && false !== strpos( $_SERVER['REQUEST_URI'], '/wp-json/' ) ) {
		return $instance;
	}

	// We only care about block-based widgets so check that we have blocks.
	if ( ! empty( $instance['content'] ) && has_blocks( $instance['content'] ) ) {
		$blocks = parse_blocks( $instance['content'] );

		// Get the plugin core settings.
		$settings   = get_option( 'block_visibility_settings' );
		$attributes = isset( $blocks[0]['attrs']['blockVisibility'] )
			? $blocks[0]['attrs']['blockVisibility']
			: null;

		// Make sure we are allowed to control visibility for this block type and
		// ensure the block actually has visibility settings set. Otherwise, return
		// the block content.
		if (
			is_block_type_disabled( $settings, $blocks[0] ) ||
			! isset( $attributes )
		) {
			return $instance;
		}

		// Start with the hide block test. If it doesn't pass, the block is hidden.
		if ( ! hide_block_test( $settings, $attributes ) ) {
			return false;
		}

		if ( is_visible( $settings, $attributes ) ) {
			return $instance;
		} else {
			return false;
		}
	}

	// This is not a block-based widget, so ignore.
	return $instance;
}
add_filter( 'widget_display_callback', __NAMESPACE__ . '\render_block_widget_with_visibility' );

// Run our core tests.
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/control-sets.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/hide-block.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/browser-device.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/cookie.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/date-time.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/location.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/metadata.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/query-string.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/referral-source.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/screen-size.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/url-path.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/user-role.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/visibility-presets.php';

// Run our integration tests.
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/acf.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/edd/edd.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/wp-fusion.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/woocommerce/woocommerce.php';

// Require utlity functions for tests.
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/frontend/visibility-tests/utils/value-compare-helpers.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/create-date-time.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/is-control-enabled.php';
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/utils/get-setting.php';
