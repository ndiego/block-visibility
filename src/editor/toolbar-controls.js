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
import { hasVisibilityControls } from './utils/has-visibility-controls';
import { getEnabledControls } from './utils/get-enabled-controls';
import icons from './../icons';

export function ToolbarOptionsHideBlock( props ) {
    const { enableMenuItem, clientId, blockType, blockAttributes } = props;

    // Make sure the menu item is enabled and we have recieved a block type.
    if ( ! enableMenuItem || ! blockType ) {
        return null;
    }

    // Get plugin settings.
    const [
        blockVisibilitySettings,
        setBlockVisibilitySettings // eslint-disable-line
    ] = useEntityProp( 'root', 'site', 'block_visibility_settings' );
    const enableToolbarControls = isSettingEnabled(
        blockVisibilitySettings,
        'enable_toolbar_controls'
    );
    const hasVisibility = hasVisibilityControls(
        blockVisibilitySettings,
        blockType.name,
        blockAttributes
    );
    const enabledControls = getEnabledControls( blockVisibilitySettings );

    // As of v1.1.0 we only have hide block controls.
    if ( ! enableToolbarControls || ! hasVisibility || ! enabledControls.includes( 'hide_block' ) ) {
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
    // Always retrieve first client id, even if there are multiple.
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
