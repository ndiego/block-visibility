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
 	PanelBody
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/editor";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useEntityProp } from '@wordpress/core-data';


const blockVisibilityAttribute = ( settings ) => {
	
	//console.log( settings.attributes );
	
	settings.attributes = assign( settings.attributes, {
		blockVisibility: {
			type: 'object',
			properties: {
				hideBlock: {
					type: 'boolean',
				},
				hideLoggedIn: {
					type: 'boolean',
				},
				hideLoggedOut: {
					type: 'boolean',
				}	
			},
			default: {
				hideBlock: true,
				hideLoggedIn: false,
				hideLoggedOut: false,
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


class EditorVisibilityControls extends Component {
	
	constructor() {
		super( ...arguments );
	}
	
	render() {
		
		const {
			attributes,
			setAttributes
		} = this.props;
		
		const {
			blockVisibility,
		} = attributes;
		
		console.log( this.props );
		
		return(
			<PanelBody
				title={ __( 'Visibility', 'block-visibility' ) }
				initialOpen={ false }
			>
				<ToggleControl
					label={ __(
						'Hide block',
						'block-visibility'
					) }
					checked={ blockVisibility.hideBlock }
					onChange={ () => {
						const atts = { ...blockVisibility };
						atts.hideBlock = ! blockVisibility.hideBlock;
						setAttributes( { blockVisibility: atts } );
					} }
				/>
				<ToggleControl
					label={ __(
						'Hide for Logged In Users',
						'block-visibility'
					) }
					checked={ blockVisibility.hideBlock }
					onChange={ () => {
						const atts = { ...blockVisibility };
						atts.hideBlock = ! blockVisibility.hideBlock;
						setAttributes( { blockVisibility: atts } );
					} }
				/>
				<ToggleControl
					label={ __(
						'Hide for Logged Out Users',
						'block-visibility'
					) }
					checked={ blockVisibility.hideBlock }
					onChange={ () => {
						const atts = { ...blockVisibility };
						atts.hideBlock = ! blockVisibility.hideBlock;
						setAttributes( { blockVisibility: atts } );
					} }
				/>
				All of the visibility settings
			</PanelBody>
		)
	}
}

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
						<EditorVisibilityControls { ...props } />
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





