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
 * Renders the hide block control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 */
export default function HideBlock( props ) {
	const { visibilityControls, setVisibilityControls } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.hide_block?.enable ?? true; // eslint-disable-line

	return (
		<div className="settings-panel control-hide-block">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Hide Block', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Hide Block control.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setVisibilityControls( {
								...visibilityControls,
								hide_block: {
									...visibilityControls.hide_block,
									enable: ! enable,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							"The Hide Block control allows you to hide blocks easily on your website's front end. This control overrides all other controls when enabled on a block.",
							'block-visibility'
						) }
						link={ links.settingsHideBlock }
					/>
				</div>
			</div>
		</div>
	);
}
