<?php
/**
 * Add the plugin settings page.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Admin;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\get_asset_file as get_asset_file;

/**
 * Register the plugin settings page.
 *
 * @since 1.0.0
 */
function add_settings_page() {
	add_submenu_page(
		'options-general.php',
		__( 'Block Visibility', 'block-visibility' ),
		__( 'Block Visibility', 'block-visibility' ),
		'manage_options',
		'block-visibility-settings',
		__NAMESPACE__ . '\print_settings_page'
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\add_settings_page' );

/**
 * Print the settings page wrapper div. Content is generated via JSX.
 *
 * @since 1.0.0
 */
function print_settings_page() {
	?>
		<div id="block-visibility-settings-container"></div>
	<?php
}

/**
 * Enqueue settings page scripts and styles
 *
 * @since 1.0.0
 */
function enqueue_settings_assets() {

	// @codingStandardsIgnoreLine
	if ( ! isset( $_GET['page'] ) || 'block-visibility-settings' !== $_GET['page'] ) {
		return;
	}

	// Scripts.
	$asset_file = get_asset_file( 'dist/block-visibility-settings' );

	wp_enqueue_script(
		'block-visibility-setting-scripts',
		BV_PLUGIN_URL . 'dist/block-visibility-settings.js',
		array_merge( $asset_file['dependencies'], array( 'wp-api' ) ),
		$asset_file['version'],
		true
	);

	// Styles.
	$asset_file = get_asset_file( 'dist/block-visibility-setting-styles' );

	wp_enqueue_style(
		'block-visibility-setting-styles',
		BV_PLUGIN_URL . 'dist/block-visibility-setting-styles.css',
		array( 'wp-edit-blocks' ),
		$asset_file['version']
	);

	// @TODO convert to wp_add_inline_script.
	wp_localize_script(
		'wp-api',
		'wpApiSettings',
		array(
			'root'  => esc_url_raw( rest_url() ),
			'nonce' => wp_create_nonce( 'wp_rest' ),
		)
	);

	// Get all the registed block categories.
	$block_categories = array();

	if ( function_exists( 'gutenberg_get_block_categories' ) ) {
		$block_categories = gutenberg_get_block_categories( get_post() );
	} elseif ( function_exists( 'get_block_categories' ) ) {
		$block_categories = get_block_categories( get_post() );
	}

	wp_add_inline_script(
		'wp-blocks',
		sprintf(
			'wp.blocks.setCategories( %s );',
			wp_json_encode( $block_categories )
		),
		'after'
	);

	// Make sure all custom blocks are registered. This picks up all of the
	// custom blocks that are added to the site, otherwise you just get the
	// core blocks.
	// @codingStandardsIgnoreLine
	do_action( 'enqueue_block_editor_assets' );

	// Core class used for interacting with block types.
	// https://developer.wordpress.org/reference/classes/wp_block_type_registry/.
	$block_registry = \WP_Block_Type_Registry::get_instance();

	foreach ( $block_registry->get_all_registered() as $block_name => $block_type ) {

		// Front-end script.
		if ( ! empty( $block_type->editor_script ) ) {
			wp_enqueue_script( $block_type->editor_script );
		}
	}

}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_settings_assets' );
