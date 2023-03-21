/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { TextareaControl } from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { InformationPopover } from './../../components';
import links from './../../utils/links';

/**
 * Add the URL Path controls
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function UrlPath( props ) {
	const { enabledControls, controlSetAtts, setControlAtts, settings } = props;
	const controlActive = enabledControls.some(
		( control ) => control.settingSlug === 'url_path' && control?.isActive
	);

	if ( ! controlActive ) {
		return null;
	}

	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;
	const urlPath = controlSetAtts?.controls?.urlPath ?? {};
	const contains = urlPath?.contains ?? '';
	const doesNotContain = urlPath?.doesNotContain ?? '';

	const setAttribute = ( attribute, value ) =>
		setControlAtts(
			'urlPath',
			assign(
				{ ...urlPath },
				{
					[ attribute ]: value,
				}
			)
		);

	return (
		<div className="controls-panel-item url-path-control">
			<h3 className="controls-panel-item__header has-icon">
				<span>{ __( 'URL Path', 'block-visibility' ) }</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							"The URL Path control allows you to configure block visibility based on the URL of the page that it's located on.",
							'block-visibility'
						) }
						link={ links.editorUrlPath }
						position="bottom center"
					/>
				) }
			</h3>
			<div className="controls-panel-item__description">
				{ __( 'Enter one URL path per line.', 'block-visibility' ) }
			</div>
			<div className="controls-panel-item__fields">
				<TextareaControl
					label={ createInterpolateElement(
						__(
							'URL Path <span>(Contains)</span>',
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
							'Only visible when the current URL contains at least one of the provided paths.',
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
							'URL Path <span>(Does Not Contain)</span>',
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
							'Hide when the current URL contains at least one of the provided paths.',
							'block-visibility'
						)
					}
					value={ doesNotContain }
					onChange={ ( value ) =>
						setAttribute( 'doesNotContain', value )
					}
					rows="2"
				/>
			</div>
		</div>
	);
}
