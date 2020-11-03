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
	getEnabledControls
} from './utils/setting-utilities';

function hasRoles( blockVisibility, enabledControls ) {
	const { visibilityByRole, restrictedRoles } = blockVisibility;

    if (
		! enabledControls.includes( 'visibility_by_role' )
		|| ! visibilityByRole
		|| visibilityByRole === 'all'
	) {
        return false;
    }

	// If the restriction is set to user-roles, but no user roles are selected.
	if ( visibilityByRole === 'user-role' && restrictedRoles.length === 0 ) {
		return false;
	}

	return true;
}

function hasDateTime( blockVisibility, enabledControls ) {
	const { startDateTime, endDateTime } = blockVisibility;

    if ( ! enabledControls.includes( 'date_time' )
		|| ( ! startDateTime && ! endDateTime )
	) {
        return false;
    }

	// If the restriction is set to user-roles, but no user roles are selected.
	if ( ( startDateTime && endDateTime ) && startDateTime >= endDateTime ) {
		return false;
	}

	return true;
}

/**
 * Filter each block and add CSS classes based on visibility settings.
 */
const withContextualIndicators = createHigherOrderComponent( ( BlockListBlock ) => {
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

		if ( ! enableIndicators || ! hasVisibility || enabledControls.length === 0 ) {
			return <BlockListBlock { ...props } />;
		}

		const { blockVisibility } = attributes;
		const { hideBlock, visibilityByRole } = blockVisibility;
		const isHidden = hideBlock && enabledControls.includes( 'hide_block' );

		let classes = '';
		classes = isHidden ? classes + ' block-visibility__is-hidden' : classes;
		classes = hasRoles( blockVisibility, enabledControls )
			? classes + ' block-visibility__has-roles'
			: classes;
		classes = hasDateTime( blockVisibility, enabledControls )
			? classes + ' block-visibility__has-date-time'
			: classes;

		// Add filter here for premium settings

		classes = classes ? classes + ' block-visibility__has-visibility' : classes;

		return <BlockListBlock { ...props } className={ classes } />;
	};
}, 'withVisibilityContextualIndicator' );

addFilter(
	'editor.BlockListBlock',
	'block-visibility/visibility-contextual-indicators',
	withContextualIndicators
);
