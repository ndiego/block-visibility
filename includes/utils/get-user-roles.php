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
 * @return array User $user_roles
*/
function get_user_roles() {

	// Initialize the roles array with the default Public role
	$roles = array(
		array(
			'name'  => 'public',
			'title' => __( 'Public (Logged-out Users)', 'block-visibility' ),
			'type'  => 'public'
		)
	);

	if ( ! function_exists( 'get_editable_roles' ) ) {
		return $roles;
	}

	// Need to add a filter here
	$role_types = array(
		'administrator' => 'core',
		'editor'        => 'core',
		'author'        => 'core',
		'contributor'   => 'core',
		'subscriber'    => 'core',
	);

	// Possible future implementation
	/*
	$role_types_demo = array(
		'core' => array(
			'name' => __( 'WordPress Core', 'block-visibility' ),
			'roles' => array(
				'administrator',
				'editor',
				'author',
				'contributor',
				'subscriber',
			),
		),
		'custom' => array(
			'name' => __( 'Custom', 'block-visibility' ),
			'roles' => array(),
		),
	);
	*/

	foreach ( get_editable_roles() as $role_slug => $role_atts ) {
		$atts = array(
			'name' => $role_slug,
			'title' => $role_atts[ 'name' ],
		);

		if ( array_key_exists( $role_slug, $role_types ) ) {
			$atts['type'] = $role_types[$role_slug];
		} else {
			$atts['type'] = 'custom';
		}

		$roles[] = $atts;
	}

	return $roles;
}
