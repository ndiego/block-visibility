/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Disabled, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { isControlSettingEnabled } from './../../utils/setting-utilities';
import NoticeBlockNotCompatible from './notices-tips';

/**
 * Add the screen size vsibility controls
 * (Could use refactoring)
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ScreenSize( props ) {
	const {
		name,
		settings,
		enabledControls,
		controlSetAtts,
		setControlAtts,
	} = props;

	const controlEnabled = enabledControls.some(
		( control ) => control.settingSlug === 'screen_size'
	);
	const controlToggledOn =
		controlSetAtts?.controls.hasOwnProperty( 'screenSize' ) ?? false;

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
			'screenSize',
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

	// Set default attributes if needed.
	const extraLarge = hideOnScreenSize?.extraLarge ?? false;
	const large = hideOnScreenSize?.large ?? false;
	const medium = hideOnScreenSize?.medium ?? false;
	const small = hideOnScreenSize?.small ?? false;
	const extraSmall = hideOnScreenSize?.extraSmall ?? false;

	let allScreenSizeFields = (
		<>
			{ enableAdvancedControls && controls.extra_large && (
				<ToggleControl
					label={ __( 'Hide on large desktop', 'block-visibility' ) }
					checked={ extraLarge }
					onChange={ () => {
						setAttribute( 'extraLarge', ! extraLarge );
					} }
				/>
			) }
			{ controls.large && (
				<ToggleControl
					label={ __( 'Hide on desktop', 'block-visibility' ) }
					checked={ large }
					onChange={ () => {
						setAttribute( 'large', ! large );
					} }
				/>
			) }
			{ controls.medium && (
				<ToggleControl
					label={ __( 'Hide on tablet', 'block-visibility' ) }
					checked={ medium }
					onChange={ () => {
						setAttribute( 'medium', ! medium );
					} }
				/>
			) }
			{ controls.small && (
				<ToggleControl
					label={ [
						! enableAdvancedControls &&
							__( 'Hide on mobile', 'block-visibility' ),
						enableAdvancedControls &&
							__(
								'Hide on mobile (landscape)',
								'block-visibility'
							),
					] }
					checked={ small }
					onChange={ () => {
						setAttribute( 'small', ! small );
					} }
				/>
			) }
			{ enableAdvancedControls && controls.extra_small && (
				<ToggleControl
					label={ __(
						'Hide on mobile (portrait)',
						'block-visibility'
					) }
					checked={ extraSmall }
					onChange={ () => {
						setAttribute( 'extraSmall', ! extraSmall );
					} }
				/>
			) }
		</>
	);

	if ( name === 'core/shortcode' ) {
		allScreenSizeFields = <Disabled>{ allScreenSizeFields }</Disabled>;
	}

	return (
		<>
			<div className="visibility-control__group screen-size-control">
				<h3 className="visibility-control__group-heading">
					{ __( 'Screen Size', 'block-visibility' ) }
				</h3>
				{ allScreenSizeFields }
				{ name === 'core/shortcode' && <NoticeBlockNotCompatible /> }
			</div>
			<div className="control-separator">
				<span>{ __( 'AND', 'block-visibility' ) }</span>
			</div>
		</>
	);
}
