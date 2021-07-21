/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, createInterpolateElement } from '@wordpress/element';
import { withFilters, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import SaveSettings from './../utils/save-settings';
import InformationPopover from './../utils/information-popover';
import HideBlock from './hide-block';
import DateTime from './date-time';
import UserRole from './user-role';
import ScreenSize from './screen-size';
import QueryString from './query-string';
import Integrations from './integrations';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalControls = withFilters(
	'blockVisibility.VisibilityControls'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Renders the Visibility Controls tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function VisibilityControls( props ) {
	const [ visibilityControls, setVisibilityControls ] = useState(
		props.settings.visibility_controls
	);
	const [ hasUpdates, setHasUpdates ] = useState( false );
	const { handleSettingsChange, saveStatus } = props;

	function onSettingsChange() {
		handleSettingsChange( 'visibility_controls', visibilityControls );
		setHasUpdates( false );
	}

	return (
		<>
			<Slot name="SettingsTabPanelTop" />
			<div className="ads-container">
				<div className="ads-container__pro">
					<p>Enhance the campabilities of Block Visibility with the Pro add-on</p>
					<p>Location control, eCommerce integrations, advanced scheduling, premium support and more!</p>
				</div>
				<div className="ads-container__support">
					<p>Enhance the campabilities of Block Visibility with the Pro add-on</p>
					<p>Location control, eCommerce integrations, advanced scheduling, premium support and more!</p>
				</div>
				<div className="ads-container__reviews">
					{ createInterpolateElement(
						__(
							'User reviews are very important for open source projects, and Block Visibility is no different. If you enjoy the plugin, please consider leaving a <a>review ★★★★★</a> on WordPress.org. Your feedback is greatly appreciated.',
							'block-visibility'
						),
						{
							a: (
								<a // eslint-disable-line
									href='https://wordpress.org/support/plugin/block-visibility/reviews/?filter=5'
									target="_blank"
									rel="noreferrer"
								/>
							),
						}
					) }
				</div>
			</div>
			<div className="setting-tabs__visibility-controls inner-container">
				<div className="setting-tabs__setting-controls">
					<div className="setting-controls__title">
						<span>
							{ __( 'Visibility Controls', 'block-visibility' ) }
						</span>
						<InformationPopover
							message={ __(
								'The settings below allow you to configure the visibility controls that power Block Visibility. Pick and choose which controls you would like to enable and how you would like them to function.',
								'block-visibility'
							) }
							subMessage={ __(
								'When a visibility control is disabled, blocks that relied on the disabled control will become visible again unless they are hidden by other enabled controls. Visit the plugin Knowledge Base for more information on configuring visibility controls.',
								'block-visibility'
							) }
							link="https://www.blockvisibilitywp.com/knowledge-base/guide-to-visibility-controls-in-block-visibility/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
						/>
					</div>
					<SaveSettings
						saveStatus={ saveStatus }
						hasUpdates={ hasUpdates }
						onSettingsChange={ onSettingsChange }
					/>
				</div>
				<Slot name="VisibilityControlsTop" />
				<HideBlock
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					setHasUpdates={ setHasUpdates }
					{ ...props }
				/>
				<DateTime
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					setHasUpdates={ setHasUpdates }
					{ ...props }
				/>
				<UserRole
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					setHasUpdates={ setHasUpdates }
					{ ...props }
				/>
				<ScreenSize
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					setHasUpdates={ setHasUpdates }
					{ ...props }
				/>
				<QueryString
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					setHasUpdates={ setHasUpdates }
					{ ...props }
				/>
				<Slot name="VisibilityControlsMiddle" />
				<Integrations
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					saveStatus={ saveStatus }
					onSettingsChange={ onSettingsChange }
					hasUpdates={ hasUpdates }
					setHasUpdates={ setHasUpdates }
					{ ...props }
				/>
				<Slot name="VisibilityControlsBottom" />
				<AdditionalControls
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					setHasUpdates={ setHasUpdates }
					{ ...props }
				/>
			</div>
			<Slot name="SettingsTabPanelBottom" />
		</>
	);
}
