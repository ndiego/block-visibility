/**
 * External dependencies
 */
import { filter, map, without, union, difference, intersection } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { getBlockTypes } from '@wordpress/block';

class AllowedBlockTypes extends Component {

	render() {
		const {
			blockTypes,
			categories,
			hasBlockSupport,
		} = this.props;
		
		
		// Filter the blocks by the following criteria
		const filteredBlockTypes = blockTypes.filter( ( blockType ) => (
			// Is allowed to be inserted into a page/post
			hasBlockSupport( blockType, 'inserter', true ) &&
			// Is not a child block https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#parent-optional
			! blockType.parent
		) );
		
		// If a plugin with custom blocks is deactivated, we want to keep the 
		// disabled blocks settings, but we should not include them in the UI
		// of the Block Manager
		const disabledBlocksState = intersection( 
			this.state.disabledBlocks, 
			map( filteredBlockTypes, 'name' ) 
		);
		
		//console.log( filteredBlockTypes);
	
		return filteredBlockTypes;
	}
}

/*export default compose( [
	withSelect( ( select ) => {
		const {
			getCategories,
			getBlockTypes,
			hasBlockSupport,
		} = select( 'core/blocks' );

		return {
			blockTypes: getBlockTypes(),
			categories: getCategories(),
			hasBlockSupport,
		};
	} ),
] )( AllowedBlockTypes );*/


const allowedBlockTypes = () => {
	const blockTypes = getBlockTypes();
	console.log( blockTypes );
	return blockTypes;
}

export default allowedBlockTypes;