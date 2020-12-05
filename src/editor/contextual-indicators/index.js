/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import hasDateTime from './has-date-time';
import hasRoles from './has-roles';
import hasVisibilityControls from './../utils/has-visibility-controls';
import {
	isPluginSettingEnabled,
	getEnabledControls,
} from './../utils/setting-utilities';
import { usePluginData } from './../../utils/data';

/**
 * Filter each block and add CSS classes based on visibility settings.
 */
const withContextualIndicators = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const settings = usePluginData( 'settings' );

			if ( settings === 'fetching' ) {
				return <BlockListBlock { ...props } />;
			}

			const { name, attributes } = props;
			const enableIndicators = isPluginSettingEnabled(
				settings,
				'enable_contextual_indicators'
			);
			const hasVisibility = hasVisibilityControls(
				settings,
				name,
				attributes
			);
			const enabledControls = getEnabledControls( settings );

			if (
				! enableIndicators ||
				! hasVisibility ||
				enabledControls.length === 0
			) {
				return <BlockListBlock { ...props } />;
			}

			const { blockVisibility } = attributes;
			const { hideBlock } = blockVisibility;
			const isHidden =
				hideBlock && enabledControls.includes( 'hide_block' );

			let classes = '';
			classes = isHidden
				? classes + 'block-visibility__is-hidden'
				: classes;
			classes = hasRoles( blockVisibility, enabledControls )
				? classes + ' block-visibility__has-roles'
				: classes;
			classes = hasDateTime( blockVisibility, enabledControls )
				? classes + ' block-visibility__has-date-time'
				: classes;

			// Add filter here for premium settings

			// Some blocks have rendering issues when we set the icons to the
			// :before pseudo class. For those blocks, use a background image
			// instead.
			const backgroundBlocks = [ 'core/pullquote' ];

			classes = backgroundBlocks.includes( name )
				? classes + ' block-visibility__set-icon-background'
				: classes;

			classes = classes
				? classes + ' block-visibility__has-visibility'
				: classes;

			return <BlockListBlock { ...props } className={ classes } />;
		};
	},
	'withVisibilityContextualIndicator'
);

addFilter(
	'editor.BlockListBlock',
	'block-visibility/visibility-contextual-indicators',
	withContextualIndicators
);
