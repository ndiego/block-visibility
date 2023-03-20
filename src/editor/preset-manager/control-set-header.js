/**
 * External dependencies
 */
import { assign, omit } from 'lodash';

/**
 * WordPress dependencies
 */
import { speak } from '@wordpress/a11y';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import {
	Icon,
	moreVertical,
	check,
	plus,
	ungroup,
	pencil,
	trash,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	CopyButton,
	ImportButton,
	ImportModal,
} from './../../components/control-set-utilities';

/**
 * Render the control set header.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function ControlSetHeader( props ) {
	const [ modalOpen, setModalOpen ] = useState( false );
	const {
		activeSetControls,
		enabledSetControls,
		controlSets,
		controlSetAtts,
		setControlSetAtts,
	} = props;

	const coreControls = enabledSetControls.filter(
		( control ) => control.type !== 'integration'
	);
	const integrationControls = enabledSetControls.filter(
		( control ) => control.type === 'integration'
	);

	function toggleControls( control ) {
		let newControls;

		if ( control.isActive ) {
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
				controls: {}, //Need to fix needs to be default controls.
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

	const title = controlSetAtts?.title ?? '';
	const enable = controlSetAtts?.enable ?? true;
	const displayTitle = title
		? title
		: __( 'Control Set', 'block-visibility' );

	const canResetAll = [ ...coreControls, ...integrationControls ].some(
		( control ) => control.isActive
	);

	const editTitleDropdown = (
		<DropdownMenu
			label={ __( 'Edit', 'block-visibility' ) }
			icon={ pencil }
			popoverProps={ {
				className: 'block-visibility__control-popover edit-title',
				focusOnMount: 'container',
			} }
		>
			{ () => (
				<TextControl
					value={ title }
					label={ __( 'Control set title', 'block-visibility' ) }
					placeholder={ displayTitle }
					onChange={ ( value ) => setAttribute( 'title', value ) }
				/>
			) }
		</DropdownMenu>
	);

	const controlsDropdown = (
		<DropdownMenu
			className="controls-dropdown"
			label={ __( 'Visibility Controls', 'block-visibility' ) }
			icon={ activeSetControls.length === 0 ? plus : moreVertical }
			popoverProps={ {
				className:
					'block-visibility__control-popover visibility-controls',
				focusOnMount: 'container',
			} }
			toggleProps={ {
				isSmall: true,
				disabled: enabledSetControls.length === 0,
			} }
		>
			{ ( { onClose } ) => (
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
						<CopyButton canResetAll={ canResetAll } { ...props } />
						<ImportButton
							modalOpen={ modalOpen }
							onClose={ onClose }
							setModalOpen={ setModalOpen }
						/>
						<MenuItem
							onClick={ () => setAttribute( 'enable', ! enable ) }
						>
							{ enable
								? __( 'Disable all', 'block-visibility' )
								: __( 'Enable all', 'block-visibility' ) }
						</MenuItem>
						<MenuItem
							aria-disabled={ ! canResetAll }
							variant={ 'tertiary' }
							onClick={ () => {
								if ( canResetAll ) {
									resetControls();
									speak(
										__(
											'All controls reset',
											'block-visibility'
										),
										'assertive'
									);
								}
							} }
						>
							{ __( 'Reset all', 'block-visibility' ) }
						</MenuItem>
					</MenuGroup>
				</>
			) }
		</DropdownMenu>
	);

	return (
		<>
			<div className="control-set__header section-header main">
				<div className="section-header__title">
					<h2>{ displayTitle }</h2>
					{ editTitleDropdown }
				</div>
				<div className="section-header__toolbar">
					<Button
						disabled={
							activeSetControls.length === 0 &&
							controlSets.length <= 1
						}
						icon={ trash }
						isSmall
						label={ __( 'Remove', 'block-visibility' ) }
						onClick={ () => removeControlSet() }
					/>
					<Button
						disabled={ activeSetControls.length === 0 }
						icon={ ungroup }
						isSmall
						label={ __( 'Duplicate', 'block-visibility' ) }
						onClick={ () => duplicateControlSet() }
						style={ { padding: 0 } }
					/>
					{ controlsDropdown }
				</div>
			</div>
			{ modalOpen && (
				<ImportModal
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
 * Render a control menu item.
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function ControlMenuItem( props ) {
	const { control, toggleControls } = props;

	return (
		<MenuItem
			key={ control.attributeSlug }
			icon={ control.isActive && check }
			label={ sprintf(
				// translators: %s: The name of the control being toggled e.g. "Hide Block".
				__( 'Toggle %s' ),
				control.label
			) }
			onClick={ () => {
				toggleControls( control );
				speak(
					sprintf(
						// translators: %s: The name of the control being toggled e.g. "Hide Block".
						__( '%s toggled' ),
						control.label
					),
					'assertive'
				);
			} }
		>
			{ control.icon && (
				<Icon className="control-branding-icon" icon={ control.icon } />
			) }
			{ control.label }
		</MenuItem>
	);
}
