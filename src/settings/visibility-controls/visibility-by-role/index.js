/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, Disabled, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InformationPopover from './../../utils/information-popover';

/**
 * Renders the visibility control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function VisibilityByRole( props ) {
	const { settings, setSettings, setHasUpdates } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = settings?.visibility_by_role?.enable ?? true; // eslint-disable-line
	const enableUserRoles = settings?.visibility_by_role?.enable_user_roles ?? true; // eslint-disable-line

	let enableUserRolesElement = (
		<div className="settings-type__toggle">
			<ToggleControl
				className="settings-panel__container-subsetting"
				label={ __(
					'Enable the ability to restrict block visibility by individual user role (Administrator, Editor, Subscriber, etc.)',
					'block-visibility'
				) }
				checked={ enableUserRoles }
				onChange={ () => {
					setSettings( {
						...settings,
						[ 'visibility_by_role' ]: {
							...settings[ 'visibility_by_role' ],
							[ 'enable_user_roles' ]: ! enableUserRoles,
						},
					} );
					setHasUpdates( true );
				} }
			/>
		</div>
	);

	if ( ! enable ) {
		enableUserRolesElement = (
			<Disabled>{ enableUserRolesElement }</Disabled>
		);
	}

	return (
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
			<div className="settings-panel__container">
				<div className="settings-type__toggle">
					<ToggleControl
						label={ __(
							'Enable the ability to restrict block visibility by whether a user is logged-in or logged-out.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setSettings( {
								...settings,
								[ 'visibility_by_role' ]: {
									...settings[ 'visibility_by_role' ],
									[ 'enable' ]: ! enable,
								},
							} );
							setHasUpdates( true );
						} }
					/>
				</div>
				{ enableUserRolesElement }
				<Slot name="VisibilityByRoleControls"/>
			</div>
		</div>
	);
}
