<?php
/**
 * Helper function for retrieving any plugin setting.
 *
 * @package block-visibility
 * @since   1.5.0
 */

namespace BlockVisibility\Utils;

defined( 'ABSPATH' ) || exit;

/**
 * Helper function for retrieving any plugin setting.
 *
 * @since 1.5.0
 *
 * @param array  $settings      The core plugin settings.
 * @param string $category     The category the setting is in (visibility_controls or plugin_settings).
 * @param string $sub_category (Optional, set to null if not needed) The sub-category the setting is in.
 * @param string $setting      The setting or setting group if you are retrieving a sub-setting.
 * @param string $sub_setting  (Optional, set to null if not needed) The sub-setting to be retrieved.
 * @param mixed  $default       The default setting value, if the setting cannot be found.
 * @return boolean             Is the control (or subcontrol) enabled?
 */
function get_setting( $settings, $category, $sub_category, $setting, $sub_setting, $default ) {

	if ( isset( $settings[ $category ] ) ) {
		$category_settings = $settings[ $category ];
	} else {
		return $default;
	}

	if ( $sub_category && isset( $category_settings[ $sub_category ] ) ) {
		$category_settings = $category_settings[ $sub_category ];
	} else {
		return $default;
	}

	if ( $sub_setting ) {
		if ( isset( $category_settings[ $setting ][ $sub_setting ] ) ) {
			return $category_settings[ $setting ][ $sub_setting ];
		}
	} elseif ( isset( $category_settings[ $setting ] ) ) {
		return $category_settings[ $setting ];
	}

	return $default;
}
