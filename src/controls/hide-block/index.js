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
import links from './../../utils/links';
import { InformationPopover } from './../../components';

/**
 * Add the Hide Block control
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 */
export default function HideBlock( props ) {
	const { attributes, setAttributes, enabledControls, settings } = props;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'hide_block' && control.isActive
	);

	if ( ! controlActive ) {
		return null;
	}

	const { blockVisibility } = attributes;
	const hideBlock = blockVisibility?.hideBlock ?? false;
	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;

	return (
		<div className="controls-panel-item hide-block-control">
			<h3 className="controls-panel-item__header has-icon">
				<span>{ __( 'Hide Block', 'block-visibility' ) }</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							'The Hide Block control overrides all other visibility controls when enabled.',
							'block-visibility'
						) }
						link={ links.editorHideBlock }
						position="bottom center"
					/>
				) }
			</h3>
			<div className="controls-panel-item__control-fields">
				<ToggleControl
					label={ __(
						'Hide the block from everyone',
						'block-visibility'
					) }
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
		</div>
	);
}
