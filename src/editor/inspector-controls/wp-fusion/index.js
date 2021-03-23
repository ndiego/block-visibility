/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleControl, Slot } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { isControlSettingEnabled } from './../../utils/setting-utilities';

/**
 * Add the screen size vsibility controls
 * (Could use refactoring)
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function WPFusion( props ) {
	const { settings, enabledControls, controlSetAtts, setControlAtts } = props;
	const controlEnabled = enabledControls.includes( 'wp_fusion' );
	const controlToggledOn =
		controlSetAtts?.controls.hasOwnProperty( 'wpFusion' ) ?? false;

	if ( ! controlEnabled || ! controlToggledOn ) {
		return null;
	}

	const screenSize = controlSetAtts?.controls?.screenSize ?? {};
	const hideOnScreenSize = screenSize?.hideOnScreenSize ?? {};

	const enableAdvancedControls = isControlSettingEnabled(
		settings,
		'screen_size',
		'enable_advanced_controls',
		false // Default to false if there are no saved settings.
	);

	// Get the screen size control settings.
	const controls = settings?.visibility_controls?.screen_size?.controls ?? {
		extraLarge: true,
		large: true,
		medium: true,
		small: true,
		extraSmall: true,
	};

	const setAttribute = ( attribute, value ) =>
		setControlAtts(
			'wpFusion',
			assign(
				{ ...screenSize },
				{
					hideOnScreenSize: assign(
						{ ...hideOnScreenSize },
						{ [ attribute ]: value }
					),
				}
			)
		);

	return (
		<div className="visibility-control__group wp-fusion-control">
			<h3 className="visibility-control__group-heading">
				{ __( 'WP Fusion', 'block-visibility' ) }
			</h3>
			<Slot name="WPFusionControls" />
		</div>
	);
}
