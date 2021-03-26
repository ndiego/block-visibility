<?php
/**
 * Adds a filter to the visibility test for the WP Fusion control.
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
 * Run test to see if block visibility should be WP Fusion tags.
 *
 * NOTE: This test is run after the User Role tests, if set, which handles the
 * majority of the logged-in vs. logged-out logic.
 *
 * @since 1.0.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $attributes The block visibility attributes.
 * @return boolean            Return true is the block should be visible, false if not.
 */
function wp_fusion_test( $is_visible, $settings, $attributes ) {

    // If the test is already false, or WP Fusion is not active, skip this test.
 	if ( ! $is_visible || ! function_exists( 'wp_fusion' ) ) {
 		return $is_visible;
 	}

    // If this control has been disabled, skip test.
    /*
    if ( ! is_control_enabled( $settings, 'hide_block' ) ) {
        return true;
    }
    */

    $has_control_sets = isset( $attributes['controlSets'] );

    if ( $has_control_sets ) {
        // Just retrieve the first set, need to update in future.
        $wp_fusion_atts =
            isset( $attributes['controlSets'][0]['controls']['wpFusion'] )
                ? $attributes['controlSets'][0]['controls']['wpFusion']
                : null;
        $user_role_atts =
            isset( $attributes['controlSets'][0]['controls']['userRole'] )
                ? $attributes['controlSets'][0]['controls']['userRole']
                : null;
    } else {
        // There are no WP Fusion settings, so skip tests.
        return true;
    }

    $visibility_by_role = isset( $user_role_atts['visibilityByRole'] )
        ? $user_role_atts['visibilityByRole']
        : 'public';

    // The block is to be shown only to logged-out users, so the WP Fusion
    // control does not apply, skip tests.
    if ( $visibility_by_role === 'logged-out' ) {
        return true;
    }

    $tags_any = isset( $wp_fusion_atts['tagsAny'] )
		? $wp_fusion_atts['tagsAny']
		: null;
    $tags_all = isset( $wp_fusion_atts['tagsAll'] )
		? $wp_fusion_atts['tagsAll']
		: null;
    $tags_not = isset( $wp_fusion_atts['tagsNot'] )
		? $wp_fusion_atts['tagsNot']
		: null;

    // There are no WP Fusion tags, so skip tests.
    if ( empty( $tags_any ) && empty( $tags_all ) && empty( $tags_not ) ) {
        return true;
    }

    // In WP Fusion the "exclude admins" option has been selected and the current user is an admin, so skip tests.
    if ( wp_fusion()->settings->get( 'exclude_admins' ) == true && current_user_can( 'manage_options' ) ) {
        return true;
    }

    // Tags can only be applied to logged-in users.
    if ( is_user_logged_in() ) {

        $user_tags = wp_fusion()->user->get_tags();

        // Only check the (any) and (all) tags when visibility_by_role is set
        // to logged-in or user-role.
        if (
            'logged-in' === $visibility_by_role ||
            'user-role' == $visibility_by_role
        ) {
            if ( ! empty( $tags_any ) ) {

                // Required tags (any)
                $result = array_intersect( $tags_any, $user_tags );

                if ( empty( $result ) ) {
                    return false;
                }
            }

            if ( ! empty( $widget_tags_all ) ) {

                // Required tags (all)
                $result = array_intersect( $tags_all, $user_tags );

                // ??? The user must have all the seleted tags but could also have more. The Elementor code had a strict !=
                if ( count( $result ) < count( $tags_all ) ) {
                    return false;
                }
            }
        }

        // Check the (not) tags on all visibility_by_role settings.
        if ( ! empty( $tags_not ) ) {

            // Required tags (not)
            $result = array_intersect( $tags_not, $user_tags );

            if ( ! empty( $result ) ) {
                return false;
            }
        }
    }

    return true;
}

// Run all integration tests at "15" priority, which is after the main controls,
// but before the final "hide block" tests.
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\wp_fusion_test', 15, 3 );
