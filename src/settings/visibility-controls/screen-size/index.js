/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, Disabled, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InformationPopover from './../../utils/information-popover';
import CSSPreview from './css-preview';
import Breakpoints from './breakpoints';
import ScreenSizeControls from './screen-size-controls';

/**
 * Renders the screen size (responsive design) control settings.
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ScreenSize( props ) {
	const { settings, setSettings, setHasUpdates } = props;

	// Manually set defaults, this ensures the main settings function properly.
	let screenSize;

	if ( ! settings?.screen_size ) {
		screenSize = {
			enable: true,
			enable_advanced_controls: false,
			breakpoints: {
				extra_large: '1200px',
				large: '992px',
				medium: '768px',
				small: '576px',
			},
			controls: {
				extra_large: true,
				large: true,
				medium: true,
				small: true,
				extra_small: true,
			},
			enable_frontend_css: true,
		};
	} else {
		screenSize = settings.screen_size;
	}

	console.log( screenSize );

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Screen Size', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Screen Size controls.',
							'block-visibility'
						) }
						checked={ screenSize.enable }
						onChange={ () => {
							setSettings( {
								...settings,
								screen_size: {
									...screenSize,
									enable: ! screenSize.enable,
								},
							} );
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'Block scheduling allows you to restrict block visibility based on a start and end date/time.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/documentation/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<hr />
				<div className="breakpoint-control-container">
					<Breakpoints
						settings={ settings }
						setSettings={ setSettings }
						setHasUpdates={ setHasUpdates }
						screenSize={ screenSize }
						enableAdvancedControls={
							screenSize.enable_advanced_controls
						}
					/>
					<ScreenSizeControls
						settings={ settings }
						setSettings={ setSettings }
						setHasUpdates={ setHasUpdates }
						screenSize={ screenSize }
						enableAdvancedControls={
							screenSize.enable_advanced_controls
						}
					/>
				</div>
				<CSSPreview
					screenSize={ screenSize }
					enableAdvancedControls={
						screenSize.enable_advanced_controls
					}
				/>
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable advanced screen size controls',
							'block-visibility'
						) }
						checked={ screenSize.enable_advanced_controls }
						onChange={ () => {
							setSettings( {
								...settings,
								screen_size: {
									...screenSize,
									enable_advanced_controls: ! screenSize.enable_advanced_controls,
								},
							} );
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'Block scheduling allows you to restrict block visibility based on a start and end date/time.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/documentation/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Load screen size CSS on the Frontend of this website.',
							'block-visibility'
						) }
						checked={ screenSize.enable_frontend_css }
						onChange={ () => {
							setSettings( {
								...settings,
								screen_size: {
									...screenSize,
									enable_frontend_css: ! screenSize.enable_frontend_css,
								},
							} );
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'Block scheduling allows you to restrict block visibility based on a start and end date/time.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/documentation/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<Slot name="ScreenSizeControls" />
			</div>
		</div>
	);
}
