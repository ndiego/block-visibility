/**
 * External dependencies
 */
import { assign, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { Disabled, Slot, withFilters } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ControlSetHeader from './control-set-header';
import UserRole from './../../controls/user-role';
import DateTime from './../../controls/date-time';
import ScreenSize from './../../controls/screen-size';
import QueryString from './../../controls/query-string';
import ACF from './../../controls/acf';
import WPFusion from './../../controls/wp-fusion';
import { NoticeBlockControlsDisabled } from './utils/notices-tips';

// Provides an entry point to slot in additional settings. Must be placed
// outside of function to avoid unnecessary rerenders.
const AdditionalControlSetControls = withFilters(
	'blockVisibility.addControlSetControls'
)( ( props ) => <></> ); // eslint-disable-line

/**
 * Render a control set
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function ControlSet( props ) {
	const {
		type,
		controlSetAtts,
		setControlSetAtts,
		enabledControls,
		variables,
	} = props;
	const settingsUrl = variables?.plugin_variables?.settings_url ?? '';
	const enable = controlSetAtts?.enable ?? true;

	// There needs to be a unique index for the Slots since we technically have
	// multiple of the same Slot.
	const uniqueIndex =
		type === 'single' ? type : type + '-' + controlSetAtts?.id;

	const noControls =
		enabledControls.length === 1 &&
		enabledControls.some(
			( control ) => control.settingSlug === 'hide_block'
		);

	if ( noControls ) {
		return null;
	}

	const controls = [];

	// enabledControls.forEach( ( control ) => {
	// 	// We don't want to include the hide block control.
	// 	if ( control.settingSlug !== 'hide_block' ) {
	// 	controls.push( {
	// 		active: controlSetAtts?.controls.hasOwnProperty(
	// 			control.attributeSlug
	// 		) || control?.isDefault,
	// 		attributeSlug: control.attributeSlug,
	// 		icon: control?.icon ?? false,
	// 		isDefault: control?.isDefault,
	// 		label: control.label,
	// 		settingSlug: control.settingSlug,
	// 		type: control.type,
	// 	} );
	// 	}
	// } );

	// Append the "active" property to all active controls.
	enabledControls.forEach( ( control ) => {
		if ( 
			controlSetAtts?.controls.hasOwnProperty(
				control.attributeSlug
			) ||
			control?.isDefault
		) {
			control.isActive = true;
		}
	} );
	

	console.log( enabledControls );

	// setControls are all saved controls on the block, but a block can have
	// saved settings from controls that have since been disabled.
	const setControls = Object.keys( controlSetAtts.controls );
	const activeControls = enabledControls.filter( ( control ) => {
		if ( control.active && setControls.includes( control.attributeSlug ) ) {
			return true;
		}
		return false;
	} );

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
			<Slot name={ 'ControlSetControlsTop-' + uniqueIndex } />

			<DateTime setControlAtts={ setControlAtts } { ...props } />
			<UserRole setControlAtts={ setControlAtts } { ...props } />
			<ScreenSize setControlAtts={ setControlAtts } { ...props } />
			<QueryString setControlAtts={ setControlAtts } { ...props } />

			<Slot name={ 'ControlSetControlsMiddle-' + uniqueIndex } />

			<ACF setControlAtts={ setControlAtts } { ...props } />
			<WPFusion setControlAtts={ setControlAtts } { ...props } />

			<Slot name={ 'ControlSetControlsBottom-' + uniqueIndex } />
		</div>
	);

	if ( ! enable ) {
		controlSetControls = <Disabled>{ controlSetControls }</Disabled>;
	}

	return (
		<div className="control-set">
			<ControlSetHeader
				controls={ enabledControls }
				setControlSetAtts={ setControlSetAtts }
				{ ...props }
			/>
			{ controlSetControls }
			<AdditionalControlSetControls
				uniqueIndex={ uniqueIndex }
				setControlAtts={ setControlAtts }
				{ ...props }
			/>
			{ ! noControls && isEmpty( activeControls ) && (
				<NoticeBlockControlsDisabled settingsUrl={ settingsUrl } />
			) }
		</div>
	);
}
