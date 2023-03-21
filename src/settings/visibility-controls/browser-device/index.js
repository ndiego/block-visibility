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
 * Renders the Browser & Device control settings.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function BrowserDevice( props ) {
	const { visibilityControls, setVisibilityControls } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.browser_device?.enable ?? true;

	return (
		<div className="settings-panel control-browser-device">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __(
						'Browser & Device (User Agent)',
						'block-visibility'
					) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Browser & Device control.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setVisibilityControls( {
								...visibilityControls,
								browser_device: {
									...visibilityControls.browser_device,
									enable: ! enable,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'The Browser & Device control allows you to conditionally display a block based on the device or web browser the current user is using to visit your website.',
							'block-visibility'
						) }
						link={ links.settingsBrowserDevice }
					/>
				</div>
			</div>
		</div>
	);
}
