/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
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
import Integrations from './integrations';

/**
 * Renders the Visibility Controls tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function VisibilityControls( props ) {
	const [ visibilityControls, setVisibilityControls ] = useState(
		props.visibilityControls
	);
	const [ hasUpdates, setHasUpdates ] = useState( false );
	const { variables, handleSettingsChange, saveStatus } = props;

	function onSettingsChange() {
		handleSettingsChange( 'visibility_controls', visibilityControls );
		setHasUpdates( false );
	}

	// Provides an entry point to slot in additional settings.
	const AdditionalControls = withFilters(
		'blockVisibility.VisibilityControls'
	)( ( props ) => <></> ); // eslint-disable-line

	return (
		<div className="setting-tabs__visibility-controls inner-container">
			<div className="setting-tabs__setting-controls">
				<div className="setting-controls__title">
					<span>
						{ __( 'Visibility Controls', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __(
							'The settings below allow you to configure the visibility controls that power this plugin. Pick and choose which controls you would like to enable and how you would like them to function. When a visibility control is disabled, blocks that relied on the disabled control will become visible again.',
							'block-visibility'
						) }
						subMessage={ __(
							'To learn more about Visibility Controls, review the plugin documentation using the link below.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/documentation/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
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
				settings={ visibilityControls }
				setSettings={ setVisibilityControls }
				setHasUpdates={ setHasUpdates }
			/>
			<DateTime
				settings={ visibilityControls }
				setSettings={ setVisibilityControls }
				setHasUpdates={ setHasUpdates }
			/>
			<UserRole
				settings={ visibilityControls }
				setSettings={ setVisibilityControls }
				setHasUpdates={ setHasUpdates }
			/>
			<ScreenSize
				settings={ visibilityControls }
				setSettings={ setVisibilityControls }
				setHasUpdates={ setHasUpdates }
			/>
			<Slot name="VisibilityControlsMiddle" />
			<Integrations
				settings={ visibilityControls }
				variables={ variables }
				setSettings={ setVisibilityControls }
				setHasUpdates={ setHasUpdates }
			/>
			<Slot name="VisibilityControlsBottom" />
			<AdditionalControls
				settings={ visibilityControls }
				setSettings={ setVisibilityControls }
				setHasUpdates={ setHasUpdates }
				{ ...props }
			/>
		</div>
	);
}
