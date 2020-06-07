/**
 * External dependencies
 */
import { filter, map, without, union, difference, intersection } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { Animate, Button, TextControl } from '@wordpress/components';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import BlockCategory from './block-category';
import SaveSettings from './save-settings';
import InformationPopover from './information-popover';
import icons from './../icons';

/**
 * Renders the Block Manager tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function BlockManager( props ) {
	const [ disabledBlocks, setDisabledBlocks ] = useState( props.disabledBlocks );
	const [ hasUpdates, setHasUpdates ] = useState( false );
	const [ search, setSearch ] = useState( '' );
	
	const { 
		handleSettingsChange,
		isAPISaving,
		blockTypes,
		categories,
		hasBlockSupport,
		isMatchingSearchTerm,
	} = props;
	
	function onSettingsChange() {
		handleSettingsChange( 'disabled_blocks', disabledBlocks );
		setHasUpdates( false );
	}
    
    function handleBlockCategoryChange( checked, blockTypes ) {    
        let currentDisabledBlocks = [ ...disabledBlocks ];
        
        if ( ! checked ) {
            currentDisabledBlocks = union( currentDisabledBlocks, blockTypes );
        } else {
            currentDisabledBlocks = difference( currentDisabledBlocks, blockTypes );
        }
		
		setDisabledBlocks( currentDisabledBlocks );
		setHasUpdates( true );
    }
    
    function handleBlockTypeChange( checked, blockType ) {
        let currentDisabledBlocks = [ ...disabledBlocks ];
                
        if ( ! checked ) {
            currentDisabledBlocks.push( blockType );
        } else {
            currentDisabledBlocks = without( currentDisabledBlocks, blockType );
        }
		
		setDisabledBlocks( currentDisabledBlocks );
		setHasUpdates( true );
    }
	
	//console.log( disabledBlocks );
	
	const allowedBlockTypes = blockTypes.filter( ( blockType ) => (
		// Is allowed to be inserted into a page/post
		hasBlockSupport( blockType, 'inserter', true ) &&
		// Is not a child block https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#parent-optional
		! blockType.parent
	) );
	
	// The allowed blocks that match our search criteria
	const filteredBlockTypes = allowedBlockTypes.filter( ( blockType ) => (
		! search || isMatchingSearchTerm( blockType, search )
	) );
	
	// @// TODO: clean this up and make more streamlined....
	
	// If a plugin with custom blocks is deactivated, we want to keep the 
	// disabled blocks settings, but we should not include them in the UI
	// of the Block Manager
	const disabledBlocksState = intersection( 
		disabledBlocks, 
		map( filteredBlockTypes, 'name' ) 
	);
	
	const trueDisabledBlocks = intersection( 
		disabledBlocks, 
		map( allowedBlockTypes, 'name' ) 
	);

	let visibilityIcon = icons.visibility;
	let visibilityMessage = __( 'Visibility is enabled for all blocks', 'block-visibility' );
	
	if ( trueDisabledBlocks.length ) {
		visibilityIcon = icons.visibilityHidden;
		visibilityMessage = sprintf( 
			_n( 
				'Visibility is disabled for %s block type', 
				'Visibility is disabled for %s block types', 
				trueDisabledBlocks.length,  
				'block-visibility' 
			), 
			trueDisabledBlocks.length 
		);
	}
	
	const updateButton = isAPISaving 
		? __( 'Updating...', 'block-visibility' )
		: __( 'Update', 'block-visibility' );
	
	return (
		<div className="bv-block-manager inner-container">
			<div className="bv-tab-panel__description">
				<div className="bv-tab-panel__description-header">
					<h2>{ __( 'Block Manager', 'block-visibility' ) }</h2>
					<span>
						<InformationPopover
							message={ __( 'NEED TO WRITE!!!!', 'block-visibility' ) }
							link="https://www.blockvisibilitywp.com"
						/>
					</span>
				</div>
				<p>
					{ __( 
						'The settings below allow you restrict visibility controls to specific block types. By default, all block types have visibility enabled, but you may want to limit this functionality depending on your needs.', 
						'block-visibility'
					) }
				</p>
			</div>
			<div className="bv-setting-controls">
				<TextControl
					className="search-blocks"
					type="search"								
					placeholder={ __(
						'Search for a block',
						'block-visibility'
					) }
					value={ search }
					onChange={ ( searchValue ) => setSearch( searchValue ) }
				/>
				<SaveSettings 
					isAPISaving={ isAPISaving }
					hasUpdates={ hasUpdates }
					onSettingsChange={ onSettingsChange }
					notSavingMessage={ visibilityMessage }
					notSavingIcon={ visibilityIcon }
				/>
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
                        handleBlockCategoryChange={ handleBlockCategoryChange }
                        handleBlockTypeChange={ handleBlockTypeChange }
					/>
				) ) }
			</div>
		</div>
	);
}

export default withSelect( ( select ) => {
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
} )( BlockManager );
