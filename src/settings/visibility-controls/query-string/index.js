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
 * Renders the Query String control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 */
export default function QueryString( props ) {
	const { visibilityControls, setVisibilityControls } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.query_string?.enable ?? true;

	return (
		<div className="settings-panel control-query-string">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Query String', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Query String control.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setVisibilityControls( {
								...visibilityControls,
								query_string: {
									...visibilityControls.query_string,
									enable: ! enable,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'The Query String control allows you to conditionally display blocks based on URL query strings.',
							'block-visibility'
						) }
						link={ links.settings.queryString }
					/>
				</div>
			</div>
		</div>
	);
}
