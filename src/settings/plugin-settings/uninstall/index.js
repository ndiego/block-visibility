/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InformationPopover from './../../utils/information-popover';

/**
 * Renders the uninstall settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function FullControlMode( props ) {
	const { pluginSettings, setPluginSettings } = props;

	// Manually set defaults, this ensures the main settings function properly
	const removeOnUninstall = pluginSettings?.remove_on_uninstall ?? false; // eslint-disable-line

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Uninstall', 'block-visibility' ) }
				</span>
				<InformationPopover
					message={ __(
						'Settings that impact what happens when the Block Visibility plugin is uninstalled.',
						'block-visibility'
					) }
				/>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle">
					<ToggleControl
						label={ __(
							'Remove all plugin settings when Block Visibility is uninstalled.',
							'block-visibility'
						) }
						checked={ removeOnUninstall }
						onChange={ () => {
							setPluginSettings( {
								...pluginSettings,
								remove_on_uninstall: ! removeOnUninstall,
							} );
						} }
					/>
				</div>
			</div>
		</div>
	);
}
