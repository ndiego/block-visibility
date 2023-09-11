<?php
/**
 * Adds a filter to the visibility test for the "browser and device" settings.
 *
 * @package block-visibility
 * @since   3.0.0
 */

namespace BlockVisibility\Frontend\VisibilityTests;

defined( 'ABSPATH' ) || exit;

/**
 * Internal dependencies
 */
use function BlockVisibility\Utils\is_control_enabled;
use BlockVisibility\Vendors\Wolfcast\BrowserDetection;

/**
 * Run test to see if block visibility should be restricted by browser & device.
 *
 * @since 1.1.0
 *
 * @param boolean $is_visible The current value of the visibility test.
 * @param array   $settings   The core plugin settings.
 * @param array   $controls   The control set controls.
 * @return boolean            Return true if the block should be visible, false if not
 */
function browser_device_test( $is_visible, $settings, $controls ) {

	// The test is already false, so skip this test, the block should be hidden.
	if ( ! $is_visible ) {
		return $is_visible;
	}

	// If this control has been disabled, skip test.
	if ( ! is_control_enabled( $settings, 'browser_device' ) ) {
		return true;
	}

	$control_atts = isset( $controls['browserDevice'] )
		? $controls['browserDevice']
		: null;

	// There are no control settings, so skip tests.
	if ( ! $control_atts ) {
		return true;
	}

	$rule_sets = isset( $control_atts['ruleSets'] )
		? $control_atts['ruleSets']
		: array();

	$hide_on_rule_sets = isset( $control_atts['hideOnRuleSets'] )
		? $control_atts['hideOnRuleSets']
		: false;

	// There are no rule sets, skip tests.
	if ( ! is_array( $rule_sets ) || 0 === count( $rule_sets ) ) {
		return true;
	}

	// Fetch all browser details from the detection class.
	$browser = new BrowserDetection();

	// Array of results for each rule set.
	$rule_sets_test_results = array();

	foreach ( $rule_sets as $rule_set ) {
		$enable = isset( $rule_set['enable'] ) ? $rule_set['enable'] : true;
		$rules  =
			isset( $rule_set['rules'] ) ? $rule_set['rules'] : array();

		if ( $enable && 0 < count( $rules ) ) {

			// Array of results for each rule within the current rule set.
			$rule_set_test_results = array();

			foreach ( $rules as $rule ) {

				$test_result = run_browser_device_rule_tests( $rule, $browser );

				// If there is an error, default to showing the block.
				$test_result =
					'error' === $test_result ? 'visible' : $test_result;

				$rule_set_test_results[] = $test_result;
			}

			// Within a rule set, all tests have to pass.
			$rule_set_result = in_array( 'hidden', $rule_set_test_results, true )
				? 'hidden'
				: 'visible';

			// Reverse the rule set result if hide_on_rules setting is active.
			if ( $hide_on_rule_sets ) {
				$rule_set_result =
					'visible' === $rule_set_result ? 'hidden' : 'visible';
			}

			// Pass the rule set result to the rule *sets* test results array.
			$rule_sets_test_results[] = $rule_set_result;
		}
	}

	// If there are no enabled rule sets, or if the rule sets have no set rules,
	// there will be no results. Default to showing the block.
	if ( empty( $rule_sets_test_results ) ) {
		return true;
	}

	// Under normal circumstances, need no "visible" results to hide the block.
	// When hide_on_rule_sets is enabled, we need at least one "hidden" to hide.
	if (
		! $hide_on_rule_sets &&
		! in_array( 'visible', $rule_sets_test_results, true )
	) {
		return false;
	} elseif (
		$hide_on_rule_sets &&
		in_array( 'hidden', $rule_sets_test_results, true )
	) {
		return false;
	} else {
		return true;
	}
}
add_filter( 'block_visibility_control_set_is_block_visible', __NAMESPACE__ . '\browser_device_test', 10, 3 );

/**
 * Run the individual rule tests.
 *
 * @since 1.1.0
 *
 * @param array $rule    All rule settings.
 * @param array $browser All browser details.
 * @return string        Returns 'visible', 'hidden', or 'error'.
 */
function run_browser_device_rule_tests( $rule, $browser ) {

	$field = isset( $rule['field'] ) ? $rule['field'] : null;

	// No field is set, so return an error.
	if ( ! $field ) {
		return 'error';
	}

	switch ( $field ) {

		case 'browserType':
			$test_result = run_browser_type_test( $rule, $browser );
			break;

		case 'devicePlatform':
			$test_result = run_device_platform_test( $rule, $browser );
			break;

		case 'deviceType':
			$test_result = run_device_type_test( $rule, $browser );
			break;

		default:
			$test_result = 'error';
			break;
	}

	return $test_result;
}

/**
 * Run the Browser & Device browser type test.
 *
 * @since 1.1.0
 *
 * @param array $rule    All rule settings.
 * @param array $browser All browser details.
 * @return string        Returns 'visible', 'hidden', or 'error'.
 */
function run_browser_type_test( $rule, $browser ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$operator = $rule['operator'];
	$types    = $rule['value'];

	if ( ! empty( $types ) && is_array( $types ) ) {
		$results      = array();
		$browser_name = $browser->getName();

		foreach ( $types as $type ) {

			switch ( $type ) {
				case 'chrome':
					$result = 'Chrome' === $browser_name ? true : false;
					break;

				case 'firefox':
					$result = 'Firefox' === $browser_name ? true : false;
					break;

				case 'edge':
					$result = 'Edge' === $browser_name ? true : false;
					break;

				case 'ie':
					$result = ( 'Internet Explorer' === $browser_name || 'Internet Explorer Mobile' === $browser_name ) ? true : false;
					break;

				case 'opera':
					$result = ( 'Opera' === $browser_name || 'Opera Mini' === $browser_name || 'Opera Mobile' === $browser_name ) ? true : false;
					break;

				case 'safari':
					$result = 'Safari' === $browser_name ? true : false;
					break;

				case 'samsung':
					$result = 'Samsung Internet' === $browser_name ? true : false;
					break;

				default:
					$result = false;
					break;
			}

			// Need to use strings here and not boolean for eval function.
			$results[] = $result ? 'true' : 'false';
		}

		$test_result = any_value_compare( $operator, $results );
	}

	return $test_result;
}

/**
 * Run the Browser & Device device platform test.
 *
 * @since 1.1.0
 *
 * @param array $rule    All rule settings.
 * @param array $browser All browser details.
 * @return string        Returns 'visible', 'hidden', or 'error'.
 */
function run_device_platform_test( $rule, $browser ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$operator = $rule['operator'];
	$types    = $rule['value'];

	if ( ! empty( $types ) && is_array( $types ) ) {
		$results  = array();
		$platform = $browser->getPlatform();

		foreach ( $types as $type ) {

			switch ( $type ) {
				case 'android':
					$result = 'Android' === $platform ? true : false;
					break;

				case 'ios':
					$result = 'iOS' === $platform ? true : false;
					break;

				case 'linux':
					$result = 'Linux' === $platform ? true : false;
					break;

				case 'macintosh':
					$result = 'Macintosh' === $platform ? true : false;
					break;

				case 'windows':
					$result = ( 'Windows' === $platform || 'Windows CE' === $platform || 'Windows Phone' === $platform ) ? true : false;
					break;

				default:
					$result = false;
					break;
			}

			// Need to use strings here and not boolean for eval function.
			$results[] = $result ? 'true' : 'false';
		}

		$test_result = any_value_compare( $operator, $results );
	}

	return $test_result;
}

/**
 * Run the Browser & Device device type test.
 *
 * @since 1.1.0
 *
 * @param array $rule    All rule settings.
 * @param array $browser All browser details.
 * @return string        Returns 'visible', 'hidden', or 'error'.
 */
function run_device_type_test( $rule, $browser ) {

	if ( ! isset( $rule['operator'] ) || ! isset( $rule['value'] ) ) {
		return 'error';
	}

	// Assume error and try to disprove.
	$test_result = 'error';

	$operator = $rule['operator'];
	$types    = $rule['value'];

	if ( ! empty( $types ) && is_array( $types ) ) {
		$results = array();

		foreach ( $types as $type ) {

			switch ( $type ) {
				case 'mobile':
					$result = $browser->isMobile();
					break;

				case 'robot':
					$result = $browser->isRobot();
					break;

				case 'other':
					$result = ( ! $browser->isMobile() && ! $browser->isRobot() ) ? true : false;
					break;

				default:
					$result = false;
					break;
			}

			// Need to use strings here and not boolean for eval function.
			$results[] = $result ? 'true' : 'false';
		}

		$test_result = any_value_compare( $operator, $results );
	}

	return $test_result;
}

/* Require the browser detection class */
require_once BLOCK_VISIBILITY_ABSPATH . 'includes/vendors/browser-detection.php';
