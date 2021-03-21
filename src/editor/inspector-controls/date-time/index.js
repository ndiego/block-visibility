/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { isControlSettingEnabled } from './../../utils/setting-utilities';
import Scheduling from './scheduling';

/**
 * Add the date/time vsibility controls
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function DateTime( props ) {
	const { settings, enabledControls, controlSetAtts } = props;
	const controlEnabled = enabledControls.includes( 'date_time' );
	const controlToggledOn =
		controlSetAtts?.controls.hasOwnProperty( 'dateTime' ) ?? false;

	if ( ! controlEnabled || ! controlToggledOn ) {
		return null;
	}

	const dateTime = controlSetAtts?.controls?.dateTime ?? {};

	const enableScheduling = isControlSettingEnabled(
		settings,
		'date_time',
		'enable_scheduling'
	);

	return (
		<div className="visibility-control__group date-time-control">
			<h3 className="visibility-control__group-heading">
				{ __( 'Date & Time', 'block-visibility' ) }
			</h3>
			{ enableScheduling && (
				<Scheduling dateTime={ dateTime } { ...props } />
			) }
			<Slot name="DateTimeControls" />
		</div>
	);
}
