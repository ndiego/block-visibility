/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';
import { Slot, Fill } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './contextual-indicators';
import ToolbarControls from './toolbar-controls';
import VisibilityInspectorControls from './inspector-controls';
import { blockVisibilityProps } from './attributes';
import {
	ACF,
	DateTime,
	QueryString,
	ScreenSize,
	UserRole,
	WPFusion,
} from './../controls';

/**
 * Add our custom entities for retrieving external data in the Block Editor.
 *
 * @since 1.3.0
 */
dispatch( 'core' ).addEntities( [
	{
		label: __( 'Block Visibility Settings', 'block-visibility' ),
		kind: 'block-visibility/v1',
		name: 'settings',
		baseURL: '/block-visibility/v1/settings',
	},
	{
		label: __( 'Block Visibility Variables', 'block-visibility' ),
		kind: 'block-visibility/v1',
		name: 'variables',
		baseURL: '/block-visibility/v1/variables',
	},
] );

// Blocks that are not compatible at all with visibility controls.
const globallyRestricted = [
	'core/freeform',
	'core/legacy-widget',
	'core/widget-area',
];

// Blocks that are not compatible with visibility controls when used as Widgets.
const widgetAreaRestricted = [ 'core/html' ];

/**
 * Add the visibility setting sttribute to selected blocks.
 *
 * @since 1.0.0
 * @param {Object} settings All settings associated with a block type.
 * @return {Object} settings The updated array of settings.
 */
function addAttributes( settings ) {
	// The freeform (Classic Editor) block is incompatible because it does not
	// support custom attributes.
	if ( globallyRestricted.includes( settings.name ) ) {
		return settings;
	}

	// This is a global variable added to the page via PHP.
	const fullControlMode = blockVisibilityFullControlMode; // eslint-disable-line

	// Add the block visibility attributes.
	let attributes = {
		blockVisibility: {
			type: 'object',
			properties: blockVisibilityProps,
		},
	};

	// Filter allows the pro plugin to add Block Visibility attributes.
	attributes = applyFilters( 'blockVisibility.attributes', attributes );

	// We don't want to enable visibility for blocks that cannot be added via
	// the inserter or is a child block. This excludes blocks such as reusable
	// blocks, individual column block, etc. But if we are in Full Control Mode
	// add settings to every block.
	if (
		fullControlMode ||
		( hasBlockSupport( settings, 'inserter', true ) &&
			! settings.hasOwnProperty( 'parent' ) )
	) {
		settings.attributes = assign( settings.attributes, attributes );
		settings.supports = assign( settings.supports, {
			blockVisibility: true,
		} );
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'block-visibility/add-attributes',
	addAttributes
);

/**
 * Filter the BlockEdit object and add visibility controls to selected blocks.
 *
 * @since 1.0.0
 * @param {Object} BlockEdit
 */
function addInspectorControls( BlockEdit ) {
	return ( props ) => {
		return (
			<>
				<BlockEdit { ...props } />
				<VisibilityInspectorControls
					globallyRestricted={ globallyRestricted }
					widgetAreaRestricted={ widgetAreaRestricted }
					{ ...props }
				/>
			</>
		);
	};
}

addFilter(
	'editor.BlockEdit',
	'block-visibility/add-inspector-controls',
	addInspectorControls,
	100 // We want Visibility to appear right above Advanced controls
);

/**
 * Add the control set component to the preset manager in Block Visibility Pro.
 */
function addPresetManagerControlSet() {
	return ( props ) => {
		const { controlSetAtts, index } = props;

		// There needs to be a unique index for the Slots since we technically have
		// multiple of the same Slot.
		const uniqueIndex = 'multiple-' + controlSetAtts?.id;

		return (
			<Fill name={ 'PresetManagerControlSet-' + index }>
				<div className="control-set__controls">
					<Slot name={ 'ControlSetControlsTop-' + uniqueIndex } />

					<DateTime { ...props } />
					<UserRole { ...props } />
					<ScreenSize { ...props } />
					<QueryString { ...props } />

					<Slot name={ 'ControlSetControlsMiddle-' + uniqueIndex } />

					<ACF { ...props } />
					<WPFusion { ...props } />

					<Slot name={ 'ControlSetControlsBottom-' + uniqueIndex } />
				</div>
			</Fill>
		);
	};
}

addFilter(
	'blockVisibilityPro.addPresetManagerControlSet',
	'block-visibility/preset-manager-control-set',
	addPresetManagerControlSet
);

/**
 * Register all Block Visibility toolbar controls.
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 */
const getToolbarControls = ( props ) => (
	<ToolbarControls
		globallyRestricted={ globallyRestricted }
		widgetAreaRestricted={ widgetAreaRestricted }
		{ ...props }
	/>
);

registerPlugin( 'block-visibility-toolbar-options-hide-block', {
	render: getToolbarControls,
} );
