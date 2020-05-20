/**
 * External dependencies
 */
import { filter, map, without, union, difference, intersection } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { compose, withState } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Component } from '@wordpress/element';
import {
	Animate,
	Button,
	CheckboxControl,
	TextControl
} from '@wordpress/components';
import { Icon } from '@wordpress/icons';

// @// TODO: Figure out if this useable to retrieve settings or strip
/*
import {
 	createContext,
 	useContext,
} from '@wordpress/element';
import { 
	useEntityProp,
	saveEditedEntityRecord 
} from '@wordpress/core-data';
*/

/**
 * Internal dependencies
 */
import BlockCategory from './block-category';
import icons from './../icons';


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
    
    handleBlockCategoryChange( checked, blockTypes ) {    
        let disabledBlocks = this.state.disabledBlocks;
        
        if ( ! checked ) {
            disabledBlocks = union( disabledBlocks, blockTypes );
            this.setState( { disabledBlocks: disabledBlocks } );
        } else {
            disabledBlocks = difference( disabledBlocks, blockTypes );
            this.setState( { disabledBlocks: disabledBlocks } );
        }
        
        this.setState( { hasUpdates: true } );
    }
    
    handleBlockTypeChange( checked, blockType ) {
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
			isAPISaving,
		} = this.props;
		
		// @// TODO: See if we can get this working in the future....
		// Retrieve the block visibility settings: https://github.com/WordPress/gutenberg/issues/20731
		// const test = propsTest();
		// const disabledBlocksState = this.state.disabledBlocks;
		
		// Filter the blocks by the following criteria
		const filteredBlockTypes = blockTypes.filter( ( blockType ) => (
			// Is allowed to be inserted into a page/post
			hasBlockSupport( blockType, 'inserter', true ) &&
			// Is not a child block https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#parent-optional
			! blockType.parent &&
			// Meets our search criteria
			( ! search || isMatchingSearchTerm( blockType, search ) )
		) );
		
		// If a plugin with custom blocks is deactivated, we want to keep the 
		// disabled blocks settings, but we should not include them in the UI
		// of the Block Manager
		const disabledBlocksState = intersection( 
			this.state.disabledBlocks, 
			map( filteredBlockTypes, 'name' ) 
		);

		let visibilityIcon = icons.visibility;
		let visibilityMessage = __( 'Visibility is enabled for all blocks', 'block-visibility' );
		
		if ( disabledBlocksState.length ) {
			visibilityIcon = icons.visibilityHidden;
			visibilityMessage = sprintf( 
				_n( 
					'Visibility is disabled for %s block type', 
					'Visibility is disabled for %s block types', 
					disabledBlocksState.length,  
					'block-visibility' 
				), 
				disabledBlocksState.length 
			);
		}
		
		const updateButton = isAPISaving 
			? __( 'Updating...', 'block-visibility' )
			: __( 'Update', 'block-visibility' );
		
		return (
			<div className="bv-block-manager inner-container">
				<div className="bv-tab-panel__description">
					<h2>{ __( 'Block Manager', 'block-visibility' ) }</h2>
					<p>
						{ __( 
							'[Needs work] Use the settings below to disable visibility functionality on specific block types. This can be useful if you want to restrict visibility settings to a selection of blocks. Once a block type is disabled, all visibility settings will also be disabled, even if settings had previously been set on blocks of that type.', 
							'block-visibility'
						) }
					</p>
				</div>
				<div className="bv-block-manager__controls">
					<TextControl
						className="search-blocks"
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
					<div className="bv-save-settings">
						<div className="bv-save-settings__messages">
							{ [
								isAPISaving && (
									<Animate type="loading">
										{ ( { className: animateClassName } ) => (
											<span className={ animateClassName } >
												<Icon icon={ icons.cloud } />
												{ __( 'Saving', 'block-visibility' ) }
											</span>
										) }
									</Animate>
								),
								! isAPISaving && (
									<span className="visibility-message">
										<Icon icon={ visibilityIcon } />
										{ visibilityMessage }
									</span>
								),
							] }
						</div>
						<Button
							className={ classnames(
								'bv-save-settings__button',
								{ 'is-busy': isAPISaving },
							) }
							onClick={ this.onSettingsChange }
							disabled={ ! this.state.hasUpdates }
							isPrimary
						>
							{ updateButton }
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
