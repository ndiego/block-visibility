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
	$asset_file = get_asset_file( 'build/block-visibility-settings' );

	wp_enqueue_script(
		'block-visibility-setting-scripts',
		BLOCK_VISIBILITY_PLUGIN_URL . 'build/block-visibility-settings.js',
		array_merge( $asset_file['dependencies'], array( 'wp-api' ) ),
		$asset_file['version'],
		true
	);

	// The full homepage url for use in fetching data from the REST api. The
	// full path is needed on websites where WordPress in installed in a
	// subdirectory. Without the full path, fetch( '/wp-json/...') fails.
	$home_url = 'const blockVisibilityRestUrl = "' . get_rest_url() . '";';

	wp_add_inline_script(
		'block-visibility-setting-scripts',
		$home_url,
		'before'
	);

	// Styles.
	$asset_file = get_asset_file( 'build/block-visibility-setting-styles' );

	wp_enqueue_style(
		'block-visibility-setting-styles',
		BLOCK_VISIBILITY_PLUGIN_URL . 'build/block-visibility-setting-styles.css',
		array( 'wp-edit-blocks' ),
		$asset_file['version']
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

/**
 * Add review notice in the admin footer on the plugin settings page.
 *
 * @since 1.5.2
 */
function custom_admin_footer() {
	return sprintf(
		// translators: %1$s star rating.
		__( 'Thank you for using Block Visibility. Please rate the plugin %1$s on %2$sWordPress.org%3$s to help us spread the word.', 'block-visibility' ),
		'<a href="https://wordpress.org/support/plugin/block-visibility/reviews/?filter=5#new-post" target="_blank" rel="noopener noreferrer">★★★★★</a>',
		'<a href="https://wordpress.org/support/plugin/block-visibility/reviews/?filter=5#new-post" target="_blank" rel="noopener">',
		'</a>'
	);
}
// @codingStandardsIgnoreLine
if ( isset( $_GET['page'] ) && 'block-visibility-settings' === $_GET['page'] ) {
	add_filter( 'admin_footer_text', __NAMESPACE__ . '\custom_admin_footer' );
}
