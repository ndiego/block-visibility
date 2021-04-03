/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	Flex,
	FlexItem,
	FlexBlock,
	MenuGroup,
	MenuItem,
	Modal,
	Popover,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { useState } from '@wordpress/element';
import { Icon, moreHorizontalMobile, check, info } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { TipControlSet } from './utils/notices-tips';
import icons from './../../utils/icons';

/**
 * Render a control set
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ControlSetToolbar( props ) {
	const [ popoverOpen, setPopoverOpen ] = useState( false );
	const [ tipsPopoverOpen, setTipsPopoverOpen ] = useState( false );
	const [ resetModalOpen, setResetModalOpen ] = useState( false );
	const {
		setAttributes,
		variables,
		defaultControls,
		enabledControls,
		blockAtts,
		controlSetAtts,
	} = props;

	const isPluginActive = ( plugin ) => {
		const isActive = variables?.integrations[ plugin ]?.active ?? false;
		return isActive;
	};

	let controls = [
		{
			slug: 'dateTime',
			name: __( 'Date & Time', 'block-visibility' ),
			active: controlSetAtts?.controls.hasOwnProperty( 'dateTime' ),
			enable: enabledControls.includes( 'date_time' ),
		},
		{
			slug: 'userRole',
			name: __( 'User Role', 'block-visibility' ),
			active: controlSetAtts?.controls.hasOwnProperty( 'userRole' ),
			enable: enabledControls.includes( 'visibility_by_role' ),
		},
		{
			slug: 'screenSize',
			name: __( 'Screen Size', 'block-visibility' ),
			active: controlSetAtts?.controls.hasOwnProperty( 'screenSize' ),
			enable: enabledControls.includes( 'screen_size' ),
		},
		{
			slug: 'queryString',
			name: __( 'Query String', 'block-visibility' ),
			active: controlSetAtts?.controls.hasOwnProperty( 'queryString' ),
			enable: enabledControls.includes( 'query_string' ),
		},
		{
			slug: 'wpFusion',
			name: __( 'WP Fusion', 'block-visibility' ),
			icon: icons.wpFusion,
			active: controlSetAtts?.controls.hasOwnProperty( 'wpFusion' ),
			enable:
				enabledControls.includes( 'wp_fusion' ) &&
				isPluginActive( 'wpFusion' ),
		},
	];

	// Filter allows the pro plugin to add new visibility controls.
	controls = applyFilters(
		'blockVisibility.visibilityControls',
		controls,
		controlSetAtts,
		enabledControls
	);

	function toggleControls( control ) {
		if ( control.active ) {
			delete controlSetAtts.controls[ control.slug ];
		} else if ( ! controlSetAtts.controls[ control.slug ] ) {
			controlSetAtts.controls[ control.slug ] = {};
		}

		blockAtts.controlSets[ controlSetAtts.id ] = controlSetAtts;

		setAttributes( {
			blockVisibility: assign(
				{ ...blockAtts },
				{ controlSets: blockAtts.controlSets }
			),
		} );
	}

	function resetControlAtts() {
		controlSetAtts.controls = defaultControls;

		blockAtts.controlSets[ controlSetAtts.id ] = controlSetAtts;

		setAttributes( {
			blockVisibility: assign(
				{ ...blockAtts },
				{ controlSets: blockAtts.controlSets }
			),
		} );

		setResetModalOpen( false );
	}

	return (
		<>
			<Flex className="block-visibility__control-set-header">
				<FlexBlock>
					<h3>
						{ __( 'Controls', 'block-visibility' ) }
						<Button
							label={ __( 'Quick Tips', 'block-visibility' ) }
							icon={ info }
							className="control-tips"
							onClick={ () =>
								setTipsPopoverOpen( ( open ) => ! open )
							}
							isSmall
						/>
						{ tipsPopoverOpen && (
							<Popover
								className="block-visibility__control-popover tips"
								focusOnMount="container"
								onClose={ () => setTipsPopoverOpen( false ) }
							>
								<TipControlSet { ...props } />
							</Popover>
						) }
					</h3>
				</FlexBlock>
				<FlexItem>
					<Button
						label={ __(
							'Configure Visibility Controls',
							'block-visibility'
						) }
						icon={ moreHorizontalMobile }
						className="control-ellipsis"
						onClick={ () => setPopoverOpen( ( open ) => ! open ) }
					/>
					{ popoverOpen && (
						<Popover
							className="block-visibility__control-popover"
							focusOnMount="container"
							onClose={ () => setPopoverOpen( false ) }
						>
							<MenuGroup
								label={ __(
									'Enabled Controls',
									'block-visibility'
								) }
							>
								{ controls.map( ( control ) => {
									if ( ! control.enable ) {
										return null;
									}

									return (
										<MenuItem
											key={ control.slug }
											icon={ control.active ? check : '' }
											onClick={ () =>
												toggleControls( control )
											}
										>
											{ control.name }
											{ control.icon && (
												<Icon
													className="control-branding-icon"
													icon={ control.icon }
												/>
											) }
										</MenuItem>
									);
								} ) }
								<div className="reset-container">
									<MenuItem
										className="reset"
										onClick={ () => {
											setResetModalOpen( true );
										} }
									>
										{ __(
											'Reset all',
											'block-visibility'
										) }
									</MenuItem>
								</div>
							</MenuGroup>
						</Popover>
					) }
				</FlexItem>
			</Flex>
			{ resetModalOpen && (
				<Modal
					className="block-visibility__reset-modal"
					title={ __(
						'Reset all visibility controls?',
						'block-visibility'
					) }
					onRequestClose={ () => setResetModalOpen( false ) }
				>
					<p>
						{ __(
							'Resetting will remove all control settings that you may have configured and will restore the default controls.',
							'block-visibility'
						) }
					</p>
					<div className="block-visibility__reset-modal--buttons">
						<Button
							isSecondary
							onClick={ () => setResetModalOpen( false ) }
						>
							{ __( 'Cancel', 'block-visibility' ) }
						</Button>
						<Button isPrimary onClick={ () => resetControlAtts() }>
							{ __( 'Reset', 'block-visibility' ) }
						</Button>
					</div>
				</Modal>
			) }
		</>
	);
}
