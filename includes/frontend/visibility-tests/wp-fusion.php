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
        : null;

    // The block is to be shown only to logged-out users, so the WP Fusion
    // control does not apply, skip tests.
    if ( $visibility_by_role === 'logged-out' ) {
        return true;
    }

    //$visibility      = $element->get_settings( 'wpf_visibility' );
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

    // ???
    $can_access = true;

    if ( is_user_logged_in() ) {

        $user_tags = wp_fusion()->user->get_tags();

        if ( 'everyone' == $visibility || 'loggedin' == $visibility ) {

            // See if user has required tags

            if ( ! empty( $widget_tags ) ) {

                // Required tags (any)

                $result = array_intersect( $widget_tags, $user_tags );

                if ( empty( $result ) ) {
                    $can_access = false;
                }
            }

            if ( true == $can_access && ! empty( $widget_tags_all ) ) {

                // Required tags (all)

                $result = array_intersect( $widget_tags_all, $user_tags );

                if ( count( $result ) != count( $widget_tags_all ) ) {
                    $can_access = false;
                }
            }

            if ( true == $can_access && ! empty( $widget_tags_not ) ) {

                // Required tags (not)

                $result = array_intersect( $widget_tags_not, $user_tags );

                if ( ! empty( $result ) ) {
                    $can_access = false;
                }
            }
        } elseif ( 'loggedout' == $visibility ) {

            // The user is logged in but the widget is set to logged-out only
            $can_access = false;

        }
    } else {

        // Tags can only be applies to logged-in users, so if not logged-in, skip test.
        return true;
    }

    /*
    $can_access = apply_filters( 'wpf_elementor_can_access', $can_access, $element );

    global $post;

    if ( ! empty( $post ) ) {
        $post_id = $post->ID;
    } else {
        $post_id = 0;
    }

    $can_access = apply_filters( 'wpf_user_can_access', $can_access, wpf_get_current_user_id(), $post_id );

    if ( $can_access ) {
        return true;
    } else {
        return false;
    }
    */
}

// Run all integration tests at "15" priority, which is after the main controls,
// but before the final "hide block" tests.
add_filter( 'block_visibility_is_block_visible', __NAMESPACE__ . '\wp_fusion_test', 15, 3 );
