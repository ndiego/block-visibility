/**
 * External dependencies
 */
import { assign, omit } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	DropdownMenu,
	Flex,
	FlexItem,
	FlexBlock,
	MenuGroup,
	MenuItem,
	Modal,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, moreHorizontal, check, info } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { TipsControlSet } from './utils/notices-tips';

/**
 * Render a control set
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ControlSetToolbar( props ) {
	const [ tipsModalOpen, setTipsModalOpen ] = useState( false );
	const [ resetModalOpen, setResetModalOpen ] = useState( false );
	const {
		attributes,
		setAttributes,
		defaultControls,
		controls,
		controlSetAtts,
	} = props;
	const { blockVisibility } = attributes;

	function toggleControls( control ) {
		let newControls;

		if ( control.active ) {
			newControls = omit( { ...controlSetAtts.controls }, [
				control.attributeSlug,
			] );
		} else {
			newControls = assign(
				{ ...controlSetAtts.controls },
				{ [ control.attributeSlug ]: {} }
			);
		}

		const newControlSetAtts = assign(
			{ ...controlSetAtts },
			{ controls: { ...newControls } }
		);

		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{ controlSets: [ ...[ newControlSetAtts ] ] }
			),
		} );
	}

	function resetControlAtts() {
		const newControlSetAtts = assign(
			{ ...controlSetAtts },
			{
				controls: defaultControls,
			}
		);

		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{ controlSets: [ ...[ newControlSetAtts ] ] }
			),
		} );

		setResetModalOpen( false );
	}

	const coreControls = controls.filter(
		( control ) => control.type === 'core'
	);
	const integrationControls = controls.filter(
		( control ) => control.type === 'integration'
	);

	return (
		<>
			<div className="block-visibility__control-set-header">
				<h3>
					{ __( 'Enabled Controls', 'block-visibility' ) }
					<Button
						label={ __( 'Quick Tips', 'block-visibility' ) }
						icon={ info }
						className="control-tips"
						onClick={ () =>
							setTipsModalOpen( ( open ) => ! open )
						}
						isSmall
					/>
				</h3>
				<DropdownMenu
					label={ __(
						'Configure Visibility Controls',
						'block-visibility'
					) }
					icon={ moreHorizontal }
					className="configure-controls"
					popoverProps={ {
						className: 'block-visibility__control-popover',
						focusOnMount: 'container',
					} }
				>
					{ ( { onClose } ) => (
						<>
							<MenuGroup
								className="core-controls"
								label={ __(
									'Visibility Controls',
									'block-visibility'
								) }
							>
								{ coreControls.map( ( control, index ) => (
									<ControlMenuItem
										key={ index }
										control={ control }
										toggleControls={ toggleControls }
									/>
								) ) }
							</MenuGroup>
							{ integrationControls.length !== 0 && (
								<MenuGroup
									className="integration-controls"
									label={ __(
										'Integrations',
										'block-visibility'
									) }
								>
									{ integrationControls.map(
										( control, index ) => (
											<ControlMenuItem
												key={ index }
												control={ control }
												toggleControls={
													toggleControls
												}
											/>
										)
									) }
								</MenuGroup>
							) }
							<MenuGroup className="reset-container">
								<MenuItem
									className="reset"
									onClick={ () => {
										setResetModalOpen( true );
										onClose();
									} }
								>
									{ __(
										'Reset all',
										'block-visibility'
									) }
								</MenuItem>
							</MenuGroup>
						</>
					) }
				</DropdownMenu>
			</div>
			{ tipsModalOpen && (
				<Modal
					className="block-visibility__tips-modal"
					title={ __(
						'Block Visibility: Quick Tips',
						'block-visibility'
					) }
					onRequestClose={ () => setTipsModalOpen( false ) }
				>
					<TipsControlSet { ...props } />
				</Modal>
			) }
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

/**
 * Render a control menu item
 *
 * @since 1.9.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function ControlMenuItem( props ) {
	const { control, toggleControls } = props;
	return (
		<MenuItem
			key={ control.attributeSlug }
			className={ classnames( {
				disabled: ! control.active,
			} ) }
			icon={ control.active ? check : '' }
			onClick={ () => toggleControls( control ) }
		>
			{ control.icon && (
				<Icon className="control-branding-icon" icon={ control.icon } />
			) }
			{ control.label }
		</MenuItem>
	);
}
