/**
 * External dependencies
 */
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import getEnabledControls from './../../../utils/get-enabled-controls';
import InformationPopover from './../../../utils/components/information-popover';

/**
 * Renders the general visibility control settings.
 *
 * @since 2.3.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function General( props ) {
	const { settings, setSettings, setHasUpdates, variables } = props;
	const pluginSettings = settings?.plugin_settings ?? {};

	let enabledControls = getEnabledControls( settings, variables );

	enabledControls = enabledControls.filter(
		( control ) =>
			control.settingSlug !== 'hide_block' &&
			control.settingSlug !== 'visibility_presets'
	);

	const defaultControlOptions = [];

	enabledControls.forEach( ( control ) => {
		defaultControlOptions.push( {
			label: control.label,
			value: control.settingSlug,
		} );
	} );

	// Manually set defaults, this ensures the main settings function properly
    const defaultControls = pluginSettings?.default_controls ?? [ 'date_time', 'visibility_by_role', 'screen_size' ]; // eslint-disable-line
	const selectedControls = defaultControlOptions.filter( ( control ) =>
		defaultControls.includes( control.value )
	);

	// The default control setting was ported over from plugin_settings, so we
	// need to save in the appropriate place.
	const handleControlsChange = ( _control ) => {
		const newControls = [];

		if ( _control.length !== 0 ) {
			_control.forEach( ( control ) => {
				newControls.push( control.value );
			} );
		}

		setSettings( {
			...settings,
			plugin_settings: {
				...pluginSettings,
				default_controls: newControls,
			},
		} );
		setHasUpdates( true );
	};

	return (
		<div className="setting-tabs__settings-panel two-columns">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'General', 'block-visibility' ) }
				</span>
			</div>
			<Slot name="VisibilityControlsGeneralTop" />
			<div className="settings-panel__container">
				<div className="settings-type__select has-info-popover">
					<div>
						<span>
							{ __(
								'Default visibility controls',
								'block-visibility'
							) }
						</span>
						<Select
							className="block-visibility__react-select"
							classNamePrefix="react-select"
							placeholder={ __(
								'Select Controls…',
								'block-visibility'
							) }
							options={ defaultControlOptions }
							value={ selectedControls }
							onChange={ ( value ) =>
								handleControlsChange( value )
							}
							isMulti
						/>
						<div className="settings-panel__help">
							{ __(
								'If no controls are selected, the plugin will default to Date & Time, User Role, and Screen Size.',
								'block-visibility'
							) }
						</div>
					</div>
					<InformationPopover
						message={ __(
							"Optionally set the default controls that will be available when editing a block's visibility for the first time. This can be useful if you find yourself using the same few controls frequently. Controls can be disabled entirely on the Visibility Controls tab.",
							'block-visibility'
						) }
					/>
				</div>
				<Slot name="VisibilityControlsGeneralBottom" />
			</div>
		</div>
	);
}
