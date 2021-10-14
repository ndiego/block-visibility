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
	MenuGroup,
	MenuItem,
	Modal,
	Slot,
	withFilters,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, moreVertical, check, info } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { TipsControlSet } from './utils/notices-tips';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalControlSetToolbarOptions = withFilters(
	'blockVisibility.addControlSetToolbarOptions'
)( ( props ) => <></> ); // eslint-disable-line

const AdditionalControlSetModals = withFilters(
	'blockVisibility.addControlSetModals'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Render a control set
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ControlSetToolbar( props ) {
	const [ modalOpen, setModalOpen ] = useState( false );
	const { controls, controlSetAtts, setControlSetAtts } = props;

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

		setControlSetAtts( newControlSetAtts );
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
						onClick={ () => setModalOpen( 'tips' ) }
						isSmall
					/>
				</h3>
				<DropdownMenu
					label={ __(
						'Configure Visibility Controls',
						'block-visibility'
					) }
					icon={ moreVertical }
					className="configure-controls"
					popoverProps={ {
						className: 'block-visibility__control-popover',
						focusOnMount: 'container',
					} }
				>
					{ ( { onClose } ) => (
						<>
							<Slot name="ControlSetToolbarTop" />

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

							<Slot name="ControlSetToolbarMiddle" />

							<MenuGroup className="reset-container">
								<Slot name="ControlSetToolbarResetTop" />

								<MenuItem
									className="reset"
									onClick={ () => {
										setModalOpen( 'reset' );
										onClose();
									} }
								>
									{ __( 'Reset all', 'block-visibility' ) }
								</MenuItem>

								<Slot name="ControlSetToolbarResetBottom" />
							</MenuGroup>

							<Slot name="ControlSetToolbarBottom" />

							<AdditionalControlSetToolbarOptions
								modalOpen={ modalOpen }
								setModalOpen={ setModalOpen }
								toggleControls={ toggleControls }
								coreControls={ coreControls }
								integrationControls={ integrationControls }
								onClose={ onClose }
								{ ...props }
							/>
						</>
					) }
				</DropdownMenu>
			</div>
			{ modalOpen && (
				<ControlSetModals
					modalOpen={ modalOpen }
					setModalOpen={ setModalOpen }
					toggleControls={ toggleControls }
					coreControls={ coreControls }
					integrationControls={ integrationControls }
					{ ...props }
				/>
			) }
		</>
	);
}

/**
 * Render all Control Set modals.
 *
 * @since 2.1.1
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function ControlSetModals( props ) {
	const {
		controlSetAtts,
		setControlSetAtts,
		defaultControls,
		modalOpen,
		setModalOpen,
	} = props;

	function resetControlAtts() {
		const newControlSetAtts = assign(
			{ ...controlSetAtts },
			{
				controls: defaultControls,
			}
		);

		setControlSetAtts( newControlSetAtts );
		setModalOpen( false );
	}

	return (
		<>
			{ modalOpen === 'tips' && (
				<Modal
					className="block-visibility__tips-modal"
					title={ __(
						'Block Visibility: Quick Tips',
						'block-visibility'
					) }
					onRequestClose={ () => setModalOpen( false ) }
				>
					<TipsControlSet { ...props } />
				</Modal>
			) }
			{ modalOpen === 'reset' && (
				<Modal
					className="block-visibility__reset-modal"
					title={ __(
						'Reset all visibility controls?',
						'block-visibility'
					) }
					onRequestClose={ () => setModalOpen( false ) }
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
							onClick={ () => setModalOpen( false ) }
						>
							{ __( 'Cancel', 'block-visibility' ) }
						</Button>
						<Button isPrimary onClick={ () => resetControlAtts() }>
							{ __( 'Reset', 'block-visibility' ) }
						</Button>
					</div>
				</Modal>
			) }

			<Slot name="ControlSetModals" />
			<AdditionalControlSetModals { ...props } />
		</>
	);
}

/**
 * Render a control menu item.
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
