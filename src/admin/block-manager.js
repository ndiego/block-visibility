/**
 * WordPress dependencies
 */
const { __, _n, sprintf } = wp.i18n;
const { withSelect } = wp.data;
const { compose, withState } = wp.compose;
const { TextControl } = wp.components;
const { getBlockTypes,
hasBlockSupport } = wp.blocks;

const {
	render,
	Fragment,
	Component,
} = wp.element;


/**
 * External dependencies
 */
import { filter, isArray } from 'lodash';

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
		
		console.log( filteredBlockTypes );
		console.log( blockTypes );
		
		return (
			'This is all out blocks'
		)
	}
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