/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import InformationPopover from './../../utils/information-popover';
import icons from './../../../utils/icons';

/**
 * Renders the hide block control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function Integrations( props ) {
	const { settings, setSettings, setHasUpdates } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = settings?.wp_fusion?.enable ?? true; // eslint-disable-line

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Third-Party Integrations', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-label integration">
					<span>{ __( 'WP Fusion', 'block-visibility' ) }</span>
					<Icon icon={ icons.wpFusion } />
				</div>
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the WP Fusion control.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setSettings( {
								...settings,
								wp_fusion: {
									...settings.wp_fusion,
									enable: ! enable,
								},
							} );
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'The Hide Block control allows you easily hide blocks completely from the frontend of your website. It is the simplest, yet most powerful, control and overrides all others when enabled on the block.',
							'block-visibility'
						) }
						subMessage={ __(
							'To learn more about the Hide Block control, review the plugin documentation using the link below.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
			</div>
		</div>
	);
}
