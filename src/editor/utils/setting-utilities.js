/**
 * External dependencies
 */
import { has } from 'lodash';

/**
 * Get all the visibility controls that are enabled in the plugin settings.
 *
 * @since 1.1.0
 * @param {Object} settings All plugin settings
 * @return {Array}   	    Return array of all enabled visibility controls.
 */
export function getEnabledControls( settings ) {
	// We need to manually add the possible control categories here.
	const controls = [
		'hide_block',
		'visibility_by_role',
		'date_time',
		// Add additional controls here.
	];
	const enabledControls = [];

	// Make sure we have visibility settings, otherwise abort.
	if ( ! settings ) {
		return enabledControls;
	}

	const visibilityControls = settings.visibility_controls;

	controls.forEach( function ( control ) {
		const hasControl = has( visibilityControls, control );

		// If the control does not exist, assume true.
		if ( ! hasControl ) {
			enabledControls.push( control );
		}

		// Check if the control is set, default to "true".
		if ( visibilityControls[ control ]?.enable ?? true ) {
			enabledControls.push( control );
		}
	} );

	return enabledControls;
}

/**
 * Check if the given visibility control settings is enabled.
 *
 * @since 1.1.0
 * @param {Object} settings All plugin settings
 * @param {string} control  Name of control that has the setting
 * @param {string} setting  Name of setting to check
 * @return {boolean}		Whether the setting is enabled or not
 */
export function isControlSettingEnabled( settings, control, setting ) {
	// Make sure the visibility settings have been retreived, otherwise abort.
	if ( ! settings ) {
		return false;
	}

	const visibilityControls = settings.visibility_controls;
	const hasControl = has( visibilityControls, control );

	// Default to true if there is no control.
	if ( ! hasControl ) {
		return true;
	}

	const hasControlSetting = has( visibilityControls[ control ], setting );

	// Default to true if there is no control setting.
	if ( ! hasControlSetting ) {
		return true;
	}

	return visibilityControls[ control ][ setting ];
}

/**
 * Check if the given plugin setting is enabled.
 *
 * @since 1.1.0
 * @param {Object} settings All plugin settings
 * @param {string} setting  Name of setting to check
 * @return {boolean}		Whether the setting is enabled or not
 */
export function isPluginSettingEnabled( settings, setting ) {
	// Make sure we have visibility settings, otherwise abort.
	if ( ! settings ) {
		return false;
	}

	const pluginSettings = settings.plugin_settings;
	const hasSetting = has( pluginSettings, setting );

	// If the setting does not exist, default to enabled.
	if ( ! hasSetting ) {
		return true;
	}

	return pluginSettings[ setting ];
}
