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
import { acf, edd, woocommerce, wpFusion } from './icons';

/**
 * All the available controls in Block Visibility.
 *
 * @since 1.8.0
 * @return {Object} Return the available controls
 */
export function getControls() {
	const coreControls = [
		{
			label: __( 'Hide Block', 'block-visibility' ),
			attributeSlug: 'hideBlock',
			settingSlug: 'hide_block',
		},
		{
			label: __( 'Browser & Device', 'block-visibility' ),
			attributeSlug: 'browserDevice',
			settingSlug: 'browser_device',
		},
		{
			label: __( 'Cookie', 'block-visibility' ),
			attributeSlug: 'cookie',
			settingSlug: 'cookie',
		},
		{
			label: __( 'Date & Time', 'block-visibility' ),
			attributeSlug: 'dateTime',
			settingSlug: 'date_time',
		},
		{
			label: __( 'Location', 'block-visibility' ),
			attributeSlug: 'location',
			settingSlug: 'location',
		},
		{
			label: __( 'Metadata', 'block-visibility' ),
			attributeSlug: 'metadata',
			settingSlug: 'metadata',
		},
		{
			label: __( 'Query String', 'block-visibility' ),
			attributeSlug: 'queryString',
			settingSlug: 'query_string',
		},
		{
			label: __( 'Referral Source', 'block-visibility' ),
			attributeSlug: 'referralSource',
			settingSlug: 'referral_source',
		},
		{
			label: __( 'Screen Size', 'block-visibility' ),
			attributeSlug: 'screenSize',
			settingSlug: 'screen_size',
		},
		{
			label: __( 'URL Path', 'block-visibility' ),
			attributeSlug: 'urlPath',
			settingSlug: 'url_path',
		},
		{
			label: __( 'User Role', 'block-visibility' ),
			attributeSlug: 'userRole',
			settingSlug: 'visibility_by_role',
		},
		{
			label: __( 'Visibility Presets', 'block-visibility' ),
			attributeSlug: 'visibilityPresets',
			settingSlug: 'visibility_presets',
		},
	];

	const integrationControls = [
		{
			label: __( 'Advanced Custom Fields', 'block-visibility' ),
			type: 'integration',
			attributeSlug: 'acf',
			settingSlug: 'acf',
			icon: acf,
		},
		{
			label: __( 'Easy Digital Downloads', 'block-visibility' ),
			type: 'integration',
			attributeSlug: 'edd',
			settingSlug: 'edd',
			icon: edd,
		},
		{
			label: __( 'WooCommerce', 'block-visibility' ),
			type: 'integration',
			attributeSlug: 'woocommerce',
			settingSlug: 'woocommerce',
			icon: woocommerce,
		},
		{
			label: __( 'WP Fusion', 'block-visibility' ),
			type: 'integration',
			attributeSlug: 'wpFusion',
			settingSlug: 'wp_fusion',
			icon: wpFusion,
		},
	];

	let controls = [ ...coreControls, ...integrationControls ];

	controls = applyFilters( 'blockVisibility.controls', controls );

	// Remove any duplicate controls.
	controls = controls.filter(
		( value, index, self ) =>
			index ===
			self.findIndex(
				( control ) =>
					control.attributeSlug === value.attributeSlug &&
					control.settingSlug === value.settingSlug
			)
	);

	// Sort controls in ASC order.
	controls.sort( ( a, b ) => a.label.localeCompare( b.label ) );

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

	const defaultControls = settings?.plugin_settings?.default_controls ?? [];

	// Determine which enable controls are defaults, if any.
	enabledControls.forEach( function ( control ) {
		if ( defaultControls.includes( control.settingSlug ) ) {
			control.isDefault = true;
		}
	} );

	enabledControls = applyFilters(
		'blockVisibility.enabledControls',
		enabledControls,
		settings,
		variables
	);

	return enabledControls;
}
