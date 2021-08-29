/**
 * External dependencies
 */
import { filter, map, without, union, difference, intersection } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { TextControl, Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockCategory from './block-category';
import UpdateSettings from './../utils/update-settings';
import InformationPopover from './../utils/information-popover';
import icons from './../../utils/icons';

/**
 * Renders the Block Manager tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function BlockManager( props ) {
	const [ hasUpdates, setHasUpdates ] = useState( false );
	const [ search, setSearch ] = useState( '' );
	const {
		settings,
		setSettings,
		blockTypes,
		categories,
		hasBlockSupport,
		isMatchingSearchTerm,
	} = props;
	const disabledBlocks = settings?.disabled_blocks ?? {};

	function setDisabledBlocks( newSettings ) {
		setSettings( {
			...settings,
			disabled_blocks: newSettings,
		} );
		setHasUpdates( true );
	}

	function handleBlockCategoryChange( checked, blockTypeNames ) {
		let currentDisabledBlocks = [ ...disabledBlocks ];

		if ( ! checked ) {
			currentDisabledBlocks = union(
				currentDisabledBlocks,
				blockTypeNames
			);
		} else {
			currentDisabledBlocks = difference(
				currentDisabledBlocks,
				blockTypeNames
			);
		}

		setDisabledBlocks( currentDisabledBlocks );
		setHasUpdates( true );
	}

	function handleBlockTypeChange( checked, blockTypeName ) {
		let currentDisabledBlocks = [ ...disabledBlocks ];

		if ( ! checked ) {
			currentDisabledBlocks.push( blockTypeName );
		} else {
			currentDisabledBlocks = without(
				currentDisabledBlocks,
				blockTypeName
			);
		}

		setDisabledBlocks( currentDisabledBlocks );
		setHasUpdates( true );
	}

	// Manually set defaults, this ensures the main settings function properly
	const enabledFullControlMode = settings?.plugin_settings?.enable_full_control_mode ?? false; // eslint-disable-line

	let allowedBlockTypes;

	if ( enabledFullControlMode ) {
		// If we are in full control mode, allow all blocks
		allowedBlockTypes = blockTypes;
	} else {
		allowedBlockTypes = blockTypes.filter(
			( blockType ) =>
				// Is allowed to be inserted into a page/post
				hasBlockSupport( blockType, 'inserter', true ) &&
				// Is not a child block https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#parent-optional
				! blockType.parent
		);
	}

	// Blocks present in the Block Editor that do not accept custom attributes.
	const incompatibleBlockTypes = [ 'core/freeform' ];

	// Remove all incompatible blocks from the allowed block types.
	allowedBlockTypes = allowedBlockTypes.filter(
		( blockType ) => ! incompatibleBlockTypes.includes( blockType.name )
	);

	// The allowed blocks that match our search criteria
	const filteredBlockTypes = allowedBlockTypes.filter(
		( blockType ) => ! search || isMatchingSearchTerm( blockType, search )
	);

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
	let visibilityMessage = __(
		'Visibility is enabled for all blocks',
		'block-visibility'
	);

	if ( trueDisabledBlocks.length ) {
		visibilityIcon = icons.visibilityHidden;
		visibilityMessage = sprintf(
			/* translators: %s: The total number of visible block types */
			_n(
				'Visibility is disabled for %s block type',
				'Visibility is disabled for %s block types',
				trueDisabledBlocks.length,
				'block-visibility'
			),
			trueDisabledBlocks.length
		);
	}

	return (
		<div className="setting-tabs__block-manager inner-container">
			<div className="setting-tabs__setting-controls">
				<div className="setting-controls__title">
					<span>{ __( 'Block Manager', 'block-visibility' ) }</span>
					<InformationPopover
						message={ __(
							'Not every block type may need visibility controls. The Block Manager allows you to restrict visibility controls to specific block types. If you are looking for a block, and do not see it listed, you may need to enable Full Control Mode on the General Settings tab.',
							'block-visibility'
						) }
						subMessage={ __(
							'To learn more about the Block Manager, review the plugin documentation using the link below.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-configure-the-block-manager/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<UpdateSettings
					tabSlug="disabled_blocks"
					tabSettings={ disabledBlocks }
					hasUpdates={ hasUpdates }
					setHasUpdates={ setHasUpdates }
					{ ...props }
				/>
			</div>
			<div className="setting-tabs__setting-controls">
				<TextControl
					className="setting-controls__search-blocks"
					type="search"
					placeholder={ __(
						'Search for a block',
						'block-visibility'
					) }
					value={ search }
					onChange={ ( searchValue ) => setSearch( searchValue ) }
				/>
				<span className="message">
					<Icon icon={ visibilityIcon } />
					{ visibilityMessage }
				</span>
			</div>
			<div className="block-manager__category-container">
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
