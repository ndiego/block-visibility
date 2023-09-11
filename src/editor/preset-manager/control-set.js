/**
 * External dependencies
 */
import { assign } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Disabled, Notice, Slot, withFilters } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ControlSetHeader from './control-set-header';
import {
	ACF,
	BrowserDevice,
	Cookie,
	DateTime,
	EDD,
	Location,
	Metadata,
	QueryString,
	ReferralSource,
	ScreenSize,
	UrlPath,
	UserRole,
	WooCommerce,
	WPFusion,
} from './../../controls';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalControlSetControls = withFilters(
	'blockVisibility.addControlSetControls'
 )( ( props ) => <></> ); // eslint-disable-line

/**
 * Render a control set
 *
 * @since 3.0.0
 * @param {Object} props All the props passed to this function
 */
export default function ControlSet( props ) {
	const { index, controlSetAtts, setControlSetAtts, enabledControls } = props;
	const controlSetEnabled = controlSetAtts?.enable ?? true;

	// There needs to be a unique index for the Slots since we technically have
	// multiple of the same Slot.
	const uniqueIndex = 'multiple-' + controlSetAtts?.id;

	if ( enabledControls.length === 0 ) {
		return null;
	}

	// Append the "active" property to all active controls.
	const enabledSetControls = [];

	enabledControls.forEach( ( control ) => {
		enabledSetControls.push( {
			label: control.label,
			type: control.type,
			attributeSlug: control.attributeSlug,
			settingSlug: control.settingSlug,
			icon: control?.icon ?? false,
			isActive: controlSetAtts?.controls?.hasOwnProperty(
				control.attributeSlug
			),
		} );
	} );

	const activeSetControls = enabledSetControls.filter(
		( control ) => control.isActive
	);

	function setControlAtts( control, values ) {
		const newControls = controlSetAtts?.controls ?? {};
		const newControlSetAtts = assign(
			{ ...controlSetAtts },
			{
				controls: assign( { ...newControls }, { [ control ]: values } ),
			}
		);

		setControlSetAtts( newControlSetAtts );
	}

	let controlSetControls = (
		<div className="control-set__controls">
			<BrowserDevice
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<Cookie
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<DateTime
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<Location
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<Metadata
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<QueryString
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<ReferralSource
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<ScreenSize
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<UrlPath
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<UserRole
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>

			<Slot name={ 'ControlSetControls-' + uniqueIndex } />

			<ACF
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<EDD
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<WooCommerce
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>
			<WPFusion
				{ ...props }
				enabledControls={ enabledSetControls }
				setControlAtts={ setControlAtts }
			/>

			<Slot name={ 'ControlSetControlsIntegrations-' + uniqueIndex } />

			{ /* Deprecated in version 3.0.0 */ }
			<Slot name={ 'ControlSetControlsBottom-' + uniqueIndex } />
		</div>
	);

	if ( ! controlSetEnabled ) {
		controlSetControls = <Disabled>{ controlSetControls }</Disabled>;
	}

	return (
		<div className="control-set">
			<ControlSetHeader
				{ ...props }
				key={ index }
				activeSetControls={ activeSetControls }
				enabledSetControls={ enabledSetControls }
				setControlSetAtts={ setControlSetAtts }
			/>
			{ activeSetControls.length > 0 && controlSetControls }
			{ activeSetControls.length === 0 && (
				<Notice status="warning" isDismissible={ false }>
					{ __(
						'Add visibility controls using the plus icon in the toolbar above.',
						'block-visibility'
					) }
				</Notice>
			) }
			<AdditionalControlSetControls
				{ ...props }
				uniqueIndex={ uniqueIndex }
				setControlAtts={ setControlAtts }
				enabledControls={ enabledSetControls }
			/>
		</div>
	);
}
