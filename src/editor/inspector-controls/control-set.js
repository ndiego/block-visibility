/**
 * External dependencies
 */
import { assign, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { Slot, withFilters } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ControlSetToolbar from './control-set-toolbar';
import UserRole from './user-role';
import DateTime from './date-time';
import ScreenSize from './screen-size';
import QueryString from './query-string';
import ACF from './acf';
import WPFusion from './wp-fusion';
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
		controlSetAtts,
		setControlSetAtts,
		enabledControls,
		variables,
	} = props;
	const settingsUrl = variables?.plugin_variables?.settings_url ?? '';

	const noControls =
		enabledControls.length === 1 &&
		enabledControls.some(
			( control ) => control.settingSlug === 'hide_block'
		);

	if ( noControls ) {
		return null;
	}

	const controls = [];

	enabledControls.forEach( ( control ) => {
		// We don't want to include the hide block control.
		if ( control.settingSlug !== 'hide_block' ) {
			controls.push( {
				label: control.label,
				type: control.type,
				attributeSlug: control.attributeSlug,
				settingSlug: control.settingSlug,
				icon: control?.icon ?? false,
				active: controlSetAtts?.controls.hasOwnProperty(
					control.attributeSlug
				),
			} );
		}
	} );

	// setControls are all saved controls on the block, but a block can have
	// saved settings from controls that have since been disabled.
	const setControls = Object.keys( controlSetAtts.controls );
	const activeControls = controls.filter( ( control ) => {
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

	return (
		<div className="control-set">
			<ControlSetToolbar
				controls={ controls }
				setControlSetAtts={ setControlSetAtts }
				{ ...props }
			/>

			<Slot name="ControlSetControlsTop" />

			<DateTime setControlAtts={ setControlAtts } { ...props } />
			<UserRole setControlAtts={ setControlAtts } { ...props } />
			<ScreenSize setControlAtts={ setControlAtts } { ...props } />
			<QueryString setControlAtts={ setControlAtts } { ...props } />

			<Slot name="ControlSetControlsMiddle" />

			<ACF setControlAtts={ setControlAtts } { ...props } />
			<WPFusion setControlAtts={ setControlAtts } { ...props } />

			<Slot name="ControlSetControlsBottom" />

			<AdditionalControlSetControls
				setControlAtts={ setControlAtts }
				{ ...props }
			/>
			{ ! noControls && isEmpty( activeControls ) && (
				<NoticeBlockControlsDisabled settingsUrl={ settingsUrl } />
			) }
		</div>
	);
}
