/**
 * External dependencies
 */
import { assign, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { 
	withFilters, 
	Spinner,
	__experimentalUseSlotFills as useSlotFills,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useEntityRecord } from '@wordpress/core-data';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import ControlsPanel from './controls-panel';
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
 */
export default function VisibilityInspectorControls( props ) {
	const {
		attributes,
		globallyRestricted,
		name,
		setAttributes,
		widgetAreaRestricted,
	} = props;
	const { getBlocks } = select( 'core/block-editor' );
	const settingsData = useEntityRecord( 'block-visibility/v1', 'settings' );
	const variablesData = useEntityRecord( 'block-visibility/v1', 'variables' );

	// Determine how many other panels have been slotted into the Settings tab.
	// see: https://github.com/WordPress/gutenberg/blob/d27c43fda419995a80b1cbdeafe2b24d9a0e2164/packages/block-editor/src/components/inspector-controls-tabs/use-inspector-controls-tabs.js#L52
	const settingFills = [
		...( useSlotFills( 'InspectorControls' ) || [] ),
		...( useSlotFills( 'InspectorControlsPosition' ) || [] ),
	];
	
	console.log( settingFills );

	// This is not consistent. When the page loads, the Visibility panel is not counted. 
	// But after clicking around to various blocks, the Editor starts counting the 
	// Visibility panel as a setting Slot. 
	const tab = settingFills.length > 1 ? 'settings' : 'styles';

	// Display a default panel with spinner when settings and variables are loading.
	if ( settingsData.isResolving || variablesData.isResolving ) {
		return (
			<InspectorControls group={ tab }>
				<div className="block-visibility__controls-panel">
					<div className="controls-panel-header">
						<h2>{ __( 'Visibility', 'block-visibility' ) }</h2>
						<div className="controls-panel-header__dropdown-menus">
							<Spinner />
						</div>
					</div>
				</div>
			</InspectorControls>
		);
	}

	const settings = settingsData.record;

	// Determine if we are in the Widget Editor (Not the best but all we got).
	const widgetAreas = getBlocks().filter(
		( block ) => block.name === 'core/widget-area'
	);

	const variables = {
		...variablesData.record,
		isWidgetEditor: widgetAreas.length > 0,
	};

	// There are a few core blocks that are not compatible either globally or
	// specifically in the block-based Widget Editor.
	if (
		( widgetAreaRestricted.includes( name ) &&
			variables?.isWidgetEditor ) ||
		globallyRestricted.includes( name )
	) {
		return null;
	}

	// Does the user haver permission to edit visibility settings and
	// does the block type have visibility controls?
	if (
		! hasPermission( settings, variables ) ||
		! hasVisibilityControls( settings, name )
	) {
		return null;
	}

	let enabledControls = getEnabledControls( settings, variables );
	const defaultControlSettings =
		settings?.plugin_settings?.default_controls ?? [];
	const defaultControls = [];

	if ( ! isEmpty( defaultControlSettings ) ) {
		enabledControls.forEach( ( control ) => {
			if ( defaultControlSettings.includes( control.settingSlug ) ) {
				defaultControls.push[ control.attributeSlug ]; // eslint-disable-line
			}
		} );
	}

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

	// Check if local controls are enabled.
	const enableLocalControls =
		settings?.visibility_controls?.general?.enable_local_controls ?? true;

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

	return (
		// Note that the core InspectorControls component is already making use
		// of SlotFill, and is "inside" of a <SlotFillProvider> component.
		// Therefore we can freely use SlofFill without needing to add the
		// provider ourselves.
		<InspectorControls group={ tab }>
			<div className="block-visibility__controls-panel">
				<ControlsPanel
					blockAtts={ blockAtts }
					controlSets={ controlSets }
					controlSetAtts={ controlSets[ 0 ] } // Ok for now since only one control set available.
					setControlSetAtts={ setControlSetAtts }
					enabledControls={ enabledControls }
					defaultControls={ defaultControls }
					settings={ settings }
					variables={ variables }
					{ ...props }
				/>
			</div>
			<AdditionalInspectorControls
				blockAtts={ blockAtts }
				enabledControls={ enabledControls }
				settings={ settings }
				variables={ variables }
				{ ...props }
			/>
		</InspectorControls>
	);
}
