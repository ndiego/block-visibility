/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InformationPopover from './../../utils/information-popover';

/**
 * Renders the screen size control toggle settings.
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ScreenSizeControls( props ) {
	const {
		settings,
		setSettings,
		setHasUpdates,
		screenSize,
		enableAdvancedControls,
	} = props;

	function onControlChange( control, value ) {
		setSettings( {
			...settings,
			screen_size: {
				...screenSize,
				controls: {
					...screenSize.controls,
					[ control ]: value,
				},
			},
		} );
		setHasUpdates( true );
	}

	return (
		<div className="controls-container">
			<div className="settings-label">
				<span>
					{ __( 'Controls', 'block-visibility' ) }
				</span>
				<InformationPopover
					message={ __(
						"The settings below allow you to retrict which controls are available to users in the Block/Site Editor. Disabling controls will remove the corresponding CSS from the frontend of your website.",
						'block-visibility'
					) }
					subMessage={ __(
						'The default controls are Desktop, Tablet, and Mobile. Advanced screen size controls add Large Desktop and Mobile (portrait).',
						'block-visibility'
					) }
					link="https://www.blockvisibilitywp.com/knowledge-base/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
				/>
			</div>
			{ enableAdvancedControls && (
				<ToggleControl
					label={ __(
						'Enable large desktop control',
						'block-visibility'
					) }
					help={ sprintf(
						// translators: %s: extra large breakpoint
						__(
							'Allows users to hide blocks on extra large screen sizes, %s and up.',
							'block-visibility'
						),
						screenSize.breakpoints.extra_large
					) }
					checked={ screenSize.controls.extra_large }
					onChange={ () =>
						onControlChange(
							'extra_large',
							! screenSize.controls.extra_large
						)
					}
				/>
			) }
			<ToggleControl
				label={ __( 'Enable desktop control', 'block-visibility' ) }
				help={ [
					! enableAdvancedControls &&
						sprintf(
							// translators: %s large breakpoint
							__(
								'Allows users to hide blocks on large screen sizes, %s and up.',
								'block-visibility'
							),
							screenSize.breakpoints.large
						),
					enableAdvancedControls &&
						sprintf(
							// translators: %1$s: large breakpoint %2$s: extra large breakpoint
							__(
								'Allows users to hide blocks on large screen sizes, between %1$s and %2$s.',
								'block-visibility'
							),
							screenSize.breakpoints.large,
							screenSize.breakpoints.extra_large
						),
				] }
				checked={ screenSize.controls.large }
				onChange={ () =>
					onControlChange( 'large', ! screenSize.controls.large )
				}
			/>
			<ToggleControl
				label={ __( 'Enable tablet control', 'block-visibility' ) }
				help={ sprintf(
					// translators: %1$s: medium breakpoint %2$s: large breakpoint
					__(
						'Allows users to hide blocks on medium screen sizes, between %1$s and %2$s.',
						'block-visibility'
					),
					screenSize.breakpoints.medium,
					screenSize.breakpoints.large
				) }
				checked={ screenSize.controls.medium }
				onChange={ () =>
					onControlChange( 'medium', ! screenSize.controls.medium )
				}
			/>
			<ToggleControl
				label={ [
					! enableAdvancedControls &&
						__( 'Enable mobile control', 'block-visibility' ),
					enableAdvancedControls &&
						__(
							'Enable mobile (landscape) control',
							'block-visibility'
						),
				] }
				help={ [
					! enableAdvancedControls &&
						sprintf(
							// translators: %s: medium breakpoint
							__(
								'Allows users to hide blocks on small screen sizes, less than %s.',
								'block-visibility'
							),
							screenSize.breakpoints.medium
						),
					enableAdvancedControls &&
						sprintf(
							// translators: %1$s: small breakpoint %2$s: medium breakpoint
							__(
								'Allows users to hide blocks on small screen sizes, between %1$s and %2$s.',
								'block-visibility'
							),
							screenSize.breakpoints.small,
							screenSize.breakpoints.medium
						),
				] }
				checked={ screenSize.controls.small }
				onChange={ () =>
					onControlChange( 'small', ! screenSize.controls.small )
				}
			/>
			{ enableAdvancedControls && (
				<ToggleControl
					label={ __(
						'Enable mobile (portrait) control',
						'block-visibility'
					) }
					help={ sprintf(
						// translators: %s: small breakpoint
						__(
							'Allows users to hide blocks on extra small screen sizes, less than %s.',
							'block-visibility'
						),
						screenSize.breakpoints.small
					) }
					checked={ screenSize.controls.extra_small }
					onChange={ () =>
						onControlChange(
							'extra_small',
							! screenSize.controls.extra_small
						)
					}
				/>
			) }
		</div>
	);
}
