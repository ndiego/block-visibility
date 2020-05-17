/**
 * External dependencies
 */
import { includes } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, render } from '@wordpress/element';
import { BlockIcon } from '@wordpress/block-editor';
import { CheckboxControl } from '@wordpress/components';


class BlockType extends Component {
    constructor() {
        super( ...arguments );
        
        this.onBlockTypeChange = this.onBlockTypeChange.bind( this );
    }
    
    onBlockTypeChange( checked ) {
        const { blockType, handleBlockTypeChange } = this.props;
        const blockName = blockType.name;
        
        handleBlockTypeChange( checked, blockName );
    }
    
    render() {
        const { blockType, disabledBlocks } = this.props;
        const isChecked = ! disabledBlocks.includes( blockType.name );
        
        return (
            <li
                key={ blockType.name }
                className="bv-block-manager__blocks-item"
            >
                <CheckboxControl
                    checked={ isChecked }
                    onChange={ ( isChecked ) => this.onBlockTypeChange( isChecked ) }
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
}
export default BlockType;
