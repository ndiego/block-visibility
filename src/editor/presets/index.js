/**
 * External dependencies
 */
import { assign, get, includes, invoke, isUndefined, pickBy, isEmpty } from 'lodash';

/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { dispatch, useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { store as coreStore } from '@wordpress/core-data';
import { Button, Modal, TextControl, ToggleControl } from '@wordpress/components';
import { PluginMoreMenuItem } from '@wordpress/edit-post';

/**
 * Internal dependencies.
 */
import PresetsSidebar from './sidebar';
import PresetsHeader from './header';
import PresetsControlSets from './control-sets';

export default function PresetsManager( props ) {

    const [ isModalOpen, setModalOpen ] = useState( false );

    const [ presetAttributes, setPresetAttributes ] = useState( {} );
	const { saveEntityRecord, deleteEntityRecord } = useDispatch( coreStore );
    const [ isDeleteModalOpen, setDeleteModalOpen ] = useState( '' );

    const { presets, settings, variables } = useSelect( ( select ) => {
            const { getEntityRecords, getEntityRecord, getMedia, getUsers } = select(
                coreStore
            );

            const presetQuery = pickBy(
                {
                    // categories: catIds,
                    // author: selectedAuthor,
                    // order,
                    // orderby: orderBy,
                    per_page: -1,
                },
                ( value ) => ! isUndefined( value )
            );

            const presets = getEntityRecords(
                'postType',
                'bv_preset',
                presetQuery
            ) ?? 'fetching';
            const variables = getEntityRecord(
                'block-visibility/v1',
                'variables'
            );
            const settings = getEntityRecord(
                'block-visibility/v1',
                'settings'
            );

            return { presets, settings, variables };
        },
        []
    );

    if ( ! presets && isEmpty( presets ) ) {
        return null;
    }

    console.log( presets );
    console.log( settings );
    console.log( variables );
    console.log( presetAttributes );


    function addNewPreset() {
        setPresetAttributes(
            {
                title: '',
                enable: true,
            }
        );
    }

	return (
        <div className="preset-manager">
            <PresetsSidebar
                presetAttributes={ presetAttributes }
                setPresetAttributes={ setPresetAttributes }
                presets={ presets }
            />
            <div className="preset-manager__content">
                { isEmpty( presetAttributes ) && (
                    <div className="noPreset">
                        <Button
                            isPrimary
                            onClick={ () => addNewPreset() }
                        >
                            { __( 'New preset', 'block-visibility' ) }
                        </Button>
                        <p>
                        { __(
                            'Create a new preset, or choose one to the right to edit',
                            'block-visibility'
                        ) }
                        </p>
                    </div>
                ) }
                { ! isEmpty( presetAttributes ) && (
                    <>
                        <PresetsHeader
                            presetAttributes={ presetAttributes }
                            setPresetAttributes={ setPresetAttributes }
                            settings={ settings }
                            variables={ variables }
                        />
                        <PresetsControlSets
                            presetAttributes={ presetAttributes }
                            setPresetAttributes={ setPresetAttributes }
                            settings={ settings }
                            variables={ variables }
                        />
                    </>
                ) }
            </div>
        </div>
    );
}
