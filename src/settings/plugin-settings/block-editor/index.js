/**
 * External dependencies
 */
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	ColorIndicator,
	ColorPalette,
	ToggleControl,
	Slot,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import getEnabledControls from './../../../utils/get-enabled-controls';
import InformationPopover from './../../utils/information-popover';

/**
 * Renders the Block Editor visibility settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function BlockEditor( props ) {
	const {
		settings,
		variables,
		pluginSettings,
		setPluginSettings,
		setHasUpdates,
	} = props;

	let enabledControls = getEnabledControls( settings, variables );

	enabledControls = enabledControls.filter(
		( control ) => control.settingSlug !== 'hide_block'
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
	const enableContextualIndicators = pluginSettings?.enable_contextual_indicators ?? true; // eslint-disable-line
	const contextualIndicatorColor = pluginSettings?.contextual_indicator_color ?? ''; // eslint-disable-line
	const enableToolbarControls = pluginSettings?.enable_toolbar_controls ?? true; // eslint-disable-line
	const enableEditorNotices = pluginSettings?.enable_editor_notices ?? true; // eslint-disable-line

	const selectedControls = defaultControlOptions.filter( ( control ) =>
		defaultControls.includes( control.value )
	);

	const handleControlsChange = ( _control ) => {
		const newControls = [];

		if ( _control.length !== 0 ) {
			_control.forEach( ( control ) => {
				newControls.push( control.value );
			} );
		}

		setPluginSettings( {
			...pluginSettings,
			default_controls: newControls,
		} );
		setHasUpdates( true );
	};

	const colors = [
		{ name: __( 'Black', 'block-visibility' ), color: '#121212' },
		{ name: __( 'Light Grey', 'block-visibility' ), color: '#F1F1F1' },
		{ name: __( 'Red', 'block-visibility' ), color: '#DC3232' },
		{ name: __( 'Orange', 'block-visibility' ), color: '#F56E28' },
		{ name: __( 'Yellow', 'block-visibility' ), color: '#FFB900' },
		{ name: __( 'Green', 'block-visibility' ), color: '#46B450' },
		{ name: __( 'Medium Blue', 'block-visibility' ), color: '#00A0D2' },
		{ name: __( 'WordPress Blue', 'block-visibility' ), color: '#0073AA' },
		{ name: __( 'Purple', 'block-visibility' ), color: '#826EB4' },
	];

	const indicatorColor = contextualIndicatorColor
		? contextualIndicatorColor
		: 'var(--wp-admin-theme-color)';

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Block Editor', 'block-visibility' ) }
				</span>
				<InformationPopover
					message={ __(
						'Settings that impact the Block Editor, such as contextual indicators for when a block has visibility controls, as well as additional toolbar options. Click the link below for complete details.',
						'block-visibility'
					) }
					link={
						'https://www.blockvisibilitywp.com/knowledge-base/how-to-configure-the-general-settings/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals'
					}
				/>
			</div>
			<div className="settings-panel__container">
				<div className="settings-label">
					<span>
						{ __(
							'Default Visibility Controls',
							'block-visibility'
						) }
					</span>
				</div>
				<div className="settings-type__select has-info-popover">
					<div>
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
				<div className="settings-label">
					<span>
						{ __( 'Contextual Indicators', 'block-visibility' ) }
					</span>
				</div>
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable contextual indicators.',
							'block-visibility'
						) }
						checked={ enableContextualIndicators }
						onChange={ () => {
							setPluginSettings( {
								...pluginSettings,
								enable_contextual_indicators: ! enableContextualIndicators,
							} );
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'Contextual indicators allow you to quickly tell which blocks in the Block Editor have active visibility controls.',
							'block-visibility'
						) }
					/>
				</div>
				<div className="settings-type__color has-info-popover">
					<div>
						<BaseControl
							id="indicator-color"
							label={ __(
								'Indicator color',
								'block-visibility'
							) }
						>
							<ColorIndicator colorValue={ indicatorColor } />
						</BaseControl>
						<ColorPalette
							colors={ colors }
							value={ contextualIndicatorColor }
							onChange={ ( newColor ) => {
								setPluginSettings( {
									...pluginSettings,
									contextual_indicator_color: newColor,
								} );
								setHasUpdates( true );
							} }
						/>
					</div>
					<InformationPopover
						message={ __(
							'By default, contextual indicators will be the primary color of your WordPress admin theme. Feel free to select an alternative from the color palette or choose a custom color.',
							'block-visibility'
						) }
					/>
				</div>
				<div className="settings-label">
					<span>
						{ __( 'Toolbar Controls', 'block-visibility' ) }
					</span>
				</div>
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable block toolbar controls for visibility settings.',
							'block-visibility'
						) }
						checked={ enableToolbarControls }
						onChange={ () => {
							setPluginSettings( {
								...pluginSettings,
								enable_toolbar_controls: ! enableToolbarControls,
							} );
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'Some visibility controls (currently just the Hide Block control) can be made available in the toolbar of each block. This provides a more streamlined workflow and can improve content management.',
							'block-visibility'
						) }
					/>
				</div>
				<div className="settings-label">
					<span>{ __( 'Miscellaneous', 'block-visibility' ) }</span>
				</div>
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable plugin notices in the editor.',
							'block-visibility'
						) }
						checked={ enableEditorNotices }
						onChange={ () => {
							setPluginSettings( {
								...pluginSettings,
								enable_editor_notices: ! enableEditorNotices,
							} );
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'Block Visibility provides various notices in the editor to provide helpful warnings, tips, and links. This setting allows you to disable those notices for a more steamlined user interface.',
							'block-visibility'
						) }
					/>
				</div>
				<Slot name="BlockEditorSettings" />
			</div>
		</div>
	);
}
