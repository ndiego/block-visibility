/**
 * External dependencies
 */
import classnames from 'classnames';
import { map, without } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockIcon } from '@wordpress/block-editor';
import { CheckboxControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockType from './block-type';
import { InformationPopover } from './../../components';

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
		const blockTypeNames = map( blockTypes, 'name' );
		handleBlockCategoryChange( checked, blockTypeNames );
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

	const categoryTitleId = 'block-manager__category-title-' + category.slug;

	return (
		<div
			role="group"
			aria-labelledby={ categoryTitleId }
			className="block-manager__block-category"
		>
			<div 
				className={ 
					classnames( 
						'block-category__title', 
						{ 
							'has-info-popover': category.slug === 'uncategorized'
						}
					)
				}
			>
				<CheckboxControl
					checked={ isAllChecked }
					onChange={ ( checked ) => onBlockCategoryChange( checked ) }
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
				{ category.slug === 'uncategorized' && (
					<InformationPopover
						message={ __(
							'Some blocks may appear in the Block Manager as uncategorized even though they have an assigned category in the Editor. This is due to how the block is registered in WordPress.',
							'block-visibility'
						) }
					/>
				) }
			</div>
			<ul className="block-category__blocks-list">
				{ blockTypes.map( ( blockType ) => (
					<BlockType
						key={ blockType }
						blockType={ blockType }
						handleBlockTypeChange={ handleBlockTypeChange }
						disabledBlocks={ disabledBlocks }
					/>
				) ) }
			</ul>
		</div>
	);
}
