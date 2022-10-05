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
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Slot,
	TextControl,
	ToggleControl,
	VisuallyHidden,
	withFilters,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import {
	Icon,
	moreVertical,
	check,
	settings,
	external,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './../../utils/icons';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalControlSetOptions = withFilters(
	'blockVisibility.addControlSetOptions'
)( ( props ) => <></> ); // eslint-disable-line

const AdditionalControlSetModals = withFilters(
	'blockVisibility.addControlSetModals'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Render the control set header.
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ControlSetHeader( props ) {
	const [ modalOpen, setModalOpen ] = useState( false );
	const {
		type,
		controls,
		controlSets,
		controlSetAtts,
		defaultControls,
		setControlSetAtts,
	} = props;

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

	function resetControls() {
		const newControlSetAtts = assign(
			{ ...controlSetAtts },
			{
				controls: defaultControls,
			}
		);

		setControlSetAtts( newControlSetAtts );
	}

	function removeControlSet() {
		setControlSetAtts( controlSetAtts, true );
	}

	function duplicateControlSet() {
		const maxId = Math.max( ...controlSets.map( ( set ) => set.id ), 0 );
		const setId = maxId + 1;
		const newControlSetAtts = { ...controlSetAtts, id: setId };

		setControlSetAtts( newControlSetAtts );
	}

	function setAttribute( attribute, value ) {
		setControlSetAtts( {
			...controlSetAtts,
			[ attribute ]: value,
		} );
	}

	const coreControls = controls.filter(
		( control ) => control.type === 'core'
	);
	const integrationControls = controls.filter(
		( control ) => control.type === 'integration'
	);
	const title = controlSetAtts?.title ?? '';
	const enable = controlSetAtts?.enable ?? true;
	let displayTitle = title;

	if ( ! displayTitle ) {
		displayTitle =
			type === 'single'
				? __( 'Enabled Controls', 'block-visibility' )
				: __( 'Control Set', 'block-visibility' );
	}

	const canResetAll = [ ...coreControls, ...integrationControls ].some(
		( control ) => control.active
	);

	const settingsDropdown = (
		<DropdownMenu
			className="settings-dropdown"
			label={ __( 'Settings', 'block-visibility' ) }
			icon={ settings }
			popoverProps={ {
				className: 'block-visibility__control-popover control-settings',
				focusOnMount: 'container',
			} }
		>
			{ () => (
				<>
					<h3>{ __( 'Settings', 'block-visibility' ) }</h3>
					<TextControl
						value={ title }
						label={ __( 'Control set title', 'block-visibility' ) }
						placeholder={ displayTitle }
						onChange={ ( value ) => setAttribute( 'title', value ) }
					/>
					<ToggleControl
						label={ __( 'Enable control set', 'block-visibility' ) }
						checked={ enable }
						onChange={ () => setAttribute( 'enable', ! enable ) }
					/>
				</>
			) }
		</DropdownMenu>
	);

	const controlsDropdown = (
		<DropdownMenu
			className="controls-dropdown"
			label={ __( 'Visibility Controls', 'block-visibility' ) }
			icon={ icons.visibilityAlt }
			popoverProps={ {
				className: 'block-visibility__control-popover control-set',
				focusOnMount: 'container',
			} }
		>
			{ () => (
				<>
					<MenuGroup label={ __( 'Controls', 'block-visibility' ) }>
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
							label={ __( 'Integrations', 'block-visibility' ) }
						>
							{ integrationControls.map( ( control, index ) => (
								<ControlMenuItem
									key={ index }
									control={ control }
									toggleControls={ toggleControls }
								/>
							) ) }
						</MenuGroup>
					) }
					<MenuGroup>
						<MenuItem
							aria-disabled={ ! canResetAll }
							variant={ 'tertiary' }
							onClick={ () => {
								resetControls();
							} }
						>
							{ __( 'Reset all', 'block-visibility' ) }
						</MenuItem>
					</MenuGroup>
				</>
			) }
		</DropdownMenu>
	);

	const optionsDropdown = (
		<DropdownMenu
			className="options-dropdown"
			label={ __( 'Options', 'block-visibility' ) }
			icon={ moreVertical }
			popoverProps={ { focusOnMount: 'container' } }
		>
			{ ( { onClose } ) => (
				<>
					<Slot name="ControlSetOptionsTop" />

					<MenuGroup label={ __( 'Tools', 'block-visibility' ) }>
						<Slot name="ControlSetOptionsToolsTop" />

						{ type === 'multiple' && (
							<MenuItem
								onClick={ () => {
									duplicateControlSet();
									onClose();
								} }
							>
								{ __( 'Duplicate', 'block-visibility' ) }
							</MenuItem>
						) }

						<Slot name="ControlSetOptionsToolsMiddle" />

						<Slot name="ControlSetOptionsToolsBottom" />

						<a
							href="https://www.blockvisibilitywp.com/knowledge-base/guide-to-visibility-controls-and-control-sets?bv_query=learn_more&utm_source=plugin&utm_medium=editor&utm_campaign=plugin_referrals"
							target="_blank"
							role="menuitem"
							rel="noopener noreferrer"
							className="components-button components-menu-item__button"
						>
							<span className="components-menu-item__item">
								{ __( 'Help', 'block-visibility' ) }
								<VisuallyHidden>
									{ __(
										'(opens in a new tab)',
										'block-visibility'
									) }
								</VisuallyHidden>
							</span>
							<Icon icon={ external } size={ 20 } />
						</a>
					</MenuGroup>

					<Slot name="ControlSetOptionsBottom" />

					{ type === 'multiple' && (
						<MenuGroup>
							<MenuItem
								onClick={ () => {
									removeControlSet();
									onClose();
								} }
							>
								{ __(
									'Remove control set',
									'block-visibility'
								) }
							</MenuItem>
						</MenuGroup>
					) }

					<AdditionalControlSetOptions
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
	);

	return (
		<>
			<div className="control-set__header section-header main">
				<span className="section-header__title">{ displayTitle }</span>
				<div className="section-header__toolbar">
					{ controlsDropdown }
					{ type === 'multiple' && settingsDropdown }
					{ optionsDropdown }
				</div>
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
	return (
		<>
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
			icon={ control.active && check }
			onClick={ () => toggleControls( control ) }
		>
			{ control.icon && (
				<Icon className="control-branding-icon" icon={ control.icon } />
			) }
			{ control.label }
		</MenuItem>
	);
}
