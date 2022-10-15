/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Disabled,
	ExternalLink,
	Notice,
	ToggleControl,
} from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';
/**
 * Internal dependencies
 */
import isControlSettingEnabled from './../utils/is-control-setting-enabled';
import InformationPopover from './../../utils/components/information-popover';

/**
 * Add the screen size vsibility controls
 * (Could use refactoring)
 *
 * @since 1.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ScreenSize( props ) {
	const { name, settings, enabledControls, controlSetAtts, setControlAtts } =
		props;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'screen_size' && control.isActive
	);

	if ( ! controlActive ) {
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

	const isNotCompatible = name === 'core/shortcode' || name === 'core/html';

	if ( isNotCompatible ) {
		allScreenSizeFields = <Disabled>{ allScreenSizeFields }</Disabled>;
	}

	return (
		<>
			<div className="control-panel-item screen-size-control">
				<h3 className="control-panel-item-header has-icon">
					<span>{ __( 'Screen Size', 'block-visibility' ) }</span>
					<InformationPopover
						message={ __(
							'The Screen Size control allows you to conditionally display the block based on the width of the current screen.',
							'block-visibility'
						) }
						link="https://blockvisibilitywp.com/knowledge-base/how-to-use-the-screen-size-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
						position="bottom center"
					/>
				</h3>
				{ allScreenSizeFields }
				{ isNotCompatible && (
					<Notice status="warning" isDismissible={ false }>
						{ createInterpolateElement(
							__(
								'The Screen Size control is unfortunately not compatible with this block type. For more information, and a workaround, visit the <a>Knowledge Base</a>.',
								'block-visibility'
							),
							{
								a: (
            						<ExternalLink // eslint-disable-line
										href={
											'https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-screen-size-control/?bv_query=learn_more&utm_source=plugin&utm_medium=editor&utm_campaign=plugin_referrals#limitations'
										}
										target="_blank"
										rel="noreferrer"
									/>
								),
							}
						) }
					</Notice>
				) }
			</div>
		</>
	);
}
