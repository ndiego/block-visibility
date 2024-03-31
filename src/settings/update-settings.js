/**
 * External dependencies
 */
import classnames from 'classnames';
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Animate,
	Button,
	Modal,
	Spinner,
	DropdownMenu,
	MenuGroup,
	MenuItem,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useRef, useState } from '@wordpress/element';
import { cloud, Icon, moreVertical } from '@wordpress/icons';
import { downloadBlob } from '@wordpress/blob';

/**
 * Renders the update settings buttons and animation
 *
 * @since 2.1.0
 * @param {Object} props All the props passed to this function
 */
export default function UpdateSettings( props ) {
	const [ status, setStatus ] = useState( 'saved' );
	const [ resetModalOpen, setResetModalOpen ] = useState( false );
	const {
		settings,
		setSettings,
		hasUpdates,
		setHasUpdates,
		tabSlug,
		tabSettings,
	} = props;
	const { saveEntityRecord } = useDispatch( coreStore );

	const updateButton =
		status === 'saving'
			? __( 'Updating…', 'block-visibility' )
			: __( 'Update', 'block-visibility' );

	// Handle all setting changes, and save to the database.
	async function onSettingsChange( type = 'save' ) {
		let record = '';

		if ( type === 'reset' ) {
			setStatus( 'resetting' );
			record = { reset: tabSlug };
		} else if ( type === 'resetAll' ) {
			setStatus( 'resetting' );
			record = { reset: 'all' };
		} else {
			setStatus( 'saving' );
			record = assign( { ...settings }, { [ tabSlug ]: tabSettings } );
		}

		let response = '';
		response = await saveEntityRecord(
			'block-visibility/v1',
			'settings',
			record
		);

		if ( response ) {
			setSettings( response );

			if ( type === 'reset' || type === 'resetAll' ) {
				setStatus( 'reset' );
				setResetModalOpen( false );
			} else {
				setStatus( 'saved' );
				setHasUpdates( false );
			}
		} else {
			setStatus( 'error' );
		}
	}

	const ImportJsonComponent = () => {
		// Use useRef to reference the hidden file input element
		const fileInputRef = useRef( null );

		// Function to trigger the file input click
		const handleImportClick = () => {
			fileInputRef.current.click();
		};

		// Function to handle file selection and read the file
		const handleFileChange = ( event ) => {
			const file = event.target.files[ 0 ];
			if ( ! file ) {
				return;
			}

			const reader = new window.FileReader();
			reader.onload = ( e ) => {
				try {
					// Parse the JSON content to an object
					const jsonObj = JSON.parse( e.target.result );
					console.log( jsonObj ); // Handle the parsed object here
					// For example, you could set this to state or pass it up to a parent component
				} catch ( error ) {
					console.error( 'Error parsing JSON:', error );
				}
			};

			reader.readAsText( file );
		};

		return (
			<MenuItem
				onClick={ () => handleImportClick() }
				disabled={ status === 'saving' }
			>
				{ __( 'Import', 'block-visibility' ) }
				<input
					type="file"
					ref={ fileInputRef }
					onChange={ handleFileChange }
					style={ { display: 'none' } }
					accept=".json"
				/>
			</MenuItem>
		);
	};

	const settingToolsDropdown = (
		<DropdownMenu
			className="setting-tools-dropdown"
			label={ __( 'Setting Tools', 'block-visibility' ) }
			icon={ moreVertical }
			popoverProps={ {
				focusOnMount: 'container',
				placement: 'bottom-end',
			} }
			toggleProps={ {
				isSmall: true,
			} }
		>
			{ ( { onClose } ) => (
				<>
					<MenuGroup
						label={ __( 'Setting Tools', 'block-visibility' ) }
					>
						<MenuItem
							onClick={ () =>
								downloadBlob(
									'block-visibility-settings.json',
									JSON.stringify( settings, null, 2 ),
									'application/json'
								)
							}
							disabled={ status === 'saving' }
						>
							{ __( 'Export', 'block-visibility' ) }
						</MenuItem>
						<ImportJsonComponent />
						<MenuItem
							onClick={ () => {
								setResetModalOpen( true );
								onClose();
							} }
							disabled={ status === 'saving' }
						>
							{ __( 'Reset', 'block-visibility' ) }
						</MenuItem>
					</MenuGroup>
				</>
			) }
		</DropdownMenu>
	);

	return (
		<>
			<div className="setting-controls__save-settings">
				{ [
					status === 'saving' && (
						<Animate type="loading">
							{ ( { className: animateClassName } ) => (
								<span
									className={ classnames(
										'message',
										animateClassName
									) }
								>
									<Icon icon={ cloud } />
									{ __( 'Saving', 'block-visibility' ) }
								</span>
							) }
						</Animate>
					),
					status === 'error' && (
						<span className="message update-failed">
							{ __(
								'Update failed. Try again or get in touch with support.',
								'block-visibility'
							) }
						</span>
					),
				] }
				{ status !== 'saving' && (
					<Button
						className="reset-settings__save-button"
						onClick={ () => setResetModalOpen( true ) }
						isTertiary
					>
						{ __( 'Reset Settings', 'block-visibility' ) }
					</Button>
				) }
				<Button
					className={ classnames( 'save-settings__save-button', {
						'is-busy': status === 'saving',
					} ) }
					onClick={ () => onSettingsChange() }
					disabled={ ! hasUpdates && status !== 'error' }
					isPrimary
				>
					{ updateButton }
				</Button>
				{ settingToolsDropdown }
			</div>
			{ resetModalOpen && (
				<Modal
					className="block-visibility__reset-modal"
					title={ __( 'Reset Settings', 'block-visibility' ) }
					onRequestClose={ () => setResetModalOpen( false ) }
				>
					<p>
						{ __(
							'Resetting will restore all configured settings on the current tab to their default values. To restore all plugin settings, choose Reset All.',
							'block-visibility'
						) }
					</p>
					<div className="block-visibility__reset-modal--buttons">
						<div className="block-visibility__reset-modal--buttons-reset">
							<Button
								isPrimary
								onClick={ () => onSettingsChange( 'reset' ) }
							>
								{ __( 'Reset', 'block-visibility' ) }
							</Button>
							<Button
								isSecondary
								onClick={ () => onSettingsChange( 'resetAll' ) }
							>
								{ __( 'Reset All', 'block-visibility' ) }
							</Button>
							{ status === 'resetting' && <Spinner /> }
						</div>
						<Button
							isTertiary
							onClick={ () => setResetModalOpen( false ) }
						>
							{ __( 'Cancel', 'block-visibility' ) }
						</Button>
					</div>
					{ status === 'error' && (
						<div className="message update-failed">
							{ __(
								'Reset failed. Try again or get in touch with support.',
								'block-visibility'
							) }
						</div>
					) }
				</Modal>
			) }
		</>
	);
}
