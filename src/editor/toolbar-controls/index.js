/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { BlockSettingsMenuControls } from '@wordpress/block-editor';
import { MenuItem } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch, withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import icons from './../../utils/icons';
import hasVisibilityControls from './../utils/has-visibility-controls';
import hasPermission from './../utils/has-permission';
import isPluginSettingEnabled from '../utils/is-plugin-setting-enabled';
import getEnabledControls from './../../utils/get-enabled-controls';

/**
 * Adds the toolbar control for showing/hiding the selected block.
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}      Return the rendered JSX
 */
function ToolbarControls( props ) {
	const { flashBlock, updateBlockAttributes } =
		useDispatch( 'core/block-editor' );
	const { createSuccessNotice } = useDispatch( 'core/notices' );
	const {
		enableMenuItem,
		clientId,
		blockType,
		blockAttributes,
		settings,
		variables,
	} = props;

	if ( settings === 'fetching' || variables === 'fetching' ) {
		return null;
	}

	if ( ! hasPermission( settings, variables ) ) {
		return null;
	}

	// Make sure the menu item is enabled and we have received a block type.
	if ( ! enableMenuItem || ! blockType ) {
		return null;
	}

	// There are a few core blocks that are not compatible.
	const incompatibleBlocks = [ 'core/legacy-widget' ];
	const blockIsIncompatible = incompatibleBlocks.includes( blockType.name );

	if ( blockIsIncompatible ) {
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
	const icon = hideBlock ? icons.visibilityAlt : icons.visibilityHiddenAlt;
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
	const { getEntityRecord } = select( 'core' );
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

	// Fetch the plugin settings and variables.
	const settings =
		getEntityRecord( 'block-visibility/v1', 'settings' ) ?? 'fetching';
	const variables =
		getEntityRecord( 'block-visibility/v1', 'variables' ) ?? 'fetching';

	return {
		enableMenuItem,
		clientId,
		blockType,
		blockAttributes,
		settings,
		variables,
	};
} )( ToolbarControls );
