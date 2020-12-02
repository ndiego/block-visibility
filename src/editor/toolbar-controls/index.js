/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { PluginBlockSettingsMenuItem } from '@wordpress/edit-post';
import { __, sprintf } from '@wordpress/i18n';
import { useDispatch, withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import icons from './../../utils/icons';
import hasVisibilityControls from './../utils/has-visibility-controls';
import {
	isPluginSettingEnabled,
	getEnabledControls,
} from './../utils/setting-utilities';

/**
 * Adds the toolbar control for showing/hiding the selected block.
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}      Return the rendered JSX
 */
function ToolbarOptionsHideBlock( props ) {
	const { flashBlock, updateBlockAttributes } = useDispatch(
		'core/block-editor'
	);
	const { createSuccessNotice } = useDispatch( 'core/notices' );
	const {
		enableMenuItem,
		clientId,
		blockType,
		blockAttributes,
		settings,
	} = props;

	// Make sure the menu item is enabled and we have recieved a block type.
	if ( ! enableMenuItem || ! blockType ) {
		return null;
	}

	const enableToolbarControls = isPluginSettingEnabled(
		settings,
		'enable_toolbar_controls'
	);
	const hasVisibility = hasVisibilityControls(
		settings,
		blockType.name,
		blockAttributes
	);
	const enabledControls = getEnabledControls( settings );

	// As of v1.1.0 we only have hide block controls.
	if (
		! enableToolbarControls ||
		! hasVisibility ||
		! enabledControls.includes( 'hide_block' )
	) {
		return null;
	}

	const { blockVisibility } = blockAttributes;
	const { hideBlock } = blockVisibility;
	const icon = hideBlock ? icons.visibilityAlt : icons.visibilityHiddenAlt;
	const label = hideBlock
		? __( 'Enable block', 'block-visibility' )
		: __( 'Hide block', 'block-visibility' );
	const title = blockType.title;
	/* eslint-disable */
	const notice = hideBlock
		? sprintf(
			// Translators: Name of the block being copied, e.g. "Paragraph".
			__( '"%s" is now visible.' ),
			title
		)
		: sprintf(
			// Translators: Name of the block being cut, e.g. "Paragraph".
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
		<PluginBlockSettingsMenuItem
			icon={ icon }
			label={ label }
			onClick={ handler }
		/>
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

	const settings = getEntityRecord( 'block-visibility/v1', 'settings' );
	const clientIds = getSelectedBlockClientIds();
	// We only want to enable visibility editing if only one block is selected.
	const enableMenuItem = ! hasMultiSelection();
	// Always retrieve first client id, even if there are multiple.
	const clientId = clientIds.length === 0 ? null : clientIds[ 0 ];
	const blockType = getBlockType( getBlockName( clientId ) );
	const blockAttributes = getBlockAttributes( clientId );

	return { enableMenuItem, clientId, blockType, blockAttributes, settings };
} )( ToolbarOptionsHideBlock );
