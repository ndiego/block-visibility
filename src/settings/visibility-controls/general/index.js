/**
 * External dependencies
 */
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Slot, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import getEnabledControls from './../../../utils/get-enabled-controls';
import { InformationPopover } from './../../../components';

/**
 * Renders the general visibility control settings.
 *
 * @since 2.3.0
 * @param {Object} props All the props passed to this function
 */
export default function General( props ) {
	const {
		settings,
		setSettings,
		setHasUpdates,
		visibilityControls,
		setVisibilityControls,
		variables,
	} = props;
	const pluginSettings = settings?.plugin_settings ?? {};

	const enabledControls = getEnabledControls( settings, variables );
	const defaultControlOptions = [];

	enabledControls.forEach( ( control ) => {
		defaultControlOptions.push( {
			label: control.label,
			value: control.settingSlug,
		} );
	} );

	// Manually set defaults, this ensures the main settings function properly
	const enableLocalControls = visibilityControls?.general?.enable_local_controls ?? true; // eslint-disable-line
	const defaultControls = pluginSettings?.default_controls ?? []; // eslint-disable-line
	const selectedControls = defaultControlOptions.filter( ( control ) =>
		defaultControls.includes( control.value )
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
		<div className="settings-panel two-columns">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'General', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__select has-info-popover">
					<div className="select-control-container">
						<div className="settings-label">
							<span>
								{ __(
									'Default visibility controls',
									'block-visibility'
								) }
							</span>
						</div>
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
							'Default controls are automatically displayed in the Visibility panel when editing a block in the Editor. Defaults can be helpful if you frequently use the same few controls.',
							'block-visibility'
						) }
					/>
				</div>
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable local visibility controls.',
							'block-visibility'
						) }
						checked={ enableLocalControls }
						onChange={ () => {
							setVisibilityControls( {
								...visibilityControls,
								general: {
									...visibilityControls.general,
									enable_local_controls:
										! enableLocalControls,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'"Local" refers to the visibility controls available on each block. When disabled, only Visibility Presets and the Hide Block control will be available. Presets are then used to manage all other enabled controls.',
							'block-visibility'
						) }
					/>
				</div>
				<Slot name="VisibilityControlsGeneral" />
			</div>
		</div>
	);
}
