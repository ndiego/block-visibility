
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

//import PropsTest from './props-test';

/**
 * External dependencies
 */
import { filter, isArray, partial, map, includes, without, union } from 'lodash';

/**
 * WordPress dependencies
 */
 
import {
 	createContext,
 	useContext,
} from '@wordpress/element';
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

import { 
	useEntityProp,
	saveEditedEntityRecord 
} from '@wordpress/core-data';




class BlockManager extends Component {
	
	constructor() {
		super( ...arguments );

		this.updateDisabledBlocks = this.updateDisabledBlocks.bind( this );
        this.state = {
            hasUpdates: false,
			disabledBlocks: [
    			"core/paragraph",
    			"core/image",
    			"core/heading",
    		],
		};
	}
	
    updateDisabledBlocks( blocks ) {
        
        const currentDisabled = this.state.disabledBlocks;
        
        const blockNames = map( blocks, 'name' );
        
        const newDisabled = union( currentDisabled, blockNames );
        console.log( newDisabled );
        //this.setState( { disabledBlocks: newDisabled } );
        this.setState( { hasUpdates: true } );
    }
    
	render() {
		
		const {
			blockTypes,
			categories,
			setState,
			search,
			isMatchingSearchTerm,
			hasBlockSupport,
			disabledBlocks,
			blocksTest,
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
		//console.log( disabledBlocks );
		
		// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
		//const test = propsTest();
        const disabledBlocksState = this.state.disabledBlocks;
		
		return (
			<div className="bv-block-manager inner-container">
				<div className="bv-block-manager__controls">
					<TextControl
						type="search"								
						placeholder={ __(
							'Search for a block',
							'block-visibility'
						) }
						value={ search }
						onChange={ ( searchValue ) => setState( {
							search: searchValue,
						} ) }
					/>
					<div>
						Block setting value: { disabledBlocksState }
					</div>
					<Button
						//onClick={ () => saveEditedEntityRecord( 'root', 'site', 'bv_disable_all_blocks_new', 'blocks test' )  }
						disabled={ ! this.state.hasUpdates }
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
							disabledBlocks={ disabledBlocksState }
                            onChange={ this.updateDisabledBlocks }
						/>
					) ) }
				</div>
			</div>
		);
	}
}


class BlockCategory extends Component {
    
    constructor() {
        super( ...arguments );

        this.onCategoryChange = this.onCategoryChange.bind( this );
    }
    
    onCategoryChange( isAllChecked, blockTypes ) {
        
        const blockNames = map( blockTypes, 'name' );
        
        if ( isAllChecked ) {
            console.log( blockNames );
        } else {
            console.log( 'Not all checked' );
        }
        
    }
	
	render() {
		const {
			category,
			blockTypes,
			disabledBlocks,
            onChange,
		} = this.props
		
		if ( ! blockTypes.length ) {
			return null;
		}
		
		//console.log( map( blockTypes, 'name' ) );
		
		const checkedBlockNames = without(
			map( blockTypes, 'name' ),
			...disabledBlocks
		);

		const isAllChecked = checkedBlockNames.length === blockTypes.length;
		
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
						onChange={ this.onCategoryChange( isAllChecked, blockTypes ) }
						aria-checked={ ariaChecked }
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
								checked={ ! disabledBlocks.includes( blockType.name ) }
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