/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalUnitControl as UnitControl } from '@wordpress/components';

/**
 * Renders the breakpoint input settings.
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Breakpoints( props ) {
	const {
		settings,
		setSettings,
		setHasUpdates,
		screenSize,
		enableAdvancedControls,
	} = props;

	const breakpoints = {
		extra_large: {
			title: __( 'Extra Large', 'block-visibility' ),
			description: __( 'Large desktop screen sizes.' ),
		},
		large: {
			title: __( 'Large', 'block-visibility' ),
			description: __(
				'Desktop and tablet (landscape) screen sizes.',
				'block-visibility'
			),
		},
		medium: {
			title: __( 'Medium', 'block-visibility' ),
			description: __(
				'Tablet (portrait) screen sizes.',
				'block-visibility'
			),
		},
		small: {
			title: __( 'Small', 'block-visibility' ),
			description: __(
				'Mobile (landscape) screen sizes.',
				'block-visibility'
			),
		},
	};

	function onBreakpointChange( breakpoint, value ) {
		setSettings( {
			...settings,
			screen_size: {
				...screenSize,
				breakpoints: {
					...screenSize.breakpoints,
					[ breakpoint ]: value,
				},
			},
		} );
		setHasUpdates( true );
	}

	return (
		<div className="breakpoints-container">
			<div className="settings-label">
				{ __( 'Breakpoints', 'block-visibility' ) }
			</div>
			{ Object.entries( breakpoints ).map( ( [ breakpoint, labels ] ) => {
				const breakpointValue = screenSize.breakpoints[ breakpoint ];

				if (
					( breakpoint === 'extra_large' ||
						breakpoint === 'small' ) &&
					! enableAdvancedControls
				) {
					return null;
				}

				return (
					<div className="breakpoint" key={ breakpoint }>
						<div className="breakpoint-inputs">
							<UnitControl
								label={ labels.title }
								value={ breakpointValue }
								onChange={ ( value ) =>
									onBreakpointChange( breakpoint, value )
								}
								units={ [ { value: 'px', label: 'px' } ] } // Only allow pixels right now.
							/>
							<div className="settings-panel__help">
								{ labels.description }
							</div>
						</div>
					</div>
				);
			} ) }
		</div>
	);
}
