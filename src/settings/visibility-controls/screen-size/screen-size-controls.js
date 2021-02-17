/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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

	const controls = {
		extra_large: {
			title: __( 'Extra Large', 'block-visibility' ),
			description: __(
				'Set the breakpoint for desktop screen sizes and larger.',
				'block-visibility'
			),
		},
		large: {
			title: __( 'Large', 'block-visibility' ),
			description: __(
				'Set the breakpoint for desktop and tablet (landscape) screen sizes.',
				'block-visibility'
			),
		},
		medium: {
			title: __( 'Medium', 'block-visibility' ),
			description: __(
				'Set the breakpoint for tablet (portrait) screen sizes.',
				'block-visibility'
			),
		},
		small: {
			title: __( 'Small', 'block-visibility' ),
			description: __(
				'Set the breakpoint for mobile screen sizes.',
				'block-visibility'
			),
		},
		extra_small: {
			title: __( 'Extra Small', 'block-visibility' ),
			description: __(
				'Set the breakpoint for mobile screen sizes.',
				'block-visibility'
			),
		},
	};

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
					help={ __(
						'Allows users to hide blocks on large desktop screen sizes, 1200px and up.',
						'block-visibility'
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
				help={ __(
					'Allows users to hide blocks on desktop and tablet (landscape) screen sizes, between 992px and 1200px.',
					'block-visibility'
				) }
				checked={ screenSize.controls.large }
				onChange={ () =>
					onControlChange( 'large', ! screenSize.controls.large )
				}
			/>
			<ToggleControl
				label={ __( 'Enable tablet control', 'block-visibility' ) }
				help={ __(
					'Allows users to hide blocks on tablet (portrait) screen sizes, between 768px and 992px.',
					'block-visibility'
				) }
				checked={ screenSize.controls.medium }
				onChange={ () =>
					onControlChange( 'medium', ! screenSize.controls.medium )
				}
			/>
			<ToggleControl
				label={ __(
					'Enable mobile (landscape) control',
					'block-visibility'
				) }
				help={ __(
					'Allows users to hide blocks on mobile (landscape) screen sizes, between 576px and 768px.',
					'block-visibility'
				) }
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
					help={ __(
						'Allows users to hide blocks on mobile (portrait) screen sizes, up to 562px.',
						'block-visibility'
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
