/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	ColorIndicator,
	ColorPalette,
	Disabled,
	ToggleControl,
	RangeControl,
	Slot,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { InformationPopover } from './../../../components';

/**
 * Renders the Block Editor visibility settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function BlockEditor( props ) {
	const { pluginSettings, setPluginSettings } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enableContextualIndicators = pluginSettings?.enable_contextual_indicators ?? true; // eslint-disable-line
	const contextualIndicatorColor = pluginSettings?.contextual_indicator_color ?? ''; // eslint-disable-line
	const enableBlockOpacity = pluginSettings?.enable_block_opacity ?? false; // eslint-disable-line
	const blockOpacity = pluginSettings?.block_opacity ?? 100; // eslint-disable-line
	const enableToolbarControls = pluginSettings?.enable_toolbar_controls ?? true; // eslint-disable-line

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

	let contextualIndicatorColorPicker = (
		<div className="settings-type__color">
			<div>
				<BaseControl
					id="indicator-color"
					className="settings-type__color-selected"
					label={ __( 'Indicator color', 'block-visibility' ) }
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
					} }
				/>
			</div>
		</div>
	);

	if ( ! enableContextualIndicators ) {
		contextualIndicatorColorPicker = (
			<Disabled>{ contextualIndicatorColorPicker }</Disabled>
		);
	}

	let contextualBlockOpacity = (
		<div className="settings-type__range">
			<RangeControl
				label={ __( 'Block Opacity', 'block-visibility' ) }
				value={ blockOpacity }
				onChange={ ( newOpacity ) => {
					setPluginSettings( {
						...pluginSettings,
						block_opacity: newOpacity,
					} );
				} }
				min={ 10 }
				max={ 100 }
				step={ 10 }
			/>
		</div>
	);

	if ( ! enableBlockOpacity ) {
		contextualBlockOpacity = (
			<Disabled>{ contextualBlockOpacity }</Disabled>
		);
	}

	return (
		<div className="settings-panel">
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
								enable_contextual_indicators:
									! enableContextualIndicators,
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'Contextual indicators allow users to quickly tell which blocks in the Block Editor have active visibility controls.',
							'block-visibility'
						) }
					/>
				</div>
				{ contextualIndicatorColorPicker }
				<div className="settings-label">
					<span>
						{ __( 'Contextual Block Opacity', 'block-visibility' ) }
					</span>
				</div>
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Reduce block opacity when visibility controls are applied.',
							'block-visibility'
						) }
						checked={ enableBlockOpacity }
						onChange={ () => {
							setPluginSettings( {
								...pluginSettings,
								enable_block_opacity: ! enableBlockOpacity,
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'Reducing block opacity, coupled with contextual indicators, can further help users quickly tell which blocks in the Block Editor have active visibility controls.',
							'block-visibility'
						) }
					/>
				</div>
				{ contextualBlockOpacity }
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
								enable_toolbar_controls:
									! enableToolbarControls,
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'Some visibility controls (currently just the Hide Block control) can be made available in the toolbar of each block. This provides a more streamlined workflow and can improve content management.',
							'block-visibility'
						) }
					/>
				</div>
				<Slot name="BlockEditorSettings" />
			</div>
		</div>
	);
}
