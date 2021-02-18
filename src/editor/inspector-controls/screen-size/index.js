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
		true // Default to false if there are no saved settings.
	);

	const screenSize = blockVisibility?.screenSize ?? {
		extraLarge: false,
		large: false,
		medium: false,
		small: false,
		extraSmall: false,
	};

	const setAttribute = ( attribute, value ) =>
		setAttributes( {
			blockVisibility: assign(
				{ ...blockVisibility },
				{
					screenSize: assign(
						{ ...screenSize },
						{ [ attribute ]: value }
					),
				}
			),
		} );


	return (
		<div className="visibility-control__group screen-time">
			<h3 className="visibility-control__group-heading">
				{ __( 'Screen Size', 'block-visibility' ) }
			</h3>
			{ enableAdvancedControls && (
				<ToggleControl
					label={ __(
						'Hide on extra large screens',
						'block-visibility'
					) }
					help={ 'Large desktops and displays' }
					checked={ screenSize.extraLarge }
					onChange={ () => {
						setAttribute( 'extraLarge', ! screenSize.extraLarge );
					} }
				/>
			) }
			<ToggleControl
				label={ __( 'Hide on large screens', 'block-visibility' ) }
				help={ 'Desktops and tablets (landscape)' }
				checked={ screenSize.large }
				onChange={ () => {
					setAttribute( 'large', ! screenSize.large );
				} }
			/>
			<ToggleControl
				label={ __( 'Hide on medium screens', 'block-visibility' ) }
				help={ 'Tablets (portrait mode)' }
				checked={ screenSize.medium }
				onChange={ () => {
					setAttribute( 'medium', ! screenSize.medium );
				} }
			/>
			<ToggleControl
				label={ __( 'Hide on small screens', 'block-visibility' ) }
				help={ [
					! enableAdvancedControls && 'Mobile devices',
					enableAdvancedControls && 'Mobile devices (landscape mode)',
				] }
				checked={ screenSize.small }
				onChange={ () => {
					setAttribute( 'small', ! screenSize.small );
				} }
			/>
			{ enableAdvancedControls && (
				<ToggleControl
					label={ __(
						'Hide on extra small screens',
						'block-visibility'
					) }
					help={ 'Mobile devices (portrait mode)' }
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
