<?php
/**
 * Add the plugin settings page.
 *
 * @package block-visibility
 * @since   1.0.0
 */
 
namespace BlockVisibility\Admin;

//use function BlockVisibility\Utils\get_asset_file;

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
    $disabled = get_option( 'block_visibility_settings' );
    $result= $disabled ? "true" : "false";
    echo $result;//echo print_r($php_blocks );
    ?>
        <div id="bv-settings-container"></div>
    <?php
}

/**
 * Enqueue settings page scripts and styles
 *
 * @since 1.0.0
 */
function enqueue_settings_scripts() {
    
    if ( ! isset( $_GET['page'] ) || 'block-visibility-settings' !== $_GET['page'] ) {
        return;
    }
    
    // Scripts.
	$filepath   = 'dist/bv-admin';
	$asset_file = get_asset_file( $filepath );

	wp_enqueue_script(
		'bv-admin-scripts',
		BV_PLUGIN_URL . $filepath . '.js',
		//array_merge( $asset_file['dependencies'], array( 'wp-api' ) ),
		//$asset_file['version'],
        array( 'wp-api', 'wp-i18n', 'wp-components', 'wp-element', 'wp-blocks', 'wp-block-library', 'wp-data', 'wp-compose', 'wp-block-editor' ),
        BV_VERSION,
		true
	);
    
    wp_enqueue_style( 
        'bv-admin-styles', 
        BV_PLUGIN_URL . 'dist/bv-admin-styles.css', 
        array( 'wp-components' ),
        BV_VERSION
    );
    
    // This picks up all of the custom blocks that are added to the site, otherwise you just get the core blocks
    // Make sure all blocks plugin were registered.
    $block_categories = array();
    if ( function_exists( 'gutenberg_get_block_categories' ) ) {
            $block_categories = gutenberg_get_block_categories( get_post() );
    } elseif ( function_exists( 'get_block_categories' ) ) {
            $block_categories = get_block_categories( get_post() );
    }
    wp_add_inline_script(
        'wp-blocks',
        sprintf( 'wp.blocks.setCategories( %s );', wp_json_encode( $block_categories ) ),
        'after'
    );
    
    // TODO: What does this do?????
    do_action( 'enqueue_block_editor_assets' );

    $block_registry = \WP_Block_Type_Registry::get_instance();
    foreach ( $block_registry->get_all_registered() as $block_name => $block_type ) {
        // Front-end script.
        if ( ! empty( $block_type->editor_script ) ) {
            wp_enqueue_script( $block_type->editor_script );
        }
    }

}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_settings_scripts' );

/** 
 * @// TODO: figure out why the asset path is not updated, might have to do with @wordress/scripts issue
 */
function get_asset_file( $filepath ) {
    $asset_path = BV_PLUGIN_DIR . $filepath . '.asset.php';

    return file_exists( $asset_path )
        ? include $asset_path
        : array(
            'dependencies' => array(),
            'version'      => BV_VERSION,
        );
}

/*
function register_settings() {
	register_setting(
		'block_visibility_settings',
		'bv_disable_all_blocks',
		array(
            'type'         => 'boolean',
			'show_in_rest' => true,
			'default'      => false,
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_settings' );
*/
// Get all blocks registered with PHP
//$block_types = WP_Block_Type_Registry::get_instance()->get_all_registered();