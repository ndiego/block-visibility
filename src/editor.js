/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { hasBlockSupport } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import VisibilityInspectorControls from './editor/inspector-controls';

/**
 * Add the visibility setting sttribute to selected blocks.
 * 
 * @since 1.0.0
 * @param {Object}  settings All settings associated with a block type.
 * @return {Object} settings The updated array of settings.
 */
function blockVisibilityAttribute( settings ) {
	
	// We don't want to enable visibility for blocks that cannot be added via
	// the inserter of is a child block. This excludes blocks such as reusable
	// blocks, individual column block, etc.
	if ( hasBlockSupport( settings, 'inserter', true ) && ! settings.hasOwnProperty( 'parent' ) ) {
		settings.attributes = assign( settings.attributes, {
			blockVisibility: {
				type: 'object',
				properties: {
					hideBlock: {
						type: 'boolean',
					},
					visibilityByRole: {
						type: 'string',
					},
					restrictedRoles: {
						type: 'array',
					}		
				},
				default: {
					hideBlock: false,
					visibilityByRole: 'all',
					restrictedRoles: []
				}
			}
		} );
	}
	
	return settings;
}

/**
 * Filter the block edit object and add visibility controls to selected blocks.
 */
const blockVisibilityEditorControls = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
		return (
			<>
				<BlockEdit { ...props } />
				<VisibilityInspectorControls { ...props } />
			</>
		);	
    };
}, 'blockVisibilityEditorControls' );


addFilter(
	'blocks.registerBlockType',
	'block-visibility/block-visibility-attribute',
	blockVisibilityAttribute,
);
addFilter(
	'editor.BlockEdit',
	'block-visibility/inspector-controls',
	blockVisibilityEditorControls,
	100 // We want Visibility to appear rigth above Advanced controls
);