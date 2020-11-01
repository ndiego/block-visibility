/**
 * Check if the given control section should be hidden or not
 *
 * @since 1.1.0
 * @param {array} enabledControls All enabled visibility control sections
 * @param {array} blockVisibility The block visibility attributes of the selected block
 * @param {string} control        The control section to check if should be hidden
 * @return {boolean}		      Whether the control section shol=uld be hidden or not.
 */
export function hideControlSection( enabledControls, blockVisibility, control ){
    const { hideBlock } = blockVisibility;
    const blockHidden = enabledControls.includes( 'hide_block' ) && hideBlock;
    const sectionEnabled = enabledControls.includes( control );
    // Hide if block is already completely hidden or the section is not enabled.
    const hideControlSection = blockHidden || ! sectionEnabled ? true : false;

    return hideControlSection;
}
