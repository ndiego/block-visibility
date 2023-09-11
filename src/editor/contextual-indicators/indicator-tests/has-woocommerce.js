/**
 * Determine if WooCommerce settings are enabled for the block.
 *
 * @since 3.1.0
 * @param {Object}  controls        All visibility controls for the block
 * @param {boolean} hasControlSets  Whether or not the block has a control set
 * @param {Array}   enabledControls Array of all enabled visibility controls
 * @param {Object}  variables       All available plugin variables
 * @return {boolean}		        Does the block have WooCommerce settings
 */
export default function hasWooCommerce(
	controls,
	hasControlSets,
	enabledControls,
	variables
) {
	const pluginActive = variables?.integrations?.woocommerce?.active ?? false;

	// WooCommerce is not active so return false even if saved controls exist.
	if (
		! pluginActive ||
		! enabledControls.some(
			( control ) => control.settingSlug === 'woocommerce'
		)
	) {
		return false;
	}

	if ( hasControlSets && ! controls.hasOwnProperty( 'woocommerce' ) ) {
		return false;
	}

	// Could add more robust logic in the future, but for now, show the
	// indicator is there are any WooCommerce settings.
	const ruleSets = controls?.woocommerce?.ruleSets ?? [];
	let indicatorTest = true;

	if ( ruleSets.length === 0 ) {
		indicatorTest = false;
	}

	return indicatorTest;
}
