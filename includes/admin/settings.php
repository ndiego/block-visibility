<?php
/**
 * Add the plugin settings page.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Admin;

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
        <div id="bv-settings-container"></div>
    <?php
}

/**
 * Enqueue settings page scripts and styles
 *
 * @since 1.0.0
 */
function enqueue_settings_assets() {

    if ( ! isset( $_GET['page'] ) || 'block-visibility-settings' !== $_GET['page'] ) {
        return;
    }

    // Scripts.
	$asset_file = get_asset_file( 'dist/bv-settings' );

	wp_enqueue_script(
		'bv-setting-scripts',
		BV_PLUGIN_URL . 'dist/bv-settings.js',
		array_merge( $asset_file['dependencies'], array( 'wp-api' ) ),
		$asset_file['version'],
		true
	);

    // Styles.
    $asset_file = get_asset_file( 'dist/bv-setting-styles' );

    wp_enqueue_style(
        'bv-setting-styles',
        BV_PLUGIN_URL . 'dist/bv-setting-styles.css',
        [ 'wp-edit-blocks' ],
        $asset_file['version']
    );

    $plugin_variables = array(
        'version'    => BV_VERSION,
        'reviewUrl'  => BV_REVIEW_URL,
        'supportUrl' => BV_SUPPORT_URL,
    );

    // Create a global variable to hold all our plugin variables, not ideal,
    // but does the trick for now...
    $stringified_plugin_variables = "const blockVisibilityVariables = " . wp_json_encode( $plugin_variables ) . ";";

    wp_add_inline_script(
        'bv-setting-scripts',
        $stringified_plugin_variables,
        'after'
    );


    // Get all the registed block categories
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
    do_action( 'enqueue_block_editor_assets' );

    // Core class used for interacting with block types.
    // https://developer.wordpress.org/reference/classes/wp_block_type_registry/
    $block_registry = \WP_Block_Type_Registry::get_instance();

    foreach ( $block_registry->get_all_registered() as $block_name => $block_type ) {

        // Front-end script.
        if ( ! empty( $block_type->editor_script ) ) {
            wp_enqueue_script( $block_type->editor_script );
        }
    }

}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_settings_assets' );
