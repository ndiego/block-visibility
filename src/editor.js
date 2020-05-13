/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from "@wordpress/hooks";
import { 
	SelectControl,
 	PanelBody
} from "@wordpress/components";

import { InspectorControls } from "@wordpress/editor";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useEntityProp } from '@wordpress/core-data';


const blockVisibilityControls = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
		
		//console.log( props.name );
		
		// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
		const [ blocks, setBlocks ] = useEntityProp( 'root', 'site', 'bv_disable_all_blocks_new' );
		
		// Idea is to check the props.name against blocks to make sure we should proceed
		//console.log( blocks ); 
		
        return (
            <>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody
						title={ __( 'Visibility', 'block-visibility' ) }
					>
                        All of the visibility settings
                    </PanelBody>
                </InspectorControls>
            </>
        );
    };
}, 'blockVisibilityControls' );

// Add visibility controls to all blocks.
addFilter(
	'editor.BlockEdit',
	'outermost/block-visibility/inspector-controls',
	blockVisibilityControls,
	100
);
