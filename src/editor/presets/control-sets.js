
/**
 * External dependencies
 */
import { assign, includes, isEmpty } from 'lodash';

/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import ControlSet from './../inspector-controls/control-set';
import getEnabledControls from './../../utils/get-enabled-controls';

/**
 * Render the control set manager for the selected preset.
 *
 * @since TBD
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function PresetsControlSets( props ) {
    const {
        presetAttributes,
        setPresetAttributes,
        settings,
        variables,
    } = props;
    const enabledControls = getEnabledControls( settings, variables );
    const defaultControlSettings =
        settings?.plugin_settings?.default_controls ?? {};

    let defaultControls = {};

    if ( ! isEmpty( defaultControlSettings ) ) {
        enabledControls.forEach( ( control ) => {
            if ( defaultControlSettings.includes( control.settingSlug ) ) {
                defaultControls[ control.attributeSlug ] = {};
            }
        } );
    } else {
        defaultControls = {
            dateTime: {},
            userRole: {},
            screenSize: {},
        };
    }

    let controlSets = presetAttributes?.controlSets ?? [];

    // Create the default control set and populate with any previous attributes.
    if ( controlSets.length === 0 ) {
        const defaultSet = [
            {
                id: 0,
                title: __( 'Control Set', 'block-visibility' ),
                enable: true,
                controls: defaultControls,
            },
        ];
        controlSets = defaultSet;
    }

    function addControlSet( controlSets ) {
        const maxId = Math.max( ...controlSets.map( set => set.id ), 0 );
        const setId = maxId ? maxId + 1 : maxId + 2;
        const setTitle = sprintf(  __( 'Control Set %s', 'block-visibility' ), setId );

        const defaultSet =
            {
                id: setId,
                title: setTitle,
                enable: true,
                controls: defaultControls,
            };

        setPresetAttributes( {
            ...presetAttributes,
            controlSets: [ ...controlSets, defaultSet ]
        } );
    }

    function setControlSetAtts( controlSetAtts ) {
        const newControlSets = [ ...controlSets ];
        let index = 0;

        // Find the control set that we are updating.
        newControlSets.forEach( ( set, i ) => {
            if ( set.id === controlSetAtts.id ) {
                index = i;
            }
        } );

        newControlSets[ index ] = controlSetAtts;

        setPresetAttributes( {
            ...presetAttributes,
            controlSets: [ ...newControlSets ],
        } );
    }

    return (
        <div className="control-sets">
            <div className="control-sets__controls">
                <Button
                    isPrimary
                    onClick={ () => addControlSet( controlSets ) }
                >
                    { __( 'Add Control Set', 'block-visibility' ) }
                </Button>
            </div>
            <div className="control-sets__container">
                { controlSets.map( ( controlSet, index ) => {
                    return (
                        <ControlSet
                            key={ index }
                            isPreset={ true }
                            controlSetAtts={ controlSet }
                            setControlSetAtts={ setControlSetAtts }
                            enabledControls={ enabledControls }
                            defaultControls={ defaultControls }
                            settings={ settings }
                            variables={ variables }
                            { ...props }
                        />
                    );
                } ) }
            </div>
        </div>
    );
}
