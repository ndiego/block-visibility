/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Add visual separators between active visibility controls.
 *
 * @since 1.7.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ControlSeparator( props ) {
	const { control, controlSetAtts, enabledControls } = props;
	const controls = controlSetAtts?.controls ?? null;

	if ( ! controls ) {
		return null;
	}

	let controlOrder = [];

	enabledControls.forEach( ( control ) => {
		controlOrder.push( control.attributeSlug );
	} );

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
