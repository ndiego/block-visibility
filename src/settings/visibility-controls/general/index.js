/**
 * External dependencies
 */
import Select from 'react-select';
import { union } from 'lodash';

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

	const enabledControls = getEnabledControls( settings, variables );
	const defaultControlOptions = [];

	enabledControls.forEach( ( control ) => {
		defaultControlOptions.push( {
			label: control.label,
			value: control.settingSlug,
			isFixed:
				control.settingSlug === 'hide_block' ||
				control.settingSlug === 'visibility_presets',
		} );
	} );

	// Manually set defaults, this ensures the main settings function properly
    const defaultControls = pluginSettings?.default_controls ?? []; // eslint-disable-line
	const selectedControls = defaultControlOptions.filter( ( control ) =>
		union( defaultControls, [
			'hide_block',
			'visibility_presets',
		] ).includes( control.value )
	);

	// Reoder the default control placing the fixed controls first.
	const orderOptions = ( values ) => {
		return values
			.filter( ( value ) => value.isFixed )
			.concat( values.filter( ( value ) => ! value.isFixed ) );
	};

	// The default control setting was ported over from plugin_settings, so we
	// need to save in the appropriate place.
	const handleControlsChange = ( value, actionMeta ) => {
		const newControls = [];

		switch ( actionMeta.action ) {
			case 'remove-value':
			case 'pop-value':
				// Prevent removal of fixed defaults.
				if ( actionMeta.removedValue.isFixed ) {
					return;
				}
				if ( value.length !== 0 ) {
					value.forEach( ( control ) => {
						newControls.push( control.value );
					} );
				}

				break;
			case 'select-option':
				if ( value.length !== 0 ) {
					value.forEach( ( control ) => {
						newControls.push( control.value );
					} );
				}
				break;
			case 'clear':
				// When all defaults are cleared, reset the fixed defaults.
				const fixedControls = defaultControlOptions.filter(
					( control ) => control.isFixed
				);
				if ( fixedControls.length !== 0 ) {
					fixedControls.forEach( ( control ) => {
						newControls.push( control.value );
					} );
				}
				break;
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

	const customStyles = {
		multiValueLabel: ( base, state ) => {
			return state.data.isFixed
				? {
						...base,
						backgroundColor: '#757575',
						color: '#ffffff',
						paddingRight: 6,
				  }
				: base;
		},
		multiValueRemove: ( base, state ) => {
			return state.data.isFixed ? { ...base, display: 'none' } : base;
		},
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
							styles={ customStyles }
							isClearable={ selectedControls.some(
								( control ) => ! control.isFixed
							) }
							placeholder={ __(
								'Select Controls…',
								'block-visibility'
							) }
							options={ defaultControlOptions }
							value={ orderOptions( selectedControls ) }
							onChange={ ( value, actionMeta ) =>
								handleControlsChange( value, actionMeta )
							}
							isMulti
						/>
					</div>
					<InformationPopover
						message={ __(
							"Optionally set the default controls that will be available when editing a block's visibility for the first time. This can be useful if you find yourself using the same few controls frequently. Controls can also be disabled entirely.",
							'block-visibility'
						) }
					/>
				</div>
				<Slot name="VisibilityControlsGeneralBottom" />
			</div>
		</div>
	);
}
