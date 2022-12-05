/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, ExternalLink } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import links from './../../../utils/links';
import { InformationPopover } from './../../../components';

/**
 * Renders the full control mode settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function FullControlMode( props ) {
	const { pluginSettings, setPluginSettings } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enableFullControlMode = pluginSettings?.enable_full_control_mode ?? false; // eslint-disable-line

	return (
		<div className="settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Full Control Mode', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ createInterpolateElement(
							__(
								'Enable Full Control Mode to add visibility controls to <strong>every</strong> block. <a>Use with caution</a>.',
								'block-visibility'
							),
							{
								strong: <strong />,
								a: (
									<ExternalLink // eslint-disable-line
										href={ links.settingsGeneral }
										target="_blank"
										rel="noreferrer"
									/>
								),
							}
						) }
						checked={ enableFullControlMode }
						onChange={ () => {
							setPluginSettings( {
								...pluginSettings,
								enable_full_control_mode:
									! enableFullControlMode,
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							"Some blocks do not have visibility controls enabled by default. These include child blocks and blocks that may exist in WordPress but cannot be added directly to the Editor. You will not need Full Control Mode most of the time, but it's here in case you do.",
							'block-visibility'
						) }
						link={ links.settingsGeneral }
					/>
				</div>
			</div>
		</div>
	);
}
