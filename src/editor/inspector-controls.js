/**
 * External dependencies
 */
import { filter, assign, has } from 'lodash';

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
import { useEntityProp } from "@wordpress/core-data";
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import UserRoleControl from './user-role-control';

function VisibilityInspectorControls( props ) {
	
	// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
	const [ disabledBlocks, setDisabledBlocks ] = useEntityProp( 
		'root', 
		'site', 
		'bv_disabled_blocks' 
	);
	
	// Make sure we have the disabled blocks setting, otherwise just abort. 
	// Something is not working properly
	if ( ! disabledBlocks ) {
		return null;
	}
	
	const { name, attributes, setAttributes, blockTypes } = props;
	const { blockVisibility } = attributes;
	const blockDisabled = disabledBlocks.includes( name );
	
	//console.log( name );
	
	//const currentBlockType = _.filter( blockTypes, { 'name' : name } );
	//console.log( currentBlockType );
	// Make sure the visibility attribute exists
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
			initialOpen={ false }
			className='block-visibility-settings'
		>
			<ToggleControl
				label={ __(
					'Hide block',
					'block-visibility'
				) }
				checked={ hideBlock }
				onChange={ () => setAttributes( {
						blockVisibility: assign( 
							{ ...blockVisibility }, 
							{ hideBlock: ! hideBlock } 
						)
					} )
				}
				help={ __( 'Hides the block completely', 'block-visibility' ) }
			/>
			{ ! hideBlock && (
				<>
					<RadioControl
						label={ __( 'Visibility Control', 'block-visibility' ) }
						selected={ visibilityByRole }
						options={ [
							{
								label: (
									<div className="compound-radio-label">
										{ __( 'All', 'block-visibility' ) }
										<span>{ __( 'Visible to everyone', 'block-visibility' ) }</span>
									</div>
								),
								value: 'all',
							},
							{
								label: (
									<div className="compound-radio-label">
										{ __( 'Public', 'block-visibility' ) }
										<span>{ __( 'Visible to logged-out users', 'block-visibility' ) }</span>
									</div>
								),
								value: 'logged-out',
							},
							{
								label: (
									<div className="compound-radio-label">
										{ __( 'Private', 'block-visibility' ) }
										<span>{ __( 'Visible to logged-in users', 'block-visibility' ) }</span>
									</div>
								),
								value: 'logged-in',
							},
							{
								label: (
									<div className="compound-radio-label">
										{ __( 'User Role', 'block-visibility' ) }
										<span>{ __( 'Visible based on the role of logged-in users', 'block-visibility' ) }</span>
									</div>
								),
								value: 'user-role',
							},
						] }
						onChange={ ( value ) => setAttributes( {
								blockVisibility: assign( 
									{ ...blockVisibility }, 
									{ visibilityByRole: value } 
								)
							} )
						}
					/>
				</>
			) }
			{ ! hideBlock && visibilityByRole === 'user-role' && (
				<UserRoleControl
					{ ...props }
				/>
			) }
		</PanelBody>
		</InspectorControls>
	);
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
} )( VisibilityInspectorControls );
