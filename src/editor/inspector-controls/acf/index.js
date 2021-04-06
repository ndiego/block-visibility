/**
 * External dependencies
 */
import { assign } from 'lodash';
import Select from 'react-select';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Disabled, Notice, Popover, SelectControl, Slot, TextControl } from '@wordpress/components';
import { Icon, info } from '@wordpress/icons';
import { createInterpolateElement, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import icons from './../../../utils/icons';
import ControlSeparator from './../utils/control-separator';
import { TipWPFusion } from './../utils/notices-tips';

/**
 * Add the Wp Fusion controls
 *
 * @since 1.7.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ACF( props ) {
	const [ tipsPopoverOpen, setTipsPopoverOpen ] = useState( false );
	const {
		variables,
		enabledControls,
		controlSetAtts,
		setControlAtts,
	} = props;
	const pluginActive = variables?.integrations?.acf?.active ?? false;
	const controlEnabled = enabledControls.some(
		( control ) => control.settingSlug === 'acf'
	);
	const controlToggledOn =
		controlSetAtts?.controls.hasOwnProperty( 'acf' ) ?? false;

	if ( ! controlEnabled || ! controlToggledOn || ! pluginActive ) {
		return null;
	}

	const availableFields = variables?.integrations?.acf?.fields ?? [];

	console.log( availableFields );

	const conditions = [
		{
			value: '!=empty',
			label: __( 'Has any value', 'block-visibility' )
		},
		{
			 value: '==empty',
			 label: __( 'Has no value', 'block-visibility' )
		 },
		{
			value: '==',
			label: __( 'Value is equal to', 'block-visibility' )
		},
		{
			value: '!=',
			label: __( 'Value is not equal to', 'block-visibility' )
		},
		{
			value: '==contains',
			label: __( "Value contains", 'block-visibility' )
		},
		{
			value: '!=contains',
			label: __( "Value does not contain", 'block-visibility' )
		},
	];

	const handleOnChange = ( attribute, tags ) => {
		const newTags = [];

		if ( tags.length !== 0 ) {
			tags.forEach( ( tag ) => {
				newTags.push( tag.value );
			} );
		}

		setControlAtts(
			'acf',
			assign( { ...wpFusion }, { [ attribute ]: newTags } )
		);
	};
	return (
		<>
			<div className="visibility-control__group acf-control">
				<h3 className="visibility-control__group-heading has-icon">
					<span>
						{ __( 'Advanced Custom Fields', 'block-visibility' ) }
						<Button
							label={ __( 'ACF Tips', 'block-visibility' ) }
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
								<TipWPFusion { ...props } />
							</Popover>
						) }
					</span>
					<Icon icon={ icons.acf } />
				</h3>
				Some content here
				<div>
					<SelectControl
						options={ [
							{ value: null, label: 'Select a User', disabled: true },
							{ value: 'a', label: 'User A' },
							{ value: 'b', label: 'User B' },
							{ value: 'c', label: 'User c' },
						] }
					/>
					<Select
						className="block-visibility__react-select"
						classNamePrefix="react-select"
						options={ conditions }
						//value={ selectedRoles }
						//onChange={ ( value ) => handleOnChange( value ) }
					/>
				</div>


				<TextControl />
			</div>
			<ControlSeparator control="acf" { ...props } />
		</>
	);
}
