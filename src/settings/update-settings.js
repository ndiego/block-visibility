/**
 * External dependencies
 */
import classnames from 'classnames';
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Animate, Button, Modal, Spinner } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { cloud, Icon } from '@wordpress/icons';

/**
 * Renders the update settings buttons and animation
 *
 * @since 2.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
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

	const updateButton =
		status === 'saving'
			? __( 'Updating…', 'block-visibility' )
			: __( 'Update', 'block-visibility' );

	// Handle all setting changes, and save to the database.
	async function onSettingsChange( type = 'save' ) {
		let body = '';

		if ( type === 'reset' ) {
			setStatus( 'resetting' );
			body = { reset: tabSlug };
		} else if ( type === 'resetAll' ) {
			setStatus( 'resetting' );
			body = { reset: 'all' };
		} else {
			setStatus( 'saving' );
			body = assign( { ...settings }, { [ tabSlug ]: tabSettings } );
		}

		// blockVisibilityRestUrl is provided by wp_add_inline_script.
		const fetchUrl = `${ blockVisibilityRestUrl }block-visibility/v1/settings`; // eslint-disable-line

		const response = await fetch( fetchUrl, { // eslint-disable-line
			method: 'POST',
			body: JSON.stringify( body ),
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': wpApiSettings.nonce, // eslint-disable-line
			},
		} );

		if ( response.ok ) {
			const data = await response.json();
			setSettings( data );

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
								'Update failed. Try again or contact support.',
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
								'Reset failed. Try again or contact support.',
								'block-visibility'
							) }
						</div>
					) }
				</Modal>
			) }
		</>
	);
}
