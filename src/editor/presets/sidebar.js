
/**
 * External dependencies
 */
import { get, includes, invoke, isUndefined, pickBy, isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Modal, MenuGroup, MenuItem, Spinner } from '@wordpress/components';
import { PluginMoreMenuItem } from '@wordpress/edit-post';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import icons from './../../utils/icons';
import SearchControl from './search-control';

/**
 * Render the sidebar in the presets modal.
 *
 * @since TBD
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function PresetsSidebar( props ) {
    const { presetAttributes, setPresetAttributes, presets } = props;
    const [ searchInput, setSearchInput ] = useState( '' );

    const isFetching = presets === 'fetching';
    let shownPresets = presets;

    // Filter by search input.
    if ( ! isFetching && searchInput && searchInput.length > 1 ) {
        shownPresets = presets.filter( ( preset ) => {
            const input = searchInput.toLowerCase();
            let presetTitle = preset?.title?.rendered ?? '';
            presetTitle = !! presetTitle && presetTitle.toLowerCase();

            // Check if the name matches.
            if ( presetTitle.includes( input ) ) {
                return true;
            }

            return false;
        } );
    }

    function editPreset( id ) {
        const presetToEdit = presets.filter( p => p.id === id );

        if ( ! isEmpty( presetToEdit ) ) {
            const preset = presetToEdit[ 0 ];

            setPresetAttributes( {
                id: preset.id,
                title: preset.title.rendered,
                enable: preset?.meta?.enable ?? true,
                controlSets: preset?.meta?.controlSets ?? [],
            } );
        }
    }

    return (
        <div className="preset-manager__sidebar">
            <SearchControl
                className={ classnames(
                    { 'is-disabled': isEmpty( presets ) || isFetching }
                ) }
                value={ searchInput }
                onChange={ setSearchInput }
                disabled={ isEmpty( presets ) || isFetching }
            />
            <div className="sidebar__presets-title">
                { __( 'Presets', 'block-visibility' ) }
            </div>
            { <Spinner /> }
            { ! isFetching && isEmpty( shownPresets ) && searchInput && (
                <div className="sidebar__presets-no-results">
                    <Icon icon={ icons.visibilityHiddenAlt } />
                    <p>{ __( 'No presets found.', 'block-visibility' ) }</p>
                </div>
            ) }
            { ! isFetching && isEmpty( shownPresets ) && ! searchInput && (
                <div className="sidebar__presets-placeholder">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            ) }
            { ! isFetching && ! isEmpty( shownPresets ) && (
                <MenuGroup className="sidebar__presets-list">
                    { shownPresets.map( ( preset ) => {
                        const title = preset?.title?.rendered ?? __( 'untitled', 'block-visibility' );
                        const isActive = presetAttributes?.id === preset.id;

                        return (
                            <MenuItem
                                key={ `category-${ preset.id }` }
                                className={ classnames( {
                                    'is-active': isActive,
                                } ) }
                                onClick={ () => editPreset( preset.id ) }
                            >
                                { title }
                            </MenuItem>
                        );
                    } ) }
                </MenuGroup>
            ) }
        </div>
    );
}
