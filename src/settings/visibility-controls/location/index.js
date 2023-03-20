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
 * Renders the Location control settings.
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Location( props ) {
	const { visibilityControls, setVisibilityControls } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.location?.enable ?? true;

	return (
		<div className="settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Location', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Location control.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setVisibilityControls( {
								...visibilityControls,
								location: {
									...visibilityControls.location,
									enable: ! enable,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'The Location control allows you to conditionally display blocks based on where the block is located on your website. This includes page and post types, taxonomies, and more.',
							'block-visibility'
						) }
						link={ links.settingsLocation }
					/>
				</div>
			</div>
		</div>
	);
}
