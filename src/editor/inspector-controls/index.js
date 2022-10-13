/**
 * External dependencies
 */
import { assign, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { withFilters } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import ControlPanel from './control-panel';
import hasVisibilityControls from './../utils/has-visibility-controls';
import hasPermission from './../utils/has-permission';
import getEnabledControls from './../../utils/get-enabled-controls';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalInspectorControls = withFilters(
	'blockVisibility.addInspectorControls'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Add the Visibility inspector control to each allowed block in the editor
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function VisibilityInspectorControls( props ) {
	const { attributes, setAttributes, name, settings, variables, clientId } =
		props;

	if ( settings === 'fetching' || variables === 'fetching' ) {
		return null;
	}

	if (
		! hasPermission( settings, variables ) || // Does the user haver permission to edit visibility settings?
		! hasVisibilityControls( settings, name ) // Does the block type have visibility controls?
	) {
		return null;
	}

	let enabledControls = getEnabledControls( settings, variables );
	const defaultControlSettings =
		settings?.plugin_settings?.default_controls ?? [];
	let defaultControls = [];

	if ( ! isEmpty( defaultControlSettings ) ) {
		enabledControls.forEach( ( control ) => {
			if ( defaultControlSettings.includes( control.settingSlug ) ) {
				defaultControls.push[ control.attributeSlug ];
			}
		} );
	}

	//const blockAttributes = { ...attributes };
	let blockAtts = attributes?.blockVisibility;
	let controlSets = blockAtts?.controlSets ?? [];

	// Create the default control set if none exist.
	if ( controlSets.length === 0 ) {
		const defaultControlSet = [
			{
				id: 1,
				enable: true,
				controls: Object.fromEntries(
					defaultControls.map( ( control ) => [ control, {} ] )
				),
			},
		];
		controlSets = defaultControlSet;
		blockAtts = assign( { ...blockAtts }, { controlSets } );
	}

	// If Pro is active, allow local controls to be disabled in Pro.
	const enableLocalControls = variables?.is_pro
		? settings?.visibility_controls?.general?.enable_local_controls ?? true
		: true;

	// If local controls have been disabled, remove them from the array.
	if ( ! enableLocalControls ) {
		enabledControls = enabledControls.filter(
			( control ) =>
				control.attributeSlug === 'hideBlock' ||
				control.attributeSlug === 'visibilityPresets'
		);
	}

	// Set the control set attributes. This will need to be updated 
	// if multiple control sets are enabled.
	function setControlSetAtts( controlSetAtts ) {
		setAttributes( {
			blockVisibility: assign(
				{ ...attributes.blockVisibility },
				{ controlSets: [ ...[ controlSetAtts ] ] } // Ok for now since only one control set available.
			),
		} );
	}

	// There are a few core blocks that are not compatible.
	const incompatibleBlocks = [ 'core/legacy-widget' ];
	const blockIsIncompatible = incompatibleBlocks.includes( name );

	if ( blockIsIncompatible ) {
		return null;
	}

	return (
		// Note that the core InspectorControls component is already making use
		// of SlotFill, and is "inside" of a <SlotFillProvider> component.
		// Therefore we can freely use SlofFill without needing to add the
		// provider ourselves.
		<InspectorControls>
			<div className="block-visibility__control-panel">
				<ControlPanel
					controlSets={ controlSets }
					controlSetAtts={ controlSets[ 0 ] } // Ok for now since only one control set available.
					setControlSetAtts={ setControlSetAtts }
					enabledControls={ enabledControls }
					defaultControls={ defaultControls }
					{ ...props }
				/>
			</div>
			<AdditionalInspectorControls
				blockAtts={ blockAtts }
				enabledControls={ enabledControls }
				{ ...props }
			/>
		</InspectorControls>
	);
}

export default withSelect( ( select ) => {
	const { getEntityRecord } = select( 'core' );
	const settings =
		getEntityRecord( 'block-visibility/v1', 'settings' ) ?? 'fetching';
	const variables =
		getEntityRecord( 'block-visibility/v1', 'variables' ) ?? 'fetching';

	return { settings, variables };
} )( VisibilityInspectorControls );
