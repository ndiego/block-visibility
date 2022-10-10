/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, Disabled, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InformationPopover from './../../../utils/components/information-popover';
import PreviewStyles from './preview-styles';
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
	const { visibilityControls, setVisibilityControls } = props;

	// Manually set defaults, this ensures the main settings function properly.
	let screenSize;

	if ( ! visibilityControls?.screen_size ) {
		screenSize = {
			enable: true,
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
			enable_advanced_controls: false,
			enable_frontend_css: true,
		};
	} else {
		screenSize = visibilityControls.screen_size;
	}

	let screenSizeControls = (
		<>
			<div className="breakpoint-control-container subsetting">
				<Breakpoints
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					screenSize={ screenSize }
					enableAdvancedControls={
						screenSize.enable_advanced_controls
					}
				/>
				<ScreenSizeControls
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					screenSize={ screenSize }
					enableAdvancedControls={
						screenSize.enable_advanced_controls
					}
				/>
			</div>
			<PreviewStyles
				screenSize={ screenSize }
				enableAdvancedControls={ screenSize.enable_advanced_controls }
			/>
		</>
	);

	let enableAdvancedControls = (
		<ToggleControl
			label={ __(
				'Enable advanced screen size controls.',
				'block-visibility'
			) }
			checked={ screenSize.enable_advanced_controls }
			onChange={ () => {
				setVisibilityControls( {
					...visibilityControls,
					screen_size: {
						...screenSize,
						enable_advanced_controls:
							! screenSize.enable_advanced_controls,
					},
				} );
			} }
		/>
	);

	let enableFrontendCSS = (
		<ToggleControl
			label={ __(
				'Load screen size CSS on the frontend of this website.',
				'block-visibility'
			) }
			checked={ screenSize.enable_frontend_css }
			onChange={ () => {
				setVisibilityControls( {
					...visibilityControls,
					screen_size: {
						...screenSize,
						enable_frontend_css: ! screenSize.enable_frontend_css,
					},
				} );
			} }
		/>
	);

	if ( ! screenSize.enable ) {
		screenSizeControls = <Disabled>{ screenSizeControls }</Disabled>;
		enableAdvancedControls = (
			<Disabled>{ enableAdvancedControls }</Disabled>
		);
		enableFrontendCSS = <Disabled>{ enableFrontendCSS }</Disabled>;
	}

	return (
		<div className="setting-tabs__settings-panel two-columns">
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
							setVisibilityControls( {
								...visibilityControls,
								screen_size: {
									...screenSize,
									enable: ! screenSize.enable,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							"The Screen Size control allows you to conditionally display blocks on the current width of the browser window, or in other words, the screen size of a user's device. Visit the plugin Knowledge Base for more information.",
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-screen-size-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<hr />
				{ screenSizeControls }
				<div className="settings-type__toggle has-info-popover subsetting">
					{ enableAdvancedControls }
					<InformationPopover
						message={ __(
							'By default, the Screen Size control includes two breakpoints and three controls for users to hide blocks. There are certain situations where you may need more control over when a block should be visible, for example in the case of very large or small screens. Enabling advanced controls provides these options.',
							'block-visibility'
						) }
						subMessage={ __(
							'Note that once enabled, any block that is only using the advanced controls to hide at extra large, or extra small, breakpoints will become visible again if this setting is ever disabled in the future.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-screen-size-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<div className="settings-type__toggle has-info-popover subsetting">
					{ enableFrontendCSS }
					<InformationPopover
						message={ __(
							'By default, the CSS needed for the Screen Size controls is loaded on the frontend of your website. If disabled, you will need to add the CSS manually to your theme in order for the Screen Size controls to work properly. This CSS code is available via the "Preview Frontend CSS" button on this page.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-screen-size-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<Slot name="ScreenSizeControls" />
			</div>
		</div>
	);
}
