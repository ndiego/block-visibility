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
 * Add the Hide Block control
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function HideBlock( props ) {
	const { attributes, setAttributes, enabledControls } = props;
	const controlEnabled = enabledControls.some(
		( control ) => control.settingSlug === 'hide_block'
	);

	if ( ! controlEnabled ) {
		return null;
	}

	const { blockVisibility } = attributes;
	const hideBlock = blockVisibility?.hideBlock ?? false;

	return (
		<div className="visibility-control__group hide-block-control">
			<div className="visibility-control">
				<ToggleControl
					label={ __( 'Hide block', 'block-visibility' ) }
					checked={ hideBlock }
					onChange={ () => {
						setAttributes( {
							blockVisibility: assign(
								{ ...blockVisibility },
								{ hideBlock: ! hideBlock }
							),
						} );
					} }
					help={ __(
						'Hide the block from everyone.',
						'block-visibility'
					) }
				/>
			</div>
		</div>
	);
}
