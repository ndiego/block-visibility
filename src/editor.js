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
		
		console.log( props );
		
		const [ blocks, setBlocks ] = useEntityProp( 'root', 'site', 'bv_disable_all_blocks_new' );
		
		console.log( blocks ); 
		
        return (
            <>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody
						title={ __( 'Visibility', 'block-visibility' ) }
					>
                        My custom control
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
	blockVisibilityControls
);
