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
import icons from './../../utils/icons';

/**
 * Renders the save settings button and animation
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function SaveSettings( props ) {
	const { isAPISaving, hasSaveError, hasUpdates, onSettingsChange } = props;
	const updateButton = isAPISaving
		? __( 'Updating…', 'block-visibility' )
		: __( 'Update', 'block-visibility' );
	return (
		<div className="setting-controls__save-settings">
			{ [
				isAPISaving && (
					<Animate type="loading">
						{ ( { className: animateClassName } ) => (
							<span
								className={
									classnames( 'message', animateClassName )
								}
							>
								<Icon icon={ icons.cloud } />
								{ __( 'Saving', 'block-visibility' ) }
							</span>
						) }
					</Animate>
				),
				hasSaveError && (
					<span className="message update-failed">
						{ __(
							'Update failed. Try again or contact support.',
							'block-visibility'
						) }
					</span>
				),
			] }
			<Button
				className={ classnames( 'save-settings__save-button', {
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
