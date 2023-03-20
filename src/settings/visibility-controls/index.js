/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { withFilters, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import General from './general';
import HideBlock from './hide-block';
import BrowserDevice from './browser-device';
import Cookie from './cookie';
import DateTime from './date-time';
import UserRole from './user-role';
import ScreenSize from './screen-size';
import QueryString from './query-string';
import Integrations from './integrations';
import UpdateSettings from './../update-settings';
import links from './../../utils/links';
import { InformationPopover } from './../../components';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalControls = withFilters( 'blockVisibility.VisibilityControls' )(
	( props ) => <></> // eslint-disable-line
);

/**
 * Renders the Visibility Controls tab of the Block Visibility settings page
 *
 * @since 1.0.0
 * @param {Object} props All the props passed to this function
 */
export default function VisibilityControls( props ) {
	const [ hasUpdates, setHasUpdates ] = useState( false );
	const { settings, setSettings } = props;
	const visibilityControls = settings?.visibility_controls ?? {};

	function setVisibilityControls( newSettings ) {
		setSettings( {
			...settings,
			visibility_controls: newSettings,
		} );
		setHasUpdates( true );
	}

	return (
		<div className="setting-tabs__visibility-controls inner-container">
			<div className="setting-tabs__setting-controls">
				<div className="setting-controls__title">
					<span>
						{ __( 'Visibility Controls', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __(
							'The settings below allow you to configure the visibility controls that power Block Visibility. Pick and choose which controls you want to enable and how you would like them to function.',
							'block-visibility'
						) }
						subMessage={ __(
							'When a visibility control is disabled, blocks that rely on the disabled control will become visible again unless other enabled controls hide them.',
							'block-visibility'
						) }
						link={ links.settingsVisibilityControls }
					/>
				</div>
				<UpdateSettings
					tabSlug="visibility_controls"
					tabSettings={ visibilityControls }
					hasUpdates={ hasUpdates }
					setHasUpdates={ setHasUpdates }
					{ ...props }
				/>
			</div>
			<div className="setting-tabs__setting-panels">
				<Slot name="VisibilityControlsTop" />
				<General
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					setHasUpdates={ setHasUpdates }
					{ ...props }
				/>
				<HideBlock
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					{ ...props }
				/>
				<BrowserDevice
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					{ ...props }
				/>
				<Cookie
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					{ ...props }
				/>
				<DateTime
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					{ ...props }
				/>
				<QueryString
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					{ ...props }
				/>
				<ScreenSize
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					{ ...props }
				/>
				<UserRole
					visibilityControls={ visibilityControls }
					setVisibilityControls={ setVisibilityControls }
					{ ...props }
				/>
				<Slot name="VisibilityControlsMiddle" />
			</div>
			<Integrations
				visibilityControls={ visibilityControls }
				setVisibilityControls={ setVisibilityControls }
				hasUpdates={ hasUpdates }
				setHasUpdates={ setHasUpdates }
				{ ...props }
			/>
			<Slot name="VisibilityControlsBottom" />
			<AdditionalControls
				visibilityControls={ visibilityControls }
				setVisibilityControls={ setVisibilityControls }
				{ ...props }
			/>
		</div>
	);
}
