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
import links from './../../utils/links';
import { InformationPopover } from './../../components';

/**
 * Add the Query String controls
 *
 * @since 1.7.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function QueryString( props ) {
	const { enabledControls, controlSetAtts, setControlAtts, settings } = props;
	const controlActive = enabledControls.some(
		( control ) =>
			control.settingSlug === 'query_string' && control.isActive
	);

	if ( ! controlActive ) {
		return null;
	}

	const queryString = controlSetAtts?.controls?.queryString ?? {};
	const queryStringAny = queryString?.queryStringAny ?? '';
	const queryStringAll = queryString?.queryStringAll ?? '';
	const queryStringNot = queryString?.queryStringNot ?? '';
	const enableNotices =
		settings?.plugin_settings?.enable_editor_notices ?? true;

	const setAttribute = ( attribute, value ) =>
		setControlAtts(
			'queryString',
			assign(
				{ ...queryString },
				{
					[ attribute ]: value,
				}
			)
		);

	return (
		<div className="controls-panel-item query-string-control">
			<h3 className="controls-panel-item__header has-icon">
				<span>{ __( 'Query String', 'block-visibility' ) }</span>
				{ enableNotices && (
					<InformationPopover
						message={ __(
							'The Query String control allows you to configure block visibility based on URL query strings.',
							'block-visibility'
						) }
						link={ links.editorQueryString }
						position="bottom center"
					/>
				) }
			</h3>
			<div className="controls-panel-item__description">
				{ __(
					'Enter one URL query string per line.',
					'block-visibility'
				) }
			</div>
			<div className="controls-panel-item__control-fields">
				<TextareaControl
					label={ createInterpolateElement(
						__(
							'Required Queries <span>(Any)</span>',
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
							'Show the block if at least one of the provided URL query strings is present.',
							'block-visibility'
						)
					}
					value={ queryStringAny }
					onChange={ ( value ) =>
						setAttribute( 'queryStringAny', value )
					}
					rows="2"
				/>
				<TextareaControl
					label={ createInterpolateElement(
						__(
							'Required Queries <span>(All)</span>',
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
						createInterpolateElement(
							__(
								'Show the block if <strong>all</strong> of the provided URL query strings are present.',
								'block-visibility'
							),
							{
								strong: <strong />,
							}
						)
					}
					value={ queryStringAll }
					onChange={ ( value ) =>
						setAttribute( 'queryStringAll', value )
					}
					rows="2"
				/>
				<TextareaControl
					label={ createInterpolateElement(
						__(
							'Required Queries <span>(Not)</span>',
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
							'Hide the block if at least one of the provided URL query strings is present.',
							'block-visibility'
						)
					}
					value={ queryStringNot }
					onChange={ ( value ) =>
						setAttribute( 'queryStringNot', value )
					}
					rows="2"
				/>
			</div>
		</div>
	);
}
