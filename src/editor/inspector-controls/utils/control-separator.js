/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Add the date/time vsibility controls
 *
 * @since 1.1.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ControlSeparator( props ) {
	const { controlSetAtts, control } = props;
	const controls = controlSetAtts?.controls ?? null;

	if ( ! controls ) {
		return null;
	}

	const controlOrder = [
		'dateTime',
		'userRole',
		'screenSize',
		'queryString',
		// Add additional controls here.

		// integrations
		'wpFusion',
	];

	const activeControls = controlOrder.filter( ( _control ) =>
		controls.hasOwnProperty( _control )
	);

	if (
		! activeControls.includes( control ) || // The current control is not enabled.
		activeControls.length === 1 || // There is only one control toggled.
		activeControls[ activeControls.length - 1 ] === control // The control is in last place.
	) {
		return null;
	}

	return (
		<div className="control-separator">
			<span>{ __( 'AND', 'block-visibility' ) }</span>
		</div>
	);
}
