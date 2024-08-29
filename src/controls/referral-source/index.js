/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ExternalLink,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { InformationPopover } from './../../components';
import links from './../../utils/links';

/**
 * Add the Referral Source controls
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function ReferralSource( props ) {
	const { enabledControls, controlSetAtts, setControlAtts, settings } = props;
	const controlActive = enabledControls.some(
		( control ) =>
			control.settingSlug === 'referral_source' && control?.isActive
	);

	if ( ! controlActive ) {
		return null;
	}

	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;
	const referralSource = controlSetAtts?.controls?.referralSource ?? {};
	const contains = referralSource?.contains ?? '';
	const doesNotContain = referralSource?.doesNotContain ?? '';
	const showIfNoReferral = referralSource?.showIfNoReferral ?? '';

	const setAttribute = ( attribute, value ) =>
		setControlAtts(
			'referralSource',
			assign(
				{ ...referralSource },
				{
					[ attribute ]: value,
				}
			)
		);

	return (
		<div className="controls-panel-item referral-source-control">
			<h3 className="controls-panel-item__header has-icon">
				<span>{ __( 'Referral Source', 'block-visibility' ) }</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							'The Referral Source control allows you to configure block visibility based on the referral source URL. Restrict visibility by specific domains, complete URLs, or URL fragments.',
							'block-visibility'
						) }
						link={ links.editor.referralSource }
						position="bottom center"
					/>
				) }
			</h3>
			{ enableNotices && (
				<div className="controls-panel-item__description">
					{ __(
						'Enter one domain, complete URL, or URL fragment per line.',
						'block-visibility'
					) }
				</div>
			) }
			<div className="controls-panel-item__fields">
				<TextareaControl
					label={ createInterpolateElement(
						__(
							'Referral URL <span>(Contains)</span>',
							'block-visibility'
						),
						{
							span: (
								<span className="components-base-control__label-hint" />
							),
						}
					) }
					help={
						enableNotices &&
						__(
							'Show the block if the referral URL contains at least one of the provided values.',
							'block-visibility'
						)
					}
					value={ contains }
					onChange={ ( value ) => setAttribute( 'contains', value ) }
					rows="2"
				/>
				<TextareaControl
					label={ createInterpolateElement(
						__(
							'Referral URL <span>(Does Not Contain)</span>',
							'block-visibility'
						),
						{
							span: (
								<span className="components-base-control__label-hint" />
							),
						}
					) }
					help={
						enableNotices &&
						__(
							'Hide the block if the referral URL contains at least one of the provided values.',
							'block-visibility'
						)
					}
					value={ doesNotContain }
					onChange={ ( value ) =>
						setAttribute( 'doesNotContain', value )
					}
					rows="2"
				/>
				<ToggleControl
					label={ __(
						'Show if no referral URL',
						'block-visibility'
					) }
					help={
						enableNotices &&
						createInterpolateElement(
							__(
								'Show the block when no referral URL is present. <a>Learn more</a>',
								'block-visibility'
							),
							{
							a: <ExternalLink href={ links.editor.referralSource } />, // eslint-disable-line
							}
						)
					}
					checked={ showIfNoReferral }
					onChange={ () => {
						setAttribute( 'showIfNoReferral', ! showIfNoReferral );
					} }
				/>
			</div>
		</div>
	);
}
