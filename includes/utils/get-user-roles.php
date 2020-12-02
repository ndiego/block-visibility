<?php
/**
 * Helper function for retrieving all editable user roles.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Utils;

/**
 * Retrieves all editable user roles on the website
 *
 * @since 1.0.0
 *
 * @return array User $user_roles
 */
 function get_user_roles() {

	// Initialize the roles array with the default Public role.
	$roles = array(
		array(
			'name'  => 'public',
			'title' => __( 'Public (Logged-out Users)', 'block-visibility' ),
			'type'  => 'public',
		),
	);

	global $wp_roles;
	$all_roles = $wp_roles->roles;

	// Filters the list of editable roles.
	$editable_roles = apply_filters( 'editable_roles', $all_roles );

	$role_types = array(
		'administrator' => 'core',
		'editor'        => 'core',
		'author'        => 'core',
		'contributor'   => 'core',
		'subscriber'    => 'core',
	);

	foreach ( $editable_roles as $role_slug => $role_atts ) {
		$atts = array(
			'name'  => $role_slug,
			'title' => $role_atts['name'],
		);

		if ( array_key_exists( $role_slug, $role_types ) ) {
			$atts['type'] = $role_types[ $role_slug ];
		} else {
			$atts['type'] = 'custom';
		}

		$roles[] = $atts;
	}

	return $roles;
 }
