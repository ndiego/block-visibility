/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Animate, Button } from '@wordpress/components';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './../icons';

/**
 * Renders the save settings button and animation
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function SaveSettings( props ) {
	const {
		isAPISaving,
		hasSaveError,
		hasUpdates,
		onSettingsChange,
		notSavingMessage,
		notSavingIcon,
	} = props;
	const updateButton = isAPISaving
		? __( 'Updating…', 'block-visibility' )
		: __( 'Update', 'block-visibility' );
	return (
		<div className="bv-save-settings">
			<div className="bv-save-settings__messages">
				{ [
					isAPISaving && (
						<Animate type="loading">
							{ ( { className: animateClassName } ) => (
								<span className={ animateClassName }>
									<Icon icon={ icons.cloud } />
									{ __( 'Saving', 'block-visibility' ) }
								</span>
							) }
						</Animate>
					),
					// If a message has been supplied to show when we are not
					// actively saving settings, display it.
					! isAPISaving && notSavingMessage && (
						<span className="visibility-message">
							<Icon icon={ notSavingIcon } />
							{ notSavingMessage }
						</span>
					),
					hasSaveError && (
						<span className="update-failed">
							{ __(
								'Update failed. Try again or contact support.',
								'block-visibility'
							) }
						</span>
					),
				] }
			</div>
			<Button
				className={ classnames( 'bv-save-settings__button', {
					'is-busy': isAPISaving,
				} ) }
				onClick={ onSettingsChange }
				disabled={ ! hasUpdates && ! hasSaveError }
				isPrimary
			>
				{ updateButton }
			</Button>
		</div>
	);
}
