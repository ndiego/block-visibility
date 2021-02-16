/**
 * External dependencies
 */
import { startCase } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	TextControl,
	Disabled,
	Slot,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import InformationPopover from './../../utils/information-popover';

/**
 * Renders the screen size (responsive design) control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ScreenSize( props ) {
	const { settings, setSettings, setHasUpdates } = props;
	console.log( settings );
	// Manually set defaults, this ensures the main settings function properly.
	let screenSize;

	if ( ! settings?.screen_size ) {
		screenSize = {
			enable: true,
			breakpoints: {
				extra_large: {
					enable: false,
					value: 1200,
				},
				large: {
					enable: true,
					value: 992,
				},
				medium: {
					enable: true,
					value: 768,
				},
				small: {
					enable: false,
					value: 576,
				},
			},
			enable_frontend_css: true,
		}
	} else {
		screenSize = settings.screen_size;
	}

	console.log( screenSize );

	const enable = screenSize.enable;
	const enableFrontendCSS = screenSize.enable_frontend_css;
	const breakpoints = {
		extra_large: {
			title: __( 'Extra Large', 'block-visibility' ),
			description: __( 'Set the breakpoint for desktop screen sizes and larger.' ),
		},
		large:  {
			title: __( 'Large', 'block-visibility' ),
			description: __( 'Set the breakpoint for desktop and tablet (landscape) screen sizes.', 'block-visibility' ),
		},
		medium:  {
			title: __( 'Medium', 'block-visibility' ),
			description: __( 'Set the breakpoint for tablet (portrait) screen sizes.', 'block-visibility' ),
		},
		small:   {
			title: __( 'Small', 'block-visibility' ),
			description: __( 'Set the breakpoint for mobile screen sizes.', 'block-visibility' ),
		},
	}

	function onBreakpointChange( breakpoint, setting, settingValue ) {
		setSettings( {
			...settings,
			screen_size: {
				...screenSize,
				breakpoints: {
					...screenSize.breakpoints,
					[ breakpoint ]: {
						...screenSize.breakpoints[ breakpoint ],
						[ setting ]: settingValue,
					},
				},
			},
		} );
		setHasUpdates( true );
	}

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Screen Size (Responsive Design)', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Screen Size controls.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setSettings( {
								...settings,
								screen_size: {
									...screenSize,
									enable: ! enable,
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
				<div class="flex">
				<div className='breakpoints-container'>
					{ Object.entries( breakpoints ).map( ( [ breakpoint, labels ] ) => {
						const breakpointEnabled = screenSize.breakpoints[ breakpoint ].enable;
						const breakpointValue = screenSize.breakpoints[ breakpoint ].value;

						const isOptional = breakpoint === 'extra_large' || breakpoint === 'small';

						return(
							<div className='breakpoint'>
								<div className='settings-label'>
									{ labels.title }
									{ isOptional && ' ' + __(
										'(Optional)',
										'block-visibility'
									) }
								</div>
								<div className='breakpoint-inputs'>
									<TextControl
										label={ __(
											'Breakpoint value',
											'block-visibility'
										) }
										value={ breakpointValue }
										type='number'
										hideLabelFromVision={ true }
										onChange={ ( value ) => {
											onBreakpointChange(
												breakpoint,
												'value',
												value
											);
										} }
									/>
									<span>px</span>
									{ isOptional && (
										<ToggleControl
											label={ __(
												'Enable breakpoint',
												'block-visibility'
											) }
											checked={ breakpointEnabled }
											onChange={ () => {
												onBreakpointChange(
													breakpoint,
													'enable',
													! breakpointEnabled
												);
											} }
										/>
									) }
								</div>
								<div className="settings-panel__help">
									{ labels.description }
								</div>
							</div>
						);
					} ) }
				</div>
				<div>
				<ToggleControl
					label={ __(
						'Enable large desktop control',
						'block-visibility'
					) }
					help={ 'Allows users to hide blocks on large desktop screen sizes, 1200px and up.' }
					checked={ false }
					onChange={ () => {
						console.log( 'test' );
					} }
				/>
				<ToggleControl
					label={ __(
						'Enable desktop control',
						'block-visibility'
					) }
					help={ 'Allows users to hide blocks on desktop and tablet (landscape) screen sizes, between 992px and 1200px.' }
					checked={ true }
					onChange={ () => {
						console.log( 'test' );
					} }
				/>
				<ToggleControl
					label={ __(
						'Enable tablet control',
						'block-visibility'
					) }
					help={ 'Allows users to hide blocks on tablet (portrait) screen sizes, between 768px and 992px.' }
					checked={ true }
					onChange={ () => {
						console.log( 'test' );
					} }
				/>
				<ToggleControl
					label={ __(
						'Enable mobile (landscape) control',
						'block-visibility'
					) }
					help={ 'Allows users to hide blocks on mobile (landscape) screen sizes, between 576px and 768px.' }
					checked={ true }
					onChange={ () => {
						console.log( 'test' );
					} }
				/>
				<ToggleControl
					label={ __(
						'Enable mobile (portrait) control',
						'block-visibility'
					) }
					help={ 'Allows users to hide blocks on mobile (portrait) screen sizes, up to 562px.' }
					checked={ false }
					onChange={ () => {
						console.log( 'test' );
					} }
				/>
				</div>
				</div>
				<div>
					<pre>{`
// Extra large devices (large desktops, ${ screenSize.breakpoints.extra_large.value }px and up)
@media ( min-width: ${ screenSize.breakpoints.extra_large.value }px ) {
	.block-visibility-hide-screen-extra-large {
		display: none !important;
	}
}

// Large devices (desktops, ${ screenSize.breakpoints.large.value }px and up)
@media ( min-width: ${ screenSize.breakpoints.large.value }px ) and (max-width: ${ screenSize.breakpoints.extra_large.value - 0.02 }px ) {
	.block-visibility-hide-screen-large {
		display: none !important;
	}
}

// Medium devices (tablets, ${ screenSize.breakpoints.medium.value }px and up)
@media ( min-width: ${ screenSize.breakpoints.medium.value }px ) and ( max-width: ${ screenSize.breakpoints.large.value - 0.02 }px ) {
	.block-visibility-hide-screen-medium {
		display: none !important;
	}
}

// Small devices (landscape phones, ${ screenSize.breakpoints.small.value }px and up)
@media ( min-width: ${ screenSize.breakpoints.small.value }px) and ( max-width: ${ screenSize.breakpoints.medium.value - 0.02 }px ) {
	.block-visibility-hide-screen-small {
		display: none !important;
	}
}

// Extra small devices (portrait phones, less than ${ screenSize.breakpoints.small.value }px)
@media ( max-width: ${ screenSize.breakpoints.small.value - 0.02 }px ) {
	.block-visibility-hide-screen-extra-small {
		display: none !important;
	}
}
					`}</pre>
				</div>
				<ToggleControl
					label={ __(
						'Hide on extra large screens',
						'block-visibility'
					) }
					help={ 'Large desktops' }
					checked={ false }
					onChange={ () => {
						console.log( 'test' );
					} }
				/>
				<ToggleControl
					label={ __(
						'Hide on large screens',
						'block-visibility'
					) }
					help={ 'Desktop and tablet (landscape) screen sizes' }
					checked={ false }
					onChange={ () => {
						console.log( 'test' );
					} }
				/>
				<ToggleControl
					label={ __(
						'Hide on medium screens',
						'block-visibility'
					) }
					help={ 'Tablet (portrait) screen sizes' }
					checked={ false }
					onChange={ () => {
						console.log( 'test' );
					} }
				/>
				<ToggleControl
					label={ __(
						'Hide on small screens',
						'block-visibility'
					) }
					help={ 'Mobile (landscape) screen sizes' }
					checked={ false }
					onChange={ () => {
						console.log( 'test' );
					} }
				/>
				<ToggleControl
					label={ __(
						'Hide on extra small devices',
						'block-visibility'
					) }
					help={ 'Mobile (portrait) screen sizes' }
					checked={ false }
					onChange={ () => {
						console.log( 'test' );
					} }
				/>
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Load screen size CSS on the Frontend of this website.',
							'block-visibility'
						) }
						checked={ enableFrontendCSS }
						onChange={ () => {
							setSettings( {
								...settings,
								screen_size: {
									...screenSize,
									enable_frontend_css: ! enableFrontendCSS,
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
				<Slot name="ResponsiveControls" />
			</div>
		</div>
	);
}
