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
 * Renders the hide block control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function HideBlock( props ) {
	const { settings, setSettings, setHasUpdates } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = settings?.hide_block?.enable ?? true; // eslint-disable-line

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Hide Block', 'block-visibility' ) }
				</span>
				<InformationPopover
					message={ __(
						'To learn more about the Hide Block control, review the plugin documentation using the link below.',
						'block-visibility'
					) }
					link="https://www.blockvisibilitywp.com/documentation/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
				/>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle">
					<ToggleControl
						label={ __(
							'Enable the ability to hide blocks completely from the frontend of your website.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setSettings( {
								...settings,
								hide_block: {
									...settings.hide_block,
									enable: ! enable,
								},
							} );
							setHasUpdates( true );
						} }
					/>
				</div>
			</div>
		</div>
	);
}
