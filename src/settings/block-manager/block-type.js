/**
 * WordPress dependencies
 */
import { BlockIcon } from '@wordpress/block-editor';
import { CheckboxControl } from '@wordpress/components';

/**
 * Renders an individual list item and checkbox control for a given block type
 * on the Block Manager tab of the Block Visibility settings page.
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function BlockType( props ) {
	const { blockType, disabledBlocks, handleBlockTypeChange } = props;
	const isChecked = ! disabledBlocks.includes( blockType.name );

	function onBlockTypeChange( checked ) {
		handleBlockTypeChange( checked, blockType.name );
	}

	return (
		<li key={ blockType.name } className="blocks-category__block">
			<CheckboxControl
				checked={ isChecked }
				onChange={ ( checked ) => onBlockTypeChange( checked ) }
				label={
					<span>
						{ blockType.title }
						{ blockType.icon && (
							<BlockIcon icon={ blockType.icon } />
						) }
					</span>
				}
			/>
		</li>
	);
}
