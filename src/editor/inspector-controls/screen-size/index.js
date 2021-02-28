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
import { hideControlSection } from './../utils/hide-control-section';

/**
 * Add the screen size vsibility controls
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ScreenSize( props ) {
	const { settings, attributes, setAttributes, enabledControls } = props;
	const { blockVisibility } = attributes;

	const sectionHidden = hideControlSection(
		enabledControls,
		blockVisibility,
		'screen_size'
	);

	if ( sectionHidden ) {
		return null;
	}

	const enableAdvancedControls = isControlSettingEnabled(
		settings,
		'screen_size',
		'enable_advanced_controls',
		false // Default to false if there are no saved settings.
	);

	// Set default attributes if needed.
	const screenSize = blockVisibility?.hideOnScreenSize ?? {
		extraLarge: false,
		large: false,
		medium: false,
		small: false,
		extraSmall: false,
	};

	// Get the screen size control settings.
	const controls = settings?.visibility_controls?.screen_size?.controls ?? {
		extraLarge: true,
		large: true,
		medium: true,
		small: true,
		extraSmall: true,
	};

	const setAttribute = ( attribute, value ) =>
		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{
					hideOnScreenSize: assign(
						{ ...screenSize },
						{ [ attribute ]: value }
					),
				}
			),
		} );

	return (
		<div className="visibility-control__group screen-size">
			<h3 className="visibility-control__group-heading">
				{ __( 'Screen Size', 'block-visibility' ) }
			</h3>
			{ enableAdvancedControls && controls.extra_large && (
				<ToggleControl
					label={ __( 'Hide on large desktop', 'block-visibility' ) }
					checked={ screenSize.extraLarge }
					onChange={ () => {
						setAttribute( 'extraLarge', ! screenSize.extraLarge );
					} }
				/>
			) }
			{ controls.large && (
				<ToggleControl
					label={ __( 'Hide on desktop', 'block-visibility' ) }
					checked={ screenSize.large }
					onChange={ () => {
						setAttribute( 'large', ! screenSize.large );
					} }
				/>
			) }
			{ controls.medium && (
				<ToggleControl
					label={ __( 'Hide on tablet', 'block-visibility' ) }
					checked={ screenSize.medium }
					onChange={ () => {
						setAttribute( 'medium', ! screenSize.medium );
					} }
				/>
			) }
			{ controls.small && (
				<ToggleControl
					label={ [
						! enableAdvancedControls && 'Hide on mobile',
						enableAdvancedControls && 'Hide on mobile (landscape)',
					] }
					checked={ screenSize.small }
					onChange={ () => {
						setAttribute( 'small', ! screenSize.small );
					} }
				/>
			) }
			{ enableAdvancedControls && controls.extra_small && (
				<ToggleControl
					label={ __(
						'Hide on mobile (portrait)',
						'block-visibility'
					) }
					checked={ screenSize.extraSmall }
					onChange={ () => {
						setAttribute( 'extraSmall', ! screenSize.extraSmall );
					} }
				/>
			) }
			<Slot name="ScreenSizeControls" />
		</div>
	);
}
