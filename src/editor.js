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
		
		// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
		const [ disabledBlocks, setDisabledBlocks ] = useEntityProp( 
			'root', 
			'site', 
			'bv_disabled_blocks' 
		);
		
		// Wait till disabledBlocks are loaded, then make sue the block is not part of the array
		if ( disabledBlocks && ! disabledBlocks.includes( props.name ) ) {
			return (
				<>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={ __( 'Visibility', 'block-visibility' ) }
							initialOpen={ false }
						>
							All of the visibility settings
						</PanelBody>
					</InspectorControls>
				</>
			);
		}
		
		return (
			<BlockEdit { ...props } />
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
