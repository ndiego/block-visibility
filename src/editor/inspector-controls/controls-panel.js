/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Disabled, Notice, Slot, withFilters } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ControlsPanelHeader from './controls-panel-header';
import {
	HideBlock,
	UserRole,
	DateTime,
	ScreenSize,
	QueryString,
	ACF,
	WPFusion,
} from './../../controls';

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
export default function ControlsPanel( props ) {
	const {
		attributes,
		controlSetAtts,
		setControlSetAtts,
		enabledControls,
		variables,
	} = props;
	const blockAtts = attributes?.blockVisibility ?? {};
	const settingsUrl = variables?.plugin_variables?.settings_url ?? '';

	// Needed to ensure each Slot is unique.
	const uniqueIndex = 'inspector-controls-panel';

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
			<DateTime setControlAtts={ setControlAtts } type={ uniqueIndex } { ...props } />
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
	// If Hide Block is the only active control, display nothing. Otherwise,
	// the grid styling applies gap where it shouldn't.
	if ( blockAtts?.hideBlock ) {
		controls =
			activeControls.length > 1
				? <Disabled className="hide-block-enabled">{ controls }</Disabled>
				: null;
	}

	return (
		<>
			<ControlsPanelHeader
				activeControls={ activeControls }
				enabledControls={ enabledControls }
				setControlSetAtts={ setControlSetAtts }
				{ ...props }
			/>
			{ activeControls.length !== 0 && (
				<div className="controls-panel-container">
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
				<div className="controls-panel-notices">
					<Notice status="warning" isDismissible={ false }>
						{ createInterpolateElement(
							__(
								'All visibility controls have been manually disabled. Visit the <a>plugin settings</a> to re-enable.',
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
				</div>
			) }
		</>
	);
}
