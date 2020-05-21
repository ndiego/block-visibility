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


class EditorVisibilityControls extends Component {
	
	constructor() {
		super( ...arguments );
	}
	
	render() {
		const { attributes, setAttributes } = this.props;
		const { blockVisibility } = attributes;
		const {
			hideBlock,
			visibilityByRole,
		} = blockVisibility;
		
		console.log( this.props );
		
		return(
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
					<div>
						Role settings
					</div>
				) }
			</PanelBody>
			</InspectorControls>
		)
	}
}

export default withSelect( ( select ) => {
	const {
		getCategories,
		getBlockTypes,
		hasBlockSupport,
	} = select( 'core/blocks' );

	return {
		blockTypes: getBlockTypes(),
		categories: getCategories(),
		hasBlockSupport
	};
} )( EditorVisibilityControls );