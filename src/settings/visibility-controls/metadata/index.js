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
 * Renders the Metadata control settings.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Metadata( props ) {
	const { visibilityControls, setVisibilityControls } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.metadata?.enable ?? true;

	return (
		<div className="settings-panel control-metadata">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Metadata (Custom Fields)', 'block-visibility' ) }
				</span>
				<span className="pro-badge">Pro</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Metadata control.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setVisibilityControls( {
								...visibilityControls,
								metadata: {
									...visibilityControls.metadata,
									enable: ! enable,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'The Metadata control allows you to conditionally display a block based on post or user metadata. Metadata is often referred to as Custom Fields. If you are already using the Advanced Custom Fields plugin, use the ACF control over the Metadata control.',
							'block-visibility'
						) }
						link={ links.settingsMetadata }
					/>
				</div>
			</div>
		</div>
	);
}
