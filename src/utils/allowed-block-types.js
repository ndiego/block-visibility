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
import { InspectorControls } from "@wordpress/editor";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useEntityProp } from "@wordpress/core-data";

import { withSelect } from '@wordpress/data';

const allowedBlockTypes = ( props ) => {
	
	// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
	const [ disabledBlocks, setDisabledBlocks ] = useEntityProp( 
		'root', 
		'site', 
		'bv_disabled_blocks' 
	);
	
	//console.log( disabledBlocks );
	
	// Wait till disabledBlocks are loaded, then make sue the block is not part of the array
	if ( ! disabledBlocks && disabledBlocks.includes( props.name ) ) {
		return null;
	}
	
	const { 
		attributes, 
		setAttributes,
		blockTypes,
		hasBlockSupport
	} = props;
	
	const { blockVisibility } = attributes;
	
	const {
		hideBlock,
		visibilityByRole,
	} = blockVisibility;
	
	///console.log( props );
	
	return disabledBlocks;
}

export default withSelect( ( select ) => {
	const {
		getBlockTypes,
		hasBlockSupport,
	} = select( 'core/blocks' );

	return {
		blockTypes: getBlockTypes(),
		hasBlockSupport
	};
} )( allowedBlockTypes );

