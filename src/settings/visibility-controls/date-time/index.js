/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Slot, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import links from './../../../utils/links';
import { time } from './../../../utils/icons';
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
	const enable = visibilityControls?.date_time?.enable ?? true; // eslint-disable-line

	return (
		<div className="settings-panel">
			<div className="settings-panel__header">
				<span className="settings-panel__header-title">
					{ __( 'Date & Time', 'block-visibility' ) }
				</span>
			</div>
			<div className="settings-panel__container">
				<Slot name="VisibilityControlsDateTimeTop" />
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
						link={ links.settingsDateTime }
					/>
				</div>
				<Slot name="VisibilityControlsDateTimeBottom" />
			</div>
		</div>
	);
}
