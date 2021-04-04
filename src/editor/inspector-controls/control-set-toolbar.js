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
import { useState } from '@wordpress/element';
import { Icon, moreHorizontalMobile, check, info } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { TipControlSet } from './utils/notices-tips';

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
		defaultControls,
		controls,
		blockAtts,
		controlSetAtts,
	} = props;

	function toggleControls( control ) {
		if ( control.active ) {
			delete controlSetAtts.controls[ control.attributeSlug ];
		} else if ( ! controlSetAtts.controls[ control.attributeSlug ] ) {
			controlSetAtts.controls[ control.attributeSlug ] = {};
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
									return (
										<MenuItem
											key={ control.attributeSlug }
											icon={ control.active ? check : '' }
											onClick={ () =>
												toggleControls( control )
											}
										>
											{ control.label }
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
