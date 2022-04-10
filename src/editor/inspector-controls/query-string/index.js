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
import InformationPopover from './../../../utils/components/information-popover';

/**
 * Add the Query String controls
 *
 * @since 1.7.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function QueryString( props ) {
	const { enabledControls, controlSetAtts, setControlAtts } = props;
	const controlEnabled = enabledControls.some(
		( control ) => control.settingSlug === 'query_string'
	);
	const controlToggledOn =
		controlSetAtts?.controls.hasOwnProperty( 'queryString' ) ?? false;

	if ( ! controlEnabled || ! controlToggledOn ) {
		return null;
	}

	const queryString = controlSetAtts?.controls?.queryString ?? {};
	const queryStringAny = queryString?.queryStringAny ?? '';
	const queryStringAll = queryString?.queryStringAll ?? '';
	const queryStringNot = queryString?.queryStringNot ?? '';

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
		<>
			<div className="visibility-control__group query-string-control">
				<h3 className="visibility-control__group-heading has-icon">
					<span>{ __( 'Query String', 'block-visibility' ) }</span>
					<InformationPopover
						message={ __(
							'The Query String control allows you to configure block visibility based on URL query strings.',
							'block-visibility-pro'
						) }
						link="https://www.blockvisibilitywp.com/knowledge-base/how-to-use-the-query-string-control/?bv_query=learn_more&utm_source=plugin&utm_medium=settings&utm_campaign=plugin_referrals"
						position="bottom center"
					/>
				</h3>
				<div className="visibility-control__help">
					{ __(
						'Enter one URL query string per line.',
						'block-visibility'
					) }
				</div>
				<TextareaControl
					label={ __( 'Required Queries (Any)', 'block-visibility' ) }
					help={ __(
						'Only visible when least one of the provided URL query strings is present.',
						'block-visibility'
					) }
					value={ queryStringAny }
					onChange={ ( value ) =>
						setAttribute( 'queryStringAny', value )
					}
					rows="2"
				/>
				<TextareaControl
					label={ __( 'Required Queries (All)', 'block-visibility' ) }
					help={ createInterpolateElement(
						__(
							'Only visible when <strong>all</strong> of the provided URL query strings are present.',
							'block-visibility'
						),
						{
							strong: <strong />,
						}
					) }
					value={ queryStringAll }
					onChange={ ( value ) =>
						setAttribute( 'queryStringAll', value )
					}
					rows="2"
				/>
				<TextareaControl
					label={ __( 'Required Queries (Not)', 'block-visibility' ) }
					help={ __(
						'Hide when at least one of the provided URL query strings is present.',
						'block-visibility'
					) }
					value={ queryStringNot }
					onChange={ ( value ) =>
						setAttribute( 'queryStringNot', value )
					}
					rows="2"
				/>
			</div>
			<div className="control-separator">
				<span>{ __( 'AND', 'block-visibility' ) }</span>
			</div>
		</>
	);
}
