
 /*
const { __, _n, sprintf } = wp.i18n;
const { withSelect } = wp.data;
const { compose, withState } = wp.compose;
const {
	render,
	Component,
} = wp.element;

const { BlockIcon } = wp.blockEditor;
*/

/**
 * External dependencies
 */
import { filter, isArray, partial, map, includes } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { compose, withState } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Component, render } from '@wordpress/element';
import { BlockIcon } from '@wordpress/block-editor';
import {
	TextControl,
	CheckboxControl,
	Button,
} from '@wordpress/components';



class BlockManager extends Component {
	
	render() {
		
		const {
			blockTypes,
			categories,
			setState,
			search,
			isMatchingSearchTerm,
			hasBlockSupport,
		} = this.props;
		
		
		// Filter the blocks by the following criteria
		const filteredBlockTypes = blockTypes.filter( ( blockType ) => (
			// Is allowed to be inserted into a page/post
			hasBlockSupport( blockType, 'inserter', true ) &&
			// Is not a child block https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#parent-optional
			! blockType.parent &&
			// Meets our search criteria
			( ! search || isMatchingSearchTerm( blockType, search ) )
		) );
		

		// TODO: Remove
		const blockNames = map( filteredBlockTypes, 'name' );
		console.log( search );

		
		return (
			<div className="bv-block-manager">
				<div className="bv-block-manager__controls">
					<TextControl
						type="search"
						value={ search }
						onChange={ ( searchValue ) => setState( {
							search: searchValue,
						} ) }
					/>
					<Button
						//onClick={ () => setAttributes( { pageType: 'url' } )  }
						//disabled={ ! this.state.initialCustomUrl }
						isPrimary
					>
						{ __(
							'Update',
							'block-visibility'
						) }
					</Button>
				</div>
				<div className="bv-block-manager__category-container">
					{ categories.map( ( category ) => (
						<BlockCategory
							key={ category.slug }
							category={ category }
							blockTypes={ filter( filteredBlockTypes, {
								category: category.slug,
							} ) }
						/>
					) ) }
				</div>
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
							<>
								{ blockType.title }
								<BlockIcon icon={ blockType.icon } />
							</>
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
			getBlockTypes,
			hasBlockSupport,
			isMatchingSearchTerm,
		} = select( 'core/blocks' );
		
		//const { getPreference } = select( 'core/edit-post' );
		//const hiddenBlockTypes = getPreference( 'hiddenBlockTypes' );
		//const numberOfHiddenBlocks = isArray( hiddenBlockTypes ) && hiddenBlockTypes.length;

		return {
			blockTypes: getBlockTypes(),
			categories: getCategories(),
			hasBlockSupport,
			isMatchingSearchTerm,
			//numberOfHiddenBlocks,
		};
	} ),
] )( BlockManager );

/*
export default withState( {
	withState( { search: '' } ),
} )( BlockManager );*/