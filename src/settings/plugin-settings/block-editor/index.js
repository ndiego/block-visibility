/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InformationPopover from './../../utils/information-popover';

/**
 * Renders the Block Editor visibility settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function BlockEditor( props ) {
	const { settings, setSettings, setHasUpdates } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enableContextualIndicators = settings?.enable_contextual_indicators ?? true; // eslint-disable-line
	const enableToolbarControls = settings?.enable_toolbar_controls ?? true; // eslint-disable-line

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Block Editor', 'block-visibility' ) }
				</span>
				<InformationPopover
					message={ __(
						'Settings that impact the Block Editor, such as contextual indicators for when a block has visibility controls, as well as additional toolbar options. Click the link below for complete details.',
						'block-visibility'
					) }
					link={
						'https://www.blockvisibilitywp.com/knowledge-base/general-settings/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals'
					}
				/>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle">
					<ToggleControl
						label={ __(
							'Enable contextual indicators when visibility settings are applied to a block.',
							'block-visibility'
						) }
						checked={ enableContextualIndicators }
						onChange={ () => {
							setSettings( {
								...settings,
								enable_contextual_indicators: ! enableContextualIndicators,
							} );
							setHasUpdates( true );
						} }
					/>
				</div>
				<div className="settings-type__toggle">
					<ToggleControl
						label={ __(
							'Enable block toolbar controls for visibility settings.',
							'block-visibility'
						) }
						checked={ enableToolbarControls }
						onChange={ () => {
							setSettings( {
								...settings,
								enable_toolbar_controls: ! enableToolbarControls,
							} );
							setHasUpdates( true );
						} }
					/>
				</div>
				<Slot name="BlockEditorSettings" />
			</div>
		</div>
	);
}
