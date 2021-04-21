/**
 * External dependencies
 */
import { has, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import icons from './icons';

/**
 * All the available controls in Block Visibility.
 *
 * @since 1.8.0
 * @return {Object} Return the available controls
 */
export function getControls() {
	let coreControls = [
		{
			label: __( 'Hide Block', 'block-visibility' ),
			type: 'core',
			attributeSlug: 'hideBlock',
			settingSlug: 'hide_block',
		},
		{
			label: __( 'Date & Time', 'block-visibility' ),
			type: 'core',
			attributeSlug: 'dateTime',
			settingSlug: 'date_time',
		},
		{
			label: __( 'User Role', 'block-visibility' ),
			type: 'core',
			attributeSlug: 'userRole',
			settingSlug: 'visibility_by_role',
		},
		{
			label: __( 'Screen Size', 'block-visibility' ),
			type: 'core',
			attributeSlug: 'screenSize',
			settingSlug: 'screen_size',
		},
		{
			label: __( 'Query String', 'block-visibility' ),
			type: 'core',
			attributeSlug: 'queryString',
			settingSlug: 'query_string',
		},
	];

	coreControls = applyFilters( 'blockVisibility.coreControls', coreControls );

	let integrationControls = [
		{
			label: __( 'Advanced Custom Fields', 'block-visibility' ),
			type: 'integration',
			attributeSlug: 'acf',
			settingSlug: 'acf',
			icon: icons.acf,
		},
		{
			label: __( 'WP Fusion', 'block-visibility' ),
			type: 'integration',
			attributeSlug: 'wpFusion',
			settingSlug: 'wp_fusion',
			icon: icons.wpFusion,
		},
	];

	integrationControls = applyFilters(
		'blockVisibility.integrationControls',
		integrationControls
	);

	let controls = [ ...coreControls, ...integrationControls ];

	controls = applyFilters( 'blockVisibility.controls', controls );

	return controls;
}

/**
 * All the enabled controls in Block Visibility.
 *
 * @since 1.8.0
 * @param {Object} settings  All the plugin settings
 * @param {Object} variables All the plugin variables
 * @return {Object}		     Return the enabled controls
 */
export default function getEnabledControls( settings, variables ) {
	let enabledControls = [];

	// Make sure we have plugin settings and variables.
	if (
		! settings ||
		! variables ||
		0 === settings.length ||
		0 === variables.length
	) {
		return enabledControls;
	}

	let controls = getControls();

	const isPluginActive = ( plugin ) => {
		let isActive = false;

		if ( variables?.integrations ) {
			isActive = variables?.integrations[ plugin ]?.active ?? false;
		}

		return isActive;
	};

	// If the plugin that provides this control is not active, disable.
	controls.forEach( function ( control ) {
		if (
			'integration' === control.type &&
			! isPluginActive( control.settingSlug )
		) {
			controls = controls.filter(
				( item ) => item.settingSlug !== control.settingSlug
			);
		}
	} );

	const visibilityControls = settings?.visibility_controls ?? {};

	if ( ! isEmpty( visibilityControls ) ) {
		controls.forEach( function ( control ) {
			const hasControl = has( visibilityControls, control.settingSlug );
			let addControl = false;

			// If the control does not exist, assume true.
			if ( ! hasControl ) {
				addControl = true;
			}

			// Check if the control is set, default to "true".
			if ( visibilityControls[ control.settingSlug ]?.enable ?? true ) {
				addControl = true;
			}

			if ( addControl ) {
				enabledControls.push( control );
			}
		} );
	}

	enabledControls = applyFilters(
		'blockVisibility.enabledControls',
		enabledControls,
		settings,
		variables
	);

	return enabledControls;
}
