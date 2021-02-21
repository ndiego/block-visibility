<?php
/**
 * Helper function for retrieving the visibility control settings.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility\Utils;

defined( 'ABSPATH' ) || exit;

/**
 * Helper function for retrieving the visibility control settings.
 *
 * @since 1.0.0
 *
 * @param array  $settings    The core plugin settings.
 * @param string $control    The main control we are testing.
 * @param string $subcontrol (Optional) The subcontrol we are testing.
 * @param string $default    (Optional) Default value of subcontrol.
 * @return boolean           Is the control (or subcontrol) enabled?
 */
function is_control_enabled(
	$settings,
	$control,
	$subcontrol = 'enable',
	$default = true
) {

	if ( isset( $settings['visibility_controls'] ) ) {
		$visibility_controls = $settings['visibility_controls'];
	} else {
		// If the visibility control settings are missing return the default.
		return $default;
	}

	// If the settings don't exist, again, we want to return the default.
	if ( isset( $visibility_controls[ $control ][ $subcontrol ] ) ) {
		return $visibility_controls[ $control ][ $subcontrol ];
	} else {
		return $default;
	}
}
