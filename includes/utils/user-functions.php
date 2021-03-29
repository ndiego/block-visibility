<?php
/**
 * Helper function for retrieving all editable user roles.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Utils;

defined( 'ABSPATH' ) || exit;

/**
 * Retrieves all editable user roles on the website.
 *
 * @since 1.0.0
 *
 * @return array Array of all editable user roles.
 */
function get_user_roles() {

	$roles = array();

	global $wp_roles;
	$all_roles = $wp_roles->roles;

	$role_types = array(
		'administrator' => 'core',
		'editor'        => 'core',
		'author'        => 'core',
		'contributor'   => 'core',
		'subscriber'    => 'core',
	);

	foreach ( $all_roles as $role_slug => $role_atts ) {
		$atts = array(
			'value' => $role_slug,
			'label' => $role_atts['name'],
		);

		if ( array_key_exists( $role_slug, $role_types ) ) {
			$atts['type'] = $role_types[ $role_slug ];
		} else {
			$atts['type'] = 'custom';
		}

		$roles[] = $atts;
	}

	// Add the logged-out role to the end.
	$roles[] = array(
		'value' => 'logged-out',
		'label' => __( 'None (Logged-out users)', 'block-visibility' ),
		'type'  => 'core', // Not really a core role, but a proxy for when a user has no roles.
	);

	// Filters the list of roles.
	$roles = apply_filters( 'block_visibility_user_roles', $roles );

	return $roles;
}

/**
 * Retrieves the role(s) of the current user.
 *
 * @since 1.3.0
 *
 * @return array The roles of the current user.
 */
function get_current_user_role() {
	$user_id = get_current_user_id();

	if ( $user_id ) {
		$user_info = get_userdata( $user_id );

		if ( $user_info ) {
			return $user_info->roles;
		}
	}

	return null;
}
