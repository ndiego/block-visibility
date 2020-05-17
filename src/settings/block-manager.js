/**
 * Internal dependencies
 */
import BlockCategory from './block-category';

/**
 * External dependencies
 */
import { filter, map, without, union, difference } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { compose, withState } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Component, render } from '@wordpress/element';
import {
	Button,
	CheckboxControl,
	Placeholder,
	Spinner,
	TextControl
} from '@wordpress/components';

import {
 	createContext,
 	useContext,
} from '@wordpress/element';
import { 
	useEntityProp,
	saveEditedEntityRecord 
} from '@wordpress/core-data';


class BlockManager extends Component {
	constructor() {
		super( ...arguments );

        this.handleBlockCategoryChange = this.handleBlockCategoryChange.bind( this );
        this.handleBlockTypeChange = this.handleBlockTypeChange.bind( this );
		this.onSettingsChange = this.onSettingsChange.bind( this );
        
        this.state = {
            hasUpdates: false,
			disabledBlocks: [],
		};
	}
	
	componentDidMount() {	
		this.setState( { disabledBlocks: this.props.disabledBlocks } );
	}
	
	onSettingsChange() {
		const disabledBlocks = this.state.disabledBlocks;
		this.props.handSettingsChange( 'bv_disabled_blocks', disabledBlocks );
		this.setState( { hasUpdates: false } );
	}
    
    handleBlockCategoryChange( checked, blockTypes ){    
        let disabledBlocks = this.state.disabledBlocks;
        
        if ( ! checked ) {
            // @// TODO: console.log( 'add blocks');
            disabledBlocks = union( disabledBlocks, blockTypes );
            this.setState( { disabledBlocks: disabledBlocks } );
        } else {
            // @// TODO: console.log( 'remove blocks');
            disabledBlocks = difference( disabledBlocks, blockTypes );
            this.setState( { disabledBlocks: disabledBlocks } );
        }
        
        this.setState( { hasUpdates: true } );
    }
    
    handleBlockTypeChange( checked, blockType ){
        let disabledBlocks = this.state.disabledBlocks;
                
        if ( ! checked ) {
            disabledBlocks.push( blockType );
            this.setState( { disabledBlocks: disabledBlocks } );
        } else {
            disabledBlocks = without( disabledBlocks, blockType );
            this.setState( { disabledBlocks: disabledBlocks } );
        }
        
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
		
		// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
		//const test = propsTest();
        const disabledBlocksState = this.state.disabledBlocks;
		
		return (
			<div className="bv-block-manager inner-container">
				<div className="bv-tab-panel__description">
					<h2>Block Manager</h2>
					<p>
						{ __( 
							'Use the settings below to disable Block Visibility functionality on specific blocks. This is useful if there are only a handful of blocks you want control visibility for. Once a block is disabled, all visibility settings will be turned off, even if they had visibility settings before.', 
							'block-visibility'
						) }
					</p>
				</div>
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
						{ sprintf( __( 'Visibility settings are disabled for %s blocks', 'block-visibility' ), disabledBlocksState.length ) }
					</div>
					<div className="bv-save-settings-container">
						<Button
							onClick={ this.onSettingsChange }
							disabled={ ! this.state.hasUpdates }
							isPrimary
						>
							{ __( 'Update', 'block-visibility' ) }
						</Button>
					</div>
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
                            handleBlockCategoryChange={ this.handleBlockCategoryChange }
                            handleBlockTypeChange={ this.handleBlockTypeChange }
						/>
					) ) }
				</div>
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

		return {
			blockTypes: getBlockTypes(),
			categories: getCategories(),
			hasBlockSupport,
			isMatchingSearchTerm,
		};
	} ),
] )( BlockManager );
