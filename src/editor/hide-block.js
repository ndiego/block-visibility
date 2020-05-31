/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';


function HideBlock( props ) {
    const { attributes, setAttributes } = props;
    const { blockVisibility } = attributes;
    const { hideBlock } = blockVisibility;

    return (
        <ToggleControl
            label={ __(
                'Hide block',
                'block-visibility'
            ) }
            checked={ hideBlock }
            onChange={ () => setAttributes( {
                    blockVisibility: assign( 
                        { ...blockVisibility }, 
                        { hideBlock: ! hideBlock } 
                    )
                } )
            }
            help={ __( 'Hide the block completely', 'block-visibility' ) }
        />
    );
}

export default HideBlock;