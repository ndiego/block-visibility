
/**
 * External dependencies
 */
import { get, includes, invoke, isUndefined, pickBy, isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { dispatch, useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { store as coreStore } from '@wordpress/core-data';
import { Button, TextControl, ToggleControl } from '@wordpress/components';
import { PluginMoreMenuItem } from '@wordpress/edit-post';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import icons from './../../utils/icons';
import SearchControl from './search-control';

/**
 * Render the individual preset header in the presets modal.
 *
 * @since TBD
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function PresetsHeader( props ) {
    const { presetAttributes, setPresetAttributes, presets } = props;

    const { saveEntityRecord, deleteEntityRecord } = useDispatch( coreStore );
    const [ isDeleteModalOpen, setDeleteModalOpen ] = useState( '' );

    async function createPreset() {
        const postType = 'bv_preset';
        const title = presetAttributes?.title ?? __( 'untitled', 'block-visibility' );

        const preset = await saveEntityRecord( 'postType', postType, {
            title: title,
            status: 'publish',
            meta: {
                enable: false,
            }
        } );

        return {
            id: preset.id,
            type: postType,
            title: preset.title.rendered,
            enabled: preset.meta?.enable,
        };
    }

    function updatePreset( id ) {
        console.log( id );
    }

    function deletePreset( id ) {
        deleteEntityRecord(
            'postType',
            'bv_preset',
            id
        );
    }

    // <div>
    //     <span>{ title }</span>
    //     <span>{ preset.id }</span>
    //     <Button
    //         icon={ edit }
    //         onClick={ () => editPreset( preset.id ) }
    //     />
    //     <Button
    //         icon={ trash }
    //         onClick={ () => setDeleteModalOpen( true ) }
    //     />
    //     <DeletePresetModal
    //         isOpen={ isDeleteModalOpen }
    //         id={ preset.id }
    //     />
    // </div>

    const DeletePresetModal = ( isOpen, id ) => {

        if ( isOpen ) {
            return null;
        }
        return (

        <Modal
            className="block-visibility__confirmation-modal"
            title={ __(
                'Delete Preset?',
                'block-visibility'
            ) }
            onRequestClose={ () => setDeleteModalOpen( false ) }
            shouldCloseOnClickOutside={ false }
        >
            <p>
                { __(
                    'Any blocks that are currently hidden by this preset will become visible again if no other visibility controls are set. Deleting a visibility preset cannot be undone.',
                    'block-visibility'
                ) }
            </p>
            <div className="block-visibility__confirmation-modal--buttons">
                <Button
                    isSecondary
                    onClick={ () => setDeleteModalOpen( false ) }
                >
                    { __( 'Cancel', 'block-visibility' ) }
                </Button>
                <Button isPrimary onClick={ () => deletePreset( id ) }>
                    { __( 'Delete', 'block-visibility' ) }
                </Button>
            </div>
        </Modal>
        );
    }

    console.log( isDeleteModalOpen );

    const title = presetAttributes?.title ?? '';
    const enable = presetAttributes?.enable ?? true;

    return (
        <div className="preset-manager__content-header">
            <div className="preset-title">
                <TextControl
                    label={ __( 'Preset Title', 'block-visibility' ) }
                    hideLabelFromVision={ true }
                    value={ title }
                    onChange={ ( value ) => setPresetAttributes( { ...presetAttributes, title: value } ) }
                    placeholder={ __( 'Preset Title', 'block-visibility' ) }
                />
                <ToggleControl
                    label={ __( 'Enable preset', 'block-visibility' ) }
                    checked={ enable }
                    onChange={ () => setPresetAttributes( { ...presetAttributes, enable: ! enable } ) }
                    // help={ __(
                    //     'Blocks hidden with this preset will become visible again if disabled.',
                    //     'block-visibility'
                    // ) }
                />
            </div>
            <div className="preset-controls">
                <Button
                    isPrimary
                    onClick={ createPreset }
                >
                    { __( 'Publish', 'block-visibility' ) }
                </Button>
                <Button
                    isPrimary
                    onClick={ () => updatePreset( id ) }
                >
                    { __( 'Update', 'block-visibility' ) }
                </Button>
                <Button
                    isPrimary
                    onClick={ deletePreset }
                >
                    { __( 'Delete', 'block-visibility' ) }
                </Button>

            </div>
        </div>
    );
}
