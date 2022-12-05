/**
 * External dependencies
 */
import { has } from 'lodash';

/**
 * Check if the given plugin setting is enabled.
 *
 * @since 1.1.0
 * @param {Object}  settings       All plugin settings
 * @param {string}  setting        Name of setting to check
 * @param {boolean} settingDefault The defaualt if the setting cannot be found (optional)
 * @return {boolean}		       Whether the setting is enabled or not
 */
export default function isPluginSettingEnabled(
	settings,
	setting,
	settingDefault = true
) {
	// Make sure we have visibility settings, otherwise abort.
	if ( ! settings || 0 === settings.length ) {
		return false;
	}

	const pluginSettings = settings.plugin_settings;
	const hasSetting = has( pluginSettings, setting );

	// Return the default if there is no control setting.
	if ( ! hasSetting ) {
		return settingDefault;
	}

	return pluginSettings[ setting ];
}
