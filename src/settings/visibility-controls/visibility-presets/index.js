/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import links from './../../../utils/links';
import { InformationPopover } from './../../../components';

/**
 * Renders the Visibility Presets control settings.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function VisibilityPresets( props ) {
	const { visibilityControls, setVisibilityControls } = props;

	// Manually set defaults, this ensures the main settings function properly
     const enablePresets = visibilityControls?.visibility_presets?.enable ?? true; // eslint-disable-line

	return (
		<div className="settings-panel control-visibility-presets">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Visibility Presets', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Visibility Presets control.',
							'block-visibility'
						) }
						checked={ enablePresets }
						onChange={ () => {
							setVisibilityControls( {
								...visibilityControls,
								visibility_presets: {
									...visibilityControls.visibility_presets,
									enable: ! enablePresets,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'Visibility Presets allow you to configure visibility controls globally and then apply them to individual blocks.',
							'block-visibility'
						) }
						link={ links.settingsVisibilityPresets }
					/>
				</div>
			</div>
		</div>
	);
}
