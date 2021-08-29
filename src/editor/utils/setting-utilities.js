/**
 * External dependencies
 */
import { has } from 'lodash';

/**
 * Check if the given visibility control settings is enabled.
 *
 * @since 1.1.0
 * @param {Object}  settings       All plugin settings
 * @param {string}  control        Name of control that has the setting
 * @param {string}  setting        Name of setting to check
 * @param {boolean} settingDefault The defaualt if the setting cannot be found (optional)
 * @return {boolean}		       Whether the setting is enabled or not
 */
export function isControlSettingEnabled(
	settings,
	control,
	setting,
	settingDefault = true
) {
	// Make sure the visibility settings have been retreived, otherwise abort.
	if ( ! settings || 0 === settings.length ) {
		return false;
	}

	const visibilityControls = settings.visibility_controls;
	const hasControl = has( visibilityControls, control );

	// Return the default if there is no control.
	if ( ! hasControl ) {
		return settingDefault;
	}

	const hasControlSetting = has( visibilityControls[ control ], setting );

	// Return the default if there is no control setting.
	if ( ! hasControlSetting ) {
		return settingDefault;
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
	if ( ! settings || 0 === settings.length ) {
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
