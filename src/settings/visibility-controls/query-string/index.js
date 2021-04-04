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
 * Renders the Query String control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function QueryString( props ) {
	const { visibilityControls, setVisibilityControls, setHasUpdates } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.query_string?.enable ?? true; // eslint-disable-line

	return (
		<div className="setting-tabs__settings-panel">
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
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'The Query String control allows you to conditionally display blocks based on URL query strings.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/visibility-controls/query-string/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
			</div>
		</div>
	);
}
