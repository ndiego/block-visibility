/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { hasVisibilityControls } from './utils/has-visibility-controls';
import {
	isPluginSettingEnabled,
	getEnabledControls,
} from './utils/setting-utilities';

/**
 * Determine if visibility by user role settings are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  blockVisibility All visibility attributes for the block
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have user role settings
 */
function hasRoles( blockVisibility, enabledControls ) {
	const {
		visibilityByRole,
		restrictedRoles,
		hideOnRestrictedRoles,
	} = blockVisibility;

	if (
		! enabledControls.includes( 'visibility_by_role' ) ||
		! visibilityByRole ||
		visibilityByRole === 'all'
	) {
		return false;
	}

	// If the restriction is set to user-roles, but no user roles are selected,
	// and "hide on restricted" has been set. In this case the block actually
	// does not have any role-based visibility restrictions.
	if (
		visibilityByRole === 'user-role'
		&& restrictedRoles.length === 0
		&& hideOnRestrictedRoles
	) {
		return false;
	}

	return true;
}

/**
 * Determine if date time settings are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  blockVisibility All visibility attributes for the block
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @return {boolean}		        Does the block have date time settings
 */
function hasDateTime( blockVisibility, enabledControls ) {
	const { startDateTime, endDateTime } = blockVisibility;

	if (
		! enabledControls.includes( 'date_time' ) ||
		( ! startDateTime && ! endDateTime )
	) {
		return false;
	}

	// If the restriction is set to user-roles, but no user roles are selected.
	if ( startDateTime && endDateTime && startDateTime >= endDateTime ) {
		return false;
	}

	return true;
}

/**
 * Filter each block and add CSS classes based on visibility settings.
 */
const withContextualIndicators = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const { name, attributes } = props;
			// Get plugin settings.
			const [
				settings,
				setSettings // eslint-disable-line
			] = useEntityProp( 'root', 'site', 'block_visibility_settings' );
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
			const backgroundBlocks = [ "core/pullquote" ];

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
