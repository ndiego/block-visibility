/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { ToggleControl, withFilters } from '@wordpress/components';

/**
 * Internal dependencies
 */
import SaveSettings from './utils/save-settings';
import InformationPopover from './utils/information-popover';

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
	const { handleSettingsChange, isAPISaving, hasSaveError } = props;

	function onSettingsChange() {
		handleSettingsChange( 'visibility_controls', visibilityControls );
		setHasUpdates( false );
	}

	function onVisibilityControlChange( option, subOption, newSetting ) {
		setVisibilityControls( {
			...visibilityControls,
			[ option ]: {
				...visibilityControls[ option ],
				[ subOption ]: newSetting,
			},
		} );
		setHasUpdates( true );
	}

	// Manually set defaults, this ensures the main settings function properly
	const hideBlockEnable = visibilityControls?.hide_block?.enable ?? true; // eslint-disable-line
	const visibilityByRoleEnable = visibilityControls?.visibility_by_role?.enable ?? true; // eslint-disable-line
	const visibilityByRoleEnableUseRoles = visibilityControls?.visibility_by_role?.enable_user_roles ?? true; // eslint-disable-line
	const timeDateEnable = visibilityControls?.time_date?.enable ?? true; // eslint-disable-line

	return (
		<div className="setting-tabs__visibility-controls inner-container">
			<div className="setting-tabs__tab-description">
				<div className="tab-description__header">
					<h2>{ __( 'Visibility Controls', 'block-visibility' ) }</h2>
					<span>
						<InformationPopover
							message={ __(
								'When a visibility control is disabled, blocks that relied on the disabled control will become visible again. Likely this is what you intended, but we wanted to provide this warning just in case.',
								'block-visibility'
							) }
							subMessage={ __(
								'To learn more about Visibility Controls, review the plugin documentation using the link below.',
								'block-visibility'
							) }
							link="https://www.blockvisibilitywp.com/documentation/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
						/>
					</span>
				</div>
				<p>
					{ __(
						'The settings below allow you to configure the visibility controls that power this plugin. Pick and choose which controls you would like to enable and how you would like them to function.',
						'block-visibility'
					) }
				</p>
			</div>
			<div className="setting-tabs__setting-controls">
				<span className="setting-controls__title">
					{ __( 'Configure Controls', 'block-visibility' ) }
				</span>
				<SaveSettings
					isAPISaving={ isAPISaving }
					hasSaveError={ hasSaveError }
					hasUpdates={ hasUpdates }
					onSettingsChange={ onSettingsChange }
				/>
			</div>
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
				<div className="settings-panel__row">
					<ToggleControl
						label={ __(
							'Enable the ability to hide blocks completely from the frontend of your website.',
							'block-visibility'
						) }
						checked={ hideBlockEnable }
						onChange={ () =>
							onVisibilityControlChange(
								'hide_block',
								'enable',
								! hideBlockEnable
							)
						}
					/>
				</div>
			</div>
			<div className="setting-tabs__settings-panel">
				<div className="settings-panel__header">
					<span className="settings-panel__header-title">
						{ __( 'Visibility by User Role', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __(
							'To learn more about the Visibility by User Role control, review the plugin documentation using the link below.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/documentation/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __(
							'Enable the ability to restrict block visibility by whether a user is logged-in or logged-out.',
							'block-visibility'
						) }
						checked={ visibilityByRoleEnable }
						onChange={ () =>
							onVisibilityControlChange(
								'visibility_by_role',
								'enable',
								! visibilityByRoleEnable
							)
						}
					/>
					{ visibilityByRoleEnable && (
						<ToggleControl
							className="settings-panel__row-subsetting"
							label={ __(
								'Enable the ability to restrict block visibility by individual user role (Administrator, Editor, Subscriber, etc.)',
								'block-visibility'
							) }
							checked={ visibilityByRoleEnableUseRoles }
							onChange={ () =>
								onVisibilityControlChange(
									'visibility_by_role',
									'enable_user_roles',
									! visibilityByRoleEnableUseRoles
								)
							}
						/>
					) }
				</div>
			</div>
			<div className="setting-tabs__settings-panel">
				<div className="settings-panel__header">
					<span className="settings-panel__header-title">
						{ __( 'Time & Date', 'block-visibility' ) }
					</span>
					<InformationPopover
						message={ __(
							'To learn more about the Time & Date control, review the plugin documentation using the link below.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/documentation/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<div className="settings-panel__row">
					<ToggleControl
						label={ __(
							'Enable the ability to restrict block visibility based on time and date settings.',
							'block-visibility'
						) }
						checked={ timeDateEnable }
						onChange={ () =>
							onVisibilityControlChange(
								'time_date',
								'enable',
								! timeDateEnable
							)
						}
					/>
				</div>
			</div>
			<AdditionalVisibilityControls
				visibilityControls={ visibilityControls }
				setVisibilityControls={ setVisibilityControls }
				setHasUpdates={ setHasUpdates }
				{ ...props }
			/>
		</div>
	);
}

let AdditionalVisibilityControls = ( props ) => <></>; // eslint-disable-line
AdditionalVisibilityControls = withFilters(
	'blockVisibility.AdditionalVisibilityControls'
)( AdditionalVisibilityControls );
