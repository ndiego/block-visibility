/**
 * Internal dependencies
 */
import BlockType from './block-type';

/**
 * External dependencies
 */
import { map, without} from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { Component, render } from '@wordpress/element';
import { BlockIcon } from '@wordpress/block-editor';
import { CheckboxControl } from '@wordpress/components';


class BlockCategory extends Component {
    constructor() {
        super( ...arguments );

        this.onBlockCategoryChange = this.onBlockCategoryChange.bind( this );
        this.handleBlockTypeChange = this.handleBlockTypeChange.bind( this );
    }
    
    onBlockCategoryChange( checked ) {
        const { blockType, handleBlockCategoryChange } = this.props;      
        const blockNames = map( blockTypes, 'name' );
        
        handleBlockCategoryChange( checked, blockNames );
    }
    
    handleBlockTypeChange( checked, blockName ) {
        this.props.handleBlockTypeChange( checked, blockName );
    }
	
	render() {
		const { category, blockTypes, disabledBlocks } = this.props
		
        // If category has no blocks, abort.
		if ( ! blockTypes.length ) {
			return null;
		}
		
		//console.log( blockTypes );
		const blockNames = map( blockTypes, 'name' );
        
		const checkedBlockNames = without(
			blockNames,
			...disabledBlocks
		);

		const isAllChecked = checkedBlockNames.length === blockNames.length;
		
		// This might not actually work with the CheckboxControl component
		let ariaChecked;
		if ( isAllChecked ) {
			ariaChecked = 'true';
		} else if ( checkedBlockNames.length > 0 ) {
			ariaChecked = 'mixed';
		} else {
			ariaChecked = 'false';
		}

		const categoryTitleId = 'bv-block-manager__category-title' + category.slug;
		
		return (
			<div 
				role="group"
				aria-labelledby={ categoryTitleId }
				className="bv-block-manager__category"
			>
				<div
					className="bv-block-manager__category-title"
				>
					<CheckboxControl
						checked={ isAllChecked }
						onChange={ ( isAllChecked ) => this.onBlockCategoryChange( isAllChecked ) }
						aria-checked={ ariaChecked }
						label={ 
                            <span id={ categoryTitleId }>
                                { category.title }
                                { category.icon && (
                                    <BlockIcon icon={ category.icon } />
                                ) }
                            </span> 
                        }
					/>
				</div>
				<ul className="bv-block-manager__blocks">
					{ blockTypes.map( ( blockType ) => (
						<BlockType
                            blockType={ blockType }
                            handleBlockTypeChange={ this.handleBlockTypeChange }
                            disabledBlocks={ disabledBlocks }
                        />
					) ) }
				</ul>
			</div>
		);
	}
}
export default BlockCategory;