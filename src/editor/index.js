/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { useEntityRecord } from '@wordpress/core-data';
import { useState } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';
import { Modal } from '@wordpress/components';
import { useCommand } from '@wordpress/commands';

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
const globallyRestricted = applyFilters(
	'blockVisibility.globallyRestrictedBlockTypes',
	[ 'core/freeform', 'core/legacy-widget', 'core/widget-area' ]
);

// Blocks that are not compatible with visibility controls when used as Widgets.
const widgetAreaRestricted = applyFilters(
	'blockVisibility.widgetAreaRestrictedBlockTypes',
	[ 'core/html' ]
);

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
	addInspectorControls
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

wp.domReady( () => {
	/**
	 * Needed for backward compatibility.
	 * See: https://make.wordpress.org/core/2024/06/18/editor-unified-extensibility-apis-in-6-6/
	 *
	 * Unfortunately, we cannout use the import method implemented in v3.5.0,
	 * because this causes a block error in the Navigation block.
	 * See: https://github.com/ndiego/block-visibility/issues/111
	 *
	 * TODO: Remove once once WordPress 6.7 is released and the minimum required
	 * version of WordPress is updated to 6.6.
	 */
	const PluginMoreMenuItem =
		wp.editor?.PluginMoreMenuItem ??
		wp.editPost?.PluginMoreMenuItem ??
		wp.editSite?.PluginMoreMenuItem;

	/**
	 * Toggle the Preset Manager.
	 *
	 * Adds a sidebar button in the Post Editor and a Command Palette command.
	 */
	function TogglePresetManager() {
		const [ isModalOpen, setModalOpen ] = useState( false );
		const variablesData = useEntityRecord(
			'block-visibility/v1',
			'variables'
		);
		const roles = variablesData?.record?.current_users_roles ?? [];
		let canEdit = false;

		// Allow the Command Palette to open the Preset Manager.
		useCommand( {
			name: 'manage-visibility-presets',
			label: __( 'Manage Visibility Presets', 'block-visibility' ),
			icon: visibilityAlt,
			callback: () => setModalOpen( true ),
			context: 'block-editor',
		} );

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
		render: TogglePresetManager,
	} );
} );
