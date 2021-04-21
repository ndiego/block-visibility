/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Determine if screen size settings are enabled for the block.
 *
 * @since 1.1.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @param {Object}  settings        All available plugin settings
 * @return {boolean}		        Does the block have date time settings
 */
export default function hasScreenSize(
	controls,
	hasControlSets,
	enabledControls,
	settings
) {
	if ( hasControlSets && ! controls.hasOwnProperty( 'screenSize' ) ) {
		return false;
	}

	const controlAtts = hasControlSets ? controls.screenSize : controls;

	// Set default attributes if needed.
	const screenSize = controlAtts?.hideOnScreenSize ?? {
		extraLarge: false,
		large: false,
		medium: false,
		small: false,
		extraSmall: false,
	};

	// Get the screen size control settings.
	const screenSizeControls = settings?.visibility_controls?.screen_size?.controls ?? { // eslint-disable-line
		extra_large: true,
		large: true,
		medium: true,
		small: true,
		extra_small: true,
	};

	// @TODO: Refactor in future to identify the specific active restrictions.
	const hasSizeRestrictions = [
		screenSize.extraLarge && screenSizeControls.extra_large ? true : false,
		screenSize.large && screenSizeControls.large ? true : false,
		screenSize.medium && screenSizeControls.medium ? true : false,
		screenSize.small && screenSizeControls.small ? true : false,
		screenSize.extraSmall && screenSizeControls.extra_small ? true : false,
	];

	let indicatorTest = true;

	if (
		! enabledControls.some(
			( control ) => control.settingSlug === 'screen_size'
		) ||
		! hasSizeRestrictions.includes( true )
	) {
		indicatorTest = false;
	}

	indicatorTest = applyFilters(
		'blockVisibility.hasScreenSizeIndicator',
		indicatorTest,
		controls,
		hasControlSets,
		enabledControls,
		settings
	);

	return indicatorTest;
}
