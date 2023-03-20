/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import {
	getPlugins,
	registerPlugin,
	unregisterPlugin,
} from '@wordpress/plugins';
import { Modal } from '@wordpress/components';
import { PluginMoreMenuItem } from '@wordpress/edit-post';

/**
 * Internal dependencies
 */
import './contextual-indicators';
import ToolbarControls from './toolbar-controls';
import PresetManager from './preset-manager';
import VisibilityInspectorControls from './inspector-controls';
import { blockVisibilityProps } from './attributes';
import { visibilityAlt } from './../utils/icons';

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

/**
 * Add the visibility presets manager button to Block Editor more menu.
 */
function PresetManagerButton() {
	const [ isModalOpen, setModalOpen ] = useState( false );

	const { variables } = useSelect( ( select ) => {
		const { getEntityRecord } = select( coreStore );

		return {
			variables: getEntityRecord( 'block-visibility/v1', 'variables' ),
		};
	}, [] );

	const roles = variables?.current_users_roles ?? [];
	let canEdit = false;

	// While roles should always be an array, double check.
	if ( Array.isArray( roles ) ) {
		const allowedRoles = [ 'super-admin', 'administrator', 'editor' ];
		canEdit = roles.some( ( role ) => allowedRoles.includes( role ) );
	} else {
		// Temporary patch to correct for third-party plugin conflict.
		// @TODO remove once conflict is resolved.
		canEdit = true;
	}

	if ( ! canEdit ) {
		return null;
	}

	// Editor plugins are not supported in the block-based Widget Editor.
	// Note: pagenow is a global variable provided by WordPress.
	if ( pagenow === 'widgets' ) { // eslint-disable-line
		return null;
	}

	return (
		<>
			<PluginMoreMenuItem
				icon={ visibilityAlt }
				onClick={ () => setModalOpen( true ) }
			>
				{ __( 'Block Visibility Presets', 'block-visibility' ) }
			</PluginMoreMenuItem>
			{ isModalOpen && (
				<Modal
					className="block-visibility__preset-manager-modal"
					title={ __(
						'Block Visibility Presets',
						'block-visibility'
					) }
					onRequestClose={ () => setModalOpen( false ) }
					shouldCloseOnClickOutside={ false }
					isFullScreen
				>
					<PresetManager />
				</Modal>
			) }
		</>
	);
}

registerPlugin( 'block-visibility-preset-manager', {
	render: PresetManagerButton,
} );

// Unregister the presets button added by the Pro add-on.
if (
	getPlugins().filter(
		( plugin ) => plugin.name === 'block-visibility-pro-preset-manager'
	).length !== 0
) {
	unregisterPlugin( 'block-visibility-pro-preset-manager' );
}
