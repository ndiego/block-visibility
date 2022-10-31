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
 * @return {string}		 Return the rendered JSX
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
						'The plugin sets a series of breakpoints which enable the Screen Size control automatically. However for best results, you can configure the breakpoints to correspond with the media breakpoints of your current theme.',
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
