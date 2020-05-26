/**
 * External dependencies
 */
import { has } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody } from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import { useEntityProp } from "@wordpress/core-data";

/**
 * Internal dependencies
 */
import HideBlock from './hide-block';
import VisibilityByRole from './visibility-by-role';

function VisibilityInspectorControls( props ) {
	
	// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
	const [ blockVisibilitySettings, setBlockVisibilitySettings ] = useEntityProp( 
		'root', 
		'site', 
		'block_visibility_settings' 
	);

	// Need to wait until the main settings object is loaded.
	const disabledBlocks = blockVisibilitySettings ? blockVisibilitySettings.disabled_blocks : null;

	// Make sure we have the disabled blocks setting, otherwise just abort. 
	// Something is not working properly
	if ( ! disabledBlocks ) {
		return null;
	}
	
	// @// TODO: remove
	//console.log( props.name );
	//console.log( props );
	
	const { name, attributes, setAttributes, blockTypes, hasBlockSupport } = props;
	const { blockVisibility } = attributes;
	const blockDisabled = disabledBlocks.includes( name );
	const isAllowed = has( attributes, 'blockVisibility' );
	
	// If the visibility settings have been disabled for the block type or the
	// block type does not have the blockVisibility attribute registered, abort
	if ( blockDisabled || ! isAllowed ) {		
		return null;
	}
	
	const {
		hideBlock,
		visibilityByRole,
	} = blockVisibility;
	
	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Visibility', 'block-visibility' ) }
				className='bv-settings'
				initialOpen={ false }
			>
				<HideBlock { ...props } />
				{ ! hideBlock && (
					<VisibilityByRole { ...props } />
				) }
			</PanelBody>
		</InspectorControls>
	);
}

export default VisibilityInspectorControls;
