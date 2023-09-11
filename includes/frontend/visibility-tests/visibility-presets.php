<?php
/**
 * Adds a filter to the visibility test for control sets.
 *
 * @package block-visibility
 * @since   3.0.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled;

/**
 * Run the visibility presets test.
 *
 * @since 3.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $attributes All the block attributes.
 * @return boolean            Return true if the block should be visible, false if not.
 */
function visibility_presets_test( $is_visible, $settings, $attributes ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this control has been disabled, or there are no presets, skip test.
	if (
		! is_control_enabled( $settings, 'visibility_presets' )
		|| ! isset( $attributes['visibilityPresets'] )
	) {
		return true;
	}

	$presets =
		isset( $attributes['visibilityPresets']['presets'] )
			? $attributes['visibilityPresets']['presets']
			: array();

	// There are no visibility presets, skip tests.
	if ( ! is_array( $presets ) || 0 === count( $presets ) ) {
		return true;
	}

	$operator = isset( $attributes['visibilityPresets']['operator'] )
		? $attributes['visibilityPresets']['operator']
		: 'all';

	$hide_on_presets = isset( $attributes['visibilityPresets']['hideOnPresets'] )
		? $attributes['visibilityPresets']['hideOnPresets']
		: false;

	// Array of results for each preset.
	$presets_test_results = array();

	// Unlike other controls, all set presets need to pass for the block to be
	// visible. If any one fails, hide the block.
	foreach ( $presets as $preset ) {

		$preset_atts   = get_post_meta( $preset );
		$preset_status = get_post_status( $preset );

		// If the block has a preset that is not published, ignore it.
		if ( 'publish' !== $preset_status ) {
			continue;
		}

		$enable = isset( $preset_atts['enable'] )
			? $preset_atts['enable'][0] // Metadata is stored in arrays.
			: true;

		$hide_block = isset( $preset_atts['hide_block'] )
			? $preset_atts['hide_block'][0]
			: false;

		if ( $enable && ! $hide_block ) {

			$control_sets = isset( $preset_atts['control_sets'] )
				? $preset_atts['control_sets'][0]
				: array();

			// If there are control sets, they need to be unserialized.
			$control_sets = maybe_unserialize( $control_sets );

			$is_preset_visible = control_sets_test(
				$is_visible,
				$settings,
				$control_sets,
				'preset'
			);

			$presets_test_results[] = $is_preset_visible ? 'visible' : 'hidden';

		} elseif ( $enable && $hide_block ) {
			$presets_test_results[] = 'hidden';
		}
	}

	// If there are no enabled control sets, or if the control sets have no set
	// controls, there will be no results. Default to showing the block.
	if ( empty( $presets_test_results ) ) {
		return true;
	}

	if ( 'atLeastOne' === $operator ) {
		$one_visible = in_array( 'visible', $presets_test_results, true );

		// At least one enabled presets must be satisfied. As long as one preset
		// returns 'visible', show the block.
		if (
			( ! $hide_on_presets && ! $one_visible ) ||
			( $hide_on_presets && $one_visible )
		) {
			return false;
		} else {
			return true;
		}
	} elseif ( 'all' === $operator ) {
		$one_hidden = in_array( 'hidden', $presets_test_results, true );

		// All enabled presets must be satisfied. As long as one preset returns
		// 'hidden', hide the block.
		if (
			( ! $hide_on_presets && $one_hidden ) ||
			( $hide_on_presets && ! $one_hidden )
		) {
			return false;
		} else {
			return true;
		}
	} elseif ( 'none' === $operator ) {
		$one_visible = in_array( 'visible', $presets_test_results, true );

		// No enabled presets can be satisfied. As long as one preset returns
		// 'visible', hide the block.
		if (
			( ! $hide_on_presets && $one_visible ) ||
			( $hide_on_presets && ! $one_visible )
		) {
			return false;
		} else {
			return true;
		}
	} else {
		return true;
	}
}
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\visibility_presets_test', 10, 3 );

/**
 * Add custom block classes for each preset.
 *
 * @since 3.0.0
 *
 * @param array $custom_classes Existing custom classes to be added to the block.
 * @param array $settings       The core plugin settings.
 * @param array $attributes     All the block attributes.
 * @return boolean              Return true if the block should be visible, false if not.
 */
function visibility_presets_add_custom_classes( $custom_classes, $settings, $attributes ) {

	// If this control has been disabled, or there are no presets, skip test.
	if (
		! is_control_enabled( $settings, 'visibility_presets' )
		|| ! isset( $attributes['visibilityPresets'] )
	) {
		return $custom_classes;
	}

	$presets =
		isset( $attributes['visibilityPresets']['presets'] )
			? $attributes['visibilityPresets']['presets']
			: array();

	// There are no visibility presets, skip adding custom classes.
	if ( ! is_array( $presets ) || 0 === count( $presets ) ) {
		return $custom_classes;
	}

	// Loop through each preset and add classes. Duplicate classes are removed
	// automatically later.
	foreach ( $presets as $preset ) {

		$preset_atts   = get_post_meta( $preset );
		$preset_status = get_post_status( $preset );

		// If the block has a preset that is not published, ignore it.
		if ( 'publish' !== $preset_status ) {
			continue;
		}

		$enable = isset( $preset_atts['enable'] )
			? $preset_atts['enable'][0] // Metadata is stored in arrays.
			: true;

		$hide_block = isset( $preset_atts['hide_block'] )
			? $preset_atts['hide_block'][0]
			: false;

		if ( $enable && ! $hide_block ) {

			$control_sets = isset( $preset_atts['control_sets'] )
				? $preset_atts['control_sets'][0]
				: array();

			// If there are control sets, they need to be unserialized.
			$control_sets = maybe_unserialize( $control_sets );

			$custom_classes = control_sets_custom_classes(
				$custom_classes,
				$settings,
				$control_sets,
				'preset'
			);
		}
	}

	return $custom_classes;
}
add_filter( 'block_visibility_add_custom_classes', __NAMESPACE__ . '\visibility_presets_add_custom_classes', 10, 3 );
