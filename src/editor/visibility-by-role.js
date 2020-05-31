/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { RadioControl, Notice } from '@wordpress/components';

/**
 * Internal dependencies
 */
import UserRoles from './user-roles';


function VisibilityByRole( props ) {
    const { attributes, setAttributes, visibilityControls } = props;
    const { blockVisibility } = attributes;
    const { hideBlock, visibilityByRole } = blockVisibility;
    
    const visibilityByRoleEnable = visibilityControls?.visibility_by_role?.enable ?? true;
    const visibilityByRoleEnableUseRoles = visibilityControls?.visibility_by_role?.enable_user_roles ?? true;

    if ( ! visibilityByRoleEnable ) {
        return null;
    }
        
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
    ];
    
    // If the User Roles option is not enabled in plugin settings, remove it.
    if ( ! visibilityByRoleEnableUseRoles ) {
        options.pop();
    }
    
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
            { visibilityByRole === 'user-role' && visibilityByRoleEnableUseRoles && (
                <UserRoles { ...props } />
            ) }
            { visibilityByRole === 'user-role' && ! visibilityByRoleEnableUseRoles && (
                <Notice 
                    status="warning"
                    isDismissible={ false }
                >   
                    { __( 
                        'The User Role option was previously selected, but is now disabled. Choose another option or update the ', 
                        'block-visibility' 
                    ) 
                    // Note we need a better way to handle translation on warning links. Watch
                    // https://github.com/WordPress/gutenberg/issues/18614
                    }
                    <a href={ blockVisibilityVariables.settingsUrl } target="_blank">
                        { __( 'Visibility Control settings.', 'block-visibility' ) }
                    </a>
                </Notice>
            ) }
        </div>
    );
}

export default VisibilityByRole;