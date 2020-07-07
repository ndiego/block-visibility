/**
 * External dependencies
 */
import { has, filter } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, Notice } from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import { useEntityProp } from "@wordpress/core-data";
import { 
	__experimentalCreateInterpolateElement,
	createInterpolateElement 
} from '@wordpress/element';

/**
 * Temporary solution until WP 5.5 is released with createInterpolateElement
 */
const interpolateElement = ( typeof createInterpolateElement === 'function' )
    ? createInterpolateElement 
    : __experimentalCreateInterpolateElement;

/**
 * Internal dependencies
 */
import HideBlock from './hide-block';
import VisibilityByRole from './visibility-by-role';

/**
 * Add the Visibility inspector control to each allowed block in the editor
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function VisibilityInspectorControls( props ) {
	
	// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
	const [ blockVisibilitySettings, setBlockVisibilitySettings ] = useEntityProp( 
		'root', 
		'site', 
		'block_visibility_settings' 
	);

	// Need to wait until the main settings object is loaded.
	const disabledBlocks = blockVisibilitySettings ? blockVisibilitySettings.disabled_blocks : null;
	const visibilityControls = blockVisibilitySettings ? blockVisibilitySettings.visibility_controls : null;

	// Make sure we have the disabled blocks setting, otherwise just abort. 
	// Something is not working properly
	if ( ! disabledBlocks ) {
		return null;
	}
	
	const { name, attributes, setAttributes, blockTypes, hasBlockSupport } = props;
	const { blockVisibility } = attributes;
	const blockDisabled = disabledBlocks.includes( name );
	const isAllowed = has( attributes, 'blockVisibility' );
	
	// If the visibility settings have been disabled for the block type or the
	// block type does not have the blockVisibility attribute registered, abort
	if ( blockDisabled || ! isAllowed ) {		
		return null;
	}
	
	const controlsEnabled = filter( visibilityControls, { enable: true } ).length;

	// Check is the hide block control is set, default to "true".
	const hideBlockEnable = visibilityControls?.hide_block?.enable ?? true;
	const showAdditionalControls = ( ! blockVisibility.hideBlock || ! hideBlockEnable ) ? true : false;

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Visibility', 'block-visibility' ) }
				className='bv-settings'
				initialOpen={ false }
			>
				<div className='bv-settings__controls'>
					{ controlsEnabled > 0 && (
						<>
							{ hideBlockEnable && (
								<HideBlock { ...props } />
							) }
							{ showAdditionalControls && (
								<VisibilityByRole 
									visibilityControls={ visibilityControls }
									{ ...props } 
								/>
								// More controls here in the future...
							) }
						</>
					) }
					{ ! controlsEnabled && (
						<Notice 
		                    status="warning"
		                    isDismissible={ false }
		                >
							{ interpolateElement(
								__( 
									'Looks like all Visibility Controls have been disabled. To control block visibility again, re-enable some <a>Visibility Controls</a>.', 
									'block-visibility' 
								),
								{
									a: <a href={ blockVisibilityVariables.settingsUrl } target="_blank" />,
								}
							) }
		                </Notice>
					) }
				</div>
			</PanelBody>
		</InspectorControls>
	);
}
