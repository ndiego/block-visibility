/**
 * External dependencies
 */
import { assign, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Disabled, Notice, Slot, withFilters } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ControlPanelHeader from './control-panel-header';
import HideBlock from './../../controls/hide-block';
import UserRole from './../../controls/user-role';
import DateTime from './../../controls/date-time';
import ScreenSize from './../../controls/screen-size';
import QueryString from './../../controls/query-string';
import ACF from './../../controls/acf';
import WPFusion from './../../controls/wp-fusion';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalControlSetControls = withFilters(
	'blockVisibility.addControlSetControls'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Render the inspector control panel.
 *
 * @since 2.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ControlPanel( props ) {
	const {
        attributes,
		controlSetAtts,
		setControlSetAtts,
		enabledControls,
		variables,
	} = props;
    const blockAtts = attributes?.blockVisibility ?? {};
	const settingsUrl = variables?.plugin_variables?.settings_url ?? '';

	// There needs to be a unique index for the Slots since we technically 
	// have multiple of the same Slot.
	const uniqueIndex = 'panel';

    // Append the "active" property to all active controls.
	enabledControls.forEach( ( control ) => {
        if ( 
            blockAtts?.hasOwnProperty(
                control.attributeSlug
            ) || 
            controlSetAtts?.controls.hasOwnProperty(
                control.attributeSlug
            ) ||
            control?.isDefault
        ) {
            control.isActive = true;
        }
	} );

    // A simple array of all active controls.
	const activeControls = enabledControls.filter( ( control ) =>
        control.isActive 
    );

	function setControlAtts( control, values ) {
		const newControls = controlSetAtts?.controls ?? {};
		const newControlSetAtts = assign(
			{ ...controlSetAtts },
			{
				controls: assign( { ...newControls }, { [ control ]: values } ),
			}
		);

		setControlSetAtts( newControlSetAtts );
	}

    let controls = (
		<>
			<Slot name="ControlPanelContainer" />
                    
            <Slot name={ 'ControlSetControlsTop-' + uniqueIndex } />
            <DateTime setControlAtts={ setControlAtts } { ...props } />
            <UserRole setControlAtts={ setControlAtts } { ...props } />
            <ScreenSize setControlAtts={ setControlAtts } { ...props } />
            <QueryString setControlAtts={ setControlAtts } { ...props } />
            <Slot name={ 'ControlSetControlsMiddle-' + uniqueIndex } />
            <ACF setControlAtts={ setControlAtts } { ...props } />
            <WPFusion setControlAtts={ setControlAtts } { ...props } />
            <Slot name={ 'ControlSetControlsBottom-' + uniqueIndex } />
		</>
	);

    // Disable all other controls if the Hide Block control is enabled.
	if ( blockAtts?.hideBlock ) {
		controls = <Disabled>{ controls }</Disabled>;
	}

    return (
		<>
			<ControlPanelHeader
                activeControls={ activeControls }
				enabledControls={ enabledControls }
				setControlSetAtts={ setControlSetAtts }
				{ ...props }
			/>
            { activeControls.length !== 0 && ( 
                <div className="control-panel-container visibility-controls__container">
                    <HideBlock { ...props } />
                    { controls }
                    <AdditionalControlSetControls
                        uniqueIndex={ uniqueIndex }
                        setControlAtts={ setControlAtts }
                        { ...props }
                    />
                </div>
            ) }
            { enabledControls.length === 0 && (
                <Notice status="warning" isDismissible={ false }>
                    { createInterpolateElement(
                        __(
                            'All controls are disabled. Visit the <a>plugin settings</a> to enable.',
                            'block-visibility'
                        ),
                        {
                            a: (
                                <a // eslint-disable-line
                                    href={ settingsUrl + '&tab=visibility-controls' }
                                    target="_blank"
                                    rel="noreferrer"
                                />
                            ),
                        }
                    ) }
                </Notice>
            ) }
		</>
	);
}
