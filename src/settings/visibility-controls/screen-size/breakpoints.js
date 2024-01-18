/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalUnitControl as UnitControl } from '@wordpress/components'; // eslint-disable-line

/**
 * Internal dependencies
 */
import links from './../../../utils/links';
import { InformationPopover } from './../../../components';

/**
 * Renders the breakpoint input settings.
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 */
export default function Breakpoints( props ) {
	const {
		visibilityControls,
		setVisibilityControls,
		screenSize,
		enableAdvancedControls,
	} = props;

	const breakpoints = {
		extra_large: {
			title: __( 'Extra Large', 'block-visibility' ),
			description: __( 'Large desktop screen sizes.' ),
			placeholder: '1200'
		},
		large: {
			title: __( 'Large', 'block-visibility' ),
			description: __(
				'Desktop and tablet (landscape) screen sizes.',
				'block-visibility',
			),
			placeholder: '992'
		},
		medium: {
			title: __( 'Medium', 'block-visibility' ),
			description: __(
				'Tablet (portrait) screen sizes.',
				'block-visibility'
			),
			placeholder: '768'
		},
		small: {
			title: __( 'Small', 'block-visibility' ),
			description: __(
				'Mobile (landscape) screen sizes.',
				'block-visibility'
			),
			placeholder: '576'
		},
	};

	function onBreakpointChange( breakpoint, value ) {
		setVisibilityControls( {
			...visibilityControls,
			screen_size: {
				...screenSize,
				breakpoints: {
					...screenSize.breakpoints,
					[ breakpoint ]: value,
				},
			},
		} );
	}

	return (
		<div className="breakpoints-container">
			<div className="settings-label">
				<span>{ __( 'Breakpoints', 'block-visibility' ) }</span>
				<InformationPopover
					message={ __(
						'The plugin automatically sets a series of breakpoints that enable the Screen Size control. However, for best results, you can configure the breakpoints to correspond with the media breakpoints of your current theme.',
						'block-visibility'
					) }
					subMessage={ __(
						'The default breakpoints are Large (992px) and Medium (768px). Advanced screen size controls add Extra Large (1200px) and Small (576px).',
						'block-visibility'
					) }
					link={ links.settingsScreenSize }
				/>
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
								placeholder={ labels.placeholder }
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
