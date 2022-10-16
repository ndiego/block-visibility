/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { InformationPopover } from './../../components';

/**
 * Add the Hide Block control
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function HideBlock( props ) {
	const { attributes, setAttributes, enabledControls } = props;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'hide_block' && control.isActive
	);

	if ( ! controlActive ) {
		return null;
	}

	const { blockVisibility } = attributes;
	const hideBlock = blockVisibility?.hideBlock ?? false;

	return (
		<div className="control-panel-item hide-block-control">
			<h3 className="control-panel-item__header has-icon">
				<span>{ __( 'Hide Block', 'block-visibility' ) }</span>
				<InformationPopover
					message={ __(
						'The Hide Block control overrides all other visibility controls when enabled.',
						'block-visibility'
					) }
					link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-hide-block-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					position="bottom center"
				/>
			</h3>
			<ToggleControl
				label={ __( 'Hide the block from everyone', 'block-visibility' ) }
				checked={ hideBlock }
				onChange={ () => {
					setAttributes( {
						blockVisibility: assign(
							{ ...blockVisibility },
							{ hideBlock: ! hideBlock }
						),
					} );
				} }
			/>
		</div>
	);
}
