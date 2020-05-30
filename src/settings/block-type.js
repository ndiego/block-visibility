/**
 * External dependencies
 */
import { includes } from 'lodash';

/**
 * WordPress dependencies
 */
import { BlockIcon } from '@wordpress/block-editor';
import { CheckboxControl } from '@wordpress/components';


function BlockType( props ) {
    const { blockType, disabledBlocks, handleBlockTypeChange } = props;
    const isChecked = ! disabledBlocks.includes( blockType.name );
    
    function onBlockTypeChange( checked ) {
        handleBlockTypeChange( checked, blockType.name );
    }
    
    return (
        <li
            key={ blockType.name }
            className="bv-block-manager__blocks-item"
        >
            <CheckboxControl
                checked={ isChecked }
                onChange={ ( isChecked ) => onBlockTypeChange( isChecked ) }
                label={ 
                    <span>
                        { blockType.title  }
                        { blockType.icon && (
                            <BlockIcon icon={ blockType.icon } />
                        ) }
                    </span> 
                }
            />
        </li>    
    );
}
export default BlockType;
