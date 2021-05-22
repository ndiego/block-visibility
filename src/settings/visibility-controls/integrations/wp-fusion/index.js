/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './../../../../utils/icons';
import InformationPopover from './../../../utils/information-popover';

/**
 * Renders the Wp Fusion control settings.
 *
 * @since 1.8.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function WPFusion( props ) {
	const {
		variables,
		visibilityControls,
		setVisibilityControls,
		setHasUpdates,
	} = props;
	const wpFusionActive = variables?.integrations?.wp_fusion?.active ?? false;

	if ( ! wpFusionActive ) {
		return null;
	}

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.wp_fusion?.enable ?? true; // eslint-disable-line

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					<Icon icon={ icons.wpFusion } />
					{ __( 'WP Fusion', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the WP Fusion control.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setVisibilityControls( {
								...visibilityControls,
								wp_fusion: {
									...visibilityControls.wp_fusion,
									enable: ! enable,
								},
							} );
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'The WP Fusion control allows you to conditionally display blocks based on WP Fusion tags. Visit the plugin Knowledge Base for more information.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-wp-fusion-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
			</div>
		</div>
	);
}
