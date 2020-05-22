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

import { 
	//getBlockTypes,
	hasBlockSupport
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import VisibilityInspectorControls from './editor/inspector-controls';

//import allowedBlockTypes from './utils/allowed-block-types';

function DisabledBlocks() {
	
	// Blocks manually disabled by the user, retrieved from settings
	const [ disabledBlocks, setDisabledBlocks ] = useEntityProp( 
		'root', 
		'site', 
		'bv_disabled_blocks' 
	);
	
	return disabledBlocks;
}

function SiteTitleEdit() {
	const [ title, setTitle ] = useEntityProp( 'root', 'site', 'title' );
	return title;
}

function blockVisibilityAttribute( settings ) {
	// We don't want to enable visibility for blocks that cannot be added via 
	// the inserter of is a child block. This excludes blocks such as reusable
	// blocks, individual column block, etc.
	if ( hasBlockSupport( settings, 'inserter', true ) && ! settings.parent ) {
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
	}
	
	return settings;
}

// Add the visibility attributes to all blocks.
addFilter(
	'blocks.registerBlockType',
	'outermost/block-visibility/block-visibility-attribute',
	blockVisibilityAttribute
);

const blockVisibilityEditorControls = createHigherOrderComponent( ( BlockEdit ) => {

    return ( props ) => {
		
		//console.log( props )
		// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
		const [ disabledBlocks, setDisabledBlocks ] = useEntityProp( 
			'root', 
			'site', 
			'bv_disabled_blocks' 
		);
		
		const notDisabled = disabledBlocks && ! disabledBlocks.includes( props.name );
		const isAllowed = hasBlockSupport( props.name, 'inserter', true ) && props.attributes.blockVisibility;
		
		//console.log( allowed );

		// Wait till disabledBlocks are loaded, then make sure the block is not part of the array
		if ( notDisabled && isAllowed ) {			
			return (
				<>
					<BlockEdit { ...props } />
					<VisibilityInspectorControls { ...props } />
				</>
			);
		}
		
		return (
			<BlockEdit { ...props } />
		);	
    };
}, 'blockVisibilityEditorControls' );

// Add visibility controls to all blocks.
addFilter(
	'editor.BlockEdit',
	'outermost/block-visibility/inspector-controls',
	blockVisibilityEditorControls,
	100
);
