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
	MenuItem,
	Modal,
	Notice,
	TextareaControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import { paste } from './../../utils/icons';

/**
 * Render the import visibility attributes menu button.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function ImportButton( props ) {
	const { onClose, setModalOpen } = props;

	return (
		<MenuItem
			className="import"
			onClick={ () => {
				setModalOpen( 'import' );
				onClose();
			} }
		>
			{ __( 'Import', 'block-visibility' ) }
		</MenuItem>
	);
}

/**
 * Render the import visibility attributes modal.
 *
 * @since 1.2.0
 * @param {Object} props All the props passed to this function
 */
export function ImportModal( props ) {
	const [ input, setInput ] = useState( '' );
	const { controlSetAtts, setControlSetAtts, modalOpen, setModalOpen } =
		props;
	const isValid = input ? isValidJson( input ) : true;

	function pasteFromClipboard() {
		navigator.clipboard.readText().then( ( text ) => { // eslint-disable-line
			setInput( text );
		} );
	}

	const { createSuccessNotice } = useDispatch( noticesStore );
	const importNotice = __(
		'Visibility settings successfully imported.',
		'block-visibility'
	);

	function importSettings( inputSettings ) {
		const settings = JSON.parse( inputSettings );

		const newControlSetAtts = assign(
			{ ...controlSetAtts },
			{ controls: settings }
		);

		setControlSetAtts( newControlSetAtts );
		setModalOpen( false );
		createSuccessNotice( importNotice, { type: 'snackbar' } );
	}

	// Paste from clipboard only works in secure environments.
	const isPageSecure = document.location.protocol === 'https:';

	return (
		<>
			{ modalOpen === 'import' && (
				<Modal
					className="block-visibility__import-modal"
					title={ __(
						'Import Visibility Control Settings',
						'block-visibility'
					) }
					onRequestClose={ () => setModalOpen( false ) }
				>
					{ ! isValid && (
						<Notice status="error" isDismissible={ false }>
							{ __(
								'The provided settings are not properly formatted.',
								'block-visibility'
							) }
						</Notice>
					) }
					<div className="block-visibility__import-modal--input">
						<Button
							label={ __(
								'Paste from clipboard',
								'block-visibility'
							) }
							onClick={ () => pasteFromClipboard() }
							disabled={ input || ! isPageSecure }
							isTertiary
							isSmall
							icon={ paste }
						/>
						<TextareaControl
							value={ input }
							onChange={ ( value ) => setInput( value ) }
							placeholder={ __(
								'Paste copied settings or input manually.',
								'block-visibility'
							) }
							help={ __(
								'Imported settings will override any visibility controls currently applied to the selected block.',
								'block-visibility'
							) }
							rows={ 6 }
						/>
					</div>
					<div className="block-visibility__import-modal--buttons">
						<Button
							isSecondary
							onClick={ () => setModalOpen( false ) }
						>
							{ __( 'Cancel', 'block-visibility' ) }
						</Button>
						<Button
							isPrimary
							onClick={ () => importSettings( input ) }
							disabled={ ! isValid || ! input }
						>
							{ __( 'Import', 'block-visibility' ) }
						</Button>
					</div>
				</Modal>
			) }
		</>
	);
}

/**
 * Helper function for checking if input is valid JSON and has the correct format.
 *
 * @since 1.2.0
 * @param {string} string The input string to be tested
 * @return {boolean}	  Is the string valid or not
 */
function isValidJson( string ) {
	// First check if actually JSON.
	try {
		JSON.parse( string );
	} catch ( e ) {
		return false;
	}

	return true;
}
