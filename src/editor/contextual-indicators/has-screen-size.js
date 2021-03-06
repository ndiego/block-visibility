/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Determine if screen size settings are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  blockVisibility All visibility attributes for the block
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @param {Object}  settings        All available plugin settings
 * @return {boolean}		        Does the block have date time settings
 */
export default function hasScreenSize(
	blockVisibility,
	enabledControls,
	settings
) {
	// Set default attributes if needed.
	const screenSize = blockVisibility?.hideOnScreenSize ?? {
		extraLarge: false,
		large: false,
		medium: false,
		small: false,
		extraSmall: false,
	};

	// Get the screen size control settings.
	const controls = settings?.visibility_controls?.screen_size?.controls ?? {
		extra_large: true,
		large: true,
		medium: true,
		small: true,
		extra_small: true,
	};

	// @TODO: Refactor in future to identify the specific active restrictions.
	const hasSizeRestrictions = [
		screenSize.extraLarge && controls.extra_large ? true : false,
		screenSize.large && controls.large ? true : false,
		screenSize.medium && controls.medium ? true : false,
		screenSize.small && controls.small ? true : false,
		screenSize.extraSmall && controls.extra_small ? true : false,
	];

	let indicatorTest = true;

	if (
		! enabledControls.includes( 'screen_size' ) ||
		! hasSizeRestrictions.includes( true )
	) {
		indicatorTest = false;
	}

	indicatorTest = applyFilters(
		'blockVisibility.hasScreenSize',
		indicatorTest
	);

	return indicatorTest;
}
