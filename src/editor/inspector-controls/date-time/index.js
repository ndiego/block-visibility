/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { isControlSettingEnabled } from './../../utils/setting-utilities';
import { hideControlSection } from './../utils/hide-control-section';
import Scheduling from './scheduling';

/**
 * Add the date/time vsibility controls
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function DateTime( props ) {
	const { settings, attributes, enabledControls } = props;
	const { blockVisibility } = attributes;

	const sectionHidden = hideControlSection(
		enabledControls,
		blockVisibility,
		'date_time'
	);

	if ( sectionHidden ) {
		return null;
	}

	const enableScheduling = isControlSettingEnabled(
		settings,
		'date_time',
		'enable_scheduling'
	);

	return (
		<div className="visibility-control__group date-time">
			<h3 className="visibility-control__group-heading">
				{ __( 'Date & Time', 'block-visibility' ) }
			</h3>
			{ enableScheduling && <Scheduling { ...props } /> }
			<Slot name="DateTimeControls" />
		</div>
	);
}
