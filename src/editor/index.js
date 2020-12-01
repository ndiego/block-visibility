/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { hasBlockSupport } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';

import { __ } from '@wordpress/i18n';
import { addEntities } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import VisibilityInspectorControls from './inspector-controls';
import ToolbarOptionsHideBlock from './toolbar-controls';
import './contextual-indicators';

const dispatch = wp.data.dispatch;
dispatch( 'core' ).addEntities( [
	{
		label: __( 'Block Visibility Settings' ),
		kind: 'block-visibility/v1',
		name: 'settings',
		baseURL: '/block-visibility/v1/settings',
	}
]);

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
	visibilityAttributes = applyFilters(
		'blockVisibility.visibilityAttributes',
		visibilityAttributes
	);

	// We don't want to enable visibility for blocks that cannot be added via
	// the inserter or is a child block. This excludes blocks such as reusable
	// blocks, individual column block, etc. But if we are in Full Control Mode
	// add settings to every block
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
const blockVisibilityInspectorControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			return (
				<>
					<BlockEdit { ...props } />
					<VisibilityInspectorControls { ...props } />
				</>
			);
		};
	},
	'blockVisibilityInspectorControls'
);

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
