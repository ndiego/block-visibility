/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

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
				{ __( 'Screen Size Controls', 'block-visibility' ) }
			</div>
			{ enableAdvancedControls && (
				<ToggleControl
					label={ __(
						'Enable large desktop control',
						'block-visibility'
					) }
					help={ sprintf(
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
					! enableAdvancedControls && sprintf(
						__(
							'Allows users to hide blocks on large screen sizes, %s and up.',
							'block-visibility'
						),
						screenSize.breakpoints.large
					),
					enableAdvancedControls && sprintf(
						__(
							'Allows users to hide blocks on large screen sizes, between %s and %s.',
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
					__(
						'Allows users to hide blocks on medium screen sizes, between %s and %s.',
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
					! enableAdvancedControls && __(
						'Enable mobile control',
						'block-visibility'
					),
					enableAdvancedControls && __(
						'Enable mobile (landscape) control',
						'block-visibility'
					),
				] }
				help={ [
					! enableAdvancedControls && sprintf(
						__(
							'Allows users to hide blocks on small screen sizes, up to %s.',
							'block-visibility'
						),
						screenSize.breakpoints.medium
					),
					enableAdvancedControls && sprintf(
						__(
							'Allows users to hide blocks on small screen sizes, between %s and %s.',
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
						__(
							'Allows users to hide blocks on extra small screen sizes, up to %s.',
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
