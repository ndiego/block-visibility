/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import InformationPopover from './../../../utils/components/information-popover';

/**
 * Renders the date/time control settings.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function DateTime( props ) {
	const { visibilityControls, setVisibilityControls } = props;

	// Manually set defaults, this ensures the main settings function properly
	const enable = visibilityControls?.date_time?.enable ?? true; // eslint-disable-line

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
							'The Date & Time control allows you to conditionally display blocks based on time and date settings, which includes the ability to schedule blocks. Visit the plugin Knowledge Base for more information.',
							'block-visibility'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-date-time-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
					/>
				</div>
				<Slot name="DateTimeControls" />
			</div>
		</div>
	);
}
