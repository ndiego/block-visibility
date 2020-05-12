/**
 * WordPress dependencies
 */
const { __, _n, sprintf } = wp.i18n;
const { withSelect } = wp.data;
const { compose, withState } = wp.compose;
const { 
	TextControl,
	CheckboxControl, 
} = wp.components;

const { 
	getBlockTypes,
	hasBlockSupport
 } = wp.blocks;

const {
	render,
	Fragment,
	Component,
} = wp.element;

const { BlockIcon } = wp.blockEditor;

/**
 * External dependencies
 */
import { filter, isArray, partial, map, includes } from 'lodash';

class BlockManager extends Component {
	
	render() {
		
		const {
			blockTypes,
			categories
		} = this.props;
		
		// We currently only want to show blocks that can be inserted from the 
		// Block Inserter and are not child blocks https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#parent-optional
		const filteredBlockTypes = blockTypes.filter( ( blockType ) => (
			hasBlockSupport( blockType, 'inserter', true ) &&
			! blockType.parent
		) );
		
		//console.log( filteredBlockTypes );
		//console.log( blockTypes );
		
		const blockNames = map( filteredBlockTypes, 'name' );
		
		console.log( blockNames );
		console.log( categories );

		
		return (
			<div>
				{ categories.map( ( category ) => (
					<BlockCategory
						key={ category.slug }
						category={ category }
						blockTypes={ filter( blockTypes, {
							category: category.slug,
						} ) }
					/>
				) ) }
			</div>
		);
	}
}

class BlockCategory extends Component {
	
	render() {
		const {
			category,
			blockTypes,
		} = this. props
		
		if ( ! blockTypes.length ) {
			return null;
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
						//checked={ }
						//onChange={ }
						//aria-checked={ }
						label={ <span id={ categoryTitleId }>{ category.title }</span> }
					/>
					{ category.icon && (
						<BlockIcon icon={ category.icon } />
					) }
				</div>

				<ul className="bv-block-manager__blocks">
					{ blockTypes.map( ( blockType ) => (
						<li
							key={ blockType.name }
							className="bv-block-manager__blocks-item"
						>
							<CheckboxControl
								label={ blockType.title }
								//checked={ value.includes( blockType.name ) }
								//onChange={ partial( onItemChange, blockType.name ) }
							/>
							{ blockType.icon && (
								<BlockIcon icon={ blockType.icon } />
							) }
						</li>
					) ) }
				</ul>

			</div>
		);
	}
}

function BlockTypesChecklist( { blockTypes, value, onItemChange } ) {
	return (
		<ul className="edit-post-manage-blocks-modal__checklist">
			{ blockTypes.map( ( blockType ) => (
				<li
					key={ blockType.name }
					className="edit-post-manage-blocks-modal__checklist-item"
				>
					<CheckboxControl
						label={ (
							<Fragment>
								{ blockType.title }
								<BlockIcon icon={ blockType.icon } />
							</Fragment>
						) }
						checked={ value.includes( blockType.name ) }
						onChange={ partial( onItemChange, blockType.name ) }
					/>
				</li>
			) ) }
		</ul>
	);
}

export default compose( [
	withState( { search: '' } ),
	withSelect( ( select ) => {
		const {
			getCategories,
			hasBlockSupport,
			isMatchingSearchTerm,
		} = select( 'core/blocks' );
		//const { getPreference } = select( 'core/edit-post' );
		//const hiddenBlockTypes = getPreference( 'hiddenBlockTypes' );
		//const numberOfHiddenBlocks = isArray( hiddenBlockTypes ) && hiddenBlockTypes.length;

		return {
			blockTypes: getBlockTypes(),
			categories: getCategories(),
		//	hasBlockSupport,
			//isMatchingSearchTerm,
			//numberOfHiddenBlocks,
		};
	} ),
] )( BlockManager );