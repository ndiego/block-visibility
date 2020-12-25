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

/**
 * Internal dependencies
 */
import VisibilityInspectorControls from './inspector-controls';
import ToolbarOptionsHideBlock from './toolbar-controls';
import './contextual-indicators';

/**
 * Add our custom entities for retreiving external data in the Block Editor.
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

/**
 * Add the visibility setting sttribute to selected blocks.
 *
 * @since 1.0.0
 * @param {Object}  settings All settings associated with a block type.
 * @return {Object} settings The updated array of settings.
 */
function blockVisibilityAttributes( settings ) {
	// The freeform (Classic Editor) block is incompatible because it does not
	// support custom attributes.
	if ( settings.name === 'core/freeform' ) {
		return settings;
	}

	// This is a global variable added to the page via PHP.
	const fullControlMode = blockVisibilityFullControlMode; // eslint-disable-line
	let visibilityAttributes = {
		blockVisibility: {
			type: 'object',
			properties: {
				hideBlock: {
					type: 'boolean',
				},
				visibilityByRole: {
					type: 'string',
				},
				hideOnRestrictedRoles: {
					type: 'boolean',
				},
				restrictedRoles: {
					type: 'array',
					items: {
						type: 'string',
					},
				},
				startDateTime: {
					type: 'string',
				},
				endDateTime: {
					type: 'string',
				},
			},
			default: {
				hideBlock: false,
				visibilityByRole: 'all',
				hideOnRestrictedRoles: false,
				restrictedRoles: [],
				startDateTime: '',
				endDateTime: '',
			},
		},
	};

	// Filter allows the premium plugin to add Block Visibility attributes.
	visibilityAttributes = applyFilters(
		'blockVisibility.visibilityAttributes',
		visibilityAttributes
	);

	// We don't want to enable visibility for blocks that cannot be added via
	// the inserter or is a child block. This excludes blocks such as reusable
	// blocks, individual column block, etc. But if we are in Full Control Mode
	// add settings to every block.
	if (
		fullControlMode ||
		( hasBlockSupport( settings, 'inserter', true ) &&
			! settings.hasOwnProperty( 'parent' ) )
	) {
		settings.attributes = assign(
			settings.attributes,
			visibilityAttributes
		);
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'block-visibility/attributes',
	blockVisibilityAttributes
);

/**
 * Filter the block edit object and add visibility controls to selected blocks.
 */
function blockVisibilityInspectorControls( BlockEdit ) {
	return ( props ) => (
		<>
			<BlockEdit { ...props } />
			<VisibilityInspectorControls { ...props } />
		</>
	);
}

addFilter(
	'editor.BlockEdit',
	'block-visibility/inspector-controls',
	blockVisibilityInspectorControls,
	100 // We want Visibility to appear right above Advanced controls
);

/**
 * Register all Block Visibility related plugins to the editor.
 */
registerPlugin( 'block-visibility-toolbar-options-hide-block', {
	render: ToolbarOptionsHideBlock,
} );
