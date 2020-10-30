/**
 * External dependencies
 */
import { has, filter, assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { PluginBlockSettingsMenuItem } from '@wordpress/edit-post';

import { __ } from '@wordpress/i18n';
import { hasBlockSupport } from '@wordpress/blocks';
import { useDispatch, useSelect, dispatch, withSelect } from '@wordpress/data';

import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { isSettingEnabled } from './utils/is-setting-enabled';
import { isVisibilityControlEnabled } from './utils/is-visibility-control-enabled';
import { hasVisibilityControls } from './utils/has-visibility-controls';
import icons from './../icons';

export function ToolbarOptionsHideBlock( props ) {
    const { enableMenuItem, clientId, blockType, blockAttributes } = props;

    // Make sure the menu item is enabled and we have recieved a block type.
    if ( ! enableMenuItem || ! blockType ) {
        return null;
    }

    const [
        blockVisibilitySettings,
        setBlockVisibilitySettings // eslint-disable-line
    ] = useEntityProp( 'root', 'site', 'block_visibility_settings' );


    if ( ! isSettingEnabled( blockVisibilitySettings, 'enable_toolbar_controls' ) ) {
        return null;
    }
    /*
    if ( ! isVisibilityControlEnabled( blockVisibilitySettings, 'hide_block' ) ) {
        return null;
    }
    */
    if ( ! hasVisibilityControls( blockVisibilitySettings, blockType.name, blockAttributes ) ) {
        return null;
    }

    const { blockVisibility } = blockAttributes;
    const { hideBlock } = blockVisibility;
    const icon = hideBlock ? icons.visibilityAlt : icons.visibilityHiddenAlt
    const label =
        hideBlock
            ? __( 'Enable block', 'block-visibility' )
            : __( 'Hide block', 'block-visibility' );
    const title = blockType.title;
    const notice =
        hideBlock
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

    const { flashBlock, updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );
    const { createSuccessNotice } = useDispatch( 'core/notices' );

    const handler = () => {
        updateBlockAttributes(
            clientId,
            { blockVisibility: assign(
                { ...blockVisibility},
                { hideBlock: ! hideBlock }
            ) }
        );
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
	const {
        getBlockName,
        getSelectedBlockClientIds,
        getBlockAttributes,
        hasMultiSelection,
	} = select( 'core/block-editor' );

    const { getBlockType } = select( 'core/blocks' );
    const clientIds = getSelectedBlockClientIds();

    // We only want to enable visibility editing if only one block is selected.
    const enableMenuItem = ! hasMultiSelection();

    const clientId = clientIds.length === 0 ? null : clientIds[0];
    const blockType = getBlockType( getBlockName( clientId ) );
    const blockAttributes = getBlockAttributes( clientId );

	return {
        enableMenuItem: enableMenuItem,
		clientId: clientId,
        blockType: blockType,
        blockAttributes: blockAttributes,
	};
} )( ToolbarOptionsHideBlock );
