<?php
/**
 * Add assets for the block editor
 *
 * @package block-visibility
 * @since   1.0.0
 */
 
namespace BlockVisibility\Admin;

use function BlockVisibility\Utils\get_asset_file as get_asset_file;
use function BlockVisibility\Utils\get_user_roles as get_user_roles;
 

/**
 * Enqueue plugin specific editor scripts and styles
 *
 * @since 1.0.0
 */
function enqueue_editor_assets() {
    
    /**
     * Since we are using admin_init, we need to make sure the js is only loaded  
     * on post edit, or new post screens.
     *
     * This will need to be adapted if we want to allow vsibility settings
     * within full-site editing and whatnot.
     */
    if ( ! is_edit_or_new_admin_page() ) {
        return;
    }
    
     // Scripts.
 	$asset_file = get_asset_file( 'dist/bv-editor' );

 	wp_enqueue_script(
 		'bv-editor-scripts',
 		BV_PLUGIN_URL . 'dist/bv-editor.js',
 		array_merge( $asset_file['dependencies'], array( 'wp-api' ) ),
 		$asset_file['version'],
 		false // Need false to ensure our filters can target third-party plugins
 	);
    
    $stringified_user_roles = "const blockVisibilityUserRoles = " . wp_json_encode( get_user_roles() ) . ";";
    
    wp_add_inline_script( 
        'bv-editor-scripts', 
        $stringified_user_roles, 
        'before' 
    );
    
    // Styles.
    $asset_file = get_asset_file( 'dist/bv-editor-styles' );

    wp_enqueue_style( 
        'bv-editor-styles', 
        BV_PLUGIN_URL . 'dist/bv-editor-styles.css', 
        array(),
        $asset_file['version']
    );
 }
 
 /**
  * Need to add at admin_init instead of the normal enqueue_block_editor_assets  
  * so that our attributes load for third-party blocks. Hopefully this will be 
  * resolved in future releases of WP. Using enqueue_block_editor_assets is the 
  * ideal implementation.
  */
 add_action( 'admin_init', __NAMESPACE__ . '\enqueue_editor_assets', 10000 );
 
 
 /**
  * Make sure we are either on a post edit screen, or new post screen
  *
  * @return bool true or false
  */
 function is_edit_or_new_admin_page() {
     global $pagenow;
     
     return ( 
        is_admin() && 
        ( $pagenow === 'post.php' || $pagenow === 'post-new.php' ) 
    );
 }
