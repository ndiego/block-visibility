/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, ExternalLink } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import InformationPopover from './../../../utils/components/information-popover';

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
		<div className="setting-tabs__settings-panel">
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
										href="https://www.blockvisibilitywp.com/knowledge-base/how-to-configure-the-general-settings/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
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
							"By default, not all blocks are provided with visibility controls. These include child blocks and blocks that may exist in WordPress, but cannot actually be added directly to the editor. Most of the time, you will not need Full Control Mode, but it's there in case you do. Use with caution. Click the link below for complete details.",
							'block-visibility'
						) }
						link={
							'https://www.blockvisibilitywp.com/knowledge-base/how-to-configure-the-general-settings/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals'
						}
					/>
				</div>
			</div>
		</div>
	);
}
