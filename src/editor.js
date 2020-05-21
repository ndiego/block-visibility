/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from "@wordpress/hooks";
import { Component, render } from '@wordpress/element';
import { 
	ToggleControl,
	SelectControl,
	RadioControl,
 	PanelBody,
} from "@wordpress/components";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useEntityProp } from "@wordpress/core-data";

import { withSelect } from '@wordpress/data';

//import { getBlockTypes } from '@wordpress/block';

/**
 * Internal dependencies
 */
import EditorVisibilityControls from './editor/inspector-controls';


const blockVisibilityAttribute = ( settings ) => {
	
	//console.log( settings.attributes );
	
	settings.attributes = assign( settings.attributes, {
		blockVisibility: {
			type: 'object',
			properties: {
				hideBlock: {
					type: 'boolean',
				},
				visibilityByRole: {
					type: 'string',
				}	
			},
			default: {
				hideBlock: false,
				visibilityByRole: 'all'
			}
		}
	} );
	
	return settings;
}

// Add the visibility attributes to all blocks.
addFilter(
	'blocks.registerBlockType',
	'outermost/block-visibility/block-visibility-attribute',
	blockVisibilityAttribute
);

const blockVisibilityControls = createHigherOrderComponent( ( BlockEdit ) => {

    return ( props ) => {
		//const { blockTypes } = props;
		//console.log( props )
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
					<EditorVisibilityControls { ...props } />
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





