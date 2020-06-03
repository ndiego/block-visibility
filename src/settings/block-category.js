/**
 * External dependencies
 */
import { map, without} from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { BlockIcon } from '@wordpress/block-editor';
import { CheckboxControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockType from './block-type';

/**
 * Renders the list of BlockType controls for a given block category on the
 * Block Manager tab of the Block Visibility settings page.
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function BlockCategory( props ) {
    const { 
        blockTypes, 
        category, 
        disabledBlocks, 
        handleBlockCategoryChange,
        handleBlockTypeChange,
    } = props;    
    
    function onBlockCategoryChange( checked ) {
        const blockNames = map( blockTypes, 'name' );
        handleBlockCategoryChange( checked, blockNames );
    }
		
    // If category has no blocks, abort.
	if ( ! blockTypes.length ) {
		return null;
	}
	
	const blockNames = map( blockTypes, 'name' );
	const checkedBlockNames = without( blockNames, ...disabledBlocks );
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
					onChange={ ( isAllChecked ) => onBlockCategoryChange( isAllChecked ) }
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
                        handleBlockTypeChange={ handleBlockTypeChange }
                        disabledBlocks={ disabledBlocks }
                    />
				) ) }
			</ul>
		</div>
	);
}
