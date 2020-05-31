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


function SaveSettings( props ) {
    const { 
        isAPISaving,
        hasUpdates,
        onSettingsChange,
        notSavingMessage,
        notSavingIcon
    } = props;
    
    const updateButton = isAPISaving 
        ? __( 'Updating...', 'block-visibility' )
        : __( 'Update', 'block-visibility' );
    
    return (
        <div className="bv-save-settings">
            <div className="bv-save-settings__messages">
                { [
                    isAPISaving && (
                        <Animate type="loading">
                            { ( { className: animateClassName } ) => (
                                <span className={ animateClassName } >
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
                ] }
            </div>
            <Button
                className={ classnames(
                    'bv-save-settings__button',
                    { 'is-busy': isAPISaving },
                ) }
                onClick={ onSettingsChange }
                disabled={ ! hasUpdates }
                isPrimary
            >
                { updateButton }
            </Button>
        </div>
    );
}
export default SaveSettings;