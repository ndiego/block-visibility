/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Disabled, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import links from './../../../utils/links';
import { InformationPopover } from './../../../components';

/**
 * Renders the date/time control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 */
export default function DateTime( props ) {
	const { visibilityControls, setVisibilityControls } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.date_time?.enable ?? true;
	const enableDOW = visibilityControls?.date_time?.enable_day_of_week ?? true;
	const enableTOD = visibilityControls?.date_time?.enable_time_of_day ?? true;

	let dowControl = (
		<ToggleControl
			label={ __(
				'Enable the Day of Week control.',
				'block-visibility'
			) }
			checked={ enableDOW }
			onChange={ () => {
				setVisibilityControls( {
					...visibilityControls,
					date_time: {
						...visibilityControls.date_time,
						enable_day_of_week: ! enableDOW,
					},
				} );
			} }
		/>
	);

	let todControl = (
		<ToggleControl
			label={ __(
				'Enable the Time of Day control.',
				'block-visibility'
			) }
			checked={ enableTOD }
			onChange={ () => {
				setVisibilityControls( {
					...visibilityControls,
					date_time: {
						...visibilityControls.date_time,
						enable_time_of_day: ! enableTOD,
					},
				} );
			} }
		/>
	);

	if ( ! enable ) {
		dowControl = <Disabled>{ dowControl }</Disabled>;
		todControl = <Disabled>{ todControl }</Disabled>;
	}

	return (
		<div className="settings-panel control-date-time">
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
							setVisibilityControls( {
								...visibilityControls,
								date_time: {
									...visibilityControls.date_time,
									enable: ! enable,
								},
							} );
						} }
					/>
					<InformationPopover
						message={ __(
							'The Date & Time control allows you to conditionally display blocks based on time and date settings, which includes the ability to schedule blocks.',
							'block-visibility'
						) }
						link={ links.settings.dateTime }
					/>
				</div>
				<div className="settings-type__toggle has-info-popover first subsetting">
					{ dowControl }
					<InformationPopover
						message={ __(
							'The Day of Week control adds functionality to the main Date & Time control. It allows you to conditionally display blocks based on specific days of the week within a given schedule.',
							'block-visibility'
						) }
						link={ links.settings.dateTime }
					/>
				</div>
				<div className="settings-type__toggle has-info-popover subsetting">
					{ todControl }
					<InformationPopover
						message={ __(
							'The Time of Day adds functionality to the main Date & Time control. It allows you to conditionally display blocks at specific time intervals on each day of a given schedule.',
							'block-visibility'
						) }
						link={ links.settings.dateTime }
					/>
				</div>
			</div>
		</div>
	);
}
