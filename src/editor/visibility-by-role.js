/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RadioControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import UserRoles from './user-roles';

function VisibilityByRole( props ) {
    const { attributes, setAttributes } = props;
    const { blockVisibility } = attributes;
    const { hideBlock, visibilityByRole } = blockVisibility;
    
    function optionLabel( title, description ) {
        return (
            <div className="compound-radio-label">
                { title }
                <span>{ description }</span>
            </div>
        );
    }
    
    const options = [
        {
            label: optionLabel( 
                __( 'All', 'block-visibility' ), 
                __( 'Visible to everyone', 'block-visibility' ) 
            ),
            value: 'all',
        },
        {
            label: optionLabel( 
                __( 'Public', 'block-visibility' ), 
                __( 'Visible to all logged-out users', 'block-visibility' ) 
            ),
            value: 'logged-out',
        },
        {
            label: optionLabel( 
                __( 'Private', 'block-visibility' ), 
                __( 'Visible to all logged-in users', 'block-visibility' ) 
            ),
            value: 'logged-in',
        },
        {
            label: optionLabel( 
                __( 'User Role', 'block-visibility' ), 
                __( 'Restrict visibility to specific user roles', 'block-visibility' ) 
            ),
            value: 'user-role',
        },
    ]
    
    return (
        <div className="bv-settings__visibility-by-role">
            <RadioControl
                label={ __( 'Visibility by User Role', 'block-visibility' ) }
                selected={ visibilityByRole }
                options={ options }
                onChange={ ( value ) => setAttributes( {
                        blockVisibility: assign( 
                            { ...blockVisibility }, 
                            { visibilityByRole: value } 
                        )
                    } )
                }
            />
            { visibilityByRole === 'user-role' && (
                <UserRoles { ...props } />
            ) }
        </div>
    );
}

export default VisibilityByRole;