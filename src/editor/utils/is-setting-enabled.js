/**
 * External dependencies
 */
import { has } from 'lodash';

export function isSettingEnabled( settings, setting ) {

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
