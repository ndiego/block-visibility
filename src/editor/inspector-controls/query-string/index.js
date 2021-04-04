/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Popover, Slot, TextareaControl } from '@wordpress/components';
import { createInterpolateElement, useState } from '@wordpress/element';
import { info } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import ControlSeparator from './../utils/control-separator';
import { TipQueryString } from './../utils/notices-tips';

/**
 * Add the Query String controls
 *
 * @since 1.7.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function QueryString( props ) {
	const [ tipsPopoverOpen, setTipsPopoverOpen ] = useState( false );
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
				<h3 className="visibility-control__group-heading">
					{ __( 'Query String', 'block-visibility' ) }
					<Button
						label={ __( 'Query String Tips', 'block-visibility' ) }
						icon={ info }
						className="control-tips"
						onClick={ () =>
							setTipsPopoverOpen( ( open ) => ! open )
						}
						isSmall
					/>
					{ tipsPopoverOpen && (
						<Popover
							className="block-visibility__control-popover tips"
							focusOnMount="container"
							onClose={ () => setTipsPopoverOpen( false ) }
						>
							<TipQueryString />
						</Popover>
					) }
				</h3>
				<div className="visibility-control__help">
					{ __(
						'Enter one URL query string per line.',
						'block-visibility'
					) }
				</div>
				<TextareaControl
					label="Required Queries (Any)"
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
					label="Required Queries (All)"
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
					label="Required Queries (Not)"
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
				<Slot name="QueryStringControls" />
			</div>
			<ControlSeparator control="queryString" { ...props } />
		</>
	);
}
