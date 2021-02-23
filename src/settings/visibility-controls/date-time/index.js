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
 * Renders the date/time control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function DateTime( props ) {
	const { settings, setSettings, setHasUpdates } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = settings?.date_time?.enable ?? true; // eslint-disable-line
	const enableScheduling = settings?.date_time?.enable_scheduling ?? true; // eslint-disable-line

	let schedulingControl = (
		<ToggleControl
			label={ __( 'Enable block scheduling.', 'block-visibility' ) }
			checked={ enableScheduling }
			onChange={ () => {
				setSettings( {
					...settings,
					date_time: {
						...settings.date_time,
						enable_scheduling: ! enableScheduling,
					},
				} );
				setHasUpdates( true );
			} }
		/>
	);

	if ( ! enable ) {
		schedulingControl = <Disabled>{ schedulingControl }</Disabled>;
	}

	return (
		<div className="setting-tabs__settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Date & Time', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<div className="settings-type__toggle has-info-popover">
					<ToggleControl
						label={ __(
							'Enable the Date & Time controls.',
							'block-visibility'
						) }
						checked={ enable }
						onChange={ () => {
							setSettings( {
								...settings,
								date_time: {
									...settings.date_time,
									enable: ! enable,
								},
							} );
							setHasUpdates( true );
						} }
					/>
					<InformationPopover
						message={ __(
							'Date & Time controls allow you hide blocks based on time and date settings, which includes the ability to schedule the visibility of blocks.',
							'block-visibility'
						) }
						subMessage={ __(
							'To learn more about the Date & Time controls, review the plugin documentation using the link below.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<hr />
				<div className="settings-type__toggle first has-info-popover subsetting">
					{ schedulingControl }
					<InformationPopover
						message={ __(
							'Block scheduling allows you to restrict block visibility based on a start and end date/time.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/visibility-controls/?utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<Slot name="DateTimeControls" />
			</div>
		</div>
	);
}
