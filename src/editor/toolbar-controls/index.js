/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { BlockSettingsMenuControls } from '@wordpress/block-editor';
import { MenuItem } from '@wordpress/components';
import { useEntityRecord } from '@wordpress/core-data';
import { useDispatch, withSelect, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import hasVisibilityControls from './../utils/has-visibility-controls';
import hasPermission from './../utils/has-permission';
import isPluginSettingEnabled from './../../utils/is-plugin-setting-enabled';
import getEnabledControls from './../../utils/get-enabled-controls';
import { visibilityAlt, visibilityHiddenAlt } from './../../utils/icons';

/**
 * Adds the toolbar control for showing/hiding the selected block.
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 */
function ToolbarControls( props ) {
	const { flashBlock, updateBlockAttributes } =
		useDispatch( 'core/block-editor' );
	const { createSuccessNotice } = useDispatch( 'core/notices' );
	const {
		blockAttributes,
		blockType,
		clientId,
		enableMenuItem,
		globallyRestricted,
		widgetAreaRestricted,
	} = props;
	const settingsData = useEntityRecord( 'block-visibility/v1', 'settings' );
	const variablesData = useEntityRecord( 'block-visibility/v1', 'variables' );

	if ( ! settingsData.hasResolved || ! variablesData.hasResolved ) {
		return null;
	}

	const settings = settingsData.record;
	const { getBlocks } = select( 'core/block-editor' );

	// Determine if we are in the Widget Editor (Not the best but all we got).
	const widgetAreas = getBlocks().filter(
		( block ) => block.name === 'core/widget-area'
	);

	const variables = {
		...variablesData.record,
		isWidgetEditor: widgetAreas.length > 0,
	};

	if ( ! hasPermission( settings, variables ) ) {
		return null;
	}

	// Make sure the menu item is enabled and we have received a block type.
	if ( ! enableMenuItem || ! blockType ) {
		return null;
	}

	// There are a few core blocks that are not compatible either globally or
	// specifically in the block-based Widget Editor.
	if (
		( widgetAreaRestricted.includes( blockType.name ) &&
			variables?.isWidgetEditor ) ||
		globallyRestricted.includes( blockType.name )
	) {
		return null;
	}

	const enableToolbarControls = isPluginSettingEnabled(
		settings,
		'enable_toolbar_controls'
	);
	const hasVisibility = hasVisibilityControls( settings, blockType.name );
	const enabledControls = getEnabledControls( settings, variables );

	// As of v1.1.0 we only have hide block controls.
	if (
		! enableToolbarControls ||
		! hasVisibility ||
		! enabledControls.some(
			( control ) => control.settingSlug === 'hide_block'
		)
	) {
		return null;
	}

	const { blockVisibility } = blockAttributes;
	const hideBlock = blockVisibility?.hideBlock ?? false;
	const icon = hideBlock ? visibilityAlt : visibilityHiddenAlt;
	const label = hideBlock
		? __( 'Enable block', 'block-visibility' )
		: __( 'Hide block', 'block-visibility' );
	const title = blockType.title;
	/* eslint-disable */
	const notice = hideBlock
		? sprintf(
			// Translators: Name of the block being made visible, e.g. "Paragraph".
			__( '"%s" is now visible.' ),
			title
		)
		: sprintf(
			// Translators: Name of the block being hidden, e.g. "Paragraph".
			__( '"%s" is now hidden.' ),
			title
		);
	/* eslint-disable */

	const handler = () => {
		updateBlockAttributes( clientId, {
			blockVisibility: assign(
				{ ...blockVisibility },
				{ hideBlock: ! hideBlock }
			),
		} );
		flashBlock( clientId );
		createSuccessNotice( notice, { type: 'snackbar' } );
	};

	return (
		<BlockSettingsMenuControls>
			<MenuItem
				onClick={ handler }
				icon={ icon }
				label={ label }
			>
				{ label }
			</MenuItem>
		</BlockSettingsMenuControls>
	);
}

export default withSelect( ( select ) => {
	const {
		getBlockName,
		getSelectedBlockClientIds,
		getBlockAttributes,
		hasMultiSelection,
	} = select( 'core/block-editor' );
	const { getBlockType } = select( 'core/blocks' );

	// We only want to enable visibility editing if only one block is selected.
	const enableMenuItem = ! hasMultiSelection();

	// Always retrieve first client id, even if there are multiple.
	const clientIds = getSelectedBlockClientIds();
	const clientId = clientIds.length === 0 ? null : clientIds[ 0 ];

	// Get block type and all set attributes.
	const blockType = getBlockType( getBlockName( clientId ) );
	const blockAttributes = getBlockAttributes( clientId );

	return {
		enableMenuItem,
		clientId,
		blockType,
		blockAttributes,
	};
} )( ToolbarControls );
